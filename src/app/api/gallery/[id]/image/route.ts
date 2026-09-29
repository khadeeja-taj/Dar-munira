import { prisma } from "@/lib/db";
import { fail } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public: serve a gallery image (it's meant to be shown on the public site).
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const item = await prisma.galleryItem.findUnique({ where: { id: params.id } });
  if (!item || !item.data) return fail("Not found", 404);
  return new Response(new Uint8Array(item.data as Buffer), {
    headers: {
      "Content-Type": item.mimeType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
