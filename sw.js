const CACHE = 'trip-v3';
const BASE = 'https://futuriztaos.github.io/trip-2026';

// Pre-cache: app shell + all ticket images (so they work offline / in tunnels)
const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  // ── Mar 20 tickets ──
  BASE + '/tickets/alex-reg22910.jpg',
  BASE + '/tickets/alex-ic666.jpg',
  BASE + '/tickets/alex-reg2828.jpg',
  BASE + '/tickets/ky-reg22910.jpg',
  BASE + '/tickets/ky-ic666.jpg',
  BASE + '/tickets/ky-reg2828.jpg',
  BASE + '/tickets/alex-rio-varenna.pdf',
  BASE + '/tickets/ky-rio-varenna.pdf',
  // ── Mar 21 tickets ──
  BASE + '/tickets/alex-reg2827.jpg',
  BASE + '/tickets/alex-re25522.jpg',
  BASE + '/tickets/alex-sbb.jpg',
  BASE + '/tickets/ky-reg2827.jpg',
  BASE + '/tickets/ky-re25522.jpg',
  BASE + '/tickets/ky-sbb.jpg',
  BASE + '/tickets/varenna-luzern.pdf',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first, fallback to cache
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
