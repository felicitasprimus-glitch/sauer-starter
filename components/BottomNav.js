"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    href: "/dashboard",
    label: "Starter",
    matches: (p) => p === "/dashboard" || p.startsWith("/starter/"),
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M6 8 Q 6 6, 8 6 L 16 6 Q 18 6, 18 8 L 17.5 19 Q 17.5 20.5, 16 20.5 L 8 20.5 Q 6.5 20.5, 6.5 19 Z"
          stroke="currentColor"
          strokeWidth="1.6"
          fill={active ? "currentColor" : "none"}
          fillOpacity={active ? "0.15" : "0"}
        />
        <circle cx="10" cy="14" r="1" fill="currentColor" />
        <circle cx="14" cy="16" r="1.2" fill="currentColor" />
        <circle cx="13" cy="12" r="0.8" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: "/brote",
    label: "Brote",
    matches: (p) => p.startsWith("/brote"),
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 14 Q 3 9, 7 8 Q 8 5, 12 5 Q 16 5, 17 8 Q 21 9, 21 14 L 21 17 Q 21 19, 19 19 L 5 19 Q 3 19, 3 17 Z"
          stroke="currentColor"
          strokeWidth="1.6"
          fill={active ? "currentColor" : "none"}
          fillOpacity={active ? "0.15" : "0"}
          strokeLinejoin="round"
        />
        <path
          d="M9 13 L 11 11 M 13 14 L 15 12 M 11 16 L 13 14"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    ),
  },
  {
    href: "/sos",
    label: "SOS",
    matches: (p) => p.startsWith("/sos"),
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3 L 21 19 L 3 19 Z"
          stroke="currentColor"
          strokeWidth="1.6"
          fill={active ? "currentColor" : "none"}
          fillOpacity={active ? "0.15" : "0"}
          strokeLinejoin="round"
        />
        <path
          d="M12 10 L 12 14 M 12 16.5 L 12 16.6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-mauve-500/15
                 bg-cream-50/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {items.map((item) => {
          const active = item.matches(pathname);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-1 py-3 transition-colors ${
                  active ? "text-terra-600" : "text-cocoa-700/60"
                }`}
              >
                {item.icon(active)}
                <span className="text-[11px] font-semibold tracking-wide">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
