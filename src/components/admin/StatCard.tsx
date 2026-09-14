"use client";

import type { LucideIcon } from "lucide-react";

export function StatCard({
  icon: Icon,
  label,
  value,
  tone = "emerald",
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  tone?: "emerald" | "leaf" | "teal" | "amber" | "rose";
  hint?: string;
}) {
  const toneMap: Record<string, string> = {
    emerald: "bg-emerald/10 text-emerald",
    leaf: "bg-leaf/15 text-emerald-deep",
    teal: "bg-teal/10 text-teal",
    amber: "bg-amber-100 text-amber-600",
    rose: "bg-rose-100 text-rose-500",
  };
  return (
    <div className="admin-surface rounded-2xl border border-emerald/10 bg-white/80 p-5 shadow-card transition hover:shadow-glass">
      <div className="flex items-center justify-between">
        <div className={`grid h-11 w-11 place-items-center rounded-xl ${toneMap[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        {hint && (
          <span className="text-xs font-semibold text-emerald">{hint}</span>
        )}
      </div>
      <p className="mt-4 font-display text-3xl text-emerald-deep dark:text-white">
        {value}
      </p>
      <p className="text-sm text-brand-muted dark:text-white/60">{label}</p>
    </div>
  );
}

export function ChartCard({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="admin-surface rounded-2xl border border-emerald/10 bg-white/80 p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg text-emerald-deep dark:text-white">
          {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  );
}
