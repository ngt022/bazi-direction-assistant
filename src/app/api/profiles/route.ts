import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { buildValidatedBaziChart } from "@/lib/bazi-server";
import { appLimits, trimToLimit } from "@/lib/limits";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { addProfileWithLimit, deleteProfileData, newId, readDb } from "@/lib/store";
import type { BirthProfile, CalendarType, Gender } from "@/lib/types";
import { parseBody, tryRoute } from "@/lib/api-error";

function optionalCoordinate(value: unknown) {
  if (value === undefined || value === null || value === "") return undefined;
  const coordinate = Number(value);
  return Number.isFinite(coordinate) ? coordinate : undefined;
}

export async function GET() {
  return tryRoute(async () => {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ ok: false, error: "请先登录" }, { status: 401 });
    }
    const db = await readDb();
    return NextResponse.json({
      profiles: db.profiles.filter((profile) => profile.userId === user.id),
    });
  });
}

export async function POST(request: Request) {
  return tryRoute(async () => {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ ok: false, error: "请先登录" }, { status: 401 });
    }
    const rateLimit = checkRateLimit(
      request,
      `profile:write:${user.id}`,
      appLimits.rateLimitProfileWrite,
    );
    if (!rateLimit.ok) {
      return rateLimitResponse(rateLimit.resetAt);
    }

    const body = await parseBody<{
      birthDate?: string;
      birthTime?: string;
      name?: string;
      birthPlace?: string;
      calendarType?: string;
      isLeapMonth?: boolean;
      timezone?: string;
      gender?: string;
      latitude?: unknown;
      longitude?: unknown;
      timeUnknown?: boolean;
    }>(request);
    const birthDate = String(body.birthDate || "");
    const birthTime = String(body.birthTime || "12:00");
    const name = trimToLimit(String(body.name || user.name || "我的命盘"), appLimits.maxProfileNameChars);
    const birthPlace = trimToLimit(String(body.birthPlace || ""), appLimits.maxBirthPlaceChars);
    const calendarType = (body.calendarType === "lunar" ? "lunar" : "solar") as CalendarType;
    const isLeapMonth = calendarType === "lunar" && Boolean(body.isLeapMonth);
    const timezone = String(body.timezone || "Asia/Shanghai");
    const gender = (["male", "female", "other"].includes(body.gender!)
      ? body.gender
      : "other") as Gender;
    if (!birthDate) {
      return NextResponse.json({ ok: false, error: "请填写出生日期" }, { status: 400 });
    }
    const profile: BirthProfile = {
      id: newId("profile"),
      userId: user.id,
      name,
      gender,
      calendarType,
      isLeapMonth,
      birthDate,
      birthTime,
      birthPlace,
      latitude: optionalCoordinate(body.latitude),
      longitude: optionalCoordinate(body.longitude),
      timezone,
      timeUnknown: Boolean(body.timeUnknown),
      createdAt: new Date().toISOString(),
      chart: buildValidatedBaziChart({
        calendarType,
        birthDate,
        birthTime,
        timeUnknown: Boolean(body.timeUnknown),
        isLeapMonth,
        gender,
      }),
    };
    await addProfileWithLimit(profile, appLimits.maxProfilesPerUser);
    return NextResponse.json({ ok: true, data: { profile } });
  });
}

export async function DELETE(request: Request) {
  return tryRoute(async () => {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ ok: false, error: "请先登录" }, { status: 401 });
    }
    const rateLimit = checkRateLimit(
      request,
      `profile:delete:${user.id}`,
      appLimits.rateLimitProfileWrite,
    );
    if (!rateLimit.ok) {
      return rateLimitResponse(rateLimit.resetAt);
    }

    const url = new URL(request.url);
    const profileId = url.searchParams.get("profileId") || "";
    if (!profileId) {
      return NextResponse.json({ ok: false, error: "缺少命盘档案 ID" }, { status: 400 });
    }

    const deleted = await deleteProfileData({ userId: user.id, profileId });
    return NextResponse.json({ ok: true, deleted });
  });
}
