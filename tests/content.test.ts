import { describe,expect,it } from "vitest"; import { businessConfig } from "../src/config/businessConfig"; import { services } from "../src/data/services"; import { priorityLocations } from "../src/data/locations";
import { serviceDetails } from "../src/data/serviceDetails";
describe("critical content",()=>{
  it("keeps the canonical phone link centralized",()=>expect(businessConfig.phoneHref).toBe("+14083854892"));
  it("keeps the 24/7 label in sync with the emergencySupport24x7 flag",()=>{
    // businessConfig.emergencySupport24x7 is a deliberate business decision
    // (see README: "Enable 24/7 wording only after call handling is
    // operational"), not something this suite should assume either way.
    // This guard only checks the label never drifts from that flag.
    expect(businessConfig.serviceLabel().includes("24/7")).toBe(businessConfig.emergencySupport24x7);
  });
  it("has unique service slugs",()=>expect(new Set(services.map(s=>s.slug)).size).toBe(services.length));
  it("gives each service a complete, distinct field guide",()=>{
    expect(Object.keys(serviceDetails).sort()).toEqual(services.map(s=>s.slug).sort());
    for(const service of services){
      const detail=serviceDetails[service.slug];
      if (!detail) throw new Error(`Missing service detail for ${service.slug}`);
      expect(detail.situations.length).toBeGreaterThanOrEqual(5);
      expect(detail.work.length).toBeGreaterThanOrEqual(4);
      expect(detail.questions.length).toBeGreaterThanOrEqual(2);
      expect(detail.assessment.length).toBeGreaterThan(180);
      expect(detail.materials.length).toBeGreaterThan(120);
    }
  });
  it("has unique priority location slugs",()=>expect(new Set(priorityLocations.map(l=>l.slug)).size).toBe(priorityLocations.length));
});
