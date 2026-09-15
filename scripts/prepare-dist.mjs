import { cp } from "node:fs/promises";
await cp("dist/server/entry.mjs", "dist/server/index.js");
