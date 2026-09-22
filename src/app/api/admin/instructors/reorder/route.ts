import { prisma } from "@/lib/db";
import { ok, fail, requireAdmin } from "@/lib/api";

export const runtime = "nodejs";

// Admin-only: persist the display order of the teachers shown on the public
// Teachers section. Body: { ids: string[] } — the instructor ids in the exact
// order they should appear. Each id's sortOrder is set to its position.
export async function POST(req: Request) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  const json = (await req.json().catch(() => null)) as { ids?: unknown } | null;
  const ids = json?.ids;
  if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) {
    return fail("Invalid order payload", 422);
  }
  if (ids.length === 0) return ok({ updated: 0 });
  if (ids.length > 1000) return fail("Too many items", 413);

  try {
    // One transaction so the whole order is saved atomically.
    await prisma.$transaction(
      (ids as string[]).map((id, index) =>
        prisma.instructorApplication.update({
          where: { id },
          data: { sortOrder: index },
        }),
      ),
    );
    return ok({ updated: ids.length });
  } catch {
    return fail("Could not save the order", 500);
  }
}
