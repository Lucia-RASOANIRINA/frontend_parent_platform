import api from './api'

/** Administration : tableau de bord, utilisateurs, modération des contenus. */

export async function fetchStats() {
  const { data } = await api.get('/admin/stats')
  return data.stats
}

export async function fetchUsers(role = '') {
  const { data } = await api.get('/admin/users', { params: role ? { role } : {} })
  return data.users || []
}

export async function changeUserRole(id, role) {
  const { data } = await api.put(`/admin/users/${id}/role`, { role })
  return data
}

export async function deleteUser(id) {
  const { data } = await api.delete(`/admin/users/${id}`)
  return data
}

export async function fetchAdminPosts() {
  const { data } = await api.get('/admin/posts')
  return data.posts || []
}

export async function fetchAdminResources() {
  const { data } = await api.get('/admin/ressources')
  return data.ressources || []
}

export async function deletePost(id) {
  const { data } = await api.delete(`/admin/posts/${id}`)
  return data
}

export async function deleteResource(id) {
  const { data } = await api.delete(`/admin/ressources/${id}`)
  return data
}

/** Statistiques publiques (page « À propos »). */
export async function fetchStatsPubliques() {
  const { data } = await api.get('/stats')
  return data.stats
}

export default api
