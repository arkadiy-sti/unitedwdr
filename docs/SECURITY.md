# Security

The Worker/API validates JSON content type and size, trims all fields, enforces length/format/enum rules with Zod, rejects a honeypot, verifies Turnstile server-side, and returns safe generic errors. Production secrets stay in Cloudflare environment variables.

Headers include CSP with narrow Cloudflare Turnstile allowances, HSTS, nosniff, strict referrer policy, permissions policy, and `frame-ancestors 'none'`. The documented rate-limit hook is provider-neutral; production should bind Cloudflare Rate Limiting or Durable Objects before paid traffic.

Future uploads are disabled. Add them only with server-side MIME inspection, count/size limits, randomized object names, malware workflow, and private R2 storage.
