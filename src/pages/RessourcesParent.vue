<template>
  <div class="resources-container">
    <!-- Filtres -->
    <div class="filters-bar">
      <div class="filter-group">
        <span class="filter-label"><svg class="icon-small" viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M5.5 7A1.5 1.5 0 0 1 7 5.5h10A1.5 1.5 0 0 1 18.5 7 1.5 1.5 0 0 1 17 8.5H7A1.5 1.5 0 0 1 5.5 7zm2 5a1.5 1.5 0 0 1 1.5-1.5h6a1.5 1.5 0 0 1 0 3H9a1.5 1.5 0 0 1-1.5-1.5zm2 5a1.5 1.5 0 0 1 1.5-1.5h2a1.5 1.5 0 0 1 0 3h-2a1.5 1.5 0 0 1-1.5-1.5z"/></svg> Type :</span>
        <div class="filter-pills">
          <button v-for="opt in typeOptions" :key="opt.value" :class="['pill', { active: filters.type === opt.value }]" @click="filters.type = opt.value; resetPagination()">
            <svg class="icon-small" viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" :d="opt.iconPath"/></svg>
            {{ opt.label }}
          </button>
        </div>
      </div>
      <div class="filter-group">
        <span class="filter-label"><svg class="icon-small" viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/></svg> Âge cible :</span>
        <div class="filter-pills">
          <button v-for="opt in ageOptions" :key="opt.value" :class="['pill', { active: filters.age === opt.value }]" @click="filters.age = opt.value; resetPagination()">
            <svg class="icon-small" viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M12 2a9 9 0 0 0-9 9c0 4.17 2.84 7.67 6.69 8.69L12 22l2.31-2.31C18.16 18.67 21 15.17 21 11a9 9 0 0 0-9-9z"/></svg>
            {{ opt.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Spinner de chargement -->
    <div v-if="loading && allResources.length === 0" class="loading-spinner-center">
      <div class="spinner-round"></div>
    </div>

    <!-- Grille des ressources -->
    <div v-else class="resources-grid">
      <div v-for="res in displayedResources" :key="res.id" class="resource-card">
        <div class="card-badge" :class="res.type">
          <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" :d="badgeIconPath(res.type)"/></svg>
          {{ getTypeLabel(res.type) }}
        </div>
        <div class="card-content">
          <h3>{{ res.title }}</h3>
          <div class="meta">
            <span class="meta-item"><svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M12 2a9 9 0 0 0-9 9c0 4.17 2.84 7.67 6.69 8.69L12 22l2.31-2.31C18.16 18.67 21 15.17 21 11a9 9 0 0 0-9-9z"/></svg> {{ res.age }}</span>
            <span class="meta-item"><svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/></svg> {{ formatDate(res.createdAt) }}</span>
            <span v-if="res.scheduledAt" class="meta-item scheduled-badge"><svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/></svg> Programmé le {{ formatDate(res.scheduledAt) }}</span>
          </div>
          <div class="media-container">
            <div v-if="!res.mediaLoaded" class="media-placeholder" @click="loadMedia(res)">
              <svg viewBox="0 0 24 24" width="32" height="32"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>
              <span>Charger l'aperçu</span>
            </div>
            <template v-else>
              <video v-if="res.type === 'video' && res.fileType" controls :src="getFileUrl(res.id, res.updatedAt)" class="media-content" preload="metadata"></video>
              <div v-else-if="res.type === 'video' && res.videoUrl" class="video-embed-container">
                <iframe v-if="isYouTubeUrl(res.videoUrl)" :src="getYouTubeEmbedUrl(res.videoUrl)" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="media-content" loading="lazy"></iframe>
                <iframe v-else-if="isVimeoUrl(res.videoUrl)" :src="getVimeoEmbedUrl(res.videoUrl)" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen class="media-content" loading="lazy"></iframe>
                <div v-else class="video-link-container">
                  <a :href="res.videoUrl" target="_blank" class="video-link">Voir la vidéo</a>
                </div>
              </div>
              <embed v-else-if="res.type === 'pdf' && res.fileType" :src="getFileUrl(res.id, res.updatedAt)" type="application/pdf" class="media-content" />
              <div v-else-if="res.type === 'fiche' || res.type === 'bloc'" class="description-container">
                <div class="description-icon">
                  <svg v-if="res.type === 'fiche'" viewBox="0 0 24 24" width="32" height="32"><path fill="currentColor" d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/></svg>
                  <svg v-else viewBox="0 0 24 24" width="32" height="32"><path fill="currentColor" d="M4 6h16v2H4V6zm2-4h12v2H6V2zm16 8H2v2h20v-2zm-4 4H6v2h12v-2zm-4 4h-4v2h4v-2z"/></svg>
                </div>
                <p class="description-text">{{ res.description }}</p>
              </div>
              <div v-else class="no-media-preview">
                <svg viewBox="0 0 24 24" width="48" height="48"><path fill="currentColor" d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/></svg>
                <span>Aucun aperçu</span>
              </div>
            </template>
          </div>
          <div v-if="res.type === 'pdf' && res.fileType" class="pdf-link">
            <a :href="getFileUrl(res.id, res.updatedAt)" target="_blank"><svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg> Ouvrir le PDF</a>
          </div>
        </div>

        <div class="card-actions">
          <button @click="previewResource(res)" class="action-btn"><svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg> Aperçu</button>
          <button @click="exportResource(res)" class="action-btn"><svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg> Export ZIP</button>
          <div class="feedback-stats">
            <span class="stat-item"><svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> {{ res.likes }}</span>
            <span class="stat-item"><svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg> {{ (res.averageRating || 0).toFixed(1) }} ({{ res.totalRatings || 0 }})</span>
          </div>
        </div>

        <div class="feedback-buttons">
          <button @click="sendLike(res.id)" class="fb-like" :disabled="likingInProgress === res.id">
            <svg v-if="!res.liked" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            J'ai adoré
          </button>
          <button @click="openRatingModal(res)" class="fb-star" :disabled="ratingSubmitting === res.id">
            <svg v-if="!res.userRated" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            {{ res.userRated ? 'Noté' : 'Noter' }}
          </button>
          <button @click="toggleComments(res.id)" class="fb-comment">
            <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/></svg>
            Commentaires ({{ res.commentsCount || 0 }})
          </button>
        </div>

        <div v-if="showComments[res.id]" class="comments-section">
          <div class="comments-list">
            <div v-for="c in (res.comments || [])" :key="c.id" class="comment-item">
              <strong><svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg> {{ c.userName }}</strong>
              <p>{{ c.content }}</p>
              <small>{{ formatDate(c.createdAt) }}</small>
              <button v-if="c.userId === currentUserId" @click="confirmDeleteComment(res.id, c.id)" class="delete-comment"><svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg></button>
            </div>
            <div v-if="!res.comments || res.comments.length === 0" class="no-comments">Aucun commentaire.</div>
          </div>
          <div class="add-comment">
            <textarea v-model="newCommentText[res.id]" placeholder="Ajouter un commentaire..."></textarea>
            <button @click="addComment(res.id)" class="primary small" :disabled="commentSubmitting[res.id]">
              <svg v-if="!commentSubmitting[res.id]" viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
              <svg v-else class="spin" viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"/></svg>
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination / Charger plus -->
    <div v-if="hasMore && !loading" class="load-more-container">
      <button @click="loadMore" class="load-more-btn">Charger plus de ressources</button>
    </div>
    <div v-if="loading && allResources.length > 0" class="loading-more"><div class="spinner-small"></div></div>

    <!-- Modale aperçu -->
    <div v-if="modalOpen" class="modal-overlay" @click.self="modalOpen = false">
      <div class="modal-content">
        <div class="modal-header stylized-header">
          <div class="header-icon"><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg></div>
          <h2>{{ selectedResource?.title }}</h2>
          <button class="close-modal" @click="modalOpen = false"><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></button>
        </div>
        <div class="preview-body">
          <div class="preview-meta">
            <span class="meta-item"><svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M12 2a9 9 0 0 0-9 9c0 4.17 2.84 7.67 6.69 8.69L12 22l2.31-2.31C18.16 18.67 21 15.17 21 11a9 9 0 0 0-9-9z"/></svg> Âge : {{ selectedResource?.age }}</span>
            <span class="meta-item"><svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/></svg> Créé le : {{ formatDate(selectedResource?.createdAt) }}</span>
          </div>
          <div class="preview-description" v-html="selectedResource?.description || 'Aucune description'"></div>
        </div>
      </div>
    </div>

    <!-- Modale notation -->
    <div v-if="ratingModalOpen" class="modal-overlay" @click.self="ratingModalOpen = false">
      <div class="modal-content small">
        <div class="modal-header stylized-header">
          <div class="header-icon"><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg></div>
          <h3>Noter "{{ selectedRatingResource?.title }}"</h3>
          <button class="close-modal" @click="ratingModalOpen = false"><svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></button>
        </div>
        <div class="rating-stars"><span v-for="star in 5" :key="star" @click="ratingValue = star" :class="{ active: star <= ratingValue }"><svg viewBox="0 0 24 24" width="32" height="32"><path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg></span></div>
        <div class="modal-footer"><button @click="ratingModalOpen = false">Annuler</button><button class="primary" @click="submitRating" :disabled="ratingSubmitting === selectedRatingResource?.id"><svg v-if="ratingSubmitting !== selectedRatingResource?.id" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg><svg v-else class="spin" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"/></svg> Valider</button></div>
      </div>
    </div>

    <!-- Confirmation suppression commentaire -->
    <div v-if="confirmCommentDelete.show" class="modal-overlay blur-bg" @click.self="confirmCommentDelete.show = false">
      <div class="modal-content confirm-modal">
        <div class="confirm-icon"><svg viewBox="0 0 24 24" width="48" height="48"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg></div>
        <p>Voulez-vous vraiment supprimer ce commentaire ? Cette action est irréversible.</p>
        <div class="modal-footer centered"><button @click="confirmCommentDelete.show = false">Annuler</button><button class="primary" @click="executeDeleteComment">Supprimer</button></div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="toast-fade"><div v-if="toastVisible" class="toast-notification"><div class="toast-blue-line"></div><div class="toast-content"><svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> {{ toastMessage }}</div></div></transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

const user = JSON.parse(localStorage.getItem('user') || '{"id": 1, "nom": "Utilisateur"}')
const currentUserId = ref(user.id)
const currentUserName = ref(user.nom)
const API_BASE_URL = 'http://localhost:8082/api'

// État principal
const allResources = ref([])
const displayedResources = ref([])
const loading = ref(false)
const page = ref(0)
const pageSize = 10
const hasMore = ref(true)
const filters = ref({ type: '', age: '' })

// Modales et interactions
const modalOpen = ref(false)
const selectedResource = ref(null)
const ratingModalOpen = ref(false)
const selectedRatingResource = ref(null)
const ratingValue = ref(0)
const likingInProgress = ref(null)
const ratingSubmitting = ref(null)
const toastVisible = ref(false)
const toastMessage = ref('')
let toastTimeout = null
const newCommentText = ref({})
const showComments = ref({})
const commentSubmitting = ref({})
const confirmCommentDelete = ref({ show: false, resourceId: null, commentId: null })

// Options des filtres
const typeOptions = [
  { value: '', label: 'Tous', iconPath: 'M4 6h16v2H4V6zm2-4h12v2H6V2zm16 8H2v2h20v-2zm-4 4H6v2h12v-2zm-4 4h-4v2h4v-2z' },
  { value: 'fiche', label: 'Fiche', iconPath: 'M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10z' },
  { value: 'video', label: 'Vidéo', iconPath: 'M18 9v4h-4V9h4zm-2 0h-2v2h2V9zm-8 4H4v-2h4v2zm0-4H4V7h4v2zm6 8h-2v-2h2v2zm2 0v-2h2v2h-2zm-8 0H6v-2h2v2zm10-4h-2v-2h2v2zm-6 0h-2v-2h2v2zm-6 0H4v-2h2v2z' },
  { value: 'pdf', label: 'PDF', iconPath: 'M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10z' },
  { value: 'bloc', label: 'Bloc', iconPath: 'M4 6h16v2H4V6zm2-4h12v2H6V2zm16 8H2v2h20v-2zm-4 4H6v2h12v-2zm-4 4h-4v2h4v-2z' }
]
const ageOptions = [
  { value: '', label: 'Tous âges', iconPath: 'M12 2a9 9 0 0 0-9 9c0 4.17 2.84 7.67 6.69 8.69L12 22l2.31-2.31C18.16 18.67 21 15.17 21 11a9 9 0 0 0-9-9z' },
  { value: '1-3', label: '1-3 ans', iconPath: 'M12 2a9 9 0 0 0-9 9c0 4.17 2.84 7.67 6.69 8.69L12 22l2.31-2.31C18.16 18.67 21 15.17 21 11a9 9 0 0 0-9-9z' },
  { value: '3-5', label: '3-5 ans', iconPath: 'M12 2a9 9 0 0 0-9 9c0 4.17 2.84 7.67 6.69 8.69L12 22l2.31-2.31C18.16 18.67 21 15.17 21 11a9 9 0 0 0-9-9z' },
  { value: '5-7', label: '5-7 ans', iconPath: 'M12 2a9 9 0 0 0-9 9c0 4.17 2.84 7.67 6.69 8.69L12 22l2.31-2.31C18.16 18.67 21 15.17 21 11a9 9 0 0 0-9-9z' },
  { value: 'Professionnel', label: 'Professionnel', iconPath: 'M12 2a9 9 0 0 0-9 9c0 4.17 2.84 7.67 6.69 8.69L12 22l2.31-2.31C18.16 18.67 21 15.17 21 11a9 9 0 0 0-9-9z' }
]

// Utilitaires
const formatFileSize = (bytes) => { if (bytes < 1024) return bytes + ' o'; if (bytes < 1024*1024) return (bytes/1024).toFixed(1)+' Ko'; return (bytes/(1024*1024)).toFixed(1)+' Mo' }
const getFileUrl = (id, updatedAt=null) => `${API_BASE_URL}/resources/${id}/file?t=${updatedAt ? new Date(updatedAt).getTime() : Date.now()}`
const badgeIconPath = (type) => ({ fiche:'M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10z', video:'M18 9v4h-4V9h4zm-2 0h-2v2h2V9zm-8 4H4v-2h4v2zm0-4H4V7h4v2zm6 8h-2v-2h2v2zm2 0v-2h2v2h-2zm-8 0H6v-2h2v2zm10-4h-2v-2h2v2zm-6 0h-2v-2h2v2zm-6 0H4v-2h2v2z', pdf:'M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10z', bloc:'M4 6h16v2H4V6zm2-4h12v2H6V2zm16 8H2v2h20v-2zm-4 4H6v2h12v-2zm-4 4h-4v2h4v-2z' }[type] || 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z')
const getTypeLabel = (type) => ({ fiche:'Fiche activité', video:'Vidéo', pdf:'PDF', bloc:'Blocs' }[type] || type)
const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('fr-FR') : ''
const showToast = (msg) => { if (toastTimeout) clearTimeout(toastTimeout); toastMessage.value = msg; toastVisible.value = true; toastTimeout = setTimeout(() => toastVisible.value = false, 3000) }

const isYouTubeUrl = (url) => url && (url.includes('youtube.com/watch') || url.includes('youtu.be/'))
const getYouTubeEmbedUrl = (url) => {
  let videoId = ''
  if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0]
  else { const match = url.match(/[?&]v=([^&]+)/); if (match) videoId = match[1] }
  return `https://www.youtube.com/embed/${videoId}`
}
const isVimeoUrl = (url) => url && url.includes('vimeo.com/')
const getVimeoEmbedUrl = (url) => `https://player.vimeo.com/video/${url.split('vimeo.com/')[1].split('?')[0]}`

// Chargement des ressources (propriétaire = 'shared')
const fetchAllResources = async () => {
  loading.value = true
  try {
    const response = await axios.get(`${API_BASE_URL}/resources`, {
      params: { owner: 'shared' },
      headers: { 'X-User-Id': currentUserId.value }
    })
    const resourcesData = response.data
    const commentPromises = resourcesData.map(async (r) => {
      try {
        const commentsRes = await axios.get(`${API_BASE_URL}/resources/${r.id}/comments`)
        return { id: r.id, comments: commentsRes.data }
      } catch (err) {
        return { id: r.id, comments: [] }
      }
    })
    const commentsResults = await Promise.all(commentPromises)
    const commentsMap = new Map(commentsResults.map(c => [c.id, c.comments]))
    
    allResources.value = resourcesData.map(r => ({
      ...r,
      liked: r.liked || false,
      userRated: r.userRated || false,
      comments: commentsMap.get(r.id) || [],
      commentsCount: commentsMap.get(r.id)?.length || 0,
      mediaLoaded: false,
      ownerId: r.ownerId || r.userId,
      ownerName: r.ownerName || r.userName
    }))
    resetPagination()
  } catch (error) {
    showToast('Erreur de chargement')
  } finally {
    loading.value = false
  }
}

// Pagination frontale
const resetPagination = () => {
  page.value = 0
  hasMore.value = true
  displayedResources.value = []
  loadMore()
}
const loadMore = () => {
  if (!hasMore.value) return
  const filtered = filterResources()
  const start = page.value * pageSize
  const end = start + pageSize
  const newItems = filtered.slice(start, end)
  displayedResources.value.push(...newItems)
  page.value++
  if (end >= filtered.length) hasMore.value = false
}
const filterResources = () => {
  let result = [...allResources.value]
  if (filters.value.type) result = result.filter(r => r.type === filters.value.type)
  if (filters.value.age) result = result.filter(r => r.age === filters.value.age)
  return result
}
watch([() => filters.value.type, () => filters.value.age], () => {
  resetPagination()
})

// Lazy loading des médias
const loadMedia = (res) => { res.mediaLoaded = true }

// Like
const sendLike = async (id) => {
  const resource = allResources.value.find(r => r.id === id)
  if (!resource || resource.liked) { if (resource?.liked) showToast('Vous avez déjà aimé cette ressource'); return }
  likingInProgress.value = id
  try {
    await axios.post(`${API_BASE_URL}/resources/${id}/like`, {}, { headers: { 'X-User-Id': currentUserId.value } })
    resource.liked = true
    resource.likes = (resource.likes || 0) + 1
    showToast('Merci pour votre ❤️')
  } catch (error) { showToast('Erreur like') }
  finally { likingInProgress.value = null }
}

// Notation
const openRatingModal = (res) => {
  if (res.userRated) { showToast('Vous avez déjà noté cette ressource'); return }
  selectedRatingResource.value = res
  ratingValue.value = 0
  ratingModalOpen.value = true
}
const submitRating = async () => {
  if (ratingValue.value < 1) return
  const id = selectedRatingResource.value.id
  ratingSubmitting.value = id
  try {
    await axios.post(`${API_BASE_URL}/resources/${id}/rating`, { rating: ratingValue.value }, { headers: { 'X-User-Id': currentUserId.value } })
    const res = allResources.value.find(r => r.id === id)
    if (res) {
      const oldTotal = res.totalRatings || 0
      const oldAvg = res.averageRating || 0
      res.averageRating = (oldAvg * oldTotal + ratingValue.value) / (oldTotal + 1)
      res.totalRatings = oldTotal + 1
      res.userRated = true
    }
    ratingModalOpen.value = false
    showToast('Note enregistrée ✓')
  } catch (error) { showToast('Erreur notation') }
  finally { ratingSubmitting.value = null }
}

// Commentaires
const toggleComments = (resourceId) => {
  showComments.value[resourceId] = !showComments.value[resourceId]
}
const addComment = async (resourceId) => {
  const text = newCommentText.value[resourceId]
  if (!text?.trim()) return
  commentSubmitting.value[resourceId] = true
  try {
    await axios.post(`${API_BASE_URL}/resources/${resourceId}/comments`, { content: text }, { headers: { 'X-User-Id': currentUserId.value, 'X-User-Name': currentUserName.value } })
    const commentsRes = await axios.get(`${API_BASE_URL}/resources/${resourceId}/comments`)
    const res = allResources.value.find(r => r.id === resourceId)
    if (res) { res.comments = commentsRes.data; res.commentsCount = commentsRes.data.length }
    newCommentText.value[resourceId] = ''
    showToast('Commentaire ajouté ✓')
  } catch (error) { showToast('Erreur ajout commentaire') }
  finally { commentSubmitting.value[resourceId] = false }
}
const confirmDeleteComment = (resourceId, commentId) => { confirmCommentDelete.value = { show: true, resourceId, commentId } }
const executeDeleteComment = async () => {
  const { resourceId, commentId } = confirmCommentDelete.value
  confirmCommentDelete.value.show = false
  try {
    await axios.delete(`${API_BASE_URL}/resources/comments/${commentId}`, { headers: { 'X-User-Id': currentUserId.value } })
    const res = allResources.value.find(r => r.id === resourceId)
    if (res) res.comments = res.comments.filter(c => c.id !== commentId)
    showToast('Commentaire supprimé')
  } catch (error) { showToast('Erreur suppression commentaire') }
}

// Export
const exportResource = async (res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/resources/${res.id}/export`, { responseType: 'blob', headers: { 'X-User-Id': currentUserId.value } })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${res.title}.zip`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    showToast('Export ZIP démarré')
  } catch (error) { showToast('Erreur export') }
}

// Aperçu
const previewResource = (res) => { selectedResource.value = res; modalOpen.value = true }

onMounted(() => {
  fetchAllResources()
})
onUnmounted(() => {
  if (toastTimeout) clearTimeout(toastTimeout)
})
</script>

<style scoped>
/* Styles café (identiques aux précédents) */
.resources-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  min-height: 100vh;
  font-family: system-ui, 'Segoe UI', 'Roboto', sans-serif;
}
.filters-bar {
  background: #F8F4F0;
  border-radius: 60px;
  padding: 0.8rem 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.filter-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.filter-label {
  font-weight: 500;
  color: #4A3520;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}
.filter-pills {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.pill {
  background: white;
  border: 1px solid #E2D4C8;
  border-radius: 40px;
  padding: 0.3rem 0.9rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #4A3520;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}
.pill svg {
  width: 12px;
  height: 12px;
  color: #8B5A2B;
}
.pill.active {
  background: #8B5A2B;
  border-color: #8B5A2B;
  color: white;
}
.pill.active svg {
  color: white;
}
.pill:hover:not(.active) {
  background: #F5EBE0;
  transform: translateY(-1px);
}
.loading-spinner-center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}
.spinner-round {
  width: 48px;
  height: 48px;
  border: 4px solid #F5EBE0;
  border-top-color: #8B5A2B;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
.spinner-small {
  width: 20px;
  height: 20px;
  border: 2px solid #F5EBE0;
  border-top-color: #8B5A2B;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.8rem;
}
.empty-state {
  text-align: center;
  padding: 3rem;
  background: #F8F4F0;
  border-radius: 24px;
  color: #8B5A2B;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.resource-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  overflow: hidden;
  transition: all 0.25s ease;
  border: 1px solid #E2D4C8;
  position: relative;
}
.resource-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.1);
  border-color: #D4BBA5;
}
.card-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin: 1rem 1rem 0 1rem;
  padding: 0.2rem 0.8rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: bold;
  background: #F5EBE0;
  color: #8B5A2B;
}
.card-badge.video {
  background: #F0E2D4;
  color: #6F4E37;
}
.card-badge.pdf {
  background: #F5EBE0;
  color: #8B5A2B;
}
.card-badge.bloc {
  background: #F0E2D4;
  color: #5C3A1E;
}
.card-content {
  padding: 0 1rem 1rem;
}
.card-content h3 {
  font-size: 1.2rem;
  margin: 0.5rem 0;
  color: #2C1A0E;
}
.meta {
  display: flex;
  gap: 1rem;
  font-size: 0.7rem;
  color: #8B5A2B;
  margin-bottom: 0.8rem;
  flex-wrap: wrap;
}
.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
}
.scheduled-badge {
  color: #8B5A2B;
  font-weight: 500;
}
.media-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  background: #F8F4F0;
  border-radius: 12px;
  overflow: hidden;
  margin: 0.5rem 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.media-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #F5EBE0;
  color: #8B5A2B;
  cursor: pointer;
  gap: 0.5rem;
  font-size: 0.8rem;
}
.media-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  object-fit: contain;
  background: #000;
}
.video-embed-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.video-embed-container iframe {
  width: 100%;
  height: 100%;
}
.video-link-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F8F4F0;
}
.video-link {
  padding: 0.5rem 1rem;
  background: #8B5A2B;
  color: white;
  border-radius: 30px;
  text-decoration: none;
  font-size: 0.8rem;
}
.video-link:hover {
  background: #5C3A1E;
}
.description-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #F8F4F0;
  padding: 1rem;
  box-sizing: border-box;
  overflow-y: auto;
  text-align: center;
}
.description-icon {
  margin-bottom: 0.5rem;
  color: #8B5A2B;
}
.description-text {
  font-size: 0.85rem;
  color: #4A3520;
  line-height: 1.4;
  margin: 0;
  max-height: 100%;
  overflow-y: auto;
}
.no-media-preview {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #F8F4F0;
  color: #8B5A2B;
  gap: 0.5rem;
}
.no-media-preview svg {
  color: #C4A484;
}
.no-media-preview span {
  font-size: 0.8rem;
}
.pdf-link {
  margin-top: 0.5rem;
  text-align: center;
}
.pdf-link a {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  color: #8B5A2B;
  text-decoration: none;
}
.pdf-link a:hover {
  text-decoration: underline;
}
.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.8rem 1rem;
  border-top: 1px solid #E2D4C8;
  background: #FEFCF8;
  align-items: center;
}
.action-btn {
  background: none;
  border: 1px solid #8B5A2B;
  padding: 0.2rem 0.7rem;
  border-radius: 30px;
  font-size: 0.7rem;
  cursor: pointer;
  transition: 0.1s;
  color: #8B5A2B;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}
.action-btn svg {
  width: 14px;
  height: 14px;
  color: #4A3520;
}
.action-btn:hover {
  background: #8B5A2B;
  color: white;
}
.action-btn:hover svg {
  color: white;
}
.feedback-stats {
  margin-left: auto;
  display: flex;
  gap: 0.6rem;
  font-size: 0.7rem;
  color: #8B5A2B;
}
.stat-item {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
}
.feedback-buttons {
  display: flex;
  gap: 0.8rem;
  padding: 0.6rem 1rem;
  background: #FEFCF8;
  border-top: 1px solid #E2D4C8;
  flex-wrap: wrap;
}
.fb-like, .fb-star, .fb-comment {
  background: none;
  border: none;
  font-size: 0.75rem;
  cursor: pointer;
  color: #8B5A2B;
  transition: 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}
.fb-like svg, .fb-star svg, .fb-comment svg {
  width: 14px;
  height: 14px;
}
.fb-like:hover {
  color: #C0392B;
}
.fb-like:hover svg {
  color: #C0392B;
}
.fb-star:hover {
  color: #f39c12;
}
.fb-comment:hover {
  color: #5C3A1E;
}
.comments-section {
  padding: 0.8rem 1rem;
  background: #F8F4F0;
  border-top: 1px solid #E2D4C8;
}
.comments-list {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 0.5rem;
}
.comment-item {
  background: white;
  border-radius: 12px;
  padding: 0.4rem 0.6rem;
  margin-bottom: 0.5rem;
  position: relative;
  font-size: 0.75rem;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.comment-item strong {
  display: block;
  font-size: 0.7rem;
  color: #5C3A1E;
  margin-bottom: 0.2rem;
}
.comment-item p {
  margin: 0.2rem 0;
}
.comment-item small {
  font-size: 0.6rem;
  color: #8B5A2B;
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
}
.delete-comment {
  position: absolute;
  top: 0.2rem;
  right: 0.2rem;
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.6;
}
.delete-comment svg {
  width: 12px;
  height: 12px;
  color: #8B5A2B;
}
.delete-comment:hover {
  opacity: 1;
}
.add-comment {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  margin-top: 0.5rem;
}
.add-comment textarea {
  flex: 1;
  border-radius: 16px;
  border: 1px solid #D4BBA5;
  padding: 0.4rem;
  font-size: 0.7rem;
  resize: vertical;
  transition: 0.2s;
}
.add-comment textarea:focus {
  outline: none;
  border-color: #8B5A2B;
  box-shadow: 0 0 0 2px rgba(139,90,43,0.1);
}
.add-comment button.primary.small {
  padding: 0.3rem 0.8rem;
  font-size: 0.7rem;
  background: #8B5A2B;
  border: none;
  color: white;
  border-radius: 40px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}
.add-comment button.primary.small:hover {
  background: #5C3A1E;
}
.no-comments {
  text-align: center;
  color: #C4A484;
  font-size: 0.7rem;
  padding: 0.5rem;
}
.load-more-container {
  text-align: center;
  margin-top: 2rem;
}
.load-more-btn {
  background: #F5EBE0;
  border: 1px solid #8B5A2B;
  padding: 0.5rem 1.5rem;
  border-radius: 40px;
  color: #8B5A2B;
  font-weight: 500;
  cursor: pointer;
  transition: 0.2s;
}
.load-more-btn:hover {
  background: #8B5A2B;
  color: white;
}
.loading-more {
  text-align: center;
  margin-top: 1rem;
  color: #8B5A2B;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.toast-notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  z-index: 1000;
  font-size: 0.9rem;
  font-weight: 500;
  overflow: hidden;
  min-width: 200px;
  max-width: 90%;
}
.toast-blue-line {
  width: 4px;
  background-color: #8B5A2B;
  align-self: stretch;
}
.toast-content {
  padding: 0.75rem 1.5rem;
  color: #2C1A0E;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.toast-content svg {
  color: #8B5A2B;
}
.toast-fade-enter-active, .toast-fade-leave-active {
  transition: opacity 0.3s ease;
}
.toast-fade-enter-from, .toast-fade-leave-to {
  opacity: 0;
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
.modal-overlay.blur-bg {
  backdrop-filter: blur(4px);
  background: rgba(0,0,0,0.3);
}
.modal-content {
  background: white;
  border-radius: 32px;
  max-width: 700px;
  width: 90%;
  padding: 1.5rem;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 35px rgba(0,0,0,0.2);
}
.modal-content.small {
  max-width: 400px;
}
.modal-content.confirm-modal {
  text-align: center;
  max-width: 400px;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #E2D4C8;
}
.modal-header.stylized-header {
  background: linear-gradient(135deg, #F5EBE0 0%, #E8D8C8 100%);
  margin: -1.5rem -1.5rem 1.5rem -1.5rem;
  padding: 1rem 1.5rem;
  border-radius: 32px 32px 0 0;
  border-bottom: none;
}
.modal-header.stylized-header .header-icon {
  background: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8B5A2B;
}
.modal-header.stylized-header h2, .modal-header.stylized-header h3 {
  margin: 0;
  flex: 1;
  text-align: center;
  color: #5C3A1E;
  font-weight: 600;
}
.modal-header.stylized-header .close-modal {
  background: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-header.stylized-header .close-modal svg {
  width: 18px;
  height: 18px;
}
.close-modal {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  transition: 0.2s;
}
.close-modal svg {
  width: 24px;
  height: 24px;
  color: #8B5A2B;
  transition: 0.2s;
}
.close-modal:hover svg {
  color: #ef4444;
}
.confirm-icon {
  text-align: center;
  margin-bottom: 1rem;
  color: #8B5A2B;
}
.confirm-icon svg {
  color: #8B5A2B;
}
.modal-footer.centered {
  justify-content: center;
}
.rating-stars {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
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
.rating-stars span svg {
  width: 32px;
  height: 32px;
  color: #f39c12;
}
.preview-body {
  margin-bottom: 1rem;
}
.preview-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  color: #8B5A2B;
}
.preview-description {
  background: #F8F4F0;
  padding: 1rem;
  border-radius: 16px;
  margin-bottom: 1rem;
}
.spin {
  animation: spin 1s linear infinite;
}
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
  .toast-notification {
    white-space: normal;
    text-align: center;
    max-width: 90%;
  }
  .modal-header.stylized-header .header-icon {
    width: 32px;
    height: 32px;
  }
  .modal-header.stylized-header h2, .modal-header.stylized-header h3 {
    font-size: 1.1rem;
  }
}
</style>