import { NextResponse } from "next/server";
import { createSession, createUser, publicUser } from "@/lib/store";
import { sessionCookieName, sessionCookieOptions } from "@/lib/auth";
import { appLimits } from "@/lib/limits";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { parseBody, tryRoute } from "@/lib/api-error";

export async function POST(request: Request) {
  return tryRoute(async () => {
    const rateLimit = checkRateLimit(request, "auth:register", appLimits.rateLimitRegister);
    if (!rateLimit.ok) {
      return rateLimitResponse(rateLimit.resetAt);
    }

    const body = await parseBody<{ name?: string; email?: string; password?: string }>(request);
    const user = await createUser({
      name: String(body.name || ""),
      email: String(body.email || ""),
      password: String(body.password || ""),
    });
    const session = await createSession(user.id);
    const response = NextResponse.json({ ok: true, data: { user: publicUser(user) } });
    response.cookies.set(sessionCookieName, session.token, sessionCookieOptions(session.expiresAt));
    return response;
  });
}
