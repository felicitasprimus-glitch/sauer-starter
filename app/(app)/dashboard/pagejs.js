"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getStarterFeedingStatus, formatTimeAgo } from "@/lib/feedingStatus";
import { useLang } from "@/components/LanguageProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ProfileAvatar from "@/components/ProfileAvatar";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 11) return { key: "greet.morning", emoji: "☀️" };
  if (h < 18) return { key: "greet.day", emoji: "🌤️" };
  return { key: "greet.evening", emoji: "🌙" };
}

function pillStyle(color) {
  if (color === "okay" || color === "soon") return { bg: "#EAF3EA", fg: "#5E7E58" };
  if (color === "warning") return { bg: "#FBEEDF", fg: "#B07A36" };
  if (color === "danger") return { bg: "#F7E3E1", fg: "#B0524A" };
  return { bg: "#F1EAEF", fg: "#9A8290" };
}

function pillKey(status) {
  if (!status) return "";
  if (status.hasNeverBeenFed) return "pill.neverFed";
  if (status.isOverdue) return "pill.urgent";
  if (status.isDue) return "pill.hungry";
  if (status.isComingUp) return "pill.soon";
  if (status.inFridge) return "pill.fridge";
  return "pill.active";
}

function meterPercent(status) {
  if (!status || status.hoursSinceLastFeeding == null || !status.intervalHours) return 6;
  const p = (status.hoursSinceLastFeeding / status.intervalHours) * 100;
  return Math.min(100, Math.max(6, Math.round(p)));
}

function nextLabel(status, t) {
  if (!status) return "";
  if (status.hasNeverBeenFed) return t("next.start");
  if (status.needsAttention) return t("next.due");
  if (status.inFridge) {
    const d = Math.max(0, Math.floor(status.hoursUntilFeed / 24));
    return t("next.inDays").replace("{n}", d);
  }
  return t("next.inHours").replace("{n}", Math.max(0, Math.round(status.hoursUntilFeed)));
}

function jarImage(status) {
  const c = status && status.statusColor;
  if (c === "warning" || c === "danger") return "/starter-hungrig.png";
  return "/starter-peak.png";
}

export default function DashboardPage() {
  const supabase = createClient();
  const { t } = useLang();
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
  const firstName = displayName ? displayName.split(" ")[0] : "";

  const _now = new Date();
  const _dayOfYear = Math.floor(
    (_now - new Date(_now.getFullYear(), 0, 0)) / 86400000
  );
  const tipKey = "tip." + ((_dayOfYear % 20) + 1);

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
        <div className="absolute left-0 right-0 top-0 z-10 flex items-start justify-between px-5 pt-5">
          <span
            className="text-[13px] font-medium text-white/90"
            style={{ textShadow: "0 1px 6px rgba(62,44,57,0.5)" }}
          >
            {t(greeting.key)}
            {firstName ? ", " + firstName : ""} {greeting.emoji}
          </span>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ProfileAvatar onDark />
          </div>
        </div>
        <div className="absolute bottom-5 left-5 right-5 z-10">
          <h1
            className="font-display text-[30px] font-semibold leading-[1.05] text-white"
            style={{ textShadow: "0 2px 14px rgba(62,44,57,0.45)" }}
          >
            {t("dash.welcomeTitle")}
          </h1>
          <p
            className="mt-1 text-[13px] text-white/90"
            style={{ textShadow: "0 1px 8px rgba(62,44,57,0.4)" }}
          >
            {t("dash.welcomeSubtitle")}
          </p>
        </div>
      </div>

      {/* SECTION HEADER */}
      <div className="mb-3.5 px-1">
        <h2 className="font-display text-[21px] font-semibold text-brombeer">
          {t("dash.yourStarters")}
        </h2>
        {!loading && startersWithStatus.length > 0 ? (
          <p className="mt-0.5 text-xs text-muted">
            {t("dash.activeStarters").replace("{n}", startersWithStatus.length)}
          </p>
        ) : null}
      </div>

      {/* LISTE */}
      {loading ? (
        <div className="rounded-[24px] border border-line bg-white p-6 text-center text-sm text-muted shadow-card">
          {t("dash.loading")}
        </div>
      ) : startersWithStatus.length === 0 ? (
        <div className="rounded-[24px] border border-line bg-white p-8 text-center shadow-card">
          <p className="text-4xl">🌾</p>
          <h3 className="mt-3 font-display text-2xl font-semibold text-ink">
            {t("dash.noStarterTitle")}
          </h3>
          <p className="mt-2 text-sm text-muted">{t("dash.noStarterText")}</p>
          <Link
            href="/starter/new"
            className="mt-5 inline-block rounded-2xl bg-mauve-500 px-6 py-3 text-sm font-semibold text-white"
          >
            {t("dash.createStarter")}
          </Link>
        </div>
      ) : (
        <div className="space-y-3.5">
          {startersWithStatus.map((s) => {
            const ps = pillStyle(s.status && s.status.statusColor);
            const sub =
              s.status && s.status.hasNeverBeenFed
                ? t("card.neverFed")
                : t("card.lastFed") +
                  " " +
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
                        ● {t(pillKey(s.status))}
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
                    {t("card.feed")}
                  </Link>
                </div>

                <div className="mt-3.5">
                  <div className="mb-1.5 flex justify-between text-[11px] text-muted">
                    <span>{t("next.label")}</span>
                    <span>{nextLabel(s.status, t)}</span>
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
        + {t("dash.addNew")}
      </Link>

      {/* TIPP DES TAGES */}
      <div
        className="mt-4 flex items-start gap-3 rounded-[22px] p-4"
        style={{ background: "linear-gradient(135deg, #F3ECE0, #E8DFC9)" }}
      >
        <span className="text-[22px]">🫧</span>
        <div>
          <h3 className="font-display text-[15px] font-semibold text-brombeer">
            {t("tip.title")}
          </h3>
          <p
            className="mt-0.5 text-[12.5px] leading-[1.45]"
            style={{ color: "#7C6A52" }}
          >
            {t(tipKey)}
          </p>
        </div>
      </div>

      {/* SCHNELLZUGRIFF */}
      <h2 className="mb-3 mt-6 font-display text-[21px] font-semibold text-brombeer">
        {t("dash.quickTitle")}
      </h2>
      <div className="grid grid-cols-3 gap-3">
        <Link
          href="/krume"
          className="rounded-[20px] border border-line bg-white p-3.5 text-center shadow-card"
        >
          <div
            className="mx-auto flex h-10 w-10 items-center justify-center rounded-full text-lg"
            style={{ background: "#F1EAEF" }}
          >
            🔍
          </div>
          <div className="mt-2 font-display text-[14px] font-semibold text-ink">
            {t("dash.kiCheck")}
          </div>
          <div className="mt-0.5 text-[10px] leading-snug text-muted">
            {t("dash.kiCheckDesc")}
          </div>
        </Link>
        <Link
          href="/community"
          className="rounded-[20px] border border-line bg-white p-3.5 text-center shadow-card"
        >
          <div
            className="mx-auto flex h-10 w-10 items-center justify-center rounded-full text-lg"
            style={{ background: "#F6E2E2" }}
          >
            💬
          </div>
          <div className="mt-2 font-display text-[14px] font-semibold text-ink">
            {t("nav.community")}
          </div>
          <div className="mt-0.5 text-[10px] leading-snug text-muted">
            {t("dash.communityDesc")}
          </div>
        </Link>
        <Link
          href="/sos"
          className="rounded-[20px] border border-line bg-white p-3.5 text-center shadow-card"
        >
          <div
            className="mx-auto flex h-10 w-10 items-center justify-center rounded-full text-lg"
            style={{ background: "#F7E3E1" }}
          >
            🆘
          </div>
          <div className="mt-2 font-display text-[14px] font-semibold text-ink">
            {t("dash.sosHelp")}
          </div>
          <div className="mt-0.5 text-[10px] leading-snug text-muted">
            {t("dash.sosHelpDesc")}
          </div>
        </Link>
      </div>
    </div>
  );
}
