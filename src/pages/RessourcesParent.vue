<template>
  <div class="team-resources">
    <!-- En-tête avec titre et description -->
    <div class="resources-header">
      <div class="header-text">
        <h1>Ressources de l'équipe</h1>
        <p>Découvrez et partagez des contenus pédagogiques, fiches activités, vidéos et documents</p>
      </div>
    </div>

    <!-- Filtres -->
    <div class="filters-bar">
      <div class="filter-group">
        <span class="filter-label">
          <svg class="icon-small" viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M5.5 7A1.5 1.5 0 0 1 7 5.5h10A1.5 1.5 0 0 1 18.5 7 1.5 1.5 0 0 1 17 8.5H7A1.5 1.5 0 0 1 5.5 7zm2 5a1.5 1.5 0 0 1 1.5-1.5h6a1.5 1.5 0 0 1 0 3H9a1.5 1.5 0 0 1-1.5-1.5zm2 5a1.5 1.5 0 0 1 1.5-1.5h2a1.5 1.5 0 0 1 0 3h-2a1.5 1.5 0 0 1-1.5-1.5z"/>
          </svg>
          Type :
        </span>
        <div class="filter-pills">
          <button 
            v-for="opt in typeOptions" 
            :key="opt.value" 
            :class="['pill', { active: filters.type === opt.value }]" 
            @click="filters.type = opt.value">
            <svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" :d="opt.iconPath"/></svg>
            {{ opt.label }}
          </button>
        </div>
      </div>
      <div class="filter-group">
        <span class="filter-label">
          <svg class="icon-small" viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M12 2a9 9 0 0 0-9 9c0 4.17 2.84 7.67 6.69 8.69L12 22l2.31-2.31C18.16 18.67 21 15.17 21 11a9 9 0 0 0-9-9z"/>
          </svg>
          Âge cible :
        </span>
        <div class="filter-pills">
          <button 
            v-for="opt in ageOptions" 
            :key="opt.value" 
            :class="['pill', { active: filters.age === opt.value }]" 
            @click="filters.age = opt.value">
            <svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M12 2a9 9 0 0 0-9 9c0 4.17 2.84 7.67 6.69 8.69L12 22l2.31-2.31C18.16 18.67 21 15.17 21 11a9 9 0 0 0-9-9z"/></svg>
            {{ opt.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Grille de ressources -->
    <div v-if="loading" class="loading-spinner">
      <svg class="spin" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"/></svg>
      Chargement des ressources...
    </div>
    <div v-else class="resources-grid">
      <div v-for="res in filteredResources" :key="res.id" class="resource-card">
        <!-- Badge type -->
        <div class="card-badge" :class="res.type">
          <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" :d="badgeIconPath(res.type)"/></svg>
          {{ getTypeLabel(res.type) }}
        </div>

        <div class="card-content">
          <h3>{{ res.title }}</h3>
          <div class="meta">
            <span class="meta-item">
              <svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M12 2a9 9 0 0 0-9 9c0 4.17 2.84 7.67 6.69 8.69L12 22l2.31-2.31C18.16 18.67 21 15.17 21 11a9 9 0 0 0-9-9z"/></svg>
              {{ res.age }}
            </span>
            <span class="meta-item">
              <svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/></svg>
              {{ formatDate(res.createdAt) }}
            </span>
          </div>

          <!-- Media preview -->
          <div class="media-container">
            <video v-if="res.type === 'video' && res.fileType" controls :src="getFileUrl(res.id, res.updatedAt)" class="media-content"></video>
            <embed v-else-if="res.type === 'pdf' && res.fileType" :src="getFileUrl(res.id, res.updatedAt)" type="application/pdf" class="media-content" />
            <div v-else-if="res.type === 'video' && res.videoUrl" class="video-url-container">
              <video controls :src="res.videoUrl" class="media-content"></video>
            </div>
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
          </div>

          <!-- Lien PDF -->
          <div v-if="res.type === 'pdf' && res.fileType" class="pdf-link">
            <a :href="getFileUrl(res.id, res.updatedAt)" target="_blank">
              <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
              Ouvrir le PDF
            </a>
          </div>
        </div>

        <!-- Actions et feedbacks -->
        <div class="card-actions">
          <button @click="previewResource(res)" class="action-btn">
            <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
            Aperçu
          </button>
          <button @click="exportResource(res)" class="action-btn">
            <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
            Export ZIP
          </button>
          <div class="feedback-stats">
            <span class="stat-item">
              <svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              {{ res.likes }}
            </span>
            <span class="stat-item">
              <svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              {{ (res.averageRating || 0).toFixed(1) }} ({{ res.totalRatings || 0 }})
            </span>
          </div>
        </div>

        <div class="feedback-buttons">
          <button @click="sendLike(res.id)" class="fb-like" :disabled="likingInProgress === res.id">
            <svg v-if="!res.liked" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            J’ai adoré
          </button>
          <button @click="openRatingModal(res)" class="fb-star" :disabled="ratingSubmitting === res.id">
            <svg v-if="!res.userRated" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
            {{ res.userRated ? 'Noté' : 'Noter' }}
          </button>
          <button @click="toggleComments(res.id)" class="fb-comment">
            <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/></svg>
            Commentaires ({{ res.comments?.length || 0 }})
          </button>
        </div>

        <!-- Section commentaires -->
        <div v-if="showComments[res.id]" class="comments-section">
          <div class="comments-list">
            <div v-for="c in res.comments" :key="c.id" class="comment-item">
              <strong>
                <svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                {{ c.userName }}
              </strong>
              <p>{{ c.content }}</p>
              <small>
                <svg viewBox="0 0 24 24" width="10" height="10"><path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/></svg>
                {{ formatDate(c.createdAt) }}
              </small>
              <button v-if="c.userId === currentUserId" @click="confirmDeleteComment(res.id, c.id)" class="delete-comment">
                <svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
              </button>
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

      <div v-if="filteredResources.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" width="48" height="48"><path fill="currentColor" d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/></svg>
        <p>Aucune ressource trouvée.</p>
      </div>
    </div>

    <!-- Modale aperçu -->
    <div v-if="modalOpen" class="modal-overlay" @click.self="modalOpen = false">
      <div class="modal-content">
        <div class="modal-header stylized-header">
          <div class="header-icon">
            <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>
          </div>
          <h2>{{ selectedResource?.title }}</h2>
          <button class="close-modal" @click="modalOpen = false">
            <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>
        <div class="preview-body">
          <div class="preview-meta">
            <span class="meta-item">
              <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M12 2a9 9 0 0 0-9 9c0 4.17 2.84 7.67 6.69 8.69L12 22l2.31-2.31C18.16 18.67 21 15.17 21 11a9 9 0 0 0-9-9z"/></svg>
              Âge : {{ selectedResource?.age }}
            </span>
            <span class="meta-item">
              <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/></svg>
              Créé le : {{ formatDate(selectedResource?.createdAt) }}
            </span>
          </div>
          <div class="preview-description" v-html="selectedResource?.description || 'Aucune description'"></div>
        </div>
      </div>
    </div>

    <!-- Modale notation -->
    <div v-if="ratingModalOpen" class="modal-overlay" @click.self="ratingModalOpen = false">
      <div class="modal-content small">
        <div class="modal-header stylized-header">
          <div class="header-icon">
            <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
          </div>
          <h3>Noter "{{ selectedRatingResource?.title }}"</h3>
          <button class="close-modal" @click="ratingModalOpen = false">
            <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>
        <div class="rating-stars">
          <span v-for="star in 5" :key="star" @click="ratingValue = star" :class="{ active: star <= ratingValue }">
            <svg viewBox="0 0 24 24" width="32" height="32"><path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
          </span>
        </div>
        <div class="modal-footer">
          <button @click="ratingModalOpen = false">Annuler</button>
          <button class="primary" @click="submitRating" :disabled="ratingSubmitting === selectedRatingResource?.id">
            <svg v-if="ratingSubmitting !== selectedRatingResource?.id" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            <svg v-else class="spin" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"/></svg>
            Valider
          </button>
        </div>
      </div>
    </div>

    <!-- Confirmation suppression commentaire -->
    <div v-if="confirmCommentDelete.show" class="modal-overlay blur-bg" @click.self="confirmCommentDelete.show = false">
      <div class="modal-content confirm-modal">
        <div class="confirm-icon">
          <svg viewBox="0 0 24 24" width="48" height="48"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
        </div>
        <p>Voulez-vous vraiment supprimer ce commentaire ? Cette action est irréversible.</p>
        <div class="modal-footer centered">
          <button @click="confirmCommentDelete.show = false">Annuler</button>
          <button class="primary" @click="executeDeleteComment">Supprimer</button>
        </div>
      </div>
    </div>

    <!-- Toast notification -->
    <transition name="toast-fade">
      <div v-if="toastVisible" class="toast-notification">
        <div class="toast-line"></div>
        <div class="toast-content">
          <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
          {{ toastMessage }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

// Récupération utilisateur connecté
const user = JSON.parse(localStorage.getItem('user') || '{"id": 1, "nom": "Utilisateur"}')
const currentUserId = ref(user.id)
const currentUserName = ref(user.nom)

const API_BASE_URL = 'http://localhost:8082/api'

// États
const resources = ref([])
const loading = ref(false)
const filters = ref({ type: '', age: '' })
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

// Options filtres
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

// Filtrage local (seulement ressources partagées)
const filteredResources = computed(() => {
  let result = [...resources.value]
  if (filters.value.type) result = result.filter(r => r.type === filters.value.type)
  if (filters.value.age) result = result.filter(r => r.age === filters.value.age)
  return result
})

// Helpers
const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('fr-FR') : ''
const getFileUrl = (id, updatedAt = null) => `${API_BASE_URL}/resources/${id}/file?t=${updatedAt ? new Date(updatedAt).getTime() : Date.now()}`
const getTypeLabel = (type) => ({ fiche: 'Fiche activité', video: 'Vidéo', pdf: 'PDF', bloc: 'Bloc pédagogique' }[type] || type)
const badgeIconPath = (type) => ({
  fiche: 'M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10z',
  video: 'M18 9v4h-4V9h4zm-2 0h-2v2h2V9zm-8 4H4v-2h4v2zm0-4H4V7h4v2zm6 8h-2v-2h2v2zm2 0v-2h2v2h-2zm-8 0H6v-2h2v2zm10-4h-2v-2h2v2zm-6 0h-2v-2h2v2zm-6 0H4v-2h2v2z',
  pdf: 'M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10z',
  bloc: 'M4 6h16v2H4V6zm2-4h12v2H6V2zm16 8H2v2h20v-2zm-4 4H6v2h12v-2zm-4 4h-4v2h4v-2z'
}[type] || 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z')

const showToast = (msg) => {
  if (toastTimeout) clearTimeout(toastTimeout)
  toastMessage.value = msg
  toastVisible.value = true
  toastTimeout = setTimeout(() => toastVisible.value = false, 3000)
}

// Récupération des ressources partagées (équipe)
const fetchResources = async () => {
  loading.value = true
  try {
    const response = await axios.get(`${API_BASE_URL}/resources`, {
      params: { owner: 'shared' },
      headers: { 'X-User-Id': currentUserId.value }
    })
    resources.value = response.data.map(r => ({
      ...r,
      liked: r.liked || false,
      userRated: r.userRated || false,
      comments: r.comments || []
    }))
  } catch (error) {
    showToast('Erreur de chargement des ressources')
  } finally {
    loading.value = false
  }
}

// Like
const sendLike = async (id) => {
  const resource = resources.value.find(r => r.id === id)
  if (!resource || resource.liked) {
    if (resource?.liked) showToast('Vous avez déjà aimé cette ressource')
    return
  }
  likingInProgress.value = id
  try {
    await axios.post(`${API_BASE_URL}/resources/${id}/like`, {}, {
      headers: { 'X-User-Id': currentUserId.value }
    })
    await fetchResources()
    showToast('Merci pour votre ❤️')
  } catch (error) {
    showToast('Erreur like')
  } finally {
    likingInProgress.value = null
  }
}

// Notation
const openRatingModal = (res) => {
  if (res.userRated) {
    showToast('Vous avez déjà noté cette ressource')
    return
  }
  selectedRatingResource.value = res
  ratingValue.value = 0
  ratingModalOpen.value = true
}

const submitRating = async () => {
  if (ratingValue.value < 1) return
  const id = selectedRatingResource.value.id
  ratingSubmitting.value = id
  try {
    await axios.post(`${API_BASE_URL}/resources/${id}/rating`, { rating: ratingValue.value }, {
      headers: { 'X-User-Id': currentUserId.value }
    })
    await fetchResources()
    ratingModalOpen.value = false
    showToast('Note enregistrée ✓')
  } catch (error) {
    showToast('Erreur notation')
  } finally {
    ratingSubmitting.value = null
  }
}

// Commentaires
const toggleComments = async (resourceId) => {
  showComments.value[resourceId] = !showComments.value[resourceId]
  if (showComments.value[resourceId]) {
    const res = resources.value.find(r => r.id === resourceId)
    if (!res.comments || res.comments.length === 0) await fetchComments(resourceId)
  }
}

const fetchComments = async (resourceId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/resources/${resourceId}/comments`)
    const res = resources.value.find(r => r.id === resourceId)
    if (res) res.comments = response.data
  } catch (error) {
    console.error(error)
  }
}

const addComment = async (resourceId) => {
  const text = newCommentText.value[resourceId]
  if (!text || !text.trim()) return
  commentSubmitting.value[resourceId] = true
  try {
    await axios.post(`${API_BASE_URL}/resources/${resourceId}/comments`, { content: text }, {
      headers: { 'X-User-Id': currentUserId.value, 'X-User-Name': currentUserName.value }
    })
    await fetchComments(resourceId)
    newCommentText.value[resourceId] = ''
    showToast('Commentaire ajouté ✓')
  } catch (error) {
    showToast('Erreur ajout commentaire')
  } finally {
    commentSubmitting.value[resourceId] = false
  }
}

const confirmDeleteComment = (resourceId, commentId) => {
  confirmCommentDelete.value = { show: true, resourceId, commentId }
}

const executeDeleteComment = async () => {
  const { resourceId, commentId } = confirmCommentDelete.value
  confirmCommentDelete.value.show = false
  try {
    await axios.delete(`${API_BASE_URL}/resources/comments/${commentId}`, {
      headers: { 'X-User-Id': currentUserId.value }
    })
    const res = resources.value.find(r => r.id === resourceId)
    if (res) res.comments = res.comments.filter(c => c.id !== commentId)
    showToast('Commentaire supprimé')
  } catch (error) {
    showToast('Erreur suppression commentaire')
  }
}

// Export ZIP
const exportResource = async (res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/resources/${res.id}/export`, {
      responseType: 'blob',
      headers: { 'X-User-Id': currentUserId.value }
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${res.title}.zip`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    showToast('Export ZIP démarré')
  } catch (error) {
    showToast('Erreur export')
  }
}

// Aperçu
const previewResource = (res) => {
  selectedResource.value = res
  modalOpen.value = true
}

// Chargement initial
onMounted(() => {
  fetchResources()
})
</script>

<style scoped>
/* ===== STYLES INSPIRÉS DU THÈME COULEUR ===== */
.team-resources {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background: #F9F7F5;
  min-height: 100vh;
  font-family: system-ui, 'Segoe UI', 'Roboto', sans-serif;
}

/* En-tête */
.resources-header {
  margin-bottom: 2rem;
  text-align: center;
}
.header-text h1 {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3E2C1F 0%, #8B7355 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}
.header-text p {
  color: #6B5B4F;
  font-size: 1rem;
}

/* Barre de filtres */
.filters-bar {
  background: white;
  border-radius: 60px;
  padding: 0.8rem 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid #EFE9E4;
}
.filter-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.filter-label {
  font-weight: 500;
  color: #3E2C1F;
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
  background: #F9F7F5;
  border: 1px solid #EFE9E4;
  border-radius: 40px;
  padding: 0.3rem 0.9rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #3E2C1F;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}
.pill svg {
  width: 12px;
  height: 12px;
  color: #8B7355;
}
.pill.active {
  background: #D2B48C;
  border-color: #D2B48C;
  color: white;
}
.pill.active svg {
  color: white;
}
.pill:hover:not(.active) {
  background: #EFE9E4;
  transform: translateY(-1px);
}

/* Grille */
.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.8rem;
}
.loading-spinner {
  text-align: center;
  padding: 2rem;
  color: #D2B48C;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 24px;
  color: #8B7355;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid #EFE9E4;
}

/* Cartes */
.resource-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: all 0.25s ease;
  border: 1px solid #EFE9E4;
}
.resource-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  border-color: #D2B48C;
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
  background: #F0EDE9;
  color: #3E2C1F;
}
.card-badge.video { background: #E8E0D8; color: #8B5A2B; }
.card-badge.pdf { background: #F5E6D3; color: #B85C1A; }
.card-badge.bloc { background: #E0F0E8; color: #2E7D32; }
.card-content {
  padding: 0 1rem 1rem;
}
.card-content h3 {
  font-size: 1.2rem;
  margin: 0.5rem 0;
  color: #3E2C1F;
}
.meta {
  display: flex;
  gap: 1rem;
  font-size: 0.7rem;
  color: #8B7355;
  margin-bottom: 0.8rem;
  flex-wrap: wrap;
}
.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
}
.media-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  background: #F0EDE9;
  border-radius: 16px;
  overflow: hidden;
  margin: 0.5rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
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
  background: #F9F7F5;
  padding: 1rem;
  box-sizing: border-box;
  overflow-y: auto;
  text-align: center;
}
.description-icon {
  margin-bottom: 0.5rem;
  color: #D2B48C;
}
.description-text {
  font-size: 0.85rem;
  color: #3E2C1F;
  line-height: 1.4;
  margin: 0;
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
  background: #F0EDE9;
  color: #8B7355;
  gap: 0.5rem;
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
  color: #D2B48C;
  text-decoration: none;
}
.pdf-link a:hover {
  text-decoration: underline;
  color: #B8A070;
}
.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.8rem 1rem;
  border-top: 1px solid #EFE9E4;
  background: white;
  align-items: center;
}
.action-btn {
  background: none;
  border: 1px solid #D2B48C;
  padding: 0.2rem 0.7rem;
  border-radius: 30px;
  font-size: 0.7rem;
  cursor: pointer;
  transition: 0.1s;
  color: #D2B48C;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}
.action-btn svg {
  width: 14px;
  height: 14px;
  color: #8B7355;
}
.action-btn:hover {
  background: #D2B48C;
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
  color: #8B7355;
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
  border-top: 1px solid #EFE9E4;
  flex-wrap: wrap;
}
.fb-like, .fb-star, .fb-comment {
  background: none;
  border: none;
  font-size: 0.75rem;
  cursor: pointer;
  color: #D2B48C;
  transition: 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}
.fb-like:hover { color: #e74c3c; }
.fb-star:hover { color: #f39c12; }
.fb-comment:hover { color: #3E2C1F; }
.comments-section {
  padding: 0.8rem 1rem;
  background: #F9F7F5;
  border-top: 1px solid #EFE9E4;
}
.comments-list {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 0.5rem;
}
.comment-item {
  background: white;
  border-radius: 16px;
  padding: 0.4rem 0.6rem;
  margin-bottom: 0.5rem;
  position: relative;
  font-size: 0.75rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid #EFE9E4;
}
.comment-item strong {
  display: block;
  font-size: 0.7rem;
  color: #3E2C1F;
  margin-bottom: 0.2rem;
}
.comment-item p {
  margin: 0.2rem 0;
}
.comment-item small {
  font-size: 0.6rem;
  color: #8B7355;
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
  border-radius: 20px;
  border: 1px solid #EFE9E4;
  padding: 0.4rem;
  font-size: 0.7rem;
  resize: vertical;
  transition: 0.2s;
  background: white;
}
.add-comment textarea:focus {
  outline: none;
  border-color: #D2B48C;
  box-shadow: 0 0 0 2px rgba(210, 180, 140, 0.2);
}
.add-comment button.primary.small {
  padding: 0.3rem 0.8rem;
  font-size: 0.7rem;
  background: #D2B48C;
  border: none;
  color: white;
  border-radius: 40px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}
.add-comment button.primary.small:hover {
  background: #B8A070;
}
.no-comments {
  text-align: center;
  color: #B8A070;
  font-size: 0.7rem;
  padding: 0.5rem;
}

/* Toast */
.toast-notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 60px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  z-index: 1000;
  font-size: 0.9rem;
  font-weight: 500;
  overflow: hidden;
  max-width: 90%;
}
.toast-line {
  width: 4px;
  background-color: #D2B48C;
  align-self: stretch;
}
.toast-content {
  padding: 0.75rem 1.5rem;
  color: #3E2C1F;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.toast-fade-enter-active, .toast-fade-leave-active {
  transition: opacity 0.3s ease;
}
.toast-fade-enter-from, .toast-fade-leave-to {
  opacity: 0;
}

/* Modales */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-overlay.blur-bg {
  backdrop-filter: blur(4px);
  background: rgba(0, 0, 0, 0.3);
}
.modal-content {
  background: white;
  border-radius: 32px;
  max-width: 700px;
  width: 90%;
  padding: 1.5rem;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 35px rgba(0, 0, 0, 0.2);
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
  border-bottom: 1px solid #EFE9E4;
}
.modal-header.stylized-header {
  background: linear-gradient(135deg, #F0EDE9 0%, #E8E0D8 100%);
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
  color: #D2B48C;
}
.modal-header.stylized-header h2, .modal-header.stylized-header h3 {
  margin: 0;
  flex: 1;
  text-align: center;
  color: #3E2C1F;
  font-weight: 600;
}
.close-modal {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}
.close-modal svg {
  width: 24px;
  height: 24px;
  color: #8B7355;
  transition: 0.2s;
}
.close-modal:hover svg {
  color: #ef4444;
}
.confirm-icon {
  text-align: center;
  margin-bottom: 1rem;
  color: #D2B48C;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}
.modal-footer.centered {
  justify-content: center;
}
.modal-footer button {
  padding: 0.5rem 1rem;
  border-radius: 40px;
  border: 1px solid #D2B48C;
  background: white;
  cursor: pointer;
  color: #D2B48C;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  transition: 0.2s;
}
.modal-footer button.primary {
  background: #D2B48C;
  color: white;
  border: none;
}
.modal-footer button.primary:hover {
  background: #B8A070;
}
.modal-footer button:hover:not(.primary) {
  background: #F0EDE9;
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
  color: #8B7355;
}
.preview-description {
  background: #F9F7F5;
  padding: 1rem;
  border-radius: 16px;
  margin-bottom: 1rem;
  color: #3E2C1F;
}
.spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .team-resources {
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
}
</style>