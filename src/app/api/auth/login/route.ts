import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { ok, fail, rateLimit, clientIp } from "@/lib/api";
import { loginSchema } from "@/lib/validations";
import { createSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!rateLimit(`login:${clientIp(req)}`, 8, 5 * 60_000)) {
    return fail("Too many attempts. Please wait and try again.", 429);
  }
  try {
    const json = await req.json();
    const parsed = loginSchema.safeParse(json);
    if (!parsed.success) return fail("Invalid credentials", 401);

    const { email, password } = parsed.data;
    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
    });
    // Constant-ish time: always run a compare to reduce user enumeration.
    const hash = admin?.passwordHash || "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinva";
    const valid = await bcrypt.compare(password, hash);

    if (!admin || !valid) return fail("Invalid email or password", 401);

    await createSession({
      sub: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });
    return ok({ name: admin.name, email: admin.email });
  } catch {
    return fail("Login failed", 500);
  }
}
