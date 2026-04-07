<template>
  <div class="feed-container">
    <!-- En-tête supprimé -->

    <div v-if="isLoading" class="loading-container">
      <div class="spinner"></div>
      <p>Chargement des publications...</p>
    </div>

    <div v-else-if="posts.length === 0" class="no-posts">
      <svg class="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      <p>Aucune publication pour le moment</p>
    </div>

    <div v-else class="posts-list">
      <div v-for="post in posts" :key="post.id" class="post-card">
        <!-- En-tête du post -->
        <div class="post-header">
          <div class="user-info">
            <div class="avatar">
              {{ post.user?.nom?.charAt(0).toUpperCase() || 'U' }}
            </div>
            <div class="user-details">
              <div class="name">{{ post.user?.nom || 'Utilisateur' }}</div>
              <div class="role">{{ post.user?.role || 'Membre' }}</div>
              <div class="date">{{ formatDate(post.createdAt) }}</div>
            </div>
          </div>
          <button @click="showAuthRequiredMessage('message')" class="message-user-btn">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>Message</span>
          </button>
        </div>

        <!-- Contenu -->
        <div class="post-content">
          <p>{{ post.contenu }}</p>
        </div>

        <!-- Image -->
        <div v-if="post.imageData" class="post-image">
          <img :src="`data:${post.imageType};base64,${post.imageData}`" alt="Image du post">
        </div>

        <!-- Fichier -->
        <div v-if="post.fileData" class="post-file">
          <a :href="`data:${post.fileType};base64,${post.fileData}`" :download="post.fileName" class="file-link">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {{ post.fileName }}
          </a>
        </div>

        <!-- Actions (désactivées) -->
        <div class="post-actions">
          <button @click="showAuthRequiredMessage('like')" class="action-btn">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            <span>{{ post.likesCount || 0 }} J'aime</span>
          </button>
          
          <button @click="showAuthRequiredMessage('comment')" class="action-btn">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            <span>{{ post.commentsCount || 0 }} Commentaires</span>
          </button>
        </div>

        <!-- Section des commentaires (désactivée) -->
        <div v-if="activeComments === post.id" class="comments-section">
          <div class="comments-list">
            <div v-for="comment in post.comments" :key="comment.id" class="comment-item">
              <div class="comment-avatar">
                {{ comment.user?.nom?.charAt(0).toUpperCase() || 'U' }}
              </div>
              <div class="comment-content">
                <div class="comment-author">{{ comment.user?.nom || 'Utilisateur' }}</div>
                <div class="comment-text">{{ comment.contenu }}</div>
                <div class="comment-time">{{ formatTime(comment.createdAt) }}</div>
              </div>
            </div>
            <div v-if="!post.comments?.length" class="no-comments">
              Aucun commentaire.
            </div>
          </div>
          
          <div class="comment-input-area">
            <div class="comment-avatar small">
              ?
            </div>
            <input 
              type="text"
              placeholder="Connectez-vous pour commenter..."
              class="comment-input disabled"
              disabled
            >
            <button class="comment-send-btn disabled" disabled>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'authentification transparent avec icône centrée -->
    <div v-if="showAuthModal" class="modal-overlay" @click.self="closeAuthModal">
      <div class="auth-modal glass-modal">
        <div class="auth-modal-icon">
          <svg class="w-16 h-16 text-[#D2B48C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3>Connexion requise</h3>
        <p>{{ authMessage }}</p>
        <div class="auth-modal-buttons">
          <button @click="closeAuthModal" class="cancel-btn">Annuler</button>
          <button @click="goToLogin" class="confirm-btn">Se connecter</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

// États
const posts = ref<any[]>([])
const isLoading = ref(false)
const activeComments = ref<number | null>(null)
const showAuthModal = ref(false)
const authMessage = ref('')
const pendingAction = ref('')

// API
const api = axios.create({
  baseURL: 'http://localhost:8082/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Afficher le message d'authentification requise
const showAuthRequiredMessage = (action: string) => {
  switch(action) {
    case 'like':
      authMessage.value = 'Vous devez être connecté pour aimer une publication.'
      break
    case 'comment':
      authMessage.value = 'Vous devez être connecté pour commenter une publication.'
      break
    case 'message':
      authMessage.value = 'Vous devez être connecté pour envoyer un message.'
      break
    default:
      authMessage.value = 'Vous devez être connecté pour effectuer cette action.'
  }
  pendingAction.value = action
  showAuthModal.value = true
}

// Fermer le modal
const closeAuthModal = () => {
  showAuthModal.value = false
  pendingAction.value = ''
}

// Rediriger vers la page de connexion
const goToLogin = () => {
  localStorage.setItem('redirectAfterLogin', window.location.pathname)
  router.push('/connexion')
}

// Toggle commentaires
const toggleComments = (postId: number) => {
  if (!isAuthenticated()) {
    showAuthRequiredMessage('comment')
    return
  }
  activeComments.value = activeComments.value === postId ? null : postId
}

// Vérifier si l'utilisateur est authentifié (toujours faux pour cette page)
const isAuthenticated = () => {
  return false
}

// Récupérer tous les posts
const fetchPosts = async () => {
  isLoading.value = true
  try {
    const response = await api.get('/posts/all-posts')
    console.log('Posts reçus:', response.data)
    if (response.data.success) {
      posts.value = response.data.posts
    }
  } catch (error) {
    console.error('Erreur chargement posts:', error)
  } finally {
    isLoading.value = false
  }
}

// Formater la date
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 3600000) {
    return `il y a ${Math.floor(diff / 60000)} min`
  } else if (diff < 86400000) {
    return `aujourd'hui à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
  } else {
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }
}

// Formater le temps court
const formatTime = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  fetchPosts()
})
</script>

<style scoped>
.feed-container {
  /* Largeur encore plus grande */
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  background: #f8f9fa;
  /* Bords arrondis sur les quatre coins */
  border-radius: 32px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: #adb5bd;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e9ecef;
  border-top-color: #D2B48C;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.no-posts {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  background: white;
  border-radius: 32px;
  color: #adb5bd;
  gap: 16px;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Carte de publication : bords très arrondis */
.post-card {
  background: white;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.post-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, #D2B48C, #3E2C1F);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 20px;
}

.user-details .name {
  font-weight: 700;
  font-size: 16px;
  color: #3E2C1F;
  margin-bottom: 4px;
}

.user-details .role {
  font-size: 12px;
  color: #D2B48C;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.user-details .date {
  font-size: 11px;
  color: #adb5bd;
  margin-top: 2px;
}

.message-user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 40px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #3E2C1F;
  transition: all 0.2s;
}

.message-user-btn:hover {
  background: #D2B48C;
  color: white;
  border-color: #D2B48C;
}

.post-content {
  padding: 4px 20px 20px;
}

.post-content p {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: #2c3e50;
}

.post-image {
  width: 100%;
  background: #f8f9fa;
}

.post-image img {
  width: 100%;
  max-height: 500px;
  object-fit: cover;
}

.post-file {
  padding: 14px 20px;
  background: #f8f9fa;
  margin: 0 20px 20px;
  border-radius: 20px;
}

.file-link {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #D2B48C;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}

.file-link:hover {
  color: #3E2C1F;
}

.post-actions {
  display: flex;
  gap: 20px;
  padding: 14px 20px;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 40px;
  font-size: 14px;
  font-weight: 500;
  color: #6c757d;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f8f9fa;
  color: #D2B48C;
}

.comments-section {
  padding: 20px;
  background: #fafbfc;
}

.comments-list {
  max-height: 350px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.comment-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #e9ecef;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #D2B48C, #3E2C1F);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
  flex-shrink: 0;
}

.comment-avatar.small {
  width: 36px;
  height: 36px;
  font-size: 14px;
}

.comment-content {
  flex: 1;
}

.comment-author {
  font-weight: 700;
  font-size: 13px;
  color: #3E2C1F;
  margin-bottom: 4px;
}

.comment-text {
  font-size: 14px;
  color: #495057;
  line-height: 1.4;
}

.comment-time {
  font-size: 11px;
  color: #adb5bd;
  margin-top: 4px;
}

.no-comments {
  text-align: center;
  padding: 24px;
  color: #adb5bd;
  font-size: 14px;
}

.comment-input-area {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
}

.comment-input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #e9ecef;
  border-radius: 40px;
  outline: none;
  font-size: 14px;
  transition: border 0.2s;
}

.comment-input.disabled {
  background: #f8f9fa;
  cursor: not-allowed;
  color: #adb5bd;
}

.comment-send-btn {
  background: #D2B48C;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: white;
}

.comment-send-btn.disabled {
  background: #adb5bd;
  cursor: not-allowed;
}

/* Modal transparent style glassmorphisme - icône centrée */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.glass-modal {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 48px;
  padding: 40px 32px;
  width: 90%;
  max-width: 380px;
  text-align: center;
  animation: fadeIn 0.2s ease;
  border: 1px solid rgba(210, 180, 140, 0.4);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Centrage de l'icône */
.auth-modal-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
}

.glass-modal h3 {
  margin: 0 0 12px 0;
  font-size: 24px;
  font-weight: 700;
  color: #3E2C1F;
}

.glass-modal p {
  margin: 0 0 28px 0;
  font-size: 15px;
  color: #5a3e2a;
  line-height: 1.5;
}

.auth-modal-buttons {
  display: flex;
  gap: 16px;
}

.cancel-btn, .confirm-btn {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 60px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.2s;
}

.cancel-btn {
  background: rgba(0, 0, 0, 0.05);
  color: #3E2C1F;
  backdrop-filter: blur(4px);
}

.cancel-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.confirm-btn {
  background: rgba(210, 180, 140, 0.9);
  color: white;
}

.confirm-btn:hover {
  background: #D2B48C;
  transform: scale(1.02);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Scrollbar */
.comments-list::-webkit-scrollbar {
  width: 6px;
}

.comments-list::-webkit-scrollbar-track {
  background: #e9ecef;
  border-radius: 6px;
}

.comments-list::-webkit-scrollbar-thumb {
  background: #D2B48C;
  border-radius: 6px;
}

/* Responsive */
@media (max-width: 768px) {
  .feed-container {
    max-width: 100%;
    padding: 16px;
    border-radius: 24px;
  }
  
  .post-card {
    border-radius: 24px;
  }
  
  /* Important : le header reste en ligne (pas de colonne) */
  .post-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
  }
  
  /* Le bouton Message reste à droite, sur la même ligne */
  .message-user-btn {
    padding: 8px 10px;
    flex-shrink: 0;
  }
  
  /* On cache le texte, on garde seulement l'icône */
  .message-user-btn span {
    display: none;
  }
  
  /* Ajustement de l'icône si besoin */
  .message-user-btn svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  .action-btn span {
    font-size: 12px;
  }
  
  .action-btn {
    padding: 6px 12px;
  }
  
  .glass-modal {
    padding: 32px 24px;
    border-radius: 32px;
  }
  
  .glass-modal h3 {
    font-size: 20px;
  }
}
</style>