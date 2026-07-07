import { ArrowRight, BarChart3, Check, LockKeyhole, Orbit } from "lucide-react";
import Image from "next/image";
import type { FormEvent, ReactNode } from "react";

const pillars = [
  ["年柱", "庚午", "路旁土"],
  ["月柱", "壬午", "杨柳木"],
  ["日柱", "辛亥", "钗钏金"],
  ["时柱", "癸巳", "长流水"],
] as const;

const elements = [
  ["木", 28, "wood"],
  ["火", 18, "fire"],
  ["土", 22, "earth"],
  ["金", 17, "metal"],
  ["水", 15, "water"],
] as const;

type Props = {
  busy: boolean;
  error: string;
  onRegister: (event: FormEvent<HTMLFormElement>) => void;
  onLogin: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
};

export function HeroSection(_props: Props) {
  return (
    <section id="top" className="product-hero" aria-labelledby="product-hero-title">
      <div className="product-hero-ambient" aria-hidden="true">
        <Image src="/xuanshu-hero-reference.png" alt="" fill priority sizes="(max-width: 800px) 100vw, 55vw" />
      </div>

      <div className="product-shell product-hero-layout">
        <div className="product-hero-copy">
          <div className="product-hero-kicker"><span />四柱八字 · 五行 · 大运流年</div>
          <h1 id="product-hero-title">输入出生信息<br />生成<span>命盘报告</span></h1>
          <p className="product-hero-subtitle">填写出生日期、时间和地点，查看四柱八字、五行分布、十神关系、大运流年与行动建议。</p>
          <p className="product-hero-description">内容仅供传统文化研究与娱乐参考，不作为人生决策依据。</p>
          <div className="product-trust-row" aria-label="使用说明">
            <span><LockKeyhole aria-hidden="true" />信息不会公开展示</span>
            <span><BarChart3 aria-hidden="true" />结果清晰可读</span>
            <span><Check aria-hidden="true" />适合手机截图保存</span>
          </div>
        </div>

        <div className="hero-report-preview">
          <div className="hero-report-topbar">
            <span><Orbit aria-hidden="true" />玄枢命盘报告</span>
            <em>示例预览</em>
          </div>
          <div className="hero-report-summary">
            <div>
              <small>命盘总览</small>
              <strong>辛金日主 · 四柱结构</strong>
              <p>1990 年 6 月 15 日 09:30 · 成都</p>
            </div>
            <span className="hero-day-master"><small>日主</small>辛金</span>
          </div>
          <div className="hero-pillars">
            {pillars.map(([label, value, note]) => (
              <div key={label}><small>{label}</small><strong>{value}</strong><span>{note}</span></div>
            ))}
          </div>
          <div className="hero-report-lower">
            <div className="hero-elements">
              <div className="hero-report-label"><span>五行分布</span><small>综合藏干权重</small></div>
              {elements.map(([label, value, key]) => (
                <div className="hero-element-row" key={key}>
                  <span>{label}</span><i><b className={`is-${key}`} style={{ width: `${value * 2.8}%` }} /></i><em>{value}%</em>
                </div>
              ))}
            </div>
            <div className="hero-chapter-list">
              <div className="hero-report-label"><span>报告章节</span><small>8 个核心部分</small></div>
              {["四柱八字", "十神分析", "地支关系", "大运流年"].map((item, index) => (
                <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong><Check aria-hidden="true" /></div>
              ))}
            </div>
          </div>
          <div className="hero-report-footer"><span><i />报告已生成</span><strong>继续阅读完整报告 <ArrowRight aria-hidden="true" /></strong></div>
        </div>
      </div>
    </section>
  );
}
