"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLang } from "@/lib/i18n/provider";
import { SocialIcons } from "@/components/ui/Social";

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

          {/* Elegant tagline (bilingual) in a refined frosted panel, placed on
              the free side of the image (opposite the main text, in both
              languages, via logical `end` inset). */}
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.55, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-8 end-6 z-10 w-[16rem] sm:bottom-12 sm:end-12 sm:w-[20rem]"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-3xl border border-white/25 bg-emerald-deep/25 px-6 py-6 text-center shadow-glass-lg ring-1 ring-white/10 backdrop-blur-md"
            >
              <span className="mx-auto mb-4 block h-px w-12 bg-gradient-to-r from-transparent via-leaf to-transparent" />
              <p
                dir={dir}
                className={`text-2xl font-semibold leading-[1.7] text-white sm:text-3xl ${
                  lang === "ar" ? "font-arabic" : "font-display italic"
                }`}
                style={{
                  textShadow:
                    "0 2px 14px rgba(0,0,0,0.55), 0 0 22px rgba(255,255,255,0.18)",
                }}
              >
                {d.hero.tagline}
              </p>
              <span className="mx-auto mt-4 block h-px w-12 bg-gradient-to-r from-transparent via-leaf to-transparent" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
