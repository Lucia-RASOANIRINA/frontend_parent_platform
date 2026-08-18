import api, { API_BASE_URL, urlApi, utilisateurCourant, idUtilisateurCourant } from './api'

/**
 * Évènements, ateliers et conférences.
 * Toutes les requêtes passent par l'instance partagée : la bascule
 * local ↔ en ligne est donc automatique.
 */

// Ré-exports historiques (utilisés par d'anciennes pages)
export { API_BASE_URL }
export const getCurrentUser = utilisateurCourant
export const getCurrentUserId = idUtilisateurCourant

/** Retire les critères vides pour garder des URL lisibles. */
function nettoyer(criteres = {}) {
  const params = {}
  Object.entries(criteres).forEach(([cle, valeur]) => {
    if (valeur === '' || valeur === null || valeur === undefined) return
    params[cle] = valeur
  })
  return params
}

/**
 * Liste filtrée des évènements.
 * Critères : q, type, region, ville, langue, online, statut,
 * placesDisponibles, gratuit, mesInscriptions, mesCreations, du, au, tri.
 */
export async function fetchEvenements({ userId = idUtilisateurCourant(), all = false, ...criteres } = {}) {
  const { data } = await api.get('/evenements', { params: nettoyer({ userId, all, ...criteres }) })
  return data.evenements || []
}

/** Espace conférences : même moteur de filtrage, limité au type « conference ». */
export async function fetchConferences({ userId = idUtilisateurCourant(), all = false, ...criteres } = {}) {
  const { data } = await api.get('/evenements/conferences', { params: nettoyer({ userId, all, ...criteres }) })
  return data.evenements || []
}

/** Valeurs proposées dans les menus de filtres (régions, villes, types…). */
export async function fetchFiltres(all = false) {
  const { data } = await api.get('/evenements/filtres', { params: { all } })
  return data
}

export async function fetchEvenement(id, userId = idUtilisateurCourant()) {
  const { data } = await api.get(`/evenements/${id}`, { params: nettoyer({ userId }) })
  return data.evenement
}

export async function fetchMesEvenements(userId = idUtilisateurCourant()) {
  const { data } = await api.get(`/evenements/mine/${userId}`)
  return data.evenements || []
}

export async function createEvenement(payload, userId = idUtilisateurCourant()) {
  const { data } = await api.post('/evenements', payload, { params: nettoyer({ userId }) })
  return data.evenement
}

export async function updateEvenement(id, payload, userId = idUtilisateurCourant()) {
  const { data } = await api.put(`/evenements/${id}`, payload, { params: nettoyer({ userId }) })
  return data.evenement
}

export async function deleteEvenement(id) {
  const { data } = await api.delete(`/evenements/${id}`)
  return data
}

/** Annule sans supprimer : les inscrits reçoivent une notification. */
export async function annulerEvenement(id, motif = '') {
  const { data } = await api.post(`/evenements/${id}/annuler`, { motif })
  return data.evenement
}

export async function reactiverEvenement(id) {
  const { data } = await api.post(`/evenements/${id}/reactiver`)
  return data.evenement
}

/** Duplique un évènement récurrent à une nouvelle date (copie non publiée). */
export async function dupliquerEvenement(id, date = null, userId = idUtilisateurCourant()) {
  const { data } = await api.post(`/evenements/${id}/dupliquer`, { date }, { params: nettoyer({ userId }) })
  return data.evenement
}

/** Lien de téléchargement du fichier calendrier (.ics). */
export function urlCalendrier(id) {
  return urlApi(`/evenements/${id}/calendrier.ics`)
}

export async function inscrireEvenement(id, userId = idUtilisateurCourant()) {
  const { data } = await api.post(`/evenements/${id}/inscription`, null, { params: { userId } })
  return data
}

export async function desinscrireEvenement(id, userId = idUtilisateurCourant()) {
  const { data } = await api.delete(`/evenements/${id}/inscription`, { params: { userId } })
  return data
}

export async function fetchInscriptions(id) {
  const { data } = await api.get(`/evenements/${id}/inscriptions`)
  return data.inscriptions || []
}

export default api
