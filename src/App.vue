<template>
  <div class="app-shell min-h-screen flex flex-col">
    <!-- Accès direct au contenu (navigation au clavier) -->
    <a class="skip-link" href="#contenu">{{ t('entete.allerContenu') }}</a>

    <!-- Header dynamique -->
    <component :is="currentHeader" v-if="showHeader" />

    <!-- Contenu principal -->
    <main id="contenu" :class="mainClass" class="flex-grow">
      <router-view />
    </main>

    <!-- Footer dynamique (différent selon le layout) -->
    <component :is="currentFooter" v-if="shouldShowFooter" />

    <!-- Notifications unifiées (style message box de connexion) -->
    <NotificationHost />

    <!-- Bannière « visite en tant que » (mode admin) -->
    <ImpersonationBanner />

    <!-- Signal réseau : visible uniquement en cas de coupure -->
    <OfflineBanner />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { t } from './i18n'
import { useRoute } from 'vue-router'
import { utilisateurCourant } from './services'
import Header from './components/Header.vue'
import HeaderParent from './components/HeaderParent.vue'
import HeaderEducatrice from './components/HeaderEducatrice.vue'
import HeaderPsy from './components/HeaderPsy.vue'
import HeaderAdmin from './components/HeaderAdmin.vue'
import NotificationHost from './components/NotificationHost.vue'
import ImpersonationBanner from './components/ImpersonationBanner.vue'
import OfflineBanner from './components/OfflineBanner.vue'
import Footer from './components/Footer.vue'

const route = useRoute()

// Mapping des headers
const headerMap = {
  default: Header,
  parent: HeaderParent,
  educatrice: HeaderEducatrice,
  psy: HeaderPsy,
  admin: HeaderAdmin,
  auth: null
}

// Un seul pied de page : il s'adapte à l'espace (voir Footer.vue).
const footerMap = {
  default: Footer,
  parent: Footer,
  educatrice: Footer,
  psy: Footer,
  admin: Footer,
  auth: null
}

/** Rôle du compte connecté, exprimé dans le vocabulaire des layouts. */
const layoutDuCompte = {
  PARENT: 'parent',
  EDUCATEUR: 'educatrice',
  PSY: 'psy',
  ADMIN: 'admin',
}

/**
 * Layout effectif de la page.
 *
 * Les pages partagées (accueil, évènements, mentions légales…) sont déclarées
 * en « default », c'est-à-dire l'espace visiteur. Un membre déjà connecté qui
 * ouvrait « Confidentialité » se retrouvait donc avec l'en-tête public et les
 * boutons « Connexion / Inscription » : il avait l'impression d'être déconnecté.
 * On garde donc son espace tant qu'il est connecté.
 */
const layoutActuel = computed(() => {
  const demande = route.meta.layout || 'default'
  if (demande !== 'default') return demande
  const role = utilisateurCourant()?.role?.toUpperCase()
  return layoutDuCompte[role] || 'default'
})

const currentHeader = computed(() => headerMap[layoutActuel.value] || headerMap.default)

const currentFooter = computed(() => footerMap[layoutActuel.value] || footerMap.default)

const showHeader = computed(() => currentHeader.value !== null)

// Afficher le footer uniquement si le meta showFooter est true
const shouldShowFooter = computed(() => route.meta.showFooter === true)

const mainClass = computed(() => {
  if (!showHeader.value) return 'pt-6 pb-6 px-4'
  return 'pt-24 pb-6 px-4'
})
</script>
