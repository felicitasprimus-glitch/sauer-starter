export default function Logo({ size = 40, withText = true }) {
  return (
    <div className="inline-flex items-center gap-2.5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Glas */}
        <path
          d="M10 14 Q 10 11, 13 11 L 35 11 Q 38 11, 38 14 L 37 40 Q 37 43, 34 43 L 14 43 Q 11 43, 11 40 Z"
          stroke="#5E3D4D"
          strokeWidth="1.8"
          fill="#FAF6F0"
        />
        {/* Sauerteig im Glas */}
        <path
          d="M12 26 Q 16 24, 20 26 T 28 26 T 36 26 L 36 39 Q 36 41, 34 41 L 14 41 Q 12 41, 12 39 Z"
          fill="#D4A04C"
          opacity="0.85"
        />
        {/* Bläschen */}
        <circle cx="18" cy="32" r="1.6" fill="#FAF6F0" opacity="0.8" />
        <circle cx="24" cy="35" r="2" fill="#FAF6F0" opacity="0.8" />
        <circle cx="30" cy="31" r="1.4" fill="#FAF6F0" opacity="0.8" />
        <circle cx="22" cy="29" r="1" fill="#FAF6F0" opacity="0.7" />
        <circle cx="32" cy="37" r="1.2" fill="#FAF6F0" opacity="0.7" />
        {/* Markierung */}
        <path
          d="M11 21 L 17 21"
          stroke="#C97B5B"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      {withText && (
        <div className="leading-tight">
          <div className="font-display text-lg font-semibold text-cocoa-900">
            Sauer macht
          </div>
          <div className="-mt-0.5 font-display text-lg italic text-terra-600">
            Krustig
          </div>
        </div>
      )}
    </div>
  );
}
