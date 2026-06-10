# src/ — Application Source

The app is a **dependency-free web app**: plain HTML, CSS, and JavaScript with no
framework and no build step. Open `index.html` on a tablet (or any browser) and
it runs — no install, no server, no network. Everything Efya does stays on the
device.

## Run it

- **Easiest:** double-tap / open `src/index.html` in a browser.
- The first tap anywhere unlocks audio (browsers block autoplay until you interact).
- The app opens straight into **Efya's Learning Garden** — there is no menu.
- The layout is responsive: tablet or phone, portrait or landscape, with
  safe-area handling for notched phones.

## Home-screen install (tablet + phones)

The app is a PWA: `manifest.webmanifest` + icons make it installable, and
`sw.js` pre-caches everything so it runs fully offline once installed.
Install needs a real URL (not `file://`) — the repo ships a GitHub Pages
workflow for that; see the root README's "On Your Home Screens" section.
On iPhone/iPad: Safari → Share → **Add to Home Screen**. On Android:
Chrome → **Install app**. The service worker only registers over http(s);
opening from `file://` simply skips it. When shipping changes, bump the
`CACHE` version in `sw.js` so installed devices pick them up.

## Files

```
src/
├── index.html        # Shell — loads the stylesheet, content, and the three layers below
├── manifest.webmanifest # Home-screen install metadata (name, colors, icons)
├── sw.js             # Service worker: offline cache when hosted (bump CACHE on release)
├── styles.css        # Pink-forward, kente-accented styling + calm night mode + responsive rules
├── app.js            # The screens: garden, Today's Adventure, lessons, activities
├── progress.js       # The mastery/growth engine (growth points, stages, persistence)
├── guide.js          # Auntie Akosua: woman's-voice speech + optional video clips
├── data/
│   ├── content.js    # Runtime content the app reads (incl. learnOrder + guide clip manifest)
│   ├── letters.json  # Data spec: A–Z with Ghanaian words, meanings, sounds
│   ├── numbers.json  # Data spec: 0–10 with Twi names and counting objects
│   └── dreamland.json# Data spec: bedtime affirmations + Adinkra "sleep stars"
└── assets/
    ├── icons/        # Home-screen icons (rendered by tools/generate-icons.mjs)
    └── guide/        # OPTIONAL pre-rendered Auntie Akosua clips (mp4) — app works without them
```

`content.js` is what the app loads at runtime (a JS file instead of `fetch`-ing
JSON so it works straight from `file://`, no server). The `.json` files are the
readable, documented data spec and source of truth; keep them in sync.
`content.js` also carries the **learnOrder** (letters E, F, Y, A — her name —
first, then the rest; numbers 1–10 then 0) and the **guide clip manifest**
(which Auntie Akosua lines may have a video clip).

## The three layers

### `app.js` — the screens

The garden home screen (every letter A–Z and number 0–10 as a growing plant),
**Today's Adventure** (a ~5-minute guided meet → trace → find session),
the per-plant **lessons** (Meet it / Watch / Trace / Find it), **Count With Me**,
**Dance & Jump**, **Dreamland**, and the press-and-hold **grown-ups corner**.
Screens call into `progress.js` when Efya earns growth and into `guide.js` when
Auntie Akosua should speak.

### `progress.js` — the mastery/growth engine

The Montessori three-period lesson as arithmetic, kept deliberately tiny and
testable:

- Each letter/number accumulates **growth points**:
  `intro (0–1) + practice (0–2) + finds (0–2)` — intro is hearing the
  presentation, practice is tracing or completing a counting round, finds are
  correct "Show me B!" / "Which number is 3?" answers.
- Points map straight to garden stages:
  🌰 0 → 🌱 1 → 🌿 2 → 🌷 3 → 🌸 4 → 🌺 5, and **5 points = mastered (bloom)**.
- **Progress never decreases.** There is no code path that takes points away.
- It also picks "what's next" using the `learnOrder` from `content.js`, and
  feeds the grown-ups corner (mastered counts, per-item stages, sleep-star
  streak, reset).
- Everything persists on-device in `localStorage` under the key
  **`"efya.progress.v1"`**. No accounts, no network, nothing leaves the tablet.

### `guide.js` — Auntie Akosua

Auntie Akosua's voice and (optionally) her face:

- **Speech:** picks a **woman's voice** from the device's Web Speech API voices
  and speaks all presentations, praise, and affirmations. No audio files needed.
- **Optional clips:** for her key lines (welcome, praise, bloom, goodnight), if
  a matching mp4 exists in `assets/guide/` (per the manifest in `content.js`),
  it plays the clip; **if the clip is absent it falls back automatically to the
  spoken voice.** The folder can be empty and the app is still whole.
- Clips are pre-rendered with HeyGen — see [`../docs/HEYGEN.md`](../docs/HEYGEN.md).

## Testing

The mastery math has a Node test (no dependencies):

```sh
node tools/test-progress.mjs   # from the repo root
```

It exercises the growth-point formula, the stage mapping, the
never-goes-backwards guarantee, and the learn-order picking.

## Generating Auntie Akosua's clips (optional, parent-side)

```sh
HEYGEN_API_KEY=... node tools/generate-heygen-clips.mjs   # from the repo root
```

This is run by a grown-up on a computer, never by the app; it writes mp4s into
`src/assets/guide/`. Details, costs, and the decision record are in
[`../docs/HEYGEN.md`](../docs/HEYGEN.md).

## Tech notes

- **Speech:** the Web Speech API speaks everything — no audio asset files
  needed, pre-reader friendly. Toggle with the 🔊 button.
- **Sound:** gentle chimes, a drum tap, and the Dreamland lullaby are
  synthesized with the Web Audio API. No harsh "wrong" buzzers — feedback is
  always positive, retries are penalty-free.
- **Visuals:** emoji + CSS/SVG stand in for art, so the whole app works with
  zero image assets. Real Adinkra/kente artwork can drop in later without
  touching logic.
- **Privacy:** all data (growth points, sleep stars) lives in `localStorage`
  on the device. No accounts, no ads, no network calls.

## Design Reference

See [`../docs/DESIGN.md`](../docs/DESIGN.md) for the full design spec — the
mastery model, the garden, per-activity specs, and what was removed and why —
and the root [`../README.md`](../README.md) for the project vision and roadmap.
