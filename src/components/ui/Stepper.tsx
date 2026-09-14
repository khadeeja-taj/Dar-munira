"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stepper({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <ol className="flex items-center gap-2">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-semibold transition",
                  done && "bg-emerald text-white",
                  active && "bg-leaf text-emerald-deep ring-4 ring-leaf/25",
                  !done && !active && "bg-white/70 text-brand-muted ring-1 ring-emerald/15",
                )}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden text-sm font-medium sm:block",
                  active ? "text-emerald-deep" : "text-brand-muted",
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span
                className={cn(
                  "h-0.5 flex-1 rounded-full transition",
                  done ? "bg-emerald" : "bg-emerald/15",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
