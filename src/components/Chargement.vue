<template>
  <!--
    Silhouettes : on montre la structure du contenu qui arrive plutôt qu'un
    cercle qui tourne. C'est le style adopté dans l'espace évènements, et il
    sert désormais partout pour le chargement de contenu.
  -->
  <div class="silhouettes" :class="{ compact }" role="status" :aria-label="etiquette">
    <div v-for="n in nombreEffectif" :key="n" class="silhouette">
      <span class="s-rond"></span>
      <span class="s-lignes">
        <span class="s-ligne large"></span>
        <span class="s-ligne"></span>
        <span v-if="!compact" class="s-ligne courte"></span>
      </span>
    </div>
    <span class="sr-only">{{ etiquette }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { t } from '../i18n'

/**
 * Indicateur de chargement unique pour toute la plateforme.
 * Remplace les « Chargement… » écrits en dur, qui différaient d'une page
 * à l'autre et n'étaient pas traduits.
 */
const props = defineProps({
  /**
   * Conservé pour compatibilité : les appels existants passent encore
   * « silhouettes ». Il n'y a plus qu'un seul rendu.
   */
  variante: { type: String, default: 'silhouettes' },
  /** Nombre de silhouettes à afficher. */
  nombre: { type: Number, default: 3 },
  /** Texte personnalisé ; sinon « Chargement… » traduit. */
  texte: { type: String, default: '' },
  /** Version resserrée : une seule silhouette, plus fine. */
  compact: { type: Boolean, default: false },
})

const etiquette = computed(() => props.texte || t('commun.chargement'))
const nombreEffectif = computed(() => (props.compact ? 1 : props.nombre))
</script>

<style scoped>
.silhouettes { display: flex; flex-direction: column; gap: 14px; padding: 4px 0; }
.silhouettes.compact { gap: 8px; padding: 2px 0; }

.silhouette {
  display: flex; align-items: flex-start; gap: 14px;
  background: #fff; border: 1px solid #EFE7DC; border-radius: 18px; padding: 18px;
}
.silhouettes.compact .silhouette { padding: 12px 14px; gap: 10px; border-radius: 14px; }

.s-rond, .s-ligne {
  display: block; border-radius: 10px;
  background: linear-gradient(90deg, #F5EFE7 25%, #EBE1D4 50%, #F5EFE7 75%);
  background-size: 200% 100%; animation: scintille 1.4s ease-in-out infinite;
}
.s-rond { width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0; }
.silhouettes.compact .s-rond { width: 30px; height: 30px; }

.s-lignes { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 9px; }
.silhouettes.compact .s-lignes { gap: 7px; }
.s-ligne { height: 12px; }
.s-ligne.large { height: 16px; width: 55%; }
.silhouettes.compact .s-ligne.large { height: 12px; }
.silhouettes.compact .s-ligne { height: 9px; }
.s-ligne.courte { width: 38%; }
@keyframes scintille { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
}

@media (prefers-reduced-motion: reduce) {
  .s-rond, .s-ligne { animation: none; }
}
</style>
