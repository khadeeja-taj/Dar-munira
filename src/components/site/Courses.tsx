"use client";

import Link from "next/link";
import {
  BookOpenCheck,
  BookMarked,
  GraduationCap,
  ScrollText,
  Library,
  Sparkles,
  PenLine,
  Languages,
  Scale,
  Layers,
  Mic,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { useLang } from "@/lib/i18n/provider";
import { Reveal } from "@/components/ui/Reveal";
import { COURSES, courseSubOptions } from "@/lib/constants";

const iconMap: Record<string, LucideIcon> = {
  BookOpenCheck,
  BookMarked,
  GraduationCap,
  ScrollText,
  Library,
  Sparkles,
  PenLine,
  Languages,
  Scale,
  Layers,
  Mic,
};

const descriptions: Record<string, { en: string; ar: string }> = {
  tajweed: {
    en: "Master correct Qur'anic recitation across three progressive levels.",
    ar: "إتقان التلاوة الصحيحة عبر ثلاثة مستويات متدرّجة.",
  },
  "hifz-quran": {
    en: "Structured memorization of the Holy Qur'an with revision and tarbiyah.",
    ar: "حفظٌ منظّم للقرآن الكريم مع المراجعة والتربية.",
  },
  "understanding-quran": {
    en: "Grasp meanings, themes, and reflections of the Qur'an.",
    ar: "فهم معاني القرآن ومقاصده والتدبّر فيه.",
  },
  "hifz-ahadees": {
    en: "Memorize authentic prophetic traditions with their meanings.",
    ar: "حفظ الأحاديث النبوية الصحيحة مع معانيها.",
  },
  "hifz-mutun": {
    en: "Commit foundational scholarly texts (mutun) to memory.",
    ar: "حفظ المتون العلمية الأساسية.",
  },
  aqeedah: {
    en: "Study sound Islamic creed rooted in the Qur'an and Sunnah.",
    ar: "دراسة العقيدة الإسلامية الصحيحة من الكتاب والسنّة.",
  },
  "sharh-mutun": {
    en: "Detailed explanation and commentary of classical texts.",
    ar: "شرح مفصّل للمتون الكلاسيكية.",
  },
  "arabic-institute": {
    en: "Learn the Arabic language — reading, grammar, and comprehension.",
    ar: "تعلّم اللغة العربية قراءةً وقواعدَ وفهماً.",
  },
  fiqh: {
    en: "Study Islamic jurisprudence and its practical rulings.",
    ar: "دراسة الفقه الإسلامي وأحكامه العملية.",
  },
  comprehensive: {
    en: "Using the Al-Maktaba Al-Shamela digital Islamic library and its references.",
    ar: "التعرّف على المكتبة الشاملة والإفادة من مصادرها ومراجعها العلمية.",
  },
  tilawah: {
    en: "Beautiful, correct recitation of the Holy Qur'an.",
    ar: "تلاوة القرآن الكريم تلاوةً صحيحةً مُجوَّدة.",
  },
};

export function Courses() {
  const { d, lang } = useLang();

  return (
    <section id="courses" className="scroll-mt-24 py-20">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="section-kicker">{d.courses.kicker}</span>
          <h2 className="mt-3 font-display text-4xl text-emerald-deep">
            {d.courses.title}
          </h2>
          <p className="mt-4 leading-relaxed text-brand-muted">
            {d.courses.lead}
          </p>
        </Reveal>

        {(
          [
            ["program", d.courses.programsLabel],
            ["course", d.courses.coursesLabel],
          ] as const
        ).map(([group, groupLabel]) => {
          const items = COURSES.filter((c) => c.group === group);
          if (items.length === 0) return null;
          return (
            <div key={group} className="mt-14">
              <Reveal>
                <h3 className="mb-6 flex items-center gap-3 font-display text-2xl text-emerald-deep">
                  <span className="h-6 w-1.5 rounded-full bg-leaf" />
                  {groupLabel}
                </h3>
              </Reveal>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((c, i) => {
                  const Icon = iconMap[c.icon] || BookMarked;
                  return (
                    <Reveal key={c.key} delay={i * 0.05}>
                      <article className="glass group flex h-full flex-col rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-glass-lg">
                        <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-leaf/20 to-teal/15 text-emerald">
                          <Icon className="h-7 w-7" />
                        </div>
                        <h3 className="font-display text-2xl text-emerald-deep">
                          {lang === "ar" ? c.ar : c.en}
                        </h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-muted">
                          {lang === "ar"
                            ? descriptions[c.key]?.ar
                            : descriptions[c.key]?.en}
                        </p>

                        {courseSubOptions(c.key) && (
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {courseSubOptions(c.key)!.map((lv) => (
                              <span
                                key={lv.key}
                                className="chip bg-leaf/12 text-emerald-deep ring-1 ring-leaf/30"
                              >
                                {lang === "ar" ? lv.ar : lv.en}
                              </span>
                            ))}
                          </div>
                        )}

                        <Link
                          href={`/register/student?course=${c.key}`}
                          className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-emerald transition group-hover:gap-2"
                        >
                          {d.courses.register}
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </article>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
