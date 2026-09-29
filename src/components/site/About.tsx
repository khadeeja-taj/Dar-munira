"use client";

import {
  Eye,
  Target,
  Flag,
  HeartHandshake,
  Sprout,
  Award,
} from "lucide-react";
import { useLang } from "@/lib/i18n/provider";
import { Reveal } from "@/components/ui/Reveal";

export function About() {
  const { d } = useLang();

  const cards = [
    { icon: Eye, title: d.about.vision, text: d.about.visionText, tone: "emerald" },
    { icon: Target, title: d.about.mission, text: d.about.missionText, tone: "teal" },
    { icon: Flag, title: d.about.goals, text: d.about.goalsText, tone: "leaf" },
    { icon: HeartHandshake, title: d.about.values, text: d.about.valuesText, tone: "emerald" },
    { icon: Sprout, title: d.about.environment, text: d.about.environmentText, tone: "teal" },
    { icon: Award, title: d.about.excellence, text: d.about.excellenceText, tone: "leaf" },
  ];

  const toneMap: Record<string, string> = {
    emerald: "bg-emerald/10 text-emerald",
    teal: "bg-teal/10 text-teal",
    leaf: "bg-leaf/15 text-emerald-deep",
  };

  return (
    <section id="about" className="container-x scroll-mt-24 py-20">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="section-kicker">{d.about.kicker}</span>
        <h2 className="mt-3 font-display text-4xl text-emerald-deep">
          {d.about.title}
        </h2>
        <p className="mt-4 leading-relaxed text-brand-muted">{d.about.lead}</p>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.06}>
            <article className="glass h-full rounded-2xl p-7 transition-transform duration-300 hover:-translate-y-1 hover:shadow-glass-lg">
              <div
                className={`mb-5 grid h-12 w-12 place-items-center rounded-xl ${toneMap[c.tone]}`}
              >
                <c.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl text-emerald-deep">
                {c.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                {c.text}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
