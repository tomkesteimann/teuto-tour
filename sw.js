/* Teuto-Tour Service Worker: App offline + Kartenkacheln */
const VERSION = 'tt-v1';
const APP_CACHE = 'tt-app-' + VERSION;
const TILE_CACHE = 'tt-tiles-v1';
const APP_FILES = [
  './', './index.html', './styles.css', './app.js', './config.js', './manifest.webmanifest',
  './vendor/leaflet/leaflet.js', './vendor/leaflet/leaflet.css',
  './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(APP_CACHE).then((c) => c.addAll(APP_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('tt-app-') && k !== APP_CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

const isTile = (url) => url.hostname.endsWith('basemaps.cartocdn.com');

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (isTile(url)) {
    e.respondWith((async () => {
      const cache = await caches.open(TILE_CACHE);
      const hit = await cache.match(req.url);
      if (hit) return hit;
      try {
        const res = await fetch(req.url, { mode: 'cors', credentials: 'omit' });
        if (res.ok) cache.put(req.url, res.clone());
        return res;
      } catch { return Response.error(); }
    })());
    return;
  }

  if (url.origin !== location.origin) return;

  // Seitenaufruf: Netz zuerst (max. 3 s), sonst Cache – so kommen Updates an, im Wald geht’s offline.
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      const cache = await caches.open(APP_CACHE);
      try {
        const res = await Promise.race([fetch(req), new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 3000))]);
        if (res && res.ok) cache.put('./index.html', res.clone());
        return res;
      } catch {
        return (await cache.match('./index.html')) || (await cache.match('./')) || Response.error();
      }
    })());
    return;
  }

  // Dateien: Cache zuerst, im Hintergrund aktualisieren
  e.respondWith((async () => {
    const cache = await caches.open(APP_CACHE);
    const hit = await cache.match(req, { ignoreSearch: true });
    const net = fetch(req).then((res) => { if (res && res.ok) cache.put(req, res.clone()); return res; }).catch(() => null);
    return hit || (await net) || Response.error();
  })());
});

// Kacheln für die Region vorladen
let prefetching = false;
self.addEventListener('message', (e) => {
  const d = e.data || {};
  if (d.type !== 'prefetch' || prefetching) return;
  prefetching = true;
  e.waitUntil((async () => {
    const cache = await caches.open(TILE_CACHE);
    const urls = d.urls || [];
    let done = 0, failed = 0, i = 0;
    const report = async () => {
      for (const c of await self.clients.matchAll()) c.postMessage({ type: 'prefetch-progress', done, failed, total: urls.length });
    };
    const worker = async () => {
      while (i < urls.length) {
        const u = urls[i++];
        try {
          if (!(await cache.match(u))) {
            const res = await fetch(u, { mode: 'cors', credentials: 'omit' });
            if (res.ok) await cache.put(u, res); else failed++;
          }
        } catch { failed++; }
        done++;
        if (done % 20 === 0 || done === urls.length) await report();
      }
    };
    await Promise.all([worker(), worker(), worker(), worker()]);
    prefetching = false;
  })());
});
