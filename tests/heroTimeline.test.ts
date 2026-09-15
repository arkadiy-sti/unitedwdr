import { describe, expect, it } from "vitest";
import { heroStages, heroState } from "../src/lib/heroTimeline";
import manifest from "../src/data/heroAssets.json";

describe("scroll-driven house story", () => {
  it("contains eleven contiguous named stages", () => {
    expect(heroStages).toHaveLength(11);
    expect(heroStages[0].start).toBe(0);
    expect(heroStages.at(-1)?.end).toBe(1);
    for (let i = 1; i < heroStages.length; i++) expect(heroStages[i]!.start).toBe(heroStages[i - 1]!.end);
    for (const stage of heroStages) expect(stage.detail.length).toBeGreaterThan(60);
  });

  it("stops active leaks before extraction while residual moisture remains", () => {
    expect(heroState(.34).leaks).toBe(0);
    expect(heroState(.34).wet).toBeGreaterThan(.9);
  });

  it("is entirely derived from scroll progress and reverses exactly", () => {
    const before = heroState(.44);
    heroState(.91);
    expect(heroState(.44)).toEqual(before);
  });

  it("keeps air movers through the drying phase, then removes them", () => {
    expect(heroState(.56).airMovers).toBeGreaterThan(.95);
    expect(heroState(.82).airMovers).toBeGreaterThan(.95);
    expect(heroState(1).airMovers).toBe(0);
  });

  it("finishes dry with no rain or wetness", () => {
    const final = heroState(1);
    expect(final.stageIndex).toBe(10);
    expect(final.rain).toBe(0);
    expect(final.wet).toBe(0);
    expect(final.moisture).toBe(0);
    expect(final.recovery).toBe(1);
  });

  it("registers each piece of equipment inside the architectural world", () => {
    for (const id of ["extractor", "am1", "am2", "am3", "am4", "dehu"] as const) {
      const asset = manifest.assets[id];
      expect(asset.path.length).toBeGreaterThan(30);
      expect(asset.registered[0]).toBeGreaterThan(.4);
      expect(asset.registered[0]).toBeLessThan(.9);
      expect(asset.registered[1]).toBeGreaterThan(.3);
      expect(asset.registered[1]).toBeLessThan(.8);
    }
  });
});
