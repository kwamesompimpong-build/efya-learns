#!/usr/bin/env node
/*
 * test-progress.mjs — unit tests for src/progress.js, run with plain Node:
 *   node tools/test-progress.mjs
 *
 * content.js and progress.js are browser IIFEs (not modules), so they're
 * loaded with new Function("window", code) against a shared window shim.
 * The shim has no localStorage, which also exercises the in-memory fallback.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const srcDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src");
const load = (file, win) =>
  new Function("window", fs.readFileSync(path.join(srcDir, file), "utf8"))(win);

let passed = 0;
let failed = 0;
const check = (name, cond) => {
  if (cond) { passed++; console.log("ok    " + name); }
  else { failed++; console.error("FAIL  " + name); }
};

const win = {};
load(path.join("data", "content.js"), win);
load("progress.js", win);
const P = win.EfyaProgress;

check("module loads with a bare window shim (no localStorage)", !!P);
check("STAGES is the six growth emojis",
  Array.isArray(P.STAGES) && P.STAGES.length === 6 &&
  P.STAGES[0] === "\u{1F330}" && P.STAGES[5] === "\u{1F33A}");

// ---- Fresh state ----
const fresh = P.get("letters", "A");
check("fresh item is an unmastered seed",
  fresh.gp === 0 && fresh.stage === 0 && fresh.stageEmoji === "\u{1F330}" &&
  fresh.mastered === false);
check("fresh item has zero counts",
  fresh.intro === 0 && fresh.practice === 0 && fresh.finds === 0);
check('nextUp("letters") starts at E', P.nextUp("letters") === "E");
check('nextUp("numbers") starts at 1', P.nextUp("numbers") === 1);
check("pickReview is null with nothing mastered",
  P.pickReview("letters") === null && P.pickReview("numbers") === null);

// ---- Mastering E: intro + 2 practice + 2 finds → gp 5 ----
let r = P.award("letters", "E", "intro");
check("intro grows seed → sprout",
  r.grew === true && r.before.gp === 0 && r.after.gp === 1 &&
  r.after.stageEmoji === "\u{1F331}");
check("intro alone does not master", r.justMastered === false);
r = P.award("letters", "E", "practice");
check("practice #1 grows (gp 2)", r.grew === true && r.after.gp === 2 && !r.justMastered);
r = P.award("letters", "E", "practice");
check("practice #2 grows (gp 3)", r.grew === true && r.after.gp === 3 && !r.justMastered);
r = P.award("letters", "E", "find");
check("find #1 grows (gp 4)", r.grew === true && r.after.gp === 4 && !r.justMastered);
r = P.award("letters", "E", "find");
check("find #2 masters E (gp 5, bloom, justMastered exactly here)",
  r.grew === true && r.after.gp === 5 && r.after.mastered === true &&
  r.after.stageEmoji === "\u{1F33A}" && r.justMastered === true);
check("get() reflects the persisted mastery", P.get("letters", "E").mastered === true);

// ---- Caps: extra awards never exceed gp 5 or re-fire justMastered ----
r = P.award("letters", "E", "practice");
check("extra practice does not grow", r.grew === false && r.justMastered === false && r.after.gp === 5);
r = P.award("letters", "E", "find");
check("extra find does not grow", r.grew === false && r.justMastered === false && r.after.gp === 5);
r = P.award("letters", "E", "intro");
check("repeat intro does not grow", r.grew === false && r.justMastered === false);
const e = P.get("letters", "E");
check("stored counts are capped (practice 2, finds 2)",
  e.intro === 1 && e.practice === 2 && e.finds === 2 && e.gp === 5);
check("progress never decreases (still bloomed after extras)",
  e.stageEmoji === "\u{1F33A}" && e.mastered === true);

// ---- nextUp / pickReview after mastery ----
check('nextUp("letters") advances E → F', P.nextUp("letters") === "F");
check('pickReview("letters") returns the mastered E', P.pickReview("letters") === "E");
check('pickReview("numbers") still null', P.pickReview("numbers") === null);

// ---- Numbers + id normalization ----
r = P.award("numbers", 3, "find");
check("number award grows", r.grew === true && r.after.gp === 1);
check("numeric and string ids read the same record",
  P.get("numbers", 3).finds === 1 && P.get("numbers", "3").finds === 1);

// ---- summary ----
let s = P.summary();
check("summary mastered counts", s.lettersMastered === 1 && s.numbersMastered === 0);
check("summary totals", s.lettersTotal === 26 && s.numbersTotal === 11 && s.maxGp === 185);
check("summary totalGp (E=5 + number-3 find=1)", s.totalGp === 6);

// ---- reset ----
P.reset();
s = P.summary();
check("reset clears all progress",
  s.totalGp === 0 && s.lettersMastered === 0 && s.numbersMastered === 0);
check("reset restores nextUp to the start of learnOrder",
  P.nextUp("letters") === "E" && P.nextUp("numbers") === 1);
check("reset clears individual records", P.get("letters", "E").gp === 0);

// ---- Exhausting a kind: nextUp returns null ----
for (const id of win.EFYA.learnOrder.letters) {
  P.award("letters", id, "intro");
  P.award("letters", id, "practice");
  P.award("letters", id, "practice");
  P.award("letters", id, "find");
  P.award("letters", id, "find");
}
check("all letters mastered", P.summary().lettersMastered === 26);
check('nextUp("letters") is null when all mastered', P.nextUp("letters") === null);
check("pickReview returns some mastered letter",
  win.EFYA.learnOrder.letters.includes(P.pickReview("letters")));

console.log("");
console.log(passed + " passed, " + failed + " failed");
if (failed > 0) process.exit(1);
