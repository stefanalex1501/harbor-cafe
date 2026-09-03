const CACHE_NAME = "harbor-cafe-v2";
const ROOT_URL = new URL("./", self.location.href).href;
const OFFLINE_ASSETS = [
  ROOT_URL,
  new URL("harbor-cafe-logo.png", ROOT_URL).href,
  new URL("manifest.webmanifest", ROOT_URL).href,
  new URL("harbor-cafe-round-192.png", ROOT_URL).href,
  new URL("harbor-cafe-round-512.png", ROOT_URL).href,
  new URL("harbor-cafe-round-180.png", ROOT_URL).href,
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(OFFLINE_ASSETS);

    const rootResponse = await fetch(ROOT_URL);
    if (rootResponse.ok) {
      const html = await rootResponse.clone().text();
      const shellAssets = Array.from(html.matchAll(/(?:src|href)=["']([^"']+)["']/g), ([, path]) => new URL(path, ROOT_URL).href)
        .filter((url) => new URL(url).origin === self.location.origin);
      await cache.put(ROOT_URL, rootResponse);
      await cache.addAll(shellAssets);
    }

    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      ))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);
  if (event.request.method !== "GET" || requestUrl.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseCopy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(ROOT_URL, responseCopy));
          return response;
        })
        .catch(() => caches.match(ROOT_URL)),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).then((response) => {
        if (response.ok) {
          const responseCopy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseCopy));
        }
        return response;
      });
    }),
  );
});
