/* =========================================================================
   efya-learns — guide.js
   "Auntie Akosua" 🌺 — the app's one warm voice. All speech lives here:

   - say()/stop(): Web Speech API with a woman's voice. "Efya" is respelled
     "Eff-ee-ah" for the engine (TTS mispronounces the name from spelling) —
     the screen always shows "Efya".
   - sayClip(): optional pre-rendered video clips (e.g. HeyGen renders of
     Auntie Akosua) listed in EFYA.guide.clips, played in a small circular
     bubble. Each clip is probed once and cached; a missing file is the
     NORMAL case and silently falls back to say() — no errors, no network.
   - praiseThen(): the affirm-then-advance pattern used after every success.

   Exposes window.EfyaGuide. No framework, no build step.
   ========================================================================= */
(function () {
  "use strict";

  // Mirrors the on-screen sound toggle; app.js calls setSoundOn() on change.
  var soundOn = true;
  try { soundOn = window.localStorage.getItem("efya.sound") !== "off"; } catch (e) {}

  // Pick a woman's English voice. The voice list loads asynchronously, so we
  // (re)resolve it whenever the browser reports it changed. We prefer voices
  // that name themselves female, then known female voice names, then any
  // English voice as a fallback.
  var chosenVoice = null;
  function pickVoice() {
    if (!("speechSynthesis" in window)) return;
    var voices = window.speechSynthesis.getVoices() || [];
    if (!voices.length) return;
    var english = voices.filter(function (v) { return /^en(-|_|$)/i.test(v.lang); });
    var pool = english.length ? english : voices;

    // Names commonly used for female system voices across browsers/OSes.
    var femaleNames = /(female|woman|samantha|victoria|karen|moira|tessa|fiona|serena|allison|ava|susan|zira|hazel|catherine|google us english|google uk english female|aria|jenny|michelle|nicky|joanna|kendra|salli|kimberly|amy|emma)/i;

    chosenVoice =
      pool.find(function (v) { return femaleNames.test(v.name); }) ||
      pool.find(function (v) { return /female/i.test(v.voiceURI || ""); }) ||
      pool[0] ||
      null;
  }
  if ("speechSynthesis" in window) {
    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
  }

  // Text-to-speech guesses pronunciation from spelling and gets "Efya" wrong.
  // Tweak SPOKEN_NAME if a particular device's voice still says it oddly.
  var SPOKEN_NAME = "Eff-ee-ah";
  function forSpeech(text) {
    return String(text).replace(/\bEfya\b/gi, SPOKEN_NAME);
  }

  function say(text, opts) {
    if (!soundOn || !("speechSynthesis" in window)) return;
    opts = opts || {};
    try {
      // Cancel anything still speaking/queued so utterances never overlap or
      // echo (rapid taps would otherwise stack on top of each other).
      window.speechSynthesis.cancel();
      if (!chosenVoice) pickVoice(); // voices may have arrived late
      var u = new SpeechSynthesisUtterance(forSpeech(text));
      if (chosenVoice) u.voice = chosenVoice;
      u.rate = opts.rate || 0.85;   // calm, clear pace for a pre-reader
      u.pitch = opts.pitch || 1.2;  // warm, friendly, a touch higher
      u.lang = (chosenVoice && chosenVoice.lang) || "en-US";
      window.speechSynthesis.speak(u);
    } catch (e) { /* ignore */ }
  }

  function stop() {
    try { window.speechSynthesis.cancel(); } catch (e) {}
    removeBubble();
  }

  // Warm, varied praise — including the Akan "Ayekoo!" ("well done") — spoken
  // when Efya genuinely completes something.
  var PRAISE = [
    "Ayekoo! Well done!",
    "Hurray! You did it!",
    "Wonderful, Efya!",
    "You are so clever!",
    "Brilliant! Well done, Efya!",
    "Yoo! Beautiful work!",
    "Look at you go!",
    "I am so proud of you!"
  ];
  function pickPraise() { return PRAISE[Math.floor(Math.random() * PRAISE.length)]; }

  // ---------------------------------------------------------------------
  // Optional video clips of Auntie Akosua.
  // ---------------------------------------------------------------------
  var clipStatus = {}; // id → "ok" | "bad"; each clip is probed exactly once
  var activeBubble = null;

  function guideData() { return (window.EFYA && window.EFYA.guide) || {}; }

  function removeBubble() {
    if (!activeBubble) return;
    try {
      var v = activeBubble.querySelector("video");
      if (v) v.pause();
    } catch (e) {}
    activeBubble.remove();
    activeBubble = null;
  }

  // Try to play clip `id`; exactly one of onEnded/onFail fires (guarded by
  // `settled`, so the 1500ms probe timeout and a late success can't both run).
  function playClip(id, onEnded, onFail) {
    var g = guideData();
    var clip = g.clips && g.clips[id];
    if (!clip || clipStatus[id] === "bad") { onFail(); return; }

    var settled = false;
    var probeTimer = null;
    function fail(markBad) {
      if (settled) return;
      settled = true;
      if (probeTimer) clearTimeout(probeTimer);
      if (markBad) clipStatus[id] = "bad";
      removeBubble();
      onFail();
    }

    var video;
    try { video = document.createElement("video"); }
    catch (e) { fail(true); return; }
    video.setAttribute("playsinline", "");
    video.preload = "auto";

    video.addEventListener("error", function () { fail(true); });
    video.addEventListener("canplaythrough", function ready() {
      video.removeEventListener("canplaythrough", ready);
      if (settled) return;
      if (probeTimer) clearTimeout(probeTimer);
      clipStatus[id] = "ok";
      removeBubble();
      var bubble = document.createElement("div");
      bubble.className = "guide-bubble";
      bubble.appendChild(video);
      document.body.appendChild(bubble);
      activeBubble = bubble;
      video.addEventListener("ended", function () {
        if (settled) return;
        settled = true;
        removeBubble();
        if (onEnded) onEnded();
      });
      var p = video.play();
      // Autoplay can be blocked before the first gesture; that is not a
      // missing file, so fall back to TTS without caching "bad".
      if (p && p.catch) p.catch(function () { fail(false); });
    });

    // Probe timeout only on the first encounter; once known-ok we trust it.
    if (clipStatus[id] !== "ok") {
      probeTimer = setTimeout(function () { fail(true); }, 1500);
    }
    video.src = (g.clipsPath || "") + clip.file;
    try { video.load(); } catch (e) { fail(true); }
  }

  // Play a clip if available, else speak its manifest text. opts.onended (if
  // given) fires after the clip ends, or ~2.6s into the spoken fallback.
  function sayClip(id, opts) {
    opts = opts || {};
    var g = guideData();
    var clip = g.clips && g.clips[id];
    if (!clip) { if (opts.onended) opts.onended(); return; }
    if (!soundOn) {
      if (opts.onended) setTimeout(opts.onended, 300);
      return;
    }
    playClip(id,
      function () { if (opts.onended) opts.onended(); },
      function () {
        say(clip.text, opts);
        if (opts.onended) setTimeout(opts.onended, 2600);
      });
  }

  // The affirm-then-advance pattern: a random praise clip if one exists
  // (message spoken after it, done ~2.6s later), else spoken praise + message
  // with done after ~3.4s — long enough to be heard before the screen moves.
  function praiseThen(message, done) {
    done = done || function () {};
    if (!soundOn) { setTimeout(done, 3400); return; }
    var ids = ["praise1", "praise2", "praise3"];
    var id = ids[Math.floor(Math.random() * ids.length)];
    playClip(id,
      function () {
        say(message);
        setTimeout(done, 2600);
      },
      function () {
        say(pickPraise() + " " + message);
        setTimeout(done, 3400);
      });
  }

  function setSoundOn(on) {
    soundOn = !!on;
    if (!soundOn) stop();
  }

  window.EfyaGuide = {
    say: say,
    stop: stop,
    sayClip: sayClip,
    praiseThen: praiseThen,
    setSoundOn: setSoundOn,
    forSpeech: forSpeech
  };
})();
