import path from 'node:path';
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';

const require = createRequire(import.meta.url);
const sharpPath = path.resolve(
  'node_modules/.pnpm/sharp@0.35.5_@types+node@20.19.43/node_modules/sharp'
);
const sharp = require(sharpPath);

const OUT = 'brandkit/out';
await fs.mkdir(OUT, { recursive: true });

const BG = { r: 250, g: 246, b: 240 };
const THRESHOLD = 26;
const CREAM = '#F7F1E5'; // exact brand token, used only as an opaque backing for apple-touch-icon

async function keyOutBackground(input) {
  const img = sharp(input).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const dist = Math.sqrt((r - BG.r) ** 2 + (g - BG.g) ** 2 + (b - BG.b) ** 2);
    if (dist < THRESHOLD) data[i + 3] = 0;
  }
  return sharp(data, { raw: { width, height, channels } }).png();
}

const trim = (s) => s.trim({ background: '#00000000', threshold: 10 });

// 1. Icon (full color, transparent) — source: public/icon.png
const iconBuf = await trim(await keyOutBackground('public/icon.png')).png().toBuffer();
await sharp(iconBuf).toFile(`${OUT}/nerlev-icon.png`);
console.log('wrote nerlev-icon.png');

// 2. Primary horizontal lockup (icon + wordmark, transparent) — from logo.pt.png
{
  const box = { left: 460, top: 2378, width: 1950, height: 425 };
  const cropped = sharp('public/logo.pt.png').extract(box);
  const patch = await sharp({
    create: { width: 400, height: 45, channels: 3, background: `rgb(${BG.r},${BG.g},${BG.b})` },
  }).png().toBuffer();
  const patched = await cropped.composite([{ input: patch, left: 720, top: 0 }]).png().toBuffer();
  const buf = await trim(await keyOutBackground(patched)).png().toBuffer();
  await sharp(buf).toFile(`${OUT}/nerlev-lockup-primary.png`);
  console.log('wrote nerlev-lockup-primary.png');
}

// 3. Monochrome lockup (icon + wordmark, single navy tone, transparent) — from logo.pt.png
let monoLockupBuf;
{
  const box = { left: 1260, top: 1780, width: 1320, height: 420 };
  const cropped = sharp('public/logo.pt.png').extract(box);
  monoLockupBuf = await trim(await keyOutBackground(await cropped.png().toBuffer())).png().toBuffer();
  await sharp(monoLockupBuf).toFile(`${OUT}/nerlev-lockup-monochrome.png`);
  console.log('wrote nerlev-lockup-monochrome.png');
}

// 4. Monochrome icon only — crop the icon glyph out of the monochrome lockup
{
  const meta = await sharp(monoLockupBuf).metadata();
  const iconWidth = Math.round(meta.height * 1.05); // icon glyph is roughly square
  const cropped = sharp(monoLockupBuf).extract({
    left: 0,
    top: 0,
    width: Math.min(iconWidth, meta.width),
    height: meta.height,
  });
  const buf = await trim(cropped).png().toBuffer();
  await sharp(buf).toFile(`${OUT}/nerlev-icon-mono.png`);
  console.log('wrote nerlev-icon-mono.png');
}

// 5. Small-size favicon treatment: rays removed (approved simplification — full icon
//    blurs past legibility at 16-32px, per brand spec §52's own favicon test).
const iconMeta = await sharp(iconBuf).metadata();
const raysCutoff = Math.round(iconMeta.height * 0.28);
const smallIconBuf = await sharp(iconBuf)
  .extract({ left: 0, top: raysCutoff, width: iconMeta.width, height: iconMeta.height - raysCutoff })
  .trim({ background: '#00000000', threshold: 10 })
  .png()
  .toBuffer();
await sharp(smallIconBuf).toFile(`${OUT}/nerlev-icon-small.png`);
console.log('wrote nerlev-icon-small.png (rays removed, for 16-32px use)');

for (const size of [16, 32]) {
  await sharp(smallIconBuf)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(`${OUT}/favicon-${size}.png`);
}

// 6. Larger sizes keep the full icon (rays included) — legible at this scale.
for (const size of [48, 512]) {
  await sharp(iconBuf)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(`${OUT}/favicon-${size}.png`);
}

// Apple touch icon convention expects an opaque backing.
await sharp(iconBuf)
  .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .flatten({ background: CREAM })
  .toFile(`${OUT}/apple-touch-icon.png`);

console.log('wrote favicon pngs: 16, 32 (simplified), 48, 512 (full), apple-touch-icon 180 (full, cream backing)');
