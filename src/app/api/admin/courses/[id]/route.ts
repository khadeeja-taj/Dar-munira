import { prisma } from "@/lib/db";
import { ok, fail, requireAdmin } from "@/lib/api";
import { courseItemSchema } from "@/lib/validations";
import { sanitizeText } from "@/lib/utils";

export const runtime = "nodejs";

type Params = { params: { id: string } };

// Admin: update a course item (any subset of fields).
export async function PATCH(req: Request, { params }: Params) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  const json = await req.json().catch(() => null);
  const parsed = courseItemSchema.partial().safeParse(json);
  if (!parsed.success) return fail("Validation failed", 422, parsed.error.flatten());

  const v = parsed.data;
  const data: Record<string, unknown> = {};
  if (v.category !== undefined) data.category = v.category;
  if (v.titleEn !== undefined) data.titleEn = sanitizeText(v.titleEn);
  if (v.titleAr !== undefined) data.titleAr = sanitizeText(v.titleAr);
  if (v.descEn !== undefined) data.descEn = v.descEn ? sanitizeText(v.descEn) : null;
  if (v.descAr !== undefined) data.descAr = v.descAr ? sanitizeText(v.descAr) : null;
  if (v.published !== undefined) data.published = v.published;
  if (v.sortOrder !== undefined) data.sortOrder = v.sortOrder;

  try {
    const updated = await prisma.courseItem.update({ where: { id: params.id }, data });
    return ok(updated);
  } catch {
    return fail("Update failed", 500);
  }
}

// Admin: delete a course item.
export async function DELETE(_req: Request, { params }: Params) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;
  try {
    await prisma.courseItem.delete({ where: { id: params.id } });
    return ok({ deleted: true });
  } catch {
    return fail("Delete failed", 500);
  }
}
