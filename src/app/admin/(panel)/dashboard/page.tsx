"use client";

import { useEffect, useState } from "react";
import {
  GraduationCap,
  Users,
  UserPlus,
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { StatCard, ChartCard } from "@/components/admin/StatCard";
import { DonutChart, BarsChart, TrendChart } from "@/components/admin/Charts";
import { courseLabel, STATUS_META } from "@/lib/constants";
import { formatDate, cn } from "@/lib/utils";

interface Row {
  id: string;
  kind: string;
  fullName: string;
  course: string;
  nationality: string;
  status: string;
  createdAt: string;
}

const statusTone: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-emerald/10 text-emerald",
  REJECTED: "bg-rose-100 text-rose-600",
  ARCHIVED: "bg-slate-200 text-slate-600",
};

function MiniTable({ title, rows, href }: { title: string; rows: Row[]; href: string }) {
  return (
    <div className="admin-surface rounded-2xl border border-emerald/10 bg-white/80 p-5 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-lg text-emerald-deep dark:text-white">{title}</h3>
        <Link href={href} className="text-xs font-semibold text-emerald hover:underline">
          View all →
        </Link>
      </div>
      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-brand-muted">Nothing yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-brand-muted">
                <th className="pb-2 font-semibold">Name</th>
                <th className="pb-2 font-semibold">Type</th>
                <th className="pb-2 font-semibold">Course</th>
                <th className="pb-2 font-semibold">Status</th>
                <th className="pb-2 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.kind + r.id} className="border-t border-emerald/5">
                  <td className="py-2 font-medium text-emerald-deep dark:text-white">{r.fullName}</td>
                  <td className="py-2 capitalize text-brand-muted">{r.kind}</td>
                  <td className="py-2 text-brand-muted">{courseLabel(r.course, "en")}</td>
                  <td className="py-2">
                    <span className={cn("chip", statusTone[r.status])}>
                      {STATUS_META[r.status as keyof typeof STATUS_META]?.en || r.status}
                    </span>
                  </td>
                  <td className="py-2 text-brand-muted">{formatDate(r.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

interface Stats {
  totals: {
    students: number;
    instructors: number;
    visiting: number;
    registrations: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  studentStatus: Record<string, number>;
  byCourse: { name: string; value: number }[];
  byNationality: { name: string; value: number }[];
  byDepartment: { name: string; value: number }[];
  byAcademicLevel: { name: string; value: number }[];
  visitingByCourse: { name: string; value: number }[];
  visitingByDepartment: { name: string; value: number }[];
  visitingStatus: Record<string, number>;
  monthly: { month: string; students: number; instructors: number }[];
  recent: Row[];
  pending: Row[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((res) => setStats(res.data))
      .catch(() => setError(true));
  }, []);

  if (error)
    return <p className="text-rose-500">Failed to load statistics.</p>;
  if (!stats)
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/50" />
        ))}
      </div>
    );

  const courseData = stats.byCourse.map((c) => ({
    name: courseLabel(c.name, "en"),
    value: c.value,
  }));
  const statusData = Object.entries(stats.studentStatus).map(([k, v]) => ({
    name: STATUS_META[k as keyof typeof STATUS_META]?.en || k,
    value: v,
  }));
  const visitingCourseData = stats.visitingByCourse.map((c) => ({
    name: courseLabel(c.name, "en"),
    value: c.value,
  }));
  const visitingStatusData = Object.entries(stats.visitingStatus).map(([k, v]) => ({
    name: STATUS_META[k as keyof typeof STATUS_META]?.en || k,
    value: v,
  }));
  const hasVisiting = stats.totals.visiting > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-emerald-deep dark:text-white">
          Overview
        </h1>
        <p className="text-sm text-brand-muted dark:text-white/60">
          Assalamu alaikum — here is what's happening across Dar Munira.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
        <StatCard icon={GraduationCap} label="Total Students" value={stats.totals.students} tone="emerald" />
        <StatCard icon={Users} label="Total Teachers" value={stats.totals.instructors} tone="teal" />
        <StatCard icon={UserPlus} label="Visiting Teachers" value={stats.totals.visiting} tone="teal" />
        <StatCard icon={ClipboardList} label="Total Registrations" value={stats.totals.registrations} tone="leaf" />
        <StatCard icon={Clock} label="Pending" value={stats.totals.pending} tone="amber" />
        <StatCard icon={CheckCircle2} label="Approved" value={stats.totals.approved} tone="emerald" />
        <StatCard icon={XCircle} label="Rejected" value={stats.totals.rejected} tone="rose" />
      </div>

      {/* Charts row 1 */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard title="Monthly Registrations (last 6 months)">
            <TrendChart data={stats.monthly} />
          </ChartCard>
        </div>
        <ChartCard title="Student Status">
          <DonutChart data={statusData} />
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Registrations by Course">
          <BarsChart data={courseData} />
        </ChartCard>
        <ChartCard title="Nationality Distribution">
          <DonutChart data={stats.byNationality} />
        </ChartCard>
      </div>

      {/* Charts row 3 */}
      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Departments">
          <BarsChart data={stats.byDepartment} color="#16788F" />
        </ChartCard>
        <ChartCard title="Academic Levels">
          <DonutChart data={stats.byAcademicLevel} />
        </ChartCard>
      </div>

      {/* Visiting Teachers analytics */}
      {hasVisiting && (
        <div>
          <h2 className="mb-3 font-display text-2xl text-emerald-deep dark:text-white">
            Visiting Teachers
          </h2>
          <div className="grid gap-5 lg:grid-cols-3">
            <ChartCard title="By Course">
              <BarsChart data={visitingCourseData} color="#16788F" />
            </ChartCard>
            <ChartCard title="By Status">
              <DonutChart data={visitingStatusData} />
            </ChartCard>
            <ChartCard title="By Department">
              <DonutChart data={stats.visitingByDepartment} />
            </ChartCard>
          </div>
        </div>
      )}

      {/* Tables */}
      <MiniTable
        title="Recent Registrations"
        rows={stats.recent}
        href="/admin/students"
      />
      <MiniTable
        title="Pending Applications"
        rows={stats.pending}
        href="/admin/students"
      />
    </div>
  );
}
