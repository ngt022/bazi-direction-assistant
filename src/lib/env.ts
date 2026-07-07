/**
 * 启动时环境变量校验
 *
 * 在 next.config.ts、instrumentation.ts 或 server 入口处调用 initEnv()
 * 确保必需变量存在、格式正确。
 */

const required = [
  ["APP_URL", "站点 URL，例如 https://example.com"],
  ["NEXT_PUBLIC_SITE_URL", "公开站点 URL，通常与 APP_URL 相同"],
] as const;

const optionalWithWarning = [
  ["OPENAI_API_KEY", "AI 回答引擎（不填则使用本地规则引擎）"],
  ["ADMIN_EMAILS", "管理员邮箱列表，英文逗号分隔"],
] as const;

const problems: string[] = [];

export function checkEnv() {
  for (const [key, desc] of required) {
    if (!process.env[key]) {
      problems.push(`❌ ${key}: ${desc} — 未设置`);
    }
  }
  for (const [key, desc] of optionalWithWarning) {
    if (!process.env[key]) {
      problems.push(`⚠️  ${key}: ${desc} — 未设置，部分功能受限`);
    }
  }
  if (process.env.ADMIN_EMAILS) {
    for (const email of process.env.ADMIN_EMAILS.split(",")) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        problems.push(`⚠️  ADMIN_EMAILS 中包含无效邮箱: ${email.trim()}`);
      }
    }
  }
  return problems;
}

export function logEnvWarnings() {
  const issues = checkEnv();
  for (const msg of issues) {
    console.warn(`[env] ${msg}`);
  }
  if (issues.length === 0) {
    console.info("[env] ✅ 环境变量检查通过");
  }
}
