import { FileText, BarChart3, CalendarDays, Sparkles } from "lucide-react";

const features = [
  { icon: FileText, title: "输入出生信息，2 秒出四柱", body: "支持阳历/农历、已知或未知时辰、中国主要时区。" },
  { icon: BarChart3, title: "五行强弱一眼可见", body: "天干地支加藏干加权，用颜色和比例展示能量分布。" },
  { icon: CalendarDays, title: "大运流年按月给参考", body: "根据当前大运段和实际日柱，每月给出节奏建议。" },
  { icon: Sparkles, title: "每日方向与低谷行动卡", body: "匹配当天干支的行动提醒，和情绪低谷时的稳定步骤。" },
] as const;

export function ProductFeatures() {
  return (
    <section className="product-section" style={{ paddingBlock: 64, background: "#111419" }}>
      <div className="product-shell">
        <div className="product-value-grid" style={{ marginTop: 0 }}>
          {features.map(({ icon: Icon, title, body }) => (
            <article key={title} className="product-value-item" style={{ minHeight: 220 }}>
              <Icon aria-hidden="true" style={{ width: 24, height: 24 }} />
              <span style={{ position: "absolute", top: 30, right: 24, color: "#6f3f38", fontFamily: "ui-monospace, monospace", fontSize: "0.68rem" }} />
              <h3 style={{ marginTop: 48 }}>{title}</h3>
              <p style={{ marginTop: 12, color: "#938d87", fontSize: "0.78rem", lineHeight: 1.85 }}>{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
