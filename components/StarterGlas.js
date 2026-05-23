"use client";

import { useState, useEffect } from "react";

const lerp = (a, b, t) => a + (b - a) * t;

function statusFor(s) {
  if (s >= 80)
    return {
      label: "Topfit",
      msg: "blubbert vor Freude. Perfekter Moment zum Backen!",
      bg: "rgba(184,146,56,.16)",
      fg: "#7a5e16",
      bd: "rgba(184,146,56,.32)",
      top: "#f0dca8",
      bot: "#dcbd7a",
    };
  if (s >= 60)
    return {
      label: "Aktiv und wach",
      msg: "ist schoen am Arbeiten. Bald bereit zum Backen.",
      bg: "rgba(184,146,56,.12)",
      fg: "#7a5e16",
      bd: "rgba(184,146,56,.26)",
      top: "#ecd6a4",
      bot: "#d8b878",
    };
  if (s >= 40)
    return {
      label: "Wach",
      msg: "kommt langsam in Schwung. Gib ihm etwas Zeit.",
      bg: "rgba(125,85,96,.12)",
      fg: "#6b4651",
      bd: "rgba(125,85,96,.26)",
      top: "#e6cfa0",
      bot: "#cdb079",
    };
  if (s >= 20)
    return {
      label: "Etwas muede",
      msg: "koennte eine Fuetterung vertragen.",
      bg: "rgba(125,85,96,.14)",
      fg: "#6b4651",
      bd: "rgba(125,85,96,.3)",
      top: "#ddc8a4",
      bot: "#c2a982",
    };
  return {
    label: "Hungrig",
    msg: "ist hungrig. Fuettere ihn bald, dann wird er wieder munter.",
    bg: "rgba(125,85,96,.16)",
    fg: "#6b4651",
    bd: "rgba(125,85,96,.34)",
    top: "#d4c4a8",
    bot: "#b6a487",
  };
}

function genPores(score) {
  const t = score / 100;
  const n = Math.round(lerp(4, 22, t));
  const maxSize = lerp(8, 22, t);
  const arr = [];
  for (let i = 0; i < n; i++) {
    const size = 4 + Math.random() * maxSize;
    arr.push({
      w: size.toFixed(1),
      h: (size * (0.8 + Math.random() * 0.4)).toFixed(1),
      left: (6 + Math.random() * 84).toFixed(1),
      top: (8 + Math.random() * 78).toFixed(1),
    });
  }
  return arr;
}

function genBubbles(score) {
  const t = score / 100;
  const n = Math.round(lerp(1, 9, t));
  const dur = lerp(4.8, 2, t);
  const arr = [];
  for (let i = 0; i < n; i++) {
    const size = 3 + Math.random() * 7;
    arr.push({
      size: size.toFixed(1),
      left: (10 + Math.random() * 78).toFixed(1),
      dur: (dur * (0.7 + Math.random() * 0.6)).toFixed(2),
      delay: (-Math.random() * dur).toFixed(2),
    });
  }
  return arr;
}

export default function StarterGlas({ name, score }) {
  const s = Math.max(0, Math.min(100, Number(score) || 0));
  const t = s / 100;
  const info = statusFor(s);

  const [decor, setDecor] = useState({ pores: [], bubbles: [] });
  useEffect(() => {
    setDecor({ pores: genPores(s), bubbles: genBubbles(s) });
  }, [s]);

  const doughPct = lerp(28, 82, t).toFixed(1);
  const dome = lerp(8, 32, t).toFixed(1);
  const rise = Math.round((240 * lerp(28, 82, t)) / 100 - 16);
  const glowCol = s >= 50 ? "184,146,56" : "125,85,96";
  const glowOpacity = lerp(0.12, 0.72, t).toFixed(2);
  const breatheDur = lerp(5, 2.2, t).toFixed(2);
  const displayName = name || "Dein Starter";

  return (
    <div className="smkg-wrap">
      <style>{`
        .smkg-wrap{display:flex;flex-direction:column;align-items:center;width:100%;padding:.5rem 0 .25rem;}
        .smkg-stage{position:relative;width:300px;height:330px;display:flex;align-items:flex-end;justify-content:center;}
        .smkg-glow{position:absolute;left:50%;top:54%;width:340px;height:340px;transform:translate(-50%,-50%);border-radius:50%;filter:blur(26px);z-index:0;transition:opacity .8s ease, background .8s ease;}
        .smkg-jar{position:relative;z-index:1;width:200px;transform-origin:center bottom;animation:smkg-breathe 4s ease-in-out infinite;}
        @keyframes smkg-breathe{0%,100%{transform:scale(1);}50%{transform:scale(1.02);}}
        .smkg-lid{width:146px;height:30px;margin:0 auto;background:linear-gradient(180deg,#d6b25a 0%,#b89238 55%,#9c7a2c 100%);border-radius:9px 9px 5px 5px;position:relative;z-index:3;box-shadow:inset 0 2px 2px rgba(255,255,255,.35);}
        .smkg-lid::after{content:"";position:absolute;left:8px;right:8px;top:9px;height:11px;border-radius:4px;background:repeating-linear-gradient(90deg,rgba(0,0,0,.07) 0 3px,transparent 3px 7px);}
        .smkg-neck{width:156px;height:18px;margin:-3px auto 0;position:relative;background:rgba(125,85,96,.09);border-left:2px solid rgba(125,85,96,.22);border-right:2px solid rgba(125,85,96,.22);background-image:repeating-linear-gradient(180deg,rgba(125,85,96,.12) 0 1px,transparent 1px 5px);}
        .smkg-body{width:200px;height:240px;margin:0 auto;position:relative;overflow:hidden;border:2px solid rgba(125,85,96,.28);border-radius:14px 14px 32px 32px;background:linear-gradient(115deg,rgba(255,255,255,.4) 0%,rgba(255,255,255,.1) 40%,rgba(125,85,96,.05) 100%);}
        .smkg-shine{position:absolute;top:14px;left:18px;width:16px;height:150px;border-radius:12px;background:rgba(255,255,255,.4);filter:blur(2px);z-index:6;pointer-events:none;}
        .smkg-shine2{position:absolute;top:30px;right:24px;width:7px;height:90px;border-radius:8px;background:rgba(255,255,255,.22);filter:blur(1.5px);z-index:6;pointer-events:none;}
        .smkg-band{position:absolute;left:-2px;right:-2px;bottom:118px;height:7px;z-index:5;background:rgba(125,85,96,.32);border-top:1px solid rgba(125,85,96,.2);border-bottom:1px solid rgba(125,85,96,.2);}
        .smkg-band::after{content:"Pegel";position:absolute;right:6px;top:-14px;font-size:8px;letter-spacing:.1em;text-transform:uppercase;color:rgba(125,85,96,.6);font-weight:600;}
        .smkg-dough{position:absolute;left:0;right:0;bottom:0;z-index:2;transition:height .9s cubic-bezier(.4,0,.2,1), background .9s ease, border-radius .9s ease;}
        .smkg-dough::before{content:"";position:absolute;top:0;left:0;right:0;height:18px;background:linear-gradient(180deg,rgba(255,255,250,.35),transparent);border-radius:46% 54% 0 0 / 100% 100% 0 0;}
        .smkg-pore{position:absolute;border-radius:50%;background:radial-gradient(circle at 36% 30%,rgba(255,253,246,.75),rgba(210,180,125,.12) 72%);box-shadow:inset -1px -1px 2px rgba(120,90,40,.22);}
        .smkg-bubble{position:absolute;bottom:6px;border-radius:50%;background:rgba(255,252,245,.5);box-shadow:inset 0 0 2px rgba(255,255,255,.7);animation:smkg-rise linear infinite;z-index:3;}
        @keyframes smkg-rise{0%{transform:translateY(0) scale(.5);opacity:0;}14%{opacity:.7;}80%{opacity:.45;}100%{transform:translateY(calc(-1 * var(--rise))) scale(1);opacity:0;}}
        .smkg-label{position:absolute;z-index:5;left:50%;bottom:60px;transform:translateX(-50%) rotate(-1.5deg);width:128px;padding:7px 4px;text-align:center;background:rgba(255,253,248,.88);border:1px solid rgba(125,85,96,.25);border-radius:3px;box-shadow:0 1px 3px rgba(125,85,96,.12);}
        .smkg-label span{font-family:"Cormorant Garamond",Georgia,serif;font-style:italic;font-weight:600;font-size:1.3rem;color:#1a0f14;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .smkg-readout{display:flex;flex-direction:column;align-items:center;gap:.15rem;margin-top:.4rem;}
        .smkg-health{font-family:"Cormorant Garamond",Georgia,serif;font-weight:600;font-size:3rem;line-height:1;color:#b89238;}
        .smkg-health small{font-size:1.1rem;color:#7d5560;font-family:inherit;font-weight:500;}
        .smkg-hlabel{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#7d5560;font-weight:600;}
        .smkg-status{display:inline-block;margin-top:.5rem;padding:5px 16px;border-radius:30px;font-size:13px;font-weight:600;transition:all .5s ease;}
        .smkg-msg{margin-top:.7rem;font-size:14px;color:rgba(26,15,20,.72);text-align:center;max-width:300px;font-style:italic;}
        .smkg-vital{width:280px;margin-top:1.1rem;}
        .smkg-vital-top{display:flex;justify-content:space-between;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#7d5560;font-weight:600;}
        .smkg-vital-track{height:7px;background:rgba(125,85,96,.14);border-radius:10px;margin-top:6px;overflow:hidden;}
        .smkg-vital-fill{height:100%;border-radius:10px;background:linear-gradient(90deg,#d9a93f,#b89238);transition:width .8s cubic-bezier(.4,0,.2,1);}
      `}</style>

      <div className="smkg-stage">
        <div
          className="smkg-glow"
          style={{
            background: `radial-gradient(circle, rgba(${glowCol},0.9) 0%, rgba(${glowCol},0) 70%)`,
            opacity: glowOpacity,
          }}
        />
        <div className="smkg-jar" style={{ animationDuration: `${breatheDur}s` }}>
          <div className="smkg-lid" />
          <div className="smkg-neck" />
          <div className="smkg-body">
            <div className="smkg-band" />
            <div
              className="smkg-dough"
              style={{
                height: `${doughPct}%`,
                borderRadius: `46% 54% 8px 8px / ${dome}px ${dome}px 8px 8px`,
                background: `linear-gradient(180deg, ${info.top} 0%, ${info.bot} 100%)`,
                ["--rise"]: `${rise}px`,
              }}
            >
              {decor.pores.map((p, i) => (
                <div
                  key={`p${i}`}
                  className="smkg-pore"
                  style={{
                    width: `${p.w}px`,
                    height: `${p.h}px`,
                    left: `${p.left}%`,
                    top: `${p.top}%`,
                  }}
                />
              ))}
              {decor.bubbles.map((b, i) => (
                <div
                  key={`b${i}`}
                  className="smkg-bubble"
                  style={{
                    width: `${b.size}px`,
                    height: `${b.size}px`,
                    left: `${b.left}%`,
                    animationDuration: `${b.dur}s`,
                    animationDelay: `${b.delay}s`,
                  }}
                />
              ))}
            </div>
            <div className="smkg-label">
              <span>{displayName}</span>
            </div>
            <div className="smkg-shine" />
            <div className="smkg-shine2" />
          </div>
        </div>
      </div>

      <div className="smkg-readout">
        <div className="smkg-health">
          {Math.round(s)}
          <small>%</small>
        </div>
        <div className="smkg-hlabel">Gesundheit</div>
        <div
          className="smkg-status"
          style={{ background: info.bg, color: info.fg, border: `1px solid ${info.bd}` }}
        >
          {info.label}
        </div>
        <div className="smkg-msg">
          {displayName} {info.msg}
        </div>
      </div>

      <div className="smkg-vital">
        <div className="smkg-vital-top">
          <span>Vitalitaet</span>
          <span>{Math.round(s)}%</span>
        </div>
        <div className="smkg-vital-track">
          <div className="smkg-vital-fill" style={{ width: `${s}%` }} />
        </div>
      </div>
    </div>
  );
}
