import { prisma } from "@/lib/db";
import { ok, fail, requireAdmin } from "@/lib/api";
import { APPLICATION_STATUSES } from "@/lib/constants";
import { sanitizeText } from "@/lib/utils";

export const runtime = "nodejs";

type Params = { params: { kind: string; id: string } };

function modelFor(kind: string) {
  if (kind === "instructor") return prisma.instructorApplication;
  if (kind === "visiting") return prisma.visitingTeacherApplication;
  return prisma.studentApplication;
}

// PATCH: update status / notes (approve, reject, archive, edit)
export async function PATCH(req: Request, { params }: Params) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  const body = await req.json().catch(() => null);
  if (!body) return fail("Invalid body", 400);

  const data: Record<string, unknown> = {};
  if (typeof body.status === "string") {
    if (!APPLICATION_STATUSES.includes(body.status)) {
      return fail("Invalid status", 422);
    }
    data.status = body.status;
  }
  if (typeof body.notes === "string") data.notes = sanitizeText(body.notes);

  // Whitelisted editable fields (admin "Edit" in the drawer).
  const commonEditable = [
    "fullName",
    "email",
    "phone",
    "nationality",
    "department",
    "specialization",
    "academicLevel",
    "instituteName",
  ];
  const studentEditable = ["fatherPhone", "registrationNo", "completedLevel"];
  const instructorEditable = [
    "employeeNo",
    "highestLevelTaught",
    "experienceYears",
    "teachingMode",
  ];
  const visitingEditable = ["preferredTime", "preferredDate", "daysCount"];
  const editable = [
    ...commonEditable,
    ...(params.kind === "instructor"
      ? instructorEditable
      : params.kind === "visiting"
        ? visitingEditable
        : studentEditable),
  ];
  for (const key of editable) {
    if (typeof body[key] === "string") {
      data[key] = body[key] === "" ? null : sanitizeText(body[key]);
    }
  }

  if (Object.keys(data).length === 0) return fail("Nothing to update", 400);

  try {
    const updated = await (modelFor(params.kind) as any).update({
      where: { id: params.id },
      data,
    });
    return ok(updated);
  } catch {
    return fail("Update failed", 500);
  }
}

// DELETE: remove application and its uploaded files
export async function DELETE(_req: Request, { params }: Params) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  try {
    // Uploaded file rows are removed automatically via the onDelete: Cascade
    // relation, and their bytes live in those rows.
    await (modelFor(params.kind) as any).delete({ where: { id: params.id } });
    return ok({ deleted: true });
  } catch {
    return fail("Delete failed", 500);
  }
}
