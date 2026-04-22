<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header dynamique -->
    <component :is="currentHeader" v-if="showHeader" />
    
    <!-- Contenu principal -->
    <main :class="mainClass" class="flex-grow">
      <router-view />
    </main>
    
    <!-- Footer dynamique (différent selon le layout) -->
    <component :is="currentFooter" v-if="shouldShowFooter" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from './components/Header.vue'
import HeaderParent from './components/HeaderParent.vue'
import HeaderEducatrice from './components/HeaderEducatrice.vue'
import HeaderPsy from './components/HeaderPsy.vue'
import Footer from './components/Footer.vue'       
import FooterPsy from './components/FooterPsy.vue'  
import FooterTeacher from './components/FooterTeacher.vue'
import FooterParent from './components/FooterParent.vue'

const route = useRoute()

// Mapping des headers
const headerMap = {
  default: Header,
  parent: HeaderParent,
  educatrice: HeaderEducatrice,
  psy: HeaderPsy,
  auth: null
}

// Mapping des footers (par défaut Footer, pour psy FooterPsy)
const footerMap = {
  default: Footer,
  parent: FooterParent,
  educatrice: FooterTeacher,
  psy: FooterPsy,
  auth: null
}

const currentHeader = computed(() => {
  const layoutName = route.meta.layout || 'default'
  return headerMap[layoutName] || headerMap.default
})

const currentFooter = computed(() => {
  const layoutName = route.meta.layout || 'default'
  return footerMap[layoutName] || footerMap.default
})

const showHeader = computed(() => currentHeader.value !== null)

// Afficher le footer uniquement si le meta showFooter est true
const shouldShowFooter = computed(() => route.meta.showFooter === true)

const mainClass = computed(() => {
  if (!showHeader.value) return 'pt-6 pb-6 px-4'
  return 'pt-32 pb-6 px-4'
})
</script>