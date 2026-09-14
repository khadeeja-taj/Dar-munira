"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Megaphone, Pin, Paperclip } from "lucide-react";
import { useLang } from "@/lib/i18n/provider";
import { Reveal } from "@/components/ui/Reveal";
import { formatDate } from "@/lib/utils";

interface Announcement {
  id: string;
  titleEn: string;
  titleAr: string;
  bodyEn: string;
  bodyAr: string;
  category: string;
  pinned: boolean;
  imageMime?: string | null;
  fileMime?: string | null;
  fileName?: string | null;
  createdAt: string;
}

const categoryTone: Record<string, string> = {
  news: "bg-teal/10 text-teal",
  course: "bg-leaf/15 text-emerald-deep",
  event: "bg-emerald/10 text-emerald",
  deadline: "bg-rose-100 text-rose-600",
  notice: "bg-amber-100 text-amber-700",
};

export function News() {
  const { d, lang } = useLang();
  const [items, setItems] = useState<Announcement[] | null>(null);

  useEffect(() => {
    fetch("/api/announcements")
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((res) => setItems(res.data || []))
      .catch(() => setItems([]));
  }, []);

  return (
    <section id="news" className="scroll-mt-24 py-20">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="section-kicker">{d.news.kicker}</span>
          <h2 className="mt-3 font-display text-4xl text-emerald-deep">
            {d.news.title}
          </h2>
          <p className="mt-4 leading-relaxed text-brand-muted">{d.news.lead}</p>
        </Reveal>

        {items && items.length === 0 && (
          <div className="mx-auto mt-12 max-w-md rounded-2xl border border-dashed border-emerald/20 bg-white/50 p-10 text-center">
            <Megaphone className="mx-auto h-8 w-8 text-emerald/50" />
            <p className="mt-3 text-sm text-brand-muted">{d.news.empty}</p>
          </div>
        )}

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {(items || Array.from({ length: 3 })).map((a: any, i) => (
            <Reveal key={a?.id || i} delay={i * 0.06}>
              {a ? (
                <article className="glass h-full rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <span
                      className={`chip ${categoryTone[a.category] || categoryTone.news}`}
                    >
                      {a.category}
                    </span>
                    {a.pinned && <Pin className="h-4 w-4 text-leaf" />}
                  </div>
                  {a.imageMime && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={`/api/announcements/${a.id}/image`}
                      alt={lang === "ar" ? a.titleAr : a.titleEn}
                      className="mt-4 w-full rounded-xl object-contain"
                    />
                  )}
                  {(a.titleEn || a.titleAr) && (
                    <h3 className="mt-4 font-display text-xl text-emerald-deep">
                      {(lang === "ar" ? a.titleAr : a.titleEn) ||
                        a.titleEn ||
                        a.titleAr}
                    </h3>
                  )}
                  {(a.bodyEn || a.bodyAr) && (
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-brand-muted">
                      {(lang === "ar" ? a.bodyAr : a.bodyEn) ||
                        a.bodyEn ||
                        a.bodyAr}
                    </p>
                  )}
                  {a.fileMime && (
                    <a
                      href={`/api/announcements/${a.id}/file`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-teal hover:underline"
                    >
                      <Paperclip className="h-4 w-4" />
                      {lang === "ar" ? "تحميل الملف" : "Download file"}
                    </a>
                  )}
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-brand-muted">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(a.createdAt, lang)}
                  </div>
                </article>
              ) : (
                <div className="h-52 animate-pulse rounded-2xl bg-white/40" />
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
