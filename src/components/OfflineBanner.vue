<template>
  <!--
    Seul signal visible du réseau : un bandeau quand la connexion est perdue.
    Le choix entre serveur local et serveur en ligne se fait automatiquement,
    sans rien demander ni afficher à l'utilisateur (voir services/api.js).
  -->
  <Transition name="glisse">
    <div v-if="!connexion.enLigne" class="bandeau" role="status" aria-live="polite">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
           stroke-width="2" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M18.364 5.636a9 9 0 0 1 0 12.728M5.636 18.364a9 9 0 0 1 0-12.728M12 12h.01M3 3l18 18" />
      </svg>
      <span><strong>{{ t('connexionEtat.horsLigne') }}</strong> — {{ t('connexionEtat.horsLigneTexte') }}</span>
    </div>
  </Transition>
</template>

<script setup>
import { watch } from 'vue'
import { connexion } from '../services/api'
import { t } from '../i18n'

// Le bandeau décale la page pour ne pas recouvrir l'en-tête fixe
watch(() => connexion.enLigne, (enLigne) => {
  document.documentElement.classList.toggle('hors-ligne', !enLigne)
}, { immediate: true })
</script>

<style scoped>
.bandeau {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1200;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  background: #8a4b3a; color: #fff; padding: 9px 16px;
  font-size: .85rem; text-align: center;
}
.glisse-enter-active, .glisse-leave-active { transition: transform .3s, opacity .3s; }
.glisse-enter-from, .glisse-leave-to { transform: translateY(-100%); opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .glisse-enter-active, .glisse-leave-active { transition: none; }
}
</style>
