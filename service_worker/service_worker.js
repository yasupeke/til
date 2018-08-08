const SOURCE_VERSION = '1';
const CACHE_ASSETS = [
  'kids_chuunibyou_girl.png'
];

self.addEventListener('install', (event) => {
  console.log('event: install');
});

self.addEventListener('activate', (event) => {
  console.log('event: activate');

  //SOURCE_VERSIONが違ったら削除
  event.waitUntil(
    caches.keys()
      .then((cacheKeys) => {
        return Promise.all(
          cacheKeys.map(cacheKey => {
            if (cacheKey !== SOURCE_VERSION) {
              return caches.delete(cacheKey);
            }
          })
        )
      })
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // cacheするしないの分別はここで
  if (!CACHE_ASSETS.some(asset => request.url.includes(asset))) {
    console.log(`event: fetch - ignore: ${request.url}`);
    return;
  }

  event.respondWith(
    caches.open(SOURCE_VERSION)
      .then((cache) => {
        return cache.match(request)
          .then((response) => {
            if (response) {
              console.log(`event: fetch - from cache: ${request.url}`);
              return response;
            } else {
              return fetch(request.clone(), { mode: 'no-cors' })
                .then((fetchResponse) => {
                  if (!fetchResponse.ok) {
                    return fetchResponse;
                  }
                  cache.put(request, fetchResponse.clone());
                  console.log(`event: fetch - set cache: ${request.url}`)
                  return fetchResponse;
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
  );
});
