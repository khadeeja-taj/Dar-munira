import { prisma } from "@/lib/db";
import { ok, fail, requireAdmin } from "@/lib/api";
import { courseItemSchema } from "@/lib/validations";
import { sanitizeText } from "@/lib/utils";

export const runtime = "nodejs";

// Admin: list every course item (all categories, published or not).
export async function GET() {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;
  const data = await prisma.courseItem.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return ok(data);
}

// Admin: create a course item.
export async function POST(req: Request) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  const json = await req.json().catch(() => null);
  const parsed = courseItemSchema.safeParse(json);
  if (!parsed.success) return fail("Validation failed", 422, parsed.error.flatten());
  const v = parsed.data;

  const created = await prisma.courseItem.create({
    data: {
      category: v.category,
      titleEn: sanitizeText(v.titleEn),
      titleAr: sanitizeText(v.titleAr),
      descEn: v.descEn ? sanitizeText(v.descEn) : null,
      descAr: v.descAr ? sanitizeText(v.descAr) : null,
      published: v.published,
      sortOrder: v.sortOrder ?? 0,
    },
  });
  return ok(created, 201);
}
