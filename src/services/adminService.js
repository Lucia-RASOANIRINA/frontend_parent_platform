import axios from 'axios'
import { API_BASE_URL } from './evenementService'

const api = axios.create({ baseURL: `${API_BASE_URL}/admin` })

export async function fetchStats() {
  const { data } = await api.get('/stats')
  return data.stats
}

export async function fetchUsers(role = '') {
  const { data } = await api.get('/users', { params: role ? { role } : {} })
  return data.users || []
}

export async function changeUserRole(id, role) {
  const { data } = await api.put(`/users/${id}/role`, { role })
  return data
}

export async function deleteUser(id) {
  const { data } = await api.delete(`/users/${id}`)
  return data
}

export async function fetchAdminPosts() {
  const { data } = await api.get('/posts')
  return data.posts || []
}

export async function fetchAdminResources() {
  const { data } = await api.get('/ressources')
  return data.ressources || []
}

export async function deletePost(id) {
  const { data } = await api.delete(`/posts/${id}`)
  return data
}

export async function deleteResource(id) {
  const { data } = await api.delete(`/ressources/${id}`)
  return data
}

export default api
