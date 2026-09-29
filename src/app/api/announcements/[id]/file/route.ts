import { prisma } from "@/lib/db";
import { fail } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public: serve an announcement's file attachment (offered as a download).
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const item = await prisma.announcement.findUnique({
    where: { id: params.id },
    select: { fileData: true, fileMime: true, fileName: true },
  });
  if (!item || !item.fileData) return fail("Not found", 404);
  const name = (item.fileName || "attachment").replace(/["\\\r\n]/g, "");
  return new Response(new Uint8Array(item.fileData as Buffer), {
    headers: {
      "Content-Type": item.fileMime || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
