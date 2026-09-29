import { ok } from "@/lib/api";
import { destroySession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  await destroySession();
  return ok({ signedOut: true });
}
