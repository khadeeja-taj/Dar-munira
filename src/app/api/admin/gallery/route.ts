import { prisma } from "@/lib/db";
import { ok, fail, requireAdmin } from "@/lib/api";
import { saveFile } from "@/lib/storage";
import { sanitizeText } from "@/lib/utils";

export const runtime = "nodejs";

// Admin: list all gallery items (metadata only).
export async function GET() {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;
  const data = await prisma.galleryItem.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      titleEn: true,
      titleAr: true,
      videoUrl: true,
      published: true,
      createdAt: true,
    },
  });
  return ok(data);
}

// Admin: upload a new gallery item (image + captions + optional video link).
export async function POST(req: Request) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return fail("Invalid form submission", 400);
  }

  const file = form.get("image");
  const titleEn = String(form.get("titleEn") || "").trim();
  const titleAr = String(form.get("titleAr") || "").trim();
  const videoUrl = String(form.get("videoUrl") || "").trim();

  if (!(file instanceof File) || file.size === 0) {
    return fail("An image is required", 422);
  }
  if (!titleEn || !titleAr) {
    return fail("Both English and Arabic captions are required", 422);
  }

  let saved;
  try {
    saved = await saveFile(file);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Upload failed", 400);
  }
  if (!saved.mimeType.startsWith("image/")) {
    return fail("Please upload an image (JPG or PNG)", 422);
  }

  const created = await prisma.galleryItem.create({
    data: {
      titleEn: sanitizeText(titleEn),
      titleAr: sanitizeText(titleAr),
      mimeType: saved.mimeType,
      data: saved.data,
      videoUrl: videoUrl ? sanitizeText(videoUrl) : null,
    },
    select: { id: true, titleEn: true, titleAr: true, videoUrl: true, published: true, createdAt: true },
  });
  return ok(created, 201);
}
