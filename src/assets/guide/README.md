# Auntie Akosua's clips

This folder holds the optional pre-rendered HeyGen video clips of Auntie
Akosua, the app's guide — small square mp4 files named exactly as listed in
the clip manifest in `src/data/content.js` (`EFYA.guide.clips`), e.g.
`welcome.mp4`, `praise1.mp4`, `bloom.mp4`, `goodnight.mp4`.

**It is completely fine for this folder to be empty** — the app checks for
each clip and quietly falls back to the device's spoken voice (Web Speech)
whenever a file is missing. Clips are generated once, on a parent's computer,
with `tools/generate-heygen-clips.mjs`; the why and how (avatars, voices,
cost, privacy) live in `docs/HEYGEN.md`.
