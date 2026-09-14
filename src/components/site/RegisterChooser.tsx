"use client";

import Link from "next/link";
import { GraduationCap, Users, ArrowRight, ArrowLeft } from "lucide-react";
import { useLang } from "@/lib/i18n/provider";
import { Reveal } from "@/components/ui/Reveal";
import { BackLink } from "@/components/ui/BackLink";

export function RegisterChooser() {
  const { d, dir } = useLang();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  const cards = [
    {
      href: "/register/student",
      icon: GraduationCap,
      title: d.join.studentTitle,
      desc: d.join.studentDesc,
      tone: "from-emerald to-teal",
    },
    {
      href: "/register/instructor",
      icon: Users,
      title: d.join.instructorTitle,
      desc: d.join.instructorDesc,
      tone: "from-teal to-leaf",
    },
  ];

  return (
    <div className="container-x max-w-4xl py-16">
      <div className="mb-8">
        <BackLink href="/" label={d.nav.home} />
      </div>
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="section-kicker">{d.join.kicker}</span>
        <h1 className="mt-3 font-display text-4xl text-emerald-deep sm:text-5xl">
          {d.join.title}
        </h1>
        <p className="mt-4 leading-relaxed text-brand-muted">{d.join.lead}</p>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {cards.map((c, i) => (
          <Reveal key={c.href} delay={i * 0.08}>
            <Link
              href={c.href}
              className="glass group flex h-full flex-col rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glass-lg"
            >
              <div
                className={`mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${c.tone} text-white shadow-glass`}
              >
                <c.icon className="h-8 w-8" />
              </div>
              <h2 className="font-display text-2xl text-emerald-deep">
                {c.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-muted">
                {c.desc}
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 font-semibold text-emerald transition group-hover:gap-3">
                {d.join.start}
                <Arrow className="h-4 w-4" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
