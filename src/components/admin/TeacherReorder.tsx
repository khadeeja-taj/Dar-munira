"use client";

import { useEffect, useRef, useState } from "react";
import { GripVertical, ArrowUp, ArrowDown, Save, Check, Loader2 } from "lucide-react";
import { useLang } from "@/lib/i18n/provider";
import { initials } from "@/lib/utils";

type Teacher = { id: string; fullName: string };

function move<T>(arr: T[], from: number, to: number): T[] {
  const next = arr.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

// Admin-only: drag teacher cards up/down to set the exact order shown on the
// public Teachers section, then "Save Order" persists it to the database.
// Uses Pointer Events so a single code path works for mouse and touch.
export function TeacherReorder() {
  const { d, lang } = useLang();
  const ar = lang === "ar";

  const [items, setItems] = useState<Teacher[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedTick, setSavedTick] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const rowRefs = useRef<Map<string, HTMLLIElement>>(new Map());

  useEffect(() => {
    let active = true;
    fetch("/api/teachers")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (active && json?.data) setItems(json.data as Teacher[]);
      })
      .catch(() => {})
      .finally(() => active && setLoaded(true));
    return () => {
      active = false;
    };
  }, []);

  function reorder(from: number, to: number) {
    if (to < 0 || to >= items.length || from === to) return;
    setItems((cur) => move(cur, from, to));
    setDirty(true);
    setSavedTick(false);
  }

  // ---- Pointer drag on the grip handle ----
  function onHandleDown(e: React.PointerEvent, id: string) {
    e.preventDefault();
    setDraggingId(id);
    setSavedTick(false);
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  }

  function onHandleMove(e: React.PointerEvent, id: string) {
    if (draggingId !== id) return;
    e.preventDefault();
    const y = e.clientY;
    // Find the slot whose vertical midpoint sits below the pointer.
    let target = items.length - 1;
    for (let i = 0; i < items.length; i++) {
      const el = rowRefs.current.get(items[i].id);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (y < r.top + r.height / 2) {
        target = i;
        break;
      }
    }
    const from = items.findIndex((it) => it.id === id);
    if (from !== -1 && target !== from) {
      setItems((cur) => move(cur, from, target));
      setDirty(true);
    }
  }

  function onHandleUp(e: React.PointerEvent) {
    setDraggingId(null);
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  }

  async function saveOrder() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/instructors/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: items.map((t) => t.id) }),
      });
      if (!res.ok) throw new Error("save failed");
      setDirty(false);
      setSavedTick(true);
    } catch {
      setError(ar ? "تعذّر حفظ الترتيب. حاولي مرة أخرى." : "Could not save the order. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loaded && items.length === 0) return null; // nothing to arrange yet

  return (
    <section className="admin-surface mb-6 rounded-2xl border border-emerald/10 bg-white/80 p-5 shadow-card">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg text-emerald-deep">
            {ar ? "ترتيب المعلمين" : "Arrange Teachers"}
          </h3>
          <p className="mt-1 text-sm text-brand-muted">
            {ar
              ? "اسحبي البطاقة لأعلى أو لأسفل (أو استخدمي الأسهم) لإعادة الترتيب، ثم احفظي."
              : "Drag a card up or down (or use the arrows) to reorder, then save."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {savedTick && !dirty && (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald">
              <Check className="h-4 w-4" />
              {ar ? "تم حفظ الترتيب" : "Order saved"}
            </span>
          )}
          <button
            type="button"
            onClick={saveOrder}
            disabled={saving || !dirty}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving
              ? ar
                ? "جارٍ الحفظ…"
                : "Saving…"
              : ar
                ? "حفظ الترتيب"
                : "Save Order"}
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-3 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">
          {error}
        </p>
      )}

      {!loaded ? (
        <p className="py-6 text-center text-sm text-brand-muted">
          {ar ? "جارٍ التحميل…" : "Loading…"}
        </p>
      ) : (
        <ul className={draggingId ? "space-y-2 select-none" : "space-y-2"}>
          {items.map((t, i) => {
            const active = draggingId === t.id;
            return (
              <li
                key={t.id}
                ref={(el) => {
                  if (el) rowRefs.current.set(t.id, el);
                  else rowRefs.current.delete(t.id);
                }}
                className={
                  "flex items-center gap-3 rounded-xl border bg-white p-3 transition-shadow " +
                  (active
                    ? "border-emerald/40 shadow-glass ring-2 ring-emerald/30"
                    : "border-emerald/10")
                }
              >
                {/* Drag handle — touch-action:none lets touch drag from here without scrolling */}
                <button
                  type="button"
                  aria-label={ar ? "اسحبي لإعادة الترتيب" : "Drag to reorder"}
                  onPointerDown={(e) => onHandleDown(e, t.id)}
                  onPointerMove={(e) => onHandleMove(e, t.id)}
                  onPointerUp={onHandleUp}
                  onPointerCancel={onHandleUp}
                  style={{ touchAction: "none" }}
                  className="grid h-9 w-9 shrink-0 cursor-grab touch-none place-items-center rounded-lg text-emerald-deep/60 hover:bg-emerald/8 active:cursor-grabbing"
                >
                  <GripVertical className="h-5 w-5" />
                </button>

                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald via-emerald-soft to-teal font-display text-sm text-white">
                  {initials(t.fullName)}
                </span>

                <div className="min-w-0 flex-1">
                  <p
                    className={
                      ar
                        ? "truncate font-arabic text-base text-emerald-deep"
                        : "truncate font-display text-base text-emerald-deep"
                    }
                  >
                    {t.fullName}
                  </p>
                  <p className="text-xs font-medium text-teal">{d.teachers.role}</p>
                </div>

                <span className="shrink-0 text-xs font-semibold text-brand-muted">
                  #{i + 1}
                </span>

                {/* Up / down fallback — reliable everywhere, including touch */}
                <div className="flex shrink-0 flex-col">
                  <button
                    type="button"
                    aria-label={ar ? "تحريك لأعلى" : "Move up"}
                    onClick={() => reorder(i, i - 1)}
                    disabled={i === 0}
                    className="grid h-6 w-7 place-items-center rounded text-emerald-deep/70 hover:bg-emerald/8 disabled:opacity-30"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={ar ? "تحريك لأسفل" : "Move down"}
                    onClick={() => reorder(i, i + 1)}
                    disabled={i === items.length - 1}
                    className="grid h-6 w-7 place-items-center rounded text-emerald-deep/70 hover:bg-emerald/8 disabled:opacity-30"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
