/* eslint-env serviceworker */

const VERSION = require("./package.json").version;
const URLS = process.env.FILE_LIST;

// Respond with cached resources
self.addEventListener("fetch", function (event) {
  event.respondWith(
    self.caches.match(event.request).then(function (request) {
      if (request) return request;
      return self.fetch(event.request);
    }),
  );
});

// Register worker
self.addEventListener("install", function (event) {
  event.waitUntil(
    self.caches.open(VERSION).then(function (cache) {
      return cache.addAll(URLS);
    }),
  );
});

// Remove outdated resources
self.addEventListener("activate", function (event) {
  event.waitUntil(
    self.caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key, i) {
          if (keyList[i] !== VERSION) return self.caches.delete(keyList[i]);
          return null;
        }),
      );
    }),
  );
});
