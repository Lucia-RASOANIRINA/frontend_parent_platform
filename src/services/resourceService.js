import api, { urlApi, idUtilisateurCourant } from './api'

/** Ressources de la communauté : fiches, vidéos, notes et commentaires. */

export async function fetchRessources(params = {}) {
  const { data } = await api.get('/resources', { params })
  return data.resources || data.ressources || data || []
}

/** URL du fichier d'une ressource (téléchargement / aperçu). */
export function urlFichier(id, updatedAt = null) {
  const cle = updatedAt ? new Date(updatedAt).getTime() : Date.now()
  return urlApi(`/resources/${id}/file?t=${cle}`)
}

export function urlExport(id) {
  return urlApi(`/resources/${id}/export`)
}

export async function fetchContenu(id) {
  const { data } = await api.get(`/resources/${id}/content`)
  return data
}

export async function creerRessource(formData) {
  const { data } = await api.post('/resources', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function modifierRessource(id, formData) {
  const { data } = await api.put(`/resources/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function supprimerRessource(id) {
  const { data } = await api.delete(`/resources/${id}`)
  return data
}

export async function aimerRessource(id, userId = idUtilisateurCourant()) {
  const { data } = await api.post(`/resources/${id}/like`, {}, { headers: { 'X-User-Id': userId } })
  return data
}

export async function noterRessource(id, rating, userId = idUtilisateurCourant()) {
  const { data } = await api.post(`/resources/${id}/rating`, { rating }, { headers: { 'X-User-Id': userId } })
  return data
}

export async function retirerNote(id, userId = idUtilisateurCourant()) {
  const { data } = await api.delete(`/resources/${id}/rating`, { headers: { 'X-User-Id': userId } })
  return data
}

export async function fetchCommentairesRessource(id) {
  const { data } = await api.get(`/resources/${id}/comments`)
  return data.comments || data.commentaires || []
}

export async function commenterRessource(id, content, userId = idUtilisateurCourant()) {
  const { data } = await api.post(`/resources/${id}/comments`, { content }, { headers: { 'X-User-Id': userId } })
  return data
}

export async function supprimerCommentaireRessource(commentId, userId = idUtilisateurCourant()) {
  const { data } = await api.delete(`/resources/comments/${commentId}`, { headers: { 'X-User-Id': userId } })
  return data
}
