<template>
  <header 
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out"
    :class="[
      isScrolled 
        ? 'bg-[#1a0f0a]/95 backdrop-blur-xl py-2 shadow-[0_10px_40px_rgba(0,0,0,0.7)] border-b border-[#3d2b1f]' 
        : 'bg-[#241711] py-4'
    ]"
  >
    <nav class="max-w-[1600px] mx-auto px-6 lg:px-12">
      <div class="flex justify-between items-center h-20">
        
        <router-link to="/homeadmin" class="flex items-center space-x-4 group">
          <div class="relative">
            <div class="absolute -inset-2 bg-[#d4a373] rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <svg class="relative w-10 h-10 text-[#d4a373]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 4a4 4 0 100 8 4 4 0 000-8zM2 20a10 10 0 0120 0H2z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="text-3xl font-light text-white tracking-[0.2em] uppercase">
            Parentia<span class="font-black text-[#d4a373]">.</span>
          </span>
        </router-link>

        <div class="hidden xl:flex items-center space-x-2">
          <router-link 
            v-for="link in navLinks" 
            :key="link.path" 
            :to="link.path" 
            class="relative px-6 py-3 rounded-full transition-all duration-500 group overflow-hidden"
            v-slot="{ isActive }"
          >
            <div 
              class="absolute inset-0 bg-radial-gradient from-[#d4a373]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              :class="{ 'opacity-100 bg-[#d4a373]/10': isActive }"
            ></div>
            
            <div class="relative z-10 flex items-center gap-3">
              <span 
                class="text-[11px] font-bold uppercase tracking-[0.15em] transition-colors duration-300"
                :class="isActive ? 'text-[#d4a373]' : 'text-gray-400 group-hover:text-white'"
              >
                {{ link.name }}
              </span>

              <div v-if="isActive" class="relative">
                <svg class="w-4 h-4 text-[#d4a373] animate-sparkle" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z"/>
                </svg>
                <div class="absolute inset-0 bg-[#d4a373] blur-sm animate-pulse opacity-50"></div>
              </div>
            </div>

            <span 
              class="absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] bg-[#d4a373] transition-all duration-500"
              :class="isActive ? 'w-8 opacity-100' : 'w-0 opacity-0 group-hover:w-4 group-hover:opacity-50'"
            ></span>
          </router-link>
        </div>

        <div class="flex items-center space-x-6">
          <button @click="toggleMenu" class="flex items-center space-x-3 bg-[#1a0f0a] border border-[#3d2b1f] p-1.5 pr-4 rounded-full hover:border-[#d4a373]/50 transition-all group">
            <img 
              :src="user.avatar || 'https://ui-avatars.com/api/?name=Admin&background=d4a373&color=241711'" 
              class="w-10 h-10 rounded-full border-2 border-[#3d2b1f] group-hover:border-[#d4a373] transition-colors"
            />
            <div class="text-left hidden sm:block">
              <p class="text-[10px] text-[#d4a373] font-black uppercase tracking-tighter">Admin</p>
              <p class="text-xs text-white font-medium">{{ user.nom || 'Sophie R.' }}</p>
            </div>
            <svg class="w-4 h-4 text-gray-500 group-hover:text-[#d4a373] transition-transform" :class="{'rotate-180': menuOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <transition name="slide-up">
            <div v-if="menuOpen" class="absolute right-12 top-24 w-56 bg-[#241711] border border-[#3d2b1f] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] py-2 overflow-hidden z-[60]">
              <router-link to="/monprofil" class="flex items-center px-6 py-4 text-sm text-gray-300 hover:bg-[#d4a373] hover:text-[#1a0f0a] transition-all font-bold">
                Mon Profil
              </router-link>
              <button @click="openLogoutModal" class="w-full text-left px-6 py-4 text-sm text-red-400 hover:bg-red-500 hover:text-white transition-all font-bold">
                Déconnexion
              </button>
            </div>
          </transition>
        </div>
      </div>
    </nav>
  </header>

  <transition name="fade">
    <div v-if="showLogoutConfirm" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="closeLogoutModal"></div>
      <div class="relative bg-[#241711] border border-[#3d2b1f] rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl text-center">
        <div class="w-20 h-20 bg-[#d4a373]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#d4a373]/20">
          <svg class="w-10 h-10 text-[#d4a373]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-white mb-2">Quitter l'administration ?</h3>
        <p class="text-gray-400 text-sm mb-8 italic">Votre session sera fermée en toute sécurité.</p>
        <div class="flex flex-col gap-3">
          <button @click="confirmLogout" class="py-4 bg-[#d4a373] text-[#1a0f0a] rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#e6b485] transition-all">
            Confirmer
          </button>
          <button @click="closeLogoutModal" class="py-4 text-gray-500 text-xs font-bold uppercase hover:text-white transition-colors">
            Annuler
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const menuOpen = ref(false)
const showLogoutConfirm = ref(false)
const user = ref({ nom: 'Sophie R.', avatar: null })

const navLinks = [
  { name: 'Tableau de bord', path: '/homeadmin' },
  { name: 'Gestion Utilisateurs', path: '/gestionuser' },
  { name: 'Recommandations', path: '/recommandation' },
  { name: 'Événements', path: '/evenementsadmin' },
  { name: 'Discussions', path: '/discussionsadmin' }
]

const toggleMenu = () => menuOpen.value = !menuOpen.value
const openLogoutModal = () => { showLogoutConfirm.value = true; menuOpen.value = false; }
const closeLogoutModal = () => showLogoutConfirm.value = false
const confirmLogout = () => { console.log('Logout'); window.location.href = '/login'; }

const handleScroll = () => { isScrolled.value = window.scrollY > 20 }
onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
/* Dégradé Radial Personnalisé */
.bg-radial-gradient {
  background: radial-gradient(circle at center, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 70%);
}

/* Animation Sparkle (Étoile) */
@keyframes sparkle {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; filter: brightness(1.2); }
  50% { transform: scale(1.3) rotate(90deg); opacity: 0.8; filter: brightness(1.5); }
}
.animate-sparkle {
  animation: sparkle 2.5s infinite ease-in-out;
}

/* Transitions */
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>