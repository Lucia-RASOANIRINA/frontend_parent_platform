<template>
  <header
    class="fixed top-0 left-0 right-0 bg-white z-50 transition-all duration-500"
    :class="{ 'shadow-sm border-b border-slate-100': isScrolled }"
  >
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
      <div class="flex justify-between items-center h-20">

        <router-link to="/admin" class="flex items-center space-x-3 group">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B7355] to-[#6F4E37] flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:rotate-3">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span class="text-2xl font-extralight text-slate-800 tracking-tighter">
            Parentia<span class="font-bold text-[#6F4E37]">·Admin</span>
          </span>
        </router-link>

        <div class="hidden lg:flex items-center space-x-6">
          <router-link
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="relative py-2 flex items-center gap-2 text-slate-600 transition-all duration-300 group"
            v-slot="{ isActive }"
          >
            <span class="w-4 h-4 text-[#C19A6B] group-hover:text-[#6F4E37] transition-colors" v-html="link.icon"></span>
            <span class="text-[11px] font-black uppercase tracking-[0.15em] group-hover:text-[#6F4E37] transition-colors"
                  :class="{ 'text-[#6F4E37]': isActive }">
              {{ link.name }}
            </span>
            <span class="absolute bottom-0 left-0 h-0.5 bg-[#6F4E37] transition-all duration-300"
                  :class="isActive ? 'w-full' : 'w-0 group-hover:w-full'"></span>
          </router-link>
        </div>

        <div class="flex items-center space-x-4">
          <div class="relative">
            <button @click="menuOpen = !menuOpen" class="focus:outline-none group p-1 rounded-full hover:bg-slate-50 transition-all">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B7355] to-[#6F4E37] flex items-center justify-center text-white font-bold text-base shadow-sm ring-2 ring-transparent group-hover:ring-coffee-100">
                {{ userInitial }}
              </div>
            </button>
            <transition name="pop-in">
              <div v-if="menuOpen" class="absolute right-0 mt-4 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                <div class="px-5 py-3 border-b border-slate-100 mb-1">
                  <p class="text-sm font-semibold text-slate-800 truncate">{{ user.nom || 'Administrateur' }}</p>
                  <p class="text-xs text-slate-400 truncate">{{ user.email }}</p>
                </div>

                <p class="px-5 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Visiter le site en tant que</p>
                <button v-for="r in viewRoles" :key="r.role" @click="visitAs(r.role)"
                  class="group flex items-center w-full px-5 py-2.5 text-slate-600 hover:bg-slate-50 transition-colors">
                  <span class="w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-white text-xs font-bold" :style="{ background: r.color }">{{ r.short }}</span>
                  <span class="text-sm font-medium">{{ r.label }}</span>
                </button>
                <div class="border-t border-slate-100 my-1"></div>

                <button @click="confirmLogout" class="group flex items-center w-full px-5 py-3 text-coffee-600 hover:bg-coffee-50 transition-colors">
                  <span class="w-8 h-8 rounded-lg bg-coffee-50 flex items-center justify-center mr-3 group-hover:bg-white transition-colors shadow-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke-width="1.5"></path></svg>
                  </span>
                  <span class="text-sm font-medium">Déconnexion</span>
                </button>
              </div>
            </transition>
          </div>

          <button @click="mobileMenuOpen = !mobileMenuOpen" class="lg:hidden text-slate-800 p-2 hover:bg-slate-50 rounded-full transition-colors relative z-50">
            <svg v-if="!mobileMenuOpen" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            <svg v-else class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      </div>

      <transition name="mobile-slide">
        <div v-if="mobileMenuOpen" class="lg:hidden absolute top-24 left-4 right-4 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-6 z-40">
          <div class="space-y-2">
            <router-link v-for="link in navLinks" :key="link.path" :to="link.path" @click="mobileMenuOpen = false"
              class="flex items-center gap-4 px-6 py-4 text-slate-600 font-bold uppercase text-xs tracking-widest hover:bg-slate-50 rounded-2xl transition-all">
              <span class="w-5 h-5 text-[#C19A6B]" v-html="link.icon"></span>
              {{ link.name }}
            </router-link>
          </div>
        </div>
      </transition>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { notify } from '../services/notify'
import { viewAs } from '../services/impersonate'

const router = useRouter()

const viewRoles = [
  { role: 'PARENT', label: 'Parent', short: 'P', color: '#6F4E37' },
  { role: 'EDUCATEUR', label: 'Éducatrice', short: 'É', color: '#C19A6B' },
  { role: 'PSY', label: 'Psychologue', short: 'Ψ', color: '#8B7355' },
]
function visitAs(role) { menuOpen.value = false; viewAs(role) }
const menuOpen = ref(false)
const mobileMenuOpen = ref(false)
const isScrolled = ref(false)

const navLinks = [
  { name: 'Tableau de bord', path: '/admin', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>' },
  { name: 'Utilisateurs', path: '/admin/utilisateurs', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>' },
  { name: 'Événements', path: '/admin/evenements', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>' },
  { name: 'Contenu', path: '/admin/contenu', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>' }
]

const user = JSON.parse(localStorage.getItem('user') || '{}')
const userInitial = computed(() => user.nom ? user.nom.charAt(0).toUpperCase() : 'A')

const confirmLogout = () => {
  menuOpen.value = false
  notify.confirmLogout(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('adminReal')
    router.push('/connexion')
  }, 'ADMIN')
}

const handleScroll = () => { isScrolled.value = window.scrollY > 20 }
onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.pop-in-enter-active, .pop-in-leave-active { transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.pop-in-enter-from, .pop-in-leave-to { opacity: 0; transform: scale(0.9) translateY(-10px); }
.mobile-slide-enter-active, .mobile-slide-leave-active { transition: all 0.4s ease; }
.mobile-slide-enter-from, .mobile-slide-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
