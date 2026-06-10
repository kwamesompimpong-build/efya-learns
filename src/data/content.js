/*
 * content.js — runtime content for efya-learns.
 *
 * This is the single source the app reads at runtime. It is the JS mirror of
 * the data specs in letters.json and numbers.json (which stay as the readable,
 * documented data spec), plus the Dreamland/sleep content. We use a JS file
 * instead of fetch()-ing the JSON so the app runs by simply opening index.html
 * on a tablet — no local server, no build step, no network.
 *
 * Emoji stand in for art so the whole experience works with zero asset files.
 * Real Adinkra/kente artwork can replace these later without touching app.js.
 *
 * guide.clips lists OPTIONAL pre-rendered HeyGen video clips of the guide,
 * "Auntie Akosua". If a clip file exists under guide.clipsPath it plays in a
 * small bubble; if not (the normal case), guide.js speaks the clip's `text`
 * via TTS instead. The app never requires the videos to be present.
 */
window.EFYA = {
  // Akan/Twi greeting shown on the home screen. "Akwaaba" = welcome.
  greeting: { twi: "Akwaaba, Efya!", english: "Welcome, Efya!" },

  // A–Z. Each letter pairs with a Ghanaian-themed word, its meaning, an emoji
  // (stands in for art), and a phonetic "sound" for gentle phonics.
  letters: [
    { letter: "A", sound: "ah", word: "Akwaaba", meaning: "Welcome (Twi greeting)", emoji: "👋" },
    { letter: "B", sound: "buh", word: "Banku", meaning: "A Ghanaian dish", emoji: "🍲" },
    { letter: "C", sound: "kuh", word: "Cocoa", meaning: "Ghana grows cocoa", emoji: "🍫" },
    { letter: "D", sound: "duh", word: "Drum", meaning: "A talking drum", emoji: "🥁" },
    { letter: "E", sound: "eh", word: "Efya", meaning: "That's you!", emoji: "👧🏾" },
    { letter: "F", sound: "fuh", word: "Fufu", meaning: "A Ghanaian dish", emoji: "🥣" },
    { letter: "G", sound: "guh", word: "Ghana", meaning: "Your heritage", emoji: "🇬🇭" },
    { letter: "H", sound: "huh", word: "Highlife", meaning: "Music to dance to", emoji: "🎶" },
    { letter: "I", sound: "ih", word: "Igloo", meaning: "A house of snow", emoji: "❄️" },
    { letter: "J", sound: "juh", word: "Jollof", meaning: "Jollof rice", emoji: "🍚" },
    { letter: "K", sound: "kuh", word: "Kente", meaning: "Woven cloth", emoji: "🧶" },
    { letter: "L", sound: "luh", word: "Lion", meaning: "A brave animal", emoji: "🦁" },
    { letter: "M", sound: "muh", word: "Maame", meaning: "Mother (Twi)", emoji: "👩🏾" },
    { letter: "N", sound: "nuh", word: "Nana", meaning: "Grandparent or chief", emoji: "👵🏾" },
    { letter: "O", sound: "oh", word: "Okra", meaning: "A green vegetable", emoji: "🥬" },
    { letter: "P", sound: "puh", word: "Plantain", meaning: "A tasty fruit", emoji: "🍌" },
    { letter: "Q", sound: "kwuh", word: "Queen", meaning: "A royal leader", emoji: "👑" },
    { letter: "R", sound: "ruh", word: "Rice", meaning: "For jollof!", emoji: "🍚" },
    { letter: "S", sound: "suh", word: "Sankofa", meaning: "An Adinkra symbol", emoji: "🕊️" },
    { letter: "T", sound: "tuh", word: "Talking drum", meaning: "Makes rhythms", emoji: "🪘" },
    { letter: "U", sound: "uh", word: "Umbrella", meaning: "For the rain", emoji: "☂️" },
    { letter: "V", sound: "vuh", word: "Village", meaning: "Where people live", emoji: "🛖" },
    { letter: "W", sound: "wuh", word: "Water", meaning: "We drink water", emoji: "💧" },
    { letter: "X", sound: "ks", word: "Xylophone", meaning: "Gyil, a Ghanaian xylophone", emoji: "🎼" },
    { letter: "Y", sound: "yuh", word: "Yam", meaning: "A root vegetable", emoji: "🍠" },
    { letter: "Z", sound: "zuh", word: "Zebra", meaning: "Black and white stripes", emoji: "🦓" }
  ],

  // 0–10. Count the real objects first (concrete), then meet the numeral
  // (abstract) — the Montessori "Count With Me" flow. Twi names included.
  numbers: [
    { number: 0, name: "zero", twi: "hwee", object: "empty basket", emoji: "🧺" },
    { number: 1, name: "one", twi: "baako", object: "drum", emoji: "🥁" },
    { number: 2, name: "two", twi: "mmienu", object: "plantains", emoji: "🍌" },
    { number: 3, name: "three", twi: "mmiensa", object: "cocoa pods", emoji: "🍫" },
    { number: 4, name: "four", twi: "anan", object: "kente strips", emoji: "🧶" },
    { number: 5, name: "five", twi: "anum", object: "yams", emoji: "🍠" },
    { number: 6, name: "six", twi: "nsia", object: "mangoes", emoji: "🥭" },
    { number: 7, name: "seven", twi: "nson", object: "okra", emoji: "🥬" },
    { number: 8, name: "eight", twi: "nwotwe", object: "beads", emoji: "📿" },
    { number: 9, name: "nine", twi: "nkron", object: "shells", emoji: "🐚" },
    { number: 10, name: "ten", twi: "du", object: "stars", emoji: "⭐" }
  ],

  // The order new plants sprout in the Learning Garden — what nextUp() serves.
  // E-F-Y-A first: she learns her own name's letters before anything else.
  // (Display order everywhere stays A–Z / 0–10; this only drives what's NEXT.)
  learnOrder: {
    letters: ["E", "F", "Y", "A", "S", "M", "T", "C", "P", "N", "I", "D", "G",
              "O", "B", "H", "R", "U", "L", "W", "J", "K", "Q", "V", "X", "Z"],
    numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0]
  },

  // Auntie Akosua, the guide. Clips are optional pre-rendered HeyGen videos
  // (relative to src/); each falls back to its `text` spoken via TTS.
  guide: {
    name: "Auntie Akosua",
    emoji: "🌺",
    clipsPath: "assets/guide/",
    clips: {
      welcome: { file: "welcome.mp4", text: "Akwaaba, Efya! Let's learn and grow today!" },
      praise1: { file: "praise1.mp4", text: "Ayekoo! Well done!" },
      praise2: { file: "praise2.mp4", text: "Wonderful! You did it!" },
      praise3: { file: "praise3.mp4", text: "I am so proud of you!" },
      bloom: { file: "bloom.mp4", text: "Your flower bloomed! You are growing so big!" },
      goodnight: { file: "goodnight.mp4", text: "Good night, brave girl. Da yie. Sleep well in your own cozy bed." }
    }
  },

  // Dreamland — the bedtime feature that gently encourages Efya to sleep in her
  // own bed all night. Built on positive reinforcement (a morning star chart),
  // a calming wind-down, and affirmations tuned to her personality. Each star
  // is an Adinkra symbol with a meaning a 3-year-old can grow into.
  dreamland: {
    // Adinkra "sleep stars" she collects, one per night she stays in her bed.
    stars: [
      { symbol: "✦", adinkra: "Dwennimmen", meaning: "strength — strong and brave like a ram" },
      { symbol: "❤", adinkra: "Akoma", meaning: "patience — a calm, patient heart" },
      { symbol: "✺", adinkra: "Nyame Dua", meaning: "you are safe and watched over" },
      { symbol: "↺", adinkra: "Sankofa", meaning: "morning always comes back" },
      { symbol: "✶", adinkra: "Gye Nyame", meaning: "nothing to fear in the dark" },
      { symbol: "❉", adinkra: "Fawohodie", meaning: "independence — you did it yourself" },
      { symbol: "✸", adinkra: "Nkyinkyim", meaning: "you are growing so big" }
    ],
    // Spoken during wind-down. Each affirmation leans on one of Efya's traits so
    // her own personality becomes the reason she can do this.
    affirmations: [
      "Akwaaba to Dreamland, Efya.",
      "Efya is brave. Her own bed is a cozy adventure ship sailing to morning.",
      "Efya is strong and can do hard things, all by herself.",
      "Efya snuggles under her soft pink blanket.",
      "Efya's room is calm and safe. The stars are watching over her.",
      "If Efya wakes up, she gives her pillow a squeeze and stays in her own big-girl bed.",
      "In the morning, the sun says good morning and Efya earns a star.",
      "Good night, brave girl. Da yie — sleep well."
    ],
    // Spoken in the morning when she's celebrated for staying in her bed.
    morningCheers: [
      "Maakye, Efya! Good morning!",
      "You stayed in your own bed all night. You are so strong!",
      "Here is your Adinkra star. You earned it.",
      "Fawohodie — you did it all by yourself!"
    ],
    streakCheers: {
      3: "Three nights in a row! Efya is a Dreamland champion!",
      5: "Five stars! Your sleep chart is shining!",
      7: "A whole week of stars! Efya sleeps in her own bed like a big girl!"
    }
  }
};
