import { prisma } from "@/lib/db";
import { ok, fail, requireAdmin } from "@/lib/api";

export const runtime = "nodejs";

// GET /api/admin/applications?kind=student|instructor&q=&status=&course=&nationality=
export async function GET(req: Request) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  const url = new URL(req.url);
  const kind = url.searchParams.get("kind") || "student";
  const q = url.searchParams.get("q")?.trim() || "";
  const status = url.searchParams.get("status") || "";
  const course = url.searchParams.get("course") || "";
  const nationality = url.searchParams.get("nationality") || "";
  const from = url.searchParams.get("from") || "";
  const to = url.searchParams.get("to") || "";
  const take = Math.min(Number(url.searchParams.get("take")) || 100, 500);

  const where: any = {};
  if (status) where.status = status;
  if (course) where.course = course;
  if (nationality) where.nationality = nationality;
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) {
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }
  if (q) {
    where.OR = [
      { fullName: { contains: q } },
      { email: { contains: q } },
      { phone: { contains: q } },
      { department: { contains: q } },
    ];
    if (kind === "student") {
      where.OR.push({ nationality: { contains: q } });
      where.OR.push({ registrationNo: { contains: q } });
      where.OR.push({ universityId: { contains: q } });
    } else if (kind === "instructor") {
      where.OR.push({ nationality: { contains: q } });
      where.OR.push({ employeeNo: { contains: q } });
    }
  }
  // Visiting teachers have no nationality column.
  if (kind === "visiting" && nationality) delete where.nationality;

  try {
    const model =
      kind === "instructor"
        ? prisma.instructorApplication
        : kind === "visiting"
          ? prisma.visitingTeacherApplication
          : prisma.studentApplication;
    const data = await (model as any).findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      include: {
        // Exclude the heavy `data` bytes from list responses.
        files: {
          select: {
            id: true,
            label: true,
            originalName: true,
            mimeType: true,
            size: true,
            createdAt: true,
          },
        },
      },
    });
    return ok(data);
  } catch {
    return fail("Could not load applications", 500);
  }
}
