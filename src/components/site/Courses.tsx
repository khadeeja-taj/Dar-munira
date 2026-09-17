"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, GraduationCap, Trophy, ArrowUpRight, type LucideIcon } from "lucide-react";
import { useLang } from "@/lib/i18n/provider";
import { Reveal } from "@/components/ui/Reveal";

type CourseItem = {
  id: string;
  category: "program" | "course" | "competition";
  titleEn: string;
  titleAr: string;
  descEn?: string | null;
  descAr?: string | null;
};

const CATEGORIES: {
  key: CourseItem["category"];
  en: string;
  ar: string;
  icon: LucideIcon;
}[] = [
  { key: "program", en: "Programs", ar: "البرامج", icon: BookOpen },
  { key: "course", en: "Courses", ar: "الدورات", icon: GraduationCap },
  { key: "competition", en: "Competitions", ar: "المسابقات", icon: Trophy },
];

// The four Programs always show (even before an admin adds anything).
const DEFAULT_PROGRAMS: CourseItem[] = [
  {
    id: "prog-hifz-quran",
    category: "program",
    titleEn: "Hifz ul Qur'an",
    titleAr: "حفظ القرآن",
    descEn: "Structured memorization of the Holy Qur'an with revision and tarbiyah.",
    descAr: "حفظٌ منظّم للقرآن الكريم مع المراجعة والتربية.",
  },
  {
    id: "prog-tilawah",
    category: "program",
    titleEn: "Tilawah (Recitation)",
    titleAr: "تلاوة القرآن",
    descEn: "Beautiful, correct recitation of the Holy Qur'an.",
    descAr: "تلاوة القرآن الكريم تلاوةً صحيحةً مُجوَّدة.",
  },
  {
    id: "prog-tadabbur",
    category: "program",
    titleEn: "Tadabbur (Reflection)",
    titleAr: "تدبر القرآن",
    descEn: "Reflect on the meanings and guidance of the Qur'an.",
    descAr: "التدبّر في معاني القرآن الكريم وهداياته.",
  },
  {
    id: "prog-tajweed",
    category: "program",
    titleEn: "Tajweed",
    titleAr: "التجويد",
    descEn: "Master correct Qur'anic recitation across progressive levels.",
    descAr: "إتقان التلاوة الصحيحة عبر مستويات متدرّجة.",
  },
];

export function Courses() {
  const { d, lang } = useLang();
  const [items, setItems] = useState<CourseItem[] | null>(null);

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((res) => setItems(res.data || []))
      .catch(() => setItems([]));
  }, []);

  return (
    <section id="courses" className="scroll-mt-24 py-20">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="section-kicker">{d.courses.kicker}</span>
          <h2 className="mt-3 font-display text-4xl text-emerald-deep">
            {d.courses.title}
          </h2>
          <p className="mt-4 leading-relaxed text-brand-muted">{d.courses.lead}</p>
        </Reveal>

        {CATEGORIES.map(({ key, en, ar, icon: CatIcon }) => {
          let group = (items || []).filter((c) => c.category === key);
          // Programs always have the four defaults if none were added yet.
          if (key === "program" && items && group.length === 0) {
            group = DEFAULT_PROGRAMS;
          }
          return (
            <div key={key} className="mt-14">
              <Reveal>
                <h3 className="mb-6 flex items-center gap-3 font-display text-2xl text-emerald-deep">
                  <span className="h-6 w-1.5 rounded-full bg-leaf" />
                  {lang === "ar" ? ar : en}
                </h3>
              </Reveal>

              {items && group.length === 0 ? (
                <p className="text-sm text-brand-muted">
                  {lang === "ar"
                    ? "سيتم إضافة المحتوى قريبًا إن شاء الله."
                    : "Content will be added soon, in shā’ Allah."}
                </p>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {(group.length ? group : []).map((c, i) => (
                    <Reveal key={c.id} delay={i * 0.05}>
                      <article className="glass group flex h-full flex-col rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-glass-lg">
                        <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-leaf/20 to-teal/15 text-emerald">
                          <CatIcon className="h-7 w-7" />
                        </div>
                        <h3 className="font-display text-2xl text-emerald-deep">
                          {lang === "ar" ? c.titleAr : c.titleEn}
                        </h3>
                        {(c.descEn || c.descAr) && (
                          <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-muted">
                            {lang === "ar" ? c.descAr || c.descEn : c.descEn || c.descAr}
                          </p>
                        )}
                        <Link
                          href={`/register/student?courseId=${c.id}&course=${encodeURIComponent(
                            c.titleEn,
                          )}`}
                          className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-emerald transition group-hover:gap-2"
                        >
                          {d.courses.register}
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </article>
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
