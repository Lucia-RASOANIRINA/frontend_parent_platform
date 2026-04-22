<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-[800px] mx-auto px-4 py-6">
      
      <!-- Notification Toast -->
      <transition name="notify-slow">
        <div v-if="notification.show" 
          class="fixed top-6 right-4 left-4 md:left-auto md:right-8 md:w-80 z-[100] flex items-center gap-4 px-5 py-4 rounded-2xl shadow-2xl border border-[#F3EEEA] bg-white/95 backdrop-blur-md"
        >
          <div class="flex-shrink-0 w-10 h-10 rounded-xl" :class="notification.type === 'success' ? 'bg-emerald-50' : 'bg-red-50'">
            <div class="flex items-center justify-center h-full">
              <svg v-if="notification.type === 'success'" class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="flex-grow">
            <p class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{{ notification.type === 'success' ? 'Succès' : 'Erreur' }}</p>
            <p class="text-xs font-bold text-[#3E2C1F]">{{ notification.message }}</p>
          </div>
          <button @click="notification.show = false" class="text-gray-300 hover:text-gray-400 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="2.5"/></svg>
          </button>
        </div>
      </transition>

      <!-- En-tête profil -->
      <div class="profile-header">
        <div class="avatar-large">
          {{ userInitials }}
        </div>
        <div class="profile-info">
          <h1>{{ user.nom }}</h1>
          <p class="role-badge">{{ formattedRole }}</p>
          <p class="member-since">Membre depuis {{ memberSince }}</p>
        </div>
        <button class="edit-profile-btn" @click="openEditProfileModal">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Modifier mon profil
        </button>
      </div>

      <!-- Cartes statistiques -->
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-icon">📄</div><div class="stat-value">{{ stats.posts }}</div><div class="stat-label">Publications</div></div>
        <div class="stat-card"><div class="stat-icon">❤️</div><div class="stat-value">{{ stats.likesReceived }}</div><div class="stat-label">Likes reçus</div></div>
        <div class="stat-card"><div class="stat-icon">💬</div><div class="stat-value">{{ stats.commentsReceived }}</div><div class="stat-label">Commentaires reçus</div></div>
      </div>

      <!-- Liste des publications de l'utilisateur (lecture seule) -->
      <div class="section-title">
        <h2>Mes publications</h2>
      </div>
      <div class="space-y-4">
        <div v-for="post in posts" :key="post.id" class="bg-white rounded-xl shadow-sm border border-[#EFE9E4] overflow-hidden">
          <div class="p-4 flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-[#EFE9E4] flex items-center justify-center text-[#3E2C1F] font-bold">
              {{ post.user?.nom?.charAt(0) || 'U' }}
            </div>
            <div>
              <h4 class="text-sm font-bold text-[#3E2C1F]">{{ post.user?.nom || 'Utilisateur' }}</h4>
              <p class="text-[10px] text-gray-400">{{ formatDate(post.createdAt) }}</p>
            </div>
          </div>
          <div class="px-4 pb-3">
            <p class="text-sm text-gray-700 leading-relaxed">{{ post.contenu }}</p>
          </div>
          <div v-if="post.imageData" class="w-full bg-gray-100">
            <img :src="`data:${post.imageType};base64,${post.imageData}`" class="w-full max-h-96 object-cover" alt="Publication">
          </div>
          <div v-if="post.fileData" class="px-4 py-2">
            <a :href="`data:${post.fileType};base64,${post.fileData}`" :download="post.fileName" class="inline-flex items-center gap-2 text-sm text-[#D2B48C] hover:text-[#3E2C1F] transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              {{ post.fileName }}
            </a>
          </div>
          <div class="px-4 py-2 flex items-center gap-4 border-t border-[#F8F5F2]">
            <div class="flex items-center gap-2 text-gray-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              <span class="text-xs font-bold">{{ post.likesCount || 0 }} J'aime</span>
            </div>
            <div class="flex items-center gap-2 text-gray-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke-width="2"/></svg>
              <span class="text-xs font-bold">{{ post.commentsCount || 0 }} Commentaires</span>
            </div>
          </div>
        </div>
        <div v-if="posts.length === 0 && !loadingPosts" class="text-center py-10 text-gray-400">Aucune publication</div>
      </div>

      <!-- Utilisateurs qui ont aimé mes publications -->
      <div class="section-title">
        <h2>❤️ Utilisateurs qui ont aimé mes publications</h2>
      </div>
      <div class="users-grid">
        <div v-for="u in usersWhoLiked" :key="u.id" class="user-card">
          <div class="user-avatar">{{ u.nom.charAt(0).toUpperCase() }}</div>
          <div class="user-name">{{ u.nom }}</div>
          <div class="user-role">{{ formatRole(u.role) }}</div>
        </div>
        <div v-if="usersWhoLiked.length === 0 && !loadingUsers" class="text-center py-6 text-gray-400 col-span-full">Personne n'a encore aimé vos publications</div>
      </div>

      <!-- Utilisateurs qui ont commenté mes publications -->
      <div class="section-title">
        <h2>💬 Utilisateurs qui ont commenté mes publications</h2>
      </div>
      <div class="users-grid">
        <div v-for="u in usersWhoCommented" :key="u.id" class="user-card">
          <div class="user-avatar">{{ u.nom.charAt(0).toUpperCase() }}</div>
          <div class="user-name">{{ u.nom }}</div>
          <div class="user-role">{{ formatRole(u.role) }}</div>
        </div>
        <div v-if="usersWhoCommented.length === 0 && !loadingUsers" class="text-center py-6 text-gray-400 col-span-full">Personne n'a encore commenté vos publications</div>
      </div>

      <!-- Publications que j'ai likées -->
      <div class="section-title">
        <h2>👍 Publications que j'ai aimées</h2>
      </div>
      <div class="space-y-4">
        <div v-for="likedPost in likedPosts" :key="likedPost.id" class="bg-white rounded-xl shadow-sm border border-[#EFE9E4] overflow-hidden">
          <div class="p-4 flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-[#EFE9E4] flex items-center justify-center text-[#3E2C1F] font-bold">
              {{ likedPost.user?.nom?.charAt(0) || 'U' }}
            </div>
            <div>
              <h4 class="text-sm font-bold text-[#3E2C1F]">{{ likedPost.user?.nom || 'Utilisateur' }}</h4>
              <p class="text-[10px] text-gray-400">{{ formatDate(likedPost.createdAt) }}</p>
            </div>
          </div>
          <div class="px-4 pb-3">
            <p class="text-sm text-gray-700 leading-relaxed">{{ likedPost.contenu }}</p>
          </div>
          <div v-if="likedPost.imageData" class="w-full bg-gray-100">
            <img :src="`data:${likedPost.imageType};base64,${likedPost.imageData}`" class="w-full max-h-96 object-cover">
          </div>
        </div>
        <div v-if="likedPosts.length === 0 && !loadingLiked" class="text-center py-10 text-gray-400">Vous n'avez encore aimé aucune publication</div>
      </div>
    </div>

    <!-- Modale modification profil (inchangée) -->
    <div v-if="editProfileModal.open" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="closeEditProfileModal">
      <div class="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-bold text-[#3E2C1F] mb-4">Modifier mon profil</h3>
        <form @submit.prevent="updateProfile">
          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-1">Nom complet</label>
            <input v-model="editProfileForm.nom" type="text" @blur="validateName" :class="{ 'border-red-500': nameError }" class="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#D2B48C] outline-none">
            <p v-if="nameError" class="text-xs text-red-500 mt-1">{{ nameError }}</p>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input v-model="editProfileForm.email" type="email" @blur="validateEmail" :class="{ 'border-red-500': emailError }" class="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#D2B48C] outline-none">
            <p v-if="emailError" class="text-xs text-red-500 mt-1">{{ emailError }}</p>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-1">Nouveau mot de passe (optionnel)</label>
            <div class="relative">
              <input v-model="editProfileForm.password" :type="showPassword ? 'text' : 'password'" @blur="validatePassword" class="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#D2B48C] outline-none">
              <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <p v-if="passwordError" class="text-xs text-red-500 mt-1">{{ passwordError }}</p>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-1">Confirmer le mot de passe</label>
            <input v-model="editProfileForm.confirmPassword" type="password" @blur="validateConfirmPassword" class="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#D2B48C] outline-none">
            <p v-if="confirmPasswordError" class="text-xs text-red-500 mt-1">{{ confirmPasswordError }}</p>
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <button type="button" @click="closeEditProfileModal" class="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg">Annuler</button>
            <button type="submit" :disabled="profileUpdating" class="px-4 py-2 bg-[#3E2C1F] text-white rounded-lg hover:bg-[#D2B48C] disabled:opacity-50">
              {{ profileUpdating ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8082/api'
const user = JSON.parse(localStorage.getItem('user') || '{"nom": "Utilisateur", "role": "parent", "id": 1, "email": "user@example.com", "createdAt": "2024-01-01"}')

// Computed
const userInitial = computed(() => user.nom.charAt(0).toUpperCase())
const userInitials = computed(() => {
  const parts = user.nom.split(' ')
  return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : user.nom.substring(0, 2).toUpperCase()
})
const formattedRole = computed(() => {
  const role = user.role?.toUpperCase()
  if (role === 'PARENT') return 'Parent'
  if (role === 'EDUCATEUR') return 'Éducatrice'
  if (role === 'PSY') return 'Psychologue'
  return user.role || 'Membre'
})
const memberSince = computed(() => {
  if (!user.createdAt) return 'récemment'
  const date = new Date(user.createdAt)
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })
})

// États
const notification = ref({ show: false, message: '', type: 'success' })
const loadingPosts = ref(false)
const loadingUsers = ref(false)
const loadingLiked = ref(false)

const posts = ref([])
const usersWhoLiked = ref([])
const usersWhoCommented = ref([])
const likedPosts = ref([])

const stats = reactive({ posts: 0, likesReceived: 0, commentsReceived: 0 })

// Modification profil
const editProfileModal = ref({ open: false })
const editProfileForm = reactive({ nom: user.nom, email: user.email, password: '', confirmPassword: '' })
const nameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')
const showPassword = ref(false)
const profileUpdating = ref(false)

// Notifications
const showNotification = (message, type) => {
  notification.value = { show: true, message, type }
  setTimeout(() => { notification.value.show = false }, 20000)
}

// Récupération des publications de l'utilisateur
const fetchUserPosts = async () => {
  loadingPosts.value = true
  try {
    const response = await axios.get(`${API_BASE_URL}/posts/user/${user.id}`)
    if (response.data.success) {
      posts.value = response.data.posts
      // Calcul des stats
      let totalLikes = 0, totalComments = 0
      posts.value.forEach(post => {
        totalLikes += post.likesCount || 0
        totalComments += post.commentsCount || 0
      })
      stats.posts = posts.value.length
      stats.likesReceived = totalLikes
      stats.commentsReceived = totalComments
    }
  } catch (error) {
    showNotification('Erreur chargement publications', 'error')
  } finally {
    loadingPosts.value = false
  }
}

// Récupération des utilisateurs qui ont liké mes publications
const fetchUsersWhoLiked = async () => {
  loadingUsers.value = true
  try {
    const response = await axios.get(`${API_BASE_URL}/likes/received/users/${user.id}`)
    if (response.data.success) {
      usersWhoLiked.value = response.data.users
    }
  } catch (error) {
    console.error(error)
  } finally {
    loadingUsers.value = false
  }
}

// Récupération des utilisateurs qui ont commenté mes publications
const fetchUsersWhoCommented = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/comments/received/users/${user.id}`)
    if (response.data.success) {
      usersWhoCommented.value = response.data.users
    }
  } catch (error) {
    console.error(error)
  }
}

// Récupération des publications que j'ai likées
const fetchLikedPosts = async () => {
  loadingLiked.value = true
  try {
    const response = await axios.get(`${API_BASE_URL}/likes/my-likes/${user.id}`)
    if (response.data.success) {
      likedPosts.value = response.data.posts
    }
  } catch (error) {
    console.error(error)
  } finally {
    loadingLiked.value = false
  }
}

// Formatage date
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const formatRole = (role) => {
  if (role === 'PARENT') return 'Parent'
  if (role === 'EDUCATEUR') return 'Éducatrice'
  if (role === 'PSY') return 'Psychologue'
  return role
}

// Validation profil
const validateName = () => {
  if (!editProfileForm.nom.trim()) nameError.value = 'Le nom est requis'
  else if (editProfileForm.nom.length < 2) nameError.value = 'Minimum 2 caractères'
  else nameError.value = ''
}
const validateEmail = () => {
  const email = editProfileForm.email.trim()
  if (!email) emailError.value = 'L\'email est requis'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) emailError.value = 'Email invalide'
  else emailError.value = ''
}
const validatePassword = () => {
  if (editProfileForm.password && editProfileForm.password.length < 6) passwordError.value = '6 caractères minimum'
  else passwordError.value = ''
}
const validateConfirmPassword = () => {
  if (editProfileForm.password !== editProfileForm.confirmPassword) confirmPasswordError.value = 'Mots de passe différents'
  else confirmPasswordError.value = ''
}
const openEditProfileModal = () => {
  editProfileForm.nom = user.nom
  editProfileForm.email = user.email
  editProfileForm.password = ''
  editProfileForm.confirmPassword = ''
  nameError.value = ''
  emailError.value = ''
  passwordError.value = ''
  confirmPasswordError.value = ''
  editProfileModal.value.open = true
}
const closeEditProfileModal = () => { editProfileModal.value.open = false }
const updateProfile = async () => {
  validateName(); validateEmail(); validatePassword(); validateConfirmPassword()
  if (nameError.value || emailError.value || passwordError.value || confirmPasswordError.value) return
  profileUpdating.value = true
  try {
    const payload = { nom: editProfileForm.nom, email: editProfileForm.email }
    if (editProfileForm.password) payload.password = editProfileForm.password
    const response = await axios.put(`${API_BASE_URL}/auth/profile`, payload, { headers: { 'X-User-Id': user.id } })
    const updatedUser = response.data.user
    localStorage.setItem('user', JSON.stringify(updatedUser))
    Object.assign(user, updatedUser)
    showNotification('Profil mis à jour', 'success')
    closeEditProfileModal()
    window.location.reload()
  } catch (err) {
    showNotification(err.response?.data?.message || 'Erreur', 'error')
  } finally {
    profileUpdating.value = false
  }
}

onMounted(() => {
  fetchUserPosts()
  fetchUsersWhoLiked()
  fetchUsersWhoCommented()
  fetchLikedPosts()
})
</script>

<style scoped>
.notify-slow-enter-active { transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
.notify-slow-leave-active { transition: all 0.5s ease-in; }
.notify-slow-enter-from { opacity: 0; transform: translateX(30px) scale(0.95); }
.notify-slow-leave-to { opacity: 0; transform: translateY(-10px); }

.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: #FEFCF8;
  border-radius: 2rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  flex-wrap: wrap;
}
.avatar-large {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #D2B48C, #3E2C1F);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  color: white;
}
.profile-info { flex: 1; }
.profile-info h1 { margin: 0; font-size: 1.5rem; color: #3E2C1F; }
.role-badge {
  background: #F3EEEA;
  color: #8B7355;
  display: inline-block;
  padding: 0.2rem 0.8rem;
  border-radius: 40px;
  font-size: 0.7rem;
  font-weight: 600;
  margin-top: 0.2rem;
}
.member-since { font-size: 0.75rem; color: #8b8b8b; margin-top: 0.3rem; }
.edit-profile-btn {
  background: white;
  border: 1px solid #D2B48C;
  border-radius: 40px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #D2B48C;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}
.edit-profile-btn:hover { background: #D2B48C; color: white; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}
.stat-card {
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  border: 1px solid #EFE5DB;
}
.stat-icon { font-size: 1.8rem; margin-bottom: 0.3rem; }
.stat-value { font-size: 1.5rem; font-weight: bold; color: #3E2C1F; }
.stat-label { font-size: 0.7rem; text-transform: uppercase; color: #8b8b8b; }

.section-title {
  margin: 2rem 0 1rem;
}
.section-title h2 {
  font-size: 1.2rem;
  color: #3E2C1F;
  border-left: 4px solid #D2B48C;
  padding-left: 0.75rem;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
}
.user-card {
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  text-align: center;
  border: 1px solid #EFE5DB;
  transition: transform 0.2s;
}
.user-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.user-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #D2B48C, #3E2C1F);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.5rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
}
.user-name { font-weight: 600; color: #3E2C1F; font-size: 0.9rem; }
.user-role { font-size: 0.7rem; color: #8b8b8b; text-transform: uppercase; }
</style>