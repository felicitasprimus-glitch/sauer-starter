"use client";

import { useEffect, useState } from "react";

function timeAgo(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "gerade eben";
  if (min < 60) return "vor " + min + " Min";
  const std = Math.floor(min / 60);
  if (std < 24) return "vor " + std + " Std";
  const tage = Math.floor(std / 24);
  return "vor " + tage + (tage === 1 ? " Tag" : " Tagen");
}

export default function NotificationBell() {
  const [events, setEvents] = useState([]);
  const [total, setTotal] = useState(0);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const data = await res.json();
      const evs = data.events || [];
      const t = data.total || 0;
      setEvents(evs);
      setTotal(t);
      let seen = 0;
      try {
        seen = parseInt(
          window.localStorage.getItem("notif_seen_total") || "0",
          10
        );
      } catch (e) {}
      setUnread(Math.max(0, t - seen));
    } catch (e) {}
  }

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next) {
      try {
        window.localStorage.setItem("notif_seen_total", String(total));
      } catch (e) {}
      setUnread(0);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggle}
        className="relative flex h-10 w-10 items-center justify-center rounded-full"
        style={{ background: "#f3ecf0" }}
        aria-label="Benachrichtigungen"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#5a3f56"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unread > 0 ? (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
            style={{ background: "#c0392b" }}
          >
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-[20px] border border-line bg-white shadow-card">
            <div className="border-b border-line px-4 py-3 font-display text-base font-semibold text-brombeer">
              Benachrichtigungen
            </div>
            <div className="max-h-80 overflow-y-auto">
              {events.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-muted">
                  Noch nichts los - sobald jemand dein Brot mag oder
                  kommentiert, siehst du es hier.
                </p>
              ) : (
                events.map((e) => (
                  <div
                    key={e.id}
                    className="flex gap-2.5 border-b border-line px-4 py-3 last:border-0"
                  >
                    <span className="text-lg">
                      {e.type === "like" ? "❤️" : "💬"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-ink">
                        <span className="font-semibold">{e.actor}</span>
                        {e.type === "like"
                          ? " gefaellt "
                          : " kommentierte "}
                        <span className="font-semibold">{e.brotName}</span>
                        {e.type === "like" ? "." : ":"}
                      </p>
                      {e.type === "comment" && e.text ? (
                        <p className="mt-0.5 truncate text-xs text-muted">
                          {e.text}
                        </p>
                      ) : null}
                      {e.createdAt ? (
                        <p className="mt-0.5 text-[11px] text-muted">
                          {timeAgo(e.createdAt)}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
