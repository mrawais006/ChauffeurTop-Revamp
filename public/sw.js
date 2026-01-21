// ChauffeurTop Service Worker for PWA + Push Notifications
const CACHE_NAME = 'chauffeurtop-admin-v1';
const OFFLINE_URL = '/admin';

// Assets to cache for offline support
const STATIC_ASSETS = [
  '/admin',
  '/logo/fav.ico',
  '/logo/CT Logo-02.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip non-http(s) requests
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response for caching
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          // Only cache successful responses
          if (response.status === 200) {
            cache.put(event.request, responseClone);
          }
        });
        return response;
      })
      .catch(() => {
        // Return cached version if available
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // For navigation requests, return the offline page
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
          return new Response('Offline', { status: 503 });
        });
      })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  let data = {
    title: 'ChauffeurTop',
    body: 'You have a new notification',
    icon: '/logo/fav.ico',
    badge: '/logo/fav.ico',
    tag: 'chauffeurtop-notification',
    url: '/admin'
  };

  try {
    if (event.data) {
      const payload = event.data.json();
      data = { ...data, ...payload };
    }
  } catch (e) {
    console.error('[SW] Error parsing push data:', e);
  }

  const options = {
    body: data.body,
    icon: data.icon || '/logo/fav.ico',
    badge: data.badge || '/logo/fav.ico',
    tag: data.tag || 'chauffeurtop-notification',
    vibrate: [200, 100, 200],
    requireInteraction: true,
    actions: [
      { action: 'view', title: 'View Details' },
      { action: 'dismiss', title: 'Dismiss' }
    ],
    data: {
      url: data.url || '/admin',
      timestamp: Date.now()
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/admin';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url.includes('/admin') && 'focus' in client) {
          client.navigate(urlToOpen);
          return client.focus();
        }
      }
      // Open new window if none exists
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Background sync for offline actions (future enhancement)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
});

console.log('[SW] Service worker loaded');
