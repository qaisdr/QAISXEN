/* QAISXEN SW — شبكة أولاً حتى تظهر التحديثات فوراً */
const CACHE = 'qaixen-v5';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = req.url;
  // لا تلمس APIs
  if (/googleapis|groq|pollinations|wikimedia|wikipedia|duckduckgo|supabase|accounts\.google/i.test(url)) {
    return;
  }
  // HTML/JS/CSS: من الشبكة أولاً دائماً
  if (/\.(html|js|css|json)(\?|$)/i.test(url) || req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => res)
        .catch(() => caches.match(req))
    );
    return;
  }
});
