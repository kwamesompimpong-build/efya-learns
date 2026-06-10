/* =========================================================================
   efya-learns — progress.js
   Mastery tracking for Efya's Learning Garden. Every letter A–Z and number
   0–10 is a plant that grows with growth points (gp):
     gp = (intro ? 1 : 0) + min(practice, 2) + min(finds, 2)   → 0..5
     stages: 🌰 seed, 🌱 sprout, 🌿 leaf, 🌷 bud, 🌸 flower, 🌺 bloom (mastered)
   Progress only ever increases — there is no way to lose growth.

   Persists in localStorage; if localStorage is unavailable (it throws), an
   in-memory object is used instead so this file also loads under Node with a
   window shim (see tools/test-progress.mjs). Exposes window.EfyaProgress.
   ========================================================================= */
(function () {
  "use strict";

  var KEY = "efya.progress.v1";
  var STAGES = ["🌰", "🌱", "🌿", "🌷", "🌸", "🌺"];

  // Storage: localStorage when it works, otherwise a plain object.
  var canStore = false;
  try {
    window.localStorage.setItem("efya.progress.probe", "1");
    window.localStorage.removeItem("efya.progress.probe");
    canStore = true;
  } catch (e) { canStore = false; }
  var memory = {};

  function readAll() {
    if (!canStore) return memory;
    try { return JSON.parse(window.localStorage.getItem(KEY)) || {}; }
    catch (e) { return memory; }
  }
  function writeAll(all) {
    memory = all;
    if (canStore) {
      try { window.localStorage.setItem(KEY, JSON.stringify(all)); } catch (e) {}
    }
  }

  // learnOrder (from content.js) drives what comes NEXT and doubles as the
  // full id list for each kind. Read lazily so load order can't bite.
  function orderOf(kind) {
    var efya = window.EFYA;
    return (efya && efya.learnOrder && efya.learnOrder[kind]) || [];
  }

  function keyOf(kind, id) { return kind + ":" + String(id); }
  function recordOf(kind, id) {
    return readAll()[keyOf(kind, id)] || { intro: 0, practice: 0, finds: 0 };
  }
  function snapshot(rec) {
    var gp = (rec.intro ? 1 : 0) + Math.min(rec.practice, 2) + Math.min(rec.finds, 2);
    return {
      intro: rec.intro, practice: rec.practice, finds: rec.finds,
      gp: gp, stage: gp, stageEmoji: STAGES[gp], mastered: gp === 5
    };
  }

  function get(kind, id) { return snapshot(recordOf(kind, id)); }

  function award(kind, id, type) {
    var all = readAll();
    var k = keyOf(kind, id);
    var rec = all[k] || { intro: 0, practice: 0, finds: 0 };
    var before = snapshot(rec);
    // Counts are capped where they stop earning gp, so awards can repeat
    // forever without inflating anything.
    if (type === "intro") rec.intro = 1;
    else if (type === "practice") rec.practice = Math.min(2, rec.practice + 1);
    else if (type === "find") rec.finds = Math.min(2, rec.finds + 1);
    all[k] = rec;
    writeAll(all);
    var after = snapshot(rec);
    return {
      before: before,
      after: after,
      grew: after.gp > before.gp,
      justMastered: !before.mastered && after.mastered
    };
  }

  function summary() {
    var lettersMastered = 0, numbersMastered = 0, totalGp = 0;
    orderOf("letters").forEach(function (id) {
      var s = get("letters", id);
      totalGp += s.gp;
      if (s.mastered) lettersMastered++;
    });
    orderOf("numbers").forEach(function (id) {
      var s = get("numbers", id);
      totalGp += s.gp;
      if (s.mastered) numbersMastered++;
    });
    return {
      lettersMastered: lettersMastered, lettersTotal: 26,
      numbersMastered: numbersMastered, numbersTotal: 11,
      totalGp: totalGp, maxGp: 185 // 37 plants × 5 gp
    };
  }

  function nextUp(kind) {
    var order = orderOf(kind);
    for (var i = 0; i < order.length; i++) {
      if (!get(kind, order[i]).mastered) return order[i];
    }
    return null;
  }

  function pickReview(kind) {
    var mastered = orderOf(kind).filter(function (id) {
      return get(kind, id).mastered;
    });
    if (!mastered.length) return null;
    return mastered[Math.floor(Math.random() * mastered.length)];
  }

  // Clears learning progress only — never touches sleep-star data.
  function reset() {
    memory = {};
    if (canStore) {
      try { window.localStorage.removeItem(KEY); } catch (e) {}
    }
  }

  window.EfyaProgress = {
    get: get,
    award: award,
    summary: summary,
    nextUp: nextUp,
    pickReview: pickReview,
    reset: reset,
    STAGES: STAGES
  };
})();
