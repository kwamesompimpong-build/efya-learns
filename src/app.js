/* =========================================================================
   efya-learns — app.js
   A child-led, Montessori-inspired letters & numbers game for Efya (age 3),
   rooted in Ghanaian heritage and built around her personality. Plus Dreamland,
   a gentle bedtime feature to encourage sleeping in her own bed all night.

   No framework, no build step: open index.html on a tablet and it runs.
   Speech uses the Web Speech API; chimes/lullaby use the Web Audio API; all
   visuals are emoji/CSS so no image assets are required.
   ========================================================================= */
(function () {
  "use strict";

  var EFYA = window.EFYA;
  var app = document.getElementById("app");
  var soundBtn = document.getElementById("soundToggle");

  // ---- Settings (sound) persisted on-device, no accounts, no network. ----
  var soundOn = localStorage.getItem("efya.sound") !== "off";
  function renderSoundBtn() { soundBtn.textContent = soundOn ? "🔊" : "🔈"; }
  soundBtn.addEventListener("click", function () {
    soundOn = !soundOn;
    localStorage.setItem("efya.sound", soundOn ? "on" : "off");
    if (!soundOn) { stopSpeak(); stopLullaby(); }
    renderSoundBtn();
  });
  renderSoundBtn();

  // ---------------------------------------------------------------------
  // Audio: spoken words (Speech Synthesis) + gentle tones (Web Audio).
  // Both are pre-reader-friendly and fail silently if unsupported.
  // ---------------------------------------------------------------------

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
  // We keep the name spelled "Efya" on screen but feed the speech engine a
  // phonetic respelling so it says "Ef-ee-ah". Tweak SPOKEN_NAME if a
  // particular device's voice still says it oddly.
  var SPOKEN_NAME = "Eff-ee-ah";
  function forSpeech(text) {
    return String(text).replace(/\bEfya\b/gi, SPOKEN_NAME);
  }

  function speak(text, opts) {
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
  function stopSpeak() { try { window.speechSynthesis.cancel(); } catch (e) {} }

  var actx = null;
  function audioCtx() {
    if (!soundOn) return null;
    try {
      if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === "suspended") actx.resume();
      return actx;
    } catch (e) { return null; }
  }
  // A soft, positive chime (no harsh "wrong" buzzers — Montessori-friendly).
  function chime(base) {
    var ctx = audioCtx(); if (!ctx) return;
    var notes = [base || 660, (base || 660) * 1.25, (base || 660) * 1.5];
    notes.forEach(function (f, i) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine"; o.frequency.value = f;
      var t = ctx.currentTime + i * 0.12;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.22, t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      o.connect(g); g.connect(ctx.destination);
      o.start(t); o.stop(t + 0.55);
    });
  }
  // A short, bright highlife-ish drum tap for movement activities.
  function drumTap() {
    var ctx = audioCtx(); if (!ctx) return;
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = "triangle"; o.frequency.setValueAtTime(180, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.18);
    g.gain.setValueAtTime(0.3, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    o.connect(g); g.connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + 0.22);
  }

  // A slow, looping lullaby for Dreamland. Returns a stop handle.
  var lullabyTimer = null;
  function startLullaby() {
    var ctx = audioCtx(); if (!ctx) return;
    stopLullaby();
    // A gentle pentatonic phrase, repeated softly.
    var melody = [392, 440, 523, 440, 392, 330];
    var i = 0;
    function playNote() {
      var c = audioCtx(); if (!c || !lullabyTimer) return;
      var o = c.createOscillator(), g = c.createGain();
      o.type = "sine"; o.frequency.value = melody[i % melody.length];
      g.gain.setValueAtTime(0, c.currentTime);
      g.gain.linearRampToValueAtTime(0.12, c.currentTime + 0.3);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 1.6);
      o.connect(g); g.connect(c.destination);
      o.start(); o.stop(c.currentTime + 1.7);
      i++;
    }
    lullabyTimer = setInterval(playNote, 1700);
    playNote();
  }
  function stopLullaby() {
    if (lullabyTimer) { clearInterval(lullabyTimer); lullabyTimer = null; }
  }

  // ---------------------------------------------------------------------
  // Small DOM helpers.
  // ---------------------------------------------------------------------
  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }
  function clear() { app.innerHTML = ""; }

  function backButton(to) {
    var b = el("button", "back", "🏠");
    b.setAttribute("aria-label", "Back home");
    b.addEventListener("click", function () { stopSpeak(); (to || home)(); });
    return b;
  }

  // A gentle celebration: emoji pop + falling confetti + chime. No "winning"
  // or "losing" — this only ever rewards the child's own action.
  function celebrate(symbol) {
    chime(660);
    var c = el("div", "celebrate", symbol || "🌟");
    app.appendChild(c);
    var pieces = ["🌸", "⭐", "💖", "🌟", "🎉", "🪘"];
    for (var i = 0; i < 16; i++) {
      var p = el("div", "confetti", pieces[i % pieces.length]);
      p.style.left = Math.random() * 100 + "vw";
      p.style.animationDuration = (1.2 + Math.random() * 1.3) + "s";
      p.style.animationDelay = (Math.random() * 0.3) + "s";
      app.appendChild(p);
      (function (node) { setTimeout(function () { node.remove(); }, 2600); })(p);
    }
    setTimeout(function () { c.remove(); }, 1200);
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

  // Called when Efya gets something right: celebrate, speak an affirmation plus
  // a specific line, then advance to the next thing so the game keeps flowing.
  // The advance waits long enough for the praise to be heard.
  function succeed(message, advanceFn, symbol) {
    celebrate(symbol || "🌟");
    speak(pickPraise() + " " + message);
    setTimeout(function () { if (advanceFn) advanceFn(); }, 3400);
  }

  function dayMode() { document.body.classList.remove("night"); }
  function nightMode() { document.body.classList.add("night"); }

  // ---------------------------------------------------------------------
  // HOME — "Efya's Choice": open navigation, she picks where to go.
  // ---------------------------------------------------------------------
  function home() {
    stopLullaby(); dayMode(); clear();
    app.appendChild(el("h1", "title", "Efya Learns 🌸"));
    var sub = el("p", "subtitle", EFYA.greeting.twi + "  (" + EFYA.greeting.english + ")");
    app.appendChild(sub);
    app.appendChild(el("div", "kente"));

    var menu = el("div", "menu");
    var tiles = [
      { ic: "🔤", lb: "Letters", cls: "pinky", go: letters },
      { ic: "🔢", lb: "Count", cls: "", go: numbers },
      { ic: "💃🏾", lb: "Dance & Jump", cls: "", go: dance },
      { ic: "🌿", lb: "Quiet Corner", cls: "", go: quiet },
      { ic: "🌙", lb: "Dreamland", cls: "night-tile", go: dreamland }
    ];
    tiles.forEach(function (t) {
      var b = el("button", "tile " + t.cls);
      b.appendChild(el("span", "ic", t.ic));
      b.appendChild(el("span", "lb", t.lb));
      b.addEventListener("click", function () { chime(); t.go(); });
      menu.appendChild(b);
    });
    app.appendChild(menu);
    speak("Akwaaba, Efya! What would you like to do?");
  }

  // ---------------------------------------------------------------------
  // LETTERS — Trace & Feel + recognition, with Ghanaian example words.
  // ---------------------------------------------------------------------
  function letters(startIndex) {
    stopLullaby(); dayMode(); clear();
    var idx = startIndex || 0;
    var data = EFYA.letters;

    app.appendChild(backButton());
    var scroll = el("div", "scroll");
    var bigWrap = el("div", "screen-col");
    scroll.appendChild(bigWrap);
    app.appendChild(scroll);

    function show() {
      var L = data[idx];
      bigWrap.innerHTML = "";
      scroll.scrollTop = 0;

      bigWrap.appendChild(el("div", "bigchar", L.letter));
      var emoji = el("div", "emoji-xl", L.emoji);
      bigWrap.appendChild(emoji);
      bigWrap.appendChild(el("div", "word", L.word));
      bigWrap.appendChild(el("div", "meaning", L.meaning));

      var controls = el("div", "row");
      var prev = el("button", "btn round ghost", "◀");
      var sayBtn = el("button", "btn", "🔊 Say it");
      var traceBtn = el("button", "btn ghost", "✏️ Trace");
      var next = el("button", "btn round ghost", "▶");
      prev.addEventListener("click", function () { idx = (idx - 1 + data.length) % data.length; chime(); show(); });
      next.addEventListener("click", function () { idx = (idx + 1) % data.length; chime(); show(); });
      sayBtn.addEventListener("click", function () { sayLetter(L); });
      traceBtn.addEventListener("click", function () { traceLetter(L, idx); });
      controls.appendChild(prev);
      controls.appendChild(sayBtn);
      controls.appendChild(traceBtn);
      controls.appendChild(next);
      bigWrap.appendChild(controls);

      // Headstrong "her way" quick-pick: jump to any letter she chooses.
      var grid = el("div", "pickgrid");
      data.forEach(function (d, i) {
        var p = el("button", "pick", d.letter);
        p.addEventListener("click", function () { idx = i; chime(); show(); });
        grid.appendChild(p);
      });
      bigWrap.appendChild(grid);

      // Tapping the big emoji also says the word.
      emoji.style.cursor = "pointer";
      emoji.addEventListener("click", function () { sayLetter(L); });

      sayLetter(L);
    }

    function sayLetter(L) {
      // Say the letter name once, then its sound, then the Ghanaian word —
      // e.g. "B. Buh. Is for Banku." Repeating the letter made it sound like
      // each one was spoken twice, so the name appears only once.
      speak(L.letter + ". " + L.sound + ". Is for " + L.word + ".");
    }

    show();
  }

  // Finger-tracing a letter, Montessori sandpaper-letter style. The letter is a
  // faint ghost behind a canvas; Efya draws over it. There's no fail state —
  // "I traced it!" always celebrates, building independence and confidence.
  // Build the dotted SVG guide for one glyph. Rendered in a soft, rounded
  // handwriting font (not a heavy block face) with a dashed outline that
  // follows the letter's shape — like a preschool tracing worksheet. Lowercase
  // is drawn a little larger so its body fills the box like the capital does.
  function traceSvg(glyph, isLower) {
    var size = isLower ? 78 : 66;
    return '<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
      '<text x="50" y="50" text-anchor="middle" dominant-baseline="central" ' +
      'style="font-size:' + size + 'px">' + glyph + '</text></svg>';
  }

  function traceLetter(L, returnIdx) {
    dayMode();
    // Trace the big letter, then its little partner (e.g. A then a), so Efya
    // connects the two. Each is a separate step on the same canvas.
    var upper = L.letter, lower = L.letter.toLowerCase();
    var forms = [
      { glyph: upper, lower: false, label: "big " + upper, spoken: "the big letter " + upper },
      { glyph: lower, lower: true, label: "little " + lower, spoken: "the little letter " + lower }
    ];
    var step = 0;
    var stopMouseUp = null; // cleanup for the window mouseup listener between steps

    function render() {
      if (stopMouseUp) stopMouseUp();
      clear();
      var f = forms[step];
      app.appendChild(backButton(function () { if (stopMouseUp) stopMouseUp(); letters(returnIdx); }));
      app.appendChild(el("div", "word", "Trace the " + f.label));

      // Partner chips: A a, with the current one highlighted.
      var pair = el("div", "trace-pair");
      forms.forEach(function (g, i) {
        var chip = el("span", "trace-chip" + (i === step ? " on" : ""), g.glyph);
        pair.appendChild(chip);
      });
      app.appendChild(pair);

      var wrap = el("div", "trace-wrap");
      var ghost = el("div", "trace-ghost");
      ghost.innerHTML = traceSvg(f.glyph, f.lower);
      var canvas = document.createElement("canvas");
      canvas.id = "traceCanvas";
      wrap.appendChild(ghost);
      wrap.appendChild(canvas);
      app.appendChild(wrap);

      var last = step === forms.length - 1;
      var controls = el("div", "row");
      var clearBtn = el("button", "btn ghost", "↺ Again");
      var doneBtn = el("button", "btn", last ? "✨ I traced it!" : "Next ▶");
      controls.appendChild(clearBtn);
      controls.appendChild(doneBtn);
      app.appendChild(controls);

      // Size the canvas to its CSS box for crisp drawing.
      var rect = wrap.getBoundingClientRect();
      canvas.width = rect.width; canvas.height = rect.height;
      var ctx = canvas.getContext("2d");
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.lineWidth = Math.max(14, rect.width * 0.06);
      ctx.strokeStyle = "#ff5fa2";

      var drawing = false;
      function pos(e) {
        var r = canvas.getBoundingClientRect();
        var pt = e.touches ? e.touches[0] : e;
        return { x: pt.clientX - r.left, y: pt.clientY - r.top };
      }
      function startStroke(e) { drawing = true; var p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); e.preventDefault(); }
      function moveStroke(e) { if (!drawing) return; var p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); e.preventDefault(); }
      function endStroke() { drawing = false; }
      canvas.addEventListener("mousedown", startStroke);
      canvas.addEventListener("mousemove", moveStroke);
      window.addEventListener("mouseup", endStroke);
      stopMouseUp = function () { window.removeEventListener("mouseup", endStroke); stopMouseUp = null; };
      canvas.addEventListener("touchstart", startStroke, { passive: false });
      canvas.addEventListener("touchmove", moveStroke, { passive: false });
      canvas.addEventListener("touchend", endStroke);

      clearBtn.addEventListener("click", function () { ctx.clearRect(0, 0, canvas.width, canvas.height); });
      doneBtn.addEventListener("click", function () {
        if (!last) {
          chime();
          step++;
          render();
          return;
        }
        // Both forms traced — affirm, then advance to the next letter.
        if (stopMouseUp) stopMouseUp();
        var nextIdx = (returnIdx + 1) % EFYA.letters.length;
        succeed("You traced the big " + upper + " and the little " + lower +
          "! " + upper + " is for " + L.word + ".",
          function () { letters(nextIdx); }, "🌟");
      });

      speak("Trace " + f.spoken + " with your finger.");
    }

    render();
  }

  // ---------------------------------------------------------------------
  // COUNT WITH ME — concrete before abstract. Count Ghanaian objects by
  // tapping them, then meet the numeral and its Twi name.
  // ---------------------------------------------------------------------
  function numbers(startIndex) {
    stopLullaby(); dayMode(); clear();
    var idx = startIndex || 0;
    var data = EFYA.numbers;

    function nameOf(n) {
      for (var k = 0; k < data.length; k++) if (data[k].number === n) return data[k].name;
      return String(n);
    }
    // The correct numeral plus two nearby distractors (0–10), shuffled, so
    // tapping a number is a real choice she can get right.
    function buildChoices(correct) {
      var set = [correct];
      var guard = 0;
      while (set.length < 3 && guard++ < 50) {
        var c = correct + (Math.floor(Math.random() * 5) - 2);
        if (c < 0 || c > 10 || set.indexOf(c) !== -1) continue;
        set.push(c);
      }
      var fill = 0;
      while (set.length < 3) { if (set.indexOf(fill) === -1) set.push(fill); fill++; }
      for (var i = set.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = set[i]; set[i] = set[j]; set[j] = t;
      }
      return set;
    }

    app.appendChild(backButton());
    var scroll = el("div", "scroll");
    var wrap = el("div", "screen-col");
    scroll.appendChild(wrap);
    app.appendChild(scroll);

    function show() {
      var N = data[idx];
      wrap.innerHTML = "";
      scroll.scrollTop = 0;
      var counted = 0;

      var badge = el("div", "count-badge", "");
      wrap.appendChild(badge);

      var prompt = el("div", "word",
        N.number === 0 ? "Zero! An empty " + N.object + "." : "Tap to count the " + N.object);
      wrap.appendChild(prompt);

      // Step 1 — count the real objects (concrete before abstract).
      var objects = el("div", "objects");
      for (var i = 0; i < N.number; i++) {
        var o = el("div", "obj", N.emoji);
        (function (node) {
          node.addEventListener("click", function () {
            if (node.classList.contains("counted")) return;
            node.classList.add("counted");
            counted++;
            badge.textContent = counted;
            drumTap();
            speak(String(counted));
            if (counted === N.number) setTimeout(askForNumber, 650);
          });
        })(o);
        objects.appendChild(o);
      }
      wrap.appendChild(objects);

      // Browse between numbers.
      var nav = el("div", "row");
      var prev = el("button", "btn round ghost", "◀");
      var next = el("button", "btn round ghost", "▶");
      prev.addEventListener("click", function () { idx = (idx - 1 + data.length) % data.length; chime(); show(); });
      next.addEventListener("click", function () { idx = (idx + 1) % data.length; chime(); show(); });
      nav.appendChild(prev); nav.appendChild(next);
      wrap.appendChild(nav);

      // Step 2 — answer area: tap the numeral that matches (filled in below).
      var answer = el("div", "screen-col");
      wrap.appendChild(answer);

      var answered = false;
      function askForNumber() {
        badge.textContent = N.number;
        prompt.textContent = "Which number is " + N.name + "? Tap it!";
        speak(N.number === 0
          ? "This is zero. Which number is zero? Tap it."
          : "You counted " + N.number + ". Which number is " + N.name + "? Tap it.");

        answer.innerHTML = "";
        var grid = el("div", "answergrid");
        buildChoices(N.number).forEach(function (num) {
          var b = el("button", "answer-num", String(num));
          b.addEventListener("click", function () {
            if (answered) return;
            if (num === N.number) {
              answered = true;
              b.classList.add("right");
              succeed("Yes! That is the number " + N.number + ", " + N.name +
                ". In Twi, " + N.twi + ".",
                function () { idx = (idx + 1) % data.length; show(); }, "⭐");
            } else {
              b.classList.add("wrong");
              speak("That is " + nameOf(num) + ". Try again. Find the number " + N.number + ".");
              setTimeout(function () { b.classList.remove("wrong"); }, 700);
            }
          });
          grid.appendChild(b);
        });
        answer.appendChild(grid);
      }

      // Zero has nothing to tap, so go straight to the numeral question.
      if (N.number === 0) {
        speak("Zero. An empty basket. There is nothing to count.");
        setTimeout(askForNumber, 1200);
      } else {
        speak("Let's count the " + N.object + ". Tap each one.");
      }
    }

    show();
  }

  // ---------------------------------------------------------------------
  // DANCE & JUMP — movement reinforcement. A number appears; Efya jumps that
  // many times (tap or jump), each one counted aloud with a drum tap.
  // ---------------------------------------------------------------------
  function dance() {
    stopLullaby(); dayMode(); clear();
    app.appendChild(backButton());
    app.appendChild(el("h1", "title", "Dance & Jump 💃🏾"));

    var dancer = el("div", "dancer", "🧒🏾");
    app.appendChild(dancer);
    var prompt = el("div", "word", "");
    app.appendChild(prompt);
    var counter = el("div", "jump-count", "");
    app.appendChild(counter);

    var controls = el("div", "row");
    var jumpBtn = el("button", "btn", "⬆️ Jump!");
    var newBtn = el("button", "btn ghost", "🔄 New number");
    controls.appendChild(jumpBtn);
    controls.appendChild(newBtn);
    app.appendChild(controls);

    var target = 0, done = 0;
    function newRound() {
      target = 1 + Math.floor(Math.random() * 5); // 1–5 jumps
      done = 0;
      counter.textContent = "";
      dancer.classList.remove("go");
      dancer.textContent = "🧒🏾";
      prompt.textContent = "Can you jump " + target + " times?";
      speak("Can you jump " + target + " times? Jump with me!");
    }
    function jump() {
      if (done >= target) return;
      done++;
      counter.textContent = done;
      dancer.classList.add("go");
      dancer.textContent = ["🤸🏾", "🙆🏾", "🧒🏾"][done % 3];
      drumTap();
      speak(String(done));
      if (done === target) {
        setTimeout(function () {
          dancer.classList.remove("go");
          // Reached the target — affirm, then advance to a fresh number.
          succeed("You jumped " + target + " times!", newRound, "🎉");
        }, 350);
      }
    }
    jumpBtn.addEventListener("click", jump);
    newBtn.addEventListener("click", function () { chime(); newRound(); });
    newRound();
  }

  // ---------------------------------------------------------------------
  // QUIET CORNER — no tasks, no demands. A calm, dim space with slowly
  // floating Adinkra stars and a gentle "breathe" guide. For Efya's
  // reserved, observant side.
  // ---------------------------------------------------------------------
  function quiet() {
    stopLullaby(); nightMode(); clear();
    app.appendChild(backButton());

    var scene = el("div", "calm-scene");
    var glyphs = ["🌸", "⭐", "🌙", "✦", "🪷", "✺"];
    for (var i = 0; i < 12; i++) {
      var f = el("div", "floaty", glyphs[i % glyphs.length]);
      f.style.left = Math.random() * 100 + "vw";
      f.style.animationDuration = (8 + Math.random() * 8) + "s";
      f.style.animationDelay = (-Math.random() * 10) + "s";
      scene.appendChild(f);
    }
    app.appendChild(scene);

    app.appendChild(el("div", "breathe", "🌷"));
    app.appendChild(el("div", "breathe-label", "Watch the flower breathe. In… and out…"));
    speak("This is the quiet corner. You can just watch and breathe. There is nothing you have to do.",
      { rate: 0.78 });
  }

  // ---------------------------------------------------------------------
  // DREAMLAND — the bedtime feature. Two parts:
  //   1) Wind-down: dim night scene, lullaby, and affirmations tuned to Efya's
  //      personality about staying in her own bed all night.
  //   2) Morning star chart: each morning she stayed in her own bed, she earns
  //      an Adinkra "sleep star". Positive reinforcement, with streak cheers.
  // State persists on-device in localStorage (no accounts, no network).
  // ---------------------------------------------------------------------
  var SLEEP_KEY = "efya.sleep.v1";
  function loadSleep() {
    try { return JSON.parse(localStorage.getItem(SLEEP_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveSleep(s) { localStorage.setItem(SLEEP_KEY, JSON.stringify(s)); }
  function todayKey() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }

  function dreamland() {
    stopLullaby(); nightMode(); clear();
    app.appendChild(backButton());
    app.appendChild(el("h1", "title", "Efya's Dreamland 🌙"));

    var menu = el("div", "row");
    var tuck = el("button", "btn", "😴 Time for bed");
    var chart = el("button", "btn ghost", "⭐ My sleep stars");
    menu.appendChild(tuck);
    menu.appendChild(chart);
    app.appendChild(menu);

    // Bed scene with the pink guide modeling sleeping in her OWN bed.
    app.appendChild(el("div", "bedscene", "🛏️🧸"));

    var note = el("p", "parent-note",
      "For grown-ups: Open “Time for bed” together as part of the bedtime " +
      "routine — a calm wind-down with a lullaby and affirmations about " +
      "staying in her own bed. In the morning, open “My sleep stars” and let " +
      "Efya tap to earn a star for each night she slept in her own bed. " +
      "Praise the streak. Consistency and her own pride do the work.");
    app.appendChild(note);

    tuck.addEventListener("click", windDown);
    chart.addEventListener("click", sleepChart);

    speak("Welcome to Dreamland.", { rate: 0.8 });
  }

  // Part 1: the calming wind-down sequence.
  function windDown() {
    nightMode(); clear();
    stopSpeak();
    startLullaby();

    var scene = el("div", "calm-scene");
    for (var i = 0; i < 14; i++) {
      var f = el("div", "floaty", ["⭐", "✦", "🌙", "✺", "💖"][i % 5]);
      f.style.left = Math.random() * 100 + "vw";
      f.style.animationDuration = (10 + Math.random() * 10) + "s";
      f.style.animationDelay = (-Math.random() * 12) + "s";
      scene.appendChild(f);
    }
    app.appendChild(scene);

    app.appendChild(el("div", "breathe", "🌙"));
    var line = el("div", "word", "");
    app.appendChild(line);

    // The pink guide tucks into her own bed alongside Efya.
    app.appendChild(el("div", "bedscene", "🛏️😴"));

    var controls = el("div", "row");
    var done = el("button", "btn ghost", "🌚 Good night");
    controls.appendChild(done);
    app.appendChild(controls);
    done.addEventListener("click", function () { stopLullaby(); goodnight(); });

    // Speak the affirmations slowly, one at a time, looping gently.
    var lines = EFYA.dreamland.affirmations;
    var i2 = 0;
    function next() {
      if (!lullabyTimer) return; // wind-down was exited
      var text = lines[i2 % lines.length];
      line.textContent = text;
      speak(text, { rate: 0.72, pitch: 1.05 });
      i2++;
    }
    next();
    var affTimer = setInterval(function () {
      if (!lullabyTimer) { clearInterval(affTimer); return; }
      next();
    }, 6500);
  }

  // The "lights out" moment — a dark, still screen and one last good night.
  function goodnight() {
    nightMode(); clear();
    stopLullaby();
    var moon = el("div", "breathe", "🌙");
    app.appendChild(moon);
    app.appendChild(el("div", "word", "Good night, Efya."));
    app.appendChild(el("div", "meaning", "Da yie. Sleep well in your own cozy bed. 💖"));
    var back = el("button", "btn ghost", "🏠");
    back.style.marginTop = "20px";
    back.addEventListener("click", home);
    app.appendChild(back);
    speak("Good night, brave girl. Da yie. See you in the morning.", { rate: 0.7 });
  }

  // Part 2: the morning star chart (a rolling week of the last 7 nights).
  function sleepChart() {
    nightMode(); clear();
    app.appendChild(backButton(dreamland));
    app.appendChild(el("h1", "title", "My Sleep Stars ⭐"));

    var s = loadSleep();
    s.days = s.days || [];      // array of earned-day records, newest last
    s.streak = s.streak || 0;

    var streakLine = el("div", "streak",
      s.streak > 0 ? "🔥 " + s.streak + "-night streak!" : "Earn your first star tomorrow morning!");
    app.appendChild(streakLine);

    // Show the most recent 7 slots.
    var chart = el("div", "chart");
    var recent = s.days.slice(-7);
    var stars = EFYA.dreamland.stars;
    for (var i = 0; i < 7; i++) {
      var slot = el("div", "star-slot");
      var rec = recent[i];
      if (rec) {
        slot.classList.add("earned");
        slot.appendChild(el("span", null, rec.symbol || "⭐"));
        slot.appendChild(el("span", "day", rec.adinkra || ""));
      } else {
        slot.appendChild(el("span", null, "·"));
      }
      chart.appendChild(slot);
    }
    app.appendChild(chart);

    var already = s.lastEarned === todayKey();
    var controls = el("div", "row");
    var earn = el("button", "btn", already ? "🌟 Star earned today!" : "🌟 I slept in my own bed!");
    earn.disabled = already;
    if (already) earn.style.opacity = "0.6";
    controls.appendChild(earn);
    app.appendChild(controls);

    var note = el("p", "parent-note",
      "Tap the star together each morning Efya stayed in her own bed all night. " +
      "If she came in during the night, that's okay — skip the star, stay warm " +
      "and encouraging, and try again tonight. No scolding; the chart only ever " +
      "celebrates the wins.");
    app.appendChild(note);

    earn.addEventListener("click", function () {
      if (s.lastEarned === todayKey()) return;
      var star = stars[(s.days.length) % stars.length];
      s.days.push({ date: todayKey(), symbol: star.symbol, adinkra: star.adinkra });
      s.streak = (s.streak || 0) + 1;
      s.lastEarned = todayKey();
      saveSleep(s);
      celebrate("🌟");
      var cheers = EFYA.dreamland.morningCheers;
      speak(cheers.join(" ") + " " + star.adinkra + " means " + star.meaning + ".", { rate: 0.85 });
      var streakMsg = EFYA.dreamland.streakCheers[s.streak];
      if (streakMsg) setTimeout(function () { speak(streakMsg); }, 2500);
      sleepChart(); // re-render with the new star
    });

    speak("Did you sleep in your own bed last night? If you did, tap your star!", { rate: 0.82 });
  }

  // ---------------------------------------------------------------------
  // Boot.
  // ---------------------------------------------------------------------
  // Resume audio on first interaction (browsers block autoplay).
  window.addEventListener("pointerdown", function once() {
    audioCtx();
    window.removeEventListener("pointerdown", once);
  });

  home();
})();
