<template>
  <div class="min-h-screen bg-[#F8F5F2] pt-24 pb-12 px-4 no-scrollbar">
    <div class="max-w-[580px] mx-auto space-y-6">
      
      <!-- Formulaire de création de post -->
      <div class="bg-white rounded-xl shadow-sm border border-[#EFE9E4] p-4">
        <div class="flex gap-3">
          <div class="w-10 h-10 rounded-full bg-[#D2B48C] flex-shrink-0 flex items-center justify-center text-white font-bold shadow-inner">
            {{ userInitial }}
          </div>
          
          <div class="flex-grow space-y-3">
            <textarea 
              v-model="formData.contenu" 
              @focus="isExpanded = true"
              placeholder="Quoi de neuf pour les petits ?" 
              class="w-full bg-[#F3EEEA] border-none rounded-2xl py-2.5 px-4 text-sm focus:ring-1 focus:ring-[#D2B48C] transition-all resize-none outline-none text-[#3E2C1F]"
              :class="isExpanded ? 'h-24' : 'h-10'"
            ></textarea>

            <transition name="fade">
              <div v-if="isExpanded" class="flex items-center justify-between pt-2 border-t border-[#F3EEEA]">
                <div class="flex gap-2">
                  <button @click="$refs.imageInput.click()" type="button" class="flex items-center gap-2 px-3 py-1.5 hover:bg-[#F3EEEA] rounded-lg transition-colors group">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="1.5"/></svg>
                    <span class="text-xs font-semibold text-gray-600">Photo</span>
                  </button>

                  <button v-if="userRole !== 'parent'" @click="$refs.fileInput.click()" type="button" class="flex items-center gap-2 px-3 py-1.5 hover:bg-[#F3EEEA] rounded-lg transition-colors">
                    <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" stroke-width="1.5"/></svg>
                    <span class="text-xs font-semibold text-gray-600">PDF</span>
                  </button>
                </div>

                <div class="flex gap-2">
                  <button @click="cancelPost" class="text-xs text-gray-400 font-bold px-3">Annuler</button>
                  <button @click="handleSubmit" :disabled="!formData.contenu.trim() || isLoading" 
                    class="bg-[#3E2C1F] text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-[#D2B48C] disabled:opacity-50 transition-all">
                    {{ isLoading ? 'Publication...' : 'Publier' }}
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </div>
        
        <input type="file" ref="imageInput" accept="image/*" class="hidden" @change="handleImageUpload">
        <input type="file" ref="fileInput" accept=".pdf" class="hidden" @change="handleFileUpload">
      </div>

      <!-- Message d'erreur/succès -->
      <div v-if="message.text" :class="['p-3 rounded-lg text-center', message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
        {{ message.text }}
      </div>

      <!-- Liste des posts -->
      <div class="space-y-4">
        <div v-for="post in posts" :key="post.id" class="bg-white rounded-xl shadow-sm border border-[#EFE9E4] overflow-hidden transition-all hover:shadow-md">
          <div class="p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-[#EFE9E4] flex items-center justify-center text-[#3E2C1F] font-bold">
                {{ post.user?.nom?.charAt(0) || 'U' }}
              </div>
              <div>
                <h4 class="text-sm font-bold text-[#3E2C1F]">{{ post.user?.nom || 'Utilisateur' }}</h4>
                <p class="text-[10px] text-gray-400">{{ formatDate(post.createdAt) }}</p>
              </div>
            </div>
            
            <!-- Menu d'actions -->
            <div v-if="post.user?.id === user.id" class="relative">
              <button @click="toggleMenu(post.id)" class="p-2 hover:bg-[#F8F5F2] rounded-lg transition-colors">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                </svg>
              </button>
              
              <div v-if="activeMenu === post.id" class="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-[#EFE9E4] z-10">
                <button @click="openEditModal(post)" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#F8F5F2] flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  Modifier
                </button>
                <button @click="deletePost(post.id)" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-[#F8F5F2] flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  Supprimer
                </button>
              </div>
            </div>
          </div>

          <div class="px-4 pb-3">
            <p class="text-sm text-gray-700 leading-relaxed">{{ post.contenu }}</p>
          </div>

          <!-- Affichage de l'image -->
          <div v-if="post.imageData" class="w-full bg-gray-100">
            <img :src="`data:${post.imageType};base64,${post.imageData}`" class="w-full max-h-96 object-cover" alt="Publication">
          </div>

          <!-- Affichage du PDF -->
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
        
        <div v-if="posts.length === 0 && !isLoading" class="text-center py-10 text-gray-400">
          Aucune publication pour le moment
        </div>
      </div>
    </div>

    <!-- Modal de modification -->
    <div v-if="editModal.open" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="closeEditModal">
      <div class="bg-white rounded-xl max-w-lg w-full p-6">
        <h3 class="text-lg font-bold text-[#3E2C1F] mb-4">Modifier le post</h3>
        <textarea v-model="editModal.contenu" class="w-full bg-[#F3EEEA] rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#D2B48C] outline-none resize-none h-32"></textarea>
        <div class="flex justify-end gap-3 mt-4">
          <button @click="closeEditModal" class="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg">Annuler</button>
          <button @click="updatePost" class="px-4 py-2 bg-[#3E2C1F] text-white rounded-lg hover:bg-[#D2B48C]">Enregistrer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

// Données Utilisateur
const user = JSON.parse(localStorage.getItem('user') || '{"nom": "Utilisateur", "role": "parent", "id": 1}')
const userInitial = user.nom.charAt(0).toUpperCase()
const userRole = user.role

// États UI
const isExpanded = ref(false)
const isLoading = ref(false)
const activeMenu = ref<number | null>(null)
const activeComments = ref<number | null>(null)
const newComment = ref<{ [key: number]: string }>({})

// Message
const message = ref({ text: '', type: 'success' })

// Formulaire
const formData = reactive({ contenu: '', userId: user.id })
const imageFile = ref<File | null>(null)
const pdfFile = ref<File | null>(null)

// Posts
const posts = ref<any[]>([])

// Modal d'édition
const editModal = reactive({
  open: false,
  id: null as number | null,
  contenu: ''
})

// API Base URL
const API_BASE_URL = 'http://localhost:8082/api'

// Afficher un message
const showMessage = (text: string, type: 'success' | 'error') => {
  message.value = { text, type }
  setTimeout(() => {
    message.value = { text: '', type: 'success' }
  }, 3000)
}

// Récupérer les posts
const fetchPosts = async () => {
  isLoading.value = true
  try {
    console.log('Chargement des posts pour user:', user.id)
    const response = await axios.get(`${API_BASE_URL}/posts/user/${user.id}`)
    console.log('Réponse brute:', response.data)
    
    if (response.data.success) {
      posts.value = response.data.posts
      console.log('Posts chargés:', posts.value.length)
    } else {
      console.error('Erreur dans la réponse:', response.data)
    }
  } catch (error: any) {
    console.error('Erreur lors du chargement des posts:', error)
    showMessage('Erreur de chargement des publications', 'error')
  } finally {
    isLoading.value = false
  }
}

// Formater la date
const formatDate = (dateString: string) => {
  if (!dateString) return 'Date inconnue'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'Date inconnue'
  }
}

// Upload image
const handleImageUpload = (e: any) => {
  if (e.target.files[0]) {
    imageFile.value = e.target.files[0]
    console.log('Image sélectionnée:', imageFile.value.name)
  }
}

// Upload PDF
const handleFileUpload = (e: any) => {
  if (e.target.files[0]) {
    pdfFile.value = e.target.files[0]
    console.log('PDF sélectionné:', pdfFile.value.name)
  }
}

// Annuler la création
const cancelPost = () => {
  formData.contenu = ''
  imageFile.value = null
  pdfFile.value = null
  isExpanded.value = false
}

// Créer un post
const handleSubmit = async () => {
  if (!formData.contenu.trim()) {
    showMessage('Veuillez écrire un message', 'error')
    return
  }
  
  isLoading.value = true
  
  const submitData = new FormData()
  submitData.append('contenu', formData.contenu)
  submitData.append('userId', String(user.id))
  
  if (imageFile.value) {
    submitData.append('image', imageFile.value)
  }
  if (pdfFile.value) {
    submitData.append('file', pdfFile.value)
  }
  
  try {
    console.log('Envoi du post...')
    const response = await axios.post(`${API_BASE_URL}/posts/create`, submitData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    console.log('Réponse création:', response.data)
    
    if (response.data.success) {
      showMessage('Post publié avec succès !', 'success')
      cancelPost()
      await fetchPosts() // Recharger la liste
    } else {
      showMessage(response.data.error || 'Erreur lors de la publication', 'error')
    }
  } catch (error: any) {
    console.error('Erreur lors de la publication:', error)
    const errorMsg = error.response?.data?.error || 'Erreur lors de la publication'
    showMessage(errorMsg, 'error')
  } finally {
    isLoading.value = false
  }
}

// Supprimer un post
const deletePost = async (postId: number) => {
  if (confirm('Voulez-vous vraiment supprimer ce post ?')) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/posts/delete/${postId}`)
      if (response.data.success) {
        showMessage('Post supprimé avec succès', 'success')
        await fetchPosts()
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      showMessage('Erreur lors de la suppression', 'error')
    }
  }
  activeMenu.value = null
}

// Ouvrir le modal d'édition
const openEditModal = (post: any) => {
  editModal.id = post.id
  editModal.contenu = post.contenu
  editModal.open = true
  activeMenu.value = null
}

// Fermer le modal
const closeEditModal = () => {
  editModal.open = false
  editModal.id = null
  editModal.contenu = ''
}

// Mettre à jour un post
const updatePost = async () => {
  if (!editModal.id) return
  
  try {
    const response = await axios.put(`${API_BASE_URL}/posts/update/${editModal.id}`, null, {
      params: { 
        contenu: editModal.contenu,
        userId: user.id
      }
    })
    
    if (response.data.success) {
      showMessage('Post modifié avec succès', 'success')
      await fetchPosts()
      closeEditModal()
    }
  } catch (error) {
    console.error('Erreur lors de la modification:', error)
    showMessage('Erreur lors de la modification', 'error')
  }
}

// Toggle like
const toggleLike = async (postId: number) => {
  const post = posts.value.find(p => p.id === postId)
  if (!post) return
  
  try {
    const response = await axios.post(`${API_BASE_URL}/likes/toggle`, null, {
      params: {
        userId: user.id,
        postId: postId
      }
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
const toggleComments = async (postId: number) => {
  if (activeComments.value === postId) {
    activeComments.value = null
  } else {
    activeComments.value = postId
    // Charger les commentaires si pas déjà faits
    const post = posts.value.find(p => p.id === postId)
    if (post && !post.comments?.length) {
      await fetchComments(postId)
    }
  }
}

// Récupérer les commentaires
const fetchComments = async (postId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/comments/post/${postId}`)
    if (response.data.success) {
      const post = posts.value.find(p => p.id === postId)
      if (post) {
        post.comments = response.data.comments
        post.commentsCount = response.data.count
      }
    }
  } catch (error) {
    console.error('Erreur chargement commentaires:', error)
  }
}

// Ajouter un commentaire
const addComment = async (postId: number) => {
  const commentText = newComment.value[postId]
  if (!commentText?.trim()) return
  
  try {
    const response = await axios.post(`${API_BASE_URL}/comments/add`, {
      contenu: commentText,
      user: { id: user.id },
      post: { id: postId }
    })
    
    if (response.data.success) {
      const post = posts.value.find(p => p.id === postId)
      if (post) {
        if (!post.comments) post.comments = []
        post.comments.unshift({
          id: response.data.comment.id,
          contenu: commentText,
          user: { nom: user.nom, id: user.id },
          createdAt: response.data.comment.createdAt
        })
        post.commentsCount = (post.commentsCount || 0) + 1
        newComment.value[postId] = ''
      }
    }
  } catch (error) {
    console.error('Erreur commentaire:', error)
    showMessage('Erreur lors de l\'ajout du commentaire', 'error')
  }
}

// Toggle menu
const toggleMenu = (postId: number) => {
  activeMenu.value = activeMenu.value === postId ? null : postId
}

// Fermer le menu au clic ailleurs
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    activeMenu.value = null
  }
}

onMounted(() => {
  console.log('Composant monté, utilisateur:', user)
  fetchPosts()
  document.addEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>