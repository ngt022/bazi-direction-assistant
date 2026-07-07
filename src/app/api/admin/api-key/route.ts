import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin";
import { getOpenaiApiKey, setOpenaiApiKey } from "@/lib/store";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !isAdminUser(user)) {
    return NextResponse.json({ ok: false, error: "无权限" }, { status: 403 });
  }
  const key = await getOpenaiApiKey();
  return NextResponse.json({
    ok: true,
    hasKey: Boolean(key),
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || !isAdminUser(user)) {
    return NextResponse.json({ ok: false, error: "无权限" }, { status: 403 });
  }
  const { key } = await request.json();
  if (typeof key !== "string") {
    return NextResponse.json({ ok: false, error: "参数错误" }, { status: 400 });
  }
  await setOpenaiApiKey(key);
  return NextResponse.json({ ok: true, hasKey: Boolean(key) });
}
