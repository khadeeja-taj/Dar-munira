import { prisma } from "@/lib/db";
import { ok, fail } from "@/lib/api";

export const dynamic = "force-dynamic";

// Public: list published announcements (pinned first, newest first).
// Heavy image/file bytes are excluded — the client loads them by URL when needed.
export async function GET() {
  try {
    const data = await prisma.announcement.findMany({
      where: { published: true },
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
      take: 12,
      select: {
        id: true,
        titleEn: true,
        titleAr: true,
        bodyEn: true,
        bodyAr: true,
        category: true,
        pinned: true,
        imageMime: true,
        fileMime: true,
        fileName: true,
        createdAt: true,
      },
    });
    return ok(data);
  } catch {
    return fail("Could not load announcements", 500);
  }
}
