<template>
  <div class="min-h-screen">
    <Header />
    
    <!-- Le router-view affichera le contenu selon l'URL -->
    <main class="pt-32 pb-20 px-4">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
</script>