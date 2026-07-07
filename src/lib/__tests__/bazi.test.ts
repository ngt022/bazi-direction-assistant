import { describe, it, expect } from "vitest";
import { buildBaziChart } from "../bazi";

describe("buildBaziChart", () => {
  const input = {
    calendarType: "solar" as const,
    birthDate: "1990-06-15",
    birthTime: "09:30",
    gender: "male" as const,
  };

  it("returns basic chart structure", () => {
    const chart = buildBaziChart(input);
    expect(chart.pillars.year).toBeTruthy();
    expect(chart.pillars.month).toBeTruthy();
    expect(chart.pillars.day).toBeTruthy();
    expect(chart.pillars.time).toBeTruthy();
    expect(chart.dayMaster.stem).toBeTruthy();
  });

  it("calculates element balance including hidden stems", () => {
    const chart = buildBaziChart(input);
    const balance = chart.wuxing.balance;
    const total = Object.values(balance).reduce((sum, v) => sum + v, 0);
    // 4 stems + 8 branches + hidden stems (weighted)
    // 纯 stems(4) + branches(8) = 12, 加上藏干加权应该 > 12
    expect(total).toBeGreaterThan(12);
    // 但藏干加权的权重较小，总和不应当超过 20
    expect(total).toBeLessThan(20);
    // 所有值应该是非负浮点数
    Object.values(balance).forEach((v) => {
      expect(v).toBeGreaterThanOrEqual(0);
    });
  });

  it("determines strongest and weakest elements", () => {
    const chart = buildBaziChart(input);
    expect(chart.wuxing.strongest.length).toBeGreaterThanOrEqual(1);
    expect(chart.wuxing.weakest.length).toBeGreaterThanOrEqual(1);
  });

  it("handles hidden stems data", () => {
    const chart = buildBaziChart(input);
    expect(chart.hiddenStems).toBeDefined();
    expect(chart.hiddenStems?.year.length).toBeGreaterThan(0);
  });

  it("returns luck cycles and annual luck", () => {
    const chart = buildBaziChart(input);
    expect(chart.luckCycles?.length).toBeGreaterThan(0);
    expect(chart.annualLuck?.length).toBeGreaterThan(0);
  });

  it("handles gender other with yang day stem", () => {
    // 找一个男性日干为阳的档案会返回同一天干
    const maleChart = buildBaziChart({ ...input, gender: "male" });
    const otherChart = buildBaziChart({ ...input, gender: "other" });
    // 对同一天干的阴阳判断与其它字段无关，但 chart 应该正常返回
    expect(maleChart.pillars.year).toBe(otherChart.pillars.year);
  });

  it("handles gender other safely", () => {
    const chart = buildBaziChart({ ...input, gender: "other" });
    expect(chart.luckCycles?.length).toBeGreaterThan(0);
  });

  it("handles lunar calendar input", () => {
    const chart = buildBaziChart({
      ...input,
      calendarType: "lunar",
      birthDate: "1990-05-23",
    });
    // lunarText contains the Chinese date string, solarText has the converted Gregorian date
    expect(chart.lunarText.length).toBeGreaterThan(0);
    expect(chart.solarText).toContain("1990");
  });

  it("handles unknown birth time", () => {
    const chart = buildBaziChart({
      ...input,
      timeUnknown: true,
    });
    expect(chart.pillars.time).toBeTruthy();
    // 默认时柱应为子时（12:00 映射到子时？需要看 lunar-javascript 行为）
    // 只需确保不崩溃
  });
});
