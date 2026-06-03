# src/ — Application Source

This folder holds the app's source code as it grows. The structure below is the plan; folders are added as each part is built.

## Structure

```
src/
├── assets/      # Art, audio, Adinkra symbols, kente patterns, the pink guide character
├── components/  # Reusable UI building blocks (buttons, cards, the guide)
├── activities/  # Letter, number, tracing, counting, and movement activities
└── data/        # Letters, numbers, and Ghanaian word/object lists (already started)
```

## Data Files (in `data/`)

- **letters.json** — A–Z, each with a sound, a Ghanaian-themed example word, its meaning, and an image reference.
- **numbers.json** — 0–10, each with its English and Twi name, a Ghanaian counting object, and an image reference.

These files are the source of truth for content so the activities can stay simple and data-driven.

## Activities (planned, in `activities/`)

- **Letter & Number Garden** — explorable, pink-accented world; entry point for free play.
- **Trace & Feel** — finger-tracing letters and numbers (Montessori sandpaper-letter style).
- **Count With Me** — count Ghanaian objects, then meet the numeral (concrete before abstract).
- **Dance & Jump** — movement reinforcement (jump a number of times, dance out a letter) with highlife rhythms.
- **Quiet Corner** — calm, no-task observation space for Efya's reserved, observant side.

## Design Reference

See `../docs/DESIGN.md` for the full design and feature specification, and the root `../README.md` for the project vision and roadmap.
