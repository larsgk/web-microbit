/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "bundles/webcomponents-ce.js",
    "revision": "16a6e231db0f767f82644d8cfa072ba0"
  },
  {
    "url": "bundles/webcomponents-sd-ce-pf.js",
    "revision": "fd3b6605f07e1064b91fe11db4b62cc3"
  },
  {
    "url": "bundles/webcomponents-sd-ce.js",
    "revision": "4a6d6a659c67d2ec5eeff15cf12566d6"
  },
  {
    "url": "bundles/webcomponents-sd.js",
    "revision": "47d6162abb84f5f98b5913a78a6d40b4"
  },
  {
    "url": "images/icon-144.png",
    "revision": "1f9dad225647d99653013a346506ae3c"
  },
  {
    "url": "images/icon-192.png",
    "revision": "f9a930e84843d0ad052ab3be9615bcf9"
  },
  {
    "url": "images/icon-32.png",
    "revision": "d1ebc5b564dfdf05b6a7baac66489e68"
  },
  {
    "url": "images/icon-48.png",
    "revision": "9499e96aa78b57794610727e89176924"
  },
  {
    "url": "images/icon-512.png",
    "revision": "9b8bbd316aadd152ed5bd2364f6f16c5"
  },
  {
    "url": "images/icon-72.png",
    "revision": "6d287044c92e3fba91df3abfad5aff01"
  },
  {
    "url": "images/icon-96.png",
    "revision": "7d8a5fdfb0241138f58ac1a21cb9f51c"
  },
  {
    "url": "index.html",
    "revision": "e22a6a498adb3b18dc005b555365734f"
  },
  {
    "url": "index.js",
    "revision": "cecccf440ccb46284a42e0706a893f4f"
  },
  {
    "url": "manifest.json",
    "revision": "8ad9617d4208351bfcef3b278d2f5fd2"
  },
  {
    "url": "webcomponents-loader.js",
    "revision": "e044a63e034bf10304dad73138b8c74b"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
