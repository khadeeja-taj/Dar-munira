import { prisma } from "@/lib/db";
import { ok, fail, requireAdmin } from "@/lib/api";

export const runtime = "nodejs";

type Params = { params: { id: string } };

// Mark a message handled / unhandled.
export async function PATCH(req: Request, { params }: Params) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;
  const body = await req.json().catch(() => null);
  if (!body || typeof body.handled !== "boolean") return fail("Invalid body", 400);
  try {
    const updated = await prisma.contactMessage.update({
      where: { id: params.id },
      data: { handled: body.handled },
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
    await prisma.contactMessage.delete({ where: { id: params.id } });
    return ok({ deleted: true });
  } catch {
    return fail("Delete failed", 500);
  }
}
