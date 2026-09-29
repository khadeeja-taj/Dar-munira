import { prisma } from "@/lib/db";
import { ok, fail, requireAdmin } from "@/lib/api";

export const runtime = "nodejs";

// List contact-form messages (newest first).
export async function GET() {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;
  try {
    const data = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return ok(data);
  } catch {
    return fail("Could not load messages", 500);
  }
}
