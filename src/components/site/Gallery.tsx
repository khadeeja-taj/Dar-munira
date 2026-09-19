"use client";

import { useEffect, useState } from "react";
import { Play, X } from "lucide-react";
import { useLang } from "@/lib/i18n/provider";
import { Reveal } from "@/components/ui/Reveal";

interface Item {
  id: string;
  titleEn: string;
  titleAr: string;
  videoUrl: string | null;
  createdAt: string;
}

export function Gallery() {
  const { d, lang } = useLang();
  const [items, setItems] = useState<Item[] | null>(null);
  const [zoom, setZoom] = useState<Item | null>(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((res) => setItems(res.data || []))
      .catch(() => setItems([]));
  }, []);

  // Don't render the section at all if there's nothing to show yet.
  if (items && items.length === 0) return null;

  const caption = (it: Item) => (lang === "ar" ? it.titleAr : it.titleEn);

  return (
    <section id="gallery" className="scroll-mt-24 py-20">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="section-kicker">{d.gallery.kicker}</span>
          <h2 className="mt-3 font-display text-4xl text-emerald-deep">
            {d.gallery.title}
          </h2>
          <p className="mt-4 leading-relaxed text-brand-muted">
            {d.gallery.lead}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(items || Array.from({ length: 6 })).map((it: any, i) =>
            it ? (
              <Reveal key={it.id} delay={(i % 6) * 0.05}>
                <button
                  onClick={() =>
                    it.videoUrl
                      ? window.open(it.videoUrl, "_blank", "noopener")
                      : setZoom(it)
                  }
                  className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border border-emerald/10 shadow-card"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/gallery/${it.id}/image`}
                    alt={caption(it)}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/80 via-emerald-deep/10 to-transparent" />
                  {it.videoUrl && (
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-emerald shadow-glass transition group-hover:scale-110">
                        <Play className="h-6 w-6 translate-x-0.5" />
                      </span>
                    </span>
                  )}
                  <span className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 p-4 text-start text-sm font-semibold text-white">
                    {it.videoUrl && <Play className="h-3.5 w-3.5" />}
                    {caption(it)}
                  </span>
                </button>
              </Reveal>
            ) : (
              <div
                key={i}
                className="aspect-[4/3] animate-pulse rounded-2xl bg-white/40"
              />
            ),
          )}
        </div>
      </div>

      {/* Lightbox */}
      {zoom && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-4"
          onClick={() => setZoom(null)}
        >
          <button
            className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25"
            onClick={() => setZoom(null)}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/gallery/${zoom.id}/image`}
            alt={caption(zoom)}
            className="max-h-[85vh] max-w-full rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-6 inset-x-0 text-center text-sm font-medium text-white/90">
            {caption(zoom)}
          </p>
        </div>
      )}
    </section>
  );
}
