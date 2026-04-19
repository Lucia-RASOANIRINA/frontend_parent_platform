<template>
  <div class="resources-container">
    <!-- En‑tête avec deux onglets (gauche/droite) -->
    <div class="resources-header">
      <button :class="['tab-btn', { active: activeTab === 'mine' }]" @click="activeTab = 'mine'; fetchResources()">
        <i class="fas fa-user"></i> Mes ressources
      </button>
      <button :class="['tab-btn', { active: activeTab === 'shared' }]" @click="activeTab = 'shared'; fetchResources()">
        <i class="fas fa-users"></i> Ressources de l'équipe
      </button>
    </div>

    <!-- Filtres modernes (pills) -->
    <div class="filters-bar">
      <div class="filter-group">
        <span class="filter-label"><i class="fas fa-tag"></i> Type :</span>
        <div class="filter-pills">
          <button
            v-for="opt in typeOptions"
            :key="opt.value"
            :class="['pill', { active: filters.type === opt.value }]"
            @click="filters.type = opt.value; fetchResources()"
          >
            <i :class="opt.icon"></i> {{ opt.label }}
          </button>
        </div>
      </div>
      <div class="filter-group">
        <span class="filter-label"><i class="fas fa-calendar-alt"></i> Âge cible :</span>
        <div class="filter-pills">
          <button
            v-for="opt in ageOptions"
            :key="opt.value"
            :class="['pill', { active: filters.age === opt.value }]"
            @click="filters.age = opt.value; fetchResources()"
          >
            <i class="fas fa-child"></i> {{ opt.label }}
          </button>
        </div>
      </div>
      <button class="filter-clear" @click="resetFilters">
        <i class="fas fa-eraser"></i> Effacer
      </button>
    </div>

    <!-- Contenu -->
    <div v-if="loading" class="loading-spinner">
      <i class="fas fa-spinner fa-pulse"></i> Chargement...
    </div>
    <div v-else class="resources-grid">
      <div v-for="res in resources" :key="res.id" class="resource-card">
        <!-- Menu contextuel (⋮) en haut à droite -->
        <div class="card-menu">
          <button v-if="activeTab === 'mine'" class="menu-trigger" @click.stop="toggleMenu(res.id)">
            <i class="fas fa-ellipsis-v"></i>
          </button>
          <div v-if="menuResourceId === res.id" class="menu-popup">
            <button @click="openEditModal(res)"><i class="fas fa-edit"></i> Modifier</button>
            <button @click="confirmDelete(res)"><i class="fas fa-trash-alt"></i> Supprimer</button>
          </div>
        </div>

        <div class="card-badge" :class="res.type">
          <i class="fas" :class="badgeIcon(res.type)"></i> {{ getTypeLabel(res.type) }}
        </div>
        <div class="card-content">
          <h3>{{ res.title }}</h3>
          <p class="description">{{ res.description }}</p>
          <div class="meta">
            <span><i class="fas fa-child"></i> {{ res.age }}</span>
            <span><i class="far fa-calendar-alt"></i> {{ formatDate(res.createdAt) }}</span>
          </div>
          <!-- Affichage vidéo/PDF uniquement si le fichier existe -->
          <div v-if="res.type === 'video' && res.fileType" class="video-preview">
            <video controls :src="getFileUrl(res.id, res.updatedAt)" width="100%"></video>
          </div>
          <div v-if="res.type === 'pdf' && res.fileType" class="pdf-link">
            <embed :src="getFileUrl(res.id, res.updatedAt)" type="application/pdf" width="100%" height="400px" />
            <a :href="getFileUrl(res.id, res.updatedAt)" target="_blank"><i class="fas fa-external-link-alt"></i> Ouvrir le PDF</a>
          </div>
        </div>
        <div class="card-actions">
          <button @click="previewResource(res)" class="action-btn"><i class="fas fa-eye"></i> Aperçu</button>
          <button @click="openScheduleModal(res)" class="action-btn"><i class="fas fa-calendar-plus"></i> Programmer</button>
          <button @click="exportResource(res)" class="action-btn"><i class="fas fa-download"></i> Export ZIP</button>
          <div class="feedback-stats">
            <span><i class="fas fa-heart"></i> {{ res.likes }}</span>
            <span><i class="fas fa-star"></i> {{ (res.averageRating || 0).toFixed(1) }} ({{ res.totalRatings || 0 }})</span>
          </div>
        </div>
        <div class="feedback-buttons">
          <button @click="sendLike(res.id)" class="fb-like"><i class="fas fa-thumbs-up"></i> J’ai testé</button>
          <!-- Bouton Noter : présent uniquement dans l'onglet "Ressources de l'équipe" -->
          <button v-if="activeTab === 'shared'" @click="openRatingModal(res)" class="fb-star">
            <i class="fas fa-star"></i> Noter
          </button>
          <button @click="openCommentsModal(res)" class="fb-comment"><i class="fas fa-comment"></i> Commentaires</button>
        </div>
      </div>
      <div v-if="resources.length === 0" class="empty-state">
        <i class="fas fa-folder-open"></i> Aucune ressource trouvée.
      </div>
    </div>

    <!-- Bouton flottant (icône uniquement) -->
    <button class="fab" @click="openCreateModal">
      <i class="fas fa-plus"></i>
    </button>

    <!-- ================= MODALES ================= -->

    <!-- Modale de création -->
    <div v-if="createModalOpen" class="modal-overlay" @click.self="createModalOpen = false">
      <div class="modal-content large">
        <h2><i class="fas fa-plus-circle"></i> Nouvelle ressource</h2>
        <form @submit.prevent="createResource">
          <div class="form-group">
            <input v-model="newResource.title" placeholder="Titre" required />
          </div>
          <div class="form-group">
            <textarea v-model="newResource.description" placeholder="Description" required></textarea>
          </div>
          <div class="form-row">
            <select v-model="newResource.age" required>
              <option value="">Âge cible</option>
              <option value="1-3">1-3 ans</option>
              <option value="3-5">3-5 ans</option>
              <option value="5-7">5-7 ans</option>
              <option value="Professionnel">Professionnel</option>
            </select>
            <select v-model="newResource.type" required>
              <option value="fiche">Fiche activité</option>
              <option value="video">Vidéo</option>
              <option value="pdf">PDF / Document</option>
              <option value="bloc">Bloc pédagogique</option>
            </select>
          </div>
          <div v-if="newResource.type === 'video'" class="form-group">
            <input type="file" @change="handleFile" accept="video/*" />
            <div class="or-divider">— ou —</div>
            <input v-model="newResource.videoUrl" placeholder="URL de la vidéo" />
          </div>
          <div v-if="newResource.type === 'pdf'" class="form-group">
            <input type="file" @change="handleFile" accept="application/pdf" />
          </div>
          <div class="modal-footer">
            <button type="button" @click="createModalOpen = false">Annuler</button>
            <button type="submit" class="primary">Créer</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modale d'édition -->
    <div v-if="editModalOpen" class="modal-overlay" @click.self="editModalOpen = false">
      <div class="modal-content large">
        <h2><i class="fas fa-edit"></i> Modifier la ressource</h2>
        <form @submit.prevent="updateResource">
          <div class="form-group">
            <input v-model="editResource.title" placeholder="Titre" required />
          </div>
          <div class="form-group">
            <textarea v-model="editResource.description" placeholder="Description" required></textarea>
          </div>
          <div class="form-row">
            <select v-model="editResource.age" required>
              <option value="">Âge cible</option>
              <option value="1-3">1-3 ans</option>
              <option value="3-5">3-5 ans</option>
              <option value="5-7">5-7 ans</option>
              <option value="Professionnel">Professionnel</option>
            </select>
            <select v-model="editResource.type" required>
              <option value="fiche">Fiche activité</option>
              <option value="video">Vidéo</option>
              <option value="pdf">PDF / Document</option>
              <option value="bloc">Bloc pédagogique</option>
            </select>
          </div>
          <div v-if="editResource.type === 'video'" class="form-group">
            <input type="file" @change="handleEditFile" accept="video/*" />
            <div class="or-divider">— ou —</div>
            <input v-model="editResource.videoUrl" placeholder="URL de la vidéo" />
          </div>
          <div v-if="editResource.type === 'pdf'" class="form-group">
            <input type="file" @change="handleEditFile" accept="application/pdf" />
          </div>
          <div class="modal-footer">
            <button type="button" @click="editModalOpen = false">Annuler</button>
            <button type="submit" class="primary">Mettre à jour</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modale d'aperçu -->
    <div v-if="modalOpen" class="modal-overlay" @click.self="modalOpen = false">
      <div class="modal-content">
        <h2><i class="fas fa-file-alt"></i> {{ selectedResource?.title }}</h2>
        <div class="modal-body" v-html="selectedResource?.description || 'Aucun contenu'"></div>
        <div class="modal-footer">
          <button @click="modalOpen = false">Fermer</button>
          <button class="primary" @click="openScheduleModal(selectedResource)">Programmer</button>
        </div>
      </div>
    </div>

    <!-- Modale de notation -->
    <div v-if="ratingModalOpen" class="modal-overlay" @click.self="ratingModalOpen = false">
      <div class="modal-content small">
        <h3><i class="fas fa-star"></i> Noter "{{ selectedRatingResource?.title }}"</h3>
        <div class="rating-stars">
          <span v-for="star in 5" :key="star" @click="ratingValue = star" :class="{ active: star <= ratingValue }">
            <i class="fas fa-star"></i>
          </span>
        </div>
        <div class="modal-footer">
          <button @click="ratingModalOpen = false">Annuler</button>
          <button class="primary" @click="submitRating">Valider</button>
        </div>
      </div>
    </div>

    <!-- Modale des commentaires -->
    <div v-if="commentsModalOpen" class="modal-overlay" @click.self="commentsModalOpen = false">
      <div class="modal-content large">
        <h3><i class="fas fa-comments"></i> Commentaires - {{ selectedResource?.title }}</h3>
        <div class="comments-list">
          <div v-for="c in currentComments" :key="c.id" class="comment-item">
            <strong><i class="fas fa-user-circle"></i> {{ c.userName }}</strong>
            <p>{{ c.content }}</p>
            <small><i class="far fa-clock"></i> {{ formatDate(c.createdAt) }}</small>
            <button v-if="c.userId === currentUserId" @click="deleteComment(c.id)" class="delete-comment">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
          <div v-if="currentComments.length === 0" class="no-comments">Aucun commentaire.</div>
        </div>
        <div class="add-comment">
          <textarea v-model="newComment" placeholder="Ajouter un commentaire..."></textarea>
          <button @click="addComment" class="primary">Envoyer</button>
        </div>
        <div class="modal-footer">
          <button @click="commentsModalOpen = false">Fermer</button>
        </div>
      </div>
    </div>

    <!-- Modale de programmation -->
    <div v-if="scheduleModalOpen" class="modal-overlay" @click.self="scheduleModalOpen = false">
      <div class="modal-content small">
        <h3><i class="fas fa-calendar-check"></i> Programmer "{{ selectedResource?.title }}"</h3>
        <input type="datetime-local" v-model="scheduleDate" />
        <div class="modal-footer">
          <button @click="scheduleModalOpen = false">Annuler</button>
          <button class="primary" @click="submitSchedule">Programmer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8082/api'
const api = axios.create({ baseURL: API_BASE })

const currentUserId = ref(1)
const currentUserName = ref('Jean Dupont')

const resources = ref([])
const loading = ref(false)
const filters = ref({ type: '', age: '' })
const activeTab = ref('mine')
const modalOpen = ref(false)
const selectedResource = ref(null)
const createModalOpen = ref(false)
const ratingModalOpen = ref(false)
const selectedRatingResource = ref(null)
const ratingValue = ref(0)
const commentsModalOpen = ref(false)
const currentComments = ref([])
const newComment = ref('')
const scheduleModalOpen = ref(false)
const scheduleDate = ref('')

// Modification
const editModalOpen = ref(false)
const editResource = ref({
  id: null,
  title: '',
  description: '',
  age: '',
  type: 'fiche',
  videoUrl: ''
})
let editSelectedFile = null

// Nouvelle ressource (sans fullContent)
const newResource = ref({
  title: '',
  description: '',
  age: '',
  type: 'fiche',
  videoUrl: ''
})
let selectedFile = null

// Menu contextuel
const menuResourceId = ref(null)

// Options pour les filtres avec icônes
const typeOptions = [
  { value: '', label: 'Tous', icon: 'fa-list' },
  { value: 'fiche', label: 'Fiche', icon: 'fa-file-alt' },
  { value: 'video', label: 'Vidéo', icon: 'fa-video' },
  { value: 'pdf', label: 'PDF', icon: 'fa-file-pdf' },
  { value: 'bloc', label: 'Bloc', icon: 'fa-cubes' }
]
const ageOptions = [
  { value: '', label: 'Tous âges', icon: 'fa-users' },
  { value: '1-3', label: '1-3 ans', icon: 'fa-baby' },
  { value: '3-5', label: '3-5 ans', icon: 'fa-child' },
  { value: '5-7', label: '5-7 ans', icon: 'fa-child' },
  { value: 'Professionnel', label: 'Professionnel', icon: 'fa-briefcase' }
]

// Helper URLs
const getFileUrl = (resourceId, updatedAt = null) => {
  let url = `${API_BASE}/resources/${resourceId}/file`
  const timestamp = updatedAt ? new Date(updatedAt).getTime() : Date.now()
  url += `?t=${timestamp}`
  return url
}

const badgeIcon = (type) => {
  const icons = { fiche: 'fa-file-alt', video: 'fa-video', pdf: 'fa-file-pdf', bloc: 'fa-cubes' }
  return icons[type] || 'fa-question'
}

const getTypeLabel = (type) => {
  const map = { fiche: 'Fiche activité', video: 'Vidéo', pdf: 'PDF', bloc: 'Blocs' }
  return map[type] || type
}

const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('fr-FR') : ''

// Récupération des ressources
const fetchResources = async () => {
  loading.value = true
  try {
    const params = {
      type: filters.value.type || undefined,
      age: filters.value.age || undefined,
      owner: activeTab.value
    }
    const response = await api.get('/resources', { params, headers: { 'X-User-Id': currentUserId.value } })
    resources.value = response.data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// Création (sans fullContent)
const handleFile = (e) => { selectedFile = e.target.files[0] }

const createResource = async () => {
  const formData = new FormData()
  formData.append('title', newResource.value.title)
  formData.append('description', newResource.value.description)
  formData.append('type', newResource.value.type)
  formData.append('age', newResource.value.age)
  if (newResource.value.type === 'video' && newResource.value.videoUrl) {
    formData.append('videoUrl', newResource.value.videoUrl)
  }
  if (selectedFile) {
    formData.append('file', selectedFile)
  }
  try {
    await api.post('/resources', formData, {
      headers: { 'X-User-Id': currentUserId.value, 'Content-Type': 'multipart/form-data' }
    })
    await fetchResources()
    createModalOpen.value = false
    newResource.value = { title: '', description: '', age: '', type: 'fiche', videoUrl: '' }
    selectedFile = null
  } catch (error) {
    console.error(error)
    alert('Erreur lors de la création')
  }
}

// Modification (sans fullContent)
const openEditModal = (res) => {
  editResource.value = {
    id: res.id,
    title: res.title,
    description: res.description,
    age: res.age,
    type: res.type,
    videoUrl: ''
  }
  editSelectedFile = null
  editModalOpen.value = true
  menuResourceId.value = null
}

const handleEditFile = (e) => { editSelectedFile = e.target.files[0] }

const updateResource = async () => {
  const formData = new FormData()
  formData.append('title', editResource.value.title)
  formData.append('description', editResource.value.description)
  formData.append('type', editResource.value.type)
  formData.append('age', editResource.value.age)
  if (editResource.value.type === 'video' && editResource.value.videoUrl) {
    formData.append('videoUrl', editResource.value.videoUrl)
  }
  if (editSelectedFile) {
    formData.append('file', editSelectedFile)
  }
  try {
    await api.put(`/resources/${editResource.value.id}`, formData, {
      headers: { 'X-User-Id': currentUserId.value, 'Content-Type': 'multipart/form-data' }
    })
    await fetchResources()
    editModalOpen.value = false
    editResource.value = { id: null, title: '', description: '', age: '', type: 'fiche', videoUrl: '' }
    editSelectedFile = null
    alert('Ressource mise à jour')
  } catch (error) {
    console.error(error)
    alert('Erreur lors de la mise à jour')
  }
}

// Suppression
const confirmDelete = (res) => {
  if (confirm(`Supprimer définitivement "${res.title}" ?`)) {
    deleteResource(res.id)
  }
  menuResourceId.value = null
}

const deleteResource = async (id) => {
  try {
    await api.delete(`/resources/${id}`, { headers: { 'X-User-Id': currentUserId.value } })
    await fetchResources()
    alert('Ressource supprimée')
  } catch (error) {
    console.error(error)
    alert('Erreur lors de la suppression')
  }
}

// Like
const sendLike = async (id) => {
  try {
    await api.post(`/resources/${id}/like`, {}, { headers: { 'X-User-Id': currentUserId.value } })
    const res = resources.value.find(r => r.id === id)
    if (res) res.likes++
  } catch (error) { console.error(error) }
}

// Notation (uniquement pour les ressources de l'équipe)
const openRatingModal = (res) => {
  selectedRatingResource.value = res
  ratingValue.value = 0
  ratingModalOpen.value = true
}

const submitRating = async () => {
  if (ratingValue.value < 1 || ratingValue.value > 5) return
  try {
    await api.post(`/resources/${selectedRatingResource.value.id}/rating`, { rating: ratingValue.value }, {
      headers: { 'X-User-Id': currentUserId.value }
    })
    const res = resources.value.find(r => r.id === selectedRatingResource.value.id)
    if (res) {
      const total = (res.totalRatings || 0) + 1
      res.averageRating = ((res.averageRating || 0) * (res.totalRatings || 0) + ratingValue.value) / total
      res.totalRatings = total
    }
    ratingModalOpen.value = false
  } catch (error) { console.error(error) }
}

// Commentaires
const openCommentsModal = async (res) => {
  selectedResource.value = res
  try {
    const response = await api.get(`/resources/${res.id}/comments`)
    currentComments.value = response.data
    commentsModalOpen.value = true
  } catch (error) { console.error(error) }
}

const addComment = async () => {
  if (!newComment.value.trim()) return
  try {
    await api.post(`/resources/${selectedResource.value.id}/comments`, { content: newComment.value }, {
      headers: { 'X-User-Id': currentUserId.value, 'X-User-Name': currentUserName.value }
    })
    const response = await api.get(`/resources/${selectedResource.value.id}/comments`)
    currentComments.value = response.data
    newComment.value = ''
  } catch (error) { console.error(error) }
}

const deleteComment = async (commentId) => {
  try {
    await api.delete(`/resources/comments/${commentId}`, { headers: { 'X-User-Id': currentUserId.value } })
    currentComments.value = currentComments.value.filter(c => c.id !== commentId)
  } catch (error) { console.error(error) }
}

// Programmation
const openScheduleModal = (res) => {
  selectedResource.value = res
  scheduleDate.value = ''
  scheduleModalOpen.value = true
}

const submitSchedule = async () => {
  if (!scheduleDate.value) return
  try {
    await api.post(`/resources/${selectedResource.value.id}/schedule`, { scheduledAt: scheduleDate.value }, {
      headers: { 'X-User-Id': currentUserId.value }
    })
    alert('Programmation enregistrée')
    scheduleModalOpen.value = false
  } catch (error) { console.error(error) }
}

// Export ZIP
const exportResource = async (res) => {
  try {
    const response = await api.get(`/resources/${res.id}/export`, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${res.title}.zip`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (error) { console.error(error) }
}

// Aperçu (sans fullContent)
const previewResource = async (res) => {
  selectedResource.value = { ...res, fullContent: res.description }
  modalOpen.value = true
}

// Filtres
const resetFilters = () => {
  filters.value = { type: '', age: '' }
  fetchResources()
}

const openCreateModal = () => {
  createModalOpen.value = true
}

// Menu contextuel
const toggleMenu = (id) => {
  menuResourceId.value = menuResourceId.value === id ? null : id
}

const handleClickOutside = (event) => {
  if (!event.target.closest('.context-menu')) {
    menuResourceId.value = null
  }
}

// Watchers
watch([() => filters.value.type, () => filters.value.age, () => activeTab.value], () => {
  fetchResources()
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  fetchResources()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Styles (identiques à la version précédente, mais avec des icônes) */
.resources-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  min-height: 100vh;
  font-family: system-ui, 'Segoe UI', 'Roboto', sans-serif;
}

.resources-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid #f0e8df;
  padding-bottom: 0.5rem;
}
.tab-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  font-weight: 500;
  padding: 0.5rem 1.5rem;
  cursor: pointer;
  color: #7c6b57;
  transition: all 0.2s;
  border-radius: 40px;
}
.tab-btn i {
  margin-right: 0.5rem;
}
.tab-btn.active {
  color: #3e2c1f;
  background: #f5efe8;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.filters-bar {
  background: #fefaf5;
  border-radius: 60px;
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}
.filter-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.filter-label {
  font-weight: 500;
  color: #5e4b34;
  font-size: 0.9rem;
}
.filter-pills {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.pill {
  background: white;
  border: 1px solid #e2dcd5;
  border-radius: 40px;
  padding: 0.4rem 1rem;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #5e4b34;
}
.pill i {
  margin-right: 0.3rem;
}
.pill.active {
  background: #d2b48c;
  border-color: #d2b48c;
  color: white;
}
.filter-clear {
  background: none;
  border: 1px solid #d2b48c;
  border-radius: 40px;
  padding: 0.4rem 1rem;
  font-size: 0.85rem;
  cursor: pointer;
  color: #7c6b57;
  transition: 0.2s;
}
.filter-clear:hover {
  background: #d2b48c;
  color: white;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.8rem;
}
.loading-spinner {
  text-align: center;
  padding: 2rem;
  color: #7c6b57;
}
.empty-state {
  text-align: center;
  padding: 3rem;
  background: #fefaf5;
  border-radius: 24px;
  color: #a08e78;
}

.resource-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.05);
  overflow: hidden;
  transition: 0.2s;
  border: 1px solid #f0e8df;
  position: relative;
}
.resource-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.1);
}
.card-menu {
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  z-index: 2;
}
.menu-trigger {
  background: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #7c6b57;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  transition: 0.2s;
}
.menu-trigger:hover {
  background: #f0e2d0;
  color: #3e2c1f;
}
.menu-popup {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  min-width: 140px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.menu-popup button {
  background: none;
  border: none;
  padding: 0.75rem 1rem;
  text-align: left;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.15s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.menu-popup button:hover {
  background: #f5efe8;
}
.card-badge {
  display: inline-block;
  margin: 1rem 1rem 0 1rem;
  padding: 0.2rem 0.8rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: bold;
  background: #f3ede7;
  color: #5e4b34;
}
.card-badge.video { background: #e3f2fd; color: #0b5e7c; }
.card-badge.pdf { background: #ffefdb; color: #b45f2b; }
.card-badge.bloc { background: #e8f0e7; color: #2c6e2c; }
.card-content {
  padding: 0 1rem 1rem;
}
.card-content h3 {
  font-size: 1.2rem;
  margin: 0.5rem 0;
  color: #2c241a;
}
.description {
  font-size: 0.85rem;
  color: #6b5b4b;
  margin-bottom: 0.6rem;
}
.meta {
  display: flex;
  gap: 1rem;
  font-size: 0.7rem;
  color: #8f7e6b;
  margin-bottom: 0.8rem;
}
.video-preview, .pdf-link {
  margin-top: 0.8rem;
}
.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.8rem 1rem;
  border-top: 1px solid #efe5db;
  background: #fefbf8;
  align-items: center;
}
.action-btn {
  background: none;
  border: 1px solid #d2b48c;
  padding: 0.2rem 0.7rem;
  border-radius: 30px;
  font-size: 0.7rem;
  cursor: pointer;
  transition: 0.1s;
}
.action-btn:hover {
  background: #d2b48c;
  color: white;
}
.feedback-stats {
  margin-left: auto;
  display: flex;
  gap: 0.6rem;
  font-size: 0.7rem;
  color: #a08e78;
}
.feedback-buttons {
  display: flex;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: #fdfaf7;
  border-top: 1px solid #efe5db;
}
.fb-like, .fb-star, .fb-comment {
  background: none;
  border: none;
  font-size: 0.7rem;
  cursor: pointer;
  color: #7c6b57;
  transition: 0.2s;
}
.fb-like:hover { color: #27ae60; }
.fb-star:hover { color: #f39c12; }
.fb-comment:hover { color: #2980b9; }

.fab {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #d2b48c;
  color: #3e2c1f;
  border: none;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  font-size: 1.8rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  transition: 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fab:hover {
  background: #b89466;
  transform: scale(1.05);
}

/* Modales */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  border-radius: 32px;
  max-width: 600px;
  width: 90%;
  padding: 1.5rem;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 35px rgba(0,0,0,0.2);
}
.modal-content.large { max-width: 700px; }
.modal-content.small { max-width: 400px; }
.modal-content h2, .modal-content h3 {
  margin-top: 0;
  color: #3e2c1f;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group input, .form-group textarea, .modal-content select {
  width: 100%;
  padding: 0.8rem;
  border-radius: 16px;
  border: 1px solid #e2dcd5;
  font-size: 0.9rem;
  transition: 0.2s;
}
.form-group input:focus, .form-group textarea:focus, .modal-content select:focus {
  outline: none;
  border-color: #d2b48c;
  box-shadow: 0 0 0 2px rgba(210,180,140,0.2);
}
.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.form-row select {
  flex: 1;
}
.or-divider {
  text-align: center;
  margin: 0.5rem 0;
  color: #a08e78;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}
.modal-footer button {
  padding: 0.5rem 1rem;
  border-radius: 40px;
  border: 1px solid #d2b48c;
  background: white;
  cursor: pointer;
}
.modal-footer button.primary {
  background: #d2b48c;
  color: white;
}
.rating-stars {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  font-size: 2rem;
  margin: 1rem 0;
  cursor: pointer;
}
.rating-stars span {
  opacity: 0.4;
  transition: 0.1s;
}
.rating-stars span.active { opacity: 1; }
.rating-stars span i {
  color: #f39c12;
}
.comments-list {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1rem;
}
.comment-item {
  background: #f9f5f0;
  border-radius: 16px;
  padding: 0.6rem;
  margin-bottom: 0.8rem;
  position: relative;
}
.comment-item strong {
  display: block;
  font-size: 0.8rem;
  color: #5e4b34;
}
.comment-item p {
  margin: 0.3rem 0;
  font-size: 0.85rem;
}
.comment-item small {
  font-size: 0.7rem;
  color: #a08e78;
}
.delete-comment {
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #7c6b57;
}
.add-comment {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}
.add-comment textarea {
  width: 100%;
  border-radius: 16px;
  border: 1px solid #e2dcd5;
  padding: 0.5rem;
  resize: vertical;
}

/* Responsive */
@media (max-width: 768px) {
  .resources-container {
    padding: 1rem;
  }
  .filters-bar {
    flex-direction: column;
    align-items: stretch;
    border-radius: 24px;
    padding: 1rem;
  }
  .filter-group {
    justify-content: space-between;
  }
  .filter-pills {
    justify-content: center;
  }
  .form-row {
    flex-direction: column;
  }
  .fab {
    bottom: 1rem;
    right: 1rem;
    width: 48px;
    height: 48px;
    font-size: 1.5rem;
  }
}
</style>