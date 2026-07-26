/* ═══════════════════════════════════════════════════════════
   SciFi ISP — Service Worker
   Upload this file to the SAME folder as scifi-isp-system.html
   on your hosting (Netlify/Vercel/GitHub Pages/etc).

   IMPORTANT: every time you upload a new version of the HTML
   file, bump CACHE_VERSION below (e.g. 'v1' -> 'v2'). That's
   what tells browsers "something changed" so they can detect
   the update and show the in-app "Update available" prompt.
   If you forget to bump it, the update banner won't appear —
   though users will still get the latest file on their very
   next full reload either way, since fetches are network-first.
   ═══════════════════════════════════════════════════════════ */

const CACHE_VERSION = 'v1';
const CACHE_NAME = 'scifi-isp-' + CACHE_VERSION;
const APP_SHELL = ['./', './scifi-isp-system.html'];

self.addEventListener('install', (event) => {
  // Do NOT skipWaiting automatically — we want the app to control
  // when the update applies, via the "Refresh Now" button, so an
  // installed session isn't yanked out from under someone mid-task.
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL).catch(() => {}))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  // Network-first: always try to get the freshest copy: fall back to
  // the cached copy only if the network request fails (offline).
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
