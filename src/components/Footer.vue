<template>
  <footer class="relative bg-gradient-to-b from-coffee-800 to-coffee-900 text-white mt-auto">
    <!-- Éléments décoratifs -->
    <div class="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-coffee-300/30 rounded-full filter blur-[100px]"></div>
      <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-coffee-200/20 rounded-full filter blur-[100px]"></div>
    </div>

    <!-- Vague décorative en haut -->
    <div class="absolute top-0 left-0 w-full overflow-hidden leading-0 rotate-180">
      <svg class="relative block w-full h-8" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
              fill="#FEF9F2" fill-opacity="0.1"></path>
      </svg>
    </div>

    <div class="relative max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <!-- Grille personnalisée : 12 colonnes sur desktop -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8 footer-grid">
        
        <!-- Colonne Parent'Lien : plus large (5/12) -->
        <div class="md:col-span-5 space-y-4">
          <div class="flex items-center space-x-3">
            <div class="bg-gradient-to-br from-coffee-500 to-coffee-600 rounded-2xl p-2.5 shadow-lg">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold tracking-tight text-white">Parent<span class="text-coffee-300">'</span>Lien</h2>
              <p class="text-[9px] font-bold text-white/50 tracking-[0.3em] uppercase">L'art de grandir</p>
            </div>
          </div>
          <p class="text-white/70 text-sm leading-relaxed">
            Une plateforme dédiée à l'épanouissement des enfants, créant des liens précieux entre parents, éducateurs et psychologues.
          </p>
        </div>

        <!-- Colonne Navigation : étroite (2/12) -->
        <div class="md:col-span-2">
          <h3 class="text-white font-bold text-lg mb-4 relative inline-block">
            Navigation
            <div class="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-coffee-400 to-transparent"></div>
          </h3>
          <ul class="space-y-2.5">
            <li v-for="link in navLinks" :key="link.name">
              <router-link 
                :to="link.path"
                class="text-white/60 hover:text-white transition-all duration-300 text-sm flex items-center space-x-2 group"
              >
                <component :is="link.icon" class="w-3 h-3 text-coffee-400 group-hover:translate-x-1 transition-transform" />
                <span>{{ link.name }}</span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Colonne Accès : étroite (2/12) -->
        <div class="md:col-span-2">
          <h3 class="text-white font-bold text-lg mb-4 relative inline-block">
            Accès
            <div class="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-coffee-400 to-transparent"></div>
          </h3>
          <ul class="space-y-2.5">
            <li>
              <router-link 
                to="/connexion?mode=login"
                class="text-white/60 hover:text-white transition-all duration-300 text-sm flex items-center space-x-2 group"
              >
                <svg class="w-3 h-3 text-coffee-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Se connecter</span>
              </router-link>
            </li>
            <li>
              <router-link 
                to="/connexion?mode=register"
                class="text-white/60 hover:text-white transition-all duration-300 text-sm flex items-center space-x-2 group"
              >
                <svg class="w-3 h-3 text-coffee-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span>Créer un compte</span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Colonne Contact : largeur moyenne (3/12) -->
        <div class="md:col-span-3">
          <h3 class="text-white font-bold text-lg mb-4 relative inline-block">
            Contact
            <div class="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-coffee-400 to-transparent"></div>
          </h3>
          <ul class="space-y-3">
            <li>
              <a 
                href="mailto:parentlien@gmail.com"
                class="text-white/60 hover:text-white transition-colors duration-300 text-sm flex items-center space-x-3"
              >
                <svg class="w-4 h-4 text-coffee-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>parentlien@gmail.com</span>
              </a>
            </li>
            <li class="flex items-center space-x-3 text-white/60 text-sm">
              <svg class="w-4 h-4 text-coffee-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>034 02 261 37</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Séparateur bas -->
      <div class="border-t border-white/20 pt-6">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p class="text-white/40 text-xs">
            &copy; 2024 Parent'Lien. Tous droits réservés.
          </p>
          <div class="flex space-x-6">
            <router-link to="/mentions" class="text-white/40 hover:text-white/60 transition-colors duration-300 text-xs">Mentions légales</router-link>
            <router-link to="/confidentialite" class="text-white/40 hover:text-white/60 transition-colors duration-300 text-xs">Confidentialité</router-link>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { h } from 'vue'

// Définition des icônes pour chaque lien de navigation
const homeIcon = h('svg', { 
  class: 'w-3 h-3 text-coffee-400 group-hover:translate-x-1 transition-transform', 
  fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' 
}, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' })
])

const eventsIcon = h('svg', { class: 'w-3 h-3 text-coffee-400 group-hover:translate-x-1 transition-transform', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' })
])

const aboutIcon = h('svg', { class: 'w-3 h-3 text-coffee-400 group-hover:translate-x-1 transition-transform', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
])

const navLinks = [
  { name: 'Découvrir', path: '/', icon: homeIcon },
  { name: 'Ateliers', path: '/evenements', icon: eventsIcon },
  { name: 'À propos', path: '/apropos', icon: aboutIcon }
]
</script>

<style scoped>
/* Lignes de séparation entre les sections sur mobile */
@media (max-width: 767px) {
  .footer-grid > div:not(:first-child) {
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    padding-top: 2rem;
    margin-top: 0.5rem;
  }
}
</style>