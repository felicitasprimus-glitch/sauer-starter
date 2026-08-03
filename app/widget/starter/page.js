
import { createClient } from "@/lib/supabase/server";
import { getStarterFeedingStatus } from "@/lib/feedingStatus";

export const dynamic = "force-dynamic";

function agoText(hours) {
  if (hours == null) return "";
  if (hours < 1) {
    const m = Math.max(1, Math.round(hours * 60));
    return `vor ${m} Min`;
  }
  if (hours < 24) return `vor ${Math.round(hours)} Std`;
  const d = Math.floor(hours / 24);
  return `vor ${d} ${d === 1 ? "Tag" : "Tagen"}`;
}

function Card({ due, emoji, title, sub, href }) {
  return (
    <a
      href={href}
      target="_top"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        textDecoration: "none",
        background: due
          ? "linear-gradient(150deg,#F5E7D6,#EAD3BE)"
          : "#ffffff",
        border: due
          ? "1px solid rgba(185,146,106,.45)"
          : "1px solid rgba(154,111,130,.16)",
        borderRadius: "18px",
        padding: "12px 14px",
        boxShadow: "0 6px 18px -14px rgba(124,62,80,.3)",
      }}
    >
      <span style={{ fontSize: "24px", flex: "0 0 auto" }}>{emoji}</span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <b
          style={{
            display: "block",
            fontFamily: "'Cormorant Garamond',Georgia,serif",
            fontSize: "18px",
            fontWeight: 600,
            color: "#6E3348",
            lineHeight: 1.12,
          }}
        >
          {title}
        </b>
        <small
          style={{
            fontSize: "12px",
            color: "#8a6f7a",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "block",
          }}
        >
          {sub}
        </small>
      </div>
      <span style={{ color: "#c9a3b3", fontSize: "22px", flex: "0 0 auto" }}>&rsaquo;</span>
    </a>
  );
}

export default async function StarterWidget() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const wrap = (child) => (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html:
            "html,body{margin:0;padding:0;background:transparent!important}",
        }}
      />
      <div style={{ margin: 0, fontFamily: "'Poppins',system-ui,sans-serif" }}>
        {child}
      </div>
    </>
  );

  if (!user) {
    return wrap(
      <Card
        due
        emoji="🥄"
        title="Anstellgut verbinden"
        sub="Öffne dein Tagebuch, um zu starten"
        href="/"
      />
    );
  }

  const { data: starters } = await supabase
    .from("starters")
    .select("*, feedings(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const withStatus = (starters || [])
    .map((s) => ({
      ...s,
      feedings: (s.feedings || []).sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      ),
    }))
    .map((s) => ({ s, status: getStarterFeedingStatus(s, s.feedings) }));

  if (withStatus.length === 0) {
    return wrap(
      <Card
        due
        emoji="🥄"
        title="Noch kein Starter"
        sub="Lege dein Anstellgut im Tagebuch an"
        href="/starter"
      />
    );
  }

  withStatus.sort((a, b) => {
    const ax = a.status?.hoursUntilFeed ?? 99999;
    const bx = b.status?.hoursUntilFeed ?? 99999;
    return ax - bx;
  });

  const top = withStatus[0];
  const st = top.status || {};
  const name = top.s.name || "Anstellgut";
  const due = st.isDue || st.isOverdue || st.hasNeverBeenFed;

  let title, sub;
  if (st.hasNeverBeenFed) {
    title = "Zeit zum Füttern?";
    sub = `${name} · noch nie gefüttert`;
  } else if (due) {
    title = "Zeit zum Füttern?";
    sub = `${name} · zuletzt ${agoText(st.hoursSinceLastFeeding)}`;
  } else {
    title = "Anstellgut versorgt";
    sub = `${name} · zuletzt ${agoText(st.hoursSinceLastFeeding)}`;
  }

  return wrap(
    <Card due={due} emoji="🥄" title={title} sub={sub} href={`/starter/${top.s.id}`} />
  );
}
