export type ProjectImage = {
  src: string;
  alt: string;
  label: string;
  width: number;
  height: number;
};

// Add approved field photography here. Do not add customer names, addresses,
// outcomes, or project claims unless the business has verified them.
export const projectImages: ProjectImage[] = [
  { src: "/images/projects/united-vehicle-equipment.webp", alt: "UNITED service vehicle with professional drying equipment", label: "Ready for response", width: 1400, height: 788 },
  { src: "/images/projects/containment-detail.webp", alt: "Protected work area with HEPA filtration equipment", label: "Work-area protection", width: 675, height: 900 },
  { src: "/images/projects/containment-entry.webp", alt: "Temporary containment at a residential work-area entrance", label: "Controlled containment", width: 675, height: 900 },
  { src: "/images/projects/dehumidifier-containment.webp", alt: "Commercial dehumidifier and air mover inside containment", label: "Environmental control", width: 416, height: 900 },
  { src: "/images/projects/thermal-inspection.webp", alt: "Handheld thermal imaging inspection of a ceiling", label: "Moisture investigation", width: 675, height: 900 },
  { src: "/images/projects/moisture-mapping.webp", alt: "Technician using a thermal imaging device in an affected area", label: "Mapping the affected area", width: 416, height: 900 },
  { src: "/images/projects/hallway-drying.webp", alt: "Air mover and dehumidifier positioned in a residential hallway", label: "Targeted drying", width: 675, height: 900 },
  { src: "/images/projects/structural-drying.webp", alt: "Air movers operating in a room with exposed structural materials", label: "Structural drying", width: 675, height: 900 },
  { src: "/images/projects/protective-equipment.webp", alt: "Restoration technician wearing protective equipment", label: "Prepared for the conditions", width: 416, height: 900 }
];
