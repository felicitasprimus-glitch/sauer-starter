"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getStarterFeedingStatus, formatTimeAgo } from "@/lib/feedingStatus";

const TIPPS = [
  "Dein Starter riecht leicht nach Essig? Dann hat er Hunger - fuettere ihn 1:5:5 und stell ihn warm.",
  "Ein warmer Ort (24-26 Grad) zaubert deinem Starter neue Kraft.",
  "Blasen an der Oberflaeche sind ein gutes Zeichen - dein Starter ist aktiv.",
  "Zum Backen den Starter 4-6 Std vorher zur Hochform fuettern.",
  "Fluessigkeit oben (Hooch)? Einfach abgiessen und normal weiterfuettern.",
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 11) return { text: "Guten Morgen", emoji: "☀️" };
  if (h < 18) return { text: "Guten Tag", emoji: "🌤️" };
  return { text: "Guten Abend", emoji: "🌙" };
}

function pillStyle(color) {
  if (color === "okay" || color === "soon") return { bg: "#EAF3EA", fg: "#5E7E58" };
  if (color === "warning") return { bg: "#FBEEDF", fg: "#B07A36" };
  if (color === "danger") return { bg: "#F7E3E1", fg: "#B0524A" };
  return { bg: "#F1EAEF", fg: "#9A8290" };
}

function pillText(status) {
  if (!status) return "";
  if (status.hasNeverBeenFed) return "Noch nie gefuettert";
  if (status.isOverdue) return "Dringend fuettern";
  if (status.isDue) return "Hat Hunger";
  if (status.isComingUp) return "Bald fuettern";
  if (status.inFridge) return "Im Kuehlschrank";
  return "Aktiv & blubbert";
}

function jarImage(status) {
  const c = status && status.statusColor;
  if (c === "warning" || c === "danger") return "/starter-hungrig.png";
  return "/starter-peak.png";
}

function meterPercent(status) {
  if (!status || status.hoursSinceLastFeeding == null || !status.intervalHours) return 6;
  const p = (status.hoursSinceLastFeeding / status.intervalHours) * 100;
  return Math.min(100, Math.max(6, Math.round(p)));
}

function nextLabel(status) {
  if (!status) return "";
  if (status.hasNeverBeenFed) return "jetzt anfangen";
  if (status.needsAttention) return "jetzt faellig";
  if (status.inFridge) {
    const d = Math.max(0, Math.floor(status.hoursUntilFeed / 24));
    return "in " + d + " Tagen";
  }
  return "in " + Math.max(0, Math.round(status.hoursUntilFeed)) + " Std";
}

export default function DashboardPage() {
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [starters, setStarters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setLoading(false);
      return;
    }
    setUser(userData.user);

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("display_name")
      .eq("id", userData.user.id)
      .single();
    if (profile && profile.display_name) setDisplayName(profile.display_name);

    const { data: starterData } = await supabase
      .from("starters")
      .select("*, feedings(*)")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (starterData) {
      const startersWithSorted = starterData.map((s) => ({
        ...s,
        feedings: (s.feedings || []).sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        ),
      }));
      setStarters(startersWithSorted);
    }

    setLoading(false);
  }

  const startersWithStatus = starters.map((s) => ({
    ...s,
    status: getStarterFeedingStatus(s, s.feedings),
  }));

  const greeting = getGreeting();
  const initial = (displayName || (user && user.email) || "S")
    .trim()
    .charAt(0)
    .toUpperCase();
  const firstName = displayName ? displayName.split(" ")[0] : "";

  const tipp = TIPPS[new Date().getDate() % TIPPS.length];

  return (
    <div className="pb-6">
      {/* HERO */}
      <div
        className="relative -mx-4 -mt-6 mb-5 h-[240px] overflow-hidden"
        style={{ background: "linear-gradient(135deg, #8b6a7d 0%, #5a3f56 100%)" }}
      >
        <img
          src="/starter-hero.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(62,44,57,0.10) 0%, rgba(62,44,57,0.20) 45%, rgba(62,44,57,0.78) 100%)",
          }}
        />
        <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-5 pt-5">
          <span
            className="text-[13px] font-medium text-white/90"
            style={{ textShadow: "0 1px 6px rgba(62,44,57,0.5)" }}
          >
            {greeting.text}
            {firstName ? ", " + firstName : ""} {greeting.emoji}
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/70 bg-altrosa font-display text-base font-bold text-brombeer">
            {initial}
          </div>
        </div>
        <div className="absolute bottom-5 left-5 right-5 z-10">
          <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[3px] text-white/90">
            Sauer · macht · krustig
          </div>
          <h1
            className="font-display text-[30px] font-semibold leading-[1.05] text-white"
            style={{ textShadow: "0 2px 14px rgba(62,44,57,0.45)" }}
          >
            Starter-Werkstatt
          </h1>
          <p
            className="mt-1 text-[13px] text-white/90"
            style={{ textShadow: "0 1px 8px rgba(62,44,57,0.4)" }}
          >
            Deine lebendigen Mitbewohner
          </p>
        </div>
      </div>

      {/* SECTION HEADER */}
      <div className="mb-3.5 px-1">
        <h2 className="font-display text-[21px] font-semibold text-brombeer">
          Deine Starter
        </h2>
      </div>

      {/* LISTE */}
      {loading ? (
        <div className="rounded-[24px] border border-line bg-white p-6 text-center text-sm text-muted shadow-card">
          Laedt ...
        </div>
      ) : startersWithStatus.length === 0 ? (
        <div className="rounded-[24px] border border-line bg-white p-8 text-center shadow-card">
          <p className="text-4xl">🌾</p>
          <h3 className="mt-3 font-display text-2xl font-semibold text-ink">
            Noch kein Starter
          </h3>
          <p className="mt-2 text-sm text-muted">
            Leg deinen ersten Sauerteig-Starter an.
          </p>
          <Link
            href="/starter/new"
            className="mt-5 inline-block rounded-2xl bg-mauve-500 px-6 py-3 text-sm font-semibold text-white"
          >
            Starter anlegen
          </Link>
        </div>
      ) : (
        <div className="space-y-3.5">
          {startersWithStatus.map((s) => {
            const ps = pillStyle(s.status && s.status.statusColor);
            const sub =
              s.status && s.status.hasNeverBeenFed
                ? "noch nie gefuettert"
                : "zuletzt gefuettert " +
                  formatTimeAgo(s.status && s.status.hoursSinceLastFeeding);
            const attention = s.status && s.status.needsAttention;
            return (
              <div
                key={s.id}
                className="rounded-[24px] border border-line bg-white p-4 shadow-card"
              >
                <div className="flex items-center gap-3.5">
                  <Link
                    href={`/starter/${s.id}`}
                    className="flex min-w-0 flex-1 items-center gap-3.5"
                  >
                    <img
                      src={jarImage(s.status)}
                      alt={s.name}
                      className="h-[66px] w-[66px] flex-shrink-0 object-contain"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-display text-[19px] font-semibold leading-none text-ink">
                        {s.name}
                      </div>
                      <div className="mt-1 truncate text-xs text-muted">
                        {s.flour_type ? s.flour_type + " · " : ""}
                        {sub}
                      </div>
                      <span
                        className="mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                        style={{ background: ps.bg, color: ps.fg }}
                      >
                        ● {pillText(s.status)}
                      </span>
                    </div>
                  </Link>
                  <Link
                    href={`/starter/${s.id}`}
                    className={
                      "flex-shrink-0 rounded-2xl px-4 py-2.5 text-[13px] font-semibold " +
                      (attention
                        ? "bg-mauve-500 text-white"
                        : "border-[1.5px] border-altrosa bg-cream-100 text-mauve-500")
                    }
                  >
                    Fuettern
                  </Link>
                </div>

                <div className="mt-3.5">
                  <div className="mb-1.5 flex justify-between text-[11px] text-muted">
                    <span>Naechste Fuetterung</span>
                    <span>{nextLabel(s.status)}</span>
                  </div>
                  <div
                    className="h-[7px] overflow-hidden rounded-full"
                    style={{ background: "#F0E6EC" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: meterPercent(s.status) + "%",
                        background: "linear-gradient(90deg, #ddbcc6, #8b6a7d)",
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* NEUEN STARTER ANLEGEN */}
      <Link
        href="/starter/new"
        className="mt-3.5 flex items-center justify-center gap-2 rounded-[22px] border-[1.6px] border-dashed border-altrosa px-4 py-4 text-sm font-semibold text-mauve-500"
        style={{ background: "rgba(221,188,198,0.10)" }}
      >
        + Neuen Starter anlegen
      </Link>

      {/* TIPP DES TAGES */}
      <div
        className="mt-4 flex items-start gap-3 rounded-[22px] p-4"
        style={{ background: "linear-gradient(135deg, #F3ECE0, #E8DFC9)" }}
      >
        <span className="text-[22px]">🫧</span>
        <div>
          <h3 className="font-display text-[15px] font-semibold text-brombeer">
            Tipp des Tages
          </h3>
          <p
            className="mt-0.5 text-[12.5px] leading-[1.45]"
            style={{ color: "#7C6A52" }}
          >
            {tipp}
          </p>
        </div>
      </div>
    </div>
  );
}
