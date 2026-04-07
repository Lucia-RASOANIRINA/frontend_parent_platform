<template>
  <div class="w-full font-sans antialiased bg-white min-h-screen">
    
    <!-- Notification Toast -->
    <transition name="notify-slow">
      <div v-if="alert.show" 
        class="fixed top-6 right-4 left-4 md:left-auto md:right-8 md:w-80 z-[100] flex items-center gap-4 px-5 py-4 rounded-2xl shadow-2xl border border-[#F3EEEA] bg-white/95 backdrop-blur-md"
      >
        <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <div class="flex-grow">
          <p class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Notification</p>
          <p class="text-xs font-bold text-[#3E2C1F]">{{ alert.message }}</p>
        </div>

        <button @click="alert.show = false" class="text-gray-300 hover:text-gray-400 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="2.5"/></svg>
        </button>
      </div>
    </transition>

    <!-- Formulaire de création de post -->
    <div class="max-w-4xl mx-auto px-4 py-6">
      <div class="flex items-start gap-4">
        
        <div class="flex-shrink-0">
          <div 
            @click.stop="toggleUserInfoBox(user, $event)"
            class="w-12 h-12 rounded-2xl bg-[#FDFBF9] border border-[#EFE9E4] flex items-center justify-center text-[#3E2C1F] font-black text-sm shadow-sm transition-all duration-500 hover:border-[#D2B48C] hover:scale-105 cursor-pointer"
          >
            {{ userInitials }}
          </div>
        </div>

        <div class="flex-grow">
          <div class="relative group border-b border-[#F3EEEA] transition-all duration-500" :class="{ 'border-[#D2B48C]': isExpanded }">
            <textarea 
              v-model="formData.contenu" 
              @focus="isExpanded = true"
              placeholder="Partagez quelque chose..." 
              class="w-full bg-transparent border-none text-base md:text-lg font-medium text-[#3E2C1F] placeholder-gray-300 outline-none resize-none transition-all py-2"
              :class="isExpanded ? 'h-24' : 'h-10'"
            ></textarea>

            <transition name="expand">
              <div v-if="isExpanded" class="flex items-center justify-between py-4">
                
                <div class="relative">
                  <div class="md:hidden">
                    <button @click="showUploadMenu = !showUploadMenu" 
                      class="p-2 rounded-full bg-[#FDFBF9] text-[#3E2C1F] transition-all"
                      :class="{ 'rotate-45 bg-[#3E2C1F] text-[#D2B48C]': showUploadMenu }"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke-width="2.5"/></svg>
                    </button>
                    <transition name="pop">
                      <div v-if="showUploadMenu" class="absolute bottom-full left-0 mb-3 bg-white border border-[#F3EEEA] rounded-2xl shadow-xl p-2 z-50 min-w-[140px]">
                        <button @click="triggerInput('image')" class="flex items-center gap-3 w-full px-3 py-2 hover:bg-emerald-50 rounded-xl transition-colors group">
                          <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="2"/></svg>
                          <span class="text-[10px] font-bold text-gray-500 uppercase">Photo</span>
                        </button>
                        <button v-if="userRole !== 'parent'" @click="triggerInput('file')" class="flex items-center gap-3 w-full px-3 py-2 hover:bg-blue-50 rounded-xl transition-colors border-t border-[#FDFBF9]">
                          <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" stroke-width="2"/></svg>
                          <span class="text-[10px] font-bold text-gray-500 uppercase">Document</span>
                        </button>
                      </div>
                    </transition>
                  </div>

                  <div class="hidden md:flex items-center gap-3">
                    <button @click="triggerInput('image')" class="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all border border-emerald-100/50 group">
                      <svg class="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="2"/></svg>
                      <span class="text-[9px] font-black uppercase tracking-widest">Photo</span>
                    </button>
                    <button v-if="userRole !== 'parent'" @click="triggerInput('file')" class="flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all border border-blue-100/50 group">
                      <svg class="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" stroke-width="2"/></svg>
                      <span class="text-[9px] font-black uppercase tracking-widest">Doc</span>
                    </button>
                  </div>
                </div>

                <div class="flex items-center gap-5">
                  <button @click="resetForm" class="btn-cancel-clean text-[10px] font-black uppercase tracking-widest text-gray-400 transition-all duration-300">
                    Annuler
                  </button>

                  <button 
                    @click="handleSubmit" 
                    :disabled="!formData.contenu.trim() || isLoading" 
                    class="btn-publish relative overflow-hidden bg-[#3E2C1F] text-[#D2B48C] px-8 py-2.5 rounded-full transition-all duration-300 active:scale-95 disabled:opacity-20"
                  >
                    <span class="relative z-10 text-[10px] font-black uppercase tracking-[0.2em]">
                      {{ isLoading ? 'Envoi...' : (isConfirming ? 'Confirmer ?' : 'Publier') }}
                    </span>
                    <div class="absolute inset-0 bg-[#543d2c] translate-y-full transition-transform duration-500 ease-out btn-overlay"></div>
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>

    <!-- FIL D'ACTUALITÉ - Tous les posts -->
    <div class="max-w-4xl mx-auto px-4 py-6">

      <!-- Loading -->
      <div v-if="isLoadingPosts" class="flex justify-center py-12">
        <div class="w-8 h-8 border-3 border-[#D2B48C] border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Aucun post -->
      <div v-else-if="posts.length === 0" class="text-center py-12 bg-white rounded-2xl border border-[#EFE9E4]">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p class="text-gray-400">Aucune publication pour le moment</p>
      </div>

      <!-- Liste des posts -->
      <div v-else class="space-y-6">
        <div v-for="post in posts" :key="post.id" class="bg-white rounded-2xl border border-[#EFE9E4] overflow-hidden shadow-sm hover:shadow-md transition-all">
          
          <!-- En-tête du post -->
          <div class="p-4 flex justify-between items-start">
            <div class="flex gap-3">
              <div 
                @click.stop="toggleUserInfoBox(post.user, $event)"
                class="w-10 h-10 rounded-full bg-gradient-to-br from-[#D2B48C] to-[#3E2C1F] flex items-center justify-center text-white font-bold cursor-pointer hover:scale-105 transition-transform"
              >
                {{ post.user?.nom?.charAt(0).toUpperCase() || 'U' }}
              </div>
              <div>
                <div class="font-bold text-[#3E2C1F] text-sm">{{ post.user?.nom || 'Utilisateur' }}</div>
                <div class="text-[10px] text-gray-400">{{ formatDate(post.createdAt) }}</div>
              </div>
            </div>
            
            <button 
              @click="startConversation(post.user)" 
              class="flex items-center gap-2 px-3 py-1.5 bg-[#F8F5F2] rounded-full text-xs text-[#3E2C1F] hover:bg-[#D2B48C] hover:text-white transition-all"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {{ post.user.id === user.id ? 'Mes messages' : 'Message' }}
            </button>
          </div>

          <!-- Contenu -->
          <div class="px-4 pb-3">
            <p class="text-sm text-gray-700 leading-relaxed">{{ post.contenu }}</p>
          </div>

          <!-- Image -->
          <div v-if="post.imageData" class="w-full bg-gray-100">
            <img :src="`data:${post.imageType};base64,${post.imageData}`" class="w-full max-h-96 object-cover" alt="Publication">
          </div>

          <!-- Fichier -->
          <div v-if="post.fileData" class="px-4 py-2">
            <a :href="`data:${post.fileType};base64,${post.fileData}`" :download="post.fileName" class="inline-flex items-center gap-2 text-sm text-[#D2B48C] hover:text-[#3E2C1F] transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              {{ post.fileName }}
            </a>
          </div>

          <!-- Actions Like et Commentaire -->
          <div class="px-4 py-2 flex items-center gap-4 border-t border-[#F8F5F2]">
            <button @click="toggleLike(post.id)" class="flex items-center gap-2 px-2 py-1.5 hover:bg-[#F8F5F2] rounded-lg transition-all" :class="post.liked ? 'text-red-500' : 'text-gray-500'">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path :fill="post.liked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              <span class="text-xs font-bold">{{ post.likesCount || 0 }} J'aime</span>
            </button>
            
            <button @click="toggleComments(post.id)" class="flex items-center gap-2 px-2 py-1.5 hover:bg-[#F8F5F2] rounded-lg transition-all text-gray-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke-width="2"/>
              </svg>
              <span class="text-xs font-bold">{{ post.commentsCount || 0 }} Commentaires</span>
            </button>
          </div>

          <!-- Section des commentaires -->
          <div v-if="activeComments === post.id" class="border-t border-[#F8F5F2] p-4 bg-[#FAFAFA]">
            <div class="space-y-3 max-h-60 overflow-y-auto">
              <div v-for="comment in post.comments" :key="comment.id" class="flex gap-2 text-sm">
                <span class="font-bold text-[#3E2C1F]">{{ comment.user?.nom || 'Utilisateur' }}:</span>
                <span class="text-gray-600">{{ comment.contenu }}</span>
              </div>
              <div v-if="!post.comments?.length" class="text-center text-gray-400 text-sm">
                Aucun commentaire pour le moment
              </div>
            </div>
            
            <div class="flex gap-2 mt-3">
              <input v-model="newComment[post.id]" type="text" placeholder="Écrire un commentaire..." 
                class="flex-grow bg-white border border-[#EFE9E4] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#D2B48C]">
              <button @click="addComment(post.id)" class="bg-[#D2B48C] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#3E2C1F] transition-colors">
                Envoyer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Boîte d'information utilisateur (message box stylé) -->
    <Teleport to="body">
      <transition name="user-info">
        <div 
          v-if="selectedUser" 
          class="fixed z-[200]"
          :style="{ top: infoBoxPosition.top + 'px', left: infoBoxPosition.left + 'px' }"
          @click.stop
        >
          <div class="user-info-card">
            <!-- Entête avec couleur de rôle -->
            <div class="user-info-header" :class="getRoleColorClass(selectedUser.role)">
              <div class="flex items-center gap-3">
                <div class="user-info-avatar">
                  {{ selectedUser.nom?.charAt(0).toUpperCase() || 'U' }}
                </div>
                <span class="user-info-name">{{ selectedUser.nom }}</span>
              </div>
              <button @click="closeUserInfoBox" class="user-info-close">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Corps avec infos -->
            <div class="user-info-body">
              <!-- Email -->
              <div class="user-info-row">
                <svg class="user-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <div class="flex-1">
                  <p class="user-info-label">Email</p>
                  <p class="user-info-value">{{ selectedUser.email || 'Non renseigné' }}</p>
                </div>
              </div>

              <!-- Rôle -->
              <div class="user-info-row">
                <svg class="user-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="flex-1">
                  <p class="user-info-label">Rôle</p>
                  <p class="user-info-value capitalize">{{ selectedUser.role || 'Non défini' }}</p>
                </div>
              </div>
            </div>

            <!-- Petit triangle pointeur -->
            <div class="user-info-arrow"></div>
          </div>
        </div>
      </transition>
    </Teleport>

    <input type="file" ref="imageInput" accept="image/*" class="hidden" @change="handleImageUpload">
    <input type="file" ref="fileInput" accept=".pdf" class="hidden" @change="handleFileUpload">
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const API_BASE_URL = 'http://localhost:8082/api'
const user = JSON.parse(localStorage.getItem('user') || '{"nom": "Marie Educ", "role": "educatrice", "id": 1, "email": "marie@example.com"}')

// Computed
const userInitials = computed(() => {
  const parts = user.nom.split(' ')
  return parts.length > 1 
    ? (parts[0][0] + parts[1][0]).toUpperCase() 
    : user.nom.substring(0, 2).toUpperCase()
})

const userRole = user.role

// États formulaire
const isExpanded = ref(false)
const showUploadMenu = ref(false)
const isConfirming = ref(false)
const isLoading = ref(false)
const alert = reactive({ show: false, message: '' })

const formData = reactive({ contenu: '', userId: user.id })
const imageFile = ref<File | null>(null)
const pdfFile = ref<File | null>(null)
const imageInput = ref<HTMLInputElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// États posts
const posts = ref<any[]>([])
const isLoadingPosts = ref(false)
const activeComments = ref<number | null>(null)
const newComment = ref<{ [key: number]: string }>({})

// États pour la boîte d'info utilisateur
const selectedUser = ref<any>(null)
const infoBoxPosition = ref({ top: 0, left: 0 })

// Fonctions utilitaires
const showAlert = (msg: string) => {
  alert.message = msg
  alert.show = true
  setTimeout(() => alert.show = false, 4000)
}

const triggerInput = (type: 'image' | 'file') => {
  if (type === 'image') imageInput.value?.click()
  else fileInput.value?.click()
  showUploadMenu.value = false
}

const handleImageUpload = (e: any) => { 
  if (e.target.files[0]) { 
    imageFile.value = e.target.files[0]
    showAlert("Photo ajoutée ✓") 
  } 
}

const handleFileUpload = (e: any) => { 
  if (e.target.files[0]) { 
    pdfFile.value = e.target.files[0]
    showAlert("Document ajouté ✓") 
  } 
}

const resetForm = () => {
  formData.contenu = ''
  imageFile.value = null
  pdfFile.value = null
  isExpanded.value = false
  isConfirming.value = false
  showUploadMenu.value = false
}

// Créer un post
const handleSubmit = async () => {
  if (!isConfirming.value) { 
    isConfirming.value = true
    setTimeout(() => { isConfirming.value = false }, 3000)
    return 
  }
  if (!formData.contenu.trim()) return
  
  isLoading.value = true
  
  const submitData = new FormData()
  submitData.append('contenu', formData.contenu)
  submitData.append('userId', String(user.id))
  if (imageFile.value) submitData.append('image', imageFile.value)
  if (pdfFile.value) submitData.append('file', pdfFile.value)
  
  try {
    const response = await axios.post(`${API_BASE_URL}/posts/create`, submitData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    if (response.data.success) {
      showAlert("Post publié avec succès !")
      resetForm()
      fetchPosts()
    }
  } catch (error) {
    showAlert("Erreur lors de l'envoi")
  } finally {
    isLoading.value = false
  }
}

// Récupérer tous les posts
const fetchPosts = async () => {
  isLoadingPosts.value = true
  try {
    const response = await axios.get(`${API_BASE_URL}/posts/all-posts`)
    if (response.data.success) {
      posts.value = response.data.posts
    }
  } catch (error) {
    console.error('Erreur chargement posts:', error)
  } finally {
    isLoadingPosts.value = false
  }
}

// Toggle like
const toggleLike = async (postId: number) => {
  const post = posts.value.find(p => p.id === postId)
  if (!post) return
  
  try {
    const response = await axios.post(`${API_BASE_URL}/likes/toggle`, null, {
      params: { userId: user.id, postId: postId }
    })
    if (response.data.success) {
      post.liked = response.data.liked
      post.likesCount = response.data.count
    }
  } catch (error) {
    console.error('Erreur like:', error)
  }
}

// Toggle commentaires
const toggleComments = (postId: number) => {
  activeComments.value = activeComments.value === postId ? null : postId
}

// Ajouter un commentaire
const addComment = async (postId: number) => {
  const commentText = newComment.value[postId]
  if (!commentText?.trim()) return
  
  const post = posts.value.find(p => p.id === postId)
  if (!post) return
  
  try {
    const response = await axios.post(`${API_BASE_URL}/comments/add`, {
      contenu: commentText,
      user: { id: user.id },
      post: { id: postId }
    })
    
    if (response.data.success) {
      if (!post.comments) post.comments = []
      post.comments.push({
        id: response.data.comment.id,
        contenu: commentText,
        user: { nom: user.nom, id: user.id },
        createdAt: response.data.comment.createdAt
      })
      post.commentsCount = (post.commentsCount || 0) + 1
      newComment.value[postId] = ''
    }
  } catch (error) {
    console.error('Erreur commentaire:', error)
  }
}

// Démarrer une conversation
const startConversation = (postUser: any) => {
  if (postUser.id === user.id) {
    router.push('/parentdiscussions')
  } else {
    localStorage.setItem('selectedChatUser', JSON.stringify(postUser))
    router.push('/parentdiscussions')
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
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
  }
}

// Afficher ou fermer la boîte d'information utilisateur (toggle)
const toggleUserInfoBox = (userData: any, event: MouseEvent) => {
  if (!userData) return
  
  // Si la boîte est déjà ouverte pour le même utilisateur, on la ferme
  if (selectedUser.value && selectedUser.value.id === userData.id) {
    closeUserInfoBox()
    return
  }
  
  // Sinon, on affiche la boîte pour le nouvel utilisateur
  selectedUser.value = userData
  
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  
  let top = rect.bottom + 8
  let left = rect.left
  
  const boxWidth = 280
  if (left + boxWidth > window.innerWidth - 16) {
    left = window.innerWidth - boxWidth - 16
  }
  if (left < 16) left = 16
  
  const boxHeight = 220
  if (top + boxHeight > window.innerHeight - 16) {
    top = rect.top - boxHeight - 8
  }
  
  infoBoxPosition.value = { top, left }
}

// Fermer la boîte d'information
const closeUserInfoBox = () => {
  selectedUser.value = null
}

// Couleurs "café au lait, terre" pour chaque rôle
const getRoleColorClass = (role: string) => {
  switch (role?.toLowerCase()) {
    case 'admin':
      return 'role-admin'      // terre cuite / brique
    case 'educatrice':
      return 'role-educatrice' // café au lait / caramel
    case 'parent':
      return 'role-parent'     // beige / sable
    default:
      return 'role-default'    // marron foncé
  }
}

// Gestionnaire de clic global pour fermer la boîte
const handleGlobalClick = (event: MouseEvent) => {
  if (selectedUser.value) {
    const box = document.querySelector('.user-info-card')
    if (box && !box.contains(event.target as Node)) {
      closeUserInfoBox()
    }
  }
}

// Gestionnaire de touche Échap
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && selectedUser.value) {
    closeUserInfoBox()
  }
}

onMounted(() => {
  fetchPosts()
  document.addEventListener('click', handleGlobalClick)
  document.addEventListener('keydown', handleEscapeKey)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleGlobalClick)
  document.removeEventListener('keydown', handleEscapeKey)
})
</script>

<style scoped>
/* ANIMATION MESSAGE BOX SLOW */
.notify-slow-enter-active {
  transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}
.notify-slow-leave-active {
  transition: all 0.5s ease-in;
}
.notify-slow-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}
.notify-slow-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* HOVERS & DESIGN */
.btn-cancel-clean:hover {
  color: #1e293b;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.btn-publish:hover .btn-overlay {
  transform: translateY(0);
}

.expand-enter-active { transition: all 0.4s ease-out; }
.expand-enter-from { opacity: 0; transform: translateY(-10px); }

.pop-enter-active { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.pop-enter-from { opacity: 0; transform: translateY(15px) scale(0.9); }

textarea::-webkit-scrollbar { display: none; }
textarea { scrollbar-width: none; }

/* Animation spinner */
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}

/* Animation de la boîte utilisateur */
.user-info-enter-active {
  transition: all 0.25s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.user-info-leave-active {
  transition: all 0.2s ease-in;
}
.user-info-enter-from,
.user-info-leave-to {
  opacity: 0;
  transform: scale(0.92) translateY(-8px);
}

/* Carte utilisateur */
.user-info-card {
  position: relative;
  width: 280px;
  background: white;
  border-radius: 1.25rem;
  box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(239, 233, 228, 0.5);
  overflow: hidden;
}

/* Couleurs "café au lait, terre" pour les rôles */
.user-info-header {
  padding: 0.875rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
}
/* Admin - terre cuite / brique */
.user-info-header.role-admin {
  background: linear-gradient(135deg, #a0522d, #8b4513);
}
/* Éducatrice - café au lait / caramel */
.user-info-header.role-educatrice {
  background: linear-gradient(135deg, #c19a6b, #a67c52);
}
/* Parent - beige / sable clair */
.user-info-header.role-parent {
  background: linear-gradient(135deg, #d2b48c, #c4a27a);
  color: #3e2c1f;
}
/* Défaut - marron foncé (terre) */
.user-info-header.role-default {
  background: linear-gradient(135deg, #5c3d2e, #3e2c1f);
}

.user-info-avatar {
  width: 2rem;
  height: 2rem;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.875rem;
  backdrop-filter: blur(2px);
}

.user-info-name {
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: -0.2px;
}

.user-info-close {
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.2s;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.user-info-close:hover {
  color: white;
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.05);
}

/* Corps */
.user-info-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-info-row {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.user-info-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.user-info-label {
  font-size: 0.625rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #b9a99a;
  margin-bottom: 0.25rem;
}

.user-info-value {
  font-size: 0.8rem;
  font-weight: 500;
  color: #3E2C1F;
  word-break: break-word;
  line-height: 1.3;
}

/* Triangle pointeur */
.user-info-arrow {
  position: absolute;
  top: -8px;
  left: 20px;
  width: 14px;
  height: 14px;
  background: white;
  border-left: 1px solid rgba(239, 233, 228, 0.8);
  border-top: 1px solid rgba(239, 233, 228, 0.8);
  transform: rotate(45deg);
  z-index: -1;
  border-radius: 3px 0 0 0;
}
</style>