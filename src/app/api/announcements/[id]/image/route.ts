import { prisma } from "@/lib/db";
import { fail } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public: serve an announcement's picture (shown on the site).
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const item = await prisma.announcement.findUnique({
    where: { id: params.id },
    select: { imageData: true, imageMime: true },
  });
  if (!item || !item.imageData) return fail("Not found", 404);
  return new Response(new Uint8Array(item.imageData as Buffer), {
    headers: {
      "Content-Type": item.imageMime || "application/octet-stream",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
