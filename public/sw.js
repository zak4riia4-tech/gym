/*
 * Minimal service worker.
 *
 * Written by hand rather than pulling in a PWA plugin: this needs to do two
 * things and nothing else, and a dependency that rewrites the build output is
 * a poor trade for forty lines.
 *
 * Strategy is network-first with a cache fallback. A gym site must never serve
 * a stale price, so the network always wins when it is available; the cache
 * only steps in when the phone is offline.
 */
const CACHE = "gofitgym-v1";
const OFFLINE_FALLBACK = "/";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.add(OFFLINE_FALLBACK)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Drop caches from older versions so a deploy is never served stale assets.
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only ever handle same-origin GETs. Never touch the admin area or any
  // Supabase call — caching a booking or a session would be a real bug.
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/admin")) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => {});
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.mode === "navigate") {
          const fallback = await caches.match(OFFLINE_FALLBACK);
          if (fallback) return fallback;
        }
        return Response.error();
      }),
  );
});
