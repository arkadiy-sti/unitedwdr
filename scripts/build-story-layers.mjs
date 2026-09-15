import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

// The HTML storyboard supplies the photographs. These soft masks isolate
// changing story elements so the architectural master never crossfades.
const output = new URL("../public/images/story-layers/", import.meta.url);
const source = new URL("../public/images/story-html/", import.meta.url);
await mkdir(output, { recursive: true });

const layers = [
  ["wet", 3, '<ellipse cx="823" cy="222" rx="99" ry="88"/><ellipse cx="815" cy="393" rx="91" ry="81"/><ellipse cx="1110" cy="420" rx="118" ry="80"/><ellipse cx="1030" cy="735" rx="224" ry="75"/>'],
  ["van", 4, '<rect x="-36" y="555" width="660" height="390" rx="42"/>'],
  ["extraction", 6, '<ellipse cx="1020" cy="716" rx="180" ry="100"/>'],
  ["air", 8, '<ellipse cx="836" cy="416" rx="87" ry="54"/><ellipse cx="964" cy="420" rx="65" ry="52"/><ellipse cx="1090" cy="418" rx="75" ry="63"/><ellipse cx="1250" cy="411" rx="78" ry="65"/><ellipse cx="812" cy="735" rx="85" ry="79"/><ellipse cx="1055" cy="738" rx="83" ry="70"/><ellipse cx="1173" cy="746" rx="100" ry="88"/>'],
  ["dehumidification", 9, '<ellipse cx="1150" cy="720" rx="132" ry="125"/><ellipse cx="540" cy="806" rx="175" ry="113"/>']
];

for (const [name, frame, shapes] of layers) {
  const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="24"/></filter></defs><g fill="white" filter="url(#soft)">${shapes}</g></svg>`);
  const alpha = await sharp(mask).png().toBuffer();
  await sharp(fileURLToPath(new URL(`stage-${frame}.webp`, source)))
    .ensureAlpha()
    .composite([{ input: alpha, blend: "dest-in" }])
    .webp({ quality: 84, effort: 5 })
    .toFile(fileURLToPath(new URL(`${name}.webp`, output)));
}
console.log(`Built ${layers.length} registered story layers.`);
