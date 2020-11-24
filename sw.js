/**********************************************************************************
 *                                STARTING CACHE                                  *
 **********************************************************************************/

var cacheName = 'GinkoBusPWA-v1';
var icons = ['32', '64', '96', '128', '168', '192', '256', '512'];
var appFiles = [
    'index.html',
    'app.js',
    'style.css',
    'icons/favicon.ico',
    'icons/maskable_icon.png'
];
var icons_paths = [];
for (var i = 0; i < icons.length; i++) {
    icons_paths.push('icons/icon-' + icons[i] + '.png');
}
var contentToCache = appFiles.concat(icons_paths);


self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('[Service Worker] Caching all: app shell and content');
            return cache.addAll(contentToCache);
        })
    );
});


/**********************************************************************************
 *                                FETCHING DATA                                   *
 **********************************************************************************/


self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((r) => {
            console.log('[Service Worker] Fetching resource: ' + e.request.url);
            return r || fetch(e.request).then((response) => {
                return caches.open(cacheName).then((cache) => {
                    console.log('[Service Worker] Caching new resource: ' + e.request.url);
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});


/**********************************************************************************
 *                                 CLEAR CACHE                                    *
 **********************************************************************************/


self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== cacheName) {
                    return caches.delete(key);
                }
            }));
        })
    );
});