"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLang } from "@/lib/i18n/provider";

export function BackLink({
  href,
  label,
}: {
  href: string;
  label?: string;
}) {
  const { dir, lang } = useLang();
  const Arrow = dir === "rtl" ? ArrowRight : ArrowLeft;
  const text = label || (lang === "ar" ? "رجوع" : "Back");
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full border border-emerald/15 bg-white/70 px-4 py-2 text-sm font-semibold text-emerald-deep transition hover:bg-white hover:shadow-card"
    >
      <Arrow className="h-4 w-4" />
      {text}
    </Link>
  );
}
