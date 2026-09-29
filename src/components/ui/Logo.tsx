"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Detects an image that already failed to load before React hydrated
// (in which case the `onError` event was missed).
function useBrokenImage() {
  const ref = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);
  return { ref, failed, setFailed };
}

/**
 * Brand logos.
 *
 * They load the real image files from /public/images and fall back to an inline
 * SVG placeholder only if the file is missing — so dropping the real logos in
 * makes them appear everywhere (navbar, hero, footer, admin) with no code change.
 *
 *   /public/images/dar-logo.png    -> Dar Munira logo
 *   /public/images/iiui-logo.png   -> IIUI logo
 */

export function DarLogo({ className = "h-10 w-10" }: { className?: string }) {
  const { ref, failed, setFailed } = useBrokenImage();
  if (failed) return <DarLogoSVG className={className} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src="/images/dar-logo.png"
      alt="Dar Munira"
      className={cn("object-contain", className)}
      onError={() => setFailed(true)}
    />
  );
}

export function IIUILogo({ className = "h-10 w-10" }: { className?: string }) {
  const { ref, failed, setFailed } = useBrokenImage();
  if (failed) return <IIUILogoSVG className={className} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src="/images/iiui-logo.png"
      alt="International Islamic University Islamabad"
      className={cn("object-contain", className)}
      onError={() => setFailed(true)}
    />
  );
}

/* ---------- SVG fallbacks (used only if the image files are absent) ---------- */

function DarLogoSVG({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Dar Munira">
      <defs>
        <linearGradient id="dam-book" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7FBF3F" />
          <stop offset="1" stopColor="#16788F" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="#ffffff" />
      <path d="M32 12c-1.6 3-1.6 6 0 9 1.6-3 1.6-6 0-9z" fill="#14110F" />
      <path d="M22 20c4-3 16-3 20 0-3.2 1-6.6 1.5-10 1.5S25.2 21 22 20z" fill="#14110F" />
      <path d="M14 34c6-6 30-6 36 0-2 6-9 10-18 10S16 40 14 34z" fill="url(#dam-book)" />
      <path d="M32 30v16" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M12 46c8 5 32 5 40 0" stroke="#16788F" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function IIUILogoSVG({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="International Islamic University Islamabad">
      <rect width="64" height="64" rx="14" fill="#ffffff" />
      <circle cx="32" cy="32" r="26" fill="none" stroke="#0B5D3B" strokeWidth="2" />
      <circle cx="32" cy="32" r="20" fill="none" stroke="#0B5D3B" strokeWidth="1" />
      <path
        d="M24 40V26c0-3 2-5 4-5m8 19V24m-4 16v-9m8 9V27"
        stroke="#0B5D3B"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <circle
            key={i}
            cx={32 + Math.cos(a) * 23}
            cy={32 + Math.sin(a) * 23}
            r="0.9"
            fill="#0B5D3B"
          />
        );
      })}
    </svg>
  );
}
