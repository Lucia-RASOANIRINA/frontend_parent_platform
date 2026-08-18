import api, { idUtilisateurCourant } from './api'

/** Publications de la communauté, commentaires et « j'aime ». */

// ---- Publications ----

export async function fetchPublications() {
  const { data } = await api.get('/posts/all-posts')
  return data.posts || data.publications || []
}

export async function fetchPublicationsUtilisateur(userId = idUtilisateurCourant()) {
  const { data } = await api.get(`/posts/user/${userId}`)
  return data.posts || []
}

export async function fetchPublicationsRecommandees(userId = idUtilisateurCourant()) {
  const { data } = await api.get(`/posts/recommended/${userId}`)
  return data.posts || []
}

export async function creerPublication(formData) {
  const { data } = await api.post('/posts/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function modifierPublication(id, formData) {
  const { data } = await api.put(`/posts/update/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function supprimerPublication(id) {
  const { data } = await api.delete(`/posts/delete/${id}`)
  return data
}

// ---- « J'aime » ----

export async function basculerLike(postId, userId = idUtilisateurCourant()) {
  const { data } = await api.post('/likes/toggle', null, { params: { userId, postId } })
  return data
}

export async function mesLikes(userId = idUtilisateurCourant()) {
  const { data } = await api.get(`/likes/my-likes/${userId}`)
  return data
}

export async function likesRecus(userId = idUtilisateurCourant()) {
  const { data } = await api.get(`/likes/received/users/${userId}`)
  return data
}

// ---- Commentaires ----

export async function fetchCommentaires(postId, userId = idUtilisateurCourant()) {
  const { data } = await api.get(`/comments/post/${postId}`, { params: userId ? { userId } : {} })
  return data.comments || data.commentaires || []
}

/** Ajoute un commentaire, ou une réponse si parentId est fourni. */
export async function ajouterCommentaire(postId, contenu, userId = idUtilisateurCourant(), parentId = null) {
  const { data } = await api.post('/comments/add', {
    contenu,
    user: { id: userId },
    post: { id: postId },
    parentId,
  })
  return data
}

export async function modifierCommentaire(commentId, contenu, userId = idUtilisateurCourant()) {
  const { data } = await api.put(`/comments/${commentId}`, { contenu }, { headers: { 'X-User-Id': userId } })
  return data
}

export async function supprimerCommentaire(commentId, userId = idUtilisateurCourant()) {
  const { data } = await api.delete(`/comments/${commentId}`, { headers: { 'X-User-Id': userId } })
  return data
}

/**
 * Pose, remplace ou retire une réaction sur un commentaire.
 * Types : JAIME | SOUTIEN | MERCI | BRAVO
 */
export async function reagirCommentaire(commentId, type = 'JAIME', userId = idUtilisateurCourant()) {
  const { data } = await api.post(`/comments/${commentId}/reaction`, { type }, { headers: { 'X-User-Id': userId } })
  return data
}

export async function commentairesRecus(userId = idUtilisateurCourant()) {
  const { data } = await api.get(`/comments/received/users/${userId}`)
  return data
}
