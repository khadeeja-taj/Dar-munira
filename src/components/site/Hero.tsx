"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLang } from "@/lib/i18n/provider";
import { SocialIcons } from "@/components/ui/Social";

/** A delicate curved vine with leaves and a few blossoms, in the site greens. */
function FloralDivider({ className }: { className?: string }) {
  const leaves = [
    { x: 40, y: 11, r: -30 },
    { x: 92, y: 23, r: 28 },
    { x: 150, y: 11, r: -26 },
    { x: 200, y: 22, r: 26 },
  ];
  const blossoms = [
    { x: 70, y: 15, c: "#f7f8f4" },
    { x: 170, y: 15, c: "#f7f8f4" },
    { x: 120, y: 17, c: "#e79bb0" },
  ];
  return (
    <svg viewBox="0 0 240 34" className={className} fill="none" aria-hidden>
      <path
        d="M6 17 C 40 3 80 3 120 17 C 160 31 200 31 234 17"
        stroke="#7fbf3f"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.95"
      />
      {leaves.map((l, i) => (
        <path
          key={i}
          d="M0 0 C 7 -9 21 -9 28 0 C 21 9 7 9 0 0 Z"
          fill="#7fbf3f"
          opacity="0.9"
          transform={`translate(${l.x} ${l.y}) rotate(${l.r}) scale(0.7)`}
        />
      ))}
      {blossoms.map((b, i) => (
        <g key={`b${i}`} transform={`translate(${b.x} ${b.y})`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse
              key={a}
              cx="0"
              cy="-4"
              rx="2.4"
              ry="4.2"
              fill={b.c}
              opacity="0.95"
              transform={`rotate(${a})`}
            />
          ))}
          <circle r="1.8" fill="#0b5d3b" />
        </g>
      ))}
    </svg>
  );
}

export function Hero() {
  const { d, dir, lang } = useLang();
  const [y, setY] = useState(0);
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Subtle text shadow so every word stays crisp over the photo.
  const shadow = useMemo(
    () => ({ textShadow: "0 2px 14px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.45)" }),
    [],
  );

  return (
    <section id="home" className="scroll-mt-24 px-4 pb-10 pt-6 sm:px-6 lg:pt-8">
      <div className="container-x !px-0">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative isolate overflow-hidden rounded-[28px] border border-white/50 shadow-glass-lg"
        >
          {/* Building photo (parallax) with an illustrated SVG fallback. */}
          <div
            className="absolute inset-0 -z-10 bg-cover bg-center"
            style={{
              transform: `translateY(${y * 0.04}px) scale(1.06)`,
              backgroundImage:
                "url(/images/building.jpg), url(/images/building.svg)",
            }}
            role="img"
            aria-label="Dar Munira building"
          />

          {/* Light diagonal wash — keeps text readable while showing the photo. */}
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,rgba(6,45,29,.55)_0%,rgba(8,66,42,.34)_40%,rgba(11,93,59,.14)_70%,rgba(255,255,255,0)_100%)]" />
          {/* Soft dark gradient only at the very bottom, for the tagline. */}
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(6,45,29,.62)_0%,rgba(6,45,29,0)_28%)]" />

          <div className="flex min-h-[80vh] flex-col justify-center p-8 sm:p-12 lg:p-16">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: -14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mb-5 inline-flex"
              >
                <motion.span
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-flex items-center gap-2 rounded-full border border-leaf/50 bg-leaf/25 px-4 py-1.5 text-sm font-semibold text-white shadow-glass ring-1 ring-white/20 backdrop-blur"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-leaf opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-leaf" />
                  </span>
                  {d.hero.announce}
                </motion.span>
              </motion.div>

              <span
                className="block text-xs font-bold uppercase tracking-[0.28em] text-white"
                style={shadow}
              >
                {d.hero.badge}
              </span>

              <h1
                className="mt-3 font-display text-5xl leading-[1.05] text-white sm:text-6xl md:text-7xl"
                style={shadow}
              >
                {d.hero.title}
              </h1>

              <p
                className="mt-3 font-display text-xl text-white sm:text-2xl"
                style={shadow}
              >
                {d.hero.subtitle}
              </p>
              <p
                className="mt-6 max-w-xl text-base leading-relaxed text-white sm:text-lg"
                style={shadow}
              >
                {d.hero.lead}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link href="/register" className="btn-accent text-base">
                  {d.hero.getStarted}
                  <Arrow className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-10">
                <SocialIcons variant="light" />
              </div>

              {/* Tagline in normal flow on mobile & tablet (no overlap). */}
              <div className="mt-10 flex flex-col items-center gap-2 text-center lg:hidden">
                <FloralDivider className="h-6 w-40" />
                <p
                  dir={dir}
                  className={`text-2xl font-semibold leading-[1.7] text-white sm:text-3xl ${
                    lang === "ar" ? "font-arabic" : "font-display italic"
                  }`}
                  style={{
                    textShadow:
                      "0 2px 16px rgba(6,45,29,0.85), 0 0 24px rgba(127,191,63,0.3)",
                  }}
                >
                  {d.hero.tagline}
                </p>
                <FloralDivider className="h-6 w-40 -scale-y-100" />
              </div>
            </div>
          </div>

          {/* Same tagline as an elegant panel on the free side — laptop only. */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-12 end-12 z-10 hidden w-[23rem] flex-col items-center gap-2 text-center lg:flex"
          >
            <FloralDivider className="h-7 w-52" />
            <p
              dir={dir}
              className={`text-4xl font-semibold leading-[1.7] text-white ${
                lang === "ar" ? "font-arabic" : "font-display italic"
              }`}
              style={{
                textShadow:
                  "0 2px 16px rgba(6,45,29,0.85), 0 0 24px rgba(127,191,63,0.3)",
              }}
            >
              {d.hero.tagline}
            </p>
            <FloralDivider className="h-7 w-52 -scale-y-100" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
