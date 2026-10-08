const CACHE_PREFIX = "harbor-cafe-";
const CACHE_NAME = `${CACHE_PREFIX}v3`;
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
          .filter((cacheName) => cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME)
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
          // Never replace the offline homepage with a missing-page response.
          const rootPath = new URL(ROOT_URL).pathname;
          if (response.ok && [rootPath, `${rootPath}index.html`].includes(requestUrl.pathname)) {
            const responseCopy = response.clone();
            event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(ROOT_URL, responseCopy)));
          }
          return response;
        })
        .catch(() => caches.open(CACHE_NAME).then((cache) => cache.match(ROOT_URL))),
    );
    return;
  }

  const cache = caches.open(CACHE_NAME);
  const fetchAndCache = () => fetch(event.request, { cache: "no-cache" }).then((response) => {
    if (response.ok) {
      const responseCopy = response.clone();
      event.waitUntil(cache.then((storage) => storage.put(event.request, responseCopy)));
    }
    return response;
  });
  // Vite's fingerprinted bundles are immutable. Photos, logos and manifests
  // have stable URLs and must be checked online before using an old copy.
  const immutable = /\/assets\/[^/]+-[\w-]{8,}\.(?:js|css)$/.test(requestUrl.pathname);
  event.respondWith(immutable
    ? cache.then((storage) => storage.match(event.request)).then((cached) => cached || fetchAndCache())
    : fetchAndCache().catch(async (error) => {
      const cached = await (await cache).match(event.request);
      if (cached) return cached;
      throw error;
    }),
  );
});
