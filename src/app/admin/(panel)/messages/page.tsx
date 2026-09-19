"use client";

import { useEffect, useState } from "react";
import { Mail, Trash2, Check, Inbox, CornerUpLeft } from "lucide-react";
import { formatDateTime, cn } from "@/lib/utils";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  handled: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const [items, setItems] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/messages");
    if (res.ok) setItems((await res.json()).data);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function toggle(id: string, handled: boolean) {
    await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handled }),
    });
    setItems((prev) => prev.map((m) => (m.id === id ? { ...m, handled } : m)));
  }

  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((m) => m.id !== id));
  }

  const unread = items.filter((m) => !m.handled).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl text-emerald-deep dark:text-white">
          Messages
        </h1>
        <p className="text-sm text-brand-muted dark:text-white/60">
          Contact-form messages from the website · {unread} unread
        </p>
      </div>

      {loading ? (
        <p className="text-brand-muted">Loading…</p>
      ) : items.length === 0 ? (
        <div className="admin-surface rounded-2xl border border-dashed border-emerald/20 bg-white/60 p-12 text-center">
          <Inbox className="mx-auto h-8 w-8 text-emerald/50" />
          <p className="mt-3 text-sm text-brand-muted">No messages yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((m) => (
            <div
              key={m.id}
              className={cn(
                "admin-surface rounded-2xl border p-5",
                m.handled
                  ? "border-emerald/10 bg-white/60"
                  : "border-leaf/40 bg-white/90",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald/10 text-emerald">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-emerald-deep dark:text-white">
                        {m.name}
                        {!m.handled && (
                          <span className="ms-2 rounded-full bg-leaf/20 px-2 py-0.5 text-[10px] font-bold text-emerald-deep">
                            NEW
                          </span>
                        )}
                      </p>
                      <a
                        href={`mailto:${m.email}`}
                        className="text-xs text-teal hover:underline"
                      >
                        {m.email}
                      </a>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-brand-muted">
                  {formatDateTime(m.createdAt)}
                </span>
              </div>

              {m.subject && (
                <p className="mt-3 font-medium text-emerald-deep dark:text-white">
                  {m.subject}
                </p>
              )}
              <p className="mt-1 whitespace-pre-wrap text-sm text-brand-muted dark:text-white/70">
                {m.message}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={`mailto:${m.email}?subject=${encodeURIComponent(
                    "Re: " + (m.subject || "Your message to Dar Munira"),
                  )}`}
                  className="btn-ghost !py-1.5 text-xs"
                >
                  <CornerUpLeft className="h-3.5 w-3.5" /> Reply by email
                </a>
                <button
                  onClick={() => toggle(m.id, !m.handled)}
                  className="btn-ghost !py-1.5 text-xs"
                >
                  <Check className="h-3.5 w-3.5" />
                  {m.handled ? "Mark unread" : "Mark handled"}
                </button>
                <button
                  onClick={() => remove(m.id)}
                  className="btn !py-1.5 text-xs border border-rose-200 text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
