<template>
  <div class="create-post-container">
    <div class="container">
      <h2>Créer un Post</h2>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <textarea 
            v-model="formData.contenu" 
            placeholder="Écris ton message..." 
            :class="{ 'is-invalid': errors.contenu }"
          ></textarea>
          <span v-if="errors.contenu" class="error-message">{{ errors.contenu }}</span>
        </div>

        <div class="form-group">
          <input 
            v-model="formData.userId" 
            type="text" 
            placeholder="ID utilisateur"
            :class="{ 'is-invalid': errors.userId }"
          >
          <span v-if="errors.userId" class="error-message">{{ errors.userId }}</span>
        </div>

        <div class="form-group">
          <label>Image :</label>
          <input 
            ref="imageInput"
            type="file" 
            accept="image/*"
            @change="handleImageUpload"
          >
          <span v-if="imageFile" class="file-info">✓ {{ imageFile.name }}</span>
        </div>

        <div class="form-group">
          <label>PDF :</label>
          <input 
            ref="fileInput"
            type="file" 
            accept=".pdf"
            @change="handleFileUpload"
          >
          <span v-if="pdfFile" class="file-info">✓ {{ pdfFile.name }}</span>
        </div>

        <button type="submit" :disabled="isLoading" class="submit-btn">
          <span v-if="isLoading" class="spinner"></span>
          {{ isLoading ? 'Publication en cours...' : 'Publier' }}
        </button>
      </form>

      <transition name="fade">
        <div v-if="messageText" :class="['message', messageType]">
          {{ messageText }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import axios from 'axios'

// Types
interface FormData {
  contenu: string
  userId: string
}

interface Errors {
  contenu?: string
  userId?: string
}

// État du formulaire
const formData = reactive<FormData>({
  contenu: '',
  userId: ''
})

const errors = reactive<Errors>({})

// Références pour les fichiers
const imageInput = ref<HTMLInputElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// États pour les fichiers
const imageFile = ref<File | null>(null)
const pdfFile = ref<File | null>(null)

// États UI
const isLoading = ref(false)
const messageText = ref('')
const messageType = ref('')

// API base URL
const API_BASE_URL = 'http://localhost:8082/api'

// Gestion de l'upload d'image
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    // Vérifier que c'est bien une image
    if (!file.type.startsWith('image/')) {
      showMessage('Veuillez sélectionner un fichier image valide', 'error')
      return
    }
    imageFile.value = file
  }
}

// Gestion de l'upload de PDF
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    // Vérifier que c'est bien un PDF
    if (file.type !== 'application/pdf') {
      showMessage('Veuillez sélectionner un fichier PDF valide', 'error')
      return
    }
    pdfFile.value = file
  }
}

// Validation du formulaire
const validateForm = (): boolean => {
  errors.contenu = ''
  errors.userId = ''
  
  let isValid = true
  
  if (!formData.contenu.trim()) {
    errors.contenu = 'Le message ne peut pas être vide'
    isValid = false
  }
  
  if (!formData.userId.trim()) {
    errors.userId = 'L\'ID utilisateur est requis'
    isValid = false
  } else if (isNaN(Number(formData.userId))) {
    errors.userId = 'L\'ID utilisateur doit être un nombre'
    isValid = false
  }
  
  return isValid
}

// Soumission du formulaire
const handleSubmit = async () => {
  // Validation
  if (!validateForm()) {
    return
  }

  isLoading.value = true
  messageText.value = ''

  try {
    // Créer FormData pour l'envoi des fichiers
    const submitFormData = new FormData()
    
    // Ajouter les champs texte
    submitFormData.append('contenu', formData.contenu)
    submitFormData.append('userId', formData.userId)
    
    // Ajouter les fichiers s'ils existent
    if (imageFile.value) {
      submitFormData.append('image', imageFile.value)
    }
    
    if (pdfFile.value) {
      submitFormData.append('file', pdfFile.value)
    }

    // Envoyer la requête
    const response = await axios.post(`${API_BASE_URL}/posts/create`, submitFormData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    console.log('Réponse:', response.data)
    showMessage('Post publié avec succès ✅', 'success')
    
    // Réinitialiser le formulaire après succès
    resetForm()
    
  } catch (error: any) {
    console.error('Erreur détaillée:', error)
    
    if (error.response) {
      // Erreur du serveur
      const errorMessage = error.response.data?.message || error.response.data?.error || 'Échec de la publication'
      showMessage(`Erreur ${error.response.status}: ${errorMessage}`, 'error')
    } else if (error.request) {
      // Pas de réponse du serveur
      showMessage('Erreur: Impossible de contacter le serveur. Vérifiez que le backend est démarré.', 'error')
    } else {
      // Autre erreur
      showMessage(`Erreur: ${error.message}`, 'error')
    }
  } finally {
    isLoading.value = false
  }
}

// Afficher un message temporaire
const showMessage = (message: string, type: 'success' | 'error') => {
  messageText.value = message
  messageType.value = type
  
  // Masquer le message après 3 secondes
  setTimeout(() => {
    messageText.value = ''
    messageType.value = ''
  }, 3000)
}

// Réinitialiser le formulaire
const resetForm = () => {
  formData.contenu = ''
  formData.userId = ''
  imageFile.value = null
  pdfFile.value = null
  
  // Réinitialiser les inputs de fichiers
  if (imageInput.value) {
    imageInput.value.value = ''
  }
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  
  // Réinitialiser les erreurs
  errors.contenu = ''
  errors.userId = ''
}
</script>

<style scoped>
.create-post-container {
  font-family: Arial, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.container {
  background: white;
  padding: 30px;
  border-radius: 10px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 25px;
  color: #333;
  font-size: 24px;
}

.form-group {
  margin-bottom: 15px;
}

textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.3s;
}

textarea:focus {
  outline: none;
  border-color: #007bff;
}

textarea.is-invalid {
  border-color: #dc3545;
}

input[type="text"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  transition: border-color 0.3s;
}

input[type="text"]:focus {
  outline: none;
  border-color: #007bff;
}

input[type="text"].is-invalid {
  border-color: #dc3545;
}

input[type="file"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
  font-size: 14px;
}

.error-message {
  display: block;
  color: #dc3545;
  font-size: 12px;
  margin-top: 5px;
}

.file-info {
  display: inline-block;
  margin-top: 5px;
  font-size: 12px;
  color: #28a745;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background 0.3s;
  position: relative;
}

.submit-btn:hover:not(:disabled) {
  background: #0056b3;
}

.submit-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.6s linear infinite;
  margin-right: 8px;
  vertical-align: middle;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.message {
  margin-top: 20px;
  text-align: center;
  padding: 12px;
  border-radius: 5px;
  font-weight: 500;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* Animation fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>