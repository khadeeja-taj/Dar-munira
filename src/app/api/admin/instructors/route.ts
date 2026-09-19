import { prisma } from "@/lib/db";
import { ok, fail, requireAdmin } from "@/lib/api";
import { instructorAdminSchema } from "@/lib/validations";
import { sanitizeText } from "@/lib/utils";

export const runtime = "nodejs";

// Admin-only: create a Teacher (instructor) record directly (no public form / CV),
// e.g. to add an existing or previously known teacher into the records.
export async function POST(req: Request) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  const json = await req.json().catch(() => null);
  const parsed = instructorAdminSchema.safeParse(json);
  if (!parsed.success) {
    return fail("Validation failed", 422, parsed.error.flatten());
  }
  const v = parsed.data;

  try {
    const created = await prisma.instructorApplication.create({
      data: {
        fullName: sanitizeText(v.fullName),
        email: v.email.toLowerCase(),
        phone: v.phone,
        nationality: sanitizeText(v.nationality),
        employeeNo: sanitizeText(v.employeeNo),
        department: v.department ? sanitizeText(v.department) : null,
        course: v.course,
        status: v.status,
        notes: v.notes ? sanitizeText(v.notes) : null,
      },
      include: { files: true },
    });
    return ok(created, 201);
  } catch {
    return fail("Could not create the record", 500);
  }
}
