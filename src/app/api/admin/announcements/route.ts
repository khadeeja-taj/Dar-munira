import { prisma } from "@/lib/db";
import { ok, fail, requireAdmin } from "@/lib/api";
import { announcementSchema } from "@/lib/validations";
import { sanitizeText } from "@/lib/utils";
import { saveFile } from "@/lib/storage";

export const runtime = "nodejs";

// Fields returned in listings — never the heavy image/file bytes.
const listSelect = {
  id: true,
  titleEn: true,
  titleAr: true,
  bodyEn: true,
  bodyAr: true,
  category: true,
  pinned: true,
  published: true,
  imageMime: true,
  fileMime: true,
  fileName: true,
  createdAt: true,
} as const;

export async function GET() {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;
  const data = await prisma.announcement.findMany({
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    select: listSelect,
  });
  return ok(data);
}

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return fail("Invalid form submission", 400);
  }

  // Validate the text fields.
  const parsed = announcementSchema.safeParse({
    titleEn: String(form.get("titleEn") || ""),
    titleAr: String(form.get("titleAr") || ""),
    bodyEn: String(form.get("bodyEn") || ""),
    bodyAr: String(form.get("bodyAr") || ""),
    category: String(form.get("category") || "news"),
    pinned: form.get("pinned") === "true",
    published: form.get("published") === "true",
  });
  if (!parsed.success) return fail("Validation failed", 422, parsed.error.flatten());
  const v = parsed.data;

  // Optional picture.
  const imageField = form.get("image");
  let imageData: Buffer | null = null;
  let imageMime: string | null = null;
  if (imageField instanceof File && imageField.size > 0) {
    try {
      const saved = await saveFile(imageField);
      if (!saved.mimeType.startsWith("image/")) {
        return fail("The picture must be an image (JPG or PNG)", 422);
      }
      imageData = saved.data;
      imageMime = saved.mimeType;
    } catch (e) {
      return fail(e instanceof Error ? e.message : "Picture upload failed", 400);
    }
  }

  // Optional file attachment (e.g. a PDF).
  const fileField = form.get("file");
  let fileData: Buffer | null = null;
  let fileMime: string | null = null;
  let fileName: string | null = null;
  if (fileField instanceof File && fileField.size > 0) {
    try {
      const saved = await saveFile(fileField);
      fileData = saved.data;
      fileMime = saved.mimeType;
      fileName = saved.originalName;
    } catch (e) {
      return fail(e instanceof Error ? e.message : "File upload failed", 400);
    }
  }

  // Require at least something: a title (any language), body text, or a picture.
  const hasText = [v.titleEn, v.titleAr, v.bodyEn, v.bodyAr].some(
    (s) => s && s.trim().length > 0,
  );
  if (!hasText && !imageData && !fileData) {
    return fail("Add a title, some text, or a picture.", 422);
  }

  const created = await prisma.announcement.create({
    data: {
      titleEn: sanitizeText(v.titleEn),
      titleAr: sanitizeText(v.titleAr),
      bodyEn: sanitizeText(v.bodyEn),
      bodyAr: sanitizeText(v.bodyAr),
      category: v.category,
      pinned: v.pinned,
      published: v.published,
      imageData,
      imageMime,
      fileData,
      fileMime,
      fileName,
    },
    select: listSelect,
  });
  return ok(created, 201);
}
