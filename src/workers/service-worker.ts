import {
  ActivateEvent,
  InstallEvent,
} from './webworker';

declare const serviceWorkerCachePaths: string[];
declare const name: string;
declare const version: string;

// Service worker cache part
const CACHE_NAME = `${name}-${version}`;

// Method to fetch resources
function fetchToCache(cache: Cache, request: Request) {
  // Check if we online
  if (!navigator.onLine) {
    return;
  }

  // Check if this resource is catchable
  if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') {
    return;
  }

  // Create new request if it's external request or use initial one
  const newRequest = (
      request.url.startsWith('/') ||
      request.url.startsWith(location.origin)
  ) ? request : new Request(request.url, {
    method: request.method,
    headers: request.headers,
    mode: 'no-cors',
    credentials: request.credentials,
    redirect: 'follow',
  });

  // Fetch resource
  return fetch(newRequest)
  .then((fetchResponse) => {
    // Put resource into cache if cache is open
    if (cache) {
      cache.put(request, fetchResponse.clone());
      cache.put(newRequest, fetchResponse.clone());
    }

    return fetchResponse;
  });
}

// Install life cycle event
self.addEventListener('install', () => {
  // Open cache
  caches
  .open(CACHE_NAME)
  .then((cache) => {
    // Prefetch all internal resources
    cache.addAll(serviceWorkerCachePaths
    .filter((url) => url.startsWith('/') || url.startsWith(location.origin)));

    // Prefetch all external resources
    serviceWorkerCachePaths
    .filter((url) => !(url.startsWith('/') || url.startsWith(location.origin)))
    .forEach((url) => fetchToCache(cache, new Request(url)));
  });
});

// Activate life cycle event
self.addEventListener('activate', () => {
  // Get all cache keys
  caches
  .keys()
  .then((cacheNames: string[]) => {
    // Got through all cache keys and remove old versions
    return Promise.all(
        cacheNames.map((cacheName: string) => {
          if (
              cacheName.startsWith(`${name}-`) &&
              cacheName !== CACHE_NAME
          ) {
            return caches.delete(cacheName);
          } else {
            return;
          }
        }),
    );
  });
});

// Fetch life cycle event
self.addEventListener('fetch', (event: FetchEvent) => {
  // If it's not a get request, just ignore it
  if (
      event.request.method !== 'GET'
  ) {
    return;
  }

  // Response from cache or/and refetch
  event.respondWith(
      caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache
        .match(event.request)
        .then((response) => {
          if (response) {
            fetchToCache(cache, event.request);

            return response;
          } else {
            return fetchToCache(cache, event.request);
          }
        });
      }),
  );
});
