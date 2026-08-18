import axios from 'axios'
import { reactive } from 'vue'

/**
 * Point d'entrée unique du frontend vers le backend Parentia.
 *
 * Toute l'application passe par ce fichier : plus aucune URL n'est écrite en dur
 * dans les pages. Au démarrage, le module choisit tout seul sa cible :
 *
 *   1. un mode forcé par l'utilisateur (menu « Connexion ») ou par .env est prioritaire ;
 *   2. sinon, si un backend tourne en local, c'est lui qui est utilisé ;
 *   3. sinon, on bascule sur le backend déployé (Render).
 *
 * Le choix est mémorisé pour la session afin de ne pas re-sonder à chaque page.
 */

/** Backend local (développement). */
export const LOCAL_ROOT = import.meta.env?.VITE_API_LOCAL || 'http://localhost:8082'

/** Backend déployé (production). */
export const ONLINE_ROOT = import.meta.env?.VITE_API_ONLINE || 'https://parentia.onrender.com'

/** Frontend déployé — utilisé pour les liens de partage. */
export const SITE_URL = import.meta.env?.VITE_SITE_URL || 'https://parentia-ten.vercel.app'

const CLE_MODE = 'parentia:apiMode'       // 'auto' | 'local' | 'online'
const CLE_DERNIER = 'parentia:apiDernier' // dernière base qui a répondu

/** État observable de la connexion, affiché dans l'interface. */
export const connexion = reactive({
  mode: 'auto',        // mode demandé
  actif: 'online',     // 'local' | 'online' : ce qui est réellement utilisé
  racine: ONLINE_ROOT, // racine du backend actif
  resolu: false,       // la détection a-t-elle eu lieu ?
  enLigne: typeof navigator !== 'undefined' ? navigator.onLine : true,
  base: null,          // informations sur la base de données (via /api/status)
  erreur: '',
})

/** Base de l'API. Liaison ESM vivante : les pages voient la valeur à jour. */
export let API_ROOT = ONLINE_ROOT
export let API_BASE_URL = `${ONLINE_ROOT}/api`
export let WS_URL = `${ONLINE_ROOT}/ws`

function appliquer(racine, actif) {
  API_ROOT = racine
  API_BASE_URL = `${racine}/api`
  WS_URL = `${racine}/ws`
  api.defaults.baseURL = API_BASE_URL
  connexion.racine = racine
  connexion.actif = actif
  try { localStorage.setItem(CLE_DERNIER, racine) } catch { /* stockage indisponible */ }
}

/** Instance axios partagée par tous les services. */
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

/** Sonde /api/health : rapide, sans accès base de données. */
async function repond(racine, delai = 2500) {
  try {
    const controleur = new AbortController()
    const minuteur = setTimeout(() => controleur.abort(), delai)
    const reponse = await fetch(`${racine}/api/health`, {
      signal: controleur.signal,
      cache: 'no-store',
    })
    clearTimeout(minuteur)
    return reponse.ok
  } catch {
    return false
  }
}

/** Mode demandé : localStorage, puis .env, puis « auto ». */
export function modeDemande() {
  try {
    const stocke = localStorage.getItem(CLE_MODE)
    if (stocke) return stocke
  } catch { /* stockage indisponible */ }
  return import.meta.env?.VITE_API_MODE || 'auto'
}

/** Force le mode et recharge la page pour repartir sur une base saine. */
export function definirMode(mode) {
  try { localStorage.setItem(CLE_MODE, mode) } catch { /* stockage indisponible */ }
  connexion.mode = mode
  connexion.resolu = false
  return resoudreApi(true)
}

let resolution = null

/**
 * Détermine la racine du backend à utiliser.
 * Le résultat est mis en cache : les appels suivants sont immédiats.
 */
export function resoudreApi(forcer = false) {
  if (forcer) resolution = null
  if (!resolution) resolution = detecter()
  return resolution
}

async function detecter() {
  const mode = modeDemande()
  connexion.mode = mode

  if (mode === 'local') {
    appliquer(LOCAL_ROOT, 'local')
    connexion.resolu = true
    lireStatut()
    return API_BASE_URL
  }
  if (mode === 'online') {
    appliquer(ONLINE_ROOT, 'online')
    connexion.resolu = true
    lireStatut()
    return API_BASE_URL
  }

  // Mode automatique : le backend local est prioritaire pendant le développement.
  const surMachineLocale = typeof window !== 'undefined'
    && ['localhost', '127.0.0.1'].includes(window.location.hostname)

  const candidats = surMachineLocale
    ? [[LOCAL_ROOT, 'local'], [ONLINE_ROOT, 'online']]
    : [[ONLINE_ROOT, 'online'], [LOCAL_ROOT, 'local']]

  for (const [racine, etiquette] of candidats) {
    if (await repond(racine, etiquette === 'local' ? 1500 : 6000)) {
      appliquer(racine, etiquette)
      connexion.resolu = true
      connexion.erreur = ''
      lireStatut()
      return API_BASE_URL
    }
  }

  // Aucun backend ne répond : on garde la dernière base connue pour permettre
  // au mode hors ligne (cache du service worker) de servir les données.
  let secours = ONLINE_ROOT
  try { secours = localStorage.getItem(CLE_DERNIER) || ONLINE_ROOT } catch { /* ignore */ }
  appliquer(secours, secours === LOCAL_ROOT ? 'local' : 'online')
  connexion.resolu = true
  connexion.erreur = "Aucun serveur ne répond — affichage des données enregistrées."
  return API_BASE_URL
}

/** Récupère le mode de base de données choisi par le backend (/api/status). */
export async function lireStatut() {
  try {
    const { data } = await api.get('/status', { timeout: 8000 })
    connexion.base = data?.database || null
    return data
  } catch {
    connexion.base = null
    return null
  }
}

// --- Suivi réseau du navigateur ---
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    connexion.enLigne = true
    resoudreApi(true)
  })
  window.addEventListener('offline', () => { connexion.enLigne = false })
}

/**
 * Mode « économie de données » : utile sur les connexions mobiles malgaches.
 * Quand il est actif, l'interface évite les images lourdes et les rechargements
 * automatiques.
 */
const CLE_ECONOMIE = 'parentia:economie'
export const economie = reactive({
  actif: (() => {
    try {
      const stocke = localStorage.getItem(CLE_ECONOMIE)
      if (stocke !== null) return stocke === '1'
    } catch { /* ignore */ }
    // Activé d'office si le navigateur signale une connexion lente
    const c = typeof navigator !== 'undefined' ? navigator.connection : null
    return !!(c && (c.saveData || ['slow-2g', '2g'].includes(c.effectiveType)))
  })(),
})

export function basculerEconomie(valeur = !economie.actif) {
  economie.actif = valeur
  try { localStorage.setItem(CLE_ECONOMIE, valeur ? '1' : '0') } catch { /* ignore */ }
  return economie.actif
}

// --- Utilisateur connecté (source unique de vérité) ---

export function utilisateurCourant() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null')
  } catch {
    return null
  }
}

export function idUtilisateurCourant() {
  const u = utilisateurCourant()
  return u && u.id ? u.id : null
}

/** Construit une URL absolue vers le backend (fichiers, exports…). */
export function urlApi(chemin = '') {
  return `${API_BASE_URL}${chemin.startsWith('/') ? chemin : '/' + chemin}`
}

export default api
