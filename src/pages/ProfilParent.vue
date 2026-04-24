<template>
  <div class="profile-page">
    <div class="max-w-6xl mx-auto px-4 py-6">

      <!-- Barre supérieure -->
      <div class="top-bar">
        <div class="user-initial" @click="toggleUserTooltip">
          {{ userInitial }}
          <div class="online-dot"></div>
        </div>
        <span class="user-name">{{ user.nom }}</span>
      </div>

      <!-- Bulle d'infos utilisateur -->
      <div v-if="showUserTooltip" class="user-info-tooltip" @click.stop>
        <div class="tooltip-content">
          <div class="tooltip-avatar">{{ userInitial }}</div>
          <div class="tooltip-email">{{ user.email }}</div>
          <div class="tooltip-role">{{ formattedRole }}</div>
        </div>
        <div class="tooltip-arrow"></div>
      </div>

      <!-- Toast -->
      <transition name="notify-slow">
        <div v-if="notification.show" class="toast-notification" :class="notification.type">
          <div class="toast-icon">
            <svg v-if="notification.type === 'success'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="toast-message">{{ notification.message }}</div>
          <button @click="notification.show = false" class="toast-close">✕</button>
        </div>
      </transition>

      <!-- Carte d'informations utilisateur (non modifiable par défaut) -->
      <div class="user-info-card">
        <div class="user-info-header">
          <h3>Mes informations</h3>
          <button class="edit-icon-button" @click="toggleEditMode">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Modifier
          </button>
        </div>
        <div class="user-info-grid">
          <div class="info-row">
            <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            <span class="info-label">Nom complet</span>
            <span class="info-text">{{ user.nom }}</span>
          </div>
          <div class="info-row">
            <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            <span class="info-label">Email</span>
            <span class="info-text">{{ user.email }}</span>
          </div>
          <div class="info-row">
            <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            <span class="info-label">Rôle</span>
            <span class="info-text role-badge">{{ formattedRole }}</span>
          </div>
          <div class="info-row">
            <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            <span class="info-label">Téléphone</span>
            <span class="info-text">{{ user.telephone || 'Non renseigné' }}</span>
          </div>
          <div class="info-row">
            <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span class="info-label">Adresse</span>
            <span class="info-text">{{ user.adresse || 'Non renseignée' }}</span>
          </div>
          <div class="info-row">
            <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            <span class="info-label">Membre depuis</span>
            <span class="info-text">{{ memberSince }}</span>
          </div>
          <div v-if="user.role === 'EDUCATEUR' || user.role === 'PSY'" class="info-row">
            <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            <span class="info-label">Lieu de travail</span>
            <span class="info-text">{{ user.lieuTravail || 'Non renseigné' }}</span>
          </div>
          <div v-if="user.role === 'PSY'" class="info-row">
            <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            <span class="info-label">Spécialité</span>
            <span class="info-text">{{ user.specialite || 'Non renseignée' }}</span>
          </div>
        </div>
      </div>

      <!-- Carte d'édition (modale intégrée) -->
      <transition name="slide-down">
        <div v-if="showPersonalInfo" class="personal-info-card">
          <div class="personal-info-header"><h3>Modifier mes informations</h3><button class="close-edit" @click="cancelEdit">✕</button></div>
          <div class="personal-info-grid">
            <div class="info-item">
              <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              <span class="info-label">Nom</span>
              <div class="field-wrapper" :class="{ error: nameError }"><input v-model="editForm.nom" type="text" @input="validateName" /><span v-if="nameError" class="error-tooltip">⚠️</span></div>
            </div>
            <div class="info-item">
              <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              <span class="info-label">Email</span>
              <div class="field-wrapper" :class="{ error: emailError }"><input v-model="editForm.email" type="email" @input="validateEmail" /><span v-if="emailError" class="error-tooltip">⚠️</span></div>
            </div>
            <div class="info-item">
              <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              <span class="info-label">Rôle</span>
              <span class="info-value role-badge-static">{{ formattedRole }}</span>
            </div>
            <div class="info-item">
              <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              <span class="info-label">Téléphone</span>
              <div class="field-wrapper" :class="{ error: telephoneError }"><input v-model="editForm.telephone" type="tel" @input="validateTelephone" /><span v-if="telephoneError" class="error-tooltip">⚠️</span></div>
            </div>
            <div class="info-item">
              <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <span class="info-label">Adresse</span>
              <input v-model="editForm.adresse" class="edit-input" />
            </div>
            <div class="info-item full-width">
              <div class="password-group">
                <div class="password-field">
                  <span class="info-label">Nouveau mot de passe</span>
                  <div class="field-wrapper" :class="{ error: passwordError }">
                    <input v-model="editForm.password" :type="showPassword ? 'text' : 'password'" @input="validatePassword" />
                    <button type="button" class="password-toggle" @click="showPassword = !showPassword">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="!showPassword" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        <path v-else d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59" />
                      </svg>
                    </button>
                    <span v-if="passwordError" class="error-tooltip">⚠️</span>
                  </div>
                </div>
                <div class="password-field">
                  <span class="info-label">Confirmation</span>
                  <div class="field-wrapper" :class="{ error: confirmPasswordError }">
                    <input v-model="editForm.confirmPassword" :type="showPassword ? 'text' : 'password'" @input="validateConfirmPassword" />
                    <span v-if="confirmPasswordError" class="error-tooltip">⚠️</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="edit-buttons">
            <button class="cancel-btn" @click="cancelEdit">Annuler</button>
            <button class="save-btn" @click="saveProfile" :disabled="profileUpdating || hasErrors">
              <span v-if="profileUpdating" class="loader-small"></span>
              <span v-else>Enregistrer</span>
            </button>
          </div>
        </div>
      </transition>

      <!-- Tableau de bord avec hover amélioré -->
      <div class="stats-dashboard">
        <div v-for="(item, key) in dashboardItems" :key="key" class="stat-card" :class="{ active: activeSection === key }" @click="changeSection(key)">
          <div class="stat-icon" v-html="item.icon"></div>
          <div class="stat-value">{{ stats[key] }}</div>
          <div class="stat-label">{{ item.label }}</div>
        </div>
      </div>

      <!-- Contenu dynamique -->
      <div class="content-section">
        <!-- Mes publications -->
        <div v-if="activeSection === 'posts'">
          <div v-if="loadingPosts" class="loader-wrapper"><div class="loader"></div> Chargement...</div>
          <div v-else-if="posts.length === 0" class="empty-state">Aucune publication</div>
          <div v-else class="posts-grid">
            <div v-for="post in posts" :key="post.id" class="post-card">
              <div class="post-header">
                <div class="post-user">
                  <div class="user-avatar-sm">{{ post.user?.nom?.charAt(0) || 'U' }}</div>
                  <div><div class="user-name">{{ post.user?.nom || 'Utilisateur' }}</div><div class="post-date">{{ formatDate(post.createdAt) }}</div></div>
                </div>
                <div class="post-stats">
                  <span class="stat-badge"><svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg> {{ post.likesCount || 0 }}</span>
                  <span class="stat-badge"><svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg> {{ post.commentsCount || 0 }}</span>
                </div>
              </div>
              <div class="post-body">
                <p>{{ post.contenu }}</p>
                <div v-if="post.imageData" class="post-media"><img :src="`data:${post.imageType};base64,${post.imageData}`" @click="openImageModal(post)" loading="lazy" /></div>
                <div v-if="post.fileData" class="post-file"><a :href="`data:${post.fileType};base64,${post.fileData}`" :download="post.fileName" class="file-link"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg> {{ post.fileName }}</a></div>
              </div>
              <div class="post-actions">
                <button class="action-like" :class="{ active: post.liked }" @click="toggleLike(post.id)"><svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path :fill="post.liked ? 'currentColor' : 'none'" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg> {{ post.liked ? 'J’aime' : 'Aimer' }}</button>
                <button class="action-comment" @click="toggleComments(post.id)"><svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg> Commentaires ({{ post.commentsCount }})</button>
                <button class="action-likers" @click="openLikersModal(post.id)"><svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg> Likes ({{ post.likesCount }})</button>
              </div>
              <div v-if="activeComments === post.id" class="comments-section">
                <div v-for="comment in post.comments" :key="comment.id" class="comment-item">
                  <div class="comment-avatar">{{ comment.user?.nom?.charAt(0) || 'U' }}</div>
                  <div class="comment-content">
                    <div class="comment-author">{{ comment.user?.nom || 'Utilisateur' }}</div>
                    <div v-if="editingCommentId !== comment.id" class="comment-text">{{ comment.contenu }}</div>
                    <input v-else v-model="editCommentText" class="comment-edit-input" />
                    <div class="comment-date">{{ formatDate(comment.createdAt) }}</div>
                    <div v-if="comment.user?.id === user.id" class="comment-actions">
                      <button v-if="editingCommentId !== comment.id" @click="startEditComment(comment)"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg> Modifier</button>
                      <button v-else @click="saveEditComment(comment.id)"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg> Enregistrer</button>
                      <button v-if="editingCommentId !== comment.id" @click="confirmDeleteComment(comment.id)"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg> Supprimer</button>
                      <button v-else @click="cancelEditComment"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg> Annuler</button>
                    </div>
                  </div>
                </div>
                <div class="add-comment"><input v-model="newCommentText" placeholder="Ajouter un commentaire..." class="comment-input" /><button @click="addComment(post.id)" class="comment-send"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg></button></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Likes reçus (nouvelle section) -->
        <div v-if="activeSection === 'likesReceived'">
          <div v-if="loadingLikesReceived" class="loader-wrapper"><div class="loader"></div> Chargement...</div>
          <div v-else-if="likesReceivedList.length === 0" class="empty-state">Aucun like reçu sur vos publications</div>
          <div v-else class="users-grid">
            <div v-for="user in likesReceivedList" :key="user.id" class="user-card">
              <div class="user-card-avatar">{{ user.nom.charAt(0).toUpperCase() }}</div>
              <div class="user-card-info">
                <div class="user-card-name">{{ user.nom }}</div>
                <div class="user-card-role">{{ formatRole(user.role) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Commentaires reçus (nouvelle section) -->
        <div v-if="activeSection === 'commentsReceived'">
          <div v-if="loadingCommentsReceived" class="loader-wrapper"><div class="loader"></div> Chargement...</div>
          <div v-else-if="commentsReceivedList.length === 0" class="empty-state">Aucun commentaire reçu sur vos publications</div>
          <div v-else class="users-grid">
            <div v-for="user in commentsReceivedList" :key="user.id" class="user-card">
              <div class="user-card-avatar">{{ user.nom.charAt(0).toUpperCase() }}</div>
              <div class="user-card-info">
                <div class="user-card-name">{{ user.nom }}</div>
                <div class="user-card-role">{{ formatRole(user.role) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- J’aime -->
        <div v-if="activeSection === 'myLikes'">
          <div v-if="loadingLiked" class="loader-wrapper"><div class="loader"></div> Chargement...</div>
          <div v-else-if="likedPosts.length === 0" class="empty-state">Vous n'avez encore aimé aucune publication</div>
          <div v-else class="posts-grid">
            <div v-for="liked in likedPosts" :key="liked.id" class="post-card">
              <div class="post-header"><div class="post-user"><div class="user-avatar-sm">{{ liked.user?.nom?.charAt(0) || 'U' }}</div><div><div class="user-name">{{ liked.user?.nom || 'Utilisateur' }}</div><div class="post-date">{{ formatDate(liked.createdAt) }}</div></div></div></div>
              <div class="post-body"><p>{{ liked.contenu }}</p><div v-if="liked.imageData" class="post-media"><img :src="`data:${liked.imageType};base64,${liked.imageData}`" alt="Image" loading="lazy" /></div></div>
            </div>
          </div>
        </div>

        <!-- Commentés -->
        <div v-if="activeSection === 'myComments'">
          <div v-if="loadingCommented" class="loader-wrapper"><div class="loader"></div> Chargement...</div>
          <div v-else-if="commentedPosts.length === 0" class="empty-state">Vous n'avez encore commenté aucune publication</div>
          <div v-else class="posts-grid">
            <div v-for="commented in commentedPosts" :key="commented.id" class="post-card">
              <div class="post-header"><div class="post-user"><div class="user-avatar-sm">{{ commented.user?.nom?.charAt(0) || 'U' }}</div><div><div class="user-name">{{ commented.user?.nom || 'Utilisateur' }}</div><div class="post-date">{{ formatDate(commented.createdAt) }}</div></div></div></div>
              <div class="post-body"><p>{{ commented.contenu }}</p><div v-if="commented.imageData" class="post-media"><img :src="`data:${commented.imageType};base64,${commented.imageData}`" alt="Image" loading="lazy" /></div></div>
              <div class="post-actions"><button class="action-comment" @click="toggleMyComments(commented.id)"><svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg> {{ activeMyComments === commented.id ? 'Masquer mes commentaires' : 'Voir mes commentaires' }}</button></div>
              <div v-if="activeMyComments === commented.id" class="comments-section">
                <div v-if="loadingUserComments[commented.id]" class="loader-small-wrapper"><div class="loader-small"></div> Chargement...</div>
                <div v-else-if="userComments[commented.id] && userComments[commented.id].length === 0" class="text-center py-2 text-gray-400">Vous n'avez pas encore commenté cette publication.</div>
                <div v-else>
                  <div v-for="comment in userComments[commented.id]" :key="comment.id" class="comment-item">
                    <div class="comment-avatar">{{ comment.user?.nom?.charAt(0) || user.nom.charAt(0) }}</div>
                    <div class="comment-content">
                      <div class="comment-author">{{ comment.user?.nom || user.nom }}</div>
                      <div v-if="editingCommentId !== comment.id" class="comment-text">{{ comment.contenu }}</div>
                      <input v-else v-model="editCommentText" class="comment-edit-input" />
                      <div class="comment-date">{{ formatDate(comment.createdAt) }}</div>
                      <div v-if="comment.user?.id === user.id" class="comment-actions">
                        <button v-if="editingCommentId !== comment.id" @click="startEditComment(comment)"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg> Modifier</button>
                        <button v-else @click="saveEditComment(comment.id)"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg> Enregistrer</button>
                        <button v-if="editingCommentId !== comment.id" @click="confirmDeleteComment(comment.id)"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg> Supprimer</button>
                        <button v-else @click="cancelEditComment"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg> Annuler</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modale pour les likes sur un post spécifique -->
      <div v-if="likersModal.open" class="modal-overlay" @click.self="closeLikersModal">
        <div class="modal-card"><div class="modal-header"><h3>Personnes qui ont aimé</h3><button class="close-modal" @click="closeLikersModal">✕</button></div><div v-if="loadingLikers" class="loader-small-wrapper"><div class="loader-small"></div> Chargement...</div><div v-else class="users-list"><div v-for="u in likersList" :key="u.id" class="user-chip"><div class="chip-avatar">{{ u.nom.charAt(0).toUpperCase() }}</div><span>{{ u.nom }}</span><span class="chip-role">{{ formatRole(u.role) }}</span></div><div v-if="likersList.length === 0" class="text-center py-4 text-gray-400">Personne n'a aimé cette publication</div></div></div>
      </div>

      <div v-if="imageModal.open" class="modal-overlay" @click.self="closeImageModal">
        <div class="image-modal"><img :src="imageModal.url" alt="Aperçu" /><button class="close-modal" @click="closeImageModal">✕</button></div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8082/api'

let userStorage = localStorage.getItem('user')
const user = ref(JSON.parse(userStorage || '{"nom": "Utilisateur", "role": "parent", "id": 1, "email": "user@example.com", "telephone": "", "adresse": "", "createdAt": "2024-01-01"}'))

const userInitial = computed(() => user.value.nom.charAt(0).toUpperCase())
const formattedRole = computed(() => {
  const r = user.value.role?.toUpperCase()
  if (r === 'PARENT') return 'Parent'
  if (r === 'EDUCATEUR') return 'Éducatrice'
  if (r === 'PSY') return 'Psychologue'
  return user.value.role || 'Membre'
})
const memberSince = computed(() => {
  if (!user.value.createdAt) return 'Non disponible'
  return new Date(user.value.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
})

const dashboardItems = {
  posts: { label: 'Publications', icon: '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>' },
  likesReceived: { label: 'Likes reçus', icon: '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>' },
  commentsReceived: { label: 'Commentaires reçus', icon: '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>' },
  myLikes: { label: 'J’aime', icon: '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>' },
  myComments: { label: 'Commentés', icon: '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>' }
}

// États UI
const notification = ref({ show: false, message: '', type: 'success' })
const activeSection = ref('posts')
const showPersonalInfo = ref(false)
const showUserTooltip = ref(false)
const loadingPosts = ref(false)
const loadingLiked = ref(false)
const loadingCommented = ref(false)
const profileUpdating = ref(false)

const posts = ref([])
const likedPosts = ref([])
const commentedPosts = ref([])
const stats = reactive({ posts: 0, likesReceived: 0, commentsReceived: 0, myLikes: 0, myComments: 0 })

// Édition profil
const editForm = reactive({ nom: user.value.nom, email: user.value.email, telephone: user.value.telephone || '', adresse: user.value.adresse || '', lieuTravail: user.value.lieuTravail || '', specialite: user.value.specialite || '', password: '', confirmPassword: '' })
const nameError = ref('')
const emailError = ref('')
const telephoneError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')
const showPassword = ref(false)
const hasErrors = computed(() => !!(nameError.value || emailError.value || telephoneError.value || passwordError.value || confirmPasswordError.value))

// Commentaires
const activeComments = ref(null)
const newCommentText = ref('')
const editingCommentId = ref(null)
const editCommentText = ref('')
const activeMyComments = ref(null)
const userComments = ref({})
const loadingUserComments = ref({})

// Modales
const likersModal = ref({ open: false, postId: null })
const likersList = ref([])
const loadingLikers = ref(false)
const likesReceivedList = ref([])
const commentsReceivedList = ref([])
const loadingLikesReceived = ref(false)
const loadingCommentsReceived = ref(false)
const imageModal = ref({ open: false, url: '' })

// ========== FONCTIONS ==========
function showNotification(msg, type) {
  notification.value = { show: true, message: msg, type }
  setTimeout(() => { notification.value.show = false }, 5000)
}

async function changeSection(section) {
  activeSection.value = section
  if (section === 'likesReceived') {
    await fetchLikesReceivedList()
  } else if (section === 'commentsReceived') {
    await fetchCommentsReceivedList()
  }
}

function validateName() {
  if (!editForm.nom.trim()) nameError.value = 'Le nom est requis'
  else if (editForm.nom.length < 2) nameError.value = 'Minimum 2 caractères'
  else nameError.value = ''
}
function validateEmail() {
  const email = editForm.email.trim()
  if (!email) emailError.value = 'L\'email est requis'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) emailError.value = 'Email invalide'
  else emailError.value = ''
}
function validateTelephone() {
  const tel = editForm.telephone.trim()
  if (tel && !/^(032|033|034|037|038)\d{7}$/.test(tel)) telephoneError.value = 'Téléphone invalide (ex: 0321234567)'
  else telephoneError.value = ''
}
function validatePassword() {
  if (editForm.password && editForm.password.length < 6) passwordError.value = '6 caractères minimum'
  else passwordError.value = ''
  if (editForm.confirmPassword) validateConfirmPassword()
}
function validateConfirmPassword() {
  if (editForm.password !== editForm.confirmPassword) confirmPasswordError.value = 'Mots de passe différents'
  else confirmPasswordError.value = ''
}

// Récupération des données
async function fetchUserPosts() {
  loadingPosts.value = true
  try {
    const res = await axios.get(`${API_BASE_URL}/posts/user/${user.value.id}`)
    if (res.data.success) {
      posts.value = res.data.posts
      let totalLikes = 0, totalComments = 0
      posts.value.forEach(p => {
        totalLikes += p.likesCount || 0
        totalComments += p.commentsCount || 0
      })
      stats.posts = posts.value.length
      stats.likesReceived = totalLikes
      stats.commentsReceived = totalComments
    }
  } catch (err) { showNotification('Erreur chargement publications', 'error') }
  finally { loadingPosts.value = false }
}

async function fetchLikedPosts() {
  loadingLiked.value = true
  try {
    const res = await axios.get(`${API_BASE_URL}/likes/my-likes/${user.value.id}`)
    if (res.data.success) { likedPosts.value = res.data.posts; stats.myLikes = likedPosts.value.length }
  } catch (err) { console.error(err) }
  finally { loadingLiked.value = false }
}

async function fetchCommentedPosts() {
  loadingCommented.value = true
  try {
    const res = await axios.get(`${API_BASE_URL}/posts/commented-by/${user.value.id}`)
    if (res.data.success) { commentedPosts.value = res.data.posts; stats.myComments = commentedPosts.value.length }
  } catch (err) { console.error(err) }
  finally { loadingCommented.value = false }
}

async function fetchUserCommentsForPost(postId) {
  if (userComments.value[postId]) return
  loadingUserComments.value[postId] = true
  try {
    const res = await axios.get(`${API_BASE_URL}/comments/post/${postId}`)
    if (res.data.success) { userComments.value[postId] = res.data.comments.filter(c => c.user?.id === user.value.id) }
    else userComments.value[postId] = []
  } catch (err) { userComments.value[postId] = [] }
  finally { loadingUserComments.value[postId] = false }
}

// Récupération des listes pour les sections likes reçus et commentaires reçus
async function fetchLikesReceivedList() {
  loadingLikesReceived.value = true
  try {
    const res = await axios.get(`${API_BASE_URL}/likes/received/users/${user.value.id}`)
    if (res.data.success && Array.isArray(res.data.users)) likesReceivedList.value = res.data.users
    else likesReceivedList.value = []
  } catch (err) { likesReceivedList.value = [] }
  finally { loadingLikesReceived.value = false }
}

async function fetchCommentsReceivedList() {
  loadingCommentsReceived.value = true
  try {
    const res = await axios.get(`${API_BASE_URL}/comments/received/users/${user.value.id}`)
    if (res.data.success && Array.isArray(res.data.users)) commentsReceivedList.value = res.data.users
    else commentsReceivedList.value = []
  } catch (err) { commentsReceivedList.value = [] }
  finally { loadingCommentsReceived.value = false }
}

async function fetchLikersList(postId) {
  loadingLikers.value = true
  try {
    const res = await axios.get(`${API_BASE_URL}/likes/post/${postId}/users`)
    if (res.data.success && Array.isArray(res.data.users)) likersList.value = res.data.users
    else likersList.value = []
  } catch (err) { likersList.value = [] }
  finally { loadingLikers.value = false }
}

// Actions
async function toggleLike(postId) {
  const post = posts.value.find(p => p.id === postId)
  if (!post) return
  try {
    const res = await axios.post(`${API_BASE_URL}/likes/toggle`, null, { params: { userId: user.value.id, postId } })
    if (res.data.success) {
      post.liked = res.data.liked
      post.likesCount = res.data.count
      stats.likesReceived = posts.value.reduce((acc, p) => acc + (p.likesCount || 0), 0)
      showNotification(res.data.liked ? 'Vous aimez ce post' : 'Vous n\'aimez plus ce post', 'success')
    }
  } catch (err) { console.error(err) }
}

function toggleComments(postId) {
  activeComments.value = activeComments.value === postId ? null : postId
}

async function addComment(postId) {
  if (!newCommentText.value.trim()) return
  try {
    const res = await axios.post(`${API_BASE_URL}/comments/add`, { contenu: newCommentText.value, user: { id: user.value.id }, post: { id: postId } })
    if (res.data.success) {
      const post = posts.value.find(p => p.id === postId)
      if (post) {
        if (!post.comments) post.comments = []
        post.comments.unshift({ id: res.data.comment.id, contenu: newCommentText.value, user: { nom: user.value.nom, id: user.value.id }, createdAt: new Date().toISOString() })
        post.commentsCount = (post.commentsCount || 0) + 1
        stats.commentsReceived++
      }
      newCommentText.value = ''
      showNotification('Commentaire ajouté', 'success')
    }
  } catch (err) { showNotification('Erreur ajout commentaire', 'error') }
}

function startEditComment(comment) { editingCommentId.value = comment.id; editCommentText.value = comment.contenu }
function cancelEditComment() { editingCommentId.value = null; editCommentText.value = '' }
async function saveEditComment(commentId) {
  try {
    const res = await axios.put(`${API_BASE_URL}/comments/${commentId}`, { contenu: editCommentText.value }, { headers: { 'X-User-Id': user.value.id } })
    if (res.data.success) {
      for (const post of posts.value) { const c = post.comments?.find(c => c.id === commentId); if (c) { c.contenu = editCommentText.value; break } }
      for (const pid in userComments.value) { const c = userComments.value[pid]?.find(c => c.id === commentId); if (c) { c.contenu = editCommentText.value; break } }
      cancelEditComment()
      showNotification('Commentaire modifié', 'success')
    }
  } catch (err) { showNotification('Erreur modification', 'error') }
}
async function confirmDeleteComment(commentId) {
  if (!confirm('Supprimer ce commentaire ?')) return
  try {
    await axios.delete(`${API_BASE_URL}/comments/${commentId}`, { headers: { 'X-User-Id': user.value.id } })
    for (const post of posts.value) { const idx = post.comments?.findIndex(c => c.id === commentId); if (idx !== -1) { post.comments.splice(idx, 1); post.commentsCount--; stats.commentsReceived--; break } }
    for (const pid in userComments.value) { const idx = userComments.value[pid]?.findIndex(c => c.id === commentId); if (idx !== -1) { userComments.value[pid].splice(idx, 1); break } }
    showNotification('Commentaire supprimé', 'success')
  } catch (err) { showNotification('Erreur suppression', 'error') }
}
function toggleMyComments(postId) {
  if (activeMyComments.value === postId) activeMyComments.value = null
  else { activeMyComments.value = postId; fetchUserCommentsForPost(postId) }
}

// Modales
async function openLikersModal(postId) { likersModal.value = { open: true, postId }; await fetchLikersList(postId) }
function closeLikersModal() { likersModal.value.open = false }
function openImageModal(post) { imageModal.value = { open: true, url: `data:${post.imageType};base64,${post.imageData}` } }
function closeImageModal() { imageModal.value.open = false }

// Gestion profil
function toggleEditMode() {
  if (showPersonalInfo.value) showPersonalInfo.value = false
  else {
    Object.assign(editForm, { nom: user.value.nom, email: user.value.email, telephone: user.value.telephone || '', adresse: user.value.adresse || '', lieuTravail: user.value.lieuTravail || '', specialite: user.value.specialite || '', password: '', confirmPassword: '' })
    nameError.value = emailError.value = telephoneError.value = passwordError.value = confirmPasswordError.value = ''
    showPersonalInfo.value = true
  }
}
function cancelEdit() { showPersonalInfo.value = false }
async function saveProfile() {
  validateName(); validateEmail(); validateTelephone(); validatePassword(); validateConfirmPassword()
  if (hasErrors.value) return
  profileUpdating.value = true
  try {
    const payload = { nom: editForm.nom, email: editForm.email, telephone: editForm.telephone, adresse: editForm.adresse, lieuTravail: editForm.lieuTravail, specialite: editForm.specialite, password: editForm.password || undefined }
    const res = await axios.put(`${API_BASE_URL}/auth/profile`, payload, { headers: { 'X-User-Id': user.value.id } })
    if (res.data.success) {
      const updatedUser = res.data.user
      localStorage.setItem('user', JSON.stringify(updatedUser))
      user.value = updatedUser
      showNotification('Profil mis à jour', 'success')
      cancelEdit()
      await fetchUserPosts(); await fetchLikedPosts(); await fetchCommentedPosts()
    }
  } catch (err) { showNotification(err.response?.data?.error || 'Erreur', 'error') }
  finally { profileUpdating.value = false }
}

function toggleUserTooltip(event) { event.stopPropagation(); showUserTooltip.value = !showUserTooltip.value; if (showUserTooltip.value) setTimeout(() => showUserTooltip.value = false, 3000) }
function handleClickOutside(event) { if (showUserTooltip.value && !event.target.closest('.user-initial') && !event.target.closest('.avatar-large')) showUserTooltip.value = false }
function formatDate(dateString) { if (!dateString) return ''; return new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }
function formatRole(role) { if (role === 'PARENT') return 'Parent'; if (role === 'EDUCATEUR') return 'Éducatrice'; if (role === 'PSY') return 'Psychologue'; return role || '' }

onMounted(() => {
  fetchUserPosts(); fetchLikedPosts(); fetchCommentedPosts()
  document.addEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* ========== STYLES COMPLETS AVEC AMÉLIORATIONS ========== */
.profile-page {
  background: #fefaf5;
  min-height: 100vh;
}
.max-w-6xl {
  max-width: 72rem;
}
.notify-slow-enter-active, .notify-slow-leave-active {
  transition: all 0.3s ease;
}
.notify-slow-enter-from, .notify-slow-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}
.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  border-radius: 60px;
  padding: 10px 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  border-left: 4px solid;
}
.toast-notification.success { border-left-color: #10b981; }
.toast-notification.error { border-left-color: #ef4444; }
.toast-icon svg { stroke: currentColor; }
.toast-message { font-size: 0.875rem; font-weight: 500; color: #1f2937; }
.toast-close { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #9ca3af; }
.top-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding: 8px 20px;
  background: white;
  border-radius: 60px;
  border: 1px solid #efe5db;
  box-shadow: 0 2px 6px rgba(0,0,0,0.03);
}
.user-initial {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, #d2b48c, #3e2c1f);
  border-radius: 50%;
  font-weight: bold;
  color: white;
  font-size: 1rem;
  cursor: pointer;
}
.online-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  background: #2ecc71;
  border: 2px solid white;
  border-radius: 50%;
}
.user-name {
  font-weight: 600;
  color: #3e2c1f;
  font-size: 1rem;
}
.user-info-tooltip {
  position: fixed;
  top: 80px;
  left: 24px;
  background: white;
  border-radius: 1.2rem;
  box-shadow: 0 20px 35px -8px rgba(0,0,0,0.15);
  padding: 1rem;
  z-index: 200;
  min-width: 200px;
  border: 1px solid #efe5db;
}
.tooltip-arrow {
  position: absolute;
  top: -8px;
  left: 24px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid white;
}
.tooltip-content { text-align: center; }
.tooltip-avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #d2b48c, #3e2c1f);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
}
.tooltip-email { font-size: 0.8rem; color: #3e2c1f; word-break: break-all; }
.tooltip-role { font-size: 0.7rem; color: #8b8b8b; text-transform: uppercase; margin-top: 0.2rem; }

/* Carte d'informations non modifiable */
.user-info-card {
  background: white;
  border-radius: 1.2rem;
  padding: 1.2rem 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #efe5db;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.user-info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #efe5db;
}
.user-info-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #3e2c1f;
}
.edit-icon-button {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #d2b48c;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 40px;
  transition: all 0.2s;
}
.edit-icon-button:hover {
  background: #fef5ea;
  color: #8b5e3c;
}
.user-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.8rem;
}
.info-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.4rem 0;
}
.info-icon {
  width: 18px;
  height: 18px;
  color: #d2b48c;
  flex-shrink: 0;
}
.info-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #8b7355;
  min-width: 100px;
}
.info-text {
  font-size: 0.85rem;
  color: #3e2c1f;
}
.role-badge {
  background: #f3eeea;
  padding: 0.2rem 0.8rem;
  border-radius: 40px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Carte d'édition */
.personal-info-card {
  background: white;
  border-radius: 1.2rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #efe5db;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
.personal-info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #efe5db;
}
.personal-info-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #3e2c1f;
}
.close-edit {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #8b8b8b;
}
.personal-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
}
.info-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #fefcf8;
  padding: 0.6rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid #efe5db;
  flex-wrap: wrap;
}
.info-item.full-width {
  grid-column: 1 / -1;
}
.field-wrapper {
  position: relative;
  flex: 1;
}
.field-wrapper input {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.4rem 0.6rem;
  font-size: 0.85rem;
}
.field-wrapper input:focus {
  outline: none;
  border-color: #d2b48c;
  box-shadow: 0 0 0 2px rgba(210,180,140,0.2);
}
.field-wrapper.error input {
  border-color: #e74c3c;
  padding-right: 1.8rem;
}
.error-tooltip {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  cursor: help;
}
.password-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}
.password-field {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.password-field .field-wrapper {
  flex: 1;
}
.password-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 0.3rem;
}
.edit-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #efe5db;
}
.save-btn, .cancel-btn {
  padding: 0.5rem 1.2rem;
  border-radius: 2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.save-btn {
  background: #3e2c1f;
  color: white;
  border: none;
}
.save-btn:hover:not(:disabled) {
  background: #d2b48c;
  transform: translateY(-2px);
}
.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.cancel-btn {
  background: #f3eeea;
  color: #8b7355;
  border: none;
}
.cancel-btn:hover {
  background: #e8e0d6;
}
.loader-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: inline-block;
}

/* Tableau de bord avec hover amélioré */
.stats-dashboard {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}
.stat-card {
  flex: 1;
  min-width: 120px;
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.2, 0.95, 0.4, 1.05);
  border: 1px solid #efe5db;
}
.stat-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 20px 25px -12px rgba(0,0,0,0.15);
  border-color: #d2b48c;
  background: linear-gradient(to bottom, #ffffff, #fffaf5);
}
.stat-card.active {
  border-color: #d2b48c;
  background: #fffcf8;
  box-shadow: 0 4px 12px rgba(210,180,140,0.3);
}
.stat-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 0.5rem;
}
.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #3e2c1f;
}
.stat-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #8b8b8b;
  letter-spacing: 1px;
}

/* Grilles et cartes */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}
.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}
.user-card {
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid #efe5db;
  transition: all 0.2s;
}
.user-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 14px rgba(0,0,0,0.05);
  border-color: #d2b48c;
}
.user-card-avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #d2b48c, #3e2c1f);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
}
.user-card-info {
  flex: 1;
}
.user-card-name {
  font-weight: 600;
  color: #3e2c1f;
}
.user-card-role {
  font-size: 0.7rem;
  color: #8b8b8b;
}
.post-card {
  background: white;
  border-radius: 1.2rem;
  border: 1px solid #efe5db;
  overflow: hidden;
  transition: all 0.2s;
}
.post-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}
.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #fefcf8;
  border-bottom: 1px solid #efe5db;
}
.post-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.user-avatar-sm {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #d2b48c, #3e2c1f);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1rem;
}
.post-date {
  font-size: 0.7rem;
  color: #8b8b8b;
}
.post-stats {
  display: flex;
  gap: 0.5rem;
}
.stat-badge {
  background: #f3eeea;
  padding: 0.2rem 0.6rem;
  border-radius: 40px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #3e2c1f;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.inline-icon {
  width: 12px;
  height: 12px;
}
.post-body {
  padding: 1rem;
}
.post-body p {
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #2c3e50;
}
.post-media img {
  width: 100%;
  max-height: 250px;
  object-fit: cover;
  border-radius: 0.8rem;
  cursor: pointer;
}
.post-file {
  margin-top: 0.5rem;
}
.file-link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: #f3eeea;
  padding: 0.3rem 0.8rem;
  border-radius: 40px;
  font-size: 0.75rem;
  color: #d2b48c;
  text-decoration: none;
}
.post-actions {
  display: flex;
  gap: 1rem;
  padding: 0.8rem 1rem;
  border-top: 1px solid #efe5db;
  background: #fefcf8;
  flex-wrap: wrap;
}
.action-like, .action-comment, .action-likers {
  background: none;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: #8b8b8b;
  cursor: pointer;
  transition: 0.2s;
}
.action-like.active {
  color: #e74c3c;
}
.action-like:hover, .action-comment:hover, .action-likers:hover {
  color: #d2b48c;
}
.comments-section {
  padding: 1rem;
  background: #fefcf8;
  border-top: 1px solid #efe5db;
}
.comment-item {
  display: flex;
  gap: 0.8rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid #efe5db;
}
.comment-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #d2b48c, #3e2c1f);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.8rem;
}
.comment-content {
  flex: 1;
}
.comment-author {
  font-weight: 600;
  font-size: 0.8rem;
  color: #3e2c1f;
}
.comment-text {
  font-size: 0.85rem;
  color: #2c3e50;
  margin: 0.2rem 0;
}
.comment-date {
  font-size: 0.65rem;
  color: #8b8b8b;
}
.comment-actions button {
  background: none;
  border: none;
  color: #d2b48c;
  font-size: 0.7rem;
  margin-right: 0.5rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
}
.comment-edit-input {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  padding: 0.3rem;
}
.add-comment {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.comment-input {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 2rem;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
}
.comment-send {
  background: #d2b48c;
  border: none;
  border-radius: 2rem;
  padding: 0.5rem 1rem;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.loader-wrapper, .empty-state {
  text-align: center;
  padding: 2rem;
  color: #8b8b8b;
}
.loader {
  width: 32px;
  height: 32px;
  border: 3px solid #efe5db;
  border-top-color: #d2b48c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 0.5rem;
}
.loader-small-wrapper {
  text-align: center;
  padding: 1rem;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}
.modal-card {
  background: white;
  border-radius: 1.5rem;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 1.5rem;
  box-shadow: 0 20px 35px rgba(0,0,0,0.2);
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #efe5db;
}
.close-modal {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #8b8b8b;
}
.users-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}
.user-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f3eeea;
  padding: 0.3rem 0.8rem;
  border-radius: 40px;
  font-size: 0.8rem;
}
.chip-avatar {
  width: 28px;
  height: 28px;
  background: #d2b48c;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}
.image-modal {
  background: transparent;
  max-width: 90vw;
  max-height: 90vh;
  position: relative;
}
.image-modal img {
  max-width: 100%;
  max-height: 85vh;
  border-radius: 1rem;
  box-shadow: 0 20px 35px rgba(0,0,0,0.2);
}
@media (max-width: 768px) {
  .stats-dashboard { flex-direction: column; }
  .personal-info-grid { grid-template-columns: 1fr; }
  .user-info-grid { grid-template-columns: 1fr; }
  .top-bar { flex-wrap: wrap; }
}
</style>