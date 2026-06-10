#!/usr/bin/env node
/**
 * generate-heygen-clips.mjs — pre-render Auntie Akosua's guide lines as
 * HeyGen avatar video clips for efya-learns.
 *
 * WHAT IT DOES
 *   Reads the guide-clip manifest from src/data/content.js (EFYA.guide.clips),
 *   sends each line's text to HeyGen's video-generation API (an avatar speaks
 *   the line in front of a soft pink background, 720x720), polls until each
 *   render finishes, and downloads the resulting .mp4 files into
 *   src/assets/guide/ where the app picks them up automatically. If a clip
 *   file already exists it is skipped (use --force to re-render).
 *
 * WHERE IT RUNS
 *   On the PARENT'S computer, once, ahead of time — never from the app.
 *   The app itself stays fully offline (file:// on the iPad) and never talks
 *   to HeyGen; it just plays the local .mp4 files this script produces, and
 *   falls back to the device's text-to-speech voice when a file is missing.
 *
 * COST WARNING
 *   Every render consumes paid HeyGen API credits (roughly $1 per minute of
 *   standard avatar video as of June 2026; Avatar IV renders cost more).
 *   The six guide lines total well under two minutes, so a full run should
 *   cost a couple of dollars — but use --dry-run first to see exactly what
 *   would be sent, and --only to render a single clip as a test.
 *
 * USAGE
 *   export HEYGEN_API_KEY=...        # from app.heygen.com → Settings → API
 *   node tools/generate-heygen-clips.mjs --list-avatars   # pick an avatar_id
 *   node tools/generate-heygen-clips.mjs --list-voices    # pick a voice_id
 *   node tools/generate-heygen-clips.mjs --avatar <id> --voice <id> --dry-run
 *   node tools/generate-heygen-clips.mjs --avatar <id> --voice <id> --only welcome
 *   node tools/generate-heygen-clips.mjs --avatar <id> --voice <id>
 *
 * FLAGS
 *   --avatar <avatar_id>   HeyGen avatar to use (or env HEYGEN_AVATAR_ID)
 *   --voice <voice_id>     HeyGen voice to use  (or env HEYGEN_VOICE_ID)
 *   --only id1,id2         Render only these clip ids from the manifest
 *   --spoken-name <text>   Phonetic spelling spoken in place of the literal
 *                          name "Efya" (default "Eff-ee-ah") so the TTS voice
 *                          pronounces her name correctly
 *   --list-avatars         List available avatars (GET /v2/avatars) and exit
 *   --list-voices          List available voices  (GET /v2/voices) and exit
 *   --dry-run              Print the exact request payloads; make no API calls
 *   --force                Re-render clips whose files already exist
 *   --help                 Show this help
 *
 * API NOTES (verified against public docs, June 2026 — see docs/HEYGEN.md)
 *   POST https://api.heygen.com/v2/video/generate      (X-Api-Key header)
 *   GET  https://api.heygen.com/v1/video_status.get?video_id=...
 *   GET  https://api.heygen.com/v2/avatars
 *   GET  https://api.heygen.com/v2/voices
 *   HeyGen's v1/v2 endpoints are supported through Oct 31, 2026; after that
 *   this script will need a small update to the v3 API (POST /v3/videos).
 *   This script has NOT been run against the live API (no key available when
 *   it was written) — expect to debug small payload drifts.
 *
 * Requires Node >= 18 (built-in fetch). No npm dependencies.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, "..");
const CONTENT_FILE = path.join(ROOT, "src", "data", "content.js");

const API_BASE = "https://api.heygen.com";
const POLL_INTERVAL_MS = 5_000; // check render status every 5s
const POLL_TIMEOUT_MS = 10 * 60 * 1_000; // give up on a render after 10 min

// ---------------------------------------------------------------- CLI args

function parseArgs(argv) {
  const args = {
    only: null,
    avatar: process.env.HEYGEN_AVATAR_ID || null,
    voice: process.env.HEYGEN_VOICE_ID || null,
    spokenName: "Eff-ee-ah",
    listAvatars: false,
    listVoices: false,
    dryRun: false,
    force: false,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = (flag) => {
      const v = argv[++i];
      if (v === undefined) fail(`${flag} needs a value.`);
      return v;
    };
    switch (a) {
      case "--only": args.only = next(a).split(",").map((s) => s.trim()).filter(Boolean); break;
      case "--avatar": args.avatar = next(a); break;
      case "--voice": args.voice = next(a); break;
      case "--spoken-name": args.spokenName = next(a); break;
      case "--list-avatars": args.listAvatars = true; break;
      case "--list-voices": args.listVoices = true; break;
      case "--dry-run": args.dryRun = true; break;
      case "--force": args.force = true; break;
      case "--help": case "-h": args.help = true; break;
      default: fail(`Unknown flag: ${a} (try --help)`);
    }
  }
  return args;
}

function fail(message) {
  console.error(`\n  ✗ ${message}\n`);
  process.exit(1);
}

function printHelp() {
  // The header comment is the real documentation; keep this short.
  console.log(`
  generate-heygen-clips.mjs — render Auntie Akosua's lines as HeyGen clips.

  Setup:   export HEYGEN_API_KEY=...   (app.heygen.com → Settings → API)

  Usage:
    node tools/generate-heygen-clips.mjs --list-avatars
    node tools/generate-heygen-clips.mjs --list-voices
    node tools/generate-heygen-clips.mjs --avatar <avatar_id> --voice <voice_id> [--dry-run]

  Flags: --only id1,id2  --spoken-name <text>  --force  --dry-run  --help
  Cost:  each render uses paid HeyGen credits — try --dry-run / --only first.
  Full docs: docs/HEYGEN.md
`);
}

// ------------------------------------------------------- manifest loading

/**
 * content.js is a browser script that assigns window.EFYA = {...}.
 * Evaluate it with a throwaway "window" object so the manifest in the app
 * and the manifest this script uses can never drift apart.
 */
function loadGuide() {
  let code;
  try {
    code = fs.readFileSync(CONTENT_FILE, "utf8");
  } catch {
    fail(`Could not read ${CONTENT_FILE} — run this from the efya-learns repo.`);
  }
  const win = {};
  try {
    new Function("window", code)(win);
  } catch (err) {
    fail(`src/data/content.js failed to evaluate: ${err.message}`);
  }
  const guide = win.EFYA && win.EFYA.guide;
  if (!guide || !guide.clips || Object.keys(guide.clips).length === 0) {
    fail(
      "No guide-clip manifest found in src/data/content.js.\n" +
      "    Expected EFYA.guide = { clipsPath: \"assets/guide/\", clips: { id: { file, text }, ... } }\n" +
      "    with ids like: welcome, praise1, praise2, praise3, bloom, goodnight.\n" +
      "    (If the Auntie Akosua guide section hasn't been added to content.js yet, add it first.)"
    );
  }
  for (const [id, clip] of Object.entries(guide.clips)) {
    if (!clip || typeof clip.file !== "string" || typeof clip.text !== "string") {
      fail(`Manifest entry "${id}" must have string "file" and "text" fields.`);
    }
  }
  return guide;
}

// --------------------------------------------------------- HeyGen API I/O

function apiKey() {
  const key = process.env.HEYGEN_API_KEY;
  if (!key) {
    fail(
      "HEYGEN_API_KEY is not set.\n" +
      "    Get a key at app.heygen.com → Settings → Subscriptions & API → API token,\n" +
      "    then run:  export HEYGEN_API_KEY=your_key_here\n" +
      "    (Use --dry-run to preview the payloads without a key.)"
    );
  }
  return key;
}

async function api(pathname, options = {}) {
  const res = await fetch(`${API_BASE}${pathname}`, {
    ...options,
    headers: {
      "X-Api-Key": apiKey(),
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const body = await res.text();
  let json;
  try {
    json = JSON.parse(body);
  } catch {
    throw new Error(`HeyGen returned non-JSON (HTTP ${res.status}) for ${pathname}: ${body.slice(0, 300)}`);
  }
  if (!res.ok) {
    const detail = json?.error?.message || json?.message || body.slice(0, 300);
    throw new Error(`HeyGen HTTP ${res.status} for ${pathname}: ${detail}`);
  }
  return json;
}

async function listAvatars() {
  console.log("\n  Fetching avatars (GET /v2/avatars)…\n");
  const json = await api("/v2/avatars");
  const avatars = json?.data?.avatars || [];
  for (const a of avatars) {
    console.log(`  ${a.avatar_id}  —  ${a.avatar_name || "(unnamed)"}${a.gender ? `  [${a.gender}]` : ""}`);
  }
  const photos = json?.data?.talking_photos || [];
  if (photos.length) {
    console.log("\n  Talking photos (photo avatars):\n");
    for (const p of photos) {
      console.log(`  ${p.talking_photo_id}  —  ${p.talking_photo_name || "(unnamed)"}`);
    }
  }
  console.log(`\n  ${avatars.length} avatar(s)${photos.length ? `, ${photos.length} talking photo(s)` : ""}.`);
  console.log("  Tip: pipe through grep, e.g.  … --list-avatars | grep -i female\n");
}

async function listVoices() {
  console.log("\n  Fetching voices (GET /v2/voices)…\n");
  const json = await api("/v2/voices");
  const voices = json?.data?.voices || [];
  for (const v of voices) {
    const name = v.name || v.voice_name || v.display_name || "(unnamed)";
    const bits = [v.language, v.gender].filter(Boolean).join(", ");
    console.log(`  ${v.voice_id}  —  ${name}${bits ? `  [${bits}]` : ""}`);
  }
  console.log(`\n  ${voices.length} voice(s).`);
  console.log("  Tip: pipe through grep, e.g.  … --list-voices | grep -i english | grep -i female\n");
}

// ------------------------------------------------------------- rendering

/** TTS engines mangle "Efya"; speak a phonetic spelling instead. */
function spokenText(text, spokenName) {
  return text.replace(/\bEfya\b/gi, spokenName);
}

function buildPayload(id, clip, args) {
  return {
    title: `Auntie Akosua — ${id} (efya-learns)`,
    caption: false,
    video_inputs: [
      {
        character: {
          type: "avatar",
          avatar_id: args.avatar || "<avatar_id — pass --avatar>",
          avatar_style: "normal",
        },
        voice: {
          type: "text",
          input_text: spokenText(clip.text, args.spokenName),
          voice_id: args.voice || "<voice_id — pass --voice>",
        },
        background: {
          type: "color",
          value: "#fff0f6", // the app's soft pink
        },
      },
    ],
    dimension: { width: 720, height: 720 }, // small square clip
  };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function pollUntilDone(videoId) {
  const deadline = Date.now() + POLL_TIMEOUT_MS;
  for (;;) {
    const json = await api(`/v1/video_status.get?video_id=${encodeURIComponent(videoId)}`);
    const data = json?.data || {};
    const status = data.status;
    if (status === "completed") {
      if (!data.video_url) throw new Error("Render completed but no video_url in response.");
      return data.video_url;
    }
    if (status === "failed") {
      const why = data.error?.message || data.error?.detail || data.failure_message || JSON.stringify(data.error || "unknown");
      throw new Error(`HeyGen reported the render failed: ${why}`);
    }
    if (Date.now() > deadline) {
      throw new Error(`Timed out after ${POLL_TIMEOUT_MS / 60000} min (last status: ${status}). Check app.heygen.com for the video.`);
    }
    process.stdout.write(`\r      status: ${status || "…"}        `);
    await sleep(POLL_INTERVAL_MS);
  }
}

async function download(url, outPath) {
  // video_url is a time-limited signed URL — no API key needed, but it
  // expires, so we download immediately.
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outPath, buf);
  return buf.length;
}

async function renderClip(id, clip, outDir, args) {
  const outPath = path.join(outDir, clip.file);
  console.log(`\n  ▶ ${id}  →  ${path.relative(ROOT, outPath)}`);
  console.log(`      "${spokenText(clip.text, args.spokenName)}"`);

  if (fs.existsSync(outPath) && !args.force) {
    console.log("      already exists — skipping (use --force to re-render).");
    return "skipped";
  }

  const payload = buildPayload(id, clip, args);
  if (args.dryRun) {
    console.log("      dry run — would POST /v2/video/generate with:");
    console.log(JSON.stringify(payload, null, 2).replace(/^/gm, "      "));
    return "dry-run";
  }

  const json = await api("/v2/video/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const videoId = json?.data?.video_id;
  if (!videoId) throw new Error(`No video_id in generate response: ${JSON.stringify(json).slice(0, 300)}`);
  console.log(`      submitted, video_id: ${videoId} — rendering (this can take a few minutes)…`);

  const videoUrl = await pollUntilDone(videoId);
  process.stdout.write("\r");
  const bytes = await download(videoUrl, outPath);
  console.log(`      ✓ saved ${(bytes / 1024 / 1024).toFixed(1)} MB`);
  return "rendered";
}

// ------------------------------------------------------------------ main

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }
  if (args.listAvatars || args.listVoices) {
    if (args.listAvatars) await listAvatars();
    if (args.listVoices) await listVoices();
    return;
  }

  const guide = loadGuide();
  const clipsPath = typeof guide.clipsPath === "string" ? guide.clipsPath : "assets/guide/";
  const outDir = path.join(ROOT, "src", clipsPath);

  let ids = Object.keys(guide.clips);
  if (args.only) {
    const unknown = args.only.filter((id) => !guide.clips[id]);
    if (unknown.length) {
      fail(`Unknown clip id(s): ${unknown.join(", ")}. Manifest has: ${ids.join(", ")}`);
    }
    ids = args.only;
  }

  if (!args.dryRun) {
    apiKey(); // exit early, with help, if the key is missing
    if (!args.avatar || !args.voice) {
      fail(
        "Pass --avatar <avatar_id> and --voice <voice_id> (or set HEYGEN_AVATAR_ID / HEYGEN_VOICE_ID).\n" +
        "    Use --list-avatars and --list-voices to browse, or pick in app.heygen.com."
      );
    }
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log(`\n  Auntie Akosua clip generator — ${ids.length} clip(s): ${ids.join(", ")}`);
  console.log(`  Output folder: ${path.relative(ROOT, outDir)}/`);
  if (!args.dryRun) {
    console.log("  Note: each render consumes paid HeyGen API credits (~$1/min of video).");
  }

  const results = { rendered: 0, skipped: 0, "dry-run": 0, failed: 0 };
  for (const id of ids) {
    try {
      const outcome = await renderClip(id, guide.clips[id], outDir, args);
      results[outcome]++;
    } catch (err) {
      results.failed++;
      console.error(`\n      ✗ ${id} failed: ${err.message}`);
    }
  }

  console.log(
    `\n  Done. rendered: ${results.rendered}, skipped: ${results.skipped}, ` +
    `dry-run: ${results["dry-run"]}, failed: ${results.failed}\n`
  );
  if (results.failed > 0) process.exit(1);
  if (results.rendered > 0) {
    console.log("  Copy/sync the repo to the iPad and the app will use the new clips automatically.\n");
  }
}

main().catch((err) => {
  console.error(`\n  ✗ Unexpected error: ${err.stack || err.message}\n`);
  process.exit(1);
});
