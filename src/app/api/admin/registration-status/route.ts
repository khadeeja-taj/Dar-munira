import { prisma } from "@/lib/db";
import { ok, fail, requireAdmin } from "@/lib/api";
import { registrationStatusSchema } from "@/lib/validations";
import { sanitizeText } from "@/lib/utils";

export const runtime = "nodejs";

// Admin: read the current registration status for all categories.
export async function GET() {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;
  const rows = await prisma.registrationStatus.findMany();
  return ok(rows);
}

// Admin: save the registration status/message/link for each category. The
// body carries up to three category rows; each is upserted atomically.
export async function PUT(req: Request) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  const json = await req.json().catch(() => null);
  const parsed = registrationStatusSchema.safeParse(json);
  if (!parsed.success) {
    return fail("Validation failed", 422, parsed.error.flatten());
  }

  try {
    await prisma.$transaction(
      parsed.data.items.map((it) => {
        const data = {
          isOpen: it.isOpen,
          messageEn: it.messageEn ? sanitizeText(it.messageEn) : "",
          messageAr: it.messageAr ? sanitizeText(it.messageAr) : "",
          url: it.url ? it.url.trim() : "",
        };
        return prisma.registrationStatus.upsert({
          where: { id: it.id },
          update: data,
          create: { id: it.id, ...data },
        });
      }),
    );
    const rows = await prisma.registrationStatus.findMany();
    return ok(rows);
  } catch {
    return fail("Could not save registration status", 500);
  }
}
