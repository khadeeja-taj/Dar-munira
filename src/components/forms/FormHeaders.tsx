"use client";

import { useLang } from "@/lib/i18n/provider";

export function StudentHeader() {
  const { d } = useLang();
  return (
    <header className="mb-7 text-center">
      <span className="section-kicker">{d.nav.student}</span>
      <h1 className="mt-2 font-display text-4xl text-emerald-deep">
        {d.student.title}
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-brand-muted">{d.student.lead}</p>
    </header>
  );
}

export function InstructorHeader() {
  const { d } = useLang();
  return (
    <header className="mb-7 text-center">
      <span className="section-kicker">{d.nav.instructor}</span>
      <h1 className="mt-2 font-display text-4xl text-emerald-deep">
        {d.instructor.title}
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-brand-muted">
        {d.instructor.lead}
      </p>
    </header>
  );
}

export function VisitingHeader() {
  const { d } = useLang();
  return (
    <header className="mb-7 text-center">
      <span className="section-kicker">{d.join.visitingTitle}</span>
      <h1 className="mt-2 font-display text-4xl text-emerald-deep">
        {d.visiting.title}
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-brand-muted">{d.visiting.lead}</p>
    </header>
  );
}
