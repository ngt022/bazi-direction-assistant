import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { generateGuidance } from "@/lib/ai";
import { appLimits } from "@/lib/limits";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { addQuestionWithDailyLimit, newId, questionsToday, readDb } from "@/lib/store";
import type { GuidanceQuestion, QuestionCategory } from "@/lib/types";
import { parseBody, tryRoute } from "@/lib/api-error";

const categories = [
  "direction",
  "career",
  "relationship",
  "study",
  "wealth",
  "timing",
  "emotion",
  "custom",
];

export async function POST(request: Request) {
  return tryRoute(async () => {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ ok: false, error: "请先登录" }, { status: 401 });
    }
    const rateLimit = checkRateLimit(
      request,
      `question:write:${user.id}`,
      appLimits.rateLimitQuestionWrite,
    );
    if (!rateLimit.ok) {
      return rateLimitResponse(rateLimit.resetAt);
    }

    const db = await readDb();
    const usedToday = questionsToday(db.questions, user.id).length;
    if (usedToday >= user.dailyQuestionLimit) {
      return NextResponse.json({ ok: false, error: "今天的免费提问次数已用完，明天再来。" }, { status: 429 });
    }

    const body = await parseBody<{
      profileId?: string;
      question?: string;
      category?: string;
    }>(request);
    const profile = db.profiles.find(
      (item) => item.id === body.profileId && item.userId === user.id,
    );
    if (!profile) {
      return NextResponse.json({ ok: false, error: "请先创建命盘档案" }, { status: 400 });
    }
    const question = String(body.question || "").trim();
    if (question.length < 4) {
      return NextResponse.json({ ok: false, error: "问题再具体一点，至少 4 个字" }, { status: 400 });
    }
    if (question.length > appLimits.maxQuestionChars) {
      return NextResponse.json(
        { ok: false, error: `问题最多 ${appLimits.maxQuestionChars} 个字，请再精简一点` },
        { status: 400 },
      );
    }
    const category = (categories.includes(body.category!) ? body.category : "custom") as QuestionCategory;
    const guidance = await generateGuidance({ user, profile, question, category });
    const record: GuidanceQuestion = {
      id: newId("question"),
      userId: user.id,
      profileId: profile.id,
      category,
      question,
      answer: guidance.answer,
      createdAt: new Date().toISOString(),
      usage: guidance.usage,
    };
    await addQuestionWithDailyLimit(record, user.dailyQuestionLimit);
    return NextResponse.json({
      ok: true,
      data: {
        question: record,
        remainingToday: Math.max(0, user.dailyQuestionLimit - usedToday - 1),
      },
    });
  });
}
