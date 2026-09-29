"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Play, ImageIcon, Eye, EyeOff } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";

interface Item {
  id: string;
  titleEn: string;
  titleAr: string;
  videoUrl: string | null;
  published: boolean;
  createdAt: string;
}

export default function GalleryAdminPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ titleEn: "", titleAr: "", videoUrl: "" });
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const res = await fetch("/api/admin/gallery");
    if (res.ok) setItems((await res.json()).data);
  }
  useEffect(() => {
    load();
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("Please choose an image.");
      return;
    }
    setSaving(true);
    const fd = new FormData();
    fd.append("image", file);
    fd.append("titleEn", form.titleEn);
    fd.append("titleAr", form.titleAr);
    fd.append("videoUrl", form.videoUrl);
    const res = await fetch("/api/admin/gallery", { method: "POST", body: fd });
    setSaving(false);
    if (res.ok) {
      setForm({ titleEn: "", titleAr: "", videoUrl: "" });
      if (fileRef.current) fileRef.current.value = "";
      setOpen(false);
      load();
    } else {
      const j = await res.json().catch(() => null);
      setError(j?.error || "Upload failed. Use a JPG or PNG image.");
    }
  }

  async function togglePublish(id: string, published: boolean) {
    await fetch(`/api/admin/gallery/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published }),
    });
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, published } : i)));
  }

  async function remove(id: string) {
    if (!confirm("Delete this photo from the gallery?")) return;
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-emerald-deep dark:text-white">
            Gallery
          </h1>
          <p className="text-sm text-brand-muted dark:text-white/60">
            Upload event photos any time — they appear on the website instantly.
          </p>
        </div>
        <button onClick={() => setOpen((o) => !o)} className="btn-primary !py-2 text-sm">
          <Plus className="h-4 w-4" /> Add Photo
        </button>
      </div>

      {open && (
        <form
          onSubmit={create}
          className="admin-surface grid gap-4 rounded-2xl border border-emerald/10 bg-white/80 p-5 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <label className="field-label">Image (JPG or PNG) *</label>
            <input ref={fileRef} type="file" accept="image/*" className="field-input" required />
          </div>
          <div>
            <label className="field-label">Caption (English) *</label>
            <input
              className="field-input"
              value={form.titleEn}
              onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
              required
            />
          </div>
          <div dir="rtl">
            <label className="field-label">التسمية (عربي) *</label>
            <input
              className="field-input"
              value={form.titleAr}
              onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">
              Video link (optional) — makes it a “feature film” with a play button
            </label>
            <input
              className="field-input"
              placeholder="https://youtube.com/…"
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
            />
          </div>
          {error && (
            <p className="sm:col-span-2 text-sm font-medium text-rose-600">{error}</p>
          )}
          <div className="sm:col-span-2 flex gap-2">
            <button disabled={saving} className="btn-accent">
              {saving ? "Uploading…" : "Upload"}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost">
              Cancel
            </button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <div className="admin-surface rounded-2xl border border-dashed border-emerald/20 bg-white/60 p-12 text-center">
          <ImageIcon className="mx-auto h-8 w-8 text-emerald/50" />
          <p className="mt-3 text-sm text-brand-muted">No photos yet. Click “Add Photo”.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div
              key={it.id}
              className="admin-surface overflow-hidden rounded-2xl border border-emerald/10 bg-white/80"
            >
              <div className="relative aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/gallery/${it.id}/image`}
                  alt={it.titleEn}
                  className={cn("h-full w-full object-cover", !it.published && "opacity-40")}
                />
                {it.videoUrl && (
                  <span className="absolute left-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-emerald">
                    <Play className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-medium text-emerald-deep dark:text-white">
                  {it.titleEn}
                </p>
                <p className="truncate text-xs text-brand-muted">{formatDate(it.createdAt)}</p>
                <div className="mt-2 flex items-center justify-between">
                  <button
                    onClick={() => togglePublish(it.id, !it.published)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald hover:underline"
                  >
                    {it.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    {it.published ? "Visible" : "Hidden"}
                  </button>
                  <button
                    onClick={() => remove(it.id)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-rose-500 hover:bg-rose-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
