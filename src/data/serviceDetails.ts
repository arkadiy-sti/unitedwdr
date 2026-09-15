export interface ServiceDetail {
  situations: string[];
  assessment: string;
  work: { title: string; detail: string }[];
  materials: string;
  closeout: string;
  immediate: string;
  questions: { q: string; a: string }[];
}

export const serviceDetails: Record<string, ServiceDetail> = {
  "water-damage-restoration": {
    situations: ["Burst or leaking supply lines", "Appliance and water-heater releases", "Roof, window, and fixture intrusion", "Wet walls, flooring, ceilings, and concealed cavities", "Water migrating from one level to another"],
    assessment: "We start by identifying the source, likely water path, safety concerns, and affected materials. Moisture instruments help compare suspect areas with appropriate unaffected materials; a reading must be interpreted for the particular assembly. The water source, time elapsed, and materials contacted guide cleaning, removal, and drying decisions. An active plumbing or roof problem may require repair by the appropriate trade before mitigation can succeed.",
    work: [
      { title: "Stabilize and map", detail: "Document affected rooms, protect safe-to-move contents, and check for electrical, structural, or contamination hazards." },
      { title: "Extract and access", detail: "Remove accessible liquid water. Open a cavity or remove a non-salvageable material only when justified by condition, contamination, or drying access." },
      { title: "Dry and adjust", detail: "Use air movement and dehumidification suited to the affected assemblies, then recheck material and indoor conditions as the plan progresses." },
      { title: "Verify and document", detail: "Record the work and the measurements or observations supporting the drying conclusion and remaining repair scope." }
    ],
    materials: "Drywall, insulation, carpet, pad, wood flooring, cabinets, subfloor, and framing respond differently to water. Salvageability depends on contamination, saturation, deterioration, access, and whether cleaning and drying can be verified. Removal is a field decision, not an automatic step in every loss.",
    closeout: "The mitigation record should identify affected areas, retained or removed materials, drying progress, and what remains for repair. Plumbing, reconstruction, and specialty hazardous-material work are separate scopes that may require other qualified or licensed professionals.",
    immediate: "If safe, stop the source. Avoid wet outlets, electrical equipment, and unstable ceilings. Photograph conditions and keep people away from water of unknown origin.",
    questions: [{ q: "Is extraction the same as restoration?", a: "No. Extraction removes accessible liquid water. Restoration also addresses wet materials, the drying environment, monitoring, documentation, and next repair steps." }, { q: "Will every wet wall be removed?", a: "No. The source and condition of the water, material condition, insulation, access, and drying response determine whether selective removal is necessary." }]
  },
  "flood-cleanup": {
    situations: ["Standing water on hard or carpeted floors", "Overflow from a fixture or appliance", "Rain or surface water entering a home", "Wet furniture, baseboards, and built-ins", "Water beneath flooring or in adjoining rooms"],
    assessment: "The word flood describes the visible condition, not how safe the water is. A fresh supply-line release and outdoor floodwater may require very different handling. Before cleanup, we consider the source and possible contaminants, electrical safety, affected contents, and where water may have traveled under finishes or into adjacent rooms.",
    work: [
      { title: "Make access safer", detail: "Identify wet electrical areas, unstable materials, slip hazards, and potentially contaminated zones before work begins." },
      { title: "Remove standing water", detail: "Extract accessible water with methods suited to the surface and volume, then inspect edges and floor layers for moisture left behind." },
      { title: "Sort and clean", detail: "Separate materials that can be cleaned and dried from saturated or contaminated porous materials that cannot reasonably be restored." },
      { title: "Transition to drying", detail: "After necessary cleaning and bulk-water removal, establish a monitored plan for retained wet assemblies." }
    ],
    materials: "Hard nonporous surfaces often can be cleaned and dried. Carpet, pad, wallboard, insulation, upholstered contents, and composite wood need closer evaluation, particularly after contact with soil, sewage, or other contaminants. Specialty contents may warrant a specialist rather than routine disposal.",
    closeout: "A clear floor does not prove concealed cavities are dry. Cleanup should end with documented water removal, material decisions, and a plan for any remaining drying or repair.",
    immediate: "Keep people and pets away from outdoor or unknown floodwater. Do not enter water near outlets or appliances. If safe, stop the source and photograph the affected rooms; avoid fans over visibly contaminated material.",
    questions: [{ q: "Does cleanup include drying walls?", a: "Removing standing water and drying a wall assembly are different tasks. A moisture assessment determines whether structural drying is needed." }, { q: "Can wet carpet be saved?", a: "Sometimes, depending on water source, time, carpet and pad condition, and whether the system can be cleaned and dried. Contaminated water changes that decision substantially." }]
  },
  "flood-restoration": {
    situations: ["Water across multiple rooms or levels", "Stormwater entering through building openings", "Wet flooring, walls, cabinets, and contents together", "Delayed discovery or extended saturation", "Losses requiring several trades or staged repairs"],
    assessment: "A larger loss is divided into affected zones. We consider origin and possible contamination, changes in elevation, hidden water pathways, contents, utilities, and material response. Exterior floodwater may carry soil, sewage, or chemicals and should not be assumed equivalent to an interior supply-line leak. Structural or electrical concerns call for the appropriate qualified professional.",
    work: [
      { title: "Stabilize the property", detail: "Establish safe access, record initial conditions, prioritize active water, and protect unaffected areas where practical." },
      { title: "Mitigate by zone", detail: "Extract bulk water and decide which wet or contaminated materials can be cleaned and dried versus selectively removed." },
      { title: "Dry and monitor", detail: "Set air movement and dehumidification to suit each assembly; do not assume every room dries at the same rate." },
      { title: "Prepare the handoff", detail: "Document mitigation and identify remaining repairs so the owner and subsequent trades understand the property’s condition." }
    ],
    materials: "Tile and its substrate, wet carpet and pad, swollen cabinetry, paper-faced drywall, and saturated insulation have different cleaning and drying potential. Water source and contact history are central to those decisions; a single removal rule does not fit every room.",
    closeout: "The mitigation phase should conclude with documented dry conditions for retained materials and a defined list of systems or finishes still needing repair. Reconstruction, plumbing, electrical, and structural work may require separate qualified trades and permits.",
    immediate: "Stay out of areas with suspected structural damage or wet electrical systems. Note when water was first seen and where it traveled. Photograph major damaged items before disposal unless safety requires immediate removal.",
    questions: [{ q: "How is this different from flood cleanup?", a: "Cleanup concentrates on water removal and initial cleaning. Flood restoration connects mitigation, monitored drying, documentation, and the transition to repairs." }, { q: "Is rebuilding included in mitigation?", a: "Not automatically. Emergency work, drying, and reconstruction are distinct phases. The written scope should identify what is included and what requires separate authorization or a trade." }]
  },
  "structural-drying": {
    situations: ["Wet wall and ceiling cavities", "Wood subfloors and framing", "Moisture beneath finished flooring", "Cabinet toe-kicks and enclosed spaces", "Layered assemblies still damp after extraction"],
    assessment: "A drying plan starts with a moisture map and an understanding of material layers. Readings from affected areas are compared with suitable unaffected areas or other defensible drying goals; there is no universal meter number for every building product. Temperature, relative humidity, and material conditions are considered together. The source and contamination conditions must be addressed before deciding to dry materials in place.",
    work: [
      { title: "Define drying zones", detail: "Mark wet boundaries and identify cavities or finishes that restrict evaporation." },
      { title: "Create access when justified", detail: "Open a cavity or remove unsalvageable material where necessary for safe, effective drying—not as routine demolition." },
      { title: "Control air and moisture", detail: "Aim air movers across appropriate wet surfaces and use dehumidification to remove moisture released into the air." },
      { title: "Measure and adjust", detail: "Recheck materials and indoor conditions, change equipment placement as warranted, and document the drying end point." }
    ],
    materials: "Dense wood, gypsum board, concrete, insulation, engineered flooring, and layered subfloors dry at different rates. Some finishes restrict evaporation; some porous or contaminated materials should not be dried in place. Heat or aggressive airflow is not automatically appropriate for every assembly.",
    closeout: "Equipment should be removed based on documented material response and a defensible drying goal—not because a surface feels dry or a preset number of days has passed.",
    immediate: "Do not move or switch off drying equipment without speaking with the team. Keep doors and containment in the configuration provided, and report new leaks, odors, or wet areas.",
    questions: [{ q: "How long does drying take?", a: "It depends on material, saturation, access, source, and indoor conditions. Progress is checked with readings; a fixed time promise is not reliable." }, { q: "Why use air movers and dehumidifiers together?", a: "Air movement supports evaporation from wet surfaces. Dehumidification removes that released moisture from the air so drying can continue under controlled conditions." }]
  },
  "water-extraction": {
    situations: ["Standing water on hard floors", "Wet carpet and pad after a supply-line event", "Water along wall bases or in low points", "Appliance discharge across finished rooms", "Bulk water that must be removed before drying"],
    assessment: "The water source, contact history, electrical conditions, surface type, and likely migration path are checked before extraction. A clean-looking puddle is not automatically safe. Where water has moved under flooring or into walls, extraction must be paired with moisture assessment and a subsequent drying or removal plan.",
    work: [
      { title: "Check conditions", detail: "Confirm access and electrical safety and consider whether the water may be contaminated." },
      { title: "Remove bulk water", detail: "Use techniques suited to the surface, volume, and material condition; mechanical removal reduces the moisture load more efficiently than evaporation alone." },
      { title: "Recheck affected edges", detail: "Inspect baseboards, transitions, adjoining rooms, and floor systems after the visible puddle is gone." },
      { title: "Plan the next phase", detail: "Decide whether retained materials need controlled drying, cleaning, or removal based on field conditions." }
    ],
    materials: "A hard floor may look dry while its substrate remains wet. Carpet face fiber, backing, pad, and subfloor are separate layers. Retention depends on contamination, condition, and whether cleaning and drying can be achieved.",
    closeout: "Extraction ends when accessible liquid water has been removed and remaining moisture has been assessed. It does not by itself establish a dry structure.",
    immediate: "If safe, shut off the source. Avoid water near outlets and appliances. Never use a household vacuum for water, and keep people away from water of unknown origin.",
    questions: [{ q: "Can extraction alone solve the loss?", a: "Only if inspection confirms that no affected materials remain wet and no cleaning or repair is needed. Many losses require follow-up drying." }, { q: "Can you extract beneath flooring?", a: "Some floor systems allow specialized extraction or drying; others need access or removal. Construction and water source determine the approach." }]
  },
  "sewage-cleanup": {
    situations: ["Toilet or sewer-line backups", "Wastewater from floor drains", "Overflow into occupied rooms", "Sewage-impacted carpet, pad, drywall, or contents", "Wastewater migrating through floor assemblies"],
    assessment: "The source must be stopped or controlled; a licensed plumber or utility may be needed for that repair. We identify the contact area and potential spread before work. Planning considers splash, aerosols, electrical hazards, porous materials, and concealed spaces. Clean areas should be protected from cross-contamination.",
    work: [
      { title: "Restrict and protect", detail: "Limit occupancy in the affected zone and use work-area controls and protective equipment appropriate to the conditions." },
      { title: "Remove wastewater", detail: "Extract accessible liquid and manage unsalvageable contaminated porous materials appropriately." },
      { title: "Physically clean", detail: "Clean retained surfaces; any disinfectant must be suitable for the surface and used according to its label. Spraying alone is not remediation." },
      { title: "Dry and document", detail: "After removal and cleaning, dry retained assemblies and record what remains for source repair or reconstruction." }
    ],
    materials: "Carpet, pad, insulation, paper-faced gypsum, and porous contents contacted by sewage often cannot be adequately cleaned and dried in place. Sound nonporous materials may be candidates for physical cleaning and appropriate disinfection. Actual contact and construction define the scope.",
    closeout: "The record should identify what was removed, cleaned, retained, and dried, plus unresolved source or repair issues. A generic promise that an area is sterile or free of all microorganisms is not appropriate.",
    immediate: "Keep people and pets out. Do not direct fans or HVAC airflow through contaminated areas before evaluation. Avoid direct contact and contact a plumber for an active sewer source if needed.",
    questions: [{ q: "Can sewage-soaked carpet be saved?", a: "Carpet and pad contacted by sewage commonly require removal because they are porous and difficult to clean reliably. The on-site assessment defines the exact scope." }, { q: "Does bleach alone make the area safe?", a: "No. Wastewater and impacted materials must be removed, retained surfaces physically cleaned, and appropriate controls used. Chemicals cannot replace those steps." }]
  },
  "mold-remediation": {
    situations: ["Visible growth on building materials", "Persistent moisture with suspected affected materials", "Growth found behind finishes during water-loss work", "Affected contents or enclosed spaces", "Complex projects needing independent assessment"],
    assessment: "The scope considers observed conditions, moisture history, affected materials, occupant sensitivities, and limits of what can be seen. Sampling is not automatically needed for every visible condition. An independent indoor environmental professional may be appropriate if extent, cause, health concerns, or verification criteria are complex or disputed. A restoration inspection is not a medical diagnosis.",
    work: [
      { title: "Define and contain", detail: "Set an appropriate work zone, dust controls, and HEPA filtration where the scope calls for them." },
      { title: "Remove or clean", detail: "Remove heavily affected porous material where appropriate and physically clean salvageable surfaces without spreading debris." },
      { title: "Correct the moisture", detail: "Coordinate source repair with the appropriate trade and dry retained materials. Remediation can fail if moisture remains." },
      { title: "Evaluate completion", detail: "Document work and moisture conditions. An independent post-remediation evaluation may be specified; no universal mold-free guarantee is implied." }
    ],
    materials: "Paper-faced drywall, ceiling tile, insulation, carpet, and other porous materials with established growth may need removal. Sound hard surfaces may be cleanable. Chemical treatment or fogging alone does not replace source control, physical removal, cleaning, and drying.",
    closeout: "A useful closeout separates remediation work from any independent environmental assessment. It states what was removed or cleaned, the moisture condition, and whether a separate verification protocol applies.",
    immediate: "Do not scrape or fan visible growth. Limit access, stop any active leak if safe, and tell the team about prior water events and occupant sensitivities. Medical questions belong with a healthcare professional.",
    questions: [{ q: "Does every water loss need mold remediation?", a: "No. Remediation is based on observed or assessed conditions. Mold should not be assumed after every leak." }, { q: "Is mold testing always necessary?", a: "No. Visible growth often can be addressed without routine sampling, while complex or disputed conditions may benefit from an independent assessor and defined verification criteria." }]
  },
  "leak-damage": {
    situations: ["Roof leaks after rain", "Bathroom supply, drain, or fixture leaks", "Washing-machine hose or drain failures", "Dishwasher, refrigerator, or water-heater leaks", "Slow leaks behind cabinets, walls, or ceilings"],
    assessment: "We establish the source and timing as far as practical, with a qualified plumber or roofer engaged when the repair is outside mitigation. Inspection follows the likely path into adjacent and lower assemblies. Stains, swelling, odor, or elevated meter response guide investigation but do not define every hidden condition. Selective access is considered only where it changes the drying or material decision.",
    work: [
      { title: "Confirm source control", detail: "Check whether water is still entering and coordinate the source repair with the appropriate trade if needed." },
      { title: "Map migration", detail: "Inspect the source room, adjoining areas, and levels below; compare suspect materials with suitable unaffected areas." },
      { title: "Mitigate materials", detail: "Extract accessible water, protect contents, and dry or remove materials according to condition, contamination, and access." },
      { title: "Verify and document", detail: "Follow material response and record the drying conclusion or remaining repair scope." }
    ],
    materials: "A roof leak may wet insulation and ceiling board before a stain appears. Bathroom or laundry water can travel under tile, vinyl, laminate, or wood and affect the floor below. Swollen composite cabinets and saturated insulation may not be salvageable; sound framing may be retained and dried when conditions permit.",
    closeout: "Source repair and water-damage mitigation should each be accounted for. A stopped leak is not the endpoint until affected retained materials are evaluated and the next repair steps are understood.",
    immediate: "If safe, shut off the affected fixture or supply. Avoid a bulging ceiling and wet electrical fittings. Photograph the source and rooms below; note when the leak first appeared and whether it has recurred.",
    questions: [{ q: "The leak is fixed. Do I still need drying?", a: "Possibly. Stopping the leak does not dry already-wet materials. Inspection determines whether moisture remains and what response is appropriate." }, { q: "Will the whole wall or floor be opened?", a: "Not automatically. Access is planned around the assembly, moisture path, contamination, and whether retained materials can be dried and verified." }]
  }
};
