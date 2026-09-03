"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PLUM = "#6E3348";
const MUTED = "#9a8290";

function Ico({ active, children }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? PLUM : MUTED}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const NAV = [
  {
    href: "/start",
    label: "Start",
    icon: (a) => (
      <Ico active={a}>
        <path d="M4 11 12 4l8 7" />
        <path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" />
        <path d="M10 20v-5h4v5" />
      </Ico>
    ),
  },
  {
    href: "/dashboard",
    label: "Tagebuch",
    icon: (a) => (
      <Ico active={a}>
        <path d="M8.5 3h7M8 5.5h8" />
        <path d="M8.5 5.5C8.5 7 7 8 7 10v8a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3v-8c0-2-1.5-3-1.5-4.5" />
        <path d="M7.5 11.5h9" />
      </Ico>
    ),
  },
  {
    href: "/rezepte",
    label: "Rezepte",
    icon: (a) => (
      <Ico active={a}>
        <path d="M4 13a8 5.5 0 0 1 16 0v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
        <path d="M9 9.5c-.8 1-1.2 2-1.2 3.4M13 8.8c-.8 1-1.2 2-1.2 3.4M17 9.5c-.8 1-1.2 2-1.2 3.4" />
      </Ico>
    ),
  },
  {
    href: "/wissen",
    label: "Wissen",
    icon: (a) => (
      <Ico active={a}>
        <path d="M12 6c-1.8-1.6-4.4-2-8-2v15c3.6 0 6.2.4 8 2 1.8-1.6 4.4-2 8-2V4c-3.6 0-6.2.4-8 2Z" />
        <path d="M12 6v15" />
      </Ico>
    ),
  },
  {
    href: "/rechner",
    label: "Rechner",
    icon: (a) => (
      <Ico active={a}>
        <path d="M12 3v18M4 21h16" />
        <path d="M12 5 5 8l-2 6a4 4 0 0 0 8 0L9 8" />
        <path d="m12 5 7 3 2 6a4 4 0 0 1-8 0l2-6" />
      </Ico>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-md">
        <div className="m-2 flex justify-around rounded-[26px] border border-cocoa-200/40 bg-cream-50/95 px-2 py-2 shadow-lg backdrop-blur">
          {NAV.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/start" && pathname?.startsWith(item.href + "/"));
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-1 flex-col items-center gap-0.5 py-1"
              >
                {item.icon(active)}
                <span
                  className="text-[10px] font-semibold"
                  style={{ color: active ? PLUM : MUTED }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    width: 16,
                    height: 2,
                    borderRadius: 2,
                    marginTop: 1,
                    background: active ? PLUM : "transparent",
                  }}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
