"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const HOME_HTML = `
    <div class="topbar rv">
      <div class="circle-btn" data-nav="profil"><svg><use href="#i-user"/></svg></div>
    </div>

    <div class="hero rv">
      <img class="hero-img" alt="" src="data:image/jpeg;base64,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">
      <div class="hero-veil"></div>
      <div class="hero-inner">
        <div class="hi">Guten Morgen,</div>
        <div class="name">Felicitas <span class="hrt">&#9825;</span></div>
        <p class="hsub">Bereit für deinen Backmoment heute?</p>
        <button class="hcta" data-nav="starter">
        <div class="lock-badge"><svg class="lk"><use href="#i-lock"/></svg><svg class="cr"><use href="#i-crown"/></svg></div>Tagebuch öffnen <svg><use href="#i-arrow"/></svg></button>
      </div>
    </div>

    <div class="smk-feed-frame"><iframe title="Anstellgut-Status" src="/widget/starter" scrolling="no"></iframe></div>
    <div id="smkActiveBake" class="smk-ab" style="display:none"></div>

    <div class="headline rv d1">
      <h1>Dein Backstuben-Zugang</h1> <span class="tag">Premium</span>
      <div class="divider"><svg><use href="#i-wheat"/></svg></div>
    </div>

    <div class="dash-list">
      <div class="dash-item" data-nav="starter">
        <span class="dash-ic"><svg><use href="#i-jar"/></svg></span>
        <div class="dash-tx"><h3>Starter-Tagebuch</h3><p>Anstellgut füttern, beobachten, retten</p></div>
        <span class="dash-crown"><svg><use href="#i-crown"/></svg></span>
        <span class="dash-ar">&rsaquo;</span>
      </div>
      <div class="dash-item" data-nav="rezepte">
        <span class="dash-ic"><svg><use href="#i-bread"/></svg></span>
        <div class="dash-tx"><h3>Rezeptsammlung</h3><p>186+ erprobte Stoneware-Rezepte</p></div>
        <span class="dash-crown"><svg><use href="#i-crown"/></svg></span>
        <span class="dash-ar">&rsaquo;</span>
      </div>
      <div class="dash-item" data-nav="brotwerkstatt">
        <span class="dash-ic"><svg><use href="#i-grain"/></svg></span>
        <div class="dash-tx"><h3>Brotwerkstatt</h3><p>Schritt für Schritt zu deinem Brot</p></div>
        <span class="dash-crown"><svg><use href="#i-crown"/></svg></span>
        <span class="dash-ar">&rsaquo;</span>
      </div>
      <div class="dash-item" data-nav="rechner">
        <span class="dash-ic"><svg><use href="#i-scale"/></svg></span>
        <div class="dash-tx"><h3>Rechner</h3><p>Hydration, Schüttwasser, Hefe &amp; mehr</p></div>
        <span class="dash-ar">&rsaquo;</span>
      </div>
      <div class="dash-item" data-nav="fehlerfinder">
        <span class="dash-ic"><svg><use href="#i-search"/></svg></span>
        <div class="dash-tx"><h3>Fehlerfinder</h3><p>Finde heraus, was schiefgelaufen ist</p></div>
        <span class="dash-ar">&rsaquo;</span>
      </div>
      <div class="dash-item" data-nav="bibliothek">
        <span class="dash-ic"><svg><use href="#i-book"/></svg></span>
        <div class="dash-tx"><h3>Wissensbibliothek</h3><p>Dein Nachschlagewerk in 9 Kapiteln</p></div>
        <span class="dash-crown"><svg><use href="#i-crown"/></svg></span>
        <span class="dash-ar">&rsaquo;</span>
      </div>
      <div class="dash-item" data-nav="stoneware">
        <span class="dash-ic"><svg><use href="#i-grain"/></svg></span>
        <div class="dash-tx"><h3>Stoneware &amp; Pflege</h3><p>Rezepte &amp; Pflegehinweise für deine Stoneware</p></div>
        <span class="dash-ar">&rsaquo;</span>
      </div>
      <div class="dash-item" data-nav="community">
        <span class="dash-ic"><svg><use href="#i-people"/></svg></span>
        <div class="dash-tx"><h3>Community</h3><p>Zeig dein Brot &amp; back mit anderen</p></div>
        <span class="dash-crown"><svg><use href="#i-crown"/></svg></span>
        <span class="dash-ar">&rsaquo;</span>
      </div>
      <div class="dash-item" data-nav="krume">
        <span class="dash-ic"><svg><use href="#i-search"/></svg></span>
        <div class="dash-tx"><h3>Krume analysieren</h3><p>Krumenfoto hochladen, KI wertet aus</p></div>
        <span class="dash-crown"><svg><use href="#i-crown"/></svg></span>
        <span class="dash-ar">&rsaquo;</span>
      </div>
    </div>
  </div>

  `;
const HOME_CSS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Poppins:wght@400;500;600&family=Great+Vibes&display=swap');\\n:root{
    --bg-top:#F9EDF0;--bg-bottom:#F4E2E7;--paper:#FFFFFF;--blush:#F6E7EA;--blush-deep:#EDD6DC;
    --rose:#C98FA0;--rose-mid:#B4788B;--rose-deep:#8E5468;--wine:#6E3348;--ink:#4A2F3A;--ink-soft:#9A7E88;
  }
.rv{opacity:1;transform:none;}
.rv.d1{animation-delay:.08s;}
.rv.d2{animation-delay:.16s;}
.rv.d3{animation-delay:.24s;}
.rv.d4{animation-delay:.32s;}
.rv.d5{animation-delay:.4s;}
@keyframes rise{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:none;}}
.hero{position:relative;margin:12px 18px 0;border-radius:24px;overflow:hidden;min-height:210px;background:#E7C6CF;box-shadow:0 20px 44px -18px rgba(142,84,104,.45);display:flex;align-items:flex-end;}
.hero-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 42%;z-index:1;}
.hero-veil{position:absolute;inset:0;z-index:2;background:linear-gradient(180deg,rgba(78,30,45,.42) 0%,rgba(78,30,45,.1) 26%,rgba(78,30,45,0) 48%),linear-gradient(0deg,rgba(247,231,236,.96) 0%,rgba(247,231,236,.75) 14%,rgba(247,231,236,.15) 34%,rgba(247,231,236,0) 50%);}
.hero-inner{position:relative;z-index:3;padding:18px 22px 20px;width:100%;}
.hero .hi{font-family:'Cormorant Garamond',serif;font-size:1.6rem;font-weight:600;color:#FFF;line-height:1.05;text-shadow:0 2px 12px rgba(78,30,45,.55);}
.hero .name{font-family:'Great Vibes',cursive;font-size:2.2rem;font-weight:400;color:#FFE9F0;line-height:1.05;margin-top:2px;text-shadow:0 2px 14px rgba(78,30,45,.6);}
.hero .name .hrt{font-size:1.3rem;}
.hero .hsub{font-family:'Poppins',sans-serif;font-size:.8rem;font-weight:500;color:var(--wine);margin-top:44px;line-height:1.5;}
.hero .hcta{display:inline-flex;align-items:center;gap:8px;margin-top:12px;font-family:'Poppins',sans-serif;font-size:.74rem;font-weight:500;background:linear-gradient(150deg,var(--rose-mid),var(--wine));color:#fff;border:none;border-radius:999px;padding:11px 20px;cursor:pointer;box-shadow:0 12px 26px -8px rgba(110,51,72,.6);}
.hero .hcta svg{width:15px;height:15px;stroke:#fff;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}
.headline{text-align:center;padding:14px 24px 0;}
.headline h1{font-family:'Cormorant Garamond',serif;font-size:2.35rem;font-weight:600;color:var(--wine);line-height:1.05;display:inline;}
.headline .tag{font-family:'Poppins',sans-serif;font-size:.66rem;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:var(--rose-deep);white-space:nowrap;}
.headline .tag::before{content:"— ";letter-spacing:0;}
.divider{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:20px;}
.divider::before,.divider::after{content:"";width:84px;height:1px;background:linear-gradient(90deg,transparent,rgba(142,84,104,.4));}
.divider::after{background:linear-gradient(90deg,rgba(142,84,104,.4),transparent);}
.divider svg{width:26px;height:26px;stroke:var(--rose-mid);fill:none;stroke-width:1.3;stroke-linecap:round;stroke-linejoin:round;}
.topbar{display:flex;align-items:center;justify-content:space-between;padding:calc(16px + env(safe-area-inset-top)) 20px 0;}
.circle-btn{width:46px;height:46px;border-radius:50%;background:linear-gradient(150deg,#FDF6F8,#F3DEE4);border:1px solid rgba(255,255,255,.9);box-shadow:0 8px 20px -8px rgba(142,84,104,.3);display:flex;align-items:center;justify-content:center;cursor:pointer;}
.circle-btn svg{width:20px;height:20px;stroke:var(--wine);fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;}
.lock-badge{position:absolute;top:16px;right:16px;z-index:3;width:52px;height:52px;border-radius:50%;background:linear-gradient(150deg,var(--rose),var(--rose-deep));border:2px solid rgba(255,255,255,.75);box-shadow:0 8px 18px -6px rgba(110,51,72,.55);display:flex;align-items:center;justify-content:center;}
.lock-badge svg{width:20px;height:20px;stroke:#fff;fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;}
.smk-ab{margin:0 18px 6px}
@keyframes smkPulse{0%{box-shadow:0 0 0 0 rgba(143,209,158,.6)}70%{box-shadow:0 0 0 8px rgba(143,209,158,0)}100%{box-shadow:0 0 0 0 rgba(143,209,158,0)}}
.dash-list{display:flex;flex-direction:column;gap:10px;margin-top:4px}
.dash-item{display:flex;align-items:center;gap:13px;width:100%;background:#fff;border:1px solid rgba(154,111,130,.14);border-radius:20px;padding:14px 15px;cursor:pointer;box-shadow:0 6px 18px -14px rgba(124,62,80,.32);transition:transform .12s ease;position:relative}
.dash-item:active{transform:scale(.99)}
.dash-ic{flex:0 0 auto;width:48px;height:48px;border-radius:15px;background:rgba(201,143,160,.14);display:flex;align-items:center;justify-content:center}
.dash-ic svg{width:23px;height:23px;color:var(--mauve,#9A6F82)}
.dash-tx{flex:1;min-width:0}
.dash-tx h3{font-family:'Cormorant Garamond',Georgia,serif;font-size:20px;font-weight:600;color:var(--wine,#6E3348);margin:0 0 1px;line-height:1.12}
.dash-tx p{font-size:12.5px;color:#8a6f7a;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dash-crown{flex:0 0 auto;display:flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:rgba(185,146,106,.16)}
.dash-crown svg{width:12px;height:12px;color:#B9926A}
.dash-ar{flex:0 0 auto;color:#c9a3b3;font-size:22px;line-height:1}
.smk-feed-frame{margin:8px 18px 0}
.smk-feed-frame iframe{width:100%;height:76px;border:0;display:block;background:transparent}`;
const SPRITE = `<svg style="display:none" xmlns="http://www.w3.org/2000/svg">
  <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6"/></symbol>
  <symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="9" r="3.4"/><path d="M5.5 20c1-3.6 3.5-5.4 6.5-5.4s5.5 1.8 6.5 5.4"/></symbol>
  <symbol id="i-camera" viewBox="0 0 24 24"><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13" r="3.4"/></symbol>
  <symbol id="i-wheat" viewBox="0 0 24 24"><path d="M12 21c0-7 2-11 7-16"/><path d="M15.5 8.5c2 .3 3.5-.5 4.5-2.5-2-.4-3.6.4-4.5 2.5ZM13.8 11.5c2 .3 3.5-.5 4.5-2.5-2-.4-3.6.4-4.5 2.5ZM12.5 14.8c2 .3 3.5-.5 4.5-2.5-2-.4-3.6.4-4.5 2.5Z"/><path d="M10 12C8.5 9.5 6.5 8.5 4 9c1 2.3 2.8 3.4 6 3Z"/></symbol>
  <symbol id="i-jar" viewBox="0 0 24 24"><path d="M8.5 3h7M8 5.5h8"/><path d="M8.5 5.5C8.5 7 7 8 7 10v8a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3v-8c0-2-1.5-3-1.5-4.5"/><path d="M7.5 11.5h9"/><circle cx="10.5" cy="15" r=".9"/><circle cx="13.8" cy="17" r=".9"/></symbol>
  <symbol id="i-bread" viewBox="0 0 24 24"><path d="M4 13a8 5.5 0 0 1 16 0v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M9 9.5c-.8 1-1.2 2-1.2 3.4M13 8.8c-.8 1-1.2 2-1.2 3.4M17 9.5c-.8 1-1.2 2-1.2 3.4"/></symbol>
  <symbol id="i-grain" viewBox="0 0 24 24"><path d="M12 22V9"/><path d="M12 9c-2.4-.2-4-1.6-4.5-4C10 5.1 11.6 6.4 12 9ZM12 9c2.4-.2 4-1.6 4.5-4C14 5.1 12.4 6.4 12 9ZM12 13.5c-2.4-.2-4-1.6-4.5-4 2.5.1 4.1 1.4 4.5 4ZM12 13.5c2.4-.2 4-1.6 4.5-4-2.5.1-4.1 1.4-4.5 4Z"/></symbol>
  <symbol id="i-book" viewBox="0 0 24 24"><path d="M12 6c-1.8-1.6-4.4-2-8-2v15c3.6 0 6.2.4 8 2 1.8-1.6 4.4-2 8-2V4c-3.6 0-6.2.4-8 2Z"/><path d="M12 6v15"/></symbol>
  <symbol id="i-people" viewBox="0 0 24 24"><circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 19.5c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5"/><circle cx="16.8" cy="9.5" r="2.5"/><path d="M15.7 14.7c2.4.2 4.2 1.8 4.8 4.8"/></symbol>
  <symbol id="i-search" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></symbol>
  <symbol id="i-scale" viewBox="0 0 24 24"><path d="M12 3v18M4 21h16"/><path d="M12 5 5 8l-2 6a4 4 0 0 0 8 0L9 8"/><path d="m12 5 7 3 2 6a4 4 0 0 1-8 0l2-6"/></symbol>
  <symbol id="i-home" viewBox="0 0 24 24"><path d="M4 11 12 4l8 7"/><path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9"/><path d="M10 20v-5h4v5"/></symbol>
  <symbol id="i-lock" viewBox="0 0 24 24"><rect x="6.5" y="10.5" width="11" height="8.5" rx="2.5"/><path d="M9.5 10.5V8a2.5 2.5 0 0 1 5 0v2.5"/></symbol>
  <symbol id="i-crown" viewBox="0 0 24 24"><path d="M4.5 16.5h15M4.5 16.5 3.5 8l4.5 2.8L12 5.5l4 5.3L20.5 8l-1 8.5"/></symbol>
</svg>`;

const ROUTES = {
  profil: "/mein-profil", starter: "/dashboard", rezepte: "/rezepte",
  fehlerfinder: "/fehlerfinder", community: "/community", krume: "/krume",
  bibliothek: "EXT:https://sauerteig-wissen.netlify.app/",
  stoneware: "/stoneware",
  brotwerkstatt: "/brotbackplaner", rechner: "/rechner",
};

function CookTracker() {
  const [cook, setCook] = useState(null);
  useEffect(() => {
    function load() {
      try {
        const raw = localStorage.getItem("smk-active-cook");
        setCook(raw ? JSON.parse(raw) : null);
      } catch (e) { setCook(null); }
    }
    load();
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, []);
  function persist(c) {
    try {
      if (c) localStorage.setItem("smk-active-cook", JSON.stringify(c));
      else localStorage.removeItem("smk-active-cook");
    } catch (e) {}
    setCook(c);
  }
  if (!cook || !cook.steps || !cook.steps.length) return null;
  const total = cook.steps.length;
  const idx = Math.min(cook.idx || 0, total - 1);
  const step = cook.steps[idx];
  return (
    <div style={{ margin: "12px 18px 0", background: "linear-gradient(150deg,#9A6F82,#7C3E50)", color: "#fff", borderRadius: 22, padding: "16px 18px", boxShadow: "0 14px 30px -16px rgba(124,62,80,.6)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, fontWeight: 600 }}>🍳 {cook.name}</span>
        <button onClick={() => persist(null)} style={{ background: "rgba(255,255,255,.18)", border: "none", color: "#fff", fontSize: 12, padding: "5px 11px", borderRadius: 999, cursor: "pointer" }}>Beenden</button>
      </div>
      <div style={{ fontSize: 11, opacity: 0.85, textTransform: "uppercase", letterSpacing: ".06em" }}>Schritt {idx + 1} von {total}</div>
      <p style={{ fontSize: 14.5, lineHeight: 1.5, margin: "4px 0 12px", whiteSpace: "pre-line" }}>{step}</p>
      <div style={{ display: "flex", gap: 8 }}>
        <button disabled={idx <= 0} onClick={() => persist({ ...cook, idx: Math.max(0, idx - 1) })} style={{ flex: 1, background: "rgba(255,255,255,.15)", border: "none", color: "#fff", borderRadius: 12, padding: "10px", fontSize: 14, cursor: idx <= 0 ? "default" : "pointer", opacity: idx <= 0 ? 0.5 : 1 }}>← Zurück</button>
        {idx < total - 1 ? (
          <button onClick={() => persist({ ...cook, idx: idx + 1 })} style={{ flex: 2, background: "#fff", color: "#7C3E50", border: "none", borderRadius: 12, padding: "10px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Nächster Schritt →</button>
        ) : (
          <button onClick={() => persist(null)} style={{ flex: 2, background: "#fff", color: "#7C3E50", border: "none", borderRadius: 12, padding: "10px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>✓ Fertig!</button>
        )}
      </div>
    </div>
  );
}

export default function StartPage() {
  const router = useRouter();
  const ref = useRef(null);

  useEffect(() => {
    function esc(s) {
      return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    function render() {
      var el = document.getElementById("smkActiveBake");
      if (!el) return;
      var raw = null;
      try { raw = localStorage.getItem("smk-active-bake"); } catch (e) {}
      if (!raw) { el.style.display = "none"; el.innerHTML = ""; return; }
      var data;
      try { data = JSON.parse(raw); } catch (e) { el.style.display = "none"; return; }
      var steps = (data.steps || []).filter(function (s) { return s.time; });
      if (!steps.length) { el.style.display = "none"; return; }
      steps.sort(function (a, b) { return a.time - b.time; });
      var now = Date.now(), cur = null, next = null;
      for (var i = 0; i < steps.length; i++) { if (steps[i].time <= now) { cur = steps[i]; } else { next = steps[i]; break; } }
      var done = steps[steps.length - 1].time <= now;
      var html = '<div class="smk-ab-top"><span class="smk-ab-dot"></span><span class="smk-ab-name">' + esc(data.name || "Backvorgang") + '</span><button class="smk-ab-x" type="button" data-action="clear-bake">Fertig</button></div>';
      var head = cur || next, headLabel = cur ? "Jetzt" : "Startet gleich";
      if (head) { html += '<div class="smk-ab-now"><span class="smk-ab-ic">' + (head.icon || "\uD83C\uDF5E") + '</span><div><small>' + headLabel + '</small><b>' + esc(head.title) + "</b></div></div>"; }
      if (next) { var mins = Math.round((next.time - now) / 60000); var when = mins <= 0 ? "jetzt" : (mins < 60 ? ("in " + mins + " Min") : ("in " + Math.floor(mins / 60) + " Std " + (mins % 60) + " Min")); html += '<div class="smk-ab-next"><span>N\u00e4chster: ' + esc(next.title) + "</span><b>" + when + "</b></div>"; }
      else if (done) { html += '<div class="smk-ab-next"><span>Alle Schritte erledigt</span><b>\uD83C\uDF89</b></div>'; }
      el.innerHTML = '<div class="smk-ab-card" data-nav="brotwerkstatt">' + html + "</div>";
      el.style.display = "block";
    }
    window.__smkRenderBake = render;
    render();
    const iv = setInterval(render, 60000);
    return () => clearInterval(iv);
  }, []);
  function onClick(e) {
    const act = e.target.closest && e.target.closest("[data-action]");
    if (act && act.getAttribute("data-action") === "clear-bake") {
      e.preventDefault();
      e.stopPropagation();
      try { localStorage.removeItem("smk-active-bake"); } catch (x) {}
      if (window.__smkRenderBake) window.__smkRenderBake();
      return;
    }
    const el = e.target.closest && e.target.closest("[data-nav]");
    if (!el) return;
    const nav = el.getAttribute("data-nav");
    const r = ROUTES[nav];
    if (!r) return;
    if (r.indexOf("EXT:") === 0) { window.open(r.slice(4), "_blank"); return; }
    if (r === "SOON") { window.alert("Dieser Bereich kommt als Naechstes dazu."); return; }
    router.push(r);
  }
  return (
    <div style={{ margin: "-1.5rem -1rem 0" }}>
      <style dangerouslySetInnerHTML={{ __html: HOME_CSS }} />
      <div dangerouslySetInnerHTML={{ __html: SPRITE }} style={{ display: "none" }} />
      <CookTracker />
      <div ref={ref} onClick={onClick} dangerouslySetInnerHTML={{ __html: HOME_HTML }} />
    </div>
  );
}
