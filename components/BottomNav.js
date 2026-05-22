"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Starter",
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#c87f63" : "#7a5e75"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 2h6l-1 7h-4z" />
        <path d="M5 9h14l-1 11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z" />
        <circle cx="12" cy="15" r="2" />
      </svg>
    ),
  },
  {
    href: "/brote",
    label: "Brote",
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#c87f63" : "#7a5e75"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7 Q 3 5, 5 5 L 8 5 L 9.5 3 L 14.5 3 L 16 5 L 19 5 Q 21 5, 21 7 L 21 17 Q 21 19, 19 19 L 5 19 Q 3 19, 3 17 Z" />
      </svg>
    ),
  },
  {
    href: "/krume",
    label: "Krume",
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#c87f63" : "#7a5e75"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="9" cy="10" r="1.2" fill={active ? "#c87f63" : "#7a5e75"} />
        <circle cx="14" cy="9" r="1.5" fill={active ? "#c87f63" : "#7a5e75"} />
        <circle cx="11" cy="14" r="1.8" fill={active ? "#c87f63" : "#7a5e75"} />
        <circle cx="15" cy="14" r="1" fill={active ? "#c87f63" : "#7a5e75"} />
      </svg>
    ),
  },
  {
    href: "/community",
    label: "Community",
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#c87f63" : "#7a5e75"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: "/fehlerfinder",
    label: "Fehler",
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#c87f63" : "#7a5e75"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.35-4.35" />
        <path d="M11 8v3" />
        <circle cx="11" cy="14" r="0.5" fill={active ? "#c87f63" : "#7a5e75"} />
      </svg>
    ),
  },
  {
    href: "/sos",
    label: "SOS",
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#c87f63" : "#7a5e75"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-mauve-500/20 bg-cream-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-md justify-around px-1 py-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl px-0.5 py-1.5 transition-all ${
                active ? "bg-terra-500/10" : ""
              }`}
            >
              {item.icon(active)}
              <span
                className={`whitespace-nowrap text-[9px] font-semibold ${
                  active ? "text-terra-700" : "text-cocoa-700/70"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
