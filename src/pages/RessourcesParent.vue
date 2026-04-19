<template>
  <div class="parent-resources-container">
    <div class="page-header">
      <h1><i class="fas fa-book-open"></i> Ressources éducatives</h1>
      <p class="subtitle">Découvrez et partagez des activités, vidéos, guides et blocs pédagogiques</p>
    </div>

    <!-- Filtres simplifiés (optionnels mais utiles) -->
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
            {{ opt.label }}
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
            {{ opt.label }}
          </button>
        </div>
      </div>
      <button class="filter-clear" @click="resetFilters">
        <i class="fas fa-eraser"></i> Effacer les filtres
      </button>
    </div>

    <!-- Chargement -->
    <div v-if="loading" class="loading-spinner">
      <i class="fas fa-spinner fa-pulse"></i> Chargement des ressources...
    </div>

    <!-- Grille des ressources -->
    <div v-else class="resources-grid">
      <div v-for="res in resources" :key="res.id" class="resource-card">
        <!-- Badge type -->
        <div class="card-badge" :class="res.type">
          <i class="fas" :class="badgeIcon(res.type)"></i> {{ getTypeLabel(res.type) }}
        </div>

        <div class="card-content">
          <h3>{{ res.title }}</h3>
          <p class="description">{{ res.description }}</p>
          <div class="meta">
            <span><i class="fas fa-child"></i> {{ res.age }}</span>
            <span><i class="far fa-calendar-alt"></i> {{ formatDate(res.createdAt) }}</span>
            <span v-if="res.ownerName"><i class="fas fa-user"></i> {{ res.ownerName }}</span>
          </div>

          <!-- Aperçu média (vidéo ou PDF) -->
          <div v-if="res.type === 'video' && res.fileType" class="media-preview">
            <video controls :src="getFileUrl(res.id, res.updatedAt)" class="media-object"></video>
          </div>
          <div v-else-if="res.type === 'pdf' && res.fileType" class="media-preview">
            <embed :src="getFileUrl(res.id, res.updatedAt)" type="application/pdf" class="media-object" />
          </div>
        </div>

        <!-- Actions principales -->
        <div class="card-actions">
          <button @click="sendLike(res.id)" class="action-btn like">
            <i class="fas fa-thumbs-up"></i> J’aime <span class="count">{{ res.likes }}</span>
          </button>
          <button @click="openRatingModal(res)" class="action-btn rate">
            <i class="fas fa-star"></i> Noter <span class="count">({{ res.averageRating?.toFixed(1) || 0 }})</span>
          </button>
          <button @click="exportResource(res)" class="action-btn export">
            <i class="fas fa-download"></i> ZIP
          </button>
          <button @click="openCommentsModal(res)" class="action-btn comment">
            <i class="fas fa-comment"></i> Commentaires
          </button>
        </div>
      </div>

      <div v-if="resources.length === 0" class="empty-state">
        <i class="fas fa-folder-open"></i> Aucune ressource trouvée.
      </div>
    </div>

    <!-- ========== MODALES ========== -->

    <!-- Modale de notation -->
    <div v-if="ratingModalOpen" class="modal-overlay" @click.self="ratingModalOpen = false">
      <div class="modal-content small">
        <h3><i class="fas fa-star"></i> Noter "{{ selectedRatingResource?.title }}"</h3>
        <div class="rating-stars">
          <span v-for="star in 5" :key="star" @click="ratingValue = star" :class="{ active: star <= ratingValue }">⭐</span>
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
            <small>{{ formatDate(c.createdAt) }}</small>
            <!-- Les parents ne peuvent pas supprimer leurs commentaires ? On laisse la suppression seulement si c'est le leur (optionnel) -->
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
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8082/api'
const api = axios.create({ baseURL: API_BASE })

// Utilisateur courant (à adapter depuis votre auth)
const currentUserId = ref(1)
const currentUserName = ref('Parent')

// États
const resources = ref([])
const loading = ref(false)
const filters = ref({ type: '', age: '' })

// Modales
const ratingModalOpen = ref(false)
const selectedRatingResource = ref(null)
const ratingValue = ref(0)
const commentsModalOpen = ref(false)
const selectedResource = ref(null)
const currentComments = ref([])
const newComment = ref('')

// Options des filtres
const typeOptions = [
  { value: '', label: 'Tous' },
  { value: 'fiche', label: '📄 Fiche' },
  { value: 'video', label: '🎥 Vidéo' },
  { value: 'pdf', label: '📚 PDF' },
  { value: 'bloc', label: '🧩 Bloc' }
]
const ageOptions = [
  { value: '', label: 'Tous âges' },
  { value: '1-3', label: '1-3 ans' },
  { value: '3-5', label: '3-5 ans' },
  { value: '5-7', label: '5-7 ans' },
  { value: 'Professionnel', label: 'Professionnel' }
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

// Récupération de toutes les ressources (sans filtre propriétaire)
const fetchResources = async () => {
  loading.value = true
  try {
    const params = {
      type: filters.value.type || undefined,
      age: filters.value.age || undefined
      // Pas de paramètre "owner" → toutes les ressources
    }
    const response = await api.get('/resources', { params, headers: { 'X-User-Id': currentUserId.value } })
    resources.value = response.data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
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

// Notation
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

// Filtres
const resetFilters = () => {
  filters.value = { type: '', age: '' }
  fetchResources()
}

// Watcher pour recharger quand les filtres changent
watch([() => filters.value.type, () => filters.value.age], () => {
  fetchResources()
})

onMounted(() => {
  fetchResources()
})
</script>

<style scoped>
/* Style global - similaire à ResourcesView mais sans les boutons d'admin */
.parent-resources-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  min-height: 100vh;
  font-family: system-ui, 'Segoe UI', 'Roboto', sans-serif;
}
.page-header {
  text-align: center;
  margin-bottom: 2rem;
}
.page-header h1 {
  font-size: 2rem;
  color: #3e2c1f;
  font-weight: 700;
}
.page-header .subtitle {
  color: #7c6b57;
  font-size: 1rem;
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
  color: #5e4b34;
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
  cursor: pointer;
  color: #7c6b57;
}
.filter-clear:hover {
  background: #d2b48c;
  color: white;
}
.loading-spinner {
  text-align: center;
  padding: 2rem;
  color: #7c6b57;
}
.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.8rem;
}
.resource-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.05);
  border: 1px solid #f0e8df;
  transition: transform 0.2s, box-shadow 0.2s;
}
.resource-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.1);
}
.card-badge {
  display: inline-block;
  margin: 1rem 1rem 0 1rem;
  padding: 0.2rem 0.8rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: bold;
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
  line-height: 1.4;
}
.meta {
  display: flex;
  gap: 1rem;
  font-size: 0.7rem;
  color: #8f7e6b;
  margin-bottom: 0.8rem;
}
.media-preview {
  margin-top: 0.8rem;
  width: 100%;
  height: 250px;
  background: #f5f0ea;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.media-object {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.media-object embed {
  width: 100%;
  height: 100%;
}
.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.8rem 1rem;
  border-top: 1px solid #efe5db;
  background: #fefbf8;
}
.action-btn {
  background: none;
  border: 1px solid #d2b48c;
  padding: 0.4rem 0.8rem;
  border-radius: 30px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}
.action-btn .count {
  margin-left: 0.2rem;
  font-weight: bold;
}
.action-btn.like:hover { background: #27ae60; border-color: #27ae60; color: white; }
.action-btn.rate:hover { background: #f39c12; border-color: #f39c12; color: white; }
.action-btn.export:hover { background: #d2b48c; color: white; }
.action-btn.comment:hover { background: #2980b9; border-color: #2980b9; color: white; }
.empty-state {
  text-align: center;
  padding: 3rem;
  background: #fefaf5;
  border-radius: 24px;
  color: #a08e78;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  border-radius: 32px;
  max-width: 500px;
  width: 90%;
  padding: 1.5rem;
  max-height: 80vh;
  overflow-y: auto;
}
.modal-content.large { max-width: 700px; }
.modal-content.small { max-width: 400px; }
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
.no-comments {
  text-align: center;
  color: #a08e78;
  padding: 1rem;
}
@media (max-width: 768px) {
  .parent-resources-container { padding: 1rem; }
  .filters-bar { flex-direction: column; align-items: stretch; border-radius: 24px; }
  .resources-grid { grid-template-columns: 1fr; }
}
</style>