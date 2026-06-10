/* =========================================================================
   efya-learns — app.js
   Efya's Learning Garden: a mastery-first, Montessori-aligned letters &
   numbers game for Efya (age 3), rooted in Ghanaian heritage. Every letter
   A–Z and number 0–10 is a plant; learning activities grow it from seed 🌰
   to bloom 🌺 so she can SEE herself grow. Plus Dreamland, the gentle
   bedtime feature that encourages sleeping in her own bed all night.

   No framework, no build step: open index.html on a tablet and it runs.
   Progress lives in EfyaProgress (progress.js); all speech and the
   "Auntie Akosua" guide live in EfyaGuide (guide.js). Chimes/lullaby use
   the Web Audio API; visuals are emoji/CSS so no image assets are required.
   ========================================================================= */
(function () {
  "use strict";

  var EFYA = window.EFYA;
  var Progress = window.EfyaProgress;
  var Guide = window.EfyaGuide;
  var app = document.getElementById("app");
  var soundBtn = document.getElementById("soundToggle");

  // ---- Settings (sound) persisted on-device, no accounts, no network. ----
  var soundOn = localStorage.getItem("efya.sound") !== "off";
  function renderSoundBtn() { soundBtn.textContent = soundOn ? "🔊" : "🔈"; }
  soundBtn.addEventListener("click", function () {
    soundOn = !soundOn;
    localStorage.setItem("efya.sound", soundOn ? "on" : "off");
    Guide.setSoundOn(soundOn);
    if (!soundOn) stopLullaby();
    renderSoundBtn();
  });
  renderSoundBtn();

  // ---------------------------------------------------------------------
  // Gentle tones (Web Audio). Pre-reader-friendly; fail silently.
  // ---------------------------------------------------------------------
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
  // Every screen change bumps navToken so a delayed "advance" from a praise
  // or growth moment can't yank Efya away from a screen she navigated to.
  var navToken = 0;
  function clear() { navToken++; app.innerHTML = ""; }
  function guarded(fn) {
    var t = navToken;
    return function () { if (t === navToken && fn) fn(); };
  }

  function backButton() {
    var b = el("button", "back", "🏠");
    b.setAttribute("aria-label", "Back to the garden");
    b.addEventListener("click", function () { Guide.stop(); garden(); });
    return b;
  }

  // Small "✨ Adventure" banner so guided-session screens read as one journey.
  var inAdventure = false;
  function maybeBanner() {
    if (inAdventure) app.appendChild(el("div", "adventure-banner", "✨ Adventure"));
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

  // Called when Efya gets something right: celebrate, then Auntie Akosua's
  // affirm-then-advance (praise clip or spoken praise + the specific line,
  // with the advance waiting long enough to be heard).
  function succeed(message, advanceFn, symbol) {
    celebrate(symbol || "🌟");
    Guide.praiseThen(message, guarded(advanceFn));
  }

  function dayMode() { document.body.classList.remove("night"); }
  function nightMode() { document.body.classList.add("night"); }

  // ---------------------------------------------------------------------
  // Content lookups and small shared bits.
  // ---------------------------------------------------------------------
  function letterData(id) {
    for (var i = 0; i < EFYA.letters.length; i++) {
      if (EFYA.letters[i].letter === id) return EFYA.letters[i];
    }
    return null;
  }
  function numberData(id) {
    for (var i = 0; i < EFYA.numbers.length; i++) {
      if (EFYA.numbers[i].number === Number(id)) return EFYA.numbers[i];
    }
    return null;
  }
  function numberName(n) {
    var d = numberData(n);
    return d ? d.name : String(n);
  }
  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
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
    return shuffle(set);
  }

  // ---------------------------------------------------------------------
  // GROWTH MOMENT — the heart of "visible growth". After any award that grew
  // a plant: a brief calm overlay where the stage emoji morphs old → new.
  // Mastery (the 🌺 bloom) gets the full celebration + Auntie's bloom clip.
  // ---------------------------------------------------------------------
  function showGrowPop(result, label) {
    var pop = el("div", "grow-pop");
    var stage = el("div", "grow-stage", result.before.stageEmoji);
    pop.appendChild(stage);
    if (label != null) pop.appendChild(el("div", "grow-label", String(label)));
    app.appendChild(pop);
    setTimeout(function () {
      stage.textContent = result.after.stageEmoji;
      stage.classList.add("now");
    }, 900);
    setTimeout(function () { pop.remove(); }, 2400);
  }
  // Spoken name of the plant: "B" for letters, "three" for numbers.
  function growName(kind, id) {
    return kind === "letters" ? String(id) : numberName(id);
  }
  function masteryMoment(kind, id, then) {
    celebrate("🌺");
    Guide.sayClip("bloom", { onended: function () {
      Guide.say("You know your " + growName(kind, id) + "! Your flower bloomed!");
    } });
    setTimeout(guarded(then), 6000);
  }
  // Growth without praise (used for intro and counting-practice awards, where
  // the next thing — the presentation or the question — follows right after).
  function growthMoment(kind, id, result, then) {
    then = then || function () {};
    if (!result.grew) { then(); return; }
    showGrowPop(result, id);
    if (result.justMastered) { masteryMoment(kind, id, then); return; }
    chime(720);
    Guide.say("Your " + growName(kind, id) + " flower is growing!");
    setTimeout(guarded(then), 2600);
  }
  // Award + growth moment + praise (used when she completed an activity).
  function praiseAndGrow(kind, id, type, message, onDone) {
    var result = Progress.award(kind, id, type);
    if (result.grew) {
      showGrowPop(result, id);
      if (result.justMastered) { masteryMoment(kind, id, onDone); return; }
      chime(720);
      Guide.praiseThen("Your " + growName(kind, id) + " flower is growing!", guarded(onDone));
      return;
    }
    succeed(message, onDone);
  }

  // ---------------------------------------------------------------------
  // GARDEN — home. Every letter and number is a plot she can visit; the
  // growth bar and stage emojis make her progress visible at a glance.
  // ---------------------------------------------------------------------
  function garden() {
    inAdventure = false;
    stopLullaby(); dayMode(); clear();

    var scroll = el("div", "scroll");
    var col = el("div", "screen-col");
    scroll.appendChild(col);
    app.appendChild(scroll);

    col.appendChild(el("h1", "title", "Efya's Learning Garden 🌺"));
    col.appendChild(el("p", "subtitle", EFYA.greeting.twi + "  (" + EFYA.greeting.english + ")"));
    col.appendChild(el("div", "kente"));

    var s = Progress.summary();
    var bar = el("div", "growbar");
    var fill = el("div", "growbar-fill");
    fill.style.width = Math.round(100 * s.totalGp / s.maxGp) + "%";
    bar.appendChild(fill);
    col.appendChild(bar);
    col.appendChild(el("div", "growbar-caption",
      s.lettersMastered + " letter flowers + " + s.numbersMastered + " number flowers blooming"));

    var advBtn = el("button", "btn", "✨ Today's Adventure");
    advBtn.addEventListener("click", function () { chime(); adventure(); });
    col.appendChild(advBtn);

    function plotGrid(kind, ids) {
      var grid = el("div", "garden-grid");
      ids.forEach(function (id) {
        var snap = Progress.get(kind, id);
        var b = el("button", "plot" + (snap.mastered ? " bloomed" : ""));
        b.appendChild(el("span", "stage", snap.stageEmoji));
        b.appendChild(el("span", "lbl", String(id)));
        b.addEventListener("click", function () { chime(); lesson(kind, id); });
        grid.appendChild(b);
      });
      return grid;
    }
    // Display order stays A–Z / 0–10 (learnOrder only drives what's NEXT).
    col.appendChild(el("div", "plot-head", "My letters"));
    col.appendChild(plotGrid("letters", EFYA.letters.map(function (L) { return L.letter; })));
    col.appendChild(el("div", "plot-head", "My numbers"));
    col.appendChild(plotGrid("numbers", EFYA.numbers.map(function (N) { return N.number; })));

    var tiles = el("div", "row");
    var danceTile = el("button", "tile");
    danceTile.appendChild(el("span", "ic", "💃🏾"));
    danceTile.appendChild(el("span", "lb", "Dance & Jump"));
    danceTile.addEventListener("click", function () { chime(); dance(); });
    var dreamTile = el("button", "tile night-tile");
    dreamTile.appendChild(el("span", "ic", "🌙"));
    dreamTile.appendChild(el("span", "lb", "Dreamland"));
    dreamTile.addEventListener("click", function () { chime(); dreamland(); });
    tiles.appendChild(danceTile);
    tiles.appendChild(dreamTile);
    col.appendChild(tiles);

    // Grown-ups corner opens only on press-and-hold (≥1.2s) so Efya's taps
    // can't wander into it; a short tap just asks for help.
    var hold = el("button", "hold-btn", "🧑🏾‍🍼 Grown-ups");
    var holdTimer = null;
    function cancelHold(announce) {
      if (!holdTimer) return;
      clearTimeout(holdTimer);
      holdTimer = null;
      if (announce) Guide.say("Ask a grown-up to help!");
    }
    hold.addEventListener("pointerdown", function () {
      holdTimer = setTimeout(function () { holdTimer = null; parents(); }, 1200);
    });
    hold.addEventListener("pointerup", function () { cancelHold(true); });
    hold.addEventListener("pointerleave", function () { cancelHold(false); });
    hold.addEventListener("pointercancel", function () { cancelHold(false); });
    col.appendChild(hold);

    Guide.sayClip("welcome");
  }

  // ---------------------------------------------------------------------
  // LESSON — the Montessori three-period card for one letter or number.
  // Hear it (presentation), Watch (modeling, no award), then do: Trace and
  // Find it / Count. The first-ever open awards "intro" — her seed sprouts.
  // ---------------------------------------------------------------------
  function lesson(kind, id, onDone) {
    stopLullaby(); dayMode(); clear();
    var isLetter = kind === "letters";
    var item = isLetter ? letterData(id) : numberData(id);

    app.appendChild(backButton());
    maybeBanner();
    var scroll = el("div", "scroll");
    var wrap = el("div", "screen-col");
    scroll.appendChild(wrap);
    app.appendChild(scroll);

    var snap = Progress.get(kind, id);
    var stageLine = el("div", "stage-line",
      snap.stageEmoji + "  " + (isLetter ? "Letter " + id : "Number " + id));
    wrap.appendChild(stageLine);

    var big = el("div", "bigchar", String(id));
    wrap.appendChild(big);

    var emoji = el("div", "emoji-xl", item.emoji);
    emoji.style.cursor = "pointer";
    emoji.addEventListener("click", present);
    wrap.appendChild(emoji);

    if (isLetter) {
      wrap.appendChild(el("div", "word", item.word));
      wrap.appendChild(el("div", "meaning", item.meaning));
    } else {
      var capName = item.name.charAt(0).toUpperCase() + item.name.slice(1);
      wrap.appendChild(el("div", "word", capName + " — " + item.object));
      var m = el("div", "meaning", "In Twi: ");
      m.appendChild(el("span", "twi", item.twi));
      wrap.appendChild(m);
    }

    // Watch-area for the numbers modeling step (objects highlight one by one).
    var watchArea = el("div", "objects");
    wrap.appendChild(watchArea);

    function present() {
      if (isLetter) {
        // Letter name spoken ONCE, then sound, then word — e.g. "B. Buh. Is
        // for Banku." Repeating the letter made it sound doubled; keep as is.
        Guide.say(id + ". " + item.sound + ". Is for " + item.word + ".");
      } else {
        var capName2 = item.name.charAt(0).toUpperCase() + item.name.slice(1);
        Guide.say(capName2 + ". In Twi, " + item.twi + ".");
      }
    }

    // "Watch" — modeling only, never awards progress (the observe-first
    // spirit of the old Quiet Corner lives on here).
    function watchLetter() {
      big.textContent = "";
      big.appendChild(el("span", "watch-base", String(id)));
      big.appendChild(el("span", "watch-reveal", String(id)));
      Guide.say("Watch. This is how " + id + " looks. Now you try!");
      setTimeout(function () {
        if (!document.body.contains(big)) return;
        big.textContent = String(id);
      }, 4400);
    }
    function watchNumber() {
      if (item.number === 0) {
        Guide.say("Zero. An empty " + item.object + ". There is nothing to count.");
        return;
      }
      watchArea.innerHTML = "";
      var nodes = [];
      for (var i = 0; i < item.number; i++) {
        var o = el("div", "obj", item.emoji);
        watchArea.appendChild(o);
        nodes.push(o);
      }
      Guide.say("Watch me count the " + item.object + ".");
      var at = 0;
      setTimeout(function start() {
        var timer = setInterval(function () {
          // Stop quietly if the lesson was left mid-count.
          if (!document.body.contains(watchArea)) { clearInterval(timer); return; }
          if (at < nodes.length) {
            nodes[at].classList.add("counted");
            drumTap();
            Guide.say(String(at + 1));
            at++;
          } else {
            clearInterval(timer);
            setTimeout(function () {
              if (document.body.contains(watchArea)) watchArea.innerHTML = "";
            }, 1400);
          }
        }, 950);
      }, 1800);
    }

    var controls = el("div", "row");
    var hearBtn = el("button", "btn", "🔊 Hear it");
    hearBtn.addEventListener("click", present);
    controls.appendChild(hearBtn);
    var watchBtn = el("button", "btn ghost", "👀 Watch");
    watchBtn.addEventListener("click", isLetter ? watchLetter : watchNumber);
    controls.appendChild(watchBtn);
    if (onDone) {
      // Adventure step: presentation plays, then one clear way forward.
      var nextBtn = el("button", "btn", "Next ▶");
      nextBtn.addEventListener("click", function () { chime(); onDone(); });
      controls.appendChild(nextBtn);
    } else {
      var traceBtn = el("button", "btn ghost", "✏️ Trace");
      traceBtn.addEventListener("click", function () { trace(kind, id); });
      controls.appendChild(traceBtn);
      if (isLetter) {
        var findBtn = el("button", "btn ghost", "🔍 Find it");
        findBtn.addEventListener("click", function () { findIt(id); });
        controls.appendChild(findBtn);
      } else {
        var countBtn = el("button", "btn ghost", "🔢 Count");
        countBtn.addEventListener("click", function () { count(id); });
        controls.appendChild(countBtn);
      }
    }
    wrap.appendChild(controls);

    // First-ever open: award the intro — her plant visibly sprouts, then the
    // presentation follows. Later opens go straight to the presentation.
    if (!snap.intro) {
      var r = Progress.award(kind, id, "intro");
      stageLine.textContent = r.after.stageEmoji + "  " + (isLetter ? "Letter " + id : "Number " + id);
      growthMoment(kind, id, r, present);
    } else {
      present();
    }
  }

  // ---------------------------------------------------------------------
  // TRACE — finger-tracing, Montessori sandpaper-letter style. Letters keep
  // the big-then-little two-step; numbers trace the single numeral. The
  // glyph is a dotted ghost behind a canvas; Efya draws over it. There's no
  // fail state — finishing always celebrates, building independence.
  // ---------------------------------------------------------------------
  // Build the dotted SVG guide for one glyph. Rendered in a soft, rounded
  // handwriting font (not a heavy block face) with a dashed outline that
  // follows the glyph's shape — like a preschool tracing worksheet. Lowercase
  // is drawn a little larger so its body fills the box like the capital does.
  function traceSvg(glyph, isLower) {
    var size = isLower ? 78 : 66;
    return '<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
      '<text x="50" y="50" text-anchor="middle" dominant-baseline="central" ' +
      'style="font-size:' + size + 'px">' + glyph + '</text></svg>';
  }

  function trace(kind, id, onDone) {
    dayMode();
    var isLetter = kind === "letters";
    onDone = onDone || function () { lesson(kind, id); };

    // Letters: trace the big letter, then its little partner (A then a), so
    // Efya connects the two. Numbers: the single numeral.
    var forms;
    if (isLetter) {
      var upper = id, lower = id.toLowerCase();
      forms = [
        { glyph: upper, lower: false, label: "big " + upper, spoken: "the big letter " + upper },
        { glyph: lower, lower: true, label: "little " + lower, spoken: "the little letter " + lower }
      ];
    } else {
      forms = [
        { glyph: String(id), lower: false, label: "number " + id, spoken: "the number " + numberName(id) }
      ];
    }
    var step = 0;
    var stopMouseUp = null; // cleanup for the window mouseup listener between steps

    function render() {
      if (stopMouseUp) stopMouseUp();
      clear();
      var f = forms[step];
      var back = el("button", "back", "🏠");
      back.setAttribute("aria-label", "Back to the garden");
      back.addEventListener("click", function () {
        if (stopMouseUp) stopMouseUp();
        Guide.stop();
        garden();
      });
      app.appendChild(back);
      maybeBanner();
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
        // All forms traced — practice earned, plant grows, then onward.
        if (stopMouseUp) stopMouseUp();
        var message = isLetter
          ? "You traced the big " + forms[0].glyph + " and the little " + forms[1].glyph +
            "! " + id + " is for " + letterData(id).word + "."
          : "You traced the number " + id + "!";
        praiseAndGrow(kind, id, "practice", message, onDone);
      });

      Guide.say("Trace " + f.spoken + " with your finger.");
    }

    render();
  }

  // ---------------------------------------------------------------------
  // FIND IT — letter recognition. "Show me B!" with three big choices.
  // Wrong answers get a gentle shake and another try; she stays until she
  // finds it, and finding it grows her plant.
  // ---------------------------------------------------------------------
  function findIt(id, onDone) {
    stopLullaby(); dayMode(); clear();
    onDone = onDone || function () { lesson("letters", id); };

    app.appendChild(backButton());
    maybeBanner();
    var scroll = el("div", "scroll");
    var wrap = el("div", "screen-col");
    scroll.appendChild(wrap);
    app.appendChild(scroll);

    wrap.appendChild(el("div", "stage-line", Progress.get("letters", id).stageEmoji + "  Find it"));
    wrap.appendChild(el("div", "word", "Show me " + id + "!"));

    // Distractors prefer letters she has already met, so every choice is a
    // fair one; fall back to learnOrder neighbors early on.
    var distractors = [];
    var introduced = [];
    EFYA.letters.forEach(function (L) {
      if (L.letter !== id && Progress.get("letters", L.letter).intro) introduced.push(L.letter);
    });
    shuffle(introduced);
    distractors = introduced.slice(0, 2);
    if (distractors.length < 2) {
      var order = EFYA.learnOrder.letters;
      var at = order.indexOf(id);
      for (var d = 1; d < order.length && distractors.length < 2; d++) {
        [at + d, at - d].forEach(function (n) {
          if (distractors.length >= 2) return;
          if (n < 0 || n >= order.length) return;
          var cand = order[n];
          if (cand !== id && distractors.indexOf(cand) === -1) distractors.push(cand);
        });
      }
    }

    var answered = false;
    var grid = el("div", "answergrid");
    shuffle([id].concat(distractors)).forEach(function (letter) {
      var b = el("button", "answer-num", letter);
      b.addEventListener("click", function () {
        if (answered) return;
        if (letter === id) {
          answered = true;
          b.classList.add("right");
          praiseAndGrow("letters", id, "find",
            "You found " + id + "! " + id + " is for " + letterData(id).word + ".",
            onDone);
        } else {
          b.classList.add("wrong");
          Guide.say("That is " + letter + ". Try again. Find " + id + ".");
          setTimeout(function () { b.classList.remove("wrong"); }, 700);
        }
      });
      grid.appendChild(b);
    });
    wrap.appendChild(grid);

    Guide.say("Show me the letter " + id + ". Tap it!");
  }

  // ---------------------------------------------------------------------
  // COUNT — concrete before abstract. Tap each Ghanaian object with a spoken
  // running count (practice), then "Which number is N? Tap it!" (find).
  // Zero skips straight to the numeral question. answerOnly is used by
  // adventure reviews: recognition only, no counting step.
  // ---------------------------------------------------------------------
  function count(id, onDone, answerOnly) {
    stopLullaby(); dayMode(); clear();
    var N = numberData(id);
    onDone = onDone || function () { lesson("numbers", id); };

    app.appendChild(backButton());
    maybeBanner();
    var scroll = el("div", "scroll");
    var wrap = el("div", "screen-col");
    scroll.appendChild(wrap);
    app.appendChild(scroll);

    var counted = 0;
    var skipCounting = answerOnly || N.number === 0;

    var badge = el("div", "count-badge", "");
    wrap.appendChild(badge);

    var prompt = el("div", "word",
      N.number === 0 ? "Zero! An empty " + N.object + "." : "Tap to count the " + N.object);
    wrap.appendChild(prompt);

    if (!skipCounting) {
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
            Guide.say(String(counted));
            if (counted === N.number) {
              // Counting every object is the practice — the plant grows
              // before the numeral question appears.
              setTimeout(function () {
                var r = Progress.award("numbers", id, "practice");
                growthMoment("numbers", id, r, askForNumber);
              }, 650);
            }
          });
        })(o);
        objects.appendChild(o);
      }
      wrap.appendChild(objects);
    }

    var answer = el("div", "screen-col");
    wrap.appendChild(answer);

    var answered = false;
    function askForNumber() {
      badge.textContent = N.number;
      prompt.textContent = "Which number is " + N.name + "? Tap it!";
      Guide.say(N.number === 0
        ? "This is zero. Which number is zero? Tap it."
        : (answerOnly
            ? "Which number is " + N.name + "? Tap it."
            : "You counted " + N.number + ". Which number is " + N.name + "? Tap it."));

      answer.innerHTML = "";
      var grid = el("div", "answergrid");
      buildChoices(N.number).forEach(function (num) {
        var b = el("button", "answer-num", String(num));
        b.addEventListener("click", function () {
          if (answered) return;
          if (num === N.number) {
            answered = true;
            b.classList.add("right");
            praiseAndGrow("numbers", id, "find",
              "That is the number " + N.number + ", " + N.name + ". In Twi, " + N.twi + ".",
              onDone);
          } else {
            b.classList.add("wrong");
            Guide.say("That is " + numberName(num) + ". Try again. Find the number " + N.number + ".");
            setTimeout(function () { b.classList.remove("wrong"); }, 700);
          }
        });
        grid.appendChild(b);
      });
      answer.appendChild(grid);
    }

    if (N.number === 0) {
      // Zero has nothing to tap (and earns no counting practice).
      Guide.say("Zero. An empty basket. There is nothing to count.");
      setTimeout(guarded(askForNumber), 1200);
    } else if (answerOnly) {
      prompt.textContent = "";
      askForNumber();
    } else {
      Guide.say("Let's count the " + N.object + ". Tap each one.");
    }
  }

  // ---------------------------------------------------------------------
  // TODAY'S ADVENTURE — a short guided session built from what's next in her
  // garden: one new letter (hear → trace → find) + one new number (hear →
  // count), plus a quick review of something she's already mastered. The
  // home button exits anytime — it stays child-led.
  // ---------------------------------------------------------------------
  function nextAfter(kind, excludeId) {
    var order = EFYA.learnOrder[kind];
    for (var i = 0; i < order.length; i++) {
      if (String(order[i]) === String(excludeId)) continue;
      if (!Progress.get(kind, order[i]).mastered) return order[i];
    }
    return null;
  }

  function adventure() {
    inAdventure = true;
    var steps = [];
    var L = Progress.nextUp("letters");
    var N = Progress.nextUp("numbers");
    if (L != null && N != null) {
      steps.push({ kind: "letters", id: L, mode: "learn" });
      steps.push({ kind: "numbers", id: N, mode: "learn" });
    } else if (L != null) {
      steps.push({ kind: "letters", id: L, mode: "learn" });
      var L2 = nextAfter("letters", L);
      if (L2 != null) steps.push({ kind: "letters", id: L2, mode: "learn" });
    } else if (N != null) {
      steps.push({ kind: "numbers", id: N, mode: "learn" });
      var N2 = nextAfter("numbers", N);
      if (N2 != null) steps.push({ kind: "numbers", id: N2, mode: "learn" });
    } else {
      // The whole garden is blooming — celebrate with two reviews.
      var r1 = Progress.pickReview("letters");
      var r2 = Progress.pickReview("numbers");
      if (r1 != null) steps.push({ kind: "letters", id: r1, mode: "review" });
      if (r2 != null) steps.push({ kind: "numbers", id: r2, mode: "review" });
    }

    // One review of something already mastered keeps old flowers fresh.
    var hasLearnStep = steps.some(function (st) { return st.mode === "learn"; });
    if (hasLearnStep) {
      var kinds = shuffle(["letters", "numbers"]);
      for (var k = 0; k < kinds.length; k++) {
        var rid = Progress.pickReview(kinds[k]);
        if (rid != null) { steps.push({ kind: kinds[k], id: rid, mode: "review" }); break; }
      }
    }

    function runStep(i) {
      if (!inAdventure) return; // she went home mid-adventure
      if (i >= steps.length) { finishAdventure(); return; }
      var st = steps[i];
      var next = function () { runStep(i + 1); };
      if (st.mode === "review") {
        if (st.kind === "letters") findIt(st.id, next);
        else count(st.id, next, true); // recognition only
      } else if (st.kind === "letters") {
        lesson("letters", st.id, function () {
          trace("letters", st.id, function () {
            findIt(st.id, next);
          });
        });
      } else {
        lesson("numbers", st.id, function () {
          count(st.id, next);
        });
      }
    }
    runStep(0);
  }

  function finishAdventure() {
    inAdventure = false;
    dayMode(); clear();
    var s = Progress.summary();
    var blooms = s.lettersMastered + s.numbersMastered;
    var line = blooms === 0 ? "Your plants are sprouting!"
      : blooms + (blooms === 1 ? " flower is" : " flowers are") + " blooming.";
    app.appendChild(el("div", "emoji-xl", blooms === 0 ? "🌱" : "🌺"));
    app.appendChild(el("div", "word", "Today your garden grew!"));
    app.appendChild(el("div", "meaning", line));
    var homeBtn = el("button", "btn", "🏡 Back to my garden");
    homeBtn.style.marginTop = "20px";
    homeBtn.addEventListener("click", function () { Guide.stop(); garden(); });
    app.appendChild(homeBtn);
    celebrate(blooms === 0 ? "🌱" : "🌺");
    Guide.say("Today your garden grew! " + line + " Ayekoo, Efya!");
    setTimeout(function () {
      // Return on its own if she's just watching the confetti.
      if (document.body.contains(homeBtn)) garden();
    }, 6000);
  }

  // ---------------------------------------------------------------------
  // DANCE & JUMP — movement reinforcement for the number she's learning.
  // Jump N times (counted aloud with drum taps), then find the numeral N —
  // a correct find grows that number's plant.
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

    var answer = el("div", "screen-col");
    app.appendChild(answer);

    var controls = el("div", "row");
    var jumpBtn = el("button", "btn", "⬆️ Jump!");
    var newBtn = el("button", "btn ghost", "🔄 New number");
    controls.appendChild(jumpBtn);
    controls.appendChild(newBtn);
    app.appendChild(controls);

    var target = 0, done = 0, asking = false;
    function newRound() {
      // Jump the number she's growing right now, kept jumpable (1–9; zero
      // and ten don't make a good jumping game).
      var n = Progress.nextUp("numbers");
      if (n == null) n = 1 + Math.floor(Math.random() * 9);
      target = Math.max(1, Math.min(9, n));
      done = 0;
      asking = false;
      counter.textContent = "";
      answer.innerHTML = "";
      dancer.classList.remove("go");
      dancer.textContent = "🧒🏾";
      prompt.textContent = "Can you jump " + target + " times?";
      Guide.say("Can you jump " + target + " times? Jump with me!");
    }
    function jump() {
      if (asking || done >= target) return;
      done++;
      counter.textContent = done;
      dancer.classList.add("go");
      dancer.textContent = ["🤸🏾", "🙆🏾", "🧒🏾"][done % 3];
      drumTap();
      Guide.say(String(done));
      if (done === target) {
        setTimeout(function () {
          dancer.classList.remove("go");
          askNumber();
        }, 600);
      }
    }
    function askNumber() {
      asking = true;
      prompt.textContent = "Which number is " + numberName(target) + "? Tap it!";
      Guide.say("You jumped " + target + " times! Which number is " +
        numberName(target) + "? Tap it.");
      answer.innerHTML = "";
      var answered = false;
      var grid = el("div", "answergrid");
      buildChoices(target).forEach(function (num) {
        var b = el("button", "answer-num", String(num));
        b.addEventListener("click", function () {
          if (answered) return;
          if (num === target) {
            answered = true;
            b.classList.add("right");
            praiseAndGrow("numbers", target, "find",
              "That is the number " + target + "! You jumped " + target + " times!",
              newRound);
          } else {
            b.classList.add("wrong");
            Guide.say("That is " + numberName(num) + ". Try again. Find the number " + target + ".");
            setTimeout(function () { b.classList.remove("wrong"); }, 700);
          }
        });
        grid.appendChild(b);
      });
      answer.appendChild(grid);
    }
    jumpBtn.addEventListener("click", jump);
    newBtn.addEventListener("click", function () { chime(); newRound(); });
    newRound();
  }

  // ---------------------------------------------------------------------
  // DREAMLAND — the bedtime feature, kept exactly as it works. Two parts:
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
    inAdventure = false;
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

    Guide.say("Welcome to Dreamland.", { rate: 0.8 });
  }

  // Part 1: the calming wind-down sequence.
  function windDown() {
    nightMode(); clear();
    Guide.stop();
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
      Guide.say(text, { rate: 0.72, pitch: 1.05 });
      i2++;
    }
    next();
    var affTimer = setInterval(function () {
      if (!lullabyTimer) { clearInterval(affTimer); return; }
      next();
    }, 6500);
  }

  // The "lights out" moment — a dark, still screen and one last good night,
  // from Auntie Akosua's clip when it exists, her voice when it doesn't.
  function goodnight() {
    nightMode(); clear();
    stopLullaby();
    var moon = el("div", "breathe", "🌙");
    app.appendChild(moon);
    app.appendChild(el("div", "word", "Good night, Efya."));
    app.appendChild(el("div", "meaning", "Da yie. Sleep well in your own cozy bed. 💖"));
    var back = el("button", "btn ghost", "🏠");
    back.style.marginTop = "20px";
    back.addEventListener("click", function () { Guide.stop(); garden(); });
    app.appendChild(back);
    Guide.sayClip("goodnight", { rate: 0.7 });
  }

  // Part 2: the morning star chart (a rolling week of the last 7 nights).
  function sleepChart() {
    nightMode(); clear();
    var back = el("button", "back", "🏠");
    back.setAttribute("aria-label", "Back to Dreamland");
    back.addEventListener("click", function () { Guide.stop(); dreamland(); });
    app.appendChild(back);
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
      Guide.say(cheers.join(" ") + " " + star.adinkra + " means " + star.meaning + ".", { rate: 0.85 });
      var streakMsg = EFYA.dreamland.streakCheers[s.streak];
      if (streakMsg) setTimeout(function () { Guide.say(streakMsg); }, 2500);
      sleepChart(); // re-render with the new star
    });

    Guide.say("Did you sleep in your own bed last night? If you did, tap your star!", { rate: 0.82 });
  }

  // ---------------------------------------------------------------------
  // FOR GROWN-UPS — progress at a glance (reached only by press-and-hold on
  // the garden). Resets ask for a second confirming tap before clearing.
  // ---------------------------------------------------------------------
  function parents() {
    inAdventure = false;
    stopLullaby(); dayMode(); clear();
    app.appendChild(backButton());

    var scroll = el("div", "scroll");
    var col = el("div", "screen-col");
    scroll.appendChild(col);
    app.appendChild(scroll);

    col.appendChild(el("h1", "title", "For grown-ups 🧑🏾‍🍼"));

    var s = Progress.summary();
    var masteredLetters = [];
    EFYA.letters.forEach(function (L) {
      if (Progress.get("letters", L.letter).mastered) masteredLetters.push(L.letter);
    });
    var masteredNumbers = [];
    EFYA.numbers.forEach(function (N) {
      if (Progress.get("numbers", N.number).mastered) masteredNumbers.push(N.number);
    });

    var stats = el("div", "parent-stats");
    stats.appendChild(el("div", null,
      "Letters mastered: " + s.lettersMastered + " of " + s.lettersTotal +
      (masteredLetters.length ? " — " + masteredLetters.join(" ") : "")));
    stats.appendChild(el("div", null,
      "Numbers mastered: " + s.numbersMastered + " of " + s.numbersTotal +
      (masteredNumbers.length ? " — " + masteredNumbers.join(" ") : "")));
    stats.appendChild(el("div", null,
      "Overall growth: " + Math.round(100 * s.totalGp / s.maxGp) + "% (" +
      s.totalGp + " of " + s.maxGp + " growth points)"));

    var grid = el("div", "stage-grid");
    EFYA.letters.forEach(function (L) {
      grid.appendChild(el("span", null, L.letter + Progress.get("letters", L.letter).stageEmoji));
    });
    EFYA.numbers.forEach(function (N) {
      grid.appendChild(el("span", null, N.number + Progress.get("numbers", N.number).stageEmoji));
    });
    stats.appendChild(grid);

    var sl = loadSleep();
    var nights = (sl.days || []).length;
    var streak = sl.streak || 0;
    stats.appendChild(el("div", null,
      "Sleep stars: " + nights + " total · streak " + streak +
      (streak === 1 ? " night" : " nights")));
    col.appendChild(stats);

    // Each reset arms on the first tap and clears only on the second.
    function confirmButton(label, action) {
      var armed = false;
      var b = el("button", "btn ghost", label);
      b.addEventListener("click", function () {
        if (!armed) {
          armed = true;
          b.textContent = "Tap again to confirm";
          setTimeout(function () {
            if (armed) { armed = false; b.textContent = label; }
          }, 3500);
          return;
        }
        action();
      });
      return b;
    }
    var resets = el("div", "row");
    resets.appendChild(confirmButton("↺ Reset learning progress", function () {
      Progress.reset();
      parents();
    }));
    resets.appendChild(confirmButton("↺ Reset sleep stars", function () {
      try { localStorage.removeItem(SLEEP_KEY); } catch (e) {}
      parents();
    }));
    col.appendChild(resets);
  }

  // ---------------------------------------------------------------------
  // Boot.
  // ---------------------------------------------------------------------
  // Resume audio on first interaction (browsers block autoplay).
  window.addEventListener("pointerdown", function once() {
    audioCtx();
    window.removeEventListener("pointerdown", once);
  });

  garden();
})();
