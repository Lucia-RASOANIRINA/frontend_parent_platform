<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-[800px] mx-auto px-4 py-6">
      
      <!-- Notification Toast -->
      <transition name="notify-slow">
        <div v-if="notification.show" 
          class="fixed top-6 right-4 left-4 md:left-auto md:right-8 md:w-80 z-[100] flex items-center gap-4 px-5 py-4 rounded-2xl shadow-2xl border border-[#CFFAFE] bg-white/95 backdrop-blur-md"
        >
          <div class="flex-shrink-0 w-10 h-10 rounded-xl" :class="notification.type === 'success' ? 'bg-[#F0F9FF]' : 'bg-red-50'">
            <div class="flex items-center justify-center h-full">
              <svg v-if="notification.type === 'success'" class="w-6 h-6 text-[#0891B2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          
          <div class="flex-grow">
            <p class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{{ notification.type === 'success' ? 'Succès' : 'Erreur' }}</p>
            <p class="text-xs font-bold text-[#164E63]">{{ notification.message }}</p>
          </div>

          <button @click="notification.show = false" class="text-gray-300 hover:text-gray-400 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="2.5"/></svg>
          </button>
        </div>
      </transition>

      <!-- Formulaire de création de post -->
      <div class="bg-white rounded-xl shadow-sm border border-[#CFFAFE] p-4 mb-6">
        <div class="flex gap-3">
          <div class="w-10 h-10 rounded-full bg-[#0891B2] flex-shrink-0 flex items-center justify-center text-white font-bold shadow-inner">
            {{ userInitial }}
          </div>
          
          <div class="flex-grow space-y-3">
            <textarea 
              v-model="formData.contenu" 
              @focus="isExpanded = true"
              placeholder="Quoi de neuf pour les petits ?" 
              class="w-full bg-[#F0F9FF] border-none rounded-2xl py-2.5 px-4 text-sm focus:ring-1 focus:ring-[#06B6D4] transition-all resize-none outline-none text-[#164E63]"
              :class="isExpanded ? 'h-24' : 'h-10'"
            ></textarea>

            <!-- Aperçu des fichiers sélectionnés pour création -->
            <div v-if="imagePreviewUrl || pdfFile" class="mt-2 p-2 bg-[#F0F9FF] rounded-lg flex items-center gap-3">
              <div v-if="imagePreviewUrl" class="relative">
                <img :src="imagePreviewUrl" class="h-16 w-16 object-cover rounded-lg border border-[#CFFAFE]">
                <button @click="removeSelectedImage" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div v-if="pdfFile" class="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#CFFAFE]">
                <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span class="text-sm text-gray-700">{{ pdfFile.name }} ({{ formatFileSize(pdfFile.size) }})</span>
                <button @click="removeSelectedPdf" class="text-red-500 hover:text-red-700">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <transition name="fade">
              <div v-if="isExpanded" class="flex items-center justify-between pt-2 border-t border-[#CFFAFE]">
                <div class="flex gap-2">
                  <button @click="imageInput?.click()" type="button" class="flex items-center gap-2 px-3 py-1.5 hover:bg-[#F0F9FF] rounded-lg transition-colors group">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="1.5"/></svg>
                    <span class="text-xs font-semibold text-gray-600">Photo</span>
                  </button>

                  <button v-if="userRole !== 'parent'" @click="fileInput?.click()" type="button" class="flex items-center gap-2 px-3 py-1.5 hover:bg-[#F0F9FF] rounded-lg transition-colors">
                    <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span class="text-xs font-semibold text-gray-600">Fichier</span>
                  </button>
                </div>

                <div class="flex gap-2">
                  <button @click="cancelPost" class="text-xs text-gray-400 font-bold px-3">Annuler</button>
                  <button @click="handleSubmit" :disabled="!formData.contenu.trim() || isLoading" 
                    class="bg-[#164E63] text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-[#0891B2] disabled:opacity-50 transition-all">
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

      <!-- Liste des posts -->
      <div class="space-y-4">
        <div v-for="post in posts" :key="post.id" class="bg-white rounded-xl shadow-sm border border-[#CFFAFE] overflow-hidden transition-all hover:shadow-md">
          <div class="p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-[#F0F9FF] flex items-center justify-center text-[#164E63] font-bold">
                {{ post.user?.nom?.charAt(0) || 'U' }}
              </div>
              <div>
                <h4 class="text-sm font-bold text-[#164E63]">{{ post.user?.nom || 'Utilisateur' }}</h4>
                <p class="text-[10px] text-gray-400">{{ formatDate(post.createdAt) }}</p>
              </div>
            </div>
            
            <div v-if="post.user?.id === user.id" class="relative">
              <button @click="toggleMenu(post.id)" class="p-2 hover:bg-[#F0F9FF] rounded-lg transition-colors">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                </svg>
              </button>
              
              <div v-if="activeMenu === post.id" class="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-[#CFFAFE] z-10">
                <button @click="openEditModal(post)" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#F0F9FF] flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  Modifier
                </button>
                <button @click="confirmDeletePost(post.id)" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-[#F0F9FF] flex items-center gap-2">
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

          <!-- Image cliquable -->
          <div v-if="post.imageData" class="w-full bg-gray-100 cursor-pointer" @click="openImageViewer(post)">
            <img :src="`data:${post.imageType};base64,${post.imageData}`" class="w-full max-h-96 object-cover" alt="Publication">
          </div>

          <!-- PDF avec téléchargement confirmé -->
          <div v-if="post.fileData" class="px-4 py-2">
            <button @click="confirmDownload(post)" class="inline-flex items-center gap-2 text-sm text-[#0891B2] hover:text-[#164E63] transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
              <span>{{ post.fileName }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
            </button>
          </div>

          <!-- Actions Like et Commentaire -->
          <div class="px-4 py-2 flex items-center gap-4 border-t border-[#F0F9FF]">
            <button @click="toggleLike(post.id)" class="flex items-center gap-2 px-2 py-1.5 hover:bg-[#F0F9FF] rounded-lg transition-all" :class="post.liked ? 'text-red-500' : 'text-gray-500'">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path :fill="post.liked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              <span class="text-xs font-bold">{{ post.likesCount || 0 }} J'aime</span>
            </button>
            
            <button @click="toggleComments(post.id)" class="flex items-center gap-2 px-2 py-1.5 hover:bg-[#F0F9FF] rounded-lg transition-all text-gray-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke-width="2"/>
              </svg>
              <span class="text-xs font-bold">{{ post.commentsCount || 0 }} Commentaires</span>
            </button>
          </div>

          <!-- Section des commentaires -->
          <div v-if="activeComments === post.id" class="border-t border-[#F0F9FF] p-4 bg-[#FAFAFA]">
            <div class="space-y-3 max-h-60 overflow-y-auto">
              <div v-for="comment in post.comments" :key="comment.id" class="flex gap-2 text-sm">
                <span class="font-bold text-[#164E63]">{{ comment.user?.nom || 'Utilisateur' }}:</span>
                <span class="text-gray-600">{{ comment.contenu }}</span>
              </div>
              <div v-if="!post.comments?.length" class="text-center text-gray-400 text-sm">
                Aucun commentaire pour le moment
              </div>
            </div>
            
            <div class="flex gap-2 mt-3">
              <input v-model="newComment[post.id]" type="text" placeholder="Écrire un commentaire..." 
                class="flex-grow bg-white border border-[#CFFAFE] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#06B6D4]">
              <button @click="addComment(post.id)" class="bg-[#06B6D4] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#164E63] transition-colors">
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
      <div class="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-bold text-[#164E63] mb-4">Modifier le post</h3>
        
        <textarea 
          v-model="editModal.contenu" 
          ref="editTextarea"
          class="w-full bg-[#F0F9FF] rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#06B6D4] outline-none resize-none overflow-hidden"
          rows="3"
          placeholder="Votre message..."
          @input="autoResizeTextarea"
        ></textarea>
        
        <!-- Section Image avec icône SVG -->
        <div class="mt-4 border border-[#CFFAFE] rounded-lg p-3">
          <div class="flex items-center gap-2 mb-2">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="text-xs font-bold text-gray-600">Image</span>
          </div>
          
          <div v-if="editModal.currentImageUrl && !editModal.newImagePreview" class="relative inline-block mb-3">
            <img :src="editModal.currentImageUrl" class="max-h-32 rounded-lg border border-[#CFFAFE]">
            <button @click="removeCurrentImage" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div v-if="editModal.newImagePreview" class="relative inline-block mb-3">
            <img :src="editModal.newImagePreview" class="max-h-32 rounded-lg border border-[#CFFAFE]">
            <button @click="removeNewImage" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <button @click="editImageInput?.click()" type="button" class="flex items-center gap-2 px-3 py-1.5 bg-[#F0F9FF] rounded-lg hover:bg-[#CFFAFE] transition-colors">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="1.5"/></svg>
            <span class="text-xs font-semibold text-gray-700">Changer l'image</span>
          </button>
          <input type="file" accept="image/*" ref="editImageInput" class="hidden" @change="handleEditImageUpload">
        </div>

        <!-- Section PDF avec icône SVG -->
        <div class="mt-4 border border-[#CFFAFE] rounded-lg p-3">
          <div class="flex items-center gap-2 mb-2">
            <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span class="text-xs font-bold text-gray-600">Document PDF</span>
          </div>
          
          <div v-if="editModal.currentFileName && !editModal.newPdfFile" class="flex items-center justify-between bg-gray-50 p-2 rounded-lg mb-3">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span class="text-sm text-gray-700">{{ editModal.currentFileName }}</span>
            </div>
            <button @click="removeCurrentFile" class="text-red-500 hover:text-red-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div v-if="editModal.newPdfFile" class="flex items-center justify-between bg-green-50 p-2 rounded-lg border border-green-200 mb-3">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span class="text-sm text-gray-700">{{ editModal.newPdfFile.name }} ({{ formatFileSize(editModal.newPdfFile.size) }})</span>
            </div>
            <button @click="removeNewFile" class="text-red-500 hover:text-red-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <button @click="editFileInput?.click()" type="button" class="flex items-center gap-2 px-3 py-1.5 bg-[#F0F9FF] rounded-lg hover:bg-[#CFFAFE] transition-colors">
            <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <span class="text-xs font-semibold text-gray-700">Changer le document</span>
          </button>
          <input type="file" accept=".pdf" ref="editFileInput" class="hidden" @change="handleEditFileUpload">
        </div>
        
        <div class="flex justify-end gap-3 mt-6">
          <button @click="closeEditModal" class="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg">Annuler</button>
          <button @click="updatePost" :disabled="isUpdating" class="px-4 py-2 bg-[#164E63] text-white rounded-lg hover:bg-[#0891B2] disabled:opacity-50">
            {{ isUpdating ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation personnalisée (icône dynamique selon l'action) -->
    <div v-if="confirmModal.show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4" @click.self="closeConfirmModal">
      <div class="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl text-center">
        <!-- Icône centrée avec condition -->
        <div class="flex justify-center mb-4">
          <div class="w-16 h-16 rounded-full bg-[#F0F9FF] flex items-center justify-center">
            <!-- Icône de suppression (poubelle) -->
            <svg v-if="confirmModal.iconType === 'delete'" class="w-8 h-8 text-[#0891B2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <!-- Icône de téléchargement (flèche vers le bas) -->
            <svg v-else class="w-8 h-8 text-[#0891B2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
        </div>
        <!-- Titre centré -->
        <h3 class="text-lg font-bold text-[#164E63] mb-2">{{ confirmModal.title }}</h3>
        <!-- Message -->
        <p class="text-sm text-gray-600 mb-6">{{ confirmModal.message }}</p>
        <!-- Boutons centrés avec couleurs du site -->
        <div class="flex justify-center gap-3">
          <button @click="closeConfirmModal" class="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            Annuler
          </button>
          <button @click="confirmModal.onConfirm" class="px-5 py-2 text-sm font-medium text-white bg-[#164E63] rounded-lg hover:bg-[#0891B2] transition-colors">
            Confirmer
          </button>
        </div>
      </div>
    </div>

    <!-- Modal d'aperçu d'image avec téléchargement -->
    <div v-if="imageViewer.show" class="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] p-4" @click.self="closeImageViewer">
      <div class="relative max-w-4xl max-h-[90vh] bg-white rounded-xl overflow-hidden">
        <img :src="imageViewer.url" class="max-w-full max-h-[80vh] object-contain">
        <button @click="downloadCurrentImage" class="absolute bottom-4 right-4 bg-[#164E63] text-white p-2 rounded-full hover:bg-[#0891B2] transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
        <button @click="closeImageViewer" class="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <input type="file" ref="imageInput" accept="image/*" class="hidden" @change="handleImageUpload">
    <input type="file" ref="fileInput" accept=".pdf" class="hidden" @change="handleFileUpload">
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import axios from 'axios'

const user = JSON.parse(localStorage.getItem('user') || '{"nom": "Utilisateur", "role": "parent", "id": 1}')
const userInitial = user.nom.charAt(0).toUpperCase()
const userRole = user.role

// États UI
const isExpanded = ref(false)
const isLoading = ref(false)
const isUpdating = ref(false)
const activeMenu = ref<number | null>(null)
const activeComments = ref<number | null>(null)
const newComment = ref<{ [key: number]: string }>({})

// Notification
const notification = ref({ show: false, message: '', type: 'success' })

// Formulaire création
const formData = reactive({ contenu: '', userId: user.id })
const imageFile = ref<File | null>(null)
const pdfFile = ref<File | null>(null)
const imagePreviewUrl = ref<string | null>(null)

// Posts
const posts = ref<any[]>([])

// Modal édition
const editModal = reactive({
  open: false,
  id: null as number | null,
  contenu: '',
  currentImageUrl: null as string | null,
  currentImageType: null as string | null,
  currentImageData: null as string | null,
  currentFileName: null as string | null,
  currentFileType: null as string | null,
  currentFileData: null as string | null,
  newImageFile: null as File | null,
  newImagePreview: null as string | null,
  newPdfFile: null as File | null,
  removeImage: false,
  removeFile: false
})

// Références inputs
const imageInput = ref<HTMLInputElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const editImageInput = ref<HTMLInputElement | null>(null)
const editFileInput = ref<HTMLInputElement | null>(null)
const editTextarea = ref<HTMLTextAreaElement | null>(null)

// Modal confirmation personnalisée (avec type d'icône)
const confirmModal = reactive({
  show: false,
  title: '',
  message: '',
  iconType: 'delete' as 'delete' | 'download',
  onConfirm: () => {}
})

// Image viewer
const imageViewer = reactive({
  show: false,
  url: '',
  fileType: '',
  fileData: ''
})

const API_BASE_URL = 'http://localhost:8082/api'

// Helpers
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' o'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko'
  return (bytes / (1024 * 1024)).toFixed(1) + ' Mo'
}

const showNotification = (message: string, type: 'success' | 'error') => {
  notification.value = { show: true, message, type }
  setTimeout(() => { notification.value.show = false }, 20000)
}

// Confirmation personnalisée avec icône dynamique
const showConfirm = (title: string, message: string, onConfirm: () => void, iconType: 'delete' | 'download' = 'delete') => {
  confirmModal.title = title
  confirmModal.message = message
  confirmModal.iconType = iconType
  confirmModal.onConfirm = () => {
    onConfirm()
    closeConfirmModal()
  }
  confirmModal.show = true
}

const closeConfirmModal = () => {
  confirmModal.show = false
  confirmModal.onConfirm = () => {}
}

// Image viewer
const openImageViewer = (post: any) => {
  imageViewer.url = `data:${post.imageType};base64,${post.imageData}`
  imageViewer.fileType = post.imageType
  imageViewer.fileData = post.imageData
  imageViewer.show = true
}

const closeImageViewer = () => {
  imageViewer.show = false
  imageViewer.url = ''
  imageViewer.fileData = ''
}

const downloadCurrentImage = () => {
  const link = document.createElement('a')
  link.href = imageViewer.url
  link.download = 'image.jpg'
  link.click()
  showNotification('Image téléchargée', 'success')
}

// API
const fetchPosts = async () => {
  isLoading.value = true
  try {
    const response = await axios.get(`${API_BASE_URL}/posts/user/${user.id}`)
    if (response.data.success) {
      posts.value = response.data.posts
    }
  } catch (error) {
    showNotification('Erreur de chargement des publications', 'error')
  } finally {
    isLoading.value = false
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'Date inconnue'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return 'Date inconnue'
  }
}

// Gestion fichier création
const handleImageUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    imageFile.value = file
    const reader = new FileReader()
    reader.onload = (ev) => { imagePreviewUrl.value = ev.target?.result as string }
    reader.readAsDataURL(file)
    showNotification('Image ajoutée ✓', 'success')
  }
}

const handleFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    pdfFile.value = file
    showNotification(`Document "${file.name}" ajouté ✓`, 'success')
  }
}

const removeSelectedImage = () => {
  imageFile.value = null
  imagePreviewUrl.value = null
  if (imageInput.value) imageInput.value.value = ''
}

const removeSelectedPdf = () => {
  pdfFile.value = null
  if (fileInput.value) fileInput.value.value = ''
}

const cancelPost = () => {
  formData.contenu = ''
  imageFile.value = null
  pdfFile.value = null
  imagePreviewUrl.value = null
  isExpanded.value = false
  if (imageInput.value) imageInput.value.value = ''
  if (fileInput.value) fileInput.value.value = ''
}

const handleSubmit = async () => {
  if (!formData.contenu.trim()) {
    showNotification('Veuillez écrire un message', 'error')
    return
  }
  isLoading.value = true
  const submitData = new FormData()
  submitData.append('contenu', formData.contenu)
  submitData.append('userId', String(user.id))
  if (imageFile.value) submitData.append('image', imageFile.value)
  if (pdfFile.value) submitData.append('file', pdfFile.value)
  try {
    const response = await axios.post(`${API_BASE_URL}/posts/create`, submitData, { headers: { 'Content-Type': 'multipart/form-data' } })
    if (response.data.success) {
      showNotification('Post publié avec succès !', 'success')
      cancelPost()
      await fetchPosts()
    } else {
      showNotification(response.data.error || 'Erreur lors de la publication', 'error')
    }
  } catch (error) {
    showNotification('Erreur lors de la publication', 'error')
  } finally {
    isLoading.value = false
  }
}

// Suppression avec confirmation (icône poubelle)
const confirmDeletePost = (postId: number) => {
  showConfirm('Supprimer le post', 'Voulez-vous vraiment supprimer cette publication ? Cette action est irréversible.', () => deletePost(postId), 'delete')
}

const deletePost = async (postId: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/posts/delete/${postId}`)
    if (response.data.success) {
      showNotification('Post supprimé avec succès', 'success')
      await fetchPosts()
    }
  } catch (error) {
    showNotification('Erreur lors de la suppression', 'error')
  }
  activeMenu.value = null
}

// Modale édition
const openEditModal = (post: any) => {
  editModal.id = post.id
  editModal.contenu = post.contenu
  editModal.currentImageUrl = post.imageData ? `data:${post.imageType};base64,${post.imageData}` : null
  editModal.currentImageType = post.imageType || null
  editModal.currentImageData = post.imageData || null
  editModal.currentFileName = post.fileName || null
  editModal.currentFileType = post.fileType || null
  editModal.currentFileData = post.fileData || null
  editModal.newImageFile = null
  editModal.newImagePreview = null
  editModal.newPdfFile = null
  editModal.removeImage = false
  editModal.removeFile = false
  editModal.open = true
  activeMenu.value = null
  nextTick(() => autoResizeTextarea())
}

const closeEditModal = () => {
  editModal.open = false
  editModal.id = null
  editModal.contenu = ''
  editModal.currentImageUrl = null
  editModal.currentFileName = null
  editModal.newImageFile = null
  editModal.newImagePreview = null
  editModal.newPdfFile = null
  editModal.removeImage = false
  editModal.removeFile = false
}

const autoResizeTextarea = () => {
  if (editTextarea.value) {
    editTextarea.value.style.height = 'auto'
    editTextarea.value.style.height = Math.min(editTextarea.value.scrollHeight, 200) + 'px'
  }
}

const handleEditImageUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    editModal.newImageFile = file
    const reader = new FileReader()
    reader.onload = (ev) => { editModal.newImagePreview = ev.target?.result as string }
    reader.readAsDataURL(file)
    editModal.removeImage = false
    showNotification('Nouvelle image sélectionnée', 'success')
  }
}

const handleEditFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    editModal.newPdfFile = file
    editModal.removeFile = false
    showNotification(`Nouveau document sélectionné : ${file.name}`, 'success')
  }
}

const removeNewImage = () => {
  editModal.newImageFile = null
  editModal.newImagePreview = null
  if (editImageInput.value) editImageInput.value.value = ''
}

const removeNewFile = () => {
  editModal.newPdfFile = null
  if (editFileInput.value) editFileInput.value.value = ''
}

const removeCurrentImage = () => {
  editModal.removeImage = true
  editModal.currentImageUrl = null
  editModal.currentImageData = null
  editModal.newImageFile = null
  editModal.newImagePreview = null
}

const removeCurrentFile = () => {
  editModal.removeFile = true
  editModal.currentFileName = null
  editModal.currentFileData = null
  editModal.newPdfFile = null
}

const updatePost = async () => {
  if (!editModal.id) return
  isUpdating.value = true
  const formDataUpdate = new FormData()
  formDataUpdate.append('contenu', editModal.contenu)
  formDataUpdate.append('userId', String(user.id))
  if (editModal.newImageFile) formDataUpdate.append('image', editModal.newImageFile)
  else if (editModal.removeImage) formDataUpdate.append('removeImage', 'true')
  if (editModal.newPdfFile) formDataUpdate.append('file', editModal.newPdfFile)
  else if (editModal.removeFile) formDataUpdate.append('removeFile', 'true')
  try {
    const response = await axios.put(`${API_BASE_URL}/posts/update/${editModal.id}`, formDataUpdate, { headers: { 'Content-Type': 'multipart/form-data' } })
    if (response.data.success) {
      showNotification('Post modifié avec succès', 'success')
      await fetchPosts()
      closeEditModal()
    } else {
      showNotification(response.data.error || 'Erreur lors de la modification', 'error')
    }
  } catch (error) {
    showNotification('Erreur lors de la modification', 'error')
  } finally {
    isUpdating.value = false
  }
}

// Téléchargement PDF avec confirmation (icône téléchargement)
const confirmDownload = (post: any) => {
  showConfirm('Télécharger le document', `Voulez-vous télécharger le fichier "${post.fileName}" ?`, () => {
    const link = document.createElement('a')
    link.href = `data:${post.fileType};base64,${post.fileData}`
    link.download = post.fileName
    link.click()
    showNotification('Téléchargement démarré', 'success')
  }, 'download')
}

// Likes, commentaires, etc.
const toggleLike = async (postId: number) => {
  const post = posts.value.find(p => p.id === postId)
  if (!post) return
  try {
    const response = await axios.post(`${API_BASE_URL}/likes/toggle`, null, { params: { userId: user.id, postId } })
    if (response.data.success) {
      post.liked = response.data.liked
      post.likesCount = response.data.count
    }
  } catch (error) { console.error(error) }
}

const toggleComments = async (postId: number) => {
  if (activeComments.value === postId) {
    activeComments.value = null
  } else {
    activeComments.value = postId
    const post = posts.value.find(p => p.id === postId)
    if (post && !post.comments?.length) await fetchComments(postId)
  }
}

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
  } catch (error) { console.error(error) }
}

const addComment = async (postId: number) => {
  const commentText = newComment.value[postId]
  if (!commentText?.trim()) return
  try {
    const response = await axios.post(`${API_BASE_URL}/comments/add`, { contenu: commentText, user: { id: user.id }, post: { id: postId } })
    if (response.data.success) {
      const post = posts.value.find(p => p.id === postId)
      if (post) {
        if (!post.comments) post.comments = []
        post.comments.unshift({ id: response.data.comment.id, contenu: commentText, user: { nom: user.nom, id: user.id }, createdAt: response.data.comment.createdAt })
        post.commentsCount = (post.commentsCount || 0) + 1
        newComment.value[postId] = ''
      }
    }
  } catch (error) {
    showNotification('Erreur lors de l\'ajout du commentaire', 'error')
  }
}

const toggleMenu = (postId: number) => { activeMenu.value = activeMenu.value === postId ? null : postId }
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) activeMenu.value = null
}

onMounted(() => {
  fetchPosts()
  document.addEventListener('click', handleClickOutside)
})
</script>

<style scoped>
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

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>