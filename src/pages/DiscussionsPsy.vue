<template>
  <div class="chat-container">
    <!-- Sidebar gauche -->
    <div class="chat-sidebar" :class="{ 'sidebar-open': isSidebarOpen }">
      <div class="sidebar-header">
        <div class="header-left">
          <div class="filter-menu" @click.stop>
            <button @click="toggleFilterMenu" class="menu-icon-btn">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div v-if="showFilterMenu" class="filter-dropdown">
              <!-- Options du filtre avec icône "✓" devant l'option active -->
              <button @click="setFilter('all')" :class="{ active: currentFilter === 'all' }">
                <span v-if="currentFilter === 'all'" class="check-icon">✓</span>
                Toutes
              </button>
              <button @click="setFilter('unread')" :class="{ active: currentFilter === 'unread' }">
                <span v-if="currentFilter === 'unread'" class="check-icon">✓</span>
                Non lus
              </button>
              <button @click="setFilter('read')" :class="{ active: currentFilter === 'read' }">
                <span v-if="currentFilter === 'read'" class="check-icon">✓</span>
                Lus
              </button>
              <button @click="setFilter('read_no_reply')" :class="{ active: currentFilter === 'read_no_reply' }">
                <span v-if="currentFilter === 'read_no_reply'" class="check-icon">✓</span>
                Lus sans réponse
              </button>
              <button @click="setFilter('read_with_reply')" :class="{ active: currentFilter === 'read_with_reply' }">
                <span v-if="currentFilter === 'read_with_reply'" class="check-icon">✓</span>
                Lus avec réponse
              </button>
            </div>
          </div>
          <h3>Messages</h3>
        </div>
        <button @click="showNewMessageModal = true" class="new-message-btn">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <div class="conversations-list">
        <div
          v-for="conv in conversations"
          :key="conv.id"
          :class="['conversation-item', { active: selectedConversation?.id === conv.id }]"
        >
          <div @click="selectConversation(conv)" class="conversation-main">
            <div class="avatar">
              <span>{{ conv.otherUser.nom.charAt(0).toUpperCase() }}</span>
              <span v-if="conv.unreadCount > 0" class="unread-badge">{{ conv.unreadCount }}</span>
            </div>
            <div class="conversation-info desktop-only">
              <div class="name">{{ conv.otherUser.nom }}</div>
              <div class="last-message">{{ truncateText(conv.lastMessage, 30) }}</div>
            </div>
            <div class="time desktop-only">{{ formatTime(conv.lastMessageTime) }}</div>
          </div>

          <div class="conversation-menu">
            <button @click.stop="toggleMenu(conv.id)" class="menu-trigger">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            <div v-if="activeMenu === conv.id" class="menu-dropdown" @click.stop>
              <button @click="markAsRead(conv)" class="menu-item">Marquer comme lu</button>
              <button @click="markAsUnread(conv)" class="menu-item">Marquer comme non lu</button>
              <button @click="confirmDeleteConversation(conv)" class="menu-item delete">Supprimer</button>
            </div>
          </div>
        </div>

        <div v-if="conversations.length === 0 && !isLoadingConv" class="no-conversations">
          <p>Aucune conversation</p>
        </div>
        <div v-if="isLoadingConv" class="loading-conv">
          <div class="spinner-small"></div>
          <span>Chargement...</span>
        </div>
      </div>
    </div>

    <!-- Zone de chat principale -->
    <div class="chat-main" v-if="selectedConversation">
      <div class="chat-header">
        <button @click="goBack" class="back-btn">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div class="user-info">
          <div class="avatar">{{ selectedConversation.otherUser.nom.charAt(0).toUpperCase() }}</div>
          <div class="desktop-only">
            <h4>{{ selectedConversation.otherUser.nom }}</h4>
            <span class="status" :class="{ online: isUserOnline }">{{ isUserOnline ? 'En ligne' : 'Hors ligne' }}</span>
          </div>
        </div>
      </div>

      <div class="messages-area" ref="messagesArea">
        <div v-if="isLoadingMessages" class="loading-messages"><div class="spinner-small"></div><span>Chargement...</span></div>
        <div v-else-if="messages.length === 0" class="no-messages">
          <p>Aucun message. Commencez la conversation !</p>
        </div>
        <div
          v-for="message in messages"
          :key="message.id"
          :class="['message', message.senderId === user.id ? 'sent' : 'received']"
        >
          <div class="message-content">
            <div v-if="message.messageType === 'IMAGE'" class="message-image">
              <img :src="`data:${message.fileType || 'image/jpeg'};base64,${message.fileData}`" alt="Image">
            </div>
            <div v-else-if="message.messageType === 'FILE'" class="message-file">
              <a :href="`data:${message.fileType || 'application/pdf'};base64,${message.fileData}`" :download="message.fileName" class="file-link">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                {{ message.fileName }}
              </a>
            </div>
            <p v-else>{{ message.contenu }}</p>
            <div class="message-footer">
              <span class="time">{{ formatMessageTime(message.createdAt) }}</span>
              <span v-if="message.senderId === user.id && message.isRead" class="read-status">✓</span>
            </div>
          </div>
        </div>
        <div v-if="isTyping" class="typing-indicator">{{ selectedConversation.otherUser.nom }} écrit...</div>
      </div>

      <div class="chat-input-area">
        <button @click="triggerFileUpload" class="action-btn">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>
        <input type="file" ref="fileInput" class="hidden" @change="sendFile" accept="image/*,application/pdf">
        <input v-model="newMessage" @keyup.enter="sendMessage" @keyup="onTyping" type="text" placeholder="Écrire un message..." class="message-input">
        <button @click="sendMessage" class="send-btn">
          <svg class="w-6 h-6 send-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Écran "Aucune conversation" (desktop) -->
    <div v-else class="no-conversation desktop-only">
      <button @click="showNewMessageModal = true" class="new-message-icon-btn">
        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span>Nouveau message</span>
      </button>
      <p>Sélectionnez une conversation ou commencez-en une nouvelle</p>
    </div>

    <!-- Modal Nouveau message -->
    <div v-if="showNewMessageModal" class="modal-overlay" @click.self="showNewMessageModal = false">
      <div class="modal-content">
        <div class="modal-header"><h3>Nouveau message</h3><button @click="showNewMessageModal = false">✕</button></div>
        <div class="search-bar"><input v-model="searchQuery" @input="searchUsers" placeholder="Rechercher..." class="search-input"></div>
        <div class="users-list">
          <div v-if="isSearching" class="searching">Recherche...</div>
          <div v-for="u in searchResults" :key="u.id" @click="startConversation(u)" class="user-item">
            <div class="avatar">{{ u.nom.charAt(0).toUpperCase() }}</div>
            <div><div class="name">{{ u.nom }}</div><div class="email">{{ u.email }}</div></div>
          </div>
          <div v-if="searchResults.length === 0 && searchQuery && !isSearching">Aucun utilisateur</div>
        </div>
      </div>
    </div>

    <!-- MODALE DE SUPPRESSION (icône centrée) -->
    <div v-if="showDeleteModal" class="modal-overlay delete-overlay" @click.self="closeDeleteModal">
      <div class="delete-modal-custom">
        <div class="delete-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </div>
        <h3>Supprimer la conversation ?</h3>
        <p>Cette action est irréversible.</p>
        <div class="delete-modal-buttons">
          <button @click="closeDeleteModal" class="cancel-btn">Annuler</button>
          <button @click="deleteConversation" class="confirm-delete-btn">Supprimer</button>
        </div>
      </div>
    </div>

    <!-- Toast simple (style d'origine) -->
    <div v-if="toast.show" class="toast-notification" :class="toast.type">
      <span>{{ toast.message }}</span>
      <button @click="closeToast">✕</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:8082/api', headers: { 'Content-Type': 'application/json' } })
const user = JSON.parse(localStorage.getItem('user') || '{"id": 6, "nom": "Lora", "role": "PSY"}')
const WS_URL = 'http://localhost:8082/ws'

// États
const conversations = ref([])
const selectedConversation = ref(null)
const messages = ref([])
const newMessage = ref('')
const isTyping = ref(false)
const isUserOnline = ref(false)
const showNewMessageModal = ref(false)
const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)
const isLoadingConv = ref(false)
const isLoadingMessages = ref(false)
const activeMenu = ref(null)
const isSidebarOpen = ref(true)
const showDeleteModal = ref(false)
const conversationToDelete = ref(null)
const toast = ref({ show: false, message: '', type: 'success', timeoutId: null })
const currentFilter = ref('all')
const showFilterMenu = ref(false)

let stompClient = null
let typingTimeout = null
const isMobileView = ref(window.innerWidth < 640)
const messagesArea = ref(null)
const fileInput = ref(null)

// Toast simple
const showToast = (msg, type) => {
  if (toast.value.timeoutId) clearTimeout(toast.value.timeoutId)
  toast.value = { show: true, message: msg, type, timeoutId: null }
  toast.value.timeoutId = setTimeout(() => { toast.value.show = false }, 20000)
}
const closeToast = () => {
  if (toast.value.timeoutId) clearTimeout(toast.value.timeoutId)
  toast.value.show = false
}

// Filtres
const toggleFilterMenu = () => { showFilterMenu.value = !showFilterMenu.value }
const setFilter = (filter) => {
  currentFilter.value = filter
  showFilterMenu.value = false
  fetchConversations()
}

// Récupération des conversations (backend filtré)
const fetchConversations = async () => {
  isLoadingConv.value = true
  try {
    const res = await api.get(`/messages/conversations/${user.id}?filter=${currentFilter.value}`)
    if (res.data.success) conversations.value = res.data.conversations
  } catch (err) { console.error(err); showToast('Erreur chargement', 'error') }
  finally { isLoadingConv.value = false }
}

// Messages
const fetchMessages = async (otherUserId) => {
  isLoadingMessages.value = true
  try {
    const res = await api.get(`/messages/conversation/${user.id}/${otherUserId}`)
    if (res.data.success) {
      const formatted = res.data.messages.map(m => ({ ...m, senderId: m.sender?.id }))
      formatted.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt))
      messages.value = formatted
      await nextTick(); scrollToBottom()
      // On marque comme lu via la même logique que le bouton
      await markMessagesAsRead(otherUserId)
    }
  } catch (err) { console.error(err) }
  finally { isLoadingMessages.value = false }
}

const selectConversation = async (conv) => {
  selectedConversation.value = conv
  if (conv.unreadCount > 0) {
    // Appel identique à markAsRead (mais sans recharger toute la liste)
    await markMessagesAsRead(conv.otherUser.id)
    conv.unreadCount = 0
  }
  await fetchMessages(conv.otherUser.id)
  if (isMobileView.value) isSidebarOpen.value = false
}

const markMessagesAsRead = async (otherUserId) => {
  try {
    await api.post('/messages/mark-read', { userId: user.id, otherUserId })
    // Mise à jour locale du compteur
    const conv = conversations.value.find(c => c.otherUser.id === otherUserId)
    if (conv) conv.unreadCount = 0
  } catch (err) { console.error(err) }
}

const markAsRead = async (conv) => {
  try {
    await api.post('/messages/mark-read', { userId: user.id, otherUserId: conv.otherUser.id })
    conv.unreadCount = 0
    activeMenu.value = null
    showToast('Conversation marquée comme lue', 'success')
    await fetchConversations() // recharge pour mettre à jour les filtres
  } catch (err) { showToast('Erreur', 'error') }
}

const markAsUnread = async (conv) => {
  if (conv.lastMessageSenderId === user.id) {
    showToast('Vous avez déjà répondu', 'error')
    activeMenu.value = null
    return
  }
  try {
    await api.post('/messages/mark-unread', { userId: user.id, otherUserId: conv.otherUser.id })
    conv.unreadCount = 1
    activeMenu.value = null
    showToast('Conversation marquée comme non lue', 'success')
    await fetchConversations()
  } catch (err) { showToast('Erreur', 'error') }
}

const confirmDeleteConversation = (conv) => {
  conversationToDelete.value = conv
  showDeleteModal.value = true
  activeMenu.value = null
}
const closeDeleteModal = () => { showDeleteModal.value = false; conversationToDelete.value = null }
const deleteConversation = async () => {
  if (!conversationToDelete.value) return
  try {
    await api.delete(`/messages/conversation/${conversationToDelete.value.id}`)
    const index = conversations.value.findIndex(c => c.id === conversationToDelete.value.id)
    if (index !== -1) conversations.value.splice(index, 1)
    if (selectedConversation.value?.id === conversationToDelete.value.id) {
      selectedConversation.value = null
      messages.value = []
    }
    showToast('Conversation supprimée', 'success')
    closeDeleteModal()
  } catch (err) { showToast('Erreur suppression', 'error') }
}

const startConversation = async (otherUser) => {
  const existing = conversations.value.find(c => c.otherUser.id === otherUser.id)
  if (existing) await selectConversation(existing)
  else {
    const newConv = {
      id: Date.now(),
      otherUser,
      lastMessage: '',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
      lastMessageSenderId: null
    }
    conversations.value.unshift(newConv)
    await selectConversation(newConv)
  }
  showNewMessageModal.value = false
  searchQuery.value = ''
  searchResults.value = []
}

const searchUsers = async () => {
  if (!searchQuery.value.trim()) { searchResults.value = []; return }
  isSearching.value = true
  try {
    const res = await api.get('/auth/users/search', { params: { query: searchQuery.value } })
    if (res.data.success) searchResults.value = res.data.users.filter(u => u.id !== user.id)
  } catch (err) { searchResults.value = [] }
  finally { isSearching.value = false }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedConversation.value) return
  const messageData = {
    contenu: newMessage.value,
    sender: { id: user.id },
    receiver: { id: selectedConversation.value.otherUser.id },
    messageType: 'TEXT',
    createdAt: new Date().toISOString()
  }
  const localMsg = {
    id: Date.now(),
    contenu: newMessage.value,
    createdAt: new Date().toISOString(),
    messageType: 'TEXT',
    isRead: false,
    senderId: user.id,
    receiverId: selectedConversation.value.otherUser.id
  }
  messages.value.push(localMsg)
  scrollToBottom()
  if (stompClient?.connected) stompClient.publish({ destination: '/app/chat.send', body: JSON.stringify(messageData) })
  else connectWebSocket()
  newMessage.value = ''
}

const triggerFileUpload = () => fileInput.value?.click()
const sendFile = async (event) => {
  const target = event.target
  if (!target.files?.length || !selectedConversation.value) return
  const file = target.files[0]
  const reader = new FileReader()
  reader.onload = async () => {
    const base64 = reader.result.split(',')[1]
    const messageData = {
      contenu: file.name,
      sender: { id: user.id },
      receiver: { id: selectedConversation.value.otherUser.id },
      messageType: file.type.startsWith('image/') ? 'IMAGE' : 'FILE',
      fileData: base64,
      fileType: file.type,
      fileName: file.name,
      createdAt: new Date().toISOString()
    }
    const localMsg = { ...messageData, id: Date.now(), isRead: false, senderId: user.id, receiverId: selectedConversation.value.otherUser.id }
    messages.value.push(localMsg)
    scrollToBottom()
    if (stompClient?.connected) stompClient.publish({ destination: '/app/chat.send', body: JSON.stringify(messageData) })
  }
  reader.readAsDataURL(file)
  target.value = ''
}

const onTyping = () => {
  if (!selectedConversation.value) return
  if (typingTimeout) clearTimeout(typingTimeout)
  stompClient?.publish({
    destination: '/app/chat.typing',
    body: JSON.stringify({ senderId: user.id, receiverId: selectedConversation.value.otherUser.id, typing: true })
  })
  typingTimeout = setTimeout(() => {
    stompClient?.publish({
      destination: '/app/chat.typing',
      body: JSON.stringify({ senderId: user.id, receiverId: selectedConversation.value.otherUser.id, typing: false })
    })
  }, 1000)
}

const scrollToBottom = () => {
  if (messagesArea.value) setTimeout(() => { messagesArea.value.scrollTop = messagesArea.value.scrollHeight }, 100)
}
const formatTime = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr), now = new Date(), diff = now - d
  if (diff < 60000) return "À l'instant"
  if (diff < 3600000) return `il y a ${Math.floor(diff/60000)} min`
  if (diff < 86400000) return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
}
const formatMessageTime = (dateStr) => dateStr ? new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''
const truncateText = (txt, len) => txt?.length > len ? txt.substring(0, len) + '...' : txt || ''
const goBack = () => {
  if (isMobileView.value) { selectedConversation.value = null; isSidebarOpen.value = true }
  else selectedConversation.value = null
}
const toggleMenu = (id) => { activeMenu.value = activeMenu.value === id ? null : id }

// WebSocket
const connectWebSocket = () => {
  stompClient = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    reconnectDelay: 5000,
    onConnect: () => {
      stompClient.subscribe(`/user/${user.id}/queue/messages`, (msg) => {
        const newMsg = JSON.parse(msg.body)
        const formatted = { ...newMsg, senderId: newMsg.sender?.id, receiverId: newMsg.receiver?.id }
        if (selectedConversation.value && formatted.senderId === selectedConversation.value.otherUser.id) {
          messages.value.push(formatted); scrollToBottom(); markMessagesAsRead(selectedConversation.value.otherUser.id)
        } else fetchConversations()
      })
      stompClient.subscribe(`/user/${user.id}/queue/typing`, (msg) => {
        const data = JSON.parse(msg.body)
        if (selectedConversation.value && data.senderId === selectedConversation.value.otherUser.id) {
          isTyping.value = data.typing
          setTimeout(() => { isTyping.value = false }, 2000)
        }
      })
      stompClient.subscribe(`/user/${user.id}/queue/read`, () => {
        fetchConversations()
        messages.value.forEach(m => { if (m.senderId !== user.id) m.isRead = true })
      })
      fetchConversations()
    }
  })
  stompClient.activate()
}

// Gestion mobile
const handleResize = () => {
  isMobileView.value = window.innerWidth < 640
  const header = document.querySelector('header')
  const headerHeight = header ? header.offsetHeight : 60
  document.documentElement.style.setProperty('--header-height', `${headerHeight}px`)
  if (!isMobileView.value && !selectedConversation.value) isSidebarOpen.value = false
  else if (isMobileView.value && !selectedConversation.value) isSidebarOpen.value = true
}
const handleClickOutside = (e) => {
  if (!e.target.closest('.conversation-menu')) activeMenu.value = null
  if (!e.target.closest('.filter-menu')) showFilterMenu.value = false
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', handleResize)
  handleResize()
  await fetchConversations()
  connectWebSocket()
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', handleResize)
  if (stompClient) stompClient.deactivate()
})
watch(messages, () => scrollToBottom(), { deep: true })
</script>

<style scoped>
/* ===== THÈME CYAN/TEAL (aligné sur le header) ===== */
* { color: #1e293b; }
.chat-container {
  display: flex;
  height: calc(100vh - 120px);
  max-height: 65vh;
  width: 90%;
  max-width: 1100px;
  margin: 20px auto;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}
/* Sidebar */
.chat-sidebar {
  width: 260px;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  overflow-x: hidden;
}
.sidebar-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-left { display: flex; align-items: center; gap: 12px; }
.filter-menu { position: relative; }
.menu-icon-btn, .new-message-btn {
  background: #f3f4f6;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  color: #0891B2; /* cyan foncé */
}
.menu-icon-btn:hover, .new-message-btn:hover { background: #e5e7eb; transform: scale(1.02); }
.sidebar-header h3 { margin: 0; font-size: 16px; font-weight: 600; }
.filter-dropdown {
  position: absolute;
  left: 0;
  top: 36px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  width: 190px;
  z-index: 100;
  overflow: hidden;
}
.filter-dropdown button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
}
.filter-dropdown button:hover { background: #f9fafb; }
.filter-dropdown button.active { background: #F0F9FF; color: #0891B2; font-weight: 500; } /* fond cyan très clair */
.check-icon {
  font-weight: bold;
  font-size: 14px;
  width: 18px;
  display: inline-block;
}
.conversations-list {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}
.conversation-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
}
.conversation-item:hover { background: #fafafa; }
.conversation-item.active { background: #F0F9FF; border-left: 3px solid #06B6D4; } /* cyan vif */
.conversation-main {
  display: flex;
  align-items: center;
  flex: 1;
  cursor: pointer;
  gap: 10px;
  min-width: 0;
}
.avatar {
  position: relative;
  width: 34px;
  height: 34px;
  background: #0891B2; /* cyan foncé */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 13px;
  color: white;
}
.unread-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.conversation-info { flex: 1; min-width: 0; }
.name { font-weight: 600; font-size: 13px; }
.last-message { font-size: 11px; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.time {
  font-size: 9px;
  color: #9ca3af;
  margin-left: 8px;
  flex-shrink: 0;
}
.conversation-menu {
  position: relative;
  flex-shrink: 0;
  margin-left: 4px;
}
.menu-trigger { background: none; border: none; cursor: pointer; padding: 4px; border-radius: 50%; color: #9ca3af; }
.menu-trigger:hover { background: #f0f0f0; color: #4b5563; }
.menu-dropdown {
  position: absolute;
  right: 0;
  top: 28px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  width: 180px;
  z-index: 100;
  overflow: hidden;
}
.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
}
.menu-item:hover { background: #f9fafb; }
.menu-item.delete { color: #dc2626; }
.menu-item.delete:hover { background: #fef2f2; }
/* Chat main */
.chat-main { flex: 1; display: flex; flex-direction: column; background: #fff; }
.chat-header {
  padding: 10px 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 12px;
}
.back-btn {
  background: #f3f4f6;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  color: #0891B2;
}
.back-btn:hover { background: #e5e7eb; }
.user-info { display: flex; align-items: center; gap: 10px; }
.user-info .avatar { width: 32px; height: 32px; font-size: 12px; }
.status { font-size: 10px; color: #6b7280; }
.status.online { color: #10b981; }
.messages-area {
  flex: 1;
  padding: 14px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.message { display: flex; max-width: 70%; }
.message.sent { justify-content: flex-end; align-self: flex-end; }
.message.received { justify-content: flex-start; align-self: flex-start; }
.message-content {
  padding: 6px 10px;
  border-radius: 16px;
  max-width: 100%;
}
.message.sent .message-content { background: #06B6D4; color: white; border-bottom-right-radius: 4px; } /* cyan vif */
.message.received .message-content { background: #f3f4f6; border-bottom-left-radius: 4px; box-shadow: 0 1px 1px rgba(0,0,0,0.05); }
.message-content p { margin: 0; font-size: 12px; word-wrap: break-word; }
.message-footer { display: flex; justify-content: center; align-items: center; gap: 5px; margin-top: 3px; }
.message-content .time { font-size: 8px; opacity: 0.7; }
.message.sent .message-content .time { color: #fef9c3; }
.message-image img { max-width: 160px; border-radius: 10px; }
.typing-indicator { padding: 5px 10px; background: #f3f4f6; border-radius: 16px; align-self: flex-start; font-size: 10px; }
.chat-input-area {
  padding: 10px 14px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
}
.action-btn {
  background: #f3f4f6;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  color: #0891B2;
}
.action-btn:hover { background: #e5e7eb; }
.send-btn {
  background: #0891B2; /* cyan foncé */
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: white;
}
.send-btn:hover { background: #164E63; transform: scale(1.02); } /* bleu foncé du header */
.send-icon { transform: rotate(-45deg); }
.message-input {
  flex: 1;
  padding: 8px 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  outline: none;
  font-size: 12px;
  color: #1e293b;
}
.message-input::placeholder { color: #9ca3af; }
.message-input:focus { border-color: #06B6D4; box-shadow: 0 0 0 2px rgba(6,182,212,0.2); }
.hidden { display: none; }
.no-conversation { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; text-align: center; }
.new-message-icon-btn { background: none; border: none; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px; color: #0891B2; }
.loading-conv, .loading-messages { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 30px; }
.spinner-small {
  width: 20px;
  height: 20px;
  border: 2px solid #e5e7eb;
  border-top-color: #06B6D4; /* cyan vif */
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
/* Modals - centrées */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 420px;
  max-height: 70vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.modal-header { padding: 12px 16px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; }
.search-bar { padding: 10px 12px; border-bottom: 1px solid #e5e7eb; }
.search-input { width: 100%; padding: 6px 10px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 20px; }
.user-item { display: flex; align-items: center; padding: 8px 12px; cursor: pointer; }
.user-item:hover { background: #f9fafb; }
.user-item .avatar { width: 32px; height: 32px; margin-right: 10px; background: #0891B2; }
/* MODALE DE SUPPRESSION (icône centrée) */
.delete-overlay {
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
}
.delete-modal-custom {
  background: rgba(255,255,255,0.96);
  border-radius: 32px;
  text-align: center;
  padding: 32px 24px;
  width: 90%;
  max-width: 340px;
  box-shadow: 0 20px 35px -12px rgba(0,0,0,0.2);
  animation: fadeInScale 0.2s ease-out;
}
.delete-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}
.delete-icon svg {
  width: 64px;
  height: 64px;
  stroke: #ef4444;
  stroke-width: 1.2;
}
.delete-modal-custom h3 {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 8px;
  opacity: 0.85;
}
.delete-modal-custom p {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 28px;
}
.delete-modal-custom .delete-modal-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}
.delete-modal-custom .cancel-btn,
.delete-modal-custom .confirm-delete-btn {
  flex: 1;
  padding: 10px 0;
  border-radius: 40px;
  font-size: 0.9rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}
.delete-modal-custom .cancel-btn {
  background: #f1f5f9;
  color: #1e293b;
}
.delete-modal-custom .cancel-btn:hover {
  background: #e2e8f0;
}
.delete-modal-custom .confirm-delete-btn {
  background: #ef4444;
  color: white;
}
.delete-modal-custom .confirm-delete-btn:hover {
  background: #dc2626;
  transform: scale(1.02);
}
@keyframes fadeInScale {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
/* Toast simple (style d'origine) */
.toast-notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  padding: 12px 20px;
  z-index: 1100;
  border: 1px solid #e5e7eb;
}
.toast-notification.success { border-left: 4px solid #10b981; }
.toast-notification.error { border-left: 4px solid #ef4444; }
.toast-notification button {
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  font-size: 16px;
}
/* Responsive mobile */
@media (max-width: 640px) {
  .desktop-only { display: none; }
  .chat-container {
    width: 100%;
    height: 100vh;
    max-height: none;
    border-radius: 0;
    margin: 0;
  }
  .chat-sidebar {
    position: fixed;
    left: 0;
    top: var(--header-height, 60px);
    bottom: 0;
    z-index: 20;
    transform: translateX(-100%);
    width: 85%;
    transition: transform 0.3s ease;
    box-shadow: 2px 0 10px rgba(0,0,0,0.1);
    background: white;
  }
  .chat-sidebar.sidebar-open { transform: translateX(0); }
  .chat-main { width: 100%; height: 100%; }
  .message { max-width: 85%; }
  .back-btn { display: flex; }
  .no-conversation.desktop-only { display: none; }
  .modal-content { width: 90%; max-width: 90%; }
  .delete-modal-custom { width: 85%; padding: 24px 20px; }
  .delete-icon svg { width: 48px; height: 48px; }
}
</style>