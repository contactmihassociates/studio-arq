/* =============================================================
   studio arq — Service Worker
   Cache-first for static assets, network-first for HTML.
   Bump CACHE_VERSION whenever you ship a major change so old
   caches are evicted on next visit.
   ============================================================= */
const CACHE_VERSION = "v1-2026-05-15";
const CACHE_STATIC  = "arq-static-" + CACHE_VERSION;
const CACHE_HTML    = "arq-html-"   + CACHE_VERSION;

const PRECACHE = [
  "/",
  "/index.html",
  "/portfolio.html",
  "/founder.html",
  "/about.html",
  "/services.html",
  "/contact.html",
  "/tools/",
  "/tools/cost-estimator.html",
  "/tools/quote.html",
  "/assets/css/styles.css",
  "/assets/js/site.js",
  "/assets/img/brand/logo.jpg",
  "/assets/img/brand/logo-mark.svg",
  "/assets/img/brand/favicon.svg",
  "/manifest.webmanifest"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_STATIC).then(function (cache) {
      return cache.addAll(PRECACHE).catch(function () { /* tolerate partial precache failures */ });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE_STATIC && k !== CACHE_HTML) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

function isHtmlRequest(req) {
  if (req.mode === "navigate") return true;
  const accept = req.headers.get("accept") || "";
  return accept.indexOf("text/html") !== -1;
}

self.addEventListener("fetch", function (event) {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Don't cache cross-origin requests (Google Fonts, WhatsApp redirects, etc.)
  if (url.origin !== self.location.origin) return;

  if (isHtmlRequest(req)) {
    // Network-first for HTML so users always see the freshest content
    event.respondWith(
      fetch(req).then(function (resp) {
        const copy = resp.clone();
        caches.open(CACHE_HTML).then(function (c) { c.put(req, copy); });
        return resp;
      }).catch(function () {
        return caches.match(req).then(function (cached) {
          return cached || caches.match("/index.html");
        });
      })
    );
    return;
  }

  // Cache-first for static assets (CSS, JS, images, fonts, manifest)
  event.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) return cached;
      return fetch(req).then(function (resp) {
        if (resp.ok) {
          const copy = resp.clone();
          caches.open(CACHE_STATIC).then(function (c) { c.put(req, copy); });
        }
        return resp;
      });
    })
  );
});
