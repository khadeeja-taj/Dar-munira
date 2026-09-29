import { prisma } from "@/lib/db";
import { fail, requireAdmin } from "@/lib/api";

export const runtime = "nodejs";

// Protected download / inline preview of an uploaded file (served from the DB).
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  const file = await prisma.uploadedFile.findUnique({ where: { id: params.id } });
  if (!file || !file.data) return fail("Not found", 404);

  const disposition =
    new URL(req.url).searchParams.get("download") === "1"
      ? "attachment"
      : "inline";
  return new Response(new Uint8Array(file.data as Buffer), {
    headers: {
      "Content-Type": file.mimeType,
      "Content-Disposition": `${disposition}; filename="${encodeURIComponent(
        file.originalName,
      )}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
