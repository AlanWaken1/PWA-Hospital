const CACHE_NAME = 'medistock-v1';
const OFFLINE_URL = '/offline';

const PRECACHE_ASSETS = [
    '/',
    '/dashboard',
    '/inventory',
    '/offline',
    '/manifest.json',
];

// Install - Precache assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Precaching assets');
            return cache.addAll(PRECACHE_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate - Clean old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch - Network first, fallback to cache
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip chrome extensions
    if (event.request.url.startsWith('chrome-extension://')) return;

    // API requests - Network only
    if (event.request.url.includes('/api/') || event.request.url.includes('supabase')) {
        event.respondWith(fetch(event.request));
        return;
    }

    // Images - Cache first
    if (event.request.destination === 'image') {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return (
                    response ||
                    fetch(event.request).then((response) => {
                        return caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, response.clone());
                            return response;
                        });
                    })
                );
            })
        );
        return;
    }

    // Pages - Network first, fallback to cache, then offline page
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Clone and cache successful responses
                if (response.status === 200) {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return response;
            })
            .catch(() => {
                // Try cache
                return caches.match(event.request).then((response) => {
                    // Return cached or offline page
                    return response || caches.match(OFFLINE_URL);
                });
            })
    );
});

// Background sync for notifications (future feature)
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-notifications') {
        console.log('[SW] Syncing notifications...');
        event.waitUntil(syncNotifications());
    }
});

async function syncNotifications() {
    // Placeholder for future implementation
    console.log('[SW] Notifications synced');
}

// Push notifications (future feature)
self.addEventListener('push', (event) => {
    console.log('[SW] Push received:', event);

    const data = event.data ? event.data.json() : {};
    const title = data.title || 'MediStock';
    const options = {
        body: data.body || 'Nueva notificación',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [200, 100, 200],
        data: data,
        actions: [
            { action: 'view', title: 'Ver' },
            { action: 'close', title: 'Cerrar' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked:', event);

    event.notification.close();

    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow(event.notification.data.url || '/')
        );
    }
});