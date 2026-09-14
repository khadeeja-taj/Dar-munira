import { prisma } from "@/lib/db";
import { ok, fail, rateLimit, clientIp } from "@/lib/api";
import { studentSchema } from "@/lib/validations";
import { processFormFiles } from "@/lib/uploads";
import { sanitizeText } from "@/lib/utils";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!rateLimit(`student:${clientIp(req)}`, 6, 60_000)) {
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

  const parsed = studentSchema.safeParse(json);
  if (!parsed.success) {
    return fail("Validation failed", 422, parsed.error.flatten());
  }
  const v = parsed.data;

  // Prevent duplicate registrations (email / phone / registration number).
  const dup = await prisma.studentApplication.findFirst({
    where: {
      OR: [
        { email: v.email },
        { phone: v.phone },
        { registrationNo: v.registrationNo },
      ],
    },
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
    const created = await prisma.studentApplication.create({
      data: {
        fullName: sanitizeText(v.fullName),
        email: v.email.toLowerCase(),
        phone: v.phone,
        fatherPhone: v.fatherPhone || null,
        nationality: sanitizeText(v.nationality),
        registrationNo: sanitizeText(v.registrationNo),
        universityId: v.universityId ? sanitizeText(v.universityId) : null,
        department: v.department ? sanitizeText(v.department) : null,
        specialization: v.specialization ? sanitizeText(v.specialization) : null,
        academicLevel: v.academicLevel || null,
        course: v.course,
        courseLevel: v.courseLevel || null,
        quranParts: v.quranParts || null,
        studiedBefore: v.studiedBefore,
        completedLevel: v.completedLevel || null,
        instituteName: v.instituteName ? sanitizeText(v.instituteName) : null,
        files: { create: files },
      },
      select: { id: true },
    });
    return ok({ id: created.id }, 201);
  } catch {
    return fail("Could not save your registration", 500);
  }
}
