# Design & Feature Specification — efya-learns

This document captures the design intent and feature plan for Efya's
letters-and-numbers learning app. It is a living document and will grow as the
app develops.

## 1. Goal

Help Efya (E-F-Y-A, pronounced *"Ef-ee-ah"*), age 3, truly **master** letters
A–Z and numbers 0–10 (later 0–20) — and **see her own growth** while she does
it — all while celebrating her Ghanaian heritage, matching her Montessori
learning style, and reflecting her personality.

This is the heart of the redesign. The earlier version of the app was a set of
nice activities; this version is one connected world where every activity feeds
the same goal (mastery) and every bit of progress is something Efya can watch
bloom with her own eyes.

## 2. Design Pillars

### Ghanaian Heritage
- Visual language drawn from Adinkra symbols and kente patterns (pink-forward palette).
- Examples and counting objects from Ghanaian life: cocoa pods, plantains, drums, kente cloth, market scenes.
- Akan/Twi greetings and simple words alongside English (e.g., "Akwaaba" — welcome).
- Highlife and traditional drumming rhythms in movement activities.

### Montessori Alignment
- No timers, no scores, no "wrong" buzzers — mistakes are quiet invitations to try again.
- The **three-period lesson** is the engine of the whole mastery model (see below).
- Concrete-to-abstract: count real objects, then meet the numeral.
- Sandpaper-letter style finger tracing for letters and numbers.
- Clean, ordered, beautiful screens with minimal clutter.
- Self-correcting interactions that build independence.
- Precise, real-world naming of objects.

### Efya's Personality
- **Pink:** a pink-forward palette and Auntie Akosua, a warm guide in pink.
- **Movement:** Dance & Jump is tied directly to the number she's mastering.
- **Adventure:** the garden is an explorable world she can roam freely.
- **Observation:** every lesson opens with a calm, no-task *Watch* moment.
- **Headstrong:** the garden suggests but never forces; she directs her own path.

## 3. The Mastery Model 🌺

### One idea: the Learning Garden

The home screen is **Efya's Learning Garden**: every letter A–Z and every
number 0–10 is a plant in her own garden. There is no menu to read — she can't
read yet. She wanders the garden and taps whatever calls to her, and the
garden itself shows her how far each friend has grown.

### Growth stages

Each plant grows through six stages, one per growth point:

| Points | Stage | |
|---|---|---|
| 0 | 🌰 seed | not yet met |
| 1 | 🌱 sprout | she's heard its presentation |
| 2 | 🌿 leaf | growing |
| 3 | 🌷 bud | growing |
| 4 | 🌸 flower | almost there |
| 5 | 🌺 bloom | **mastered** |

**Growth never goes backwards.** A bad day cannot shrink a flower. The garden,
like the Dreamland star chart, only ever shows wins.

### Growth points — the three-period lesson made visible

Mastery is the Montessori three-period lesson ("This is… / Show me… /
What is…?") turned into something a 3-year-old can watch grow:

```
growth points  =  intro (0–1)  +  practice (0–2)  +  finds (0–2)
mastered (bloom) at 5 points
```

- **Intro (1 point)** — she heard the presentation: *"B. Buh. Is for Banku."*
  This is the first period, *"This is B."*
- **Practice (up to 2 points)** — hands-on work: tracing the letter or numeral,
  or completing a counting round. This is the concrete, sensory work Montessori
  places between naming and recall.
- **Finds (up to 2 points)** — correct recognition answers: *"Show me B!"* /
  *"Which number is 3?"* This is the second period, recall on demand.

A bloom therefore means she has heard it, worked with it hands-on more than
once, and picked it out correctly more than once — not that she tapped through
a screen one time. The third period (*"What is this?"*, where the child does
the naming) belongs to real life: a bloomed flower is the parent's cue to ask
her out loud, in the kitchen, on a walk.

### Learning order — her name comes first

The order Efya *meets* things is personal:

- **Letters: E, F, Y, A first** — her own name. These are the letters she
  already loves and owns; starting there means the very first flowers that
  bloom in her garden spell *Efya*. After her name, a sensible sequence covers
  the remaining letters.
- **Numbers: 1–10, then 0.** Zero is an abstraction; she counts real things
  first and meets "none" last.

The **display order in the garden stays alphabetical and numeric** — the
learning order shapes what *Today's Adventure* and "next plant" suggestions
offer, but the garden itself stays calm, ordered, and predictable, the way a
Montessori shelf does. (And she is always free to ignore the suggestion and
tap any plant she likes.)

## 4. Seeing Her Growth

Making growth *visible to Efya herself* is a first-class feature, not a
report. Four layers:

1. **The garden itself** — flowers visibly bloom across the home screen as she
   masters them. Her progress is the scenery she plays in.
2. **A kente-striped growth bar** — a warm strip across the garden reading
   "X letter flowers + Y number flowers blooming."
3. **Growth moments** — the instant she earns a point, her plant grows on
   screen with a cheer ("Your B flower is growing!"). Mastery earns a bigger
   *bloom* celebration. The feedback is immediate, concrete, and about *her*
   plant — never a score, star rating, or leaderboard.
4. **The grown-ups corner** — a hidden screen opened by **press-and-hold** (so
   little fingers don't wander in) with the real stats for parents: mastered
   counts, the per-letter and per-number stage of every plant, the Dreamland
   sleep-star streak, and reset options.

## 5. Activities

Every activity is reimagined to feed the same mastery model. Nothing is a
detour; everything grows a plant.

| Activity | Grows the plant via | Personality tie-in |
|---|---|---|
| The Learning Garden | navigation to everything below | Adventure, choice |
| Today's Adventure | intro + practice + finds | Gentle structure, one tap |
| Lessons (Meet / Watch / Trace / Find) | intro, practice, finds | Observation, hands-on |
| Count With Me | practice (counting) + finds (numeral) | Heritage, concrete-first |
| Dance & Jump | finds for the number she's learning | Movement |
| Dreamland | sleep-star growth (its own garden) | All of the above, at night |

### Today's Adventure ✨

A short guided session, about **5 minutes**. One tap and the garden does the
planning: it picks the **next letter and number she's working on** (per the
learning order) plus a **quick review** of something already growing, and
flows automatically through **meet → trace → find**. This is the
"do one good thing today" button for busy mornings — structure without
pressure, and it ends back in the open garden.

### Lessons 📖 — tap any plant

Tapping a plant opens its lesson, with four parts. Each part can be done
alone, in any order, as many times as she likes.

- **Meet it** — the presentation, first period style: *"B. Buh. Is for Banku."*
  Letter name, letter sound, and a Ghanaian example word, spoken warmly.
  Numbers are met the same way, with their Twi names.
- **Watch** — an observe-first moment with **no task at all**: watching the
  letter appear, or watching objects counted one by one. This is for
  Efya's reserved, watchful side — she joins when she's ready. *(This replaces
  the old Quiet Corner; see "What we removed.")*
- **Trace** — dotted, handwriting-style shapes traced with a finger,
  sandpaper-letter spirit: **big A first, then little a**; numerals too.
  Tracing earns practice points.
- **Find it** — the recognition quiz, second period style: *"Show me B!"* with
  a few choices. Wrong taps get a gentle, no-penalty retry — self-correction,
  never a buzzer. Correct finds earn find points.

### Count With Me 🥁

Tap to count Ghanaian objects — drums, plantains, cocoa pods — one by one,
then tap the matching numeral. Concrete before abstract, exactly as at school.
Completing the counting round earns a **practice** point and tapping the right
numeral earns a **find** — both grow her number plant.

### Dance & Jump 💃

Now tied to the **number she is learning right now**: Auntie Akosua invites
her to jump that many times, then find its numeral. Her whole body helps the
flower grow.

### Dreamland 🌙 — sleeping in her own bed *(kept as-is)*

Dreamland is deliberately **unchanged** by the redesign — it works, and
bedtime is no place for novelty. It is also, in its own way, more visible
growth: the sleep-star chart is a second little garden.

A bedtime feature to help Efya sleep through the night in her own room (she
currently comes into her parents' room around 12–2am). It uses the same calm,
no-pressure, heritage-rooted language as the rest of the app, applied to a real
parenting goal. Two parts:

- **Wind-down ("Time for bed")** — a night-palette scene with a soft synthesized
  lullaby and spoken affirmations. The affirmations deliberately reframe each of
  Efya's traits as the *reason* she can do this: brave ("your own bed is a cozy
  adventure ship"), strong/headstrong ("you can do hard things, all by
  yourself"), observant ("the stars are watching over you"), and pink-loving
  ("snuggle under your soft pink blanket"). Ends in a quiet "Good night / Da yie".
- **Morning star chart ("My sleep stars")** — positive reinforcement. Each
  morning Efya stayed in her own bed, she taps to earn an Adinkra "sleep star"
  (e.g. *Dwennimmen* — strength, *Fawohodie* — independence). A rolling 7-night
  chart plus streak cheers make her own pride the reward.

Design rules for Dreamland:

- **Only celebrate wins.** Rough nights are skipped silently — never a red mark,
  never scolding. The chart cannot show failure.
- **Parent-paired, child-led.** A small grown-up note frames each screen; Efya
  does the tapping so the win feels like hers.
- **On-device only.** Streaks live in `localStorage`; nothing leaves the tablet.
- **Backed by what works for toddlers:** consistent wind-down routine, a calm
  sensory environment, and a visible reward chart driven by the child's autonomy.

The sleep-star streak also appears in the grown-ups corner alongside the
mastery stats.

### Auntie Akosua 🌺 — the guide

Auntie Akosua is the warm presence that holds the whole app together: she
welcomes Efya in, praises growth moments, celebrates blooms, and says
goodnight. She always speaks in a **woman's voice**.

Her key lines (welcome, praise, bloom, goodnight) can optionally be
**pre-rendered avatar video clips** — an exploration with HeyGen, documented
separately in [`HEYGEN.md`](HEYGEN.md). Clips live in `src/assets/guide/`;
when a clip is absent the app **automatically falls back** to the device's
text-to-speech voice, so the app is always whole, clips or no clips.

## 6. What We Removed (and why)

Mastery focus means subtraction, too. Removed in this redesign:

- **Quiet Corner** — its purpose (a calm, observe-first, no-demand moment) was
  too good to live in a corner. It now lives **inside every lesson as
  *Watch***, so Efya's watchful side is honored everywhere, not in one room.
- **The old home menu and the letter-browser screen** (with its A–Z quick-pick
  row) — **the garden *is* the navigation now.** A pre-reader doesn't need a
  menu; she needs a world. Every plant is one tap from its lesson.
- **The count-screen arrows** — manual next/previous arrows are gone; the
  lesson flow (and Today's Adventure) carries her forward instead, and the
  garden is always one gentle tap away.

## 7. Visual, Audio & Interaction Style

- **Palette:** pinks as the lead color, supported by warm kente-inspired golds, greens, and reds; a calm night palette for Dreamland.
- **Typography:** large, rounded, high-contrast letters and numerals.
- **Sound:** gentle highlife rhythms, clear spoken letter/number names in a woman's voice, soft positive chimes — no harsh "wrong" sounds, ever.
- **Motion:** smooth, calm animations; the biggest celebrations are reserved for *her* growth moments and blooms.
- Big touch targets for small hands; one clear focus per screen; spoken instructions (pre-reader friendly) with optional repeat; always an obvious, gentle way back to the garden.
- **Safety:** audio-first and icon-driven for a pre-reader; no data collection beyond on-device; no purchases, ads, or outbound links; calm volume defaults and a mute option; the grown-ups corner hidden behind press-and-hold.

## 8. Platform & Implementation Notes

- **Platform:** tablet-first **web app** — plain HTML/CSS/JS, zero
  dependencies, no framework, no build step. Opens straight from
  `src/index.html` (works from `file://`); can be added to the tablet home
  screen for a full-screen feel.
- **Code layout:** `app.js` is the screens (garden, adventure, lessons,
  activities); `progress.js` is the mastery/growth engine; `guide.js` is
  Auntie Akosua (woman's-voice speech plus optional clip playback with
  automatic fallback). See [`../src/README.md`](../src/README.md).
- **Progress data:** all on-device in `localStorage` under
  `"efya.progress.v1"` — growth points per letter/number, sleep stars, and
  nothing else. No accounts, no ads, no network.
- **Content:** `data/content.js` is the runtime content (including the
  personal `learnOrder` and the guide-clip manifest); the `data/*.json` files
  are the readable, documented specs.
- **Audio:** Web Speech API for the spoken voice (a woman's voice is selected
  from the device's voices); Web Audio API for chimes, drum taps, and the
  Dreamland lullaby. No required audio assets.
- **Art:** emoji + CSS/SVG stand-ins so the app runs with zero image assets.
  Real Adinkra/kente artwork and recorded Twi audio can replace these later
  without changing the activity logic.
- **Tools (parent-side, Node):** `tools/test-progress.mjs` tests the mastery
  math; `tools/generate-heygen-clips.mjs` generates Auntie Akosua's optional
  clips (needs a `HEYGEN_API_KEY`; see [`HEYGEN.md`](HEYGEN.md)). The app
  itself never runs these and never touches the network.

## 9. Open Questions

- Grow numbers from 0–10 to 0–20 now, or after the first playtests with Efya?
- How many Twi words to introduce in v1?
- When should letter **sounds** take over from letter **names** as the primary
  thing "Meet it" leads with? (Both are presented today; Montessori practice
  leans sounds-first, but her school's sequence should set the pace.)

## 10. Next Steps

The garden, the mastery model, Today's Adventure, the reimagined activities,
and Dreamland are designed and runnable. Next: generate the real Auntie Akosua
clips with HeyGen, replace emoji stand-ins with real Adinkra/kente artwork and
recorded Twi audio, then playtest with Efya and iterate on what delights her.
See the roadmap in the main [`README.md`](../README.md).
