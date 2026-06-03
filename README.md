# efya-learns 🌸

A playful, Montessori-inspired learning app to help **Efya** (E-F-Y-A), age 3, learn her letters and numbers — built to celebrate her Ghanaian heritage and her bright, adventurous personality.

This repository is the home for designing and building the app. It is a love letter to a curious little girl, and a place to grow ideas into a real, joyful learning experience.

## Vision

Efya learns best when she is moving, observing, and discovering on her own terms. The app should feel less like a worksheet and more like a playground: warm, beautiful, and rooted in who she is. Every letter and number she meets should feel like a friend from her world.

## Who We Are Building For

Efya is three years old. She is:

- **Pink-loving** — pink is her favorite color and should feel present and special throughout the experience.
- **A mover** — she loves to dance, run, and jump, so learning should invite her body to join in.
- **Spunky and adventurous** — she enjoys exploring and trying new things, so the app should reward curiosity.
- **Reserved and observant** — she likes to watch and take things in before joining, so there should be calm, no-pressure moments to observe.
- **Headstrong** — she has a strong will and likes to do things her own way, so she should have real choices and control.

## Guiding Principles

### 1. Rooted in Ghanaian Heritage

The app should reflect Efya's Ghanaian background in a way that feels natural and proud, for example:

- Adinkra symbols and their meanings woven into visuals and rewards.
- Kente-inspired colors and patterns (with pink featured prominently).
- Familiar foods, animals, music, and place names from Ghana used as examples (e.g., counting cocoa pods, plantains, or drums).
- Greetings and simple words in Akan/Twi alongside English, so language and culture grow together.
- Highlife and traditional rhythms for the dancing and movement moments.

### 2. Montessori-Aligned

To match how Efya is learning at her Montessori school:

- **Child-led pace** — no timers, no losing, no pressure. She moves on when she is ready.
- **Hands-on, sensory learning** — tracing letters and numbers, matching, and tactile interactions.
- **Concrete before abstract** — count real objects before connecting them to the numeral.
- **Sandpaper-letter style tracing** — follow letter and number shapes with a finger.
- **Order, beauty, and simplicity** — clean, uncluttered screens with calm, natural aesthetics.
- **Self-correction** — gentle feedback that lets her notice and fix things herself, building independence.
- **Real-world language** — name objects clearly and accurately, the way Montessori materials do.

### 3. Built Around Efya's Personality

- **Pink everywhere it counts** — a pink-forward palette and a friendly pink guide character.
- **Move to learn** — dance, run, and jump mini-activities tied to letters and numbers.
- **Room to explore** — an open, adventurous map she can wander through at will.
- **Calm observation mode** — quiet, watch-and-listen moments with no demands.
- **Her way** — multiple paths and choices so her headstrong spirit is an asset, not a battle.

## Learning Goals

- Recognize and name uppercase letters A–Z.
- Recognize and name numbers 0–10 (growing to 20).
- Connect letters to their sounds (phonics, gently introduced).
- Count real objects and match quantities to numerals.
- Trace letter and number shapes to build pre-writing skills.

## Features

The app is built and runnable today — a dependency-free web app. Open
`src/index.html` in a browser (best on a tablet) and play; there's no install,
build step, or server. See [`src/README.md`](src/README.md) for how it works.

- **Letters (Trace & Feel)** ✅ — meet each letter A–Z with a Ghanaian example
  word, hear it spoken, and finger-trace its shape (Montessori sandpaper style).
- **Count With Me** ✅ — tap to count Ghanaian objects, then meet the numeral and
  its Twi name. Concrete before abstract.
- **Dance & Jump** ✅ — a number appears and Efya jumps that many times, counted
  aloud over a drum beat.
- **Quiet Corner** ✅ — a calm, no-task space with floating Adinkra stars and a
  slow "breathe" guide, for her reserved, observant side.
- **Dreamland** ✅ — a bedtime feature to help Efya sleep in her own bed all
  night: a calming wind-down (lullaby + personality-tuned affirmations) and a
  morning Adinkra "sleep star" chart that rewards every night she stays in her
  own room.
- **Efya's Choice** ✅ — open home navigation plus letter/number quick-picks, so
  she decides what to explore next and goes her own way.

## Project Structure (Planned)

```
efya-learns/
├── docs/             # Design notes, learning goals, and feature specs
├── src/              # Application source code (runnable web app)
│   ├── index.html    # Open this to play
│   ├── styles.css    # Pink-forward, kente-accented styling + night mode
│   ├── app.js        # All activity logic (vanilla JS, no build step)
│   └── data/         # content.js (runtime) + letters/numbers/dreamland specs
└── README.md
```

## Roadmap

- [x] Define the visual style guide (pink-forward, kente-inspired palette).
- [x] Build the letter and number data set with Ghanaian examples.
- [x] Prototype the Trace & Feel activity.
- [x] Prototype Count With Me.
- [x] Add a movement activity (Dance & Jump).
- [x] Add the Quiet Corner observation mode.
- [x] Add Dreamland, the bedtime / sleep-in-her-own-bed feature.
- [ ] Replace emoji stand-ins with real Adinkra/kente artwork and recorded audio.
- [ ] Playtest with Efya and iterate based on what delights her.

## A Note

This is built with love, for Efya. The goal is not just to teach letters and numbers, but to make her feel seen — her culture, her energy, and her one-of-a-kind spirit.
