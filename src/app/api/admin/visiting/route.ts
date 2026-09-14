import { prisma } from "@/lib/db";
import { ok, fail, requireAdmin } from "@/lib/api";
import { visitingAdminSchema } from "@/lib/validations";
import { sanitizeText } from "@/lib/utils";

export const runtime = "nodejs";

// Admin-only: create a Visiting Teacher record directly (no public form / CV),
// e.g. to add an existing or previously known teacher into the records.
export async function POST(req: Request) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  const json = await req.json().catch(() => null);
  const parsed = visitingAdminSchema.safeParse(json);
  if (!parsed.success) {
    return fail("Validation failed", 422, parsed.error.flatten());
  }
  const v = parsed.data;

  try {
    const created = await prisma.visitingTeacherApplication.create({
      data: {
        fullName: sanitizeText(v.fullName),
        phone: v.phone,
        email: v.email.toLowerCase(),
        department: v.department ? sanitizeText(v.department) : null,
        course: v.course,
        preferredTime: v.preferredTime ? sanitizeText(v.preferredTime) : null,
        preferredDate: v.preferredDate ? sanitizeText(v.preferredDate) : null,
        daysCount: v.daysCount ? sanitizeText(v.daysCount) : null,
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
