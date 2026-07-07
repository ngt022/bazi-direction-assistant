/**
 * 结构化日志工具
 *
 * 统一日志格式，输出 JSON 格式日志条目，便于日志聚合和分析。
 * 控制台显示带 emoji 前缀，便于快速识别日志级别。
 */

const prefixes: Record<string, string> = {
  ok: "✅",
  info: "ℹ️",
  warn: "⚠️",
  error: "❌",
} as const;

type LogTag = keyof typeof prefixes;

function log(tag: LogTag, msg: string, extra?: Record<string, unknown>) {
  const prefix = prefixes[tag];
  const ts = new Date().toISOString();
  const entry = extra
    ? JSON.stringify({ ts, tag, msg, ...extra })
    : JSON.stringify({ ts, tag, msg });
  console.log(`${prefix} ${entry}`);
}

export const logger = {
  info: (msg: string, extra?: Record<string, unknown>) => log("info", msg, extra),
  ok: (msg: string, extra?: Record<string, unknown>) => log("ok", msg, extra),
  warn: (msg: string, extra?: Record<string, unknown>) => log("warn", msg, extra),
  error: (msg: string, extra?: Record<string, unknown>) => log("error", msg, extra),
};
