#!/usr/bin/env node
/*
 * generate-icons.mjs — renders the app's home-screen icons as PNGs with zero
 * dependencies (hand-built PNG chunks + Node's built-in zlib). Run from the
 * repo root:
 *
 *   node tools/generate-icons.mjs
 *
 * Writes src/assets/icons/icon-180.png (iOS apple-touch-icon),
 * icon-192.png and icon-512.png (web app manifest). The design is Efya's
 * bloom 🌺 — six petals + gold heart on a pink gradient — kept inside the
 * central 66% so circular "maskable" crops lose nothing important.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { deflateSync } from "node:zlib";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "assets", "icons");

// ---- minimal PNG writer (RGBA, 8-bit) ----
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}
function png(width, height, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // color type RGBA
  // raw scanlines, each prefixed with filter byte 0
  const raw = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    const row = y * (1 + width * 4);
    raw[row] = 0;
    rgba.copy(raw, row + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ---- the bloom design ----
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const PINK_TOP = hex("#ffabd1");
const PINK_BOTTOM = hex("#ff5fa2");
const PETAL = hex("#fff0f6");
const HEART = hex("#f4b400");
const HEART_RING = hex("#e63e86");

// Smooth 1px-feathered circle coverage for cheap anti-aliasing.
function circleCov(px, py, cx, cy, r, feather) {
  const d = Math.hypot(px - cx, py - cy);
  if (d <= r - feather) return 1;
  if (d >= r + feather) return 0;
  return (r + feather - d) / (2 * feather);
}
function blend(dst, src, cov) {
  return [
    dst[0] + (src[0] - dst[0]) * cov,
    dst[1] + (src[1] - dst[1]) * cov,
    dst[2] + (src[2] - dst[2]) * cov,
  ];
}

function renderIcon(size) {
  const rgba = Buffer.alloc(size * size * 4);
  const c = size / 2;
  const feather = Math.max(1, size / 180);
  const petalR = size * 0.135;      // petal radius
  const petalD = size * 0.175;      // petal center distance from icon center
  const heartR = size * 0.105;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const t = y / (size - 1);
      let col = [
        PINK_TOP[0] + (PINK_BOTTOM[0] - PINK_TOP[0]) * t,
        PINK_TOP[1] + (PINK_BOTTOM[1] - PINK_TOP[1]) * t,
        PINK_TOP[2] + (PINK_BOTTOM[2] - PINK_TOP[2]) * t,
      ];
      for (let k = 0; k < 6; k++) {
        const a = (Math.PI / 3) * k - Math.PI / 2;
        const cov = circleCov(x, y, c + petalD * Math.cos(a), c + petalD * Math.sin(a), petalR, feather);
        if (cov > 0) col = blend(col, PETAL, cov);
      }
      const ring = circleCov(x, y, c, c, heartR * 1.22, feather);
      if (ring > 0) col = blend(col, HEART_RING, ring);
      const heart = circleCov(x, y, c, c, heartR, feather);
      if (heart > 0) col = blend(col, HEART, heart);
      const i = (y * size + x) * 4;
      rgba[i] = Math.round(col[0]);
      rgba[i + 1] = Math.round(col[1]);
      rgba[i + 2] = Math.round(col[2]);
      rgba[i + 3] = 255;
    }
  }
  return png(size, size, rgba);
}

mkdirSync(OUT_DIR, { recursive: true });
for (const size of [180, 192, 512]) {
  const file = join(OUT_DIR, `icon-${size}.png`);
  writeFileSync(file, renderIcon(size));
  console.log(`wrote ${file}`);
}
