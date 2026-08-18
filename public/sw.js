/* eslint-env serviceworker */

/**
 * Service worker de Parentia.
 *
 * Objectif : rester utilisable avec une connexion lente ou coupée, situation
 * courante à Madagascar.
 *
 *  - Navigation  : réseau d'abord, puis dernière page mise en cache, puis page hors ligne.
 *  - Ressources  : cache d'abord (JS, CSS, polices, images) — chargement instantané.
 *  - API (GET)   : réseau d'abord avec copie en cache, servie telle quelle si le réseau tombe.
 *
 * Les requêtes d'écriture (POST, PUT, DELETE) ne sont jamais mises en cache.
 */

const VERSION = 'parentia-v1'
const CACHE_COQUE = `${VERSION}-coque`
const CACHE_STATIQUE = `${VERSION}-statique`
const CACHE_API = `${VERSION}-api`

const PAGE_HORS_LIGNE = '/hors-ligne.html'

const A_PRECHARGER = [
  '/',
  PAGE_HORS_LIGNE,
  '/manifest.webmanifest',
  '/icon-parentia.svg',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_COQUE)
      .then(cache => cache.addAll(A_PRECHARGER).catch(() => null))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(cles => Promise.all(
        cles.filter(c => !c.startsWith(VERSION)).map(c => caches.delete(c))
      ))
      .then(() => self.clients.claim())
  )
})

/** Permet à la page de déclencher la mise à jour immédiate du worker. */
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') self.skipWaiting()
})

self.addEventListener('fetch', (event) => {
  const requete = event.request
  if (requete.method !== 'GET') return

  const url = new URL(requete.url)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return

  // Navigation : réseau d'abord pour toujours avoir la dernière version
  if (requete.mode === 'navigate') {
    event.respondWith(navigationReseauDAbord(requete))
    return
  }

  // Appels à l'API : réseau d'abord, cache en secours
  if (url.pathname.startsWith('/api/')) {
    // Les sondes de disponibilité ne doivent jamais venir du cache
    if (url.pathname === '/api/health') return
    event.respondWith(apiReseauDAbord(requete))
    return
  }

  // Ressources statiques : cache d'abord
  if (['style', 'script', 'font', 'image'].includes(requete.destination)) {
    event.respondWith(cacheDAbord(requete))
  }
})

async function navigationReseauDAbord(requete) {
  try {
    const reponse = await fetch(requete)
    const cache = await caches.open(CACHE_COQUE)
    cache.put('/', reponse.clone())
    return reponse
  } catch {
    const cache = await caches.open(CACHE_COQUE)
    return (await cache.match('/'))
      || (await cache.match(PAGE_HORS_LIGNE))
      || new Response('Hors ligne', { status: 503, headers: { 'Content-Type': 'text/plain' } })
  }
}

async function apiReseauDAbord(requete) {
  const cache = await caches.open(CACHE_API)
  try {
    const reponse = await fetch(requete)
    if (reponse.ok) cache.put(requete, reponse.clone())
    return reponse
  } catch {
    const enCache = await cache.match(requete)
    if (enCache) {
      // En-tête utile au débogage : la donnée vient du cache local
      return enCache
    }
    return new Response(
      JSON.stringify({ success: false, horsLigne: true, error: 'Hors ligne' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

async function cacheDAbord(requete) {
  const cache = await caches.open(CACHE_STATIQUE)
  const enCache = await cache.match(requete)
  if (enCache) return enCache
  try {
    const reponse = await fetch(requete)
    if (reponse.ok) cache.put(requete, reponse.clone())
    return reponse
  } catch {
    return new Response('', { status: 504 })
  }
}
