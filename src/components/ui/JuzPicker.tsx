"use client";

import { QURAN_JUZ } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** A small open book (mushaf) used as the tile background behind the number. */
function BookIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <g
        opacity="0.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* left page */}
        <path d="M12 6.5C9.8 5.2 6.4 5.2 4 6v12c2.4-.8 5.8-.8 8 .6" />
        {/* right page */}
        <path d="M12 6.5C14.2 5.2 17.6 5.2 20 6v12c-2.4-.8-5.8-.8-8 .6" />
      </g>
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
    <div className="grid w-full max-w-[360px] grid-cols-7 gap-1">
      {QURAN_JUZ.map((n) => {
        const active = value.includes(n);
        return (
          <button
            key={n}
            type="button"
            onClick={() => toggle(n)}
            aria-pressed={active}
            title={`${n}`}
            className={cn(
              "relative flex aspect-square items-center justify-center rounded-md border transition-all duration-150",
              active
                ? "border-emerald bg-emerald text-white shadow-glass"
                : "border-emerald/15 bg-white/70 text-emerald-deep hover:border-emerald/40 hover:bg-emerald/5",
            )}
          >
            <BookIcon className="h-5 w-5" />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
              {n}
            </span>
          </button>
        );
      })}
    </div>
  );
}
