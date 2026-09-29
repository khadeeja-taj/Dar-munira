import { prisma } from "@/lib/db";
import { ok, fail } from "@/lib/api";

export const dynamic = "force-dynamic";

// Public: list published course items (all three categories), ordered.
export async function GET() {
  try {
    const data = await prisma.courseItem.findMany({
      where: { published: true },
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        category: true,
        titleEn: true,
        titleAr: true,
        descEn: true,
        descAr: true,
      },
    });
    return ok(data);
  } catch {
    return fail("Could not load courses", 500);
  }
}
