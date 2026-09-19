"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n/provider";
import { Reveal } from "@/components/ui/Reveal";
import { initials } from "@/lib/utils";

type Teacher = { id: string; fullName: string };

export function Teachers() {
  const { d, lang } = useLang();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/teachers")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (active && json?.data) setTeachers(json.data as Teacher[]);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="teachers" className="container-x scroll-mt-24 py-20">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="section-kicker">{d.teachers.kicker}</span>
        <h2 className="mt-3 font-display text-4xl text-emerald-deep">
          {d.teachers.title}
        </h2>
        <p className="mt-4 leading-relaxed text-brand-muted">
          {d.teachers.lead}
        </p>
      </Reveal>

      {loaded && teachers.length === 0 ? (
        <p className="mt-14 text-center text-brand-muted">
          {lang === "ar"
            ? "سيتم عرض المعلمين هنا قريبًا إن شاء الله."
            : "Our teachers will be listed here soon, in shā’ Allah."}
        </p>
      ) : (
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {teachers.map((tch, i) => {
            const name = tch.fullName;
            return (
              <Reveal key={tch.id} delay={i * 0.05}>
                <article className="glass flex h-full items-center gap-5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-glass-lg">
                  {/* Photo placeholder — initials until a real photo is added */}
                  <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald via-emerald-soft to-teal font-display text-2xl text-white shadow-glass">
                    {initials(name)}
                  </div>
                  <div>
                    <h3
                      className={
                        lang === "ar"
                          ? "font-arabic text-2xl text-emerald-deep"
                          : "font-display text-2xl text-emerald-deep"
                      }
                    >
                      {name}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-teal">
                      {d.teachers.role}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      )}
    </section>
  );
}
