# Deployment

Target: Cloudflare Workers with Astro's Cloudflare adapter. Static content is prerendered; `/api/leads` is the server endpoint. Build with `npm run build`, preview with `npm run preview`, and deploy with `npm run deploy` after setting environment values.

Required production secrets: `TURNSTILE_SECRET_KEY`; provider-dependent `LEAD_WEBHOOK_URL` and `LEAD_WEBHOOK_SECRET`. Public `PUBLIC_TURNSTILE_SITE_KEY` is safe to expose. Preview uses Cloudflare local bindings and a test key.

Before DNS cutover, test all redirects, form delivery, canonical host behavior, headers, sitemap, and rollback. Keep the Squarespace origin available until crawl and lead checks pass.
