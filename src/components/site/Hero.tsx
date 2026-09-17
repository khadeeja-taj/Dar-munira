"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Flower2 } from "lucide-react";
import { useLang } from "@/lib/i18n/provider";
import { SocialIcons } from "@/components/ui/Social";

/** Gentle drifting white blossoms floating over the hero. */
function Petals() {
  // Generate on the client only, to avoid SSR/hydration mismatch from random.
  const [petals, setPetals] = useState<
    { left: number; size: number; delay: number; duration: number; drift: number }[]
  >([]);

  useEffect(() => {
    const items = Array.from({ length: 14 }, () => ({
      left: Math.random() * 100,
      size: 12 + Math.random() * 18,
      delay: Math.random() * 10,
      duration: 9 + Math.random() * 9,
      drift: (Math.random() - 0.5) * 120,
    }));
    setPetals(items);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {petals.map((p, i) => (
        <motion.span
          key={i}
          className="absolute -top-10 text-white/80"
          style={{ left: `${p.left}%` }}
          initial={{ y: -40, x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: ["-6%", "112%"],
            x: [0, p.drift, 0],
            rotate: [0, 180, 360],
            opacity: [0, 0.9, 0.9, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Flower2
            style={{ width: p.size, height: p.size }}
            className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
          />
        </motion.span>
      ))}
    </div>
  );
}

export function Hero() {
  const { d, dir } = useLang();
  const [y, setY] = useState(0);
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Subtle text shadow so every word stays crisp over the photo.
  const shadow = useMemo(
    () => ({ textShadow: "0 2px 14px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.5)" }),
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
              transform: `translateY(${y * 0.18}px) scale(1.12)`,
              backgroundImage:
                "url(/images/building.jpg), url(/images/building.svg)",
            }}
            role="img"
            aria-label="Dar Munira building"
          />

          {/* Deeper diagonal scrim on the left for crisp, legible text… */}
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,rgba(6,45,29,.95)_0%,rgba(8,66,42,.78)_38%,rgba(11,93,59,.42)_62%,rgba(22,120,150,.12)_100%)]" />
          {/* …plus a soft bottom vignette so lower text/buttons stay clear. */}
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(4,30,20,.7)_0%,rgba(4,30,20,0)_45%)]" />

          {/* Floating white blossoms */}
          <Petals />

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

              {/* Elegant Arabic tagline — "Here hearts blossom with the Qur'an" */}
              <motion.p
                dir="rtl"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="mt-5 flex items-center gap-3 font-arabic text-3xl leading-relaxed sm:text-4xl md:text-5xl"
              >
                <motion.span
                  animate={{ opacity: [0.85, 1, 0.85], filter: ["brightness(1)", "brightness(1.15)", "brightness(1)"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-gradient-to-l from-amber-100 via-white to-leaf bg-clip-text font-semibold text-transparent drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
                >
                  هنا تُزهر القلوب بالقرآن
                </motion.span>
                <motion.span
                  animate={{ rotate: [0, 12, -8, 0], scale: [1, 1.12, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Flower2 className="h-7 w-7 text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] sm:h-8 sm:w-8" />
                </motion.span>
              </motion.p>

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
                <Link href="/courses" className="btn-accent text-base">
                  {d.hero.getStarted}
                  <Arrow className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-10">
                <SocialIcons variant="light" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
