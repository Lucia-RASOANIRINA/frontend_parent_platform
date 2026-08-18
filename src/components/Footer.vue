<template>
  <footer class="relative bg-gradient-to-b from-coffee-600 to-coffee-700 text-white mt-auto">
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
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8 footer-grid">

        <!-- Identité de l'espace -->
        <div class="md:col-span-5 space-y-4">
          <div class="flex items-center space-x-3">
            <div class="bg-gradient-to-br from-coffee-500 to-coffee-600 rounded-2xl p-2.5 shadow-lg">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold tracking-tight text-white">
                <span class="text-coffee-300">{{ espace.prefixe }}</span>{{ espace.nom }}
              </h2>
              <p class="text-[9px] font-bold text-white/70 tracking-[0.3em] uppercase">{{ espace.baseline }}</p>
            </div>
          </div>
          <p class="text-white/85 text-sm leading-relaxed">{{ espace.description }}</p>
        </div>

        <!-- Navigation propre à l'espace -->
        <div class="md:col-span-2">
          <h3 class="text-white font-bold text-lg mb-4 relative inline-block">
            {{ t('pied.navigation') }}
            <div class="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-coffee-400 to-transparent"></div>
          </h3>
          <ul class="space-y-2.5">
            <li v-for="lien in espace.liens" :key="lien.path">
              <router-link :to="lien.path" class="lien-pied">
                <svg class="fleche" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                <span>{{ lien.name }}</span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Accès : se connecter pour un visiteur, son compte pour un membre -->
        <div class="md:col-span-2">
          <h3 class="text-white font-bold text-lg mb-4 relative inline-block">
            {{ t('pied.acces') }}
            <div class="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-coffee-400 to-transparent"></div>
          </h3>
          <ul class="space-y-2.5">
            <template v-if="espace.code === 'default'">
              <li>
                <router-link to="/connexion?mode=login" class="lien-pied">
                  <svg class="fleche" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>{{ t('pied.seConnecter') }}</span>
                </router-link>
              </li>
              <li>
                <router-link to="/connexion?mode=register" class="lien-pied">
                  <svg class="fleche" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span>{{ t('pied.creerCompte') }}</span>
                </router-link>
              </li>
            </template>
            <template v-else>
              <li v-if="espace.profil">
                <router-link :to="espace.profil" class="lien-pied">
                  <svg class="fleche" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{{ t('entete.monProfil') }}</span>
                </router-link>
              </li>
              <li>
                <button type="button" class="lien-pied" @click="deconnexion">
                  <svg class="fleche" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>{{ t('entete.deconnexion') }}</span>
                </button>
              </li>
            </template>
          </ul>
        </div>

        <!-- Contact -->
        <div class="md:col-span-3">
          <h3 class="text-white font-bold text-lg mb-4 relative inline-block">
            {{ t('pied.contact') }}
            <div class="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-coffee-400 to-transparent"></div>
          </h3>
          <ul class="space-y-3">
            <li>
              <a :href="`mailto:${espace.email}`" class="text-white/80 hover:text-white transition-colors duration-300 text-sm flex items-center space-x-3">
                <svg class="w-4 h-4 text-coffee-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span class="truncate">{{ espace.email }}</span>
              </a>
            </li>
            <li class="flex items-center space-x-3 text-white/80 text-sm">
              <svg class="w-4 h-4 text-coffee-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{{ espace.telephone }}</span>
            </li>
            <li class="flex items-center space-x-3 text-white/80 text-sm">
              <svg class="w-4 h-4 text-coffee-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Madagascar</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Séparateur bas -->
      <div class="border-t border-white/20 pt-6">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p class="text-white/65 text-xs">
            &copy; 2026 {{ espace.prefixe }}{{ espace.nom }}. {{ t('pied.droits') }}
          </p>
          <div class="flex space-x-6">
            <router-link to="/mentions" class="text-white/65 hover:text-white/80 transition-colors duration-300 text-xs">{{ t('pied.mentions') }}</router-link>
            <router-link to="/confidentialite" class="text-white/65 hover:text-white/80 transition-colors duration-300 text-xs">{{ t('pied.confidentialite') }}</router-link>
            <router-link to="/cookies" class="text-white/65 hover:text-white/80 transition-colors duration-300 text-xs">{{ t('pied.cookies') }}</router-link>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { t } from '../i18n'
import { utilisateurCourant } from '../services'
import { notify } from '../services/notify'

/**
 * Pied de page unique pour toute la plateforme.
 *
 * Chaque espace avait auparavant son propre pied, avec ses couleurs et sa mise
 * en page : quatre composants à maintenir pour un même contenu. On garde le
 * dessin de l'espace visiteur et on ne fait plus varier que ce qui doit l'être :
 * le nom de l'espace, sa description, ses liens et son contact.
 */
const route = useRoute()
const router = useRouter()

const ESPACES = {
  default: {
    code: 'default',
    prefixe: "'", nom: 'Parentia',
    baselineCle: 'pied.tagline', descriptionCle: 'pied.description',
    email: 'parentlien@gmail.com', telephone: '034 02 261 37',
    liens: () => [
      { name: t('nav.decouvrir'), path: '/' },
      { name: t('nav.ateliers'), path: '/evenements' },
      { name: t('nav.conferences'), path: '/conferences' },
      { name: t('nav.apropos'), path: '/apropos' },
    ],
  },
  parent: {
    code: 'parent',
    prefixe: "'", nom: 'Parentia',
    baselineCle: 'pied.tagline', descriptionCle: 'pied.description',
    email: 'parentlien@gmail.com', telephone: '034 02 261 37',
    profil: '/parentprofil',
    liens: () => [
      { name: t('nav.actu'), path: '/homeparent' },
      { name: t('nav.mesPublications'), path: '/parentpub' },
      { name: t('nav.ressources'), path: '/ressourcesparent' },
      { name: t('nav.evenements'), path: '/parent/evenements' },
    ],
  },
  educatrice: {
    code: 'educatrice',
    prefixe: 'Atelier', nom: "'Éduc",
    baselineCle: 'pied.espaceEducateur', descriptionCle: 'pied.descriptionEduc',
    email: 'ateliereduc@example.com', telephone: '+261 38 39 702 36',
    profil: '/profilteacher',
    liens: () => [
      { name: t('nav.actu'), path: '/hometeacher' },
      { name: t('nav.mesPublications'), path: '/teacherpub' },
      { name: t('nav.ressources'), path: '/ressourcesteacher' },
      { name: t('nav.discussions'), path: '/discussionsteacher' },
    ],
  },
  psy: {
    code: 'psy',
    prefixe: 'Cabinet', nom: "'Psy",
    baselineCle: 'pied.espaceProfessionnel', descriptionCle: 'pied.descriptionPsy',
    email: 'luciarasoanirina8@gmail.com', telephone: '+261 38 39 702 36',
    profil: '/profilpsy',
    liens: () => [
      { name: t('nav.actu'), path: '/homepsy' },
      { name: t('nav.mesPublications'), path: '/psypub' },
      { name: t('nav.ressources'), path: '/ressourcespsy' },
      { name: t('nav.discussions'), path: '/discussionspsy' },
    ],
  },
  admin: {
    code: 'admin',
    prefixe: 'Parentia', nom: '·Admin',
    baselineCle: 'pied.espaceAdmin', descriptionCle: 'pied.descriptionAdmin',
    email: 'luciarasoanirina8@gmail.com', telephone: '+261 38 39 702 36',
    liens: () => [
      { name: t('nav.tableauBord'), path: '/admin' },
      { name: t('nav.utilisateurs'), path: '/admin/utilisateurs' },
      { name: t('nav.evenements'), path: '/admin/evenements' },
      { name: t('admin.moderationContenu'), path: '/admin/contenu' },
    ],
  },
}

const ROLE_VERS_ESPACE = { PARENT: 'parent', EDUCATEUR: 'educatrice', PSY: 'psy', ADMIN: 'admin' }

const espace = computed(() => {
  const demande = route.meta.layout || 'default'
  const cle = demande !== 'default'
    ? demande
    : ROLE_VERS_ESPACE[utilisateurCourant()?.role?.toUpperCase()] || 'default'
  const e = ESPACES[cle] || ESPACES.default
  return {
    ...e,
    baseline: t(e.baselineCle),
    description: t(e.descriptionCle),
    liens: e.liens(),
  }
})

function deconnexion() {
  notify.confirmLogout(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('adminReal')
    router.push('/connexion')
  }, utilisateurCourant()?.role || '')
}
</script>

<style scoped>
.lien-pied {
  display: flex; align-items: center; gap: .5rem;
  width: 100%; padding: 0; border: none; background: none; cursor: pointer;
  font-size: .875rem; text-align: left; color: rgba(255, 255, 255, .8);
  transition: color .3s;
}
.lien-pied:hover { color: #fff; }
.fleche {
  width: .75rem; height: .75rem; flex-shrink: 0;
  color: var(--coffee-400, #C19A6B); transition: transform .3s;
}
.lien-pied:hover .fleche { transform: translateX(4px); }

/* Lignes de séparation entre les sections sur mobile */
@media (max-width: 767px) {
  .footer-grid > div:not(:first-child) {
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    padding-top: 2rem;
    margin-top: 0.5rem;
  }
}
</style>
