# src/ — Application Source

The app is a **dependency-free web app**: plain HTML, CSS, and JavaScript with no
framework and no build step. Open `index.html` on a tablet (or any browser) and
it runs — no install, no server, no network.

## Run it

- **Easiest:** double-tap / open `src/index.html` in a browser.
- The first tap anywhere unlocks audio (browsers block autoplay until you interact).
- Best on a tablet in landscape. Add it to the home screen for a full-screen feel.

## Files

```
src/
├── index.html        # Shell — loads the stylesheet, content, and app
├── styles.css        # Pink-forward, kente-accented styling + calm night mode
├── app.js            # All activity logic (vanilla JS)
└── data/
    ├── content.js    # Runtime content the app reads (JS mirror of the specs below)
    ├── letters.json  # Data spec: A–Z with Ghanaian words, meanings, sounds
    ├── numbers.json  # Data spec: 0–10 with Twi names and counting objects
    └── dreamland.json# Data spec: bedtime affirmations + Adinkra "sleep stars"
```

`content.js` is what the app loads at runtime (a JS file instead of `fetch`-ing
JSON so it works straight from `file://`, no server). The `.json` files are the
readable, documented data spec and source of truth; keep them in sync.

## Activities (all implemented in `app.js`)

- **Letters (Trace & Feel)** — meet each letter A–Z with a Ghanaian example word,
  hear it spoken, and finger-trace the shape on a canvas (Montessori sandpaper
  style). A letter quick-pick lets Efya go her own way.
- **Count With Me** — tap to count Ghanaian objects (drums, plantains, cocoa
  pods…) one by one, then meet the numeral and its Twi name. Concrete before abstract.
- **Dance & Jump** — a number appears; Efya jumps that many times, counted aloud
  over a drum beat. Movement reinforcement.
- **Quiet Corner** — a dim, no-task scene with floating Adinkra stars and a slow
  "breathe" guide, for her reserved, observant side.
- **Dreamland** — the bedtime feature (see below).

## Dreamland — sleeping in her own bed

A gentle, positive-reinforcement routine to help Efya sleep through the night in
her own room:

- **Time for bed** — a calming wind-down: night palette, a soft lullaby, and
  spoken affirmations tuned to Efya's personality (brave, strong, headstrong,
  observant) about staying in her own big-girl bed, ending in a quiet "Good night".
- **My sleep stars** — each morning she stayed in her own bed, Efya taps to earn
  an Adinkra "sleep star" (Dwennimmen for strength, Fawohodie for independence…).
  A rolling 7-night chart and streak cheers make her own pride the reward.

Progress is stored on-device (`localStorage`) — no accounts, no network, no data
leaves the tablet. The chart only ever celebrates wins; rough nights are simply
skipped, never punished.

## Tech notes

- **Speech:** the Web Speech API speaks letters, numbers, and affirmations — no
  audio asset files needed, pre-reader friendly. Toggle with the 🔊 button.
- **Sound:** gentle chimes, a drum tap, and the lullaby are synthesized with the
  Web Audio API. No harsh "wrong" buzzers — feedback is always positive.
- **Visuals:** emoji + CSS/SVG stand in for art, so the whole app works with zero
  image assets. Real Adinkra/kente artwork can drop in later without touching logic.

## Design Reference

See `../docs/DESIGN.md` for the full design and feature specification, and the root
`../README.md` for the project vision and roadmap.
