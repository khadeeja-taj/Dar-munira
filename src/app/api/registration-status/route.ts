import { prisma } from "@/lib/db";
import { ok, fail } from "@/lib/api";

export const runtime = "nodejs";
// Read fresh so admin changes appear immediately for all visitors.
export const dynamic = "force-dynamic";

// Public: the registration status/message/link the admin configured for each
// category (program | course | competition). Nothing sensitive here.
export async function GET() {
  try {
    const rows = await prisma.registrationStatus.findMany({
      select: {
        id: true,
        isOpen: true,
        messageEn: true,
        messageAr: true,
        url: true,
      },
    });
    return ok(rows);
  } catch {
    return fail("Could not load registration status", 500);
  }
}
