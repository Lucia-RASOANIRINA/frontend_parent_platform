<template>
  <header 
    class="fixed top-0 left-0 right-0 bg-white z-50 transition-all duration-500"
    :class="{ 'shadow-sm border-b border-[#EFE9E4]': isScrolled }"
  >
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
      <div class="flex justify-between items-center h-20">
        
        <router-link to="/homepsy" class="flex items-center space-x-3 group shrink-0">
          <div class="w-10 h-10 rounded-xl bg-[#C19A6B] flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:rotate-3">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
          <span class="text-2xl font-extralight text-[#3C2A21] tracking-tighter">
            Cabinet<span class="font-bold">'Psy</span>
          </span>
        </router-link>

        <div class="hidden xl:flex items-center gap-5 2xl:gap-7 min-w-0">
          <router-link 
            v-for="link in navLinks" 
            :key="link.path" 
            :to="link.path" 
            class="relative py-2 flex items-center gap-2 text-[#334155] transition-all duration-300 group shrink-0"
            v-slot="{ isActive }"
          >
            <span class="w-4 h-4 text-[#6F4E37] group-hover:text-[#C19A6B] transition-colors" v-html="link.icon"></span>
            
            <div class="flex items-center gap-1.5">
              <span class="text-[11px] font-black uppercase tracking-[0.08em] whitespace-nowrap group-hover:text-[#C19A6B] transition-colors">
                {{ link.name }}
              </span>
              <transition name="star-fade">
                <svg v-if="isActive" class="w-3.5 h-3.5 text-[#C19A6B]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                </svg>
              </transition>
            </div>

            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C19A6B] transition-all duration-300 group-hover:w-full"></span>
          </router-link>
        </div>

        <div class="flex items-center space-x-3 shrink-0">
          <NotificationsBell />
          <div class="relative menu-compte">
            <button @click="toggleMenu" :aria-expanded="menuOpen" :aria-label="t('entete.menuCompte')"
                    class="focus:outline-none group p-1 rounded-full hover:bg-[#FAF7F2] transition-all">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#6F4E37] to-[#D2B48C] flex items-center justify-center text-white font-bold text-base shadow-sm ring-2 ring-transparent group-hover:ring-[#FAF7F2]">
                {{ userInitial }}
              </div>
            </button>
            
            <transition name="pop-in">
              <div v-if="menuOpen" class="absolute right-0 mt-4 w-64 bg-white rounded-2xl shadow-xl border border-[#FAF7F2] py-2 z-50">
                <div class="px-5 py-3 border-b border-[#F1F5F9] mb-1">
                  <p class="text-sm font-semibold text-[#1E293B] truncate">Dr. {{ user.nom || 'Expert' }}</p>
                </div>
                
                <router-link to="/profilpsy" class="group flex items-center px-5 py-3 text-[#334155] hover:bg-[#FAF7F2] transition-colors">
                  <span class="w-8 h-8 rounded-lg bg-[#FAF7F2] flex items-center justify-center mr-3 group-hover:bg-white transition-colors shadow-sm">
                    <svg class="w-4 h-4 text-[#6F4E37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-width="1.5"></path></svg>
                  </span>
                  <span class="text-sm font-medium">{{ t('entete.monProfil') }}</span>
                </router-link>

                <button @click="openLogoutModal" class="group flex items-center w-full px-5 py-3 text-[#E11D48] hover:bg-[#FAF7F2] transition-colors">
                  <span class="w-8 h-8 rounded-lg bg-[#FAF7F2] flex items-center justify-center mr-3 group-hover:bg-white transition-colors shadow-sm">
                    <svg class="w-4 h-4 text-[#E11D48]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke-width="1.5"></path></svg>
                  </span>
                  <span class="text-sm font-medium">{{ t('entete.deconnexion') }}</span>
                </button>
              </div>
            </transition>
          </div>
          <LanguageSwitcher />


          <button @click="mobileMenuOpen = !mobileMenuOpen" class="xl:hidden text-[#1E293B] p-2 hover:bg-[#FAF7F2] rounded-full transition-colors relative z-50">
            <svg v-if="!mobileMenuOpen" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 8h16M4 16h16"></path></svg>
            <svg v-else class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      </div>

      <transition name="mobile-slide">
        <div v-if="mobileMenuOpen" class="xl:hidden absolute top-24 left-4 right-4 bg-white rounded-[2.5rem] shadow-2xl border border-[#FAF7F2] p-6 z-40">
          <div class="space-y-2">
            <router-link v-for="link in navLinks" :key="link.path" :to="link.path" @click="mobileMenuOpen = false"
              class="flex items-center justify-between px-6 py-4 text-[#334155] font-bold uppercase text-xs tracking-widest hover:bg-[#FAF7F2] rounded-2xl transition-all"
              v-slot="{ isActive }"
            >
              <div class="flex items-center gap-4">
                <span class="w-5 h-5 text-[#6F4E37]" v-html="link.icon"></span>
                {{ link.name }}
              </div>
              <svg v-if="isActive" class="w-4 h-4 text-[#C19A6B]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
              </svg>
            </router-link>
          </div>
        </div>
      </transition>
    </nav>

    <transition name="fade">
      <div v-if="showLogoutConfirm" class="fixed inset-0 flex items-center justify-center z-[100] px-4">
        <div class="absolute inset-0 bg-[#0F172A]/60 backdrop-blur-md" @click="closeLogoutModal"></div>
        <div class="bg-white rounded-[3rem] p-10 max-w-sm w-full relative shadow-2xl text-center border border-[#FAF7F2]">
          <div class="mx-auto w-20 h-20 rounded-full bg-[#FAF7F2] flex items-center justify-center mb-8 border-4 border-white shadow-md">
            <svg class="w-10 h-10 text-[#6F4E37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          </div>
          <h3 class="text-3xl font-extralight text-[#1E293B] mb-4">{{ t('entete.aDemain') }}</h3>
          <p class="text-[#64748B] text-sm leading-relaxed mb-10 italic">{{ t('entete.citationPsy') }}</p>
          <div class="flex flex-col space-y-4">
            <button @click="confirmLogout" class="w-full py-4 rounded-2xl bg-[#6F4E37] text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-[#3C2A21] transition-all shadow-lg active:scale-95">{{ t('entete.terminerSession') }}</button>
            <button @click="closeLogoutModal" class="group flex items-center justify-center w-full py-2 text-[#64748B] text-[10px] font-bold uppercase tracking-widest transition-all">
              <span class="mr-2 transition-transform duration-300 group-hover:-translate-x-2">←</span>
              <span class="group-hover:text-[#6F4E37] transition-colors">{{ t('entete.resterConnecte') }}</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { t } from '../i18n'
import NotificationsBell from './NotificationsBell.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const menuOpen = ref(false)
const mobileMenuOpen = ref(false)
const showLogoutConfirm = ref(false)
const isScrolled = ref(false)

const navLinks = computed(() => [
  { name: t('nav.actu'), path: '/homepsy', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v16m-6 0a2 2 0 002 2h2a2 2 0 002-2"></path></svg>' },
  { name: t('nav.mesPublications'), path: '/psypub', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>' },
  { name: t('nav.ressources'), path: '/ressourcespsy', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>' },
  { name: t('nav.evenements'), path: '/psy/evenements', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>' },
  { name: t('nav.conferences'), path: '/psy/conferences', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>' },
  { name: t('nav.discussions'), path: '/discussionspsy', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>' }
])

const user = JSON.parse(localStorage.getItem('user') || '{}')
const userInitial = computed(() => user.nom ? user.nom.charAt(0).toUpperCase() : 'P')

const toggleMenu = () => { menuOpen.value = !menuOpen.value }
const openLogoutModal = () => { showLogoutConfirm.value = true; menuOpen.value = false; }
const closeLogoutModal = () => { showLogoutConfirm.value = false }

const confirmLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('adminReal')
  router.push('/connexion')
}

const handleScroll = () => { isScrolled.value = window.scrollY > 20 }

// Le menu du compte se referme dès qu'on clique ailleurs dans la page
const fermerMenuCompte = (e) => {
  if (!e.target.closest?.('.menu-compte')) menuOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', fermerMenuCompte)
  window.addEventListener('scroll', handleScroll) })
onUnmounted(() => {
  document.removeEventListener('click', fermerMenuCompte)
  window.removeEventListener('scroll', handleScroll) })
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