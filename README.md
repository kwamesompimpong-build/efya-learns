# efya-learns 🌺

A playful, Montessori-inspired learning app to help **Efya** (pronounced
*"Ef-ee-ah"*), age 3, truly **master** her letters and numbers — built to
celebrate her Ghanaian heritage and her bright, adventurous personality.

This repository is the home for designing and building the app. It is a love
letter to a curious little girl, and a place to grow ideas into a real, joyful
learning experience.

## Vision

Efya learns best when she is moving, observing, and discovering on her own
terms. The app should feel less like a worksheet and more like a garden: warm,
beautiful, and rooted in who she is. Every letter and number she meets should
feel like a friend from her world — and she should be able to **see herself
growing**, every single day.

That is the heart of this redesign: not just exposure to letters and numbers,
but real mastery she can watch bloom.

## Who We Are Building For

Efya is three years old. She is:

- **Pink-loving** — pink is her favorite color and should feel present and special throughout the experience.
- **A mover** — she loves to dance, run, and jump, so learning should invite her body to join in.
- **Spunky and adventurous** — she enjoys exploring and trying new things, so the app should reward curiosity.
- **Reserved and observant** — she likes to watch and take things in before joining, so there should be calm, no-pressure moments to observe.
- **Headstrong** — she has a strong will and likes to do things her own way, so she should have real choices and control.

## Efya's Learning Garden 🌸

The whole app now lives inside one idea: **every letter A–Z and every number
0–10 is a plant in Efya's own garden.** The garden is the home screen — there
is no menu to read, because she can't read yet. She just wanders her garden
and taps what calls to her.

Each plant grows through six stages as she learns:

> 🌰 seed → 🌱 sprout → 🌿 leaf → 🌷 bud → 🌸 flower → 🌺 bloom

A full bloom means **mastered** — and growth never goes backwards. A plant
grows when she hears its presentation, traces its shape or counts with it, and
picks it out when asked ("Show me B!"). Five growth points and it blooms, the
Montessori three-period lesson made visible (the full model lives in
[`docs/DESIGN.md`](docs/DESIGN.md)).

Her own name comes first: the garden quietly teaches **E, F, Y, A** before any
other letters, so the very first flowers that bloom spell *Efya*.

### Seeing herself grow

- **The garden itself** — flowers visibly bloom across the screen as she masters them.
- **A kente-striped growth bar** — "3 letter flowers + 2 number flowers blooming."
- **Growth moments** — the instant she earns progress, her plant grows on screen with a cheer ("Your B flower is growing!"), and mastery gets a bigger bloom celebration.
- **A hidden grown-ups corner** — opened by press-and-hold (so little fingers don't wander in) with the real stats for parents: mastered counts, per-letter and per-number stages, the sleep-star streak, and reset options.

## Features

The app is built and runnable today — a dependency-free web app. Open
`src/index.html` in a browser (best on a tablet) and play; there's no install,
build step, or server. See [`src/README.md`](src/README.md) for how it works.

- **Efya's Learning Garden** 🌱 — the home screen. Every letter and number is a
  plant; tapping one opens its lesson, and mastering it makes it bloom.
- **Today's Adventure** ✨ — a short guided session (about 5 minutes) that picks
  the next letter and number she's working on plus a quick review, and flows on
  its own: meet → trace → find. One tap, and the garden does the planning.
- **Lessons** 📖 — tap any plant to *Meet it* (hear the presentation: "B. Buh.
  Is for Banku." with Ghanaian example words), *Watch* (a calm, observe-first
  moment with no task, for her reserved side), *Trace* (dotted handwriting-style
  letters — big A, then little a — and numerals), or *Find it* (a gentle
  recognition quiz with no-penalty retries). Every part grows her plant.
- **Count With Me** 🥁 — tap to count Ghanaian objects (drums, plantains, cocoa
  pods), then tap the matching numeral. Concrete before abstract — and both the
  counting and the answering grow her number plant.
- **Dance & Jump** 💃 — tied to the number she's learning right now: jump that
  many times, then find its numeral. Her body helps the flower grow.
- **Dreamland** 🌙 — the bedtime feature, kept just as it is: a calming
  wind-down (lullaby + personality-tuned affirmations about staying in her own
  bed) and a morning Adinkra "sleep star" chart with streaks — another garden
  where her growth is visible.
- **Auntie Akosua** 🌺 — the warm guide who welcomes, praises, celebrates
  blooms, and says goodnight in a woman's voice. Her key lines can optionally be
  pre-rendered avatar video clips (an exploration with HeyGen — see
  [`docs/HEYGEN.md`](docs/HEYGEN.md)), with automatic fallback to the device's
  spoken voice when no clips are present.

Everything runs **offline and on-device** — no accounts, no ads, no network.

## Guiding Principles

### 1. Rooted in Ghanaian Heritage

The app reflects Efya's Ghanaian background in a way that feels natural and proud:

- Adinkra symbols and their meanings woven into visuals and rewards.
- Kente-inspired colors and patterns (with pink featured prominently).
- Familiar foods, animals, music, and place names from Ghana used as examples (e.g., counting cocoa pods, plantains, or drums).
- Greetings and simple words in Akan/Twi alongside English, so language and culture grow together.
- Highlife and traditional rhythms for the dancing and movement moments.

### 2. Montessori-Aligned

To match how Efya is learning at her Montessori school:

- **Child-led pace** — no timers, no losing, no pressure. She moves on when she is ready.
- **Three-period lesson at the core** — the mastery model maps directly onto "This is… / Show me… / What is…?".
- **Hands-on, sensory learning** — tracing letters and numbers, matching, and tactile interactions.
- **Concrete before abstract** — count real objects before connecting them to the numeral.
- **Order, beauty, and simplicity** — clean, uncluttered screens with calm, natural aesthetics.
- **Self-correction** — gentle feedback that lets her notice and fix things herself, building independence.
- **Real-world language** — name objects clearly and accurately, the way Montessori materials do.

### 3. Built Around Efya's Personality

- **Pink everywhere it counts** — a pink-forward palette and Auntie Akosua, a warm guide in pink.
- **Move to learn** — Dance & Jump ties her jumping straight to the number she's mastering.
- **Room to explore** — the garden is open; she taps any plant she likes, any time.
- **Watch first** — every lesson opens with a no-task *Watch* moment for her observant side.
- **Her way** — the garden suggests, never forces; her headstrong spirit is an asset, not a battle.

## Learning Goals

- **Master** (recognize and name) uppercase and lowercase letters A–Z.
- **Master** numbers 0–10 (growing to 20 later).
- Connect letters to their sounds (phonics, gently introduced in every "Meet it").
- Count real objects and match quantities to numerals.
- Trace letter and number shapes to build pre-writing skills.
- See and feel her own progress, so motivation comes from her own garden.

## On Your Home Screens 📱

The app is a full **installable web app** — it can live on the iPad's home
screen and on both parents' phones, with its own pink-bloom icon, running
full-screen with no browser bars, and working offline after the first visit.
It is responsive from a small phone in either orientation up to the iPad.

**One-time setup — put it on the web (free):**

1. In this GitHub repo: **Settings → Pages → Source: "GitHub Actions"**.
2. Merge/push to `main`. The included workflow
   (`.github/workflows/pages.yml`) publishes the app to
   `https://<your-username>.github.io/efya-learns/` automatically on every
   push.

**Then on each device:**

- **iPad / iPhone:** open the URL in Safari → Share button → **Add to Home
  Screen**. (Home-screen install requires a real URL — Safari can't install
  from a local file.)
- **Android:** open the URL in Chrome → menu → **Add to Home screen** /
  **Install app**.

After that it launches like a native app, fully offline, and each device
keeps its own garden progress. (Opening `src/index.html` directly still
works too — hosting is only needed for the home-screen install.)

## Project Structure

```
efya-learns/
├── .github/workflows/pages.yml   # Publishes src/ to GitHub Pages
├── docs/
│   ├── DESIGN.md     # Design pillars, the mastery model, per-activity specs
│   └── HEYGEN.md     # The HeyGen avatar-clip exploration for Auntie Akosua
├── src/              # Application source code (runnable web app)
│   ├── index.html    # Open this to play
│   ├── manifest.webmanifest  # Home-screen install metadata (name, icons)
│   ├── sw.js         # Service worker: full offline support once installed
│   ├── styles.css    # Pink-forward, kente-accented styling + night mode
│   ├── app.js        # The screens: garden, adventure, lessons, activities
│   ├── progress.js   # The mastery/growth engine (on-device, localStorage)
│   ├── guide.js      # Auntie Akosua: woman's voice + optional video clips
│   ├── data/         # content.js (runtime) + letters/numbers/dreamland specs
│   └── assets/       # icons/ (home-screen icons) + guide/ (optional clips)
├── tools/            # Parent-side helpers (Node, never run by the app)
│   ├── test-progress.mjs          # Tests for the mastery math
│   ├── generate-icons.mjs         # Renders the home-screen icon PNGs
│   └── generate-heygen-clips.mjs  # Generates Auntie Akosua's video clips
└── README.md
```

## Roadmap

- [x] Define the visual style guide (pink-forward, kente-inspired palette).
- [x] Build the letter and number data set with Ghanaian examples.
- [x] **Efya's Learning Garden** — the garden home screen with growing plants.
- [x] **The mastery model** — three-period growth points, blooms, and the grown-ups corner.
- [x] **Today's Adventure** — the short guided meet → trace → find session.
- [x] Reimagine Count With Me and Dance & Jump to feed mastery.
- [x] Keep Dreamland, the bedtime / sleep-in-her-own-bed feature.
- [x] Explore HeyGen avatar clips for Auntie Akosua (see [`docs/HEYGEN.md`](docs/HEYGEN.md)).
- [x] Installable on tablet & phone home screens (PWA: manifest, icons, offline) + responsive layout.
- [ ] Enable GitHub Pages (Settings → Pages → "GitHub Actions") and add to each device.
- [ ] Generate the real Auntie Akosua clips with HeyGen.
- [ ] Replace emoji stand-ins with real Adinkra/kente artwork and recorded audio.
- [ ] Playtest with Efya and iterate based on what delights her.

## A Note

This is built with love, for Efya. The goal is not just to teach letters and
numbers, but to let her watch herself grow — her culture, her energy, and her
one-of-a-kind spirit blooming, one flower at a time.
