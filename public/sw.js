// Cleanup-only service worker.
//
// The previous worker precached "/" and answered every request cache-first,
// so returning visitors were served stale HTML forever. Its hashed /_astro/
// stylesheets disappeared on each redeploy and the site rendered unstyled.
// This worker exists to undo that: it deletes every cache, unregisters
// itself, and never intercepts a fetch.
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then((clients) => {
        // Reload open pages once so they pick up network-fresh HTML/CSS.
        for (const client of clients) {
          client.navigate(client.url);
        }
      })
  );
});
