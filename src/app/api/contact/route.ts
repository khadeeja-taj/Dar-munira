import { prisma } from "@/lib/db";
import { ok, fail, rateLimit, clientIp } from "@/lib/api";
import { contactSchema } from "@/lib/validations";
import { sanitizeText } from "@/lib/utils";

export async function POST(req: Request) {
  if (!rateLimit(`contact:${clientIp(req)}`, 5, 60_000)) {
    return fail("Too many requests. Please try again shortly.", 429);
  }
  try {
    const json = await req.json();
    const parsed = contactSchema.safeParse(json);
    if (!parsed.success) {
      return fail("Validation failed", 422, parsed.error.flatten());
    }
    const { name, email, subject, message } = parsed.data;
    await prisma.contactMessage.create({
      data: {
        name: sanitizeText(name),
        email: sanitizeText(email),
        subject: subject ? sanitizeText(subject) : null,
        message: sanitizeText(message),
      },
    });
    return ok({ received: true });
  } catch {
    return fail("Could not send your message", 500);
  }
}
