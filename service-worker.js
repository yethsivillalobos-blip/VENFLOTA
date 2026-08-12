const CACHE_NAME = 'venflota-cache-v1';
// IMPORTANTE: Cambiaremos esta URL cuando Render te dé el link de tu servidor
const API_URL = 'https://TU_API_EN_RENDER.onrender.com/api/v1'; 

const ASSETS_TO_CACHE = [
  '/',
  '/venflota.html'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) return;
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-datos-venflota') {
    event.waitUntil(sincronizarPendientes());
  }
});

async function sincronizarPendientes() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('VenFlotaLocalDB', 1);
    request.onsuccess = async (e) => {
      const db = e.target.result;
      const tx = db.transaction('guardias', 'readwrite');
      const store = tx.objectStore('guardias');
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = async () => {
        const registros = getAllRequest.result;
        if (registros.length === 0) return resolve();

        for (const registro of registros) {
          if (!registro.synced) {
            try {
              const res = await fetch(`${API_URL}/guardias/iniciar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registro)
              });

              if (res.ok) {
                const txDelete = db.transaction('guardias', 'readwrite');
                txDelete.objectStore('guardias').delete(registro.id);
              }
            } catch (err) {
              console.error('Fallo al sincronizar:', err);
            }
          }
        }
        resolve();
      };
    };
    request.onerror = () => reject('Error BD local');
  });
}
