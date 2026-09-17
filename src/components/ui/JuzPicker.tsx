"use client";

import { QURAN_JUZ } from "@/lib/constants";

/** A soft watercolor-style flower badge with the juz number and two leaves. */
function FlowerTile({ n, active }: { n: number; active: boolean }) {
  const petals = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      {/* scalloped flower blob (petals) */}
      {petals.map((a) => {
        const r = (a * Math.PI) / 180;
        return (
          <circle
            key={a}
            cx={50 + Math.cos(r) * 19}
            cy={44 + Math.sin(r) * 19}
            r="17"
            fill={active ? "#7fbf3f" : "#e6f0d9"}
          />
        );
      })}
      <circle cx="50" cy="44" r="23" fill={active ? "#8fca55" : "#eef5e6"} />
      {/* little leaf sprig at the base */}
      <path d="M50 74 V 90" stroke="#6f9f4a" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="40" cy="84" rx="9" ry="4.4" fill="#6f9f4a" transform="rotate(-28 40 84)" />
      <ellipse cx="60" cy="84" rx="9" ry="4.4" fill="#6f9f4a" transform="rotate(28 60 84)" />
      {/* number */}
      <text
        x="50"
        y="53"
        textAnchor="middle"
        fontSize="28"
        fontWeight="700"
        fill={active ? "#ffffff" : "#3f6130"}
      >
        {n}
      </text>
    </svg>
  );
}

/** Decorative vine + blossoms for the corners of the frame. */
function CornerVine({ className }: { className?: string }) {
  const leaves = [
    { x: 16, y: 54, r: -30 },
    { x: 28, y: 34, r: 25 },
    { x: 36, y: 16, r: -12 },
  ];
  const blossoms = [
    { x: 24, y: 24, c: "#f7f8f4" },
    { x: 38, y: 10, c: "#e79bb0" },
  ];
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden>
      <path
        d="M6 74 C 20 60 30 40 36 12"
        stroke="#7fbf3f"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.9"
      />
      {leaves.map((l, i) => (
        <path
          key={i}
          d="M0 0 C 6 -8 18 -8 24 0 C 18 8 6 8 0 0 Z"
          fill="#7fbf3f"
          opacity="0.9"
          transform={`translate(${l.x} ${l.y}) rotate(${l.r}) scale(0.6)`}
        />
      ))}
      {blossoms.map((b, i) => (
        <g key={`f${i}`} transform={`translate(${b.x} ${b.y})`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse
              key={a}
              cx="0"
              cy="-3.5"
              rx="2.2"
              ry="3.6"
              fill={b.c}
              transform={`rotate(${a})`}
            />
          ))}
          <circle r="1.6" fill="#0b5d3b" />
        </g>
      ))}
    </svg>
  );
}

export function JuzPicker({
  value,
  onChange,
}: {
  value: number[];
  onChange: (v: number[]) => void;
}) {
  const toggle = (n: number) =>
    onChange(
      value.includes(n)
        ? value.filter((x) => x !== n)
        : [...value, n].sort((a, b) => a - b),
    );

  return (
    <div className="relative max-w-[20rem] rounded-2xl border border-leaf/40 bg-white/50 p-3 shadow-glass">
      <CornerVine className="pointer-events-none absolute -left-1.5 -top-1.5 h-11 w-11" />
      <CornerVine className="pointer-events-none absolute -right-1.5 -top-1.5 h-11 w-11 -scale-x-100" />
      <CornerVine className="pointer-events-none absolute -bottom-1.5 -left-1.5 h-11 w-11 -scale-y-100" />
      <CornerVine className="pointer-events-none absolute -bottom-1.5 -right-1.5 h-11 w-11 -scale-100" />
      <div className="grid grid-cols-6 gap-1">
        {QURAN_JUZ.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => toggle(n)}
            aria-pressed={value.includes(n)}
            title={`${n}`}
            className="aspect-square rounded-full transition-transform duration-150 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-leaf"
          >
            <FlowerTile n={n} active={value.includes(n)} />
          </button>
        ))}
      </div>
    </div>
  );
}
