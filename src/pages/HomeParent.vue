<template>
  <div class="w-full font-sans antialiased bg-white">
    
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

    <div class="max-w-4xl mx-auto px-4 py-6">
      <div class="flex items-start gap-4">
        
        <div class="flex-shrink-0">
          <div class="w-12 h-12 rounded-2xl bg-[#FDFBF9] border border-[#EFE9E4] flex items-center justify-center text-[#3E2C1F] font-black text-sm shadow-sm transition-all duration-500 hover:border-[#D2B48C] hover:scale-105">
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

    <input type="file" ref="imageInput" accept="image/*" class="hidden" @change="handleImageUpload">
    <input type="file" ref="fileInput" accept=".pdf" class="hidden" @change="handleFileUpload">
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8082/api'
const user = JSON.parse(localStorage.getItem('user') || '{"nom": "Marie Educ", "role": "educatrice", "id": 1}')

const userInitials = computed(() => {
  const parts = user.nom.split(' ')
  return parts.length > 1 
    ? (parts[0][0] + parts[1][0]).toUpperCase() 
    : user.nom.substring(0, 2).toUpperCase()
})

const userRole = user.role
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

const showAlert = (msg: string) => {
  alert.message = msg
  alert.show = true
  setTimeout(() => alert.show = false, 4000) // Augmenté à 4s
}

const triggerInput = (type: 'image' | 'file') => {
  if (type === 'image') imageInput.value?.click()
  else fileInput.value?.click()
  showUploadMenu.value = false
}

const handleImageUpload = (e: any) => { if (e.target.files[0]) { imageFile.value = e.target.files[0]; showAlert("Photo ajoutée "); } }
const handleFileUpload = (e: any) => { if (e.target.files[0]) { pdfFile.value = e.target.files[0]; showAlert("Document ajouté "); } }

const resetForm = () => {
  formData.contenu = ''
  imageFile.value = null
  pdfFile.value = null
  isExpanded.value = false
  isConfirming.value = false
  showUploadMenu.value = false
}

const handleSubmit = async () => {
  if (!isConfirming.value) { isConfirming.value = true; return; }
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
    }
  } catch (error) {
    showAlert("Erreur lors de l'envoi")
  } finally {
    isLoading.value = false
  }
}
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
</style>