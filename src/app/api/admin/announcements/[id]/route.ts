import { prisma } from "@/lib/db";
import { ok, fail, requireAdmin } from "@/lib/api";
import { announcementSchema } from "@/lib/validations";
import { sanitizeText } from "@/lib/utils";

export const runtime = "nodejs";

type Params = { params: { id: string } };

export async function PATCH(req: Request, { params }: Params) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  const json = await req.json().catch(() => null);
  const parsed = announcementSchema.partial().safeParse(json);
  if (!parsed.success) return fail("Validation failed", 422);

  const v = parsed.data;
  const data: Record<string, unknown> = {};
  for (const [k, val] of Object.entries(v)) {
    data[k] = typeof val === "string" ? sanitizeText(val) : val;
  }

  try {
    const updated = await prisma.announcement.update({
      where: { id: params.id },
      data,
    });
    return ok(updated);
  } catch {
    return fail("Update failed", 500);
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;
  try {
    await prisma.announcement.delete({ where: { id: params.id } });
    return ok({ deleted: true });
  } catch {
    return fail("Delete failed", 500);
  }
}
