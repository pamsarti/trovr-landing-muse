#!/usr/bin/env node
// Optimizes new/changed images in public/images/ during build.
// Idempotent: uses scripts/.image-manifest.json to skip files whose
// content hash hasn't changed. Never re-compresses an already-tracked
// image, so repeated builds don't degrade quality.

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, resolve, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const imagesDir = resolve(root, "public/images");
const manifestPath = resolve(__dirname, ".image-manifest.json");

const MAX_WIDTH = 1920;
const JPG_QUALITY = 78;
const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (EXTS.has(extname(entry).toLowerCase())) out.push(full);
  }
  return out;
}

function hashFile(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

function loadManifest() {
  if (!existsSync(manifestPath)) return {};
  try {
    return JSON.parse(readFileSync(manifestPath, "utf8"));
  } catch {
    return {};
  }
}

async function optimizeOne(file) {
  const buf = readFileSync(file);
  const ext = extname(file).toLowerCase();
  const originalSize = buf.length;

  let pipeline = sharp(buf, { failOn: "none" }).rotate();
  const meta = await pipeline.metadata();
  if (meta.width && meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  // Preserve extension. Never rename PNG → JPG.
  if (ext === ".png") {
    pipeline = pipeline.png({ compressionLevel: 9, palette: true });
  } else if (ext === ".webp") {
    pipeline = pipeline.webp({ quality: JPG_QUALITY });
  } else {
    pipeline = pipeline.jpeg({ quality: JPG_QUALITY, progressive: true, mozjpeg: true });
  }

  const out = await pipeline.toBuffer();
  if (out.length < originalSize) {
    writeFileSync(file, out);
    return { originalSize, newSize: out.length, replaced: true };
  }
  return { originalSize, newSize: originalSize, replaced: false };
}

async function main() {
  const manifest = loadManifest();
  const files = walk(imagesDir);
  let optimized = 0;
  let skipped = 0;
  let savedBytes = 0;
  const errors = [];

  for (const file of files) {
    const rel = file.slice(root.length + 1).replace(/\\/g, "/");
    const buf = readFileSync(file);
    const hash = hashFile(buf);

    if (manifest[rel] && manifest[rel].hash === hash) {
      skipped++;
      continue;
    }

    try {
      const { originalSize, newSize, replaced } = await optimizeOne(file);
      const finalBuf = readFileSync(file);
      manifest[rel] = { hash: hashFile(finalBuf), size: finalBuf.length };
      if (replaced) {
        optimized++;
        savedBytes += originalSize - newSize;
      } else {
        skipped++;
      }
    } catch (err) {
      errors.push({ file: rel, message: err?.message ?? String(err) });
    }
  }

  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");

  console.log(`[optimize-images] optimized: ${optimized}`);
  console.log(`[optimize-images] skipped  : ${skipped}`);
  console.log(`[optimize-images] saved    : ${(savedBytes / 1024).toFixed(1)} KB`);
  if (errors.length) {
    console.log(`[optimize-images] errors  : ${errors.length}`);
    for (const e of errors) console.log(`  - ${e.file}: ${e.message}`);
  }
}

main().catch((err) => {
  console.error("[optimize-images] fatal:", err);
  // Do not fail the build for image optimization issues.
  process.exit(0);
});