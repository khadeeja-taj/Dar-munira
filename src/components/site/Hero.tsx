"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLang } from "@/lib/i18n/provider";
import { SocialIcons } from "@/components/ui/Social";

export function Hero() {
  const { d, dir } = useLang();
  const [y, setY] = useState(0);
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="home" className="scroll-mt-24 px-4 pb-10 pt-6 sm:px-6 lg:pt-8">
      <div className="container-x !px-0">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative isolate overflow-hidden rounded-[28px] border border-white/50 shadow-glass-lg"
        >
          {/* Building image inside the glass frame (parallax). Uses a CSS
              background so it ALWAYS shows: your photo at /public/images/
              building.jpg on top, and the illustrated building.svg beneath as a
              guaranteed fallback (no photo needed, no JS needed). */}
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

          {/* Diagonal overlay: dark green on the left for legible text, fading
              so the building stays visible on the right (as in the blueprint). */}
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,rgba(8,58,37,.9)_0%,rgba(11,93,59,.55)_40%,rgba(11,93,59,.18)_66%,rgba(22,120,150,.05)_100%)]" />

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
              <span className="block text-xs font-bold uppercase tracking-[0.28em] text-white/95">
                {d.hero.badge}
              </span>
              <h1 className="mt-3 font-display text-5xl leading-[1.05] text-white sm:text-6xl md:text-7xl">
                {d.hero.title}
              </h1>
              <p className="mt-3 font-display text-xl text-white/90 sm:text-2xl">
                {d.hero.subtitle}
              </p>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
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
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
