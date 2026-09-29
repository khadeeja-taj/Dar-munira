"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Pin, PinOff, Eye, EyeOff, Megaphone, Paperclip } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";

interface Announcement {
  id: string;
  titleEn: string;
  titleAr: string;
  bodyEn: string;
  bodyAr: string;
  category: string;
  pinned: boolean;
  published: boolean;
  imageMime?: string | null;
  fileMime?: string | null;
  fileName?: string | null;
  createdAt: string;
}

const empty = {
  titleEn: "",
  titleAr: "",
  bodyEn: "",
  bodyAr: "",
  category: "news",
  pinned: false,
  published: true,
};

const categories = ["news", "course", "event", "deadline", "notice"];

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [form, setForm] = useState(empty);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const res = await fetch("/api/admin/announcements");
    if (res.ok) setItems((await res.json()).data);
  }
  useEffect(() => {
    load();
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // Send as multipart form data so the optional picture / file upload too.
    const fd = new FormData();
    fd.append("titleEn", form.titleEn);
    fd.append("titleAr", form.titleAr);
    fd.append("bodyEn", form.bodyEn);
    fd.append("bodyAr", form.bodyAr);
    fd.append("category", form.category);
    fd.append("pinned", String(form.pinned));
    fd.append("published", String(form.published));
    const img = imageRef.current?.files?.[0];
    if (img) fd.append("image", img);
    const doc = fileRef.current?.files?.[0];
    if (doc) fd.append("file", doc);

    const res = await fetch("/api/admin/announcements", {
      method: "POST",
      body: fd,
    });
    setSaving(false);
    if (res.ok) {
      setForm(empty);
      if (imageRef.current) imageRef.current.value = "";
      if (fileRef.current) fileRef.current.value = "";
      setOpen(false);
      load();
    } else {
      const j = await res.json().catch(() => null);
      setError(j?.error || "Could not publish. Check the fields and try again.");
    }
  }

  async function patch(id: string, data: Partial<Announcement>) {
    await fetch(`/api/admin/announcements/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this announcement?")) return;
    await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-emerald-deep dark:text-white">
            Announcements
          </h1>
          <p className="text-sm text-brand-muted dark:text-white/60">
            Publish news, events, deadlines and notices to the website.
          </p>
        </div>
        <button onClick={() => setOpen((o) => !o)} className="btn-primary !py-2 text-sm">
          <Plus className="h-4 w-4" /> New
        </button>
      </div>

      {open && (
        <form
          onSubmit={create}
          className="admin-surface grid gap-4 rounded-2xl border border-emerald/10 bg-white/80 p-5 sm:grid-cols-2"
        >
          <div>
            <label className="field-label">Title (English)</label>
            <input
              className="field-input"
              value={form.titleEn}
              onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
            />
          </div>
          <div dir="rtl">
            <label className="field-label">العنوان (عربي)</label>
            <input
              className="field-input"
              value={form.titleAr}
              onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
            />
          </div>
          <div>
            <label className="field-label">Body (English)</label>
            <textarea
              className="field-input"
              rows={3}
              value={form.bodyEn}
              onChange={(e) => setForm({ ...form, bodyEn: e.target.value })}
            />
          </div>
          <div dir="rtl">
            <label className="field-label">النص (عربي)</label>
            <textarea
              className="field-input"
              rows={3}
              value={form.bodyAr}
              onChange={(e) => setForm({ ...form, bodyAr: e.target.value })}
            />
          </div>
          <div>
            <label className="field-label">Category</label>
            <select
              className="field-input"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">Picture (optional)</label>
            <input
              ref={imageRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              className="field-input"
            />
            <p className="mt-1 text-xs text-brand-muted">JPG or PNG, up to 8 MB.</p>
          </div>
          <div>
            <label className="field-label">File attachment (optional)</label>
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf,image/png,image/jpeg,image/jpg"
              className="field-input"
            />
            <p className="mt-1 text-xs text-brand-muted">PDF, JPG or PNG, up to 8 MB.</p>
          </div>
          <div className="flex items-end gap-4">
            <label className="flex items-center gap-2 text-sm text-emerald-deep dark:text-white">
              <input
                type="checkbox"
                checked={form.pinned}
                onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
              />
              Pinned
            </label>
            <label className="flex items-center gap-2 text-sm text-emerald-deep dark:text-white">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              Published
            </label>
          </div>
          <div className="sm:col-span-2">
            {error && <p className="mb-2 text-sm text-rose-600">{error}</p>}
            <button disabled={saving} className="btn-accent">
              {saving ? "Saving…" : "Publish Announcement"}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {items.length === 0 && (
          <div className="admin-surface col-span-full rounded-2xl border border-dashed border-emerald/20 bg-white/60 p-10 text-center">
            <Megaphone className="mx-auto h-8 w-8 text-emerald/50" />
            <p className="mt-3 text-sm text-brand-muted">No announcements yet.</p>
          </div>
        )}
        {items.map((a) => (
          <div
            key={a.id}
            className="admin-surface rounded-2xl border border-emerald/10 bg-white/80 p-5"
          >
            <div className="flex items-center justify-between">
              <span className="chip bg-teal/10 text-teal">{a.category}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => patch(a.id, { pinned: !a.pinned })}
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-lg hover:bg-emerald/10",
                    a.pinned ? "text-leaf" : "text-brand-muted",
                  )}
                  title={a.pinned ? "Unpin" : "Pin"}
                >
                  {a.pinned ? <Pin className="h-4 w-4" /> : <PinOff className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => patch(a.id, { published: !a.published })}
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-lg hover:bg-emerald/10",
                    a.published ? "text-emerald" : "text-brand-muted",
                  )}
                  title={a.published ? "Unpublish" : "Publish"}
                >
                  {a.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => remove(a.id)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-rose-500 hover:bg-rose-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {a.imageMime && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={`/api/announcements/${a.id}/image`}
                alt={a.titleEn}
                className="mt-3 w-full rounded-xl object-contain"
              />
            )}
            {(a.titleEn || a.titleAr) && (
              <h3 className="mt-3 font-display text-lg text-emerald-deep dark:text-white">
                {a.titleEn || a.titleAr}
              </h3>
            )}
            {a.titleEn && a.titleAr && (
              <p className="font-arabic text-base text-teal" dir="rtl">
                {a.titleAr}
              </p>
            )}
            {(a.bodyEn || a.bodyAr) && (
              <p className="mt-2 line-clamp-2 text-sm text-brand-muted">
                {a.bodyEn || a.bodyAr}
              </p>
            )}
            {a.fileMime && (
              <a
                href={`/api/announcements/${a.id}/file`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-teal hover:underline"
              >
                <Paperclip className="h-3.5 w-3.5" />
                {a.fileName || "Attachment"}
              </a>
            )}
            <p className="mt-3 text-xs text-brand-muted">{formatDate(a.createdAt)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
