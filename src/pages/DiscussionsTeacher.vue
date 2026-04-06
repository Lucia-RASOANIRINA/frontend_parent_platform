<template>
  <div class="chat-container">
    <!-- Sidebar gauche -->
    <div class="chat-sidebar">
      <div class="sidebar-header">
        <h3>Messages</h3>
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
          @click="selectConversation(conv)"
          :class="['conversation-item', { active: selectedConversation?.id === conv.id }]"
        >
          <div class="avatar">
            <span>{{ conv.otherUser.nom.charAt(0).toUpperCase() }}</span>
            <span v-if="conv.unreadCount > 0" class="unread-badge">{{ conv.unreadCount }}</span>
          </div>
          <div class="conversation-info">
            <div class="name">{{ conv.otherUser.nom }}</div>
            <div class="last-message">{{ truncateText(conv.lastMessage, 30) }}</div>
          </div>
          <div class="time">{{ formatTime(conv.lastMessageTime) }}</div>
        </div>
        
        <div v-if="conversations.length === 0 && !isLoadingConv" class="no-conversations">
          <p>Aucune conversation</p>
          <button @click="showNewMessageModal = true" class="start-chat-btn">
            Commencer une discussion
          </button>
        </div>
        <div v-if="isLoadingConv" class="loading-conv">
          Chargement...
        </div>
      </div>
    </div>

    <!-- Zone de chat principale -->
    <div class="chat-main" v-if="selectedConversation">
      <div class="chat-header">
        <div class="user-info">
          <div class="avatar">
            {{ selectedConversation.otherUser.nom.charAt(0).toUpperCase() }}
          </div>
          <div>
            <h4>{{ selectedConversation.otherUser.nom }}</h4>
            <span class="status" :class="{ online: isUserOnline }">
              {{ isUserOnline ? 'En ligne' : 'Hors ligne' }}
            </span>
          </div>
        </div>
      </div>

      <div class="messages-area" ref="messagesArea">
        <div v-if="isLoadingMessages" class="loading-messages">
          Chargement des messages...
        </div>
        <div v-else-if="messages.length === 0" class="no-messages">
          Aucun message. Commencez la conversation !
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {{ message.fileName }}
              </a>
            </div>
            <p v-else>{{ message.contenu }}</p>
            <div class="message-footer">
              <span class="time">{{ formatMessageTime(message.createdAt) }}</span>
              <span v-if="message.senderId === user.id && message.isRead" class="read-status">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
        
        <div v-if="isTyping" class="typing-indicator">
          <span>{{ selectedConversation.otherUser.nom }} écrit...</span>
        </div>
      </div>

      <div class="chat-input-area">
        <div class="input-actions">
          <button @click="triggerFileUpload" class="action-btn">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <input type="file" ref="fileInput" class="hidden" @change="sendFile" accept="image/*,application/pdf">
        </div>
        
        <input 
          v-model="newMessage" 
          @keyup.enter="sendMessage"
          @keyup="onTyping"
          type="text" 
          placeholder="Écrire un message..."
          class="message-input"
        >
        
        <button @click="sendMessage" class="send-btn">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Aucune conversation sélectionnée -->
    <div v-else class="no-conversation">
      <svg class="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <p>Sélectionnez une conversation</p>
      <button @click="showNewMessageModal = true" class="start-chat-btn-primary">
        Nouveau message
      </button>
    </div>

    <!-- Modal Nouveau message -->
    <div v-if="showNewMessageModal" class="modal-overlay" @click.self="showNewMessageModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Nouveau message</h3>
          <button @click="showNewMessageModal = false" class="close-btn">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="search-bar">
          <input 
            v-model="searchQuery" 
            @input="searchUsers"
            type="text" 
            placeholder="Rechercher un utilisateur..."
            class="search-input"
          >
        </div>
        
        <div class="users-list">
          <div v-if="isSearching" class="searching">
            <div class="spinner"></div>
            Recherche en cours...
          </div>
          <div 
            v-for="userItem in searchResults" 
            :key="userItem.id"
            @click="startConversation(userItem)"
            class="user-item"
          >
            <div class="avatar">
              {{ userItem.nom.charAt(0).toUpperCase() }}
            </div>
            <div class="user-info">
              <div class="name">{{ userItem.nom }}</div>
              <div class="email">{{ userItem.email }}</div>
              <div class="role">{{ userItem.role }}</div>
            </div>
          </div>
          
          <div v-if="searchResults.length === 0 && searchQuery && !isSearching" class="no-results">
            Aucun utilisateur trouvé
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import axios from 'axios'

// Configuration axios
const api = axios.create({
  baseURL: 'http://localhost:8082/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

const user = JSON.parse(localStorage.getItem('user') || '{"id": 6, "nom": "Lora", "role": "PSY"}')
const API_BASE_URL = 'http://localhost:8082/api'
const WS_URL = 'http://localhost:8082/ws'

// États
const conversations = ref<any[]>([])
const selectedConversation = ref<any>(null)
const messages = ref<any[]>([])
const newMessage = ref('')
const isTyping = ref(false)
const isUserOnline = ref(false)
const showNewMessageModal = ref(false)
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const isSearching = ref(false)
const isLoadingConv = ref(false)
const isLoadingMessages = ref(false)
let typingTimeout: any = null

// WebSocket
let stompClient: Client | null = null

// Refs
const messagesArea = ref<HTMLElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// Récupérer les conversations
const fetchConversations = async () => {
  isLoadingConv.value = true
  try {
    console.log('Chargement des conversations...')
    const response = await api.get(`/messages/conversations/${user.id}`)
    console.log('Réponse conversations:', response.data)
    if (response.data.conversations) {
      conversations.value = response.data.conversations
    }
  } catch (error: any) {
    console.error('Erreur chargement conversations:', error.response?.data || error.message)
  } finally {
    isLoadingConv.value = false
  }
}

// Récupérer les messages d'une conversation
const fetchMessages = async (otherUserId: number) => {
  isLoadingMessages.value = true
  try {
    console.log(`Chargement des messages avec ${otherUserId}`)
    const response = await api.get(`/messages/conversation/${user.id}/${otherUserId}`)
    console.log('Messages reçus brut:', response.data)
    
    if (response.data.messages && response.data.messages.length > 0) {
      // Formater les messages pour avoir senderId
      const formattedMessages = response.data.messages.map((msg: any) => {
        return {
          id: msg.id,
          contenu: msg.contenu,
          createdAt: msg.createdAt,
          messageType: msg.messageType,
          fileData: msg.fileData,
          fileType: msg.fileType,
          fileName: msg.fileName,
          isRead: msg.isRead || false,
          senderId: msg.sender?.id || msg.senderId,
          receiverId: msg.receiver?.id || msg.receiverId
        }
      })
      
      // Trier par date
      formattedMessages.sort((a: any, b: any) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      })
      
      messages.value = formattedMessages
      console.log(`${messages.value.length} messages chargés`)
      console.log('Messages détaillés:', JSON.parse(JSON.stringify(messages.value)))
      
      await nextTick()
      scrollToBottom()
      markMessagesAsRead(otherUserId)
    } else {
      messages.value = []
      console.log('Aucun message trouvé')
    }
  } catch (error) {
    console.error('Erreur chargement messages:', error)
  } finally {
    isLoadingMessages.value = false
  }
}

// Sélectionner une conversation
const selectConversation = async (conv: any) => {
  console.log('Conversation sélectionnée:', conv)
  selectedConversation.value = conv
  await fetchMessages(conv.otherUser.id)
}

// Démarrer une nouvelle conversation
const startConversation = async (otherUser: any) => {
  const newConversation = {
    id: Date.now(),
    otherUser: otherUser,
    lastMessage: '',
    lastMessageTime: new Date().toISOString(),
    unreadCount: 0
  }
  
  selectedConversation.value = newConversation
  messages.value = []
  showNewMessageModal.value = false
  searchQuery.value = ''
  searchResults.value = []
  
  const exists = conversations.value.some(c => c.otherUser.id === otherUser.id)
  if (!exists) {
    conversations.value.unshift(newConversation)
  }
}

// Rechercher des utilisateurs
const searchUsers = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }
  
  isSearching.value = true
  
  try {
    console.log('Recherche utilisateurs:', searchQuery.value)
    const response = await api.get('/auth/users/search', {
      params: { query: searchQuery.value }
    })
    console.log('Résultats recherche:', response.data)
    if (response.data.success) {
      searchResults.value = response.data.users.filter((u: any) => u.id !== user.id)
    }
  } catch (error: any) {
    console.error('Erreur recherche:', error.response?.data || error.message)
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
}

// Envoyer un message
const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedConversation.value) return
  
  const messageData = {
    contenu: newMessage.value,
    sender: { id: user.id },
    receiver: { id: selectedConversation.value.otherUser.id },
    messageType: 'TEXT',
    createdAt: new Date().toISOString()
  }
  
  // Ajouter localement
  const localMessage = {
    id: Date.now(),
    contenu: newMessage.value,
    createdAt: new Date().toISOString(),
    messageType: 'TEXT',
    isRead: false,
    senderId: user.id,
    receiverId: selectedConversation.value.otherUser.id
  }
  messages.value.push(localMessage)
  scrollToBottom()
  
  // Envoyer via WebSocket
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(messageData)
    })
  } else {
    console.warn('WebSocket non connecté, tentative de reconnexion...')
    connectWebSocket()
  }
  
  newMessage.value = ''
}

// Envoyer un fichier
const triggerFileUpload = () => {
  fileInput.value?.click()
}

const sendFile = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files?.length || !selectedConversation.value) return
  
  const file = target.files[0]
  const reader = new FileReader()
  
  reader.onload = async () => {
    const base64 = (reader.result as string).split(',')[1]
    
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
    
    const localMessage = {
      id: Date.now(),
      contenu: file.name,
      createdAt: new Date().toISOString(),
      messageType: file.type.startsWith('image/') ? 'IMAGE' : 'FILE',
      fileData: base64,
      fileType: file.type,
      fileName: file.name,
      isRead: false,
      senderId: user.id,
      receiverId: selectedConversation.value.otherUser.id
    }
    messages.value.push(localMessage)
    scrollToBottom()
    
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: '/app/chat.send',
        body: JSON.stringify(messageData)
      })
    }
  }
  
  reader.readAsDataURL(file)
  target.value = ''
}

// Marquer les messages comme lus
const markMessagesAsRead = (otherUserId: number) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: '/app/chat.markRead',
      body: JSON.stringify({
        currentUserId: user.id,
        otherUserId: otherUserId
      })
    })
  }
}

// Indicateur de frappe
const onTyping = () => {
  if (!selectedConversation.value) return
  
  if (typingTimeout) clearTimeout(typingTimeout)
  
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: '/app/chat.typing',
      body: JSON.stringify({
        senderId: user.id,
        receiverId: selectedConversation.value.otherUser.id,
        typing: true
      })
    })
  }
  
  typingTimeout = setTimeout(() => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: '/app/chat.typing',
        body: JSON.stringify({
          senderId: user.id,
          receiverId: selectedConversation.value.otherUser.id,
          typing: false
        })
      })
    }
  }, 1000)
}

// Scroll en bas
const scrollToBottom = () => {
  if (messagesArea.value) {
    setTimeout(() => {
      messagesArea.value!.scrollTop = messagesArea.value!.scrollHeight
    }, 100)
  }
}

// Formater le temps pour l'affichage
const formatTime = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60000) {
    return 'À l\'instant'
  } else if (diff < 3600000) {
    return `il y a ${Math.floor(diff / 60000)} min`
  } else if (diff < 86400000) {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  } else {
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
  }
}

// Formater le temps pour le footer du message
const formatMessageTime = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

// Tronquer le texte
const truncateText = (text: string, maxLength: number) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

// Connecter WebSocket
const connectWebSocket = () => {
  console.log('Connexion WebSocket...')
  stompClient = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    reconnectDelay: 5000,
    debug: (str) => console.log('STOMP:', str),
    onConnect: () => {
      console.log('WebSocket connecté avec succès')
      
      // S'abonner aux messages
      stompClient?.subscribe(`/user/${user.id}/queue/messages`, (message) => {
        const newMsg = JSON.parse(message.body)
        console.log('Nouveau message reçu via WebSocket:', newMsg)
        
        // Formater le message reçu
        const formattedMsg = {
          id: newMsg.id,
          contenu: newMsg.contenu,
          createdAt: newMsg.createdAt,
          messageType: newMsg.messageType,
          fileData: newMsg.fileData,
          fileType: newMsg.fileType,
          fileName: newMsg.fileName,
          isRead: false,
          senderId: newMsg.sender?.id,
          receiverId: newMsg.receiver?.id
        }
        
        if (selectedConversation.value && formattedMsg.senderId === selectedConversation.value.otherUser.id) {
          messages.value.push(formattedMsg)
          scrollToBottom()
          markMessagesAsRead(selectedConversation.value.otherUser.id)
        } else {
          // Nouveau message d'une autre conversation, rafraîchir la liste
          fetchConversations()
        }
      })
      
      // S'abonner à l'indicateur de frappe
      stompClient?.subscribe(`/user/${user.id}/queue/typing`, (message) => {
        const data = JSON.parse(message.body)
        if (selectedConversation.value && data.senderId === selectedConversation.value.otherUser.id) {
          isTyping.value = data.typing
        }
      })
      
      // S'abonner aux notifications de lecture
      stompClient?.subscribe(`/user/${user.id}/queue/read`, (message) => {
        fetchConversations()
        // Marquer les messages comme lus localement
        messages.value.forEach(msg => {
          if (msg.senderId !== user.id) {
            msg.isRead = true
          }
        })
      })
      
      fetchConversations()
    },
    onStompError: (frame) => {
      console.error('STOMP error:', frame)
    },
    onDisconnect: () => {
      console.log('WebSocket déconnecté')
    }
  })
  
  stompClient.activate()
}

// Debug: watcher pour les messages
watch(messages, (newMessages) => {
  console.log('Messages mis à jour:', newMessages.length)
  scrollToBottom()
}, { deep: true })

onMounted(() => {
  console.log('Composant monté, utilisateur:', user)
  connectWebSocket()
})

onUnmounted(() => {
  if (stompClient) {
    stompClient.deactivate()
  }
})
</script>

<style scoped>
/* Vos styles existants... */
.chat-container {
  display: flex;
  height: calc(100vh - 80px);
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.chat-sidebar {
  width: 320px;
  background: white;
  border-right: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 18px;
  color: #3E2C1F;
}

.new-message-btn {
  background: #D2B48C;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: white;
}

.new-message-btn:hover {
  background: #3E2C1F;
  transform: scale(1.05);
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
}

.conversation-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid #e9ecef;
}

.conversation-item:hover {
  background: #f8f9fa;
}

.conversation-item.active {
  background: #fff3e0;
  border-left: 3px solid #D2B48C;
}

.avatar {
  position: relative;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #D2B48C, #3E2C1F);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
  margin-right: 12px;
  flex-shrink: 0;
}

.unread-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.conversation-info {
  flex: 1;
  min-width: 0;
}

.name {
  font-weight: 600;
  color: #3E2C1F;
  margin-bottom: 4px;
}

.last-message {
  font-size: 13px;
  color: #868e96;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.time {
  font-size: 11px;
  color: #adb5bd;
  flex-shrink: 0;
  margin-left: 8px;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
}

.chat-header {
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  background: white;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info .avatar {
  width: 45px;
  height: 45px;
  font-size: 16px;
}

.user-info h4 {
  margin: 0;
  font-size: 16px;
  color: #3E2C1F;
}

.status {
  font-size: 12px;
  color: #adb5bd;
}

.status.online {
  color: #51cf66;
}

.messages-area {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  display: flex;
  max-width: 70%;
}

.message.sent {
  justify-content: flex-end;
  align-self: flex-end;
}

.message.received {
  justify-content: flex-start;
  align-self: flex-start;
}

.message-content {
  padding: 10px 14px;
  border-radius: 18px;
  position: relative;
  max-width: 100%;
}

.message.sent .message-content {
  background: #D2B48C;
  color: white;
  border-bottom-right-radius: 4px;
}

.message.received .message-content {
  background: white;
  color: #3E2C1F;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.message-content p {
  margin: 0;
  font-size: 14px;
  word-wrap: break-word;
}

.message-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}

.message-content .time {
  font-size: 10px;
  opacity: 0.7;
}

.read-status {
  display: inline-flex;
  align-items: center;
  opacity: 0.7;
}

.message-image img {
  max-width: 200px;
  border-radius: 8px;
}

.message-file .file-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: inherit;
  text-decoration: none;
}

.typing-indicator {
  padding: 8px 16px;
  background: white;
  border-radius: 18px;
  align-self: flex-start;
  font-size: 12px;
  color: #868e96;
}

.chat-input-area {
  padding: 20px;
  border-top: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
}

.input-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  color: #adb5bd;
}

.action-btn:hover {
  background: #f1f3f5;
  color: #D2B48C;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e9ecef;
  border-radius: 25px;
  outline: none;
  font-size: 14px;
  transition: border 0.2s;
}

.message-input:focus {
  border-color: #D2B48C;
}

.send-btn {
  background: #D2B48C;
  border: none;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: white;
}

.send-btn:hover {
  background: #3E2C1F;
  transform: scale(1.05);
}

.hidden {
  display: none;
}

.no-conversation {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #adb5bd;
  background: white;
}

.start-chat-btn-primary {
  padding: 12px 24px;
  background: #D2B48C;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
}

.start-chat-btn-primary:hover {
  background: #3E2C1F;
  transform: scale(1.05);
}

.loading-conv, .loading-messages {
  padding: 40px;
  text-align: center;
  color: #adb5bd;
}

.no-messages {
  text-align: center;
  padding: 40px;
  color: #adb5bd;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #3E2C1F;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #adb5bd;
}

.search-bar {
  padding: 16px 20px;
  border-bottom: 1px solid #e9ecef;
}

.search-input {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #e9ecef;
  border-radius: 25px;
  outline: none;
  font-size: 14px;
}

.users-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: background 0.2s;
}

.user-item:hover {
  background: #f8f9fa;
}

.user-item .avatar {
  width: 45px;
  height: 45px;
  font-size: 16px;
  margin-right: 12px;
}

.user-info .name {
  font-weight: 600;
  margin-bottom: 2px;
}

.user-info .email, .user-info .role {
  font-size: 12px;
  color: #adb5bd;
}

.searching {
  padding: 40px;
  text-align: center;
  color: #adb5bd;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #e9ecef;
  border-top-color: #D2B48C;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.no-results {
  padding: 40px;
  text-align: center;
  color: #adb5bd;
}

.messages-area::-webkit-scrollbar,
.conversations-list::-webkit-scrollbar,
.users-list::-webkit-scrollbar {
  width: 5px;
}

.messages-area::-webkit-scrollbar-track,
.conversations-list::-webkit-scrollbar-track,
.users-list::-webkit-scrollbar-track {
  background: #f1f3f5;
}

.messages-area::-webkit-scrollbar-thumb,
.conversations-list::-webkit-scrollbar-thumb,
.users-list::-webkit-scrollbar-thumb {
  background: #D2B48C;
  border-radius: 5px;
}

@media (max-width: 640px) {
  .chat-main {
    width: 100%;
  }
  
  .message {
    max-width: 85%;
  }
  
  .sidebar-header h3 {
    font-size: 16px;
  }
  
  .avatar {
    width: 40px;
    height: 40px;
    font-size: 14px;
  }
  
  .name {
    font-size: 14px;
  }
  
  .last-message {
    font-size: 11px;
  }
}
</style>