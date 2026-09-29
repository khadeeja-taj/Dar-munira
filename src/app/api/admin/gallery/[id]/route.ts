import { prisma } from "@/lib/db";
import { ok, fail, requireAdmin } from "@/lib/api";

export const runtime = "nodejs";

type Params = { params: { id: string } };

// Admin: toggle published / update captions.
export async function PATCH(req: Request, { params }: Params) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;
  const body = await req.json().catch(() => null);
  if (!body) return fail("Invalid body", 400);
  const data: Record<string, unknown> = {};
  if (typeof body.published === "boolean") data.published = body.published;
  if (Object.keys(data).length === 0) return fail("Nothing to update", 400);
  try {
    const updated = await prisma.galleryItem.update({
      where: { id: params.id },
      data,
      select: { id: true, published: true },
    });
    return ok(updated);
  } catch {
    return fail("Update failed", 500);
  }
}

// Admin: delete a gallery item.
export async function DELETE(_req: Request, { params }: Params) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;
  try {
    await prisma.galleryItem.delete({ where: { id: params.id } });
    return ok({ deleted: true });
  } catch {
    return fail("Delete failed", 500);
  }
}
