const CACHE_NAME = 'portal-upq-v1';

// Recursos estáticos iniciales a cachear en instalación
const STATIC_ASSETS = [
    '/',
    '/home',
    '/manifest.json',
    '/UPQ-Logo.png',
];

self.addEventListener('install', (event) => {
    // Forzar activación inmediata
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Precaching app shell');
            return cache.addAll(STATIC_ASSETS);
        })
    );
});

self.addEventListener('activate', (event) => {
    // Tomar control inmediato de clientes abiertos
    event.waitUntil(self.clients.claim());

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Borrando caché antigua:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);

    // Estrategia Network-First para la API (asegurando datos frescos)
    if (requestUrl.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    // Fallback para API si hay error de red (retornamos caché previa si existe)
                    return caches.match(event.request);
                })
        );
        return;
    }

    // Estrategia Cache-First para recursos locales (imágenes, CSS, JS)
    if (
        requestUrl.origin === location.origin &&
        (requestUrl.pathname.startsWith('/_next/static/') ||
         requestUrl.pathname.match(/\.(png|jpg|jpeg|svg|css)$/))
    ) {
        event.respondWith(
            caches.match(event.request).then((response) => {
                if (response) return response;

                return fetch(event.request).then((networkResponse) => {
                    // Clones response to save to cache
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                    return networkResponse;
                });
            })
        );
        return;
    }

    // Estrategia Stale-While-Revalidate para navegación general (HTML/Next.js pages)
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                const responseClone = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseClone);
                });
                return networkResponse;
            }).catch(() => {
                // If offline and page not cached, optionally return an offline standard page
                return cachedResponse;
            });

            return cachedResponse || fetchPromise;
        })
    );
});
