<template>
  <header 
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-700"
    :class="scrolled ? 'py-2 shadow-coffee' : 'py-4'"
  >
    <!-- Fond dynamique -->
    <div 
      class="absolute inset-0 transition-all duration-700" 
      :class="scrolled ? 'bg-cream/95 backdrop-blur-xl shadow-[0_10px_40px_-15px_rgba(92,64,51,0.12)] border-b border-coffee-100/40' : 'bg-gradient-to-r from-cream/80 via-cream/60 to-cream/80 backdrop-blur-sm'"
    ></div>
    
    <!-- Bulles décoratives café au lait -->
    <div class="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
      <div class="absolute -top-20 -left-20 w-96 h-96 bg-coffee-200/40 rounded-full filter blur-[100px] animate-blob"></div>
      <div class="absolute -top-20 -right-20 w-96 h-96 bg-coffee-100/40 rounded-full filter blur-[100px] animate-blob animation-delay-2000"></div>
      <div class="absolute bottom-0 left-1/3 w-80 h-80 bg-coffee-300/20 rounded-full filter blur-[80px] animate-blob animation-delay-4000"></div>
    </div>
    
    <div class="relative max-w-7xl mx-auto px-6 lg:px-8">
      <div class="flex items-center justify-between">
        
        <!-- Logo Signature Café au Lait -->
        <router-link to="/" class="flex items-center space-x-3 group">
          <div class="relative">
            <div class="absolute inset-0 rounded-2xl bg-coffee-300/30 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 scale-150"></div>
            <div class="relative bg-gradient-to-br from-coffee-600 to-coffee-500 rounded-2xl p-2.5 shadow-xl group-hover:shadow-coffee-300/40 group-hover:-translate-y-1 transition-all duration-500">
              <svg class="w-7 h-7 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <div class="hidden sm:block">
            <h1 class="text-2xl font-bold tracking-tight text-coffee-800 group-hover:text-coffee-600 transition-colors duration-300">
              Parent<span class="text-coffee-500">'</span>Lien
            </h1>
            <p class="text-[10px] font-bold text-coffee-400/80 tracking-[0.3em] uppercase">L'art de grandir</p>
          </div>
        </router-link>
        
<!-- Navigation Desktop - STYLE MÉLANGÉ MODÉRÉ -->
<nav class="hidden md:flex items-center space-x-2 bg-cream/50 p-1.5 rounded-full border border-coffee-100/40 backdrop-blur-sm">
  <router-link 
    v-for="item in navItems" 
    :key="item.name"
    :to="item.path"
    class="relative px-5 py-2 text-sm font-semibold transition-all duration-300 rounded-full group/nav"
    :class="$route.path === item.path ? 'text-coffee-700 bg-white/50 shadow-sm' : 'text-coffee-500 hover:text-coffee-700 hover:bg-white/30'"
  >
    <span class="relative z-10 flex items-center space-x-2">
      <!-- Icône + texte -->
      <svg class="w-4 h-4 flex-shrink-0 transition-transform duration-300 group-hover/nav:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" :d="item.icon" />
      </svg>
      {{ item.name }}
    </span>

    <!-- ÉTOILE + LIGNE alignée et élégante -->
    <div 
      class="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center transition-all duration-500"
      :class="$route.path === item.path ? 'opacity-100 translate-y-0 scale-105' : 'opacity-0 translate-y-1 group-hover/nav:opacity-100 group-hover/nav:translate-y-0'"
    >
      <svg class="w-3 h-3 text-coffee-400 fill-current animate-spin-slow flex-shrink-0" viewBox="0 0 24 24">
        <path d="M12 .587l3.668 7.431 8.332 1.21-6.042 5.89 1.425 8.302L12 18.897l-7.383 3.883 1.425-8.302-6.042-5.89 8.332-1.21z"/>
      </svg>
      <div class="h-[1.5px] w-12 bg-gradient-to-r from-coffee-400 to-transparent rounded-full ml-1"></div>
    </div>
  </router-link>
</nav>

        <!-- Bouton Connexion Chic -->
        <div class="hidden md:block">
          <router-link 
            to="/connexion"
            class="group relative px-8 py-2.5 rounded-full overflow-hidden transition-all duration-500 transform hover:-translate-y-0.5 inline-block shadow-md hover:shadow-coffee-200/30"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-coffee-600 via-coffee-700 to-coffee-600 bg-[length:200%_100%] animate-gradient opacity-100 group-hover:opacity-95 transition-opacity duration-500"></div>
            
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            
            <span class="relative text-cream font-bold flex items-center space-x-2 text-sm tracking-wide">
              <svg class="w-4 h-4 transition-transform duration-500 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Connexion</span>
            </span>
          </router-link>
        </div>

        <!-- Bouton Menu Mobile Élégant -->
        <button 
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden w-12 h-12 rounded-2xl bg-cream text-coffee-600 flex items-center justify-center shadow-sm hover:shadow-md hover:bg-coffee-50 transition-all duration-300 active:scale-95"
        >
          <div class="w-4 flex flex-col space-y-1">
            <span class="block h-0.5 bg-coffee-600 rounded-full transition-all" :class="mobileMenuOpen ? 'rotate-45 translate-y-1.5' : 'w-4'"></span>
            <span class="block h-0.5 bg-coffee-600 rounded-full transition-all" :class="mobileMenuOpen ? 'opacity-0' : 'w-2'"></span>
            <span class="block h-0.5 bg-coffee-600 rounded-full transition-all" :class="mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : 'w-3'"></span>
          </div>
        </button>
      </div>
    </div>

    <!-- Menu Mobile - LONGUEURS DIFFÉRENTES + HOVER PLUS STYLÉ -->
<Transition name="menu-slide">
  <div v-show="mobileMenuOpen" class="md:hidden absolute top-full left-4 right-4 mt-4 bg-cream/98 backdrop-blur-xl rounded-3xl shadow-2xl border border-coffee-100/60 p-5 space-y-3 overflow-hidden">
    <!-- Ligne décorative supérieure -->
    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-coffee-400 to-transparent"></div>
    
    <!-- Étoile décorative flottante -->
    <div class="absolute -top-4 -right-4 w-20 h-20 text-coffee-200/30 animate-spin-slow">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .587l3.668 7.431 8.332 1.21-6.042 5.89 1.425 8.302L12 18.897l-7.383 3.883 1.425-8.302-6.042-5.89 8.332-1.21z"/>
      </svg>
    </div>
    
    <router-link 
      v-for="item in navItems" 
      :key="item.name"
      :to="item.path"
      @click="mobileMenuOpen = false"
      class="flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden"
      :class="$route.path === item.path ? 'bg-gradient-to-r from-coffee-50 to-coffee-100/50 shadow-sm' : 'hover:bg-gradient-to-r hover:from-coffee-50/60 hover:to-white/40 hover:shadow-md hover:scale-[1.02] hover:rotate-[0.5deg]'"
    >
      <!-- Effet brillant au hover -->
      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      
      <div class="flex items-center space-x-3 relative z-10">
        <!-- Icône avec hover amélioré -->
        <div class="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:shadow-coffee-200/50 group-hover:rotate-6deg transition-all duration-400">
          <svg class="w-4 h-4 text-coffee-500 group-hover:text-coffee-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" :d="item.icon" />
          </svg>
        </div>
        <span class="font-bold text-coffee-700 group-hover:text-coffee-800 tracking-wide">{{ item.name }}</span>
      </div>
      
      <!-- Étoile active ET hover améliorée -->
      <div class="relative flex items-center space-x-1">
        <svg 
          :class="[
            'w-5 h-5 fill-current transition-all duration-400',
            $route.path === item.path 
              ? 'text-coffee-400 bg-coffee-300/50 backdrop-blur-sm rounded-full p-1 shadow-lg animate-star-pulse scale-110' 
              : 'text-coffee-300/70 group-hover:text-coffee-400 group-hover:scale-125 group-hover:rotate-12deg'
          ]" 
          viewBox="0 0 24 24"
        >
          <path d="M12 .587l3.668 7.431 8.332 1.21-6.042 5.89 1.425 8.302L12 18.897l-7.383 3.883 1.425-8.302-6.042-5.89 8.332-1.21z"/>
        </svg>
        <!-- Ligne active ET hover -->
        <div 
          :class="[
            'h-[2px] rounded-full transition-all duration-500',
            $route.path === item.path 
              ? 'w-8 bg-gradient-to-r from-coffee-300 via-coffee-400 to-coffee-300 absolute -bottom-2 left-1/2 -translate-x-1/2 animate-pulse-line scale-100'
              : 'w-0 bg-gradient-to-r from-transparent via-coffee-300 to-transparent group-hover:w-6 group-hover:scale-x-100'
          ]"
        ></div>
      </div>
    </router-link>
    
    <div class="pt-3 mt-2 border-t border-coffee-100">
      <router-link 
        to="/connexion" 
        class="group relative flex items-center justify-center w-full py-3.5 rounded-2xl overflow-hidden shadow-md hover:shadow-coffee-200/30 transition-all duration-300"
        @click="mobileMenuOpen = false"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-coffee-600 to-coffee-700 group-hover:from-coffee-700 group-hover:to-coffee-800 transition-colors duration-300"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        <span class="relative text-white font-bold flex items-center space-x-2">
          <svg class="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Connexion</span>
        </span>
      </router-link>
    </div>
  </div>
</Transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const scrolled = ref(false)
const mobileMenuOpen = ref(false)

const navItems = [
  { 
    name: 'Découvrir', 
    path: '/', 
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' 
  },
  { 
    name: 'Ateliers', 
    path: '/evenements', 
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' 
  },
  { 
    name: 'À propos', 
    path: '/apropos', 
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' 
  }
]

const activeStar = computed(() => {
  return navItems.some(item => item.path === route.path)
})

const setActiveLink = () => {
  mobileMenuOpen.value = false
}

const handleScroll = () => { 
  scrolled.value = window.scrollY > 20 
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* Couleurs personnalisées café au lait */
:root {
  --coffee-50: #FAF6F2;
  --coffee-100: #F0E6DD;
  --coffee-200: #E0D0C2;
  --coffee-300: #C9B5A4;
  --coffee-400: #B0987F;
  --coffee-500: #967A5E;
  --coffee-600: #7A5C43;
  --coffee-700: #5E4532;
  --coffee-800: #422F22;
  --coffee-900: #634229;
  --cream: #FEF9F2;
}

/* Animations */
@keyframes gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.animate-gradient {
  background-size: 200% 100%;
  animation: gradient 3s ease infinite;
}

@keyframes shine {
  0% { transform: translateX(-150%) skewX(-20deg); }
  100% { transform: translateX(150%) skewX(-20deg); }
}

.animate-shine {
  animation: shine 1.2s ease-out infinite;
}

@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

.animate-blob {
  animation: blob 7s infinite alternate;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}

@keyframes star-pulse {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.2); opacity: 1; }
}

.animate-star-pulse {
  animation: star-pulse 2s ease-in-out infinite;
}

@keyframes pulse-line {
  0%, 100% { opacity: 0.4; width: 20px; }
  50% { opacity: 1; width: 32px; }
}

.animate-pulse-line {
  animation: pulse-line 2s ease-in-out infinite;
}

@keyframes star-appear {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate-star-appear {
  animation: star-appear 0.5s ease-out;
}

@keyframes star-hover {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-3px) scale(1.1); }
}

.animate-star-hover {
  animation: star-hover 3s ease-in-out infinite;
}

/* Transition Menu Mobile */
.menu-slide-enter-active,
.menu-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.menu-slide-enter-from,
.menu-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

/* Ombres personnalisées */
.shadow-coffee {
  box-shadow: 0 4px 20px -8px rgba(90, 60, 45, 0.08);
}

/* Classes utilitaires */
.bg-cream {
  background-color: #FEF9F2;
}

.text-cream {
  color: #FEF9F2;
}
</style>