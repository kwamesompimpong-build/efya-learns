# HeyGen Exploration — A Face and Voice for Auntie Akosua

This doc explores using [HeyGen](https://www.heygen.com) (AI avatar video) to
give Auntie Akosua — the app's warm guide — a real face and voice, without
giving up the thing that makes efya-learns special: it runs **fully offline,
from a file on the iPad, with nothing about Efya ever leaving the device**.

Research notes below were verified against HeyGen's public documentation as of
**June 2026**. APIs and prices drift; check the linked sources before spending.

---

## 1. What HeyGen offers

**Video generation API.** You send text plus an avatar id and a voice id;
HeyGen renders an mp4 of the avatar speaking the text and gives you a URL to
download it. The current stable endpoint is
`POST https://api.heygen.com/v2/video/generate`
([reference](https://docs.heygen.com/reference/create-an-avatar-video-v2),
[guide](https://docs.heygen.com/docs/create-video)), authenticated with an
`X-Api-Key` header. You poll
`GET https://api.heygen.com/v1/video_status.get?video_id=...`
([reference](https://docs.heygen.com/reference/video-status)) until `status`
is `completed`, then download `video_url` (a signed link that expires — within
about 7 days — so download promptly). Any dimensions work, including the small
square 720×720 we want, and a solid background color (our soft pink `#fff0f6`)
is a one-line option.

> **API versions:** HeyGen's v1/v2 endpoints are supported through
> **October 31, 2026**; v3 (`POST /v3/videos`, with an `engine` field choosing
> Avatar IV / Avatar V) is where all new features land
> ([changelog](https://docs.heygen.com/changelog)). v2 is the best-documented,
> most-mirrored surface today, so the script uses v2 — a small update will be
> needed if we regenerate clips after October 2026.

**Avatars.** Hundreds of stock avatars (list via
`GET https://api.heygen.com/v2/avatars`,
[reference](https://docs.heygen.com/reference/list-avatars-v2)), including
many warm, friendly women — we'd browse for one that feels like an auntie.
Newer "Avatar IV" rendering is more lifelike but costs ~4× more per minute.

**Voices.** 300+ stock voices across 175+ languages and accents (list via
`GET https://api.heygen.com/v2/voices`,
[reference](https://docs.heygen.com/reference/list-voices-v2);
[voice languages](https://help.heygen.com/en/articles/11391932-voice-languages-we-support)).
Plenty of warm female English voices. I could **not** confirm a stock
Ghanaian-accent English voice from the public docs — the voice library has
accent filters, so browse it (or `--list-voices`) and listen; a West
African-accented English voice may exist via their ElevenLabs-backed library.
Caveat either way: the Twi words in Auntie Akosua's lines ("Akwaaba",
"Ayekoo", "Da yie") will be pronounced approximately by any English TTS — the
same limitation the current Web Speech voice has. Worth a one-clip test before
rendering everything.

**Pricing.** The **free API tier was removed in February 2026** — API calls
now require a pay-as-you-go API wallet (minimum **$5** top-up) or an API plan
([API pricing explained](https://help.heygen.com/en/articles/10060327-heygen-api-pricing-explained),
[api-pricing](https://www.heygen.com/api-pricing)). Rule of thumb: **~$1 per
minute** of standard avatar video (720p/1080p); **~$4/minute** for Avatar IV.
Auntie Akosua's six lines total well under two minutes, so the entire clip
library should cost **a couple of dollars** (the $5 minimum top-up covers it,
with room for retakes).

**LiveAvatar (real-time).** HeyGen's streaming product — a live avatar that
listens and responds in real time. The old Interactive Avatar /
[`@heygen/streaming-avatar`](https://www.npmjs.com/package/@heygen/streaming-avatar)
SDK is **deprecated** (sunset March 31, 2026) in favor of
[`@heygen/liveavatar-web-sdk`](https://github.com/heygen-com/liveavatar-web-sdk)
on the separate LiveAvatar platform
([intro](https://help.heygen.com/en/articles/12758516-introducing-liveavatar),
[FAQ](https://help.heygen.com/en/articles/12758866-liveavatar-faq)). It is
billed per streaming minute — roughly **$0.10–0.25/minute** depending on plan
and integration mode ($19/mo Essential ≈ 75–150 min; $99/mo ≈ 500 min) — and
requires your own backend to mint session tokens
([create session token](https://docs.liveavatar.com/reference/create_session_token_v1_sessions_token_post)).

**Photo avatars.** HeyGen can build an avatar from ordinary photos of a real
person ([Photo Avatar API](https://docs.heygen.com/docs/photo-avatars-api)):
upload photos, group them, train, then use the result like any other avatar.
So Auntie Akosua could literally have a family face (and, with voice cloning,
a family voice).

---

## 2. Three integration options

### Option A — Pre-rendered clip library ← **recommended**

Render Auntie Akosua's six lines **once**, on a parent's computer, as small
mp4 files dropped into `src/assets/guide/`. The app plays a clip when the file
exists and falls back to the device's text-to-speech voice when it doesn't.
This is already wired into the app — the only missing piece is running the
generation script with an API key.

- Keeps the app 100% offline (`file://` on the iPad), no key ever ships.
- One-time cost of a few dollars; regenerate only if the lines change.
- Nothing about Efya touches HeyGen — the inputs are six fixed sentences.

### Option B — Live LiveAvatar tutor ← future idea, not now

What it *would* enable is genuinely exciting: a real-time Auntie Akosua who
listens to Efya, answers her questions, and adapts the lesson on the fly — a
live tutor, not a recording. But it's a poor fit for this app today:

- Needs constant network; our app runs from `file://` with none.
- Needs a token server — an API key can't be shipped in a static file a
  3-year-old's iPad opens, so we'd suddenly own a backend.
- Ongoing per-minute cost (~$0.10–0.25/min) for every minute she plays.
- Streaming latency and connection hiccups are at odds with a calm,
  Montessori-paced experience for a toddler.
- Sending a child's live voice/interaction to a third-party service is a
  privacy decision of a completely different magnitude than Option A.

Revisit if the app ever grows a supervised, online "talk to Auntie" mode.

### Option C — Photo-avatar family face ← optional variant of A

Same pre-rendered architecture as Option A, but the avatar is built from
photos of a real family member (e.g. Mom or an actual auntie), optionally with
their cloned voice — the guide literally becomes family. Considerations:

- HeyGen's [moderation policy](https://www.heygen.com/moderation-policy) and
  terms require the **explicit consent of the person depicted**; create a
  photo avatar only of yourself or a consenting adult. (Full "digital twin"
  video avatars additionally go through a recorded consent-verification step.)
- **Never** create an avatar of Efya herself — don't upload a child's photos
  or voice to any AI service.
- The family member's photos/voice are uploaded to and processed by HeyGen —
  an informed trade the adult makes for themselves; review HeyGen's terms on
  likeness rights before training.
- Slightly more effort (photo upload + training) and Avatar IV-style photo
  rendering may bill at the higher rate.

### Comparison

| | A: Pre-rendered clips | B: Live LiveAvatar tutor | C: Photo-avatar clips |
|---|---|---|---|
| App stays offline? | **Yes** — clips are local files | No — network + token server | **Yes** — same as A |
| Cost model | One-time, ~$2–6 total | $0.10–0.25 per *minute*, forever | One-time, ~$2–6 (maybe Avatar IV rates) |
| Privacy | Nothing about Efya leaves device | Child's live interaction streams to HeyGen | As A, plus a consenting **adult's** likeness on HeyGen |
| Effort | Run one script | Backend + SDK + sessions | A + photo upload, training, consent |

---

## 3. How the app integrates clips (already built)

- The manifest lives in `src/data/content.js` as
  `EFYA.guide.clips = { id: { file, text } }` with
  `EFYA.guide.clipsPath = "assets/guide/"`. Six ids: `welcome`, `praise1`,
  `praise2`, `praise3`, `bloom`, `goodnight`.
- At each guide moment the app checks for the clip file under
  `src/assets/guide/`; if present it plays the video, if not it speaks the
  same `text` with the device's Web Speech voice. The folder being empty is a
  fully supported state — see `src/assets/guide/README.md`.
- The generation script reads the *same* manifest at runtime, so script and
  app can never drift apart.

## 4. How to generate the clips

1. **Get an API key.** Sign in at app.heygen.com → Settings → Subscriptions &
   API → API token. Top up the API wallet (minimum $5 — enough for the whole
   library; there are no free API credits as of Feb 2026).
2. **Pick an avatar and voice.**
   ```sh
   export HEYGEN_API_KEY=...           # on YOUR computer, never in the app
   node tools/generate-heygen-clips.mjs --list-avatars | grep -i female
   node tools/generate-heygen-clips.mjs --list-voices  | grep -i english
   ```
   Or browse with previews at app.heygen.com — look for a warm, auntie-like
   woman and a warm female voice (listen for one that won't fight the Twi
   words too badly).
3. **Preview the exact payloads** (no API calls, no cost):
   ```sh
   node tools/generate-heygen-clips.mjs --avatar <avatar_id> --voice <voice_id> --dry-run
   ```
4. **Test one clip first** (~$0.20 of credit):
   ```sh
   node tools/generate-heygen-clips.mjs --avatar <avatar_id> --voice <voice_id> --only welcome
   ```
   Open `src/assets/guide/welcome.mp4`, listen — especially to "Akwaaba" and
   "Eff-ee-ah" (the script speaks a phonetic spelling instead of the literal
   "Efya" so her name is pronounced right; tweak with `--spoken-name`).
5. **Render the rest:**
   ```sh
   node tools/generate-heygen-clips.mjs --avatar <avatar_id> --voice <voice_id>
   ```
   Existing files are skipped (`--force` re-renders). Expected total cost:
   **single-digit dollars**, dominated by retakes while choosing a voice.
6. Sync the repo to the iPad. Done — the app finds the clips by itself.

## 5. Privacy & child-safety notes

- **With pre-rendered clips, nothing about Efya ever touches HeyGen.** The
  only data sent is six fixed sentences of script text, sent once, from a
  parent's computer. No usage data, no audio, no photos, no name pronunciation
  recordings — generation is entirely parent-side and one-time.
- The app remains exactly as private as before: offline, no accounts, no
  network, clips are ordinary local mp4 files.
- The API key lives only in the parent's shell environment; it is never
  written into the repo or the app.
- If exploring Option C: only an adult's likeness, with their explicit
  consent, per HeyGen's terms — and never the child's photos or voice.
- If ever exploring Option B (live tutor): that would stream a child's
  interaction to a third party and deserves its own careful review (COPPA-type
  considerations, HeyGen's data retention, parental supervision).

## 6. Honest limitations

- **The script is untested against the live API.** No HeyGen API key was
  available in this environment, so `tools/generate-heygen-clips.mjs` has been
  syntax-checked and exercised end-to-end in `--dry-run` mode only. Endpoint
  paths, header, and payload shapes were verified against HeyGen's public
  docs and multiple real integrations as of June 2026, but expect possible
  small drifts (field renames, new required fields) on first real run.
- Direct fetching of docs.heygen.com was blocked from this environment;
  payload shapes were corroborated via search excerpts of the official docs
  and working open-source integrations rather than the raw reference pages.
- Pricing figures are point-in-time (June 2026) and HeyGen has changed its
  pricing model recently (free API tier removed Feb 2026) — re-check before
  budgeting anything beyond pocket change.
- v2 endpoints sunset October 31, 2026; regenerating clips after that means
  updating the script to v3 (`POST /v3/videos`).
- Stock voices: a Ghanaian-accented English voice was not confirmed to exist;
  Twi words will be approximated by any English voice. The clips can be
  re-rendered cheaply if a better voice appears.
