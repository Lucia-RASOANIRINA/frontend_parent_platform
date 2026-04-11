<template>
  <div class="resources-container">
    <!-- En-tête -->
    <div class="resources-header">
      <h1>📚 Mes ressources éducatives</h1>
      <div class="header-actions">
        <div class="search-bar">
          <input type="text" v-model="searchQuery" placeholder="Rechercher par mot-clé, âge, type..." />
          <button class="search-btn" @click="fetchResources">🔍</button>
        </div>
        <button class="surprise-btn" @click="surpriseMode">🎲 Surprise pédagogique</button>
      </div>
    </div>

    <!-- Filtres avancés -->
    <div class="filters-bar">
      <select v-model="filters.type" @change="fetchResources">
        <option value="">Tous types</option>
        <option value="fiche">Fiche activité</option>
        <option value="video">Vidéo</option>
        <option value="pdf">PDF/Guide</option>
        <option value="bloc">Bloc pédagogique</option>
      </select>
      <select v-model="filters.age" @change="fetchResources">
        <option value="">Âge cible</option>
        <option value="1-3">1-3 ans</option>
        <option value="3-5">3-5 ans</option>
        <option value="5-7">5-7 ans</option>
      </select>
      <button class="filter-clear" @click="resetFilters">Effacer filtres</button>
    </div>

    <!-- Onglets -->
    <div class="tabs">
      <button :class="{ active: activeTab === 'mine' }" @click="activeTab = 'mine'; fetchResources()">📌 Mes ressources</button>
      <button :class="{ active: activeTab === 'shared' }" @click="activeTab = 'shared'; fetchResources()">👥 Ressources de l'équipe</button>
    </div>

    <!-- Chargement -->
    <div v-if="loading" class="loading-spinner">Chargement des ressources...</div>

    <!-- Grille des cartes -->
    <div class="resources-grid" v-else>
      <div v-for="res in resources" :key="res.id" class="resource-card">
        <div class="card-badge" :class="res.type">{{ getTypeLabel(res.type) }}</div>
        <div class="card-content">
          <h3>{{ res.title }}</h3>
          <p class="description">{{ res.description }}</p>
          <div class="meta">
            <span>🎯 {{ res.age }}</span>
            <span>📅 {{ formatDate(res.createdAt) }}</span>
          </div>
          <div v-if="res.previewBlocks && res.previewBlocks.length" class="preview-blocks">
            <span v-for="block in res.previewBlocks" :key="block" class="block-tag">{{ block }}</span>
          </div>
          <div v-if="res.type === 'video'" class="video-thumb">
            <img :src="res.thumbnail || 'https://picsum.photos/200/120?random=1'" alt="aperçu vidéo" />
            <button class="play-overlay" @click="previewResource(res)">▶️</button>
          </div>
        </div>

        <div class="card-actions">
          <button @click="previewResource(res)" class="action-btn preview">👁️ Aperçu</button>
          <button @click="openScheduleModal(res)" class="action-btn schedule">📅 Programmer</button>
          <button @click="exportResource(res)" class="action-btn export">⬇️ Export ZIP</button>
          <div class="feedback-stats">
            <span>❤️ {{ res.likes }}</span>
            <span>⭐ {{ (res.averageRating || 0).toFixed(1) }} ({{ res.totalRatings || 0 }})</span>
          </div>
        </div>

        <div class="feedback-buttons">
          <button @click="sendLike(res.id)" class="fb-like">👍 J’ai testé</button>
          <button @click="openRatingModal(res)" class="fb-star">⭐ Noter</button>
          <button @click="openCommentsModal(res)" class="fb-comment">💬 Commentaires</button>
        </div>
      </div>
    </div>

    <!-- Bouton flottant création -->
    <button class="fab" @click="openCreateModal">+ Créer une ressource</button>

    <!-- Modale d'aperçu -->
    <div v-if="modalOpen" class="modal-overlay" @click.self="modalOpen = false">
      <div class="modal-content">
        <h2>{{ selectedResource?.title }}</h2>
        <div class="modal-body" v-html="selectedResource?.fullContent || selectedResource?.description"></div>
        <div class="modal-footer">
          <button @click="modalOpen = false">Fermer</button>
          <button class="primary" @click="openScheduleModal(selectedResource)">Programmer</button>
        </div>
      </div>
    </div>

    <!-- Modale de création -->
    <div v-if="createModalOpen" class="modal-overlay" @click.self="createModalOpen = false">
      <div class="modal-content large">
        <h2>✨ Nouvelle ressource</h2>
        <div class="create-options">
          <button @click="createType = 'blocks'" class="option-card">🧩 Blocs pédagogiques</button>
          <button @click="createType = 'video'" class="option-card">🎥 Vidéo éducative</button>
          <button @click="createType = 'pdf'" class="option-card">📄 Fiche PDF / Guide</button>
          <button @click="createType = 'ia'" class="option-card">🤖 Génération IA (thème)</button>
        </div>
        <div v-if="createType === 'ia'" class="ia-panel">
          <input v-model="iaTheme" placeholder="Thème (ex. émotions, dinosaures, motricité)" />
          <button @click="generateByIA">Générer une fiche</button>
          <p class="ia-result" v-if="iaResult">{{ iaResult }}</p>
        </div>
        <div class="modal-footer">
          <button @click="createModalOpen = false">Annuler</button>
          <button v-if="createType && createType !== 'ia'" class="primary" @click="createResource">Créer</button>
        </div>
      </div>
    </div>

    <!-- Modale de notation (étoiles) -->
    <div v-if="ratingModalOpen" class="modal-overlay" @click.self="ratingModalOpen = false">
      <div class="modal-content small">
        <h3>Noter "{{ selectedRatingResource?.title }}"</h3>
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
        <h3>Commentaires - {{ selectedResource?.title }}</h3>
        <div class="comments-list">
          <div v-for="c in currentComments" :key="c.id" class="comment-item">
            <strong>{{ c.userName }}</strong>
            <p>{{ c.content }}</p>
            <small>{{ formatDate(c.createdAt) }}</small>
            <button v-if="c.userId === currentUserId" @click="deleteComment(c.id)" class="delete-comment">🗑️</button>
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
        <h3>Programmer "{{ selectedResource?.title }}"</h3>
        <input type="datetime-local" v-model="scheduleDate" />
        <div class="modal-footer">
          <button @click="scheduleModalOpen = false">Annuler</button>
          <button class="primary" @click="submitSchedule">Programmer</button>
        </div>
      </div>
    </div>

    <!-- Toast surprise -->
    <div v-if="surpriseMessage" class="surprise-toast">🎉 {{ surpriseMessage }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

// Configuration API
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8082/api'
const api = axios.create({ baseURL: API_BASE })

// Utilisateur courant (à adapter selon votre authentification)
const currentUserId = ref(1)
const currentUserName = ref('Utilisateur') // à récupérer dynamiquement

// États
const resources = ref([])
const loading = ref(false)
const searchQuery = ref('')
const filters = ref({ type: '', age: '' })
const activeTab = ref('mine')
const modalOpen = ref(false)
const selectedResource = ref(null)
const createModalOpen = ref(false)
const createType = ref('')
const iaTheme = ref('')
const iaResult = ref('')
const surpriseMessage = ref('')

// État pour les étoiles
const ratingModalOpen = ref(false)
const selectedRatingResource = ref(null)
const ratingValue = ref(0)

// État pour les commentaires
const commentsModalOpen = ref(false)
const currentComments = ref([])
const newComment = ref('')

// État pour la programmation
const scheduleModalOpen = ref(false)
const scheduleDate = ref('')

// Helpers
const getTypeLabel = (type) => {
  const map = { fiche: '📄 Fiche activité', video: '🎥 Vidéo', pdf: '📚 PDF/Guide', bloc: '🧩 Blocs' }
  return map[type] || type
}
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR')
}

// Chargement des ressources
const fetchResources = async () => {
  loading.value = true
  try {
    const params = {
      type: filters.value.type || undefined,
      age: filters.value.age || undefined,
      search: searchQuery.value || undefined,
      owner: activeTab.value
    }
    const response = await api.get('/resources', {
      params,
      headers: { 'X-User-Id': currentUserId.value }
    })
    resources.value = response.data
  } catch (error) {
    console.error('Erreur chargement:', error)
  } finally {
    loading.value = false
  }
}

// Création d’une ressource (correction de l'erreur circulaire)
const createResource = async () => {
  try {
    const newResource = {
      title: `Nouvelle ${createType.value}`,
      description: 'Description à compléter',
      type: createType.value,
      age: '3-5 ans'
    }
    await api.post('/resources', newResource, {
      headers: { 'X-User-Id': currentUserId.value }
    })
    await fetchResources()
    createModalOpen.value = false
    createType.value = ''
  } catch (error) {
    console.error('Erreur création:', error)
  }
}

// Like
const sendLike = async (id) => {
  try {
    await api.post(`/resources/${id}/like`, {}, { headers: { 'X-User-Id': currentUserId.value } })
    const res = resources.value.find(r => r.id === id)
    if (res) res.likes++
  } catch (error) {
    console.error('Erreur like:', error)
  }
}

// Notation étoiles
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
  } catch (error) {
    console.error('Erreur notation:', error)
  }
}

// Commentaires
const openCommentsModal = async (res) => {
  selectedResource.value = res
  try {
    const response = await api.get(`/resources/${res.id}/comments`)
    currentComments.value = response.data
    commentsModalOpen.value = true
  } catch (error) {
    console.error('Erreur chargement commentaires:', error)
  }
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
  } catch (error) {
    console.error('Erreur ajout commentaire:', error)
  }
}
const deleteComment = async (commentId) => {
  try {
    await api.delete(`/resources/comments/${commentId}`, { headers: { 'X-User-Id': currentUserId.value } })
    currentComments.value = currentComments.value.filter(c => c.id !== commentId)
  } catch (error) {
    console.error('Erreur suppression commentaire:', error)
  }
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
  } catch (error) {
    console.error('Erreur programmation:', error)
  }
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
  } catch (error) {
    console.error('Export échoué:', error)
  }
}

// Aperçu
const previewResource = async (res) => {
  try {
    const response = await api.get(`/resources/${res.id}/content`)
    selectedResource.value = { ...res, fullContent: response.data.content }
    modalOpen.value = true
  } catch (error) {
    console.error('Erreur aperçu:', error)
    selectedResource.value = res
    modalOpen.value = true
  }
}

// Surprise hebdomadaire
const surpriseMode = async () => {
  try {
    const response = await api.get('/resources/surprise', { headers: { 'X-User-Id': currentUserId.value } })
    const surprise = response.data
    if (surprise) {
      surpriseMessage.value = `🎲 Surprise de la semaine : ${surprise.title} ! Envoyée aux parents.`
      setTimeout(() => surpriseMessage.value = '', 4000)
    } else {
      surpriseMessage.value = "Aucune ressource surprise cette semaine."
      setTimeout(() => surpriseMessage.value = '', 3000)
    }
  } catch (error) {
    console.error('Erreur surprise:', error)
  }
}

// Réinitialisation des filtres
const resetFilters = () => {
  searchQuery.value = ''
  filters.value = { type: '', age: '' }
  fetchResources()
}

// Génération IA (simulée)
const generateByIA = () => {
  if (!iaTheme.value.trim()) return
  iaResult.value = `✨ Fiche générée pour le thème "${iaTheme.value}" : objectifs, matériel, déroulé sur 30 min. (À sauvegarder ou modifier)`
}

const openCreateModal = () => {
  createModalOpen.value = true
  createType.value = ''
  iaTheme.value = ''
  iaResult.value = ''
}

// Watchers
watch([searchQuery, filters, activeTab], () => {
  fetchResources()
})

// Chargement initial
onMounted(() => {
  fetchResources()
})
</script>

<style scoped>
/* === Votre style original (non modifié) === */
.resources-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background: #fefaf5;
  min-height: 100vh;
  font-family: system-ui, 'Segoe UI', 'Roboto', sans-serif;
}
.resources-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.resources-header h1 {
  font-size: 1.8rem;
  color: #3e2c1f;
  font-weight: 700;
}
.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}
.search-bar {
  display: flex;
  background: white;
  border-radius: 40px;
  border: 1px solid #e2dcd5;
  overflow: hidden;
}
.search-bar input {
  border: none;
  padding: 0.5rem 1rem;
  width: 220px;
  outline: none;
}
.search-btn {
  background: #d2b48c;
  border: none;
  padding: 0 1rem;
  cursor: pointer;
  color: white;
}
.surprise-btn {
  background: #f0e2d0;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 40px;
  font-weight: bold;
  color: #3e2c1f;
  cursor: pointer;
  transition: 0.2s;
}
.surprise-btn:hover {
  background: #e0c8a8;
}
.filters-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}
.filters-bar select, .filter-clear {
  background: white;
  border: 1px solid #e2dcd5;
  border-radius: 30px;
  padding: 0.4rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
}
.filter-clear {
  background: #f5f0ea;
}
.tabs {
  display: flex;
  gap: 0.5rem;
  border-bottom: 2px solid #e2dcd5;
  margin-bottom: 1.5rem;
}
.tabs button {
  background: none;
  border: none;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  color: #7c6b57;
}
.tabs button.active {
  color: #3e2c1f;
  border-bottom: 3px solid #d2b48c;
  margin-bottom: -2px;
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
.resource-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.05);
  overflow: hidden;
  transition: 0.2s;
  border: 1px solid #f0e8df;
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
  background: #f3ede7;
  color: #5e4b34;
}
.card-badge.video {
  background: #e3f2fd;
  color: #0b5e7c;
}
.card-badge.pdf {
  background: #ffefdb;
  color: #b45f2b;
}
.card-badge.bloc {
  background: #e8f0e7;
  color: #2c6e2c;
}
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
.preview-blocks {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0.6rem 0;
}
.block-tag {
  background: #f0e2d0;
  padding: 0.2rem 0.6rem;
  border-radius: 16px;
  font-size: 0.7rem;
}
.video-thumb {
  position: relative;
  margin-top: 0.8rem;
  border-radius: 12px;
  overflow: hidden;
}
.video-thumb img {
  width: 100%;
  height: auto;
  display: block;
}
.play-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  background: rgba(0,0,0,0.6);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.4rem;
  cursor: pointer;
  color: white;
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
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  transition: 0.2s;
}
.fab:hover {
  background: #b89466;
  transform: scale(1.05);
}
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
}
.modal-content.large {
  max-width: 700px;
}
.modal-content.small {
  max-width: 400px;
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
.create-options {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1rem 0;
}
.option-card {
  background: #f8f3ed;
  border: none;
  padding: 1rem;
  border-radius: 20px;
  flex: 1;
  min-width: 140px;
  font-weight: bold;
  cursor: pointer;
}
.ia-panel {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.ia-panel input {
  padding: 0.6rem;
  border-radius: 30px;
  border: 1px solid #e2dcd5;
}
.ia-result {
  font-size: 0.8rem;
  color: #2c6e2c;
  background: #eef5e9;
  padding: 0.6rem;
  border-radius: 16px;
}
.surprise-toast {
  position: fixed;
  bottom: 80px;
  right: 20px;
  background: #3e2c1f;
  color: #d2b48c;
  padding: 0.8rem 1.2rem;
  border-radius: 40px;
  font-weight: bold;
  z-index: 1100;
  animation: fadeOut 4s forwards;
}
@keyframes fadeOut {
  0% { opacity: 1; transform: translateY(0); }
  70% { opacity: 1; }
  100% { opacity: 0; transform: translateY(-20px); visibility: hidden; }
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
.rating-stars span.active {
  opacity: 1;
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
  font-size: 0.8rem;
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
</style>