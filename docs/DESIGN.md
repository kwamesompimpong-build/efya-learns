# Design & Feature Specification — efya-learns

This document captures the design intent and feature plan for Efya's letters-and-numbers learning app. It is a living document and will grow as the app develops.

## 1. Goal

Help Efya (E-F-Y-A), age 3, joyfully recognize letters (A–Z) and numbers (0–10, later 0–20), while celebrating her Ghanaian heritage, matching her Montessori learning style, and reflecting her personality.

## 2. Design Pillars

### Ghanaian Heritage
- Visual language drawn from Adinkra symbols and kente patterns (pink-forward palette).
- Examples and counting objects from Ghanaian life: cocoa pods, plantains, drums, kente cloth, market scenes.
- Akan/Twi greetings and simple words alongside English (e.g., "Akwaaba" — welcome).
- Highlife and traditional drumming rhythms in movement activities.

### Montessori Alignment
- No timers, no scores, no "wrong" buzzers — mistakes are quiet invitations to try again.
- Concrete-to-abstract: count real objects, then meet the numeral.
- Sandpaper-letter style finger tracing for letters and numbers.
- Clean, ordered, beautiful screens with minimal clutter.
- Self-correcting interactions that build independence.
- Precise, real-world naming of objects.

### Efya's Personality
- Pink: a pink-forward palette and a warm pink guide character.
- Movement: dance, run, and jump activities tied to learning.
- Adventure: an explorable world she can roam freely.
- Observation: a calm "Quiet Corner" with no demands.
- Headstrong: real choices so she directs her own path.

## 3. Core Activities

| Activity | Skill | Personality Tie-In |
|---|---|---|
| Letter & Number Garden | Recognition, navigation | Adventure, choice |
| Trace & Feel | Shape/pre-writing | Hands-on (Montessori) |
| Count With Me | Counting, quantity | Concrete objects (heritage) |
| Dance & Jump | Number/letter reinforcement | Movement |
| Quiet Corner | Calm observation | Reserved/observant side |
| Dreamland | Bedtime / sleep habit | All of the above, at night |
| Efya's Choice | Self-direction | Headstrong, autonomy |

### Dreamland — sleeping in her own bed

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

## 4. Visual & Audio Style

- **Palette:** pinks as the lead color, supported by warm kente-inspired golds, greens, and reds.
- **Typography:** large, rounded, high-contrast letters and numerals.
- **Characters:** a friendly pink guide who invites but never pressures.
- **Sound:** gentle highlife rhythms, clear spoken letter/number names, soft positive chimes.
- **Motion:** smooth, calm animations; celebratory movement reserved for the child's own actions.

## 5. Interaction Principles

- Big touch targets suited to small hands.
- One clear focus per screen.
- Spoken instructions (pre-reader friendly) with optional repeat.
- Always an obvious, gentle way back to free exploration.
- No dead ends, ads, or external links.

## 6. Accessibility & Safety

- Designed for a pre-reader: audio-first, icon-driven navigation.
- No data collection beyond what runs on-device.
- No in-app purchases, ads, or outbound links.
- Calm volume defaults and a mute option.

## 7. Platform & Implementation (v1)

- **Platform:** tablet-first **web app** — plain HTML/CSS/JS, no framework, no
  build step. Opens straight from `src/index.html`; can be added to the tablet
  home screen for a full-screen feel.
- **Audio:** Web Speech API for spoken letters/numbers/affirmations (pre-reader
  friendly, no recorded files yet); Web Audio API for gentle chimes, a drum tap,
  and the Dreamland lullaby.
- **Art:** emoji + CSS/SVG stand-ins so the app runs with zero image assets.
  Real Adinkra/kente artwork and recorded Twi audio can replace these later
  without changing the activity logic.
- **Data:** `data/content.js` is the runtime content (a JS mirror of the
  `letters.json` / `numbers.json` / `dreamland.json` specs) so everything loads
  from `file://` without a server.

## 8. Open Questions

- How many Twi words to introduce in v1?
- Should letters be taught in alphabetical order or by sound frequency?
- Grow numbers from 0–10 to 0–20 now, or after first playtests?

## 9. Next Steps

The five activities and Dreamland are built and runnable. Next: replace emoji
stand-ins with real Adinkra/kente artwork and recorded Twi audio, then playtest
with Efya and iterate on what delights her. See the roadmap in the main README.
