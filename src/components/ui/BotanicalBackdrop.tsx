"use client";

/**
 * A soft, delicate botanical layer that sits behind every section — leafy
 * vine sprigs in the corners plus a few scattered blossoms, in the brand
 * greens at low opacity. Purely decorative and non-interactive.
 */

function Sprig({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 220"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* curved stem */}
      <path
        d="M8 212 C 60 180 96 132 108 84 C 116 52 140 30 196 14"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* leaves along the stem */}
      {[
        { x: 60, y: 176, r: -35 },
        { x: 88, y: 138, r: 25 },
        { x: 104, y: 104, r: -20 },
        { x: 120, y: 70, r: 40 },
        { x: 150, y: 42, r: 10 },
        { x: 182, y: 20, r: 55 },
      ].map((l, i) => (
        <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.r})`}>
          <path
            d="M0 0 C 14 -18 42 -18 56 0 C 42 18 14 18 0 0 Z"
            fill="currentColor"
            opacity="0.55"
          />
          <path d="M4 0 H 50" stroke="#f7f8f4" strokeWidth="1.4" opacity="0.35" />
        </g>
      ))}
      {/* little blossoms */}
      {[
        { x: 132, y: 64 },
        { x: 168, y: 30 },
        { x: 96, y: 120 },
      ].map((f, i) => (
        <g key={`f${i}`} transform={`translate(${f.x} ${f.y})`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse
              key={a}
              cx="0"
              cy="-6"
              rx="3.2"
              ry="6"
              fill="#ffffff"
              opacity="0.85"
              transform={`rotate(${a})`}
            />
          ))}
          <circle r="2.6" fill="#f4c95d" />
        </g>
      ))}
    </svg>
  );
}

export function BotanicalBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden text-emerald/25"
      aria-hidden
    >
      <Sprig className="absolute -left-6 -top-6 h-56 w-56 sm:h-72 sm:w-72" />
      <Sprig className="absolute -right-6 -top-8 h-52 w-52 -scale-x-100 sm:h-64 sm:w-64" />
      <Sprig className="absolute -bottom-8 -left-8 h-56 w-56 -scale-y-100 sm:h-72 sm:w-72" />
      <Sprig className="absolute -bottom-6 -right-6 h-60 w-60 -scale-100 sm:h-80 sm:w-80" />
    </div>
  );
}
