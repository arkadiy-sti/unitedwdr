import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
export default defineConfig({
  site: "https://www.unitedwdr.com", output: "server", adapter: cloudflare({ imageService: "compile" }),
  trailingSlash: "always", security: { checkOrigin: true },
  redirects: {
    "/home": { status: 301, destination: "/" }, "/contact-1": { status: 301, destination: "/contact/" },
    "/take-action": { status: 301, destination: "/contact/" },
    "/blogs/d9opo78teullyu1ingk8tinddqxsay": { status: 301, destination: "/blogs/" }
  }
});
