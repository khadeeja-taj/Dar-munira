"use client";

import { useEffect, useState } from "react";
import { Save, Check } from "lucide-react";

type Category = "program" | "course" | "competition";

type Row = {
  id: Category;
  isOpen: boolean;
  messageEn: string;
  messageAr: string;
  url: string;
};

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "program", label: "Programs (البرامج)" },
  { id: "course", label: "Courses (الدورات)" },
  { id: "competition", label: "Competitions (المسابقات)" },
];

function blank(id: Category): Row {
  return { id, isOpen: false, messageEn: "", messageAr: "", url: "" };
}

export default function RegistrationAdminPage() {
  const [rows, setRows] = useState<Row[]>(CATEGORIES.map((c) => blank(c.id)));
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/registration-status")
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        const data: Row[] = json?.data || [];
        setRows(
          CATEGORIES.map((c) => {
            const found = data.find((d) => d.id === c.id);
            return found
              ? {
                  id: c.id,
                  isOpen: !!found.isOpen,
                  messageEn: found.messageEn || "",
                  messageAr: found.messageAr || "",
                  url: found.url || "",
                }
              : blank(c.id);
          }),
        );
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  function update(id: Category, patch: Partial<Row>) {
    setRows((cur) => cur.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/registration-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: rows }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || "save failed");
      }
      setSaved(true);
    } catch {
      setError(
        "Could not save. Make sure any link starts with http:// or https://",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl text-emerald-deep dark:text-white">
          Registration
        </h1>
        <p className="text-sm text-brand-muted dark:text-white/60">
          Set the registration status, message and link shown on the Courses
          page for each category. Changes appear on the public website after you
          save.
        </p>
      </div>

      {loaded &&
        CATEGORIES.map(({ id, label }) => {
          const row = rows.find((r) => r.id === id)!;
          return (
            <div
              key={id}
              className="admin-surface grid gap-4 rounded-2xl border border-emerald/10 bg-white/80 p-5 sm:grid-cols-2"
            >
              <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-lg text-emerald-deep dark:text-white">
                  {label}
                </h2>
                {/* Open / Closed toggle */}
                <div className="inline-flex overflow-hidden rounded-full border border-emerald/20">
                  <button
                    type="button"
                    onClick={() => update(id, { isOpen: true })}
                    className={
                      "px-4 py-1.5 text-sm font-semibold transition " +
                      (row.isOpen
                        ? "bg-emerald text-white"
                        : "bg-transparent text-brand-muted hover:bg-emerald/10")
                    }
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    onClick={() => update(id, { isOpen: false })}
                    className={
                      "px-4 py-1.5 text-sm font-semibold transition " +
                      (!row.isOpen
                        ? "bg-rose-500 text-white"
                        : "bg-transparent text-brand-muted hover:bg-emerald/10")
                    }
                  >
                    Closed
                  </button>
                </div>
              </div>

              <div>
                <label className="field-label">Message (English)</label>
                <input
                  className="field-input"
                  value={row.messageEn}
                  placeholder="e.g. Registration Open — Join us today"
                  onChange={(e) => update(id, { messageEn: e.target.value })}
                />
              </div>
              <div dir="rtl">
                <label className="field-label">الرسالة (عربي)</label>
                <input
                  className="field-input"
                  value={row.messageAr}
                  placeholder="مثال: التسجيل مفتوح — سارعي بالانضمام"
                  onChange={(e) => update(id, { messageAr: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="field-label">
                  Registration link (optional, shown when Open)
                </label>
                <input
                  className="field-input"
                  value={row.url}
                  placeholder="https://…"
                  onChange={(e) => update(id, { url: e.target.value })}
                />
              </div>
            </div>
          );
        })}

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving || !loaded}
          className="btn-accent disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving…" : "Save changes"}
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald">
            <Check className="h-4 w-4" /> Saved
          </span>
        )}
        {error && <span className="text-sm text-rose-600">{error}</span>}
      </div>
    </div>
  );
}
