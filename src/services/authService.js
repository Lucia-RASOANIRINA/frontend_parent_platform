import api, { utilisateurCourant, API_BASE_URL } from './api'

/** Comptes et profils : connexion, inscription, recherche d'utilisateurs. */

export async function connexionUtilisateur(email, password) {
  const { data } = await api.post('/auth/login', { email, password })
  return data
}

export async function inscriptionUtilisateur(payload) {
  const { data } = await api.post('/auth/register', payload)
  return data
}

export async function rechercherUtilisateurs(query) {
  const { data } = await api.get('/auth/users/search', { params: { query } })
  return data.users || []
}

export async function fetchUtilisateur(id) {
  const { data } = await api.get(`/auth/users/${id}`)
  return data.user || data
}

export async function fetchUtilisateurs() {
  const { data } = await api.get('/auth/users')
  return data.users || []
}

export async function mettreAJourProfil(payload, userId = utilisateurCourant()?.id) {
  const { data } = await api.put('/auth/profile', payload, { headers: { 'X-User-Id': userId } })
  return data
}

/** Déconnexion : nettoie la session locale (y compris la visite « en tant que »). */
export function deconnexion() {
  localStorage.removeItem('user')
  localStorage.removeItem('adminReal')
}

/** Photo de profil : envoi, retrait, et URL de lecture. */
export async function envoyerPhotoProfil(fichier, userId = utilisateurCourant()?.id) {
  const corps = new FormData()
  corps.append('fichier', fichier)
  const { data } = await api.post('/auth/profile/photo', corps, {
    headers: { 'X-User-Id': userId, 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function retirerPhotoProfil(userId = utilisateurCourant()?.id) {
  const { data } = await api.delete('/auth/profile/photo', { headers: { 'X-User-Id': userId } })
  return data
}

/**
 * URL de l'avatar. Le paramètre « v » force le navigateur à recharger l'image
 * après un changement : sans lui, l'ancienne photo restait en cache.
 */
export function urlPhotoProfil(userId, version = '') {
  const base = `${API_BASE_URL}/auth/${userId}/photo`
  return version ? `${base}?v=${version}` : base
}

/** Bilan d'activité d'une éducatrice ou d'un psychologue. */
export async function bilanProfessionnel(userId = utilisateurCourant()?.id) {
  const { data } = await api.get(`/stats/professionnel/${userId}`)
  return data.bilan || null
}
