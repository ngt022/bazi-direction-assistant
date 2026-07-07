import { NextResponse } from "next/server";
import { getSessionToken, sessionCookieName } from "@/lib/auth";
import { deleteSession } from "@/lib/store";
import { tryRoute } from "@/lib/api-error";

export async function POST() {
  return tryRoute(async () => {
    const token = await getSessionToken();
    if (token) {
      await deleteSession(token);
    }
    const response = NextResponse.json({ ok: true, data: null });
    response.cookies.delete(sessionCookieName);
    return response;
  });
}
