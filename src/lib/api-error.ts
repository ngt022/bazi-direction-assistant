import { NextResponse } from "next/server";

export type ApiResult<T = unknown> = { ok: true; data: T } | { ok: false; error: string };

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function err(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

export function tryRoute(handler: () => Promise<Response>): Promise<Response> {
  return handler().catch((e: Error & { status?: number }) => {
    console.error("[api-error]", e.message);
    return err(e.message || "服务器内部错误", e.status || 500);
  });
}

export function parseBody<T>(request: Request): Promise<T> {
  return request.json().catch(() => {
    throw new Error("请求格式错误");
  });
}
