import { NextResponse } from "next/server";
import { getSession, type SessionPayload } from "./auth";

export function ok(data: unknown, init?: number) {
  return NextResponse.json({ ok: true, data }, { status: init || 200 });
}

export function fail(message: string, status = 400, extra?: unknown) {
  return NextResponse.json({ ok: false, error: message, extra }, { status });
}

/** Guard a route handler: returns the session or a 401 response. */
export async function requireAdmin(): Promise<
  { session: SessionPayload } | { response: NextResponse }
> {
  const session = await getSession();
  if (!session) {
    return { response: fail("Unauthorized", 401) };
  }
  return { session };
}

// Simple in-memory rate limiter (per-process; suitable for dev / single node).
// For production behind multiple instances, back this with Redis / Upstash.
const buckets = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now > b.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (b.count >= limit) return false;
  b.count += 1;
  return true;
}

export function clientIp(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "local";
}
