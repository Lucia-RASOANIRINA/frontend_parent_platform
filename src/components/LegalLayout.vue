<template>
  <div class="legal-page">
    <header class="legal-head">
      <span class="eyebrow">PARENTIA</span>
      <h1>{{ title }}</h1>
      <p v-if="subtitle" class="sub">{{ subtitle }}</p>
    </header>
    <div class="legal-card">
      <slot />
      <p class="updated">Dernière mise à jour : juillet 2026</p>
    </div>
  </div>
</template>

<script setup>
defineProps({ title: String, subtitle: String })
</script>

<style scoped>
.legal-page { max-width: 820px; margin: 0 auto; padding: 10px 20px 30px; }
.legal-head { text-align: center; padding: 8px 20px 18px; }
.eyebrow { display: inline-block; font-size: 12px; letter-spacing: 3px; font-weight: 700; color: #C19A6B; margin-bottom: 10px; }
.legal-head h1 { font-size: 2.2rem; font-weight: 800; color: #3E2C1F; margin: 0 0 8px; }
.sub { color: #6b5d4f; margin: 0; }
.legal-card { background: #fff; border: 1px solid #F0E9E0; border-radius: 24px; padding: 30px; box-shadow: 0 6px 20px rgba(62,44,31,.06); }
.legal-card :deep(h2) { color: #3E2C1F; font-size: 1.15rem; margin: 22px 0 8px; }
.legal-card :deep(h2:first-child) { margin-top: 0; }
.legal-card :deep(p), .legal-card :deep(li) { color: #5f5346; line-height: 1.7; }
.legal-card :deep(ul) { padding-left: 20px; margin: 8px 0; }
.legal-card :deep(a) { color: #8a6d4b; font-weight: 600; }
.updated { margin-top: 24px; padding-top: 16px; border-top: 1px solid #F0E9E0; color: #a99e90; font-size: .82rem; }
</style>
