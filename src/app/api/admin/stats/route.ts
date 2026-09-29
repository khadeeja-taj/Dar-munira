import { prisma } from "@/lib/db";
import { ok, fail, requireAdmin } from "@/lib/api";

export const runtime = "nodejs";

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export async function GET() {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  try {
    const [students, instructors, visiting] = await Promise.all([
      prisma.studentApplication.findMany({
        select: {
          status: true,
          course: true,
          nationality: true,
          department: true,
          academicLevel: true,
          createdAt: true,
        },
      }),
      prisma.instructorApplication.findMany({
        select: {
          status: true,
          course: true,
          nationality: true,
          department: true,
          createdAt: true,
        },
      }),
      prisma.visitingTeacherApplication.findMany({
        select: {
          status: true,
          course: true,
          department: true,
          createdAt: true,
        },
      }),
    ]);

    const all = [...students, ...instructors, ...visiting];

    // Recent registrations + pending applications (all kinds, merged).
    const [recentStudents, recentInstructors, recentVisiting] = await Promise.all([
      prisma.studentApplication.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          fullName: true,
          course: true,
          nationality: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.instructorApplication.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          fullName: true,
          course: true,
          nationality: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.visitingTeacherApplication.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          fullName: true,
          course: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);
    const tag = (rows: any[], kind: string) =>
      rows.map((r) => ({ ...r, kind }));
    const recent = [
      ...tag(recentStudents, "student"),
      ...tag(recentInstructors, "instructor"),
      ...tag(recentVisiting, "visiting"),
    ]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 8);
    const pending = recent.filter((r) => r.status === "PENDING").slice(0, 8);

    const countBy = <T extends { [k: string]: any }>(
      rows: T[],
      key: keyof T,
    ) => {
      const m = new Map<string, number>();
      for (const r of rows) {
        const val = (r[key] as string) || "—";
        m.set(val, (m.get(val) || 0) + 1);
      }
      return Array.from(m.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
    };

    const statusCounts = (rows: { status: string }[]) => ({
      PENDING: rows.filter((r) => r.status === "PENDING").length,
      APPROVED: rows.filter((r) => r.status === "APPROVED").length,
      REJECTED: rows.filter((r) => r.status === "REJECTED").length,
      ARCHIVED: rows.filter((r) => r.status === "ARCHIVED").length,
    });

    // Monthly registrations for the last 6 months.
    const months: { key: string; label: string }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: monthKey(d),
        label: d.toLocaleString("en", { month: "short" }),
      });
    }
    const monthly = months.map((m) => ({
      month: m.label,
      students: students.filter((s) => monthKey(new Date(s.createdAt)) === m.key)
        .length,
      instructors: instructors.filter(
        (s) => monthKey(new Date(s.createdAt)) === m.key,
      ).length,
    }));

    return ok({
      totals: {
        students: students.length,
        instructors: instructors.length,
        visiting: visiting.length,
        registrations: all.length,
        pending: all.filter((r) => r.status === "PENDING").length,
        approved: all.filter((r) => r.status === "APPROVED").length,
        rejected: all.filter((r) => r.status === "REJECTED").length,
      },
      studentStatus: statusCounts(students),
      instructorStatus: statusCounts(instructors),
      byCourse: countBy(all, "course"),
      byNationality: countBy([...students, ...instructors], "nationality").slice(0, 8),
      byDepartment: countBy(all, "department").slice(0, 8),
      byAcademicLevel: countBy(students, "academicLevel"),
      // Visiting-teacher-specific analytics
      visitingByCourse: countBy(visiting, "course"),
      visitingByDepartment: countBy(visiting, "department").slice(0, 8),
      visitingStatus: statusCounts(visiting),
      monthly,
      recent,
      pending,
    });
  } catch {
    return fail("Could not compute statistics", 500);
  }
}
