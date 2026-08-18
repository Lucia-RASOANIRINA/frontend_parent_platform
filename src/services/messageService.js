import api, { WS_URL, idUtilisateurCourant } from './api'

/**
 * Messagerie : conversations, messages (texte, image, fichier, vocal)
 * et connexion temps réel.
 */

/** URL du WebSocket, résolue en même temps que l'API (local ou en ligne). */
export function urlWebSocket() {
  return WS_URL
}

export async function fetchConversations(userId = idUtilisateurCourant(), filtre = 'all') {
  const { data } = await api.get(`/messages/conversations/${userId}`, { params: { filter: filtre } })
  return data.conversations || []
}

export async function fetchMessages(userId, autreUserId) {
  const { data } = await api.get(`/messages/conversation/${userId}/${autreUserId}`)
  return (data.messages || []).map(m => ({ ...m, senderId: m.sender?.id }))
}

export async function marquerLu(userId, otherUserId) {
  const { data } = await api.post('/messages/mark-read', { userId, otherUserId })
  return data
}

export async function marquerNonLu(userId, otherUserId) {
  const { data } = await api.post('/messages/mark-unread', { userId, otherUserId })
  return data
}

export async function supprimerConversation(conversationId) {
  const { data } = await api.delete(`/messages/conversation/${conversationId}`)
  return data
}

/** Modifie un message texte déjà envoyé (seul son auteur le peut). */
export async function modifierMessage(messageId, contenu, userId = idUtilisateurCourant()) {
  const { data } = await api.put(`/messages/${messageId}`, { contenu }, { headers: { 'X-User-Id': userId } })
  return data
}

/** Retire un message : il reste dans le fil, signalé comme supprimé. */
export async function supprimerMessage(messageId, userId = idUtilisateurCourant()) {
  const { data } = await api.delete(`/messages/${messageId}`, { headers: { 'X-User-Id': userId } })
  return data
}

/**
 * Prépare un message vocal pour l'envoi WebSocket.
 * L'audio est transmis en base64, comme les autres pièces jointes.
 */
export function messageVocal({ base64, mimeType, secondes, senderId, receiverId }) {
  return {
    contenu: `Message vocal (${secondes}s)`,
    sender: { id: senderId },
    receiver: { id: receiverId },
    messageType: 'AUDIO',
    fileData: base64,
    fileType: mimeType || 'audio/webm',
    fileName: `vocal-${secondes}s.webm`,
    durationSeconds: secondes,
    createdAt: new Date().toISOString(),
  }
}
