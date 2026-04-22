<template>
  <footer class="relative bg-gradient-to-b from-coffee-800 to-coffee-900 text-white mt-auto overflow-hidden">
    <!-- Éléments décoratifs animés -->
    <div class="absolute inset-0 opacity-20 pointer-events-none">
      <div class="absolute -top-32 -left-32 w-96 h-96 bg-coffee-300 rounded-full filter blur-[120px] animate-pulse-slow"></div>
      <div class="absolute bottom-0 right-0 w-80 h-80 bg-coffee-400 rounded-full filter blur-[100px] animate-pulse-slow" style="animation-delay: 2s;"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-coffee-500 rounded-full filter blur-[150px] opacity-30"></div>
    </div>

    <!-- Vague décorative supérieure -->
    <div class="absolute top-0 left-0 w-full overflow-hidden leading-0 rotate-180">
      <svg class="relative block w-full h-10" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          fill="#D2B48C" fill-opacity="0.08"></path>
      </svg>
    </div>

    <div class="relative max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
      
      <!-- Grille principale -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
        
        <!-- Colonne identité / marque (4/12) -->
        <div class="md:col-span-4 space-y-4">
          <div class="flex items-center space-x-3">
            <div class="bg-gradient-to-br from-coffee-600 to-coffee-700 rounded-2xl p-2.5 shadow-lg ring-1 ring-white/20">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-bold tracking-tight text-white">
                Cabinet<span class="text-coffee-300">'Psy</span>
              </h2>
              <p class="text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase">Espace professionnel</p>
            </div>
          </div>
          <p class="text-white/60 text-sm leading-relaxed">
            Accompagnement psychologique bienveillant pour enfants, adolescents et familles. 
            Écoute, partage et outils adaptés.
          </p>
          <div class="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10">
            <svg class="w-3 h-3 text-coffee-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span class="text-[11px] font-medium text-white/70">Membre FFPP</span>
          </div>
        </div>

        <!-- Colonne Navigation (3/12) -->
        <div class="md:col-span-3">
          <h3 class="text-white font-bold text-base mb-5 relative inline-block">
            Navigation
            <div class="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-coffee-400 to-transparent rounded-full"></div>
          </h3>
          <ul class="space-y-3">
            <li v-for="link in navLinks" :key="link.name">
              <router-link 
                :to="link.path"
                class="text-white/50 hover:text-white transition-all duration-300 text-sm flex items-center gap-3 group"
              >
                <span class="w-5 h-5 flex items-center justify-center rounded-lg bg-white/5 group-hover:bg-white/10 transition-all">
                  <component :is="link.icon" class="w-3 h-3 text-coffee-400 group-hover:scale-110 transition-transform" />
                </span>
                <span class="group-hover:translate-x-1 transition-transform">{{ link.name }}</span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Colonne Accès (Mon profil / Déconnexion) -->
        <div class="md:col-span-2">
          <h3 class="text-white font-bold text-base mb-5 relative inline-block">
            Accès
            <div class="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-coffee-400 to-transparent rounded-full"></div>
          </h3>
          <ul class="space-y-3">
            <li>
              <router-link 
                to="/profilpsy"
                class="text-white/50 hover:text-white transition-all duration-300 text-sm flex items-center gap-3 group"
              >
                <svg class="w-4 h-4 text-coffee-400 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Mon profil</span>
              </router-link>
            </li>
            <li>
              <button 
                @click="openLogoutModal"
                class="text-white/50 hover:text-white transition-all duration-300 text-sm flex items-center gap-3 group w-full"
              >
                <svg class="w-4 h-4 text-coffee-400 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Déconnexion</span>
              </button>
            </li>
          </ul>
        </div>

        <!-- Colonne Contact (3/12) -->
        <div class="md:col-span-3">
          <h3 class="text-white font-bold text-base mb-5 relative inline-block">
            Contact
            <div class="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-coffee-400 to-transparent rounded-full"></div>
          </h3>
          <ul class="space-y-4">
            <li>
              <a 
                href="mailto:luciarasoanirina8@gmail.com"
                class="text-white/50 hover:text-white transition-colors duration-300 text-sm flex items-center gap-3 group"
              >
                <svg class="w-4 h-4 text-coffee-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>luciarasoanirina8@gmail.com</span>
              </a>
            </li>
            <li class="flex items-center gap-3 text-white/50 text-sm">
              <svg class="w-4 h-4 text-coffee-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+261 38 39 702 36</span>
            </li>
            <li class="flex items-start gap-3 text-white/50 text-sm">
              <svg class="w-4 h-4 text-coffee-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Madagascar</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Copyright et liens légaux -->
      <div class="border-t border-white/10 pt-6 mt-2">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-white/40 text-xs">
            &copy; 2025 Cabinet'Psy – Tous droits réservés.
          </p>
          <div class="flex space-x-6">
            <router-link to="/mentions" class="text-white/30 hover:text-white/60 transition-colors text-xs">Mentions légales</router-link>
            <router-link to="/confidentialite" class="text-white/30 hover:text-white/60 transition-colors text-xs">Confidentialité</router-link>
            <router-link to="/cookies" class="text-white/30 hover:text-white/60 transition-colors text-xs">Cookies</router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Vague décorative inférieure -->
    <div class="absolute bottom-0 left-0 w-full overflow-hidden leading-0">
      <svg class="relative block w-full h-6" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
          fill="#D2B48C" fill-opacity="0.05"></path>
      </svg>
    </div>

    <!-- MODALE DE CONFIRMATION DÉCONNEXION (harmonisée coffee) -->
    <transition name="fade">
      <div v-if="showLogoutConfirm" class="fixed inset-0 flex items-center justify-center z-[100] px-4">
        <div class="absolute inset-0 bg-coffee-900/60 backdrop-blur-md" @click="closeLogoutModal"></div>
        <div class="bg-coffee-800 rounded-[3rem] p-10 max-w-sm w-full relative shadow-2xl text-center border border-coffee-600">
          <div class="mx-auto w-20 h-20 rounded-full bg-coffee-700/50 flex items-center justify-center mb-8 border-4 border-coffee-600 shadow-md">
            <svg class="w-10 h-10 text-coffee-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
          <h3 class="text-3xl font-extralight text-white mb-4">À demain ?</h3>
          <p class="text-white/60 text-sm leading-relaxed mb-10 italic">"Chaque accompagnement compte dans le parcours de nos familles."</p>
          <div class="flex flex-col space-y-4">
            <button @click="confirmLogout" class="w-full py-4 rounded-2xl bg-coffee-600 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-coffee-500 transition-all shadow-lg active:scale-95">Terminer la session</button>
            <button @click="closeLogoutModal" class="group flex items-center justify-center w-full py-2 text-white/50 text-[10px] font-bold uppercase tracking-widest transition-all">
              <span class="mr-2 transition-transform duration-300 group-hover:-translate-x-2">←</span>
              <span class="group-hover:text-coffee-300 transition-colors">Rester connecté</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </footer>
</template>

<script setup>
import { h, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// État pour la modale de déconnexion
const showLogoutConfirm = ref(false)

const openLogoutModal = () => {
  showLogoutConfirm.value = true
}

const closeLogoutModal = () => {
  showLogoutConfirm.value = false
}

const confirmLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/connexion')
}

// Icônes pour les liens de navigation
const homeIcon = h('svg', { class: 'w-3.5 h-3.5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.5', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' })
])

const publicationsIcon = h('svg', { class: 'w-3.5 h-3.5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.5', d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' })
])

const ressourcesIcon = h('svg', { class: 'w-3.5 h-3.5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.5', d: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' })
])

const discussionsIcon = h('svg', { class: 'w-3.5 h-3.5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.5', d: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' })
])

const navLinks = [
  { name: 'Actu', path: '/homepsy', icon: homeIcon },
  { name: 'Mes publications', path: '/psypub', icon: publicationsIcon },
  { name: 'Ressources', path: '/ressourcespsy', icon: ressourcesIcon },
  { name: 'Mes discussions', path: '/discussionspsy', icon: discussionsIcon }
]
</script>

<style scoped>
@keyframes pulse-slow {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.05); }
}
.animate-pulse-slow {
  animation: pulse-slow 6s ease-in-out infinite;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 767px) {
  .footer-grid > div:not(:first-child) {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 1.5rem;
    margin-top: 0.5rem;
  }
}
</style>