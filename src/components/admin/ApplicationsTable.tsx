"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Download,
  Printer,
  FileText,
  Eye,
  Trash2,
  Check,
  X,
  Archive,
  Filter,
  FileDown,
  Pencil,
  Save,
  Plus,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { COURSES, INSTRUCTOR_COURSES, STATUS_META, courseLabel } from "@/lib/constants";
import { formatDate, formatBytes, cn } from "@/lib/utils";

type Kind = "student" | "instructor" | "visiting";

interface FileRec {
  id: string;
  label: string;
  originalName: string;
  mimeType: string;
  size: number;
}
interface AppRec {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  department?: string | null;
  course: string;
  status: string;
  createdAt: string;
  files: FileRec[];
  [k: string]: any;
}

const statusTone: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-emerald/10 text-emerald",
  REJECTED: "bg-rose-100 text-rose-600",
  ARCHIVED: "bg-slate-200 text-slate-600",
};

export function ApplicationsTable({ kind }: { kind: Kind }) {
  const [rows, setRows] = useState<AppRec[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [course, setCourse] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selected, setSelected] = useState<AppRec | null>(null);

  const courseList = kind === "instructor" ? INSTRUCTOR_COURSES : COURSES;

  // Admin-create — add a teacher (or visiting teacher) record directly.
  const emptyCreate = {
    fullName: "",
    email: "",
    phone: "",
    nationality: "",
    employeeNo: "",
    department: "",
    course: "",
    preferredDate: "",
    preferredTime: "",
    daysCount: "",
    status: "APPROVED",
    notes: "",
  };
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState(emptyCreate);
  // Free-text course, used when "Other" is chosen in the Course dropdown.
  const [customCourse, setCustomCourse] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  async function createRecord(e: React.FormEvent) {
    e.preventDefault();
    setCreateError(null);

    // Resolve the course: if "Other" was chosen, use the typed value.
    const resolvedCourse =
      createForm.course === "__other__"
        ? customCourse.trim()
        : createForm.course;
    if (!resolvedCourse) {
      setCreateError(
        createForm.course === "__other__"
          ? "Please type the course name."
          : "Please select a course.",
      );
      return;
    }

    setCreating(true);
    const endpoint =
      kind === "instructor" ? "/api/admin/instructors" : "/api/admin/visiting";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...createForm, course: resolvedCourse }),
    });
    setCreating(false);
    if (res.ok) {
      const json = await res.json();
      setRows((prev) => [json.data, ...prev]);
      setCreateForm(emptyCreate);
      setCustomCourse("");
      setShowCreate(false);
    } else {
      setCreateError("Please check the fields (name, email, phone and course are required).");
    }
  }

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ kind });
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    if (course) params.set("course", course);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const res = await fetch(`/api/admin/applications?${params}`);
    if (res.ok) {
      const json = await res.json();
      setRows(json.data);
    }
    setLoading(false);
  }, [kind, q, status, course, from, to]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const nationalities = useMemo(
    () => Array.from(new Set(rows.map((r) => r.nationality))).sort(),
    [rows],
  );

  async function updateStatus(id: string, newStatus: string) {
    await fetch(`/api/admin/applications/${kind}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)),
    );
    setSelected((s) => (s && s.id === id ? { ...s, status: newStatus } : s));
  }

  async function remove(id: string) {
    if (!confirm("Delete this application and its files? This cannot be undone.")) return;
    await fetch(`/api/admin/applications/${kind}/${id}`, { method: "DELETE" });
    setRows((prev) => prev.filter((r) => r.id !== id));
    setSelected(null);
  }

  function exportCsv() {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Nationality",
      "Department",
      "Course",
      "Status",
      "Date",
    ];
    const lines = rows.map((r) =>
      [
        r.fullName,
        r.email,
        r.phone,
        r.nationality,
        r.department || "",
        courseLabel(r.course, "en"),
        r.status,
        formatDate(r.createdAt),
      ]
        .map((c) => `"${String(c).replace(/"/g, '""')}"`)
        .join(","),
    );
    const csv = [headers.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${kind}-applications-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportPdf() {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(16);
    doc.setTextColor(11, 93, 59);
    doc.text(
      `Dar Munira — ${kind === "instructor" ? "Instructor" : "Student"} Applications`,
      14,
      16,
    );
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(`Generated ${new Date().toLocaleString()}`, 14, 22);
    autoTable(doc, {
      startY: 28,
      head: [["Name", "Email", "Phone", "Nationality", "Course", "Status", "Date"]],
      body: rows.map((r) => [
        r.fullName,
        r.email,
        r.phone,
        r.nationality,
        courseLabel(r.course, "en"),
        r.status,
        formatDate(r.createdAt),
      ]),
      headStyles: { fillColor: [11, 93, 59] },
      styles: { fontSize: 8, cellPadding: 2 },
      alternateRowStyles: { fillColor: [244, 248, 242] },
    });
    doc.save(`${kind}-applications-${Date.now()}.pdf`);
  }

  // Apply an edited record from the drawer back into the table.
  function applyEdit(updated: AppRec) {
    setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setSelected(updated);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-emerald-deep dark:text-white">
            {kind === "instructor"
              ? "Teachers"
              : kind === "visiting"
                ? "Visiting Teachers"
                : "Students"}
          </h1>
          <p className="text-sm text-brand-muted dark:text-white/60">
            {rows.length} record{rows.length !== 1 && "s"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(kind === "visiting" || kind === "instructor") && (
            <button
              onClick={() => setShowCreate((s) => !s)}
              className="btn-primary !py-2 text-sm"
            >
              <Plus className="h-4 w-4" />{" "}
              {kind === "instructor" ? "Add Teacher" : "Add Visiting Teacher"}
            </button>
          )}
          <button onClick={exportCsv} className="btn-ghost !py-2 text-sm">
            <Download className="h-4 w-4" /> Excel / CSV
          </button>
          <button onClick={exportPdf} className="btn-ghost !py-2 text-sm">
            <FileDown className="h-4 w-4" /> PDF
          </button>
          <button onClick={() => window.print()} className="btn-ghost !py-2 text-sm">
            <Printer className="h-4 w-4" /> Print
          </button>
        </div>
      </div>

      {/* Admin create (Teacher / Visiting Teacher) */}
      {(kind === "visiting" || kind === "instructor") && showCreate && (
        <form
          onSubmit={createRecord}
          className="admin-surface grid gap-3 rounded-2xl border border-emerald/10 bg-white/80 p-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          <div>
            <label className="field-label">Full Name *</label>
            <input
              className="field-input"
              value={createForm.fullName}
              onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="field-label">Email *</label>
            <input
              type="email"
              className="field-input"
              value={createForm.email}
              onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="field-label">Phone *</label>
            <input
              className="field-input"
              value={createForm.phone}
              onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
              required
            />
          </div>
          {kind === "instructor" && (
            <>
              <div>
                <label className="field-label">Nationality *</label>
                <input
                  className="field-input"
                  value={createForm.nationality}
                  onChange={(e) => setCreateForm({ ...createForm, nationality: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="field-label">Employee / Registration No *</label>
                <input
                  className="field-input"
                  value={createForm.employeeNo}
                  onChange={(e) => setCreateForm({ ...createForm, employeeNo: e.target.value })}
                  required
                />
              </div>
            </>
          )}
          <div>
            <label className="field-label">Department</label>
            <input
              className="field-input"
              value={createForm.department}
              onChange={(e) => setCreateForm({ ...createForm, department: e.target.value })}
            />
          </div>
          <div>
            <label className="field-label">Course *</label>
            <select
              className="field-input"
              value={createForm.course}
              onChange={(e) => setCreateForm({ ...createForm, course: e.target.value })}
              required
            >
              <option value="">Select…</option>
              {COURSES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.en}
                </option>
              ))}
              <option value="__other__">Other (type below)…</option>
            </select>
            {createForm.course === "__other__" && (
              <input
                className="field-input mt-2"
                placeholder="Type the course name"
                value={customCourse}
                onChange={(e) => setCustomCourse(e.target.value)}
                required
              />
            )}
          </div>
          <div>
            <label className="field-label">Status</label>
            <select
              className="field-input"
              value={createForm.status}
              onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
            >
              {Object.keys(STATUS_META).map((s) => (
                <option key={s} value={s}>
                  {STATUS_META[s as keyof typeof STATUS_META].en}
                </option>
              ))}
            </select>
          </div>
          {kind === "visiting" && (
            <>
              <div>
                <label className="field-label">Preferred Date</label>
                <input
                  type="date"
                  className="field-input"
                  value={createForm.preferredDate}
                  onChange={(e) => setCreateForm({ ...createForm, preferredDate: e.target.value })}
                />
              </div>
              <div>
                <label className="field-label">Preferred Time</label>
                <input
                  type="time"
                  className="field-input"
                  value={createForm.preferredTime}
                  onChange={(e) => setCreateForm({ ...createForm, preferredTime: e.target.value })}
                />
              </div>
              <div>
                <label className="field-label">Number of Days</label>
                <input
                  type="number"
                  min={1}
                  className="field-input"
                  value={createForm.daysCount}
                  onChange={(e) => setCreateForm({ ...createForm, daysCount: e.target.value })}
                />
              </div>
            </>
          )}
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="field-label">Notes</label>
            <textarea
              className="field-input"
              rows={2}
              value={createForm.notes}
              onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
            />
          </div>
          {createError && (
            <p className="sm:col-span-2 lg:col-span-3 text-sm font-medium text-rose-600">
              {createError}
            </p>
          )}
          <div className="flex gap-2 sm:col-span-2 lg:col-span-3">
            <button type="submit" disabled={creating} className="btn-accent">
              <Save className="h-4 w-4" />
              {creating ? "Saving…" : "Save Teacher"}
            </button>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="btn-ghost"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="admin-surface flex flex-wrap items-center gap-3 rounded-2xl border border-emerald/10 bg-white/80 p-4">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, phone, ID…"
            className="field-input ps-9"
          />
        </div>
        <div className="flex items-center gap-1.5 text-brand-muted">
          <Filter className="h-4 w-4" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="field-input w-auto">
          <option value="">All statuses</option>
          {Object.keys(STATUS_META).map((s) => (
            <option key={s} value={s}>
              {STATUS_META[s as keyof typeof STATUS_META].en}
            </option>
          ))}
        </select>
        <select value={course} onChange={(e) => setCourse(e.target.value)} className="field-input w-auto">
          <option value="">All courses</option>
          {courseList.map((c) => (
            <option key={c.key} value={c.key}>
              {c.en}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-1.5 text-xs text-brand-muted">
          From
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="field-input w-auto !py-1.5"
          />
        </label>
        <label className="flex items-center gap-1.5 text-xs text-brand-muted">
          To
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="field-input w-auto !py-1.5"
          />
        </label>
        {(q || status || course || from || to) && (
          <button
            onClick={() => {
              setQ("");
              setStatus("");
              setCourse("");
              setFrom("");
              setTo("");
            }}
            className="text-xs font-semibold text-rose-500 hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="admin-surface overflow-hidden rounded-2xl border border-emerald/10 bg-white/80">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-emerald/10 text-left text-xs uppercase tracking-wide text-brand-muted">
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Course</th>
                <th className="px-5 py-3 font-semibold">Nationality</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Files</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-brand-muted">
                    Loading…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-brand-muted">
                    No applications found.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-emerald/5 transition hover:bg-emerald/5"
                  >
                    <td className="px-5 py-3">
                      <p className="font-medium text-emerald-deep dark:text-white">
                        {r.fullName}
                      </p>
                      <p className="text-xs text-brand-muted">{r.email}</p>
                    </td>
                    <td className="px-5 py-3 text-brand-muted dark:text-white/70">
                      {courseLabel(r.course, "en")}
                    </td>
                    <td className="px-5 py-3 text-brand-muted dark:text-white/70">
                      {r.nationality}
                    </td>
                    <td className="px-5 py-3">
                      <select
                        value={r.status}
                        onChange={(e) => updateStatus(r.id, e.target.value)}
                        title="Change status"
                        className={cn(
                          "chip cursor-pointer border-0 pe-6 font-semibold outline-none focus:ring-2 focus:ring-emerald/40",
                          statusTone[r.status],
                        )}
                      >
                        {Object.keys(STATUS_META).map((s) => (
                          <option key={s} value={s} className="bg-white text-emerald-deep">
                            {STATUS_META[s as keyof typeof STATUS_META].en}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3 text-brand-muted dark:text-white/70">
                      {formatDate(r.createdAt)}
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1 text-brand-muted">
                        <FileText className="h-3.5 w-3.5" /> {r.files.length}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setSelected(r)}
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-emerald hover:bg-emerald/10"
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </button>
                        <button
                          onClick={() => remove(r.id)}
                          title="Delete"
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <DetailDrawer
          kind={kind}
          rec={selected}
          onClose={() => setSelected(null)}
          onStatus={updateStatus}
          onDelete={remove}
          onSaved={applyEdit}
        />
      )}
    </div>
  );
}

const EDITABLE: Record<Kind, [string, string][]> = {
  visiting: [
    ["fullName", "Full Name"],
    ["email", "Email"],
    ["phone", "Phone"],
    ["department", "Department"],
    ["preferredDate", "Preferred Date"],
    ["preferredTime", "Preferred Time"],
    ["daysCount", "Number of Days"],
  ],
  student: [
    ["fullName", "Full Name"],
    ["email", "Email"],
    ["phone", "Phone"],
    ["fatherPhone", "Father's Phone"],
    ["nationality", "Nationality"],
    ["registrationNo", "University Registration No"],
    ["department", "Department"],
    ["specialization", "Specialization"],
    ["academicLevel", "Academic Level"],
    ["completedLevel", "Completed Level"],
    ["instituteName", "Institute"],
  ],
  instructor: [
    ["fullName", "Full Name"],
    ["email", "Email"],
    ["phone", "Phone"],
    ["nationality", "Nationality"],
    ["employeeNo", "Employee No"],
    ["department", "Department"],
    ["specialization", "Specialization"],
    ["academicLevel", "Academic Level"],
    ["highestLevelTaught", "Highest Level Taught"],
    ["experienceYears", "Experience"],
    ["teachingMode", "Teaching Mode"],
    ["instituteName", "Institute"],
  ],
};

function DetailDrawer({
  kind,
  rec,
  onClose,
  onStatus,
  onDelete,
  onSaved,
}: {
  kind: Kind;
  rec: AppRec;
  onClose: () => void;
  onStatus: (id: string, s: string) => void;
  onDelete: (id: string) => void;
  onSaved: (updated: AppRec) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  function startEdit() {
    const init: Record<string, string> = {};
    for (const [key] of EDITABLE[kind]) init[key] = (rec as any)[key] ?? "";
    init.notes = rec.notes ?? "";
    setForm(init);
    setEditing(true);
  }

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/admin/applications/${kind}/${rec.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      const json = await res.json();
      onSaved({ ...rec, ...json.data });
      setEditing(false);
    }
  }

  const fields =
    kind === "visiting"
      ? [
          ["Full Name", rec.fullName],
          ["Email", rec.email],
          ["Phone", rec.phone],
          ["Department", rec.department],
          ["Course to Teach", courseLabel(rec.course, "en")],
          ["Preferred Date", rec.preferredDate],
          ["Preferred Time", rec.preferredTime],
          ["Number of Days", rec.daysCount],
        ]
      : kind === "student"
      ? [
          ["Full Name", rec.fullName],
          ["Email", rec.email],
          ["Phone", rec.phone],
          ["Father's Phone", rec.fatherPhone],
          ["Nationality", rec.nationality],
          ["University Registration No", rec.registrationNo],
          ["Department", rec.department],
          ["Specialization", rec.specialization],
          ["Academic Level", rec.academicLevel],
          ["Course", courseLabel(rec.course, "en")],
          ["Course Level", rec.courseLevel],
          ["Qur'an Parts (Juz')", rec.quranParts],
          ["Studied Before", rec.studiedBefore ? "Yes" : "No"],
          ["Completed Level", rec.completedLevel],
          ["Institute", rec.instituteName],
        ]
      : [
          ["Full Name", rec.fullName],
          ["Email", rec.email],
          ["Phone", rec.phone],
          ["Nationality", rec.nationality],
          ["Employee No", rec.employeeNo],
          ["Department", rec.department],
          ["Specialization", rec.specialization],
          ["Academic Level", rec.academicLevel],
          ["Course", courseLabel(rec.course, "en")],
          ["Course Level", rec.courseLevel],
          ["Taught Before", rec.taughtBefore ? "Yes" : "No"],
          ["Highest Level Taught", rec.highestLevelTaught],
          ["Institute", rec.instituteName],
          ["Experience", rec.experienceYears],
          ["Teaching Mode", rec.teachingMode],
        ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <div
        className="h-full w-full max-w-lg overflow-y-auto bg-sand p-6 shadow-glass-lg dark:bg-[#0b1f16]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="font-display text-2xl text-emerald-deep dark:text-white">
              {rec.fullName}
            </h2>
            <span className={cn("chip mt-1", statusTone[rec.status])}>
              {STATUS_META[rec.status as keyof typeof STATUS_META]?.en}
            </span>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-emerald/10">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Actions */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button onClick={() => onStatus(rec.id, "APPROVED")} className="btn-primary !py-2 text-sm">
            <Check className="h-4 w-4" /> Approve
          </button>
          <button
            onClick={() => onStatus(rec.id, "REJECTED")}
            className="btn !py-2 text-sm bg-rose-500 text-white hover:bg-rose-600"
          >
            <X className="h-4 w-4" /> Reject
          </button>
          <button onClick={() => onStatus(rec.id, "ARCHIVED")} className="btn-ghost !py-2 text-sm">
            <Archive className="h-4 w-4" /> Archive
          </button>
          {!editing ? (
            <button onClick={startEdit} className="btn-ghost !py-2 text-sm">
              <Pencil className="h-4 w-4" /> Edit
            </button>
          ) : (
            <button
              onClick={save}
              disabled={saving}
              className="btn !py-2 text-sm bg-leaf text-emerald-deep hover:brightness-105"
            >
              <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save"}
            </button>
          )}
          <button
            onClick={() => onDelete(rec.id)}
            className="btn !py-2 text-sm border border-rose-200 text-rose-600 hover:bg-rose-50"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>

        {/* Fields */}
        {editing ? (
          <div className="admin-surface rounded-2xl border border-emerald/10 bg-white/80 p-5">
            <div className="grid gap-3">
              {EDITABLE[kind].map(([key, label]) => (
                <div key={key}>
                  <label className="mb-1 block text-xs font-medium text-brand-muted">
                    {label}
                  </label>
                  <input
                    value={form[key] ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="field-input !py-2"
                  />
                </div>
              ))}
              <div>
                <label className="mb-1 block text-xs font-medium text-brand-muted">
                  Admin Notes
                </label>
                <textarea
                  value={form.notes ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={2}
                  className="field-input !py-2"
                />
              </div>
              <button
                onClick={() => setEditing(false)}
                className="text-xs font-semibold text-brand-muted hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="admin-surface rounded-2xl border border-emerald/10 bg-white/80 p-5">
            <dl className="grid gap-2">
              {fields.map(([k, v]) => (
                <div key={k as string} className="flex justify-between gap-4 border-b border-emerald/5 py-1.5 text-sm">
                  <dt className="text-brand-muted">{k}</dt>
                  <dd className="text-right font-medium text-emerald-deep dark:text-white">
                    {v || "—"}
                  </dd>
                </div>
              ))}
              {rec.notes && (
                <div className="mt-1 rounded-lg bg-emerald/5 p-2 text-xs text-emerald-deep dark:text-white/80">
                  <span className="font-semibold">Notes:</span> {rec.notes}
                </div>
              )}
            </dl>
          </div>
        )}

        {/* Files */}
        <h3 className="mb-3 mt-6 font-display text-lg text-emerald-deep dark:text-white">
          Documents ({rec.files.length})
        </h3>
        <div className="space-y-2">
          {rec.files.length === 0 && (
            <p className="text-sm text-brand-muted">No documents uploaded.</p>
          )}
          {rec.files.map((f) => (
            <div
              key={f.id}
              className="admin-surface flex items-center gap-3 rounded-xl border border-emerald/10 bg-white/80 p-3"
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-lg bg-emerald/5">
                {f.mimeType.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`/api/admin/files/${f.id}`}
                    alt={f.label}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FileText className="h-5 w-5 text-teal" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-emerald-deep dark:text-white">
                  {f.label}
                </p>
                <p className="text-xs text-brand-muted">
                  {f.originalName} · {formatBytes(f.size)}
                </p>
              </div>
              <a
                href={`/api/admin/files/${f.id}`}
                target="_blank"
                rel="noreferrer"
                className="grid h-8 w-8 place-items-center rounded-lg text-teal hover:bg-teal/10"
                title="Preview"
              >
                <Eye className="h-4 w-4" />
              </a>
              <a
                href={`/api/admin/files/${f.id}?download=1`}
                className="grid h-8 w-8 place-items-center rounded-lg text-emerald hover:bg-emerald/10"
                title="Download"
              >
                <Download className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
