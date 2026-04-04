<template>
  <div class="min-h-screen">
    <!-- Afficher dynamiquement le header en fonction du layout -->
    <component :is="currentLayout" v-if="showHeader" />
    
    <!-- Le router-view affichera le contenu selon l'URL -->
    <main :class="mainClass">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from './components/Header.vue'
import HeaderParent from './components/HeaderParent.vue'
import HeaderEducatrice from './components/HeaderEducatrice.vue'
import HeaderPsy from './components/HeaderPsy.vue'

const route = useRoute()

// Mapping des layouts
const layoutMap = {
  default: Header,
  parent: HeaderParent,
  educatrice: HeaderEducatrice,
  psy: HeaderPsy,
  auth: null
}

// Déterminer quel header afficher
const currentLayout = computed(() => {
  const layoutName = route.meta.layout || 'default'
  return layoutMap[layoutName] || layoutMap.default
})

// Déterminer si on doit afficher un header
const showHeader = computed(() => {
  return currentLayout.value !== null
})

// Classes CSS dynamiques pour le main
const mainClass = computed(() => {
  if (!showHeader.value) {
    return 'pt-6 pb-6 px-4'
  }
  return 'pt-32 pb-6 px-4'
})
</script>