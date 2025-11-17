// public/sw.js - Service Worker para Next.js 14+ (App Router)
const CACHE_NAME = 'medistock-v3';
const OFFLINE_URL = '/offline';

// Rutas que SIEMPRE deben estar disponibles offline
const STATIC_CACHE = [
    '/',
    '/offline',
    '/dashboard',
    '/inventory',
    '/alerts',
    '/analytics',
    '/reports',
    '/settings',
    '/help',
    '/staff',
];

// Install - Pre-cache páginas críticas
self.addEventListener('install', (event) => {
    console.log('[SW] Instalando Service Worker v3 para Next.js...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Cacheando páginas críticas...');
                // Usar addAll con { mode: 'no-cors' } para evitar errores
                return Promise.all(
                    STATIC_CACHE.map(url => {
                        return cache.add(url).catch(err => {
                            console.warn('[SW] No se pudo cachear:', url, err);
                        });
                    })
                );
            })
            .catch(err => {
                console.error('[SW] Error en install:', err);
            })
    );
    self.skipWaiting();
});

// Activate - Limpiar cachés viejos
self.addEventListener('activate', (event) => {
    console.log('[SW] Activando Service Worker v3...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Eliminando caché antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch - Estrategia inteligente
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Solo manejar GET requests
    if (request.method !== 'GET') return;

    // Ignorar extensiones del navegador
    if (url.protocol === 'chrome-extension:') return;

    // === SUPABASE / API REQUESTS ===
    // Network only - NO cachear APIs
    if (
        url.hostname.includes('supabase') ||
        url.pathname.startsWith('/api/') ||
        url.pathname.includes('/__nextjs')
    ) {
        event.respondWith(
            fetch(request).catch(() => {
                // Si falla, retornar error JSON
                return new Response(
                    JSON.stringify({
                        error: 'No hay conexión a internet',
                        offline: true
                    }),
                    {
                        status: 503,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
            })
        );
        return;
    }

    // === NEXT.JS STATIC FILES ===
    // Cache first para _next/static
    if (url.pathname.startsWith('/_next/static/')) {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached;

                return fetch(request).then((response) => {
                    if (response.status === 200) {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseToCache);
                        });
                    }
                    return response;
                });
            })
        );
        return;
    }

    // === IMÁGENES ===
    if (
        request.destination === 'image' ||
        url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/)
    ) {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached;

                return fetch(request).then((response) => {
                    if (response.status === 200) {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseToCache);
                        });
                    }
                    return response;
                }).catch(() => {
                    // Retornar imagen placeholder transparente
                    return new Response('', { status: 404 });
                });
            })
        );
        return;
    }

    // === NAVEGACIÓN (HTML PAGES) ===
    // Esta es la parte CRÍTICA para Next.js
    if (request.mode === 'navigate' || request.destination === 'document') {
        event.respondWith(
            // Intenta network primero
            fetch(request)
                .then((response) => {
                    // Solo cachear respuestas exitosas
                    if (response.status === 200 || response.status === 304) {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseToCache);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Si falla network, intenta caché
                    return caches.match(request).then((cached) => {
                        if (cached) {
                            console.log('[SW] Sirviendo desde caché:', request.url);
                            return cached;
                        }

                        // Si no hay en caché, intenta index como fallback para rutas de Next.js
                        return caches.match('/').then((indexCached) => {
                            if (indexCached) {
                                console.log('[SW] Sirviendo index como fallback');
                                return indexCached;
                            }

                            // Último recurso: página offline
                            return caches.match(OFFLINE_URL).then((offlineCached) => {
                                if (offlineCached) {
                                    console.log('[SW] Sirviendo página offline');
                                    return offlineCached;
                                }

                                // Si nada funciona, HTML básico
                                return new Response(
                                    `<!DOCTYPE html>
                  <html>
                    <head>
                      <meta charset="utf-8">
                      <title>Offline - MediStock</title>
                      <meta name="viewport" content="width=device-width, initial-scale=1">
                      <style>
                        body {
                          font-family: system-ui, -apple-system, sans-serif;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          min-height: 100vh;
                          margin: 0;
                          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                          color: white;
                          text-align: center;
                          padding: 20px;
                        }
                        .container {
                          max-width: 400px;
                        }
                        h1 { font-size: 48px; margin: 0 0 20px; }
                        p { font-size: 18px; opacity: 0.9; margin-bottom: 30px; }
                        button {
                          background: white;
                          color: #667eea;
                          border: none;
                          padding: 12px 24px;
                          border-radius: 8px;
                          font-size: 16px;
                          font-weight: bold;
                          cursor: pointer;
                        }
                        button:hover { transform: scale(1.05); }
                      </style>
                    </head>
                    <body>
                      <div class="container">
                        <h1>📴</h1>
                        <h2>Sin Conexión</h2>
                        <p>No hay conexión a internet en este momento. Por favor verifica tu conexión.</p>
                        <button onclick="location.reload()">Reintentar</button>
                      </div>
                    </body>
                  </html>`,
                                    {
                                        status: 503,
                                        headers: { 'Content-Type': 'text/html; charset=utf-8' }
                                    }
                                );
                            });
                        });
                    });
                })
        );
        return;
    }

    // === OTROS RECURSOS (CSS, JS, Fonts) ===
    // Cache first con network fallback
    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) return cached;

            return fetch(request).then((response) => {
                if (response.status === 200) {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseToCache);
                    });
                }
                return response;
            }).catch(() => {
                // Si todo falla, retornar respuesta vacía
                return new Response('', { status: 404 });
            });
        })
    );
});

// Background Sync
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync:', event.tag);

    if (event.tag === 'sync-pending-actions') {
        event.waitUntil(
            Promise.resolve().then(() => {
                console.log('[SW] Sincronizando acciones pendientes...');
            })
        );
    }
});

// Push Notifications
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'MediStock';
    const options = {
        body: data.body || 'Nueva notificación',
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        data: data.data || {}
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});