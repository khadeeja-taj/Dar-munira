import { prisma } from "@/lib/db";
import { ok, fail } from "@/lib/api";

export const dynamic = "force-dynamic";

// Public: list published gallery items (newest first), without the heavy bytes.
export async function GET() {
  try {
    const data = await prisma.galleryItem.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 60,
      select: {
        id: true,
        titleEn: true,
        titleAr: true,
        videoUrl: true,
        createdAt: true,
      },
    });
    return ok(data);
  } catch {
    return fail("Could not load the gallery", 500);
  }
}
