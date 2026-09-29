"use client";

import { Languages } from "lucide-react";
import { useLang } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

export function LanguageSwitch({
  variant = "solid",
  className,
}: {
  variant?: "solid" | "ghost";
  className?: string;
}) {
  const { toggle, d } = useLang();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch language"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition",
        variant === "solid"
          ? "bg-emerald/10 text-emerald-deep ring-1 ring-emerald/20 hover:bg-emerald/15"
          : "text-white ring-1 ring-white/30 hover:bg-white/10",
        className,
      )}
    >
      <Languages className="h-4 w-4" />
      {d.common.language}
    </button>
  );
}
