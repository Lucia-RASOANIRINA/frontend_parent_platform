<template>
  <header 
    class="fixed top-0 left-0 right-0 bg-white z-50 transition-all duration-500"
    :class="{ 'shadow-sm border-b border-[#F5F5DC]': isScrolled }"
  >
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
      <div class="flex justify-between items-center h-20">
        
        <router-link to="/homeparent" class="flex items-center space-x-3 group">
          <div class="w-10 h-10 rounded-xl bg-[#6F4E37] flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:rotate-3">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
            </svg>
          </div>
          <span class="text-2xl font-extralight text-[#3C2A21] tracking-tighter">
            Parent<span class="font-semibold">'Lien</span>
          </span>
        </router-link>

        <div class="hidden md:flex items-center space-x-4 lg:space-x-8">
          <router-link 
            v-for="link in navLinks" 
            :key="link.path" 
            :to="link.path" 
            class="relative py-2 flex items-center gap-2 text-[#5D4037] transition-all duration-300 group"
            v-slot="{ isActive }"
          >
            <span class="w-4 h-4 text-[#C19A6B] group-hover:text-[#6F4E37] transition-colors" v-html="link.icon"></span>
            
            <div class="flex items-center gap-1.5">
              <span class="text-[12px] font-bold uppercase tracking-[0.1em] group-hover:text-[#6F4E37] transition-colors">
                {{ link.name }}
              </span>
              <transition name="star-fade">
                <svg v-if="isActive" class="w-3 h-3 text-[#6F4E37]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                </svg>
              </transition>
            </div>

            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-[#6F4E37] transition-all duration-300 group-hover:w-full"></span>
          </router-link>
        </div>

        <div class="flex items-center space-x-4">
          <div class="relative">
            <button @click="toggleMenu" class="focus:outline-none group p-1 rounded-full hover:bg-[#FAF7F2] transition-all">
              <div class="w-10 h-10 rounded-full bg-[#C19A6B] flex items-center justify-center text-white font-bold text-base shadow-sm ring-2 ring-transparent group-hover:ring-[#F5F5DC]">
                {{ userInitial }}
              </div>
            </button>
            
            <transition name="pop-in">
              <div v-if="menuOpen" class="absolute right-0 mt-4 w-60 bg-white rounded-2xl shadow-xl border border-[#F5F5DC] py-2 z-50">
                <div class="px-5 py-3 border-b border-[#F5F5DC] mb-1">
                  <p class="text-sm font-semibold text-[#3C2A21] truncate">{{ user.nom || 'Parent' }}</p>
                </div>
                
                <router-link to="/profile" class="group flex items-center px-5 py-3 text-[#5D4037] hover:bg-[#FAF7F2] transition-colors">
                  <span class="w-8 h-8 rounded-lg bg-[#FAF7F2] flex items-center justify-center mr-3 group-hover:bg-white transition-colors">
                    <svg class="w-4 h-4 text-[#C19A6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-width="1.5"></path></svg>
                  </span>
                  <span class="text-sm font-medium">Mon Profil</span>
                </router-link>

                <button @click="openLogoutModal" class="group flex items-center w-full px-5 py-3 text-[#A0522D] hover:bg-[#FFF5F5] transition-colors">
                  <span class="w-8 h-8 rounded-lg bg-[#FFF5F5] flex items-center justify-center mr-3 group-hover:bg-white transition-colors">
                    <svg class="w-4 h-4 text-[#A0522D]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke-width="1.5"></path></svg>
                  </span>
                  <span class="text-sm font-medium">Déconnexion</span>
                </button>
              </div>
            </transition>
          </div>

          <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden text-[#3C2A21] p-2 hover:bg-[#FAF7F2] rounded-full transition-colors relative z-50">
            <svg v-if="!mobileMenuOpen" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 8h16M4 16h16"></path></svg>
            <svg v-else class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      </div>

      <transition name="mobile-slide">
        <div v-if="mobileMenuOpen" class="md:hidden absolute top-24 left-4 right-4 bg-white rounded-[2.5rem] shadow-2xl border border-[#F5F5DC] p-6 z-40">
          <div class="space-y-2">
            <router-link v-for="link in navLinks" :key="link.path" :to="link.path" @click="mobileMenuOpen = false"
              class="flex items-center justify-between px-6 py-4 text-[#5D4037] font-bold uppercase text-xs tracking-widest hover:bg-[#FAF7F2] rounded-2xl transition-all"
              v-slot="{ isActive }"
            >
              <div class="flex items-center gap-4">
                <span class="w-5 h-5 text-[#C19A6B]" v-html="link.icon"></span>
                {{ link.name }}
              </div>
              <svg v-if="isActive" class="w-4 h-4 text-[#6F4E37]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
              </svg>
            </router-link>
          </div>
        </div>
      </transition>
    </nav>

    <transition name="fade">
      <div v-if="showLogoutConfirm" class="fixed inset-0 flex items-center justify-center z-[100] px-4">
        <div class="absolute inset-0 bg-[#3C2A21]/60 backdrop-blur-md" @click="closeLogoutModal"></div>
        <div class="bg-white rounded-[3rem] p-10 max-w-sm w-full relative shadow-2xl text-center border border-[#F5F5DC]">
          <div class="mx-auto w-20 h-20 rounded-full bg-[#FAF7F2] flex items-center justify-center mb-8 border-4 border-white shadow-md">
            <svg class="w-10 h-10 text-[#C19A6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 21l-8.228-9.96a5 5 0 117.75-6.6l.478.572.478-.572a5 5 0 117.75 6.6L12 21z" stroke-width="1"></path></svg>
          </div>
          <h3 class="text-3xl font-extralight text-[#3C2A21] mb-4">À très vite !</h3>
          <p class="text-[#6F4E37] text-sm leading-relaxed mb-10 italic">"Le bien-être des enfants commence par le soutien mutuel des parents."</p>
          
          <div class="flex flex-col space-y-4">
            <button @click="confirmLogout" class="w-full py-4 rounded-2xl bg-[#6F4E37] text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-[#3C2A21] hover:scale-[1.02] transition-all shadow-lg active:scale-95">
              Confirmer la pause
            </button>
            
            <button @click="closeLogoutModal" class="group flex items-center justify-center w-full py-2 text-[#A67B5B] text-[10px] font-bold uppercase tracking-widest transition-all">
              <span class="mr-2 transition-transform duration-300 group-hover:-translate-x-2">←</span>
              <span class="group-hover:text-[#6F4E37] transition-colors">Revenir au partage</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const menuOpen = ref(false)
const mobileMenuOpen = ref(false)
const showLogoutConfirm = ref(false)
const isScrolled = ref(false)

const navLinks = [
  { name: 'Actu', path: '/homeparent', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2zM7 8h4m-4 4h8m-8 4h8"></path></svg>' },
  { name: 'Mes pub', path: '/parentpub', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>' },
  { name: 'Ressources', path: '/parent/ressources', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>' },
  { name: 'Événements', path: '/parent/evenements', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>' },
  { name: 'Discussions', path: '/parent/discussions', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>' }
]

const user = JSON.parse(localStorage.getItem('user') || '{}')
const userInitial = computed(() => user.nom ? user.nom.charAt(0).toUpperCase() : 'P')

const toggleMenu = () => { menuOpen.value = !menuOpen.value }
const openLogoutModal = () => { showLogoutConfirm.value = true; menuOpen.value = false; mobileMenuOpen.value = false; }
const closeLogoutModal = () => { showLogoutConfirm.value = false }

const confirmLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/connexion')
}

const handleScroll = () => { isScrolled.value = window.scrollY > 20 }

onMounted(() => { window.addEventListener('scroll', handleScroll) })
onUnmounted(() => { window.removeEventListener('scroll', handleScroll) })
</script>

<style scoped>
.star-fade-enter-active { transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.star-fade-enter-from { opacity: 0; transform: scale(0.3) rotate(-180deg); }

.pop-in-enter-active, .pop-in-leave-active { transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.pop-in-enter-from, .pop-in-leave-to { opacity: 0; transform: scale(0.9) translateY(-10px); }

.mobile-slide-enter-active, .mobile-slide-leave-active { transition: all 0.4s ease; }
.mobile-slide-enter-from, .mobile-slide-leave-to { opacity: 0; transform: translateY(-10px); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
</style>