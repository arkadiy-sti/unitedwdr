# UNITED Water Damage Restoration

Production-oriented Astro/TypeScript website for UNITED WATER DAMAGE RESTORATION in Santa Clara, serving San Jose and the Bay Area. The site combines an emergency-first conversion path with a scroll-driven restoration story, substantive service/location pages, Cloudflare Worker form handling, technical SEO, and centralized business rules.

## Local setup

Requirements: Node 22.13+ and npm.

```bash
cp .env.example .env
npm install
npm run dev
```

Use Cloudflare's Turnstile test keys locally. Online form delivery remains unavailable until `LEAD_WEBHOOK_URL` is set.

## Commands

- `npm run dev` — Astro development server
- `npm run build` — strict Astro check and Cloudflare build
- `npm run preview` — local Worker preview
- `npm run typecheck` — strict TypeScript/Astro validation
- `npm run lint` — TypeScript lint
- `npm test` — validation/content unit tests
- `npm run deploy` — build and deploy with Wrangler

## Architecture

Most pages are content-first Astro output. `/api/leads` runs on Cloudflare and performs request-size checks, Zod validation, honeypot rejection, server-side Turnstile verification, and provider-neutral webhook delivery. The homepage story uses one locked conceptual cutaway house, SVG-masked photographic object layers, localized canvas rain, and a section-local reversible scroll controller. It has eleven stages and keeps semantic copy readable without animation. See `docs/HERO_RESTART.md` for asset provenance, editing points, and visual QA requirements.

Business facts and the single 24/7 feature flag live in `src/config/businessConfig.ts`. Future voice, SMS, chat, n8n/webhook, CRM, and scheduling switches live in `src/config/integrations.ts`. Services, locations, and FAQs live in `src/data/`.

## Editing content

- Change phone, email, address, canonical origin, or emergency coverage in `src/config/businessConfig.ts`.
- Enable 24/7 wording only after call handling is operational by setting `emergencySupport24x7: true`.
- Add a service object in `src/data/services.ts`; the service route is generated from its slug.
- Add a city only after writing genuinely unique local guidance in `src/data/locations.ts`. Do not publish city-name-swapped doorway pages.
- Add verified reviews only from an approved source dataset. No review component is public until that exists.
- Add approved field photos to `source-assets/projects/`, create optimized WebP versions in `public/images/projects/`, then add their path, dimensions, factual label, and accessible alt text to `src/data/projects.ts`. The gallery component requires no editing. Never add a customer name, address, outcome, or location unless it has been verified and approved for publication.

## Forms and integrations

Environment variables:

- `PUBLIC_TURNSTILE_SITE_KEY` — public widget key
- `TURNSTILE_SECRET_KEY` — secret, server only
- `LEAD_WEBHOOK_URL` — email/n8n/CRM gateway endpoint
- `LEAD_WEBHOOK_SECRET` — optional bearer secret
- `ANALYTICS_PROVIDER` — reserved; defaults to `none`

The UI emits privacy-neutral custom events (`phone_click`, `request_service_open`, `request_service_submit`, `contact_agent_open`, and related events). Connect the `united:analytics` event only after an approved analytics provider and consent strategy exist.

Photo upload is deliberately absent. A future implementation should use private Cloudflare R2, server-side MIME inspection, count/size limits, randomized names, malware handling, and short-lived access.

## Cloudflare deployment

`astro.config.mjs` uses the Cloudflare adapter and prerenders reusable content where appropriate; `wrangler.jsonc` targets the generated Worker. Configure production secrets in Cloudflare, run the full audit scripts, deploy, then validate redirects, headers, form delivery, sitemap, and the canonical hostname before DNS cutover.

Read `docs/DEPLOYMENT.md` and `docs/LAUNCH_CHECKLIST.md` before production. Legal copy, real reviews/photos, credential claims, 24/7 activation, lead routing, rate limiting, DNS, Search Console, and sitemap submission require business-side completion.

## Asset record

- `source-assets/united-logo-source.png` — supplied raster source
- `public/images/united-logo.webp` — optimized web logo
- `source-assets/california-house-master.png` — original generated conceptual master; not customer work
- `public/images/california-house.webp` — optimized story/hero asset
- `source-assets/story-reference/` — approved 12-frame conceptual restoration storyboard
- `public/images/story-reference/` — optimized WebP frames used by the scroll narrative
- `source-assets/projects/` — original approved UNITED field photography
- `public/images/projects/` — optimized gallery derivatives
- `src/data/projects.ts` — editable gallery order, labels, dimensions, and alt text
- `public/uwd-hero/assets/` — new locked house and masked photographic object source images
- `src/data/heroAssets.json` — sprite masks, sizes, and fixed room/driveway positions

Generated house prompt: a wide premium 2.5D cutaway Northern California home, centered with roof, upstairs bathroom, laundry, wall, and floor layers visible; calm architectural visualization in logo-derived navy/cyan/warm neutrals; no people, text, logo, damage, mold, equipment, or watermark. Generated with the built-in image generation tool.
