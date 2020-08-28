importScripts('../web_modules/workbox-sw.js')

workbox.setConfig({
  modulePathPrefix: '../web_modules/',
  debug: false
})

workbox.core.setCacheNameDetails({
  prefix: 'hugoCV'
})

workbox.core.skipWaiting()

workbox.core.clientsClaim()

workbox.googleAnalytics.initialize()

// Precaching
workbox.precaching.precacheAndRoute([])

workbox.routing.registerRoute(
  /^.*\.(html|jpg|png|gif|webp|ico|svg|woff2|woff|eot|ttf|otf|ttc|json)$/,
  new workbox.strategies.StaleWhileRevalidate(),
  'GET')
