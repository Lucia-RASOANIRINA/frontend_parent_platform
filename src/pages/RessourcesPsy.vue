<template>
  <div class="resources-container">
    <!-- Onglets -->
    <div class="resources-header">
      <button :class="['tab-btn', { active: activeTab === 'mine' }]" @click="activeTab = 'mine'; fetchResources()">
        <svg class="icon" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 4a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4m0 2a2 2 0 0 0-2 2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0-2-2m0 7c2.67 0 8 1.34 8 4v3H4v-3c0-2.66 5.33-4 8-4m0 2c-2.46 0-6 1.1-6 2v1h12v-1c0-.9-3.54-2-6-2z"/></svg>
        Mes ressources
      </button>
      <button :class="['tab-btn', { active: activeTab === 'shared' }]" @click="activeTab = 'shared'; fetchResources()">
        <svg class="icon" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-1 .05 1.16.84 2 1.87 2 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
        Ressources de l'équipe
      </button>
    </div>

    <!-- Filtres (filtrage local) -->
    <div class="filters-bar">
      <div class="filter-group">
        <span class="filter-label"><svg class="icon-small" viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M5.5 7A1.5 1.5 0 0 1 7 5.5h10A1.5 1.5 0 0 1 18.5 7 1.5 1.5 0 0 1 17 8.5H7A1.5 1.5 0 0 1 5.5 7zm2 5a1.5 1.5 0 0 1 1.5-1.5h6a1.5 1.5 0 0 1 0 3H9a1.5 1.5 0 0 1-1.5-1.5zm2 5a1.5 1.5 0 0 1 1.5-1.5h2a1.5 1.5 0 0 1 0 3h-2a1.5 1.5 0 0 1-1.5-1.5z"/></svg> Type :</span>
        <div class="filter-pills">
          <button v-for="opt in typeOptions" :key="opt.value" :class="['pill', { active: filters.type === opt.value }]"
            @click="filters.type = opt.value">
            <svg class="icon-small" viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" :d="opt.iconPath"/></svg>
            {{ opt.label }}
          </button>
        </div>
      </div>
      <div class="filter-group">
        <span class="filter-label"><svg class="icon-small" viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14v10zM7 12h4v4H7v-4z"/></svg> Âge cible :</span>
        <div class="filter-pills">
          <button v-for="opt in ageOptions" :key="opt.value" :class="['pill', { active: filters.age === opt.value }]"
            @click="filters.age = opt.value">
            <svg class="icon-small" viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M12 2a9 9 0 0 0-9 9c0 4.17 2.84 7.67 6.69 8.69L12 22l2.31-2.31C18.16 18.67 21 15.17 21 11a9 9 0 0 0-9-9zm0 2c3.87 0 7 3.13 7 7 0 3.28-2.17 6.03-5.08 6.93L12 19.76l-1.92-1.83C7.17 17.03 5 14.28 5 11c0-3.87 3.13-7 7-7z"/></svg>
            {{ opt.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Grille de ressources -->
    <div v-if="loading" class="loading-spinner"><svg class="spin" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"/></svg> Chargement...</div>
    <div v-else class="resources-grid">
      <div v-for="res in filteredResources" :key="res.id" class="resource-card">
        <!-- Menu contextuel -->
        <div class="card-menu">
          <button v-if="activeTab === 'mine'" class="menu-trigger" @click.stop="toggleMenu(res.id)">
            <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
          </button>
          <div v-if="menuResourceId === res.id" class="menu-popup">
            <button @click="openEditModal(res)"><svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg> Modifier</button>
            <button @click="confirmDeleteResource(res)"><svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg> Supprimer</button>
          </div>
        </div>

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
          <!-- Conteneur média style YouTube (16:9) -->
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
          <div v-if="res.type === 'pdf' && res.fileType" class="pdf-link">
            <a :href="getFileUrl(res.id, res.updatedAt)" target="_blank"><svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg> Ouvrir le PDF</a>
          </div>
        </div>

        <div class="card-actions">
          <button @click="previewResource(res)" class="action-btn"><svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg> Aperçu</button>
          <button v-if="activeTab === 'mine'" @click="openScheduleModal(res)" class="action-btn"><svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/></svg> Programmer</button>
          <button @click="exportResource(res)" class="action-btn"><svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg> Export ZIP</button>
          <div class="feedback-stats">
            <span class="stat-item"><svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> {{ res.likes }}</span>
            <span class="stat-item"><svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg> {{ (res.averageRating || 0).toFixed(1) }} ({{ res.totalRatings || 0 }})</span>
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
          <button v-if="activeTab === 'shared'" @click="openRatingModal(res)" class="fb-star" :disabled="ratingSubmitting === res.id">
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
              <strong><svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg> {{ c.userName }}</strong>
              <p>{{ c.content }}</p>
              <small><svg viewBox="0 0 24 24" width="10" height="10"><path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/></svg> {{ formatDate(c.createdAt) }}</small>
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
      <div v-if="filteredResources.length === 0" class="empty-state"><svg viewBox="0 0 24 24" width="40" height="40"><path fill="currentColor" d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/></svg> Aucune ressource trouvée.</div>
    </div>

    <!-- Boutons flottants -->
    <button class="fab" @click="openCreateModal"><svg viewBox="0 0 24 24" width="28" height="28"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></button>
    <button class="fab-scheduled" @click="openScheduledModal">
      <svg viewBox="0 0 24 24" width="28" height="28"><path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/></svg>
    </button>

    <!-- Modale création -->
    <div v-if="createModalOpen" class="modal-overlay" @click.self="createModalOpen = false">
      <div class="modal-content large">
        <div class="modal-header stylized-header">
          <div class="header-icon"><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></div>
          <h2>Créer une ressource</h2>
          <button class="close-modal" @click="createModalOpen = false"><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></button>
        </div>
        <form @submit.prevent="createResource">
          <div class="form-group"><label>Titre *</label><input v-model="newResource.title" placeholder="Ex: Découverte des couleurs" required /></div>
          <div class="form-group"><label>Description *</label><textarea v-model="newResource.description" placeholder="Décrivez votre ressource..." required></textarea></div>
          <div class="form-row">
            <div class="form-group"><label>Âge cible *</label><select v-model="newResource.age" required><option value="">Sélectionner</option><option value="1-3">1-3 ans</option><option value="3-5">3-5 ans</option><option value="5-7">5-7 ans</option><option value="Professionnel">Professionnel</option></select></div>
            <div class="form-group"><label>Type *</label><select v-model="newResource.type" required><option value="fiche">Fiche activité</option><option value="video">Vidéo</option><option value="pdf">PDF / Document</option><option value="bloc">Bloc pédagogique</option></select></div>
          </div>
          <div v-if="newResource.type === 'video' || newResource.type === 'pdf'" class="form-group file-upload">
            <label>Fichier</label>
            <label class="file-label"><svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg> Choisir un fichier <input type="file" @change="handleFile" :accept="newResource.type === 'video' ? 'video/*' : 'application/pdf'" hidden /></label>
            <div v-if="selectedFile" class="file-preview"><svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6z"/></svg> {{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }}) <button type="button" @click="removeSelectedFile" class="remove-file"><svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></button></div>
          </div>
          <div v-if="newResource.type === 'video'" class="form-group"><label>URL de la vidéo (alternative)</label><div class="or-divider">— ou —</div><input v-model="newResource.videoUrl" placeholder="https://..." /></div>
          <div class="modal-footer"><button type="button" @click="createModalOpen = false">Annuler</button><button type="submit" class="primary" :disabled="creating"><svg v-if="!creating" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg><svg v-else class="spin" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"/></svg> {{ creating ? 'Création...' : 'Créer' }}</button></div>
        </form>
      </div>
    </div>

    <!-- Modale édition -->
    <div v-if="editModalOpen" class="modal-overlay" @click.self="editModalOpen = false">
      <div class="modal-content large">
        <div class="modal-header stylized-header">
          <div class="header-icon"><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></div>
          <h2>Modifier la ressource</h2>
          <button class="close-modal" @click="editModalOpen = false"><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></button>
        </div>
        <form @submit.prevent="updateResource">
          <div class="form-group"><label>Titre *</label><input v-model="editResource.title" placeholder="Titre" required /></div>
          <div class="form-group"><label>Description *</label><textarea v-model="editResource.description" placeholder="Description" required></textarea></div>
          <div class="form-row">
            <div class="form-group"><label>Âge cible *</label><select v-model="editResource.age" required><option value="">Sélectionner</option><option value="1-3">1-3 ans</option><option value="3-5">3-5 ans</option><option value="5-7">5-7 ans</option><option value="Professionnel">Professionnel</option></select></div>
            <div class="form-group"><label>Type *</label><select v-model="editResource.type" required><option value="fiche">Fiche activité</option><option value="video">Vidéo</option><option value="pdf">PDF / Document</option><option value="bloc">Bloc pédagogique</option></select></div>
          </div>
          <div v-if="editResource.type === 'video' || editResource.type === 'pdf'" class="form-group file-upload">
            <label>Fichier</label>
            <label class="file-label"><svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg> Changer le fichier <input type="file" @change="handleEditFile" :accept="editResource.type === 'video' ? 'video/*' : 'application/pdf'" hidden /></label>
            <div v-if="editSelectedFile" class="file-preview"><svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6z"/></svg> {{ editSelectedFile.name }} ({{ formatFileSize(editSelectedFile.size) }}) <button type="button" @click="removeEditSelectedFile" class="remove-file"><svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></button></div>
            <div v-else-if="editResource.currentFileName" class="file-preview existing"><svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6z"/></svg> Fichier actuel : {{ editResource.currentFileName }} <button type="button" @click="removeCurrentFile" class="remove-file"><svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></button></div>
          </div>
          <div v-if="editResource.type === 'video'" class="form-group"><label>URL de la vidéo (alternative)</label><div class="or-divider">— ou —</div><input v-model="editResource.videoUrl" placeholder="https://..." /></div>
          <div class="modal-footer"><button type="button" @click="editModalOpen = false">Annuler</button><button type="submit" class="primary" :disabled="updating"><svg v-if="!updating" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg><svg v-else class="spin" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"/></svg> {{ updating ? 'Enregistrement...' : 'Mettre à jour' }}</button></div>
        </form>
      </div>
    </div>

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
        <div class="modal-footer"><button v-if="activeTab === 'mine'" class="primary" @click="openScheduleModal(selectedResource)"><svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/></svg> Programmer</button></div>
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

    <!-- Modale programmation -->
    <div v-if="scheduleModalOpen" class="modal-overlay" @click.self="scheduleModalOpen = false">
      <div class="modal-content small">
        <div class="modal-header stylized-header">
          <div class="header-icon"><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/></svg></div>
          <h3>Programmer "{{ selectedResource?.title }}"</h3>
          <button class="close-modal" @click="scheduleModalOpen = false"><svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></button>
        </div>
        <div class="form-group"><label>Date et heure de programmation</label><input type="datetime-local" v-model="scheduleDate" /></div>
        <div class="modal-footer"><button @click="scheduleModalOpen = false">Annuler</button><button class="primary" @click="submitSchedule" :disabled="scheduling"><svg v-if="!scheduling" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg><svg v-else class="spin" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"/></svg> Programmer</button></div>
      </div>
    </div>

    <!-- Modale liste des ressources programmées -->
    <div v-if="scheduledModalOpen" class="modal-overlay" @click.self="scheduledModalOpen = false">
      <div class="modal-content large">
        <div class="modal-header stylized-header">
          <div class="header-icon"><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/></svg></div>
          <h2>Ressources programmées</h2>
          <button class="close-modal" @click="scheduledModalOpen = false"><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></button>
        </div>
        <div v-if="scheduledResources.length === 0" class="empty-state">Aucune ressource programmée.</div>
        <div v-else class="scheduled-list">
          <div v-for="res in scheduledResources" :key="res.id" class="scheduled-item">
            <div class="scheduled-header"><h3>{{ res.title }}</h3><span class="scheduled-date"><svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/></svg> {{ formatDate(res.scheduledAt) }}</span></div>
            <div class="scheduled-content">
              <div class="scheduled-media"><div class="media-container small-media"><video v-if="res.type === 'video' && res.fileType" controls :src="getFileUrl(res.id, res.updatedAt)" class="media-content"></video><embed v-else-if="res.type === 'pdf' && res.fileType" :src="getFileUrl(res.id, res.updatedAt)" type="application/pdf" class="media-content" /><div v-else-if="res.type === 'video' && res.videoUrl" class="video-url-container"><video controls :src="res.videoUrl" class="media-content"></video></div><div v-else-if="res.type === 'fiche' || res.type === 'bloc'" class="description-container"><div class="description-icon"><svg v-if="res.type === 'fiche'" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/></svg><svg v-else viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M4 6h16v2H4V6zm2-4h12v2H6V2zm16 8H2v2h20v-2zm-4 4H6v2h12v-2zm-4 4h-4v2h4v-2z"/></svg></div><p class="description-text">{{ res.description }}</p></div><div v-else class="no-media-preview"><svg viewBox="0 0 24 24" width="32" height="32"><path fill="currentColor" d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/></svg></div></div></div>
              <div class="scheduled-info"><p class="scheduled-desc">{{ res.description }}</p><div class="scheduled-meta"><span><svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M12 2a9 9 0 0 0-9 9c0 4.17 2.84 7.67 6.69 8.69L12 22l2.31-2.31C18.16 18.67 21 15.17 21 11a9 9 0 0 0-9-9z"/></svg> {{ res.age }}</span><span><svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/></svg> {{ formatDate(res.createdAt) }}</span></div></div>
            </div>
            <div class="scheduled-actions"><button @click="previewResource(res)" class="action-btn">Voir détails</button><button @click="removeSchedule(res.id)" class="action-btn">Annuler programmation</button></div>
          </div>
        </div>
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

    <!-- Confirmation suppression ressource -->
    <div v-if="deleteConfirm.show" class="modal-overlay blur-bg" @click.self="deleteConfirm.show = false">
      <div class="modal-content confirm-modal">
        <div class="confirm-icon"><svg viewBox="0 0 24 24" width="48" height="48"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg></div>
        <p>Voulez-vous vraiment supprimer la ressource <strong>“{{ deleteConfirm.resource?.title }}”</strong> ? Cette action est irréversible.</p>
        <div class="modal-footer centered"><button @click="deleteConfirm.show = false">Annuler</button><button class="primary" @click="performDelete">Supprimer</button></div>
      </div>
    </div>

    <!-- Toast notification -->
    <transition name="toast-fade"><div v-if="toastVisible" class="toast-notification"><div class="toast-blue-line"></div><div class="toast-content"><svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> {{ toastMessage }}</div></div></transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import axios from 'axios'

const user = JSON.parse(localStorage.getItem('user') || '{"id": 1, "nom": "Utilisateur"}')
const currentUserId = ref(user.id)
const currentUserName = ref(user.nom)

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8082/api'
const api = axios.create({ baseURL: API_BASE })

// États
const resources = ref([])
const loading = ref(false)
const filters = ref({ type: '', age: '' })
const activeTab = ref('mine')
const modalOpen = ref(false)
const selectedResource = ref(null)
const createModalOpen = ref(false)
const ratingModalOpen = ref(false)
const selectedRatingResource = ref(null)
const ratingValue = ref(0)
const scheduleModalOpen = ref(false)
const scheduleDate = ref('')
const editModalOpen = ref(false)
const editResource = ref({ id: null, title: '', description: '', age: '', type: 'fiche', videoUrl: '', currentFileName: null, removeFile: false })
let editSelectedFile = null
const newResource = ref({ title: '', description: '', age: '', type: 'fiche', videoUrl: '' })
let selectedFile = null
const menuResourceId = ref(null)
const creating = ref(false)
const updating = ref(false)
const likingInProgress = ref(null)
const ratingSubmitting = ref(null)
const scheduling = ref(false)
const toastVisible = ref(false)
const toastMessage = ref('')
let toastTimeout = null
const newCommentText = ref({})
const deleteConfirm = ref({ show: false, resource: null })
const showComments = ref({})
const commentSubmitting = ref({})
const confirmCommentDelete = ref({ show: false, resourceId: null, commentId: null })
const scheduledModalOpen = ref(false)

// Filtrage local
const filteredResources = computed(() => {
  let result = [...resources.value]
  if (filters.value.type) result = result.filter(r => r.type === filters.value.type)
  if (filters.value.age) result = result.filter(r => r.age === filters.value.age)
  return result
})

// Ressources programmées (avec une date)
const scheduledResources = computed(() => resources.value.filter(r => r.scheduledAt))

// Options filtres
const typeOptions = [
  { value: '', label: 'Tous', iconPath: 'M4 6h16v2H4V6zm2-4h12v2H6V2zm16 8H2v2h20v-2zm-4 4H6v2h12v-2zm-4 4h-4v2h4v-2z' },
  { value: 'fiche', label: 'Fiche', iconPath: 'M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10z' },
  { value: 'video', label: 'Vidéo', iconPath: 'M18 9v4h-4V9h4zm-2 0h-2v2h2V9zm-8 4H4v-2h4v2zm0-4H4V7h4v2zm6 8h-2v-2h2v2zm2 0v-2h2v2h-2zm-8 0H6v-2h2v2zm10-4h-2v-2h2v2zm-6 0h-2v-2h2v2zm-6 0H4v-2h2v2z' },
  { value: 'pdf', label: 'PDF', iconPath: 'M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10z' },
  { value: 'bloc', label: 'Bloc', iconPath: 'M4 6h16v2H4V6zm2-4h12v2H6V2zm16 8H2v2h20v-2zm-4 4H6v2h12v-2zm-4 4h-4v2h4v-2z' }
]
const ageOptions = [
  { value: '', label: 'Tous âges', iconPath: 'M12 2a9 9 0 0 0-9 9c0 4.17 2.84 7.67 6.69 8.69L12 22l2.31-2.31C18.16 18.67 21 15.17 21 11a9 9 0 0 0-9-9zm0 2c3.87 0 7 3.13 7 7 0 3.28-2.17 6.03-5.08 6.93L12 19.76l-1.92-1.83C7.17 17.03 5 14.28 5 11c0-3.87 3.13-7 7-7z' },
  { value: '1-3', label: '1-3 ans', iconPath: 'M12 2a9 9 0 0 0-9 9c0 4.17 2.84 7.67 6.69 8.69L12 22l2.31-2.31C18.16 18.67 21 15.17 21 11a9 9 0 0 0-9-9z' },
  { value: '3-5', label: '3-5 ans', iconPath: 'M12 2a9 9 0 0 0-9 9c0 4.17 2.84 7.67 6.69 8.69L12 22l2.31-2.31C18.16 18.67 21 15.17 21 11a9 9 0 0 0-9-9z' },
  { value: '5-7', label: '5-7 ans', iconPath: 'M12 2a9 9 0 0 0-9 9c0 4.17 2.84 7.67 6.69 8.69L12 22l2.31-2.31C18.16 18.67 21 15.17 21 11a9 9 0 0 0-9-9z' },
  { value: 'Professionnel', label: 'Professionnel', iconPath: 'M12 2a9 9 0 0 0-9 9c0 4.17 2.84 7.67 6.69 8.69L12 22l2.31-2.31C18.16 18.67 21 15.17 21 11a9 9 0 0 0-9-9z' }
]

const formatFileSize = (bytes) => { if (bytes < 1024) return bytes + ' o'; if (bytes < 1024*1024) return (bytes/1024).toFixed(1)+' Ko'; return (bytes/(1024*1024)).toFixed(1)+' Mo' }
const getFileUrl = (id, updatedAt=null) => `${API_BASE}/resources/${id}/file?t=${updatedAt ? new Date(updatedAt).getTime() : Date.now()}`
const badgeIconPath = (type) => ({ fiche:'M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10z', video:'M18 9v4h-4V9h4zm-2 0h-2v2h2V9zm-8 4H4v-2h4v2zm0-4H4V7h4v2zm6 8h-2v-2h2v2zm2 0v-2h2v2h-2zm-8 0H6v-2h2v2zm10-4h-2v-2h2v2zm-6 0h-2v-2h2v2zm-6 0H4v-2h2v2z', pdf:'M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10z', bloc:'M4 6h16v2H4V6zm2-4h12v2H6V2zm16 8H2v2h20v-2zm-4 4H6v2h12v-2zm-4 4h-4v2h4v-2z' }[type] || 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z')
const getTypeLabel = (type) => ({ fiche:'Fiche activité', video:'Vidéo', pdf:'PDF', bloc:'Blocs' }[type] || type)
const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('fr-FR') : ''
const showToast = (msg) => { if (toastTimeout) clearTimeout(toastTimeout); toastMessage.value = msg; toastVisible.value = true; toastTimeout = setTimeout(() => toastVisible.value = false, 3000) }

// Récupération des ressources
const fetchResources = async () => {
  loading.value = true
  try {
    const params = { owner: activeTab.value }
    const res = await api.get('/resources', {
      params,
      headers: { 'X-User-Id': currentUserId.value },
      timeout: 15000
    })
    resources.value = res.data.map(r => ({ ...r, liked: r.liked || false, userRated: r.userRated || false, comments: r.comments || [] }))
  } catch (error) {
    if (error.response) showToast('Erreur serveur : ' + error.response.status)
    else if (error.request) showToast('Impossible de contacter le serveur')
    else showToast('Erreur de chargement')
  } finally { loading.value = false }
}

// Création
const handleFile = (e) => { selectedFile = e.target.files[0] }
const removeSelectedFile = () => { selectedFile = null; document.querySelector('input[type="file"]').value = '' }
const createResource = async () => {
  creating.value = true
  const fd = new FormData()
  fd.append('title', newResource.value.title)
  fd.append('description', newResource.value.description)
  fd.append('type', newResource.value.type)
  fd.append('age', newResource.value.age)
  if (newResource.value.type === 'video' && newResource.value.videoUrl) fd.append('videoUrl', newResource.value.videoUrl)
  if (selectedFile) fd.append('file', selectedFile)
  try {
    await api.post('/resources', fd, { headers: { 'X-User-Id': currentUserId.value }, timeout: 120000 })
    await fetchResources()
    createModalOpen.value = false
    newResource.value = { title: '', description: '', age: '', type: 'fiche', videoUrl: '' }
    selectedFile = null
    showToast('Ressource créée ✓')
  } catch (error) { showToast('Erreur création') }
  finally { creating.value = false }
}

// Modification
const openEditModal = (res) => {
  editResource.value = { id: res.id, title: res.title, description: res.description, age: res.age, type: res.type, videoUrl: '', currentFileName: res.fileName || null, removeFile: false }
  editSelectedFile = null
  editModalOpen.value = true
  menuResourceId.value = null
}
const handleEditFile = (e) => { editSelectedFile = e.target.files[0] }
const removeEditSelectedFile = () => { editSelectedFile = null; document.querySelector('#editFileInput').value = '' }
const removeCurrentFile = () => { editResource.value.currentFileName = null; editResource.value.removeFile = true }
const updateResource = async () => {
  updating.value = true
  const fd = new FormData()
  fd.append('title', editResource.value.title)
  fd.append('description', editResource.value.description)
  fd.append('type', editResource.value.type)
  fd.append('age', editResource.value.age)
  if (editResource.value.type === 'video' && editResource.value.videoUrl) fd.append('videoUrl', editResource.value.videoUrl)
  if (editSelectedFile) fd.append('file', editSelectedFile)
  if (editResource.value.removeFile) fd.append('removeFile', 'true')
  try {
    await api.put(`/resources/${editResource.value.id}`, fd, { headers: { 'X-User-Id': currentUserId.value }, timeout: 120000 })
    await fetchResources()
    editModalOpen.value = false
    showToast('Ressource mise à jour ✓')
  } catch (error) { showToast('Erreur mise à jour') }
  finally { updating.value = false }
}

// Suppression ressource
const confirmDeleteResource = (res) => { deleteConfirm.value = { show: true, resource: res } }
const performDelete = async () => {
  const id = deleteConfirm.value.resource.id
  deleteConfirm.value.show = false
  try {
    await api.delete(`/resources/${id}`, { headers: { 'X-User-Id': currentUserId.value } })
    await fetchResources()
    showToast('Ressource supprimée ✓')
  } catch (error) { showToast('Erreur suppression') }
}

// Like unique
const sendLike = async (id) => {
  const resource = resources.value.find(r => r.id === id)
  if (!resource || resource.liked) {
    if (resource?.liked) showToast('Vous avez déjà aimé cette ressource')
    return
  }
  likingInProgress.value = id
  try {
    await api.post(`/resources/${id}/like`, {}, { headers: { 'X-User-Id': currentUserId.value } })
    await fetchResources()
    showToast('Merci pour votre ❤️')
  } catch (error) { showToast('Erreur like') }
  finally { likingInProgress.value = null }
}

// Notation unique
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
    await api.post(`/resources/${id}/rating`, { rating: ratingValue.value }, { headers: { 'X-User-Id': currentUserId.value } })
    await fetchResources()
    ratingModalOpen.value = false
    showToast('Note enregistrée ✓')
  } catch (error) { showToast('Erreur notation') }
  finally { ratingSubmitting.value = null }
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
    const response = await api.get(`/resources/${resourceId}/comments`)
    const res = resources.value.find(r => r.id === resourceId)
    if (res) res.comments = response.data
  } catch (error) { console.error(error) }
}
const addComment = async (resourceId) => {
  const text = newCommentText.value[resourceId]
  if (!text || !text.trim()) return
  commentSubmitting.value[resourceId] = true
  try {
    await api.post(`/resources/${resourceId}/comments`, { content: text }, { headers: { 'X-User-Id': currentUserId.value, 'X-User-Name': currentUserName.value } })
    await fetchComments(resourceId)
    newCommentText.value[resourceId] = ''
    showToast('Commentaire ajouté ✓')
  } catch (error) { showToast('Erreur ajout commentaire') }
  finally { commentSubmitting.value[resourceId] = false }
}
const confirmDeleteComment = (resourceId, commentId) => {
  confirmCommentDelete.value = { show: true, resourceId, commentId }
}
const executeDeleteComment = async () => {
  const { resourceId, commentId } = confirmCommentDelete.value
  confirmCommentDelete.value.show = false
  try {
    await api.delete(`/resources/comments/${commentId}`, { headers: { 'X-User-Id': currentUserId.value } })
    const res = resources.value.find(r => r.id === resourceId)
    if (res) res.comments = res.comments.filter(c => c.id !== commentId)
    showToast('Commentaire supprimé')
  } catch (error) { showToast('Erreur suppression commentaire') }
}

// Programmation
const openScheduleModal = (res) => { selectedResource.value = res; scheduleDate.value = ''; scheduleModalOpen.value = true }
const submitSchedule = async () => {
  if (!scheduleDate.value) return
  scheduling.value = true
  try {
    await api.post(`/resources/${selectedResource.value.id}/schedule`, { scheduledAt: scheduleDate.value }, { headers: { 'X-User-Id': currentUserId.value } })
    await fetchResources()
    showToast('Programmation enregistrée ✓')
    scheduleModalOpen.value = false
  } catch (error) { showToast('Erreur programmation') }
  finally { scheduling.value = false }
}

// Annulation programmation
const removeSchedule = async (resourceId) => {
  try {
    await api.delete(`/resources/${resourceId}/schedule`, { headers: { 'X-User-Id': currentUserId.value } })
    await fetchResources()
    if (scheduledModalOpen.value) await fetchResources()
    showToast('Programmation annulée')
  } catch (error) { showToast('Erreur annulation') }
}

// Export ZIP
const exportResource = async (res) => {
  try {
    const response = await api.get(`/resources/${res.id}/export`, { responseType: 'blob' })
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

// Menu
const openCreateModal = () => { createModalOpen.value = true }
const toggleMenu = (id) => { menuResourceId.value = menuResourceId.value === id ? null : id }
const handleClickOutside = (event) => { if (!event.target.closest('.card-menu')) menuResourceId.value = null }

// Modale programmations
const openScheduledModal = () => { scheduledModalOpen.value = true }

watch(() => activeTab.value, () => fetchResources())

onMounted(() => { document.addEventListener('click', handleClickOutside); fetchResources() })
onUnmounted(() => { document.removeEventListener('click', handleClickOutside); if (toastTimeout) clearTimeout(toastTimeout) })
</script>

<style scoped>
/* ===== STYLES COMPLETS ===== */
.resources-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  min-height: 100vh;
  font-family: system-ui, 'Segoe UI', 'Roboto', sans-serif;
}
.resources-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid #CFFAFE;
  padding-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.tab-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  font-weight: 500;
  padding: 0.5rem 1.5rem;
  cursor: pointer;
  color: #64748B;
  transition: all 0.2s;
  border-radius: 40px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.tab-btn svg { width: 18px; height: 18px; color: #64748B; }
.tab-btn.active {
  color: #0891B2;
  border-bottom: 2px solid #0891B2;
  margin-bottom: -2px;
}
.tab-btn.active svg { color: #0891B2; }
.tab-btn:hover:not(.active) {
  color: #164E63;
  background-color: #F0F9FF;
  transform: translateY(-1px);
}
.filters-bar {
  background: #F8FAFC;
  border-radius: 60px;
  padding: 0.8rem 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.filter-group { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
.filter-label {
  font-weight: 500;
  color: #1E293B;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}
.filter-pills { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.pill {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 40px;
  padding: 0.3rem 0.9rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #1E293B;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}
.pill svg { width: 12px; height: 12px; color: #64748B; }
.pill.active {
  background: #0891B2;
  border-color: #0891B2;
  color: white;
}
.pill.active svg { color: white; }
.pill:hover:not(.active) {
  background: #F1F5F9;
  transform: translateY(-1px);
}
.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.8rem;
}
.loading-spinner { text-align: center; padding: 2rem; color: #0891B2; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
.empty-state { text-align: center; padding: 3rem; background: #F8FAFC; border-radius: 24px; color: #64748B; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
.resource-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  overflow: hidden;
  transition: all 0.25s ease;
  border: 1px solid #E2E8F0;
  position: relative;
}
.resource-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.1);
  border-color: #CFFAFE;
}
.card-menu { position: absolute; top: 0.8rem; right: 0.8rem; z-index: 2; }
.menu-trigger {
  background: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: 0.2s;
}
.menu-trigger svg { color: #1E293B; width: 18px; height: 18px; }
.menu-trigger:hover { background: #F0F9FF; transform: scale(1.05); }
.menu-popup {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  min-width: 140px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
.menu-popup button {
  background: none;
  border: none;
  padding: 0.6rem 1rem;
  text-align: left;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.menu-popup button:hover { background: #F0F9FF; }
.card-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin: 1rem 1rem 0 1rem;
  padding: 0.2rem 0.8rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: bold;
  background: #F0F9FF;
  color: #0891B2;
}
.card-badge.video { background: #E0F2FE; color: #0284C7; }
.card-badge.pdf { background: #FFEDD5; color: #EA580C; }
.card-badge.bloc { background: #E0F2E9; color: #2E7D32; }
.card-content { padding: 0 1rem 1rem; }
.card-content h3 { font-size: 1.2rem; margin: 0.5rem 0; color: #0F172A; }
.meta { display: flex; gap: 1rem; font-size: 0.7rem; color: #64748B; margin-bottom: 0.8rem; flex-wrap: wrap; }
.meta-item { display: inline-flex; align-items: center; gap: 0.2rem; }
.scheduled-badge { color: #0891B2; font-weight: 500; }
.media-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  background: #F1F5F9;
  border-radius: 12px;
  overflow: hidden;
  margin: 0.5rem 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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
.video-url-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.video-url-container video {
  width: 100%;
  height: 100%;
  object-fit: contain;
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
  background: #F8FAFC;
  padding: 1rem;
  box-sizing: border-box;
  overflow-y: auto;
  text-align: center;
}
.description-icon {
  margin-bottom: 0.5rem;
  color: #0891B2;
}
.description-text {
  font-size: 0.85rem;
  color: #334155;
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
  background: #F1F5F9;
  color: #64748B;
  gap: 0.5rem;
}
.no-media-preview svg { color: #94A3B8; }
.no-media-preview span { font-size: 0.8rem; }
.pdf-link {
  margin-top: 0.5rem;
  text-align: center;
}
.pdf-link a {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  color: #0891B2;
  text-decoration: none;
}
.pdf-link a:hover { text-decoration: underline; }
.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.8rem 1rem;
  border-top: 1px solid #E2E8F0;
  background: #FEFCF8;
  align-items: center;
}
.action-btn {
  background: none;
  border: 1px solid #0891B2;
  padding: 0.2rem 0.7rem;
  border-radius: 30px;
  font-size: 0.7rem;
  cursor: pointer;
  transition: 0.1s;
  color: #0891B2;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}
.action-btn svg { width: 14px; height: 14px; color: #1E293B; }
.action-btn:hover { background: #0891B2; color: white; }
.action-btn:hover svg { color: white; }
.feedback-stats { margin-left: auto; display: flex; gap: 0.6rem; font-size: 0.7rem; color: #64748B; }
.stat-item { display: inline-flex; align-items: center; gap: 0.2rem; }
.feedback-buttons {
  display: flex;
  gap: 0.8rem;
  padding: 0.6rem 1rem;
  background: #FEFCF8;
  border-top: 1px solid #E2E8F0;
}
.fb-like, .fb-star, .fb-comment {
  background: none;
  border: none;
  font-size: 0.75rem;
  cursor: pointer;
  color: #0891B2;
  transition: 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}
.fb-like svg, .fb-star svg, .fb-comment svg { width: 14px; height: 14px; }
.fb-like:hover { color: #e74c3c; }
.fb-like:hover svg { color: #e74c3c; }
.fb-star:hover { color: #f39c12; }
.fb-comment:hover { color: #164E63; }
.comments-section {
  padding: 0.8rem 1rem;
  background: #F8FAFC;
  border-top: 1px solid #E2E8F0;
}
.comments-list { max-height: 200px; overflow-y: auto; margin-bottom: 0.5rem; }
.comment-item {
  background: white;
  border-radius: 12px;
  padding: 0.4rem 0.6rem;
  margin-bottom: 0.5rem;
  position: relative;
  font-size: 0.75rem;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.comment-item strong { display: block; font-size: 0.7rem; color: #164E63; margin-bottom: 0.2rem; }
.comment-item p { margin: 0.2rem 0; }
.comment-item small { font-size: 0.6rem; color: #64748B; display: inline-flex; align-items: center; gap: 0.2rem; }
.delete-comment {
  position: absolute;
  top: 0.2rem;
  right: 0.2rem;
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.6;
}
.delete-comment svg { width: 12px; height: 12px; color: #64748B; }
.delete-comment:hover { opacity: 1; }
.add-comment { display: flex; gap: 0.5rem; align-items: flex-start; margin-top: 0.5rem; }
.add-comment textarea { flex: 1; border-radius: 16px; border: 1px solid #CBD5E1; padding: 0.4rem; font-size: 0.7rem; resize: vertical; transition: 0.2s; }
.add-comment textarea:focus { outline: none; border-color: #0891B2; box-shadow: 0 0 0 2px rgba(8,145,178,0.1); }
.add-comment button.primary.small { padding: 0.3rem 0.8rem; font-size: 0.7rem; background: #0891B2; border: none; color: white; border-radius: 40px; cursor: pointer; display: inline-flex; align-items: center; gap: 0.3rem; }
.add-comment button.primary.small:hover { background: #164E63; }
.no-comments { text-align: center; color: #94A3B8; font-size: 0.7rem; padding: 0.5rem; }
.fab {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #0891B2;
  border: none;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  transition: 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.fab svg { width: 28px; height: 28px; color: white; }
.fab:hover { background: #164E63; transform: scale(1.05); }
.fab-scheduled {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  background: #0891B2;
  border: none;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  transition: 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.fab-scheduled svg { width: 28px; height: 28px; color: white; }
.fab-scheduled:hover { background: #164E63; transform: scale(1.05); }
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
  background-color: #0891B2;
  align-self: stretch;
}
.toast-content {
  padding: 0.75rem 1.5rem;
  color: #1E293B;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.toast-content svg { color: #0891B2; }
.toast-fade-enter-active, .toast-fade-leave-active { transition: opacity 0.3s ease; }
.toast-fade-enter-from, .toast-fade-leave-to { opacity: 0; }
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
.modal-overlay.blur-bg { backdrop-filter: blur(4px); background: rgba(0,0,0,0.3); }
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
.modal-content.small { max-width: 400px; }
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
  border-bottom: 1px solid #E2E8F0;
}
.modal-header.stylized-header {
  background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%);
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
  color: #0891B2;
}
.modal-header.stylized-header h2, .modal-header.stylized-header h3 {
  margin: 0;
  flex: 1;
  text-align: center;
  color: #164E63;
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
.modal-header.stylized-header .close-modal svg { width: 18px; height: 18px; }
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
  color: #64748B;
  transition: 0.2s;
}
.close-modal:hover svg { color: #ef4444; }
.confirm-icon {
  text-align: center;
  margin-bottom: 1rem;
  color: #64748B;
}
.confirm-icon svg { color: #64748B; }
.modal-footer.centered { justify-content: center; }
.form-group { margin-bottom: 1rem; }
.form-group label { display: block; font-size: 0.8rem; font-weight: 500; color: #1E293B; margin-bottom: 0.3rem; }
.form-group input, .form-group textarea, .modal-content select {
  width: 100%;
  padding: 0.8rem;
  border-radius: 16px;
  border: 1px solid #CBD5E1;
  font-size: 0.9rem;
  transition: 0.2s;
}
.form-group input:focus, .form-group textarea:focus, .modal-content select:focus {
  outline: none;
  border-color: #0891B2;
  box-shadow: 0 0 0 2px rgba(8,145,178,0.2);
}
.form-row { display: flex; gap: 1rem; margin-bottom: 1rem; }
.form-row .form-group { flex: 1; margin-bottom: 0; }
.or-divider { text-align: center; margin: 0.5rem 0; color: #64748B; }
.file-upload .file-label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #F0F9FF;
  padding: 0.5rem 1rem;
  border-radius: 40px;
  cursor: pointer;
  font-size: 0.85rem;
  color: #0891B2;
  transition: 0.2s;
}
.file-upload .file-label:hover { background: #CFFAFE; }
.file-preview {
  margin-top: 0.5rem;
  background: #F0F9FF;
  border-radius: 16px;
  padding: 0.5rem 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
}
.file-preview.existing { background: #FEF3C7; }
.remove-file { background: none; border: none; cursor: pointer; color: #ef4444; margin-left: auto; display: flex; align-items: center; }
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}
.modal-footer button {
  padding: 0.5rem 1rem;
  border-radius: 40px;
  border: 1px solid #0891B2;
  background: white;
  cursor: pointer;
  color: #0891B2;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  transition: 0.2s;
}
.modal-footer button.primary {
  background: #0891B2;
  color: white;
  border: none;
}
.modal-footer button.primary:hover { background: #164E63; }
.modal-footer button:hover:not(.primary) { background: #F0F9FF; }
.rating-stars { display: flex; justify-content: center; gap: 0.5rem; margin: 1rem 0; cursor: pointer; }
.rating-stars span { opacity: 0.4; transition: 0.1s; }
.rating-stars span.active { opacity: 1; }
.rating-stars span svg { width: 32px; height: 32px; color: #f39c12; }
.preview-body { margin-bottom: 1rem; }
.preview-meta { display: flex; gap: 1rem; margin-bottom: 1rem; font-size: 0.8rem; color: #64748B; }
.preview-description { background: #F8FAFC; padding: 1rem; border-radius: 16px; margin-bottom: 1rem; }
.scheduled-list { display: flex; flex-direction: column; gap: 1.5rem; }
.scheduled-item {
  border: 1px solid #E2E8F0;
  border-radius: 20px;
  padding: 1rem;
  transition: 0.2s;
}
.scheduled-item:hover { border-color: #0891B2; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.scheduled-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.scheduled-header h3 { margin: 0; font-size: 1.1rem; color: #0F172A; }
.scheduled-date {
  font-size: 0.75rem;
  color: #0891B2;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}
.scheduled-content { display: flex; gap: 1rem; flex-wrap: wrap; }
.scheduled-media { flex: 1; min-width: 180px; }
.media-container.small-media { padding-bottom: 56.25%; max-width: 300px; }
.scheduled-info { flex: 2; }
.scheduled-desc {
  font-size: 0.85rem;
  color: #334155;
  margin: 0 0 0.5rem 0;
}
.scheduled-meta { display: flex; gap: 1rem; font-size: 0.7rem; color: #64748B; }
.scheduled-meta span { display: inline-flex; align-items: center; gap: 0.2rem; }
.scheduled-actions { display: flex; gap: 0.5rem; margin-top: 0.8rem; justify-content: flex-end; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@media (max-width: 768px) {
  .resources-container { padding: 1rem; }
  .filters-bar { flex-direction: column; align-items: stretch; border-radius: 24px; padding: 1rem; }
  .filter-group { justify-content: space-between; }
  .filter-pills { justify-content: center; }
  .form-row { flex-direction: column; }
  .fab, .fab-scheduled { bottom: 1rem; width: 48px; height: 48px; }
  .fab { right: 1rem; }
  .fab-scheduled { left: 1rem; }
  .fab svg, .fab-scheduled svg { width: 24px; height: 24px; }
  .toast-notification { white-space: normal; text-align: center; max-width: 90%; }
  .modal-header.stylized-header .header-icon { width: 32px; height: 32px; }
  .modal-header.stylized-header h2, .modal-header.stylized-header h3 { font-size: 1.1rem; }
  .scheduled-content { flex-direction: column; }
  .media-container.small-media { max-width: 100%; }
}
</style>