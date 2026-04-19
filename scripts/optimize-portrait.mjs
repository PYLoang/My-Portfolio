import sharp from 'sharp';
import { mkdirSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';

const SRC = 'public/assets/portrait.png';
const OUT_DIR = 'public/assets';

const TARGETS = [
  { width: 320, suffix: '-320' },
  { width: 640, suffix: '-640' },
  { width: 960, suffix: '-960' },
];

if (!existsSync(SRC)) {
  console.error(`Source not found: ${SRC}`);
  process.exit(1);
}

mkdirSync(dirname(SRC), { recursive: true });

for (const t of TARGETS) {
  const out = `${OUT_DIR}/portrait${t.suffix}.webp`;
  await sharp(SRC).resize(t.width, t.width, { fit: 'cover' }).webp({ quality: 82 }).toFile(out);
  console.log(`✓ ${out}`);
}
