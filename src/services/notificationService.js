import { reactive } from 'vue'
import api, { idUtilisateurCourant } from './api'

/**
 * Centre de notifications : rappels d'évènements, inscriptions, annulations.
 *
 * L'état est partagé par toute l'application (cloche de l'en-tête, panneau
 * déroulant) et se rafraîchit doucement pour ménager les connexions lentes.
 */
export const etatNotifications = reactive({
  liste: [],
  nonLues: 0,
  chargement: false,
})

export async function chargerNotifications(userId = idUtilisateurCourant(), limite = 30) {
  if (!userId) return []
  etatNotifications.chargement = true
  try {
    const { data } = await api.get(`/notifications/${userId}`, { params: { limite } })
    etatNotifications.liste = data.notifications || []
    etatNotifications.nonLues = data.nonLues || 0
    return etatNotifications.liste
  } catch {
    return etatNotifications.liste
  } finally {
    etatNotifications.chargement = false
  }
}

export async function compterNonLues(userId = idUtilisateurCourant()) {
  if (!userId) return 0
  try {
    const { data } = await api.get(`/notifications/${userId}/compteur`)
    etatNotifications.nonLues = data.nonLues || 0
    return etatNotifications.nonLues
  } catch {
    return etatNotifications.nonLues
  }
}

export async function marquerLue(id) {
  await api.post(`/notifications/${id}/lu`)
  const n = etatNotifications.liste.find(x => x.id === id)
  if (n && !n.lu) {
    n.lu = true
    etatNotifications.nonLues = Math.max(0, etatNotifications.nonLues - 1)
  }
}

export async function marquerToutLu(userId = idUtilisateurCourant()) {
  if (!userId) return
  await api.post(`/notifications/${userId}/tout-lu`)
  etatNotifications.liste.forEach(n => { n.lu = true })
  etatNotifications.nonLues = 0
}

export async function supprimerNotification(id) {
  await api.delete(`/notifications/${id}`)
  const i = etatNotifications.liste.findIndex(x => x.id === id)
  if (i !== -1) {
    if (!etatNotifications.liste[i].lu) {
      etatNotifications.nonLues = Math.max(0, etatNotifications.nonLues - 1)
    }
    etatNotifications.liste.splice(i, 1)
  }
}

export async function viderNotifications(userId = idUtilisateurCourant()) {
  if (!userId) return
  await api.delete(`/notifications/utilisateur/${userId}`)
  etatNotifications.liste = []
  etatNotifications.nonLues = 0
}

let minuteur = null

/** Rafraîchit le compteur périodiquement (5 min par défaut). */
export function demarrerSuivi(userId = idUtilisateurCourant(), intervalleMs = 300000) {
  arreterSuivi()
  if (!userId) return
  compterNonLues(userId)
  minuteur = setInterval(() => compterNonLues(userId), intervalleMs)
}

export function arreterSuivi() {
  if (minuteur) clearInterval(minuteur)
  minuteur = null
}
