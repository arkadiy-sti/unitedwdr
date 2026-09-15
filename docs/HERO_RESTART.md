# House-story restart

The homepage now uses one locked 1672×941 cutaway house image for every stage. It does not crossfade between different house renders. The eleven named stages and all visual states are calculated from the local scroll progress of the `uwd-hero-story` section in `src/lib/heroTimeline.ts`; scrolling upward reverses the same calculations.

## Source and asset treatment

`public/uwd-hero/assets/base-house.webp` is the approved `кадр дома - готово.png` house, converted to WebP in the supplied prototype package. `source-02.webp`, `source-11.webp`, and `source-12.webp` came from the neighboring transparent-object preparation. `src/data/heroAssets.json` records each object's crop, original mask, size, and registered position. `PhotoObject.astro` displays the unchanged photographic pixels through SVG clipping paths, so the objects appear transparent without flattening the house into each frame. The base remains fixed.

The extraction tool uses a photographic silhouette from source frame 12, registered to the lower living area. A restrained SVG hose is drawn from the van toward this tool only during extraction. The hand-drawn photo mask must be visually approved at production size; a dedicated isolated `EX-01` photo would allow a cleaner edge later without changing scroll logic.

## Interaction and performance

The sticky sequence is 800svh desktop, 650svh tablet, and 560svh mobile. Later photographic source frames are assigned only shortly before their stage begins, keeping the initial hero transfer close to the base house and logo. Rain is drawn on a single canvas only while the section is visible and the tab is active. Rain is excluded from the open interior; three local drip origins represent roof, bathroom, and laundry loss. Airflow is confined to room clips and introduced after air movers are placed. Object installation, wetness reduction, monitoring, and weather recovery use smooth progress curves. The last stage grows a paper-colored gradient upward from the bottom, preserving the visible house while the next section scrolls in; it does not fade to a blank screen.

On mobile, the full house remains fixed and visible within a focused 130vw scene; a blurred version fills the surrounding viewport. This avoids clipping the upstairs laundry or panning the house during scroll. Equipment is given a modest mobile-only scale increase so the small photographic objects remain legible. Reduced-motion users get a static house and the full story as semantic text. The illustration is labeled as conceptual, not a UNITED customer project. All business claims still come from the existing configuration: 24/7 service, licensing, and insurance are not claimed without verification, despite the source brief suggesting them.

The introductory CTA panel fades away before the van arrives so it cannot cover the vehicle or remain as ghosted text. The always-visible site-header phone action and a compact CTA in every desktop stage caption remain available. On mobile, a stage-specific explanation and call action replaces the intro panel below the house; the existing sticky call action remains available. The two distinct text levels are maintained in `heroTimeline.ts` as concise visual captions and additional homeowner context.

## Editing

- Narrative: `src/lib/heroTimeline.ts`
- Registered object positions and silhouette paths: `src/data/heroAssets.json`
- Scene markup: `src/components/hero/UwdHeroStory.astro`
- Scroll controller and rain: `src/components/hero/heroController.ts`
- Responsive composition: `src/styles/uwd-hero.css`

Visual QA of the isolated hero was completed at 375×667, 375×812, 768×1024, and 1440×900. The exit was revised after the first QA pass because a full-screen white fade produced an empty frame; it now reveals paper only from the lower edge. Before launch, repeat the check inside the full Astro site, including reverse scrolling, reduced motion, the real header and mobile sticky call. Confirm masked sprite edges on the target browsers; the source van mask may clip part of its front edge. Replace that asset if the edge is visible at production size.
