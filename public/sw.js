const CACHE_NAME = 'focoplan-v5';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Pass through Supabase and non-GET requests
  if (event.request.url.includes('supabase') || event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);
  const isHtml = event.request.mode === 'navigate' || url.pathname === '/' || url.pathname === '/index.html' || url.pathname.includes('/landing');

  if (isHtml) {
    // Network-first for HTML pages so users always get the latest layout/code updates
    event.respondWith(
      fetch(event.request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      }).catch(() => {
        return caches.match(event.request).then((cached) => cached || caches.match('/index.html'));
      })
    );
  } else {
    // Cache-first for static assets (.js, .css, .png, etc)
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((response) => {
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => {
          // Do nothing if offline and not in cache
        });
      })
    );
  }
});
