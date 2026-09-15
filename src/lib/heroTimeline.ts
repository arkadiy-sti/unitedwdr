export const heroStages = [
  { id: "loss", label: "01 / WATER LOSS", title: "Water enters the home", copy: "A roof leak, upstairs bathroom leak, or washing-machine failure can send water well beyond the first visible puddle.", detail: "Stop the water source when it is safe to do so. Avoid entering areas with electrical hazards, then call for an assessment of the affected rooms and materials.", start: 0, end: .08 },
  { id: "migration", label: "02 / MOISTURE MIGRATION", title: "Moisture moves through materials", copy: "Water can wick into drywall and framing, pass beneath flooring, and reach insulation or the room below.", detail: "A dry-looking surface can conceal wet layers. The response needs to consider adjacent rooms, floor assemblies, wall cavities, and materials below an upstairs loss.", start: .08, end: .16 },
  { id: "arrival", label: "03 / UNITED ARRIVES", title: "A local response begins", copy: "The response starts with the water source, immediate property protection, and a clear assessment of affected areas.", detail: "The first decisions are practical: confirm the source has stopped, identify immediate risks, protect unaffected areas, and decide where inspection and removal should begin.", start: .16, end: .24 },
  { id: "inspection", label: "04 / INSPECTION", title: "Find where the water went", copy: "Moisture readings and visual inspection help map affected materials against comparable dry areas—not just what looks wet.", detail: "Technicians compare affected materials with similar dry materials, document the moisture pattern, and determine which assemblies can be dried in place or need further access.", start: .24, end: .33 },
  { id: "extraction", label: "05 / EXTRACTION", title: "Remove accessible water", copy: "Standing and accessible water is extracted first. Less bulk water means a more controlled drying phase.", detail: "Extraction addresses water that equipment can remove directly. The drying plan then targets moisture remaining in porous materials and concealed assemblies.", start: .33, end: .43 },
  { id: "equipment", label: "06 / AIR MOVERS", title: "Place equipment with purpose", copy: "Air movers are positioned at the affected rooms and surfaces according to the drying plan, not scattered at random.", detail: "Equipment placement depends on the room, the wet surfaces, the materials involved, and the access available. The setup can change as readings improve.", start: .43, end: .52 },
  { id: "airflow", label: "07 / AIRFLOW", title: "Move air across wet surfaces", copy: "Directed air movement supports evaporation at wet materials while the affected indoor environment is managed.", detail: "Air movers circulate air over targeted materials. The goal is controlled evaporation, not simply putting a fan in the room and waiting.", start: .52, end: .61 },
  { id: "dehumidification", label: "08 / DEHUMIDIFICATION", title: "Control the indoor air", copy: "Commercial dehumidification captures moisture released into the air so evaporation can continue effectively.", detail: "As materials release moisture, dehumidification helps remove it from the indoor air. Temperature and relative humidity are considered alongside material readings.", start: .61, end: .70 },
  { id: "monitoring", label: "09 / MONITORING", title: "Measure and adjust", copy: "Technicians track material moisture and indoor conditions, then adjust the setup as the structure changes.", detail: "Repeat measurements show whether the drying plan is working. If a material is not responding as expected, the setup and scope need another look.", start: .70, end: .79 },
  { id: "drying", label: "10 / DRYING PROGRESS", title: "The structure dries gradually", copy: "Readings trend toward the drying goal. Equipment stays in place until the affected materials are ready for verification.", detail: "Different assemblies dry at different rates. Progress is judged from documented conditions and appropriate material comparisons, not just by touch or appearance.", start: .79, end: .90 },
  { id: "complete", label: "11 / VERIFIED DRYING", title: "Dry. Documented. Ready to move forward.", copy: "The drying phase concludes with documented conditions and a clear explanation of any remaining repair work.", detail: "After drying is verified, the property owner should receive a clear account of what was addressed and whether any repairs or separate remediation steps remain.", start: .90, end: 1 }
] as const;

export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
export const smoothstep = (value: number) => { const t = clamp01(value); return t * t * (3 - 2 * t); };
const rise = (progress: number, start: number, end: number) => smoothstep((progress - start) / (end - start));
const fall = (progress: number, start: number, end: number) => 1 - rise(progress, start, end);
const envelope = (progress: number, inStart: number, inEnd: number, outStart: number, outEnd: number) => rise(progress, inStart, inEnd) * fall(progress, outStart, outEnd);

export function heroState(progress: number) {
  const p = clamp01(progress);
  const nextStage = heroStages.findIndex((stage) => p < stage.end);
  const stageIndex = nextStage < 0 ? heroStages.length - 1 : nextStage;
  return {
    progress: p,
    stageIndex,
    rain: fall(p, .04, .84),
    storm: fall(p, .13, .91),
    leaks: fall(p, .16, .30),
    wet: fall(p, .77, .97),
    moisture: envelope(p, .05, .14, .75, .96),
    van: envelope(p, .16, .225, .91, .995),
    inspection: envelope(p, .235, .27, .32, .40),
    extraction: envelope(p, .33, .375, .42, .50),
    airMovers: envelope(p, .425, .49, .91, .98),
    airflow: envelope(p, .52, .575, .86, .95),
    dehumidifier: envelope(p, .61, .67, .945, .995),
    monitoring: envelope(p, .70, .735, .79, .86),
    recovery: rise(p, .78, 1),
    vanTravel: rise(p, .16, .225) * fall(p, .91, .995),
    waterReduction: rise(p, .34, .49)
  };
}
