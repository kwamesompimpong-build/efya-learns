/*
 * sw.js — service worker for efya-learns.
 * Pre-caches the whole app so it works fully offline once installed to a
 * home screen. Only active when the app is served over http(s) — opening
 * index.html from file:// skips service workers entirely, and the app
 * works there without one.
 *
 * Bump CACHE when shipping changes so installed devices pick them up.
 */
var CACHE = "efya-learns-v1";
var ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./progress.js",
  "./guide.js",
  "./data/content.js",
  "./manifest.webmanifest",
  "./assets/icons/icon-180.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

// Cache-first: the app is fully static, so the cache is the source of truth.
// Anything not pre-cached (e.g. optional Auntie Akosua clips) is fetched and
// then cached for next time; a miss while offline just fails silently and
// the app's own TTS fallback covers it.
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(function (hit) {
      if (hit) return hit;
      return fetch(e.request).then(function (res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        }
        return res;
      }).catch(function () {
        // Offline navigation falls back to the app shell.
        if (e.request.mode === "navigate") return caches.match("./index.html");
      });
    })
  );
});
