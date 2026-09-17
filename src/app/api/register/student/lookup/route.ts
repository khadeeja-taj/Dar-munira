import { prisma } from "@/lib/db";
import { ok, fail, rateLimit, clientIp } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public: look up a returning student by University Registration Number.
// Returns their saved profile (for pre-filling) plus the list of courses they
// have already registered for. Nothing sensitive beyond their own record.
export async function GET(req: Request) {
  if (!rateLimit(`lookup:${clientIp(req)}`, 12, 60_000)) {
    return fail("Too many requests. Please try again shortly.", 429);
  }

  const { searchParams } = new URL(req.url);
  const reg = (searchParams.get("reg") || "").trim();
  if (reg.length < 2) return fail("Enter your registration number", 400);

  const select = {
    fullName: true,
    email: true,
    phone: true,
    nationality: true,
    registrationNo: true,
    universityId: true,
    department: true,
    specialization: true,
    academicLevel: true,
    course: true,
    courseLevel: true,
    status: true,
    createdAt: true,
  } as const;

  // Match the registration number regardless of upper/lower case. Portable
  // across SQLite (dev) and PostgreSQL (prod): match the exact value plus its
  // upper- and lower-cased variants, then confirm case-insensitively in JS.
  const variants = Array.from(
    new Set([reg, reg.toUpperCase(), reg.toLowerCase()]),
  );
  const rows = (
    await prisma.studentApplication.findMany({
      where: { registrationNo: { in: variants } },
      orderBy: { createdAt: "desc" },
      select,
    })
  ).filter((r) => r.registrationNo.toLowerCase() === reg.toLowerCase());

  if (rows.length === 0) return ok({ found: false });

  const latest = rows[0];
  return ok({
    found: true,
    profile: {
      fullName: latest.fullName,
      email: latest.email,
      phone: latest.phone,
      nationality: latest.nationality,
      registrationNo: latest.registrationNo,
      universityId: latest.universityId,
      department: latest.department,
      specialization: latest.specialization,
      academicLevel: latest.academicLevel,
    },
    history: rows.map((r) => ({
      course: r.course,
      courseLevel: r.courseLevel,
      status: r.status,
      createdAt: r.createdAt,
    })),
  });
}
