import { NextResponse } from "next/server";
import { aiConfig, getAiMode, hasOpenAIKey } from "@/lib/ai-config";
import { appLimits } from "@/lib/limits";
import { appId } from "@/lib/site";
import { tryRoute } from "@/lib/api-error";

export async function GET() {
  return tryRoute(async () => {
    return NextResponse.json({
      app_id: appId,
      status: "ok",
      time: new Date().toISOString(),
      ai_mode: getAiMode(),
      ai: {
        model: aiConfig.model,
        has_openai_key: hasOpenAIKey(),
        force_local: aiConfig.forceLocal,
        fallback_on_error: aiConfig.fallbackOnError,
        openai_timeout_ms: aiConfig.openaiTimeoutMs,
      },
      data_store: process.env.APP_DATA_DIR || "./data",
      limits: appLimits,
      version: process.env.APP_VERSION || "0.1.0",
    });
  });
}
