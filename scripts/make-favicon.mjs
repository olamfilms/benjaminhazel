import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

/*
 * Regenerate the site icons from a single square source image.
 *
 *   npm run favicon -- path/to/logo.png
 *
 * Writes app/favicon.ico (16/32/48), app/icon.png and app/apple-icon.png.
 * Next.js picks those filenames up automatically and emits the link tags.
 *
 * A source of 512px or more gives the best result. The current source is 50px,
 * so the 180px touch icon is upscaled and thresholded rather than resampled
 * from real detail.
 */
const src = process.argv[2];
const appDir = process.argv[3] ?? "app";

if (!src) {
  console.error("usage: npm run favicon -- path/to/logo.png");
  process.exit(1);
}

/** Build a multi-size .ico whose entries are PNG-encoded (supported since Vista). */
function buildIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(pngs.length, 4);

  const dir = Buffer.alloc(16 * pngs.length);
  let offset = header.length + dir.length;

  pngs.forEach(({ size, data }, i) => {
    const e = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, e + 0); // width
    dir.writeUInt8(size >= 256 ? 0 : size, e + 1); // height
    dir.writeUInt8(0, e + 2); // palette count
    dir.writeUInt8(0, e + 3); // reserved
    dir.writeUInt16LE(1, e + 4); // colour planes
    dir.writeUInt16LE(32, e + 6); // bits per pixel
    dir.writeUInt32LE(data.length, e + 8);
    dir.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });

  return Buffer.concat([header, dir, ...pngs.map((p) => p.data)]);
}

const pngs = [];
for (const size of [16, 32, 48]) {
  pngs.push({
    size,
    data: await sharp(src)
      .resize(size, size, { kernel: "lanczos3" })
      .png({ compressionLevel: 9 })
      .toBuffer(),
  });
}

await fs.writeFile(path.join(appDir, "favicon.ico"), buildIco(pngs));

// The browser-tab icon: Ben's file untouched.
await fs.copyFile(src, path.join(appDir, "icon.png"));

/*
 * iOS rounds the corners of touch icons, and this mark runs to the edge, so the
 * letterforms would get clipped. Inset it to 80% on its own white ground.
 * Upscaling 50px art is lossy, so threshold back to two colours to re-harden
 * the edges rather than shipping a blurred mark.
 */
const inset = await sharp(src)
  .resize(720, 720, { kernel: "lanczos3" })
  .greyscale()
  .threshold(128)
  .resize(144, 144, { kernel: "lanczos3" })
  .toBuffer();

await sharp({
  create: {
    width: 180,
    height: 180,
    channels: 3,
    background: { r: 255, g: 255, b: 255 },
  },
})
  .composite([{ input: inset, left: 18, top: 18 }])
  .png({ compressionLevel: 9 })
  .toFile(path.join(appDir, "apple-icon.png"));

for (const f of ["favicon.ico", "icon.png", "apple-icon.png"]) {
  const p = path.join(appDir, f);
  const { size } = await fs.stat(p);
  console.log(f.padEnd(16), size.toLocaleString() + " bytes");
}
