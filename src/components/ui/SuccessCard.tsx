"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, MessageCircle } from "lucide-react";

/**
 * Animated confirmation card shown after a successful registration.
 * The card fades/scales in, the check mark pops with a spring, and two
 * rings ripple outward for a celebratory feel. When a WhatsApp group link
 * is provided it is shown as a call-to-action.
 */
export function SuccessCard({
  title,
  message,
  home,
  whatsappUrl,
  whatsappHint,
  whatsappJoin,
}: {
  title: string;
  message: string;
  home: string;
  whatsappUrl?: string;
  whatsappHint?: string;
  whatsappJoin?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass mx-auto max-w-xl rounded-3xl p-10 text-center"
    >
      <div className="relative mx-auto grid h-24 w-24 place-items-center">
        {/* Rippling rings */}
        {[0, 1].map((i) => (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full bg-leaf/25"
            initial={{ scale: 0.6, opacity: 0.6 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{
              duration: 1.6,
              ease: "easeOut",
              repeat: Infinity,
              delay: i * 0.8,
            }}
          />
        ))}
        {/* Check badge */}
        <motion.div
          className="relative grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-leaf to-emerald text-white shadow-glass"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 }}
        >
          <motion.span
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.35 }}
          >
            <Check className="h-10 w-10" strokeWidth={3} />
          </motion.span>
        </motion.div>
      </div>

      <motion.h2
        className="mt-6 font-display text-3xl text-emerald-deep"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        {title}
      </motion.h2>
      <motion.p
        className="mt-3 text-brand-muted"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
      >
        {message}
      </motion.p>

      {whatsappUrl && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.7 }}
          className="mt-6 rounded-2xl border border-emerald/10 bg-emerald/5 p-5"
        >
          {whatsappHint && (
            <p className="text-sm text-emerald-deep">{whatsappHint}</p>
          )}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-accent mt-4 inline-flex"
          >
            <MessageCircle className="h-4 w-4" />
            {whatsappJoin}
          </a>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Link href="/" className="btn-primary mt-7">
          {home}
        </Link>
      </motion.div>
    </motion.div>
  );
}
