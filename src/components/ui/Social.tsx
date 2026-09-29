"use client";

import { Facebook, Mail, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Official Dar Munira (IIUI) links — used as defaults so the icons always
// open the correct page even if the env vars are not set at build time.
const fb =
  process.env.NEXT_PUBLIC_FACEBOOK_URL ||
  "https://www.facebook.com/share/1DaZSaT1ik/";
const wa =
  process.env.NEXT_PUBLIC_WHATSAPP_URL ||
  "https://whatsapp.com/channel/0029Vb6TTGM1yT27mWXd5h1m";
const email =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "dar.muneera@iiu.edu.pk";

export function SocialIcons({
  variant = "light",
  className,
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  const base =
    "inline-grid h-9 w-9 place-items-center rounded-full transition-all duration-200 hover:-translate-y-0.5";
  const styles =
    variant === "light"
      ? "bg-white/15 text-white ring-1 ring-white/25 hover:bg-white/25"
      : "bg-emerald/8 text-emerald ring-1 ring-emerald/15 hover:bg-emerald hover:text-white";

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <a
        href={fb}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        className={cn(base, styles)}
      >
        <Facebook className="h-4 w-4" />
      </a>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Channel"
        className={cn(base, styles)}
      >
        <MessageCircle className="h-4 w-4" />
      </a>
      <a
        href={email ? `mailto:${email}` : "/#contact"}
        aria-label="Email"
        className={cn(base, styles)}
      >
        <Mail className="h-4 w-4" />
      </a>
    </div>
  );
}
