import { describe, expect, it } from "vitest";
import { heroStages, heroState } from "../src/lib/heroTimeline";

describe("scroll-driven house story", () => {
  it("contains eleven contiguous named stages", () => {
    expect(heroStages).toHaveLength(11);
    expect(heroStages[0].start).toBe(0);
    expect(heroStages.at(-1)?.end).toBe(1);
    for (let i = 1; i < heroStages.length; i++) expect(heroStages[i]!.start).toBe(heroStages[i - 1]!.end);
    for (const stage of heroStages) expect(stage.detail.length).toBeGreaterThan(60);
  });

  it("is entirely derived from scroll progress and reverses exactly", () => {
    const before = heroState(.44);
    heroState(.91);
    expect(heroState(.44)).toEqual(before);
  });

  it("resolves the final stage at the end of scroll", () => {
    expect(heroState(1).stageIndex).toBe(10);
    expect(heroState(0).stageIndex).toBe(0);
  });

  it("clamps out-of-range progress instead of throwing", () => {
    expect(heroState(-5).stageIndex).toBe(0);
    expect(heroState(5).stageIndex).toBe(10);
  });
});
