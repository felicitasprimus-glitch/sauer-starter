"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ACTIVE = "#8b6a7d";
const INACTIVE = "#9a8290";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Starter",
    icon: (active) => (
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke={active ? ACTIVE : INACTIVE} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3h8M9 3v3c0 1-3 2-3 6v8a1 1 0 001 1h10a1 1 0 001-1v-8c0-4-3-5-3-6V3" />
      </svg>
    ),
  },
  {
    href: "/brote",
    label: "Brote",
    icon: (active) => (
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke={active ? ACTIVE : INACTIVE} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 13c0-4 3.6-6 8-6s8 2 8 6a2 2 0 01-2 2H6a2 2 0 01-2-2z" />
        <path d="M9 10.5l1.5 1.5M13 10l1.5 1.5" />
      </svg>
    ),
  },
  {
    href: "/krume",
    label: "Krume",
    icon: (active) => (
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke={active ? ACTIVE : INACTIVE} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="6" />
        <path d="M20 20l-4.5-4.5" />
      </svg>
    ),
  },
  {
    href: "/community",
    label: "Community",
    icon: (active) => (
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke={active ? ACTIVE : INACTIVE} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20s-7-4.3-7-9.2A3.8 3.8 0 0112 8a3.8 3.8 0 017 2.8C19 15.7 12 20 12 20z" />
      </svg>
    ),
  },
  {
    href: "/fehlerfinder",
    label: "Fehler",
    icon: (active) => (
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke={active ? ACTIVE : INACTIVE} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
    ),
  },
  {
    href: "/sos",
    label: "SOS",
    icon: (active) => (
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke={active ? ACTIVE : INACTIVE} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 4v3M12 17v3M4 12h3M17 12h3" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-line backdrop-blur"
      style={{ background: "rgba(255,255,255,0.92)" }}
    >
      <div className="mx-auto flex max-w-md justify-around px-1 pb-3.5 pt-2">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || (pathname && pathname.startsWith(item.href + "/"));
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-1 flex-col items-center gap-1 px-0.5 py-1"
            >
              {item.icon(active)}
              <span
                className="whitespace-nowrap text-[10px] font-semibold"
                style={{ color: active ? ACTIVE : INACTIVE }}
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
