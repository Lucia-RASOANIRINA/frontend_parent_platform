import axios from 'axios'

// Base de l'API backend (Spring Boot)
export const API_BASE_URL = 'http://localhost:8082/api'

const api = axios.create({ baseURL: API_BASE_URL })

/** Utilisateur connecté (depuis le localStorage). */
export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null')
  } catch {
    return null
  }
}

export function getCurrentUserId() {
  const u = getCurrentUser()
  return u && u.id ? u.id : null
}

/** Liste des évènements. all=true pour inclure les non publiés (admin). */
export async function fetchEvenements({ userId = getCurrentUserId(), all = false } = {}) {
  const { data } = await api.get('/evenements', { params: { userId, all } })
  return data.evenements || []
}

export async function fetchEvenement(id, userId = getCurrentUserId()) {
  const { data } = await api.get(`/evenements/${id}`, { params: { userId } })
  return data.evenement
}

export async function createEvenement(payload, userId = getCurrentUserId()) {
  const { data } = await api.post('/evenements', payload, { params: { userId } })
  return data.evenement
}

export async function updateEvenement(id, payload) {
  const { data } = await api.put(`/evenements/${id}`, payload)
  return data.evenement
}

export async function deleteEvenement(id) {
  const { data } = await api.delete(`/evenements/${id}`)
  return data
}

export async function inscrireEvenement(id, userId = getCurrentUserId()) {
  const { data } = await api.post(`/evenements/${id}/inscription`, null, { params: { userId } })
  return data
}

export async function desinscrireEvenement(id, userId = getCurrentUserId()) {
  const { data } = await api.delete(`/evenements/${id}/inscription`, { params: { userId } })
  return data
}

export async function fetchInscriptions(id) {
  const { data } = await api.get(`/evenements/${id}/inscriptions`)
  return data.inscriptions || []
}

export default api
