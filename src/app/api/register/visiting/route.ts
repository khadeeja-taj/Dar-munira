import { prisma } from "@/lib/db";
import { ok, fail, rateLimit, clientIp } from "@/lib/api";
import { visitingSchema } from "@/lib/validations";
import { processFormFiles } from "@/lib/uploads";
import { sanitizeText } from "@/lib/utils";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!rateLimit(`visiting:${clientIp(req)}`, 6, 60_000)) {
    return fail("Too many requests. Please try again shortly.", 429);
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return fail("Invalid form submission", 400);
  }

  const raw = form.get("payload");
  if (typeof raw !== "string") return fail("Missing payload", 400);

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return fail("Malformed payload", 400);
  }

  const parsed = visitingSchema.safeParse(json);
  if (!parsed.success) {
    return fail("Validation failed", 422, parsed.error.flatten());
  }
  const v = parsed.data;

  const dup = await prisma.visitingTeacherApplication.findFirst({
    where: { OR: [{ email: v.email }, { phone: v.phone }] },
    select: { id: true },
  });
  if (dup) return fail("DUPLICATE", 409);

  let files;
  try {
    files = await processFormFiles(form);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "File upload failed", 400);
  }

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
        files: { create: files },
      },
      select: { id: true },
    });
    return ok({ id: created.id }, 201);
  } catch {
    return fail("Could not save your request", 500);
  }
}
