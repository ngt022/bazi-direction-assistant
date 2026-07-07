import { readPositiveInt } from "./limits";

export function readBoolean(name: string, fallback: boolean) {
  const raw = process.env[name];
  if (raw === undefined || raw === "") {
    return fallback;
  }
  return ["1", "true", "yes", "on"].includes(raw.toLowerCase());
}

export const aiConfig = {
  forceLocal: readBoolean("AI_FORCE_LOCAL", false),
  fallbackOnError: readBoolean("AI_FALLBACK_ON_ERROR", true),
  openaiTimeoutMs: readPositiveInt("OPENAI_TIMEOUT_MS", 20_000),
  model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
};

export function hasOpenAIKey() {
  // 运行时 key 可能存储在 store 中，但这里只做 env 检查
  // ai.ts 中会异步读取 store 中的 key
  return Boolean(process.env.OPENAI_API_KEY);
}

export function getAiMode() {
  if (aiConfig.forceLocal) {
    return "local";
  }
  return "openai";
}
