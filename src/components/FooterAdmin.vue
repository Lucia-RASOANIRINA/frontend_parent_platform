<template>
  <footer class="relative bg-gradient-to-b from-coffee-800 to-coffee-900 text-white mt-auto">
    <div class="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-coffee-300/30 rounded-full filter blur-[100px]"></div>
      <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-coffee-200/20 rounded-full filter blur-[100px]"></div>
    </div>

    <div class="absolute top-0 left-0 w-full overflow-hidden leading-0 rotate-180">
      <svg class="relative block w-full h-8" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="#FEF9F2" fill-opacity="0.1"></path>
      </svg>
    </div>

    <div class="relative max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8 footer-grid">
        <div class="md:col-span-5 space-y-4">
          <div class="flex items-center space-x-3">
            <div class="bg-gradient-to-br from-coffee-500 to-coffee-600 rounded-2xl p-2.5 shadow-lg">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold tracking-tight text-white">Parentia<span class="text-coffee-300">·</span>Admin</h2>
              <p class="text-[9px] font-bold text-white/50 tracking-[0.3em] uppercase">Espace d'administration</p>
            </div>
          </div>
          <p class="text-white/70 text-sm leading-relaxed">
            Pilotez la communauté Parentia : utilisateurs, évènements, ressources et modération du contenu, au même endroit.
          </p>
        </div>

        <div class="md:col-span-4">
          <h3 class="text-white font-bold text-lg mb-4 relative inline-block">
            Administration
            <div class="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-coffee-400 to-transparent"></div>
          </h3>
          <ul class="space-y-2.5">
            <li v-for="link in navLinks" :key="link.name">
              <router-link :to="link.path"
                class="text-white/60 hover:text-white transition-all duration-300 text-sm flex items-center space-x-2 group">
                <span class="w-1.5 h-1.5 rounded-full bg-coffee-400 group-hover:scale-125 transition-transform"></span>
                <span>{{ link.name }}</span>
              </router-link>
            </li>
          </ul>
        </div>

        <div class="md:col-span-3">
          <h3 class="text-white font-bold text-lg mb-4 relative inline-block">
            Contact
            <div class="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-coffee-400 to-transparent"></div>
          </h3>
          <ul class="space-y-3">
            <li>
              <a href="mailto:luciarasoanirina8@gmail.com"
                 class="text-white/60 hover:text-white transition-colors duration-300 text-sm flex items-center space-x-3">
                <svg class="w-4 h-4 text-coffee-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>luciarasoanirina8@gmail.com</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-white/20 pt-6">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p class="text-white/40 text-xs">&copy; 2026 Parentia. Tous droits réservés.</p>
          <div class="flex space-x-6">
            <router-link to="/mentions" class="text-white/40 hover:text-white/60 transition-colors duration-300 text-xs">Mentions légales</router-link>
            <router-link to="/confidentialite" class="text-white/40 hover:text-white/60 transition-colors duration-300 text-xs">Confidentialité</router-link>
            <router-link to="/cookies" class="text-white/40 hover:text-white/60 transition-colors duration-300 text-xs">Cookies</router-link>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const navLinks = [
  { name: 'Tableau de bord', path: '/admin' },
  { name: 'Utilisateurs', path: '/admin/utilisateurs' },
  { name: 'Évènements', path: '/admin/evenements' },
  { name: 'Modération du contenu', path: '/admin/contenu' },
]
</script>

<style scoped>
@media (max-width: 767px) {
  .footer-grid > div:not(:first-child) {
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    padding-top: 2rem;
    margin-top: 0.5rem;
  }
}
</style>
