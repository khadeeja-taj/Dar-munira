"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Eye, EyeOff, Pencil, BookOpen, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseItem {
  id: string;
  category: "program" | "course" | "competition";
  titleEn: string;
  titleAr: string;
  descEn: string | null;
  descAr: string | null;
  published: boolean;
  sortOrder: number;
}

const CATEGORIES = [
  { key: "program", label: "Programs (البرامج)" },
  { key: "course", label: "Courses (الدورات)" },
  { key: "competition", label: "Competitions (المسابقات)" },
] as const;

const empty = {
  category: "program",
  titleEn: "",
  titleAr: "",
  descEn: "",
  descAr: "",
  sortOrder: 0,
  published: true,
};

export default function CoursesAdminPage() {
  const [items, setItems] = useState<CourseItem[]>([]);
  const [form, setForm] = useState<typeof empty>(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/courses");
    if (res.ok) setItems((await res.json()).data);
  }
  useEffect(() => {
    load();
  }, []);

  function startNew() {
    setForm(empty);
    setEditing(null);
    setError(null);
    setOpen(true);
  }

  function startEdit(c: CourseItem) {
    setForm({
      category: c.category,
      titleEn: c.titleEn,
      titleAr: c.titleAr,
      descEn: c.descEn || "",
      descAr: c.descAr || "",
      sortOrder: c.sortOrder,
      published: c.published,
    });
    setEditing(c.id);
    setError(null);
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const url = editing ? `/api/admin/courses/${editing}` : "/api/admin/courses";
    const method = editing ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      setOpen(false);
      setEditing(null);
      setForm(empty);
      load();
    } else {
      setError("Please fill in both English and Arabic titles.");
    }
  }

  async function patch(id: string, data: Partial<CourseItem>) {
    await fetch(`/api/admin/courses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-emerald-deep dark:text-white">
            Courses
          </h1>
          <p className="text-sm text-brand-muted dark:text-white/60">
            Manage Programs, Courses and Competitions shown on the Courses page.
          </p>
        </div>
        <button onClick={startNew} className="btn-primary !py-2 text-sm">
          <Plus className="h-4 w-4" /> New
        </button>
      </div>

      {open && (
        <form
          onSubmit={save}
          className="admin-surface grid gap-4 rounded-2xl border border-emerald/10 bg-white/80 p-5 sm:grid-cols-2"
        >
          <div className="sm:col-span-2 flex items-center justify-between">
            <h2 className="font-display text-lg text-emerald-deep dark:text-white">
              {editing ? "Edit item" : "New item"}
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid h-8 w-8 place-items-center rounded-lg text-brand-muted hover:bg-emerald/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div>
            <label className="field-label">Category</label>
            <select
              className="field-input"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">Order (lower shows first)</label>
            <input
              type="number"
              className="field-input"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="field-label">Title (English)</label>
            <input
              className="field-input"
              value={form.titleEn}
              onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
              required
            />
          </div>
          <div dir="rtl">
            <label className="field-label">العنوان (عربي)</label>
            <input
              className="field-input"
              value={form.titleAr}
              onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="field-label">Description (English)</label>
            <textarea
              className="field-input"
              rows={2}
              value={form.descEn}
              onChange={(e) => setForm({ ...form, descEn: e.target.value })}
            />
          </div>
          <div dir="rtl">
            <label className="field-label">الوصف (عربي)</label>
            <textarea
              className="field-input"
              rows={2}
              value={form.descAr}
              onChange={(e) => setForm({ ...form, descAr: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2 flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-emerald-deep dark:text-white">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              Published (visible on the site)
            </label>
          </div>
          <div className="sm:col-span-2">
            {error && <p className="mb-2 text-sm text-rose-600">{error}</p>}
            <button disabled={saving} className="btn-accent">
              {saving ? "Saving…" : editing ? "Save changes" : "Add item"}
            </button>
          </div>
        </form>
      )}

      {CATEGORIES.map((cat) => {
        const rows = items.filter((i) => i.category === cat.key);
        return (
          <div key={cat.key}>
            <h2 className="mb-2 mt-4 font-display text-lg text-emerald-deep dark:text-white">
              {cat.label}
            </h2>
            {rows.length === 0 ? (
              <div className="admin-surface rounded-2xl border border-dashed border-emerald/20 bg-white/60 p-6 text-center text-sm text-brand-muted">
                <BookOpen className="mx-auto mb-2 h-6 w-6 text-emerald/50" />
                Nothing here yet — click “New” to add.
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {rows.map((c) => (
                  <div
                    key={c.id}
                    className="admin-surface flex items-start justify-between gap-3 rounded-2xl border border-emerald/10 bg-white/80 p-4"
                  >
                    <div className="min-w-0">
                      <p className="font-display text-base text-emerald-deep dark:text-white">
                        {c.titleEn}
                      </p>
                      <p className="font-arabic text-sm text-teal" dir="rtl">
                        {c.titleAr}
                      </p>
                      {c.descEn && (
                        <p className="mt-1 line-clamp-2 text-xs text-brand-muted">
                          {c.descEn}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        onClick={() => patch(c.id, { published: !c.published })}
                        className={cn(
                          "grid h-8 w-8 place-items-center rounded-lg hover:bg-emerald/10",
                          c.published ? "text-emerald" : "text-brand-muted",
                        )}
                        title={c.published ? "Hide" : "Show"}
                      >
                        {c.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => startEdit(c)}
                        className="grid h-8 w-8 place-items-center rounded-lg text-teal hover:bg-emerald/10"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => remove(c.id)}
                        className="grid h-8 w-8 place-items-center rounded-lg text-rose-500 hover:bg-rose-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
