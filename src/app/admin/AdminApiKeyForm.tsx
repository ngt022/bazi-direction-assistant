"use client";

import { FormEvent, useEffect, useState } from "react";

export function AdminApiKeyForm() {
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/api-key")
      .then((r) => r.json())
      .then((d) => setHasKey(d.hasKey))
      .catch(() => setHasKey(false));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const form = new FormData(e.currentTarget as HTMLFormElement);
    try {
      const r = await fetch("/api/admin/api-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: form.get("key") }),
      });
      const d = await r.json();
      setHasKey(d.hasKey);
      setMsg(d.ok ? "已保存" : d.error || "保存失败");
    } catch {
      setMsg("网络错误");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, padding: 20, border: "1px solid rgba(216,180,142,0.2)", borderRadius: 12, background: "rgba(15,17,20,0.6)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#b7aea3" }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: hasKey === null ? "#666" : hasKey ? "#5d9290" : "#c25344" }} />
        {hasKey === null ? "检查中..." : hasKey ? "已配置" : "未配置"}
      </div>
      <label style={{ fontSize: 12, color: "#b7aea3" }}>
        API Key
        <input name="key" type="password" placeholder="sk-..." style={{ width: "100%", minHeight: 44, marginTop: 6, border: "1px solid rgba(216,180,142,0.2)", borderRadius: 8, background: "#0e1115", padding: "0 12px", color: "#f3ede3", fontSize: 14, colorScheme: "dark" }} />
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button type="submit" disabled={busy} style={{ minHeight: 42, borderRadius: 8, border: "1px solid #c25344", background: "#c25344", color: "white", padding: "0 16px", fontSize: 13, fontWeight: 600 }}>{busy ? "保存中..." : "保存"}</button>
        {msg && <span style={{ fontSize: 12, color: msg === "已保存" ? "#5d9290" : "#df7766" }}>{msg}</span>}
      </div>
      <p style={{ margin: 0, fontSize: 11, color: "#77736f" }}>留空或提交空值将清除运行时 Key，回退到环境变量。</p>
    </form>
  );
}
