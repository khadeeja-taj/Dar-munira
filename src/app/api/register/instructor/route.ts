import { prisma } from "@/lib/db";
import { ok, fail, rateLimit, clientIp } from "@/lib/api";
import { instructorSchema } from "@/lib/validations";
import { processFormFiles } from "@/lib/uploads";
import { sanitizeText } from "@/lib/utils";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!rateLimit(`instructor:${clientIp(req)}`, 6, 60_000)) {
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

  const parsed = instructorSchema.safeParse(json);
  if (!parsed.success) {
    return fail("Validation failed", 422, parsed.error.flatten());
  }
  const v = parsed.data;

  const dup = await prisma.instructorApplication.findFirst({
    where: {
      OR: [{ email: v.email }, { phone: v.phone }, { employeeNo: v.employeeNo }],
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
    const created = await prisma.instructorApplication.create({
      data: {
        fullName: sanitizeText(v.fullName),
        email: v.email.toLowerCase(),
        phone: v.phone,
        nationality: sanitizeText(v.nationality),
        employeeNo: sanitizeText(v.employeeNo),
        universityId: v.universityId ? sanitizeText(v.universityId) : null,
        department: v.department ? sanitizeText(v.department) : null,
        specialization: v.specialization ? sanitizeText(v.specialization) : null,
        academicLevel: v.academicLevel || null,
        course: v.course,
        courseLevel: v.courseLevel || null,
        taughtBefore: v.taughtBefore,
        highestLevelTaught: v.highestLevelTaught || null,
        instituteName: v.instituteName ? sanitizeText(v.instituteName) : null,
        experienceYears: v.experienceYears,
        teachingMode: v.teachingMode,
        files: { create: files },
      },
      select: { id: true },
    });
    return ok({ id: created.id }, 201);
  } catch {
    return fail("Could not save your application", 500);
  }
}
