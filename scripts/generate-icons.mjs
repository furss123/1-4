import sharp from "sharp";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const source = path.join(root, "public", "logo-namak.png");
const outDir = path.join(root, "public");

/** Near-white pixels → transparent (school logo on white background) */
async function logoWithTransparentBg() {
  const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  const pixels = new Uint8ClampedArray(data);
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max === 0 ? 0 : (max - min) / max;

    if (r > 235 && g > 235 && b > 235) {
      pixels[i + 3] = 0;
    } else if (r > 220 && g > 220 && b > 220 && saturation < 0.12) {
      pixels[i + 3] = Math.min(pixels[i + 3], 48);
    }
  }

  return sharp(Buffer.from(pixels), {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).png();
}

async function writePng(pipeline, name, size) {
  const file = path.join(outDir, name);
  await pipeline.clone().resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(file);
  console.log(`wrote ${name} (${size}x${size})`);
}

async function writeIco(pipeline) {
  const sizes = [16, 32, 48];
  const pngBuffers = await Promise.all(
    sizes.map((size) =>
      pipeline
        .clone()
        .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer(),
    ),
  );

  const file = path.join(outDir, "favicon.ico");
  const ico = buildIco(pngBuffers, sizes);
  await writeFile(file, ico);
  console.log("wrote favicon.ico");
}

/** Minimal ICO container (PNG-embedded) for modern browsers */
function buildIco(buffers, sizes) {
  const count = buffers.length;
  const headerSize = 6 + count * 16;
  let offset = headerSize;
  const parts = [];

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  buffers.forEach((buf, i) => {
    const size = sizes[i];
    const entryOffset = 6 + i * 16;
    header.writeUInt8(size === 256 ? 0 : size, entryOffset);
    header.writeUInt8(size === 256 ? 0 : size, entryOffset + 1);
    header.writeUInt8(0, entryOffset + 2);
    header.writeUInt8(0, entryOffset + 3);
    header.writeUInt16LE(1, entryOffset + 4);
    header.writeUInt16LE(32, entryOffset + 6);
    header.writeUInt32LE(buf.length, entryOffset + 8);
    header.writeUInt32LE(offset, entryOffset + 12);
    parts.push(buf);
    offset += buf.length;
  });

  return Buffer.concat([header, ...parts]);
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const base = await logoWithTransparentBg();

  await writePng(base, "icon-192.png", 192);
  await writePng(base, "icon-512.png", 512);
  await writePng(base, "apple-touch-icon.png", 180);
  await writePng(base, "favicon-32.png", 32);
  await writeIco(base);

  await base
    .clone()
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(outDir, "logo-namak-transparent.png"));

  console.log("done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
