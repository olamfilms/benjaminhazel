/*
 * Drop full-size originals in /Photos, run `npm run photos`, and get web-sized
 * JPEGs in /public/photos with kebab-case names. Originals stay out of git.
 *
 * 2400px wide is enough for a full-bleed image on a retina laptop; Next resizes
 * down from there per breakpoint at request time.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = path.join(process.cwd(), "Photos");
const OUT = path.join(process.cwd(), "public", "photos");
const MAX_WIDTH = 2400;

const slugify = (name) =>
  name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") + ".jpg";

await fs.mkdir(OUT, { recursive: true });

const files = (await fs.readdir(SRC)).filter((f) => /\.(jpe?g|png|tiff?|webp)$/i.test(f));

if (files.length === 0) {
  console.log(`No images found in ${SRC}`);
}

for (const file of files) {
  const target = path.join(OUT, slugify(file));
  const info = await sharp(path.join(SRC, file))
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(target);

  console.log(
    `${file}  ->  photos/${path.basename(target)}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`,
  );
}
