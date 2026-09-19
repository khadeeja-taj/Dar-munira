import { prisma } from "@/lib/db";
import { ok, fail } from "@/lib/api";

export const runtime = "nodejs";
// Always read fresh so newly added teachers show up immediately.
export const dynamic = "force-dynamic";

// Public: list the teachers to display on the site. These are the instructor
// records an admin has added (or approved) in the admin panel — status APPROVED.
// Nothing is shown until an admin adds a teacher.
export async function GET() {
  try {
    const teachers = await prisma.instructorApplication.findMany({
      where: { status: "APPROVED" },
      select: { id: true, fullName: true },
      orderBy: { createdAt: "asc" },
    });
    return ok(teachers);
  } catch {
    return fail("Could not load teachers", 500);
  }
}
