<template>
  <svg class="drapeau" :class="taille" viewBox="0 0 24 24" role="img" :aria-label="etiquette">
    <defs>
      <clipPath :id="cle"><circle cx="12" cy="12" r="12" /></clipPath>
    </defs>
    <g :clip-path="`url(#${cle})`">
      <!-- France : bleu, blanc, rouge -->
      <template v-if="code === 'fr'">
        <rect x="0" y="0" width="8" height="24" fill="#0055A4" />
        <rect x="8" y="0" width="8" height="24" fill="#FFFFFF" />
        <rect x="16" y="0" width="8" height="24" fill="#EF4135" />
      </template>

      <!-- Madagascar : bande blanche verticale, rouge en haut, vert en bas -->
      <template v-else-if="code === 'mg'">
        <rect x="0" y="0" width="8" height="24" fill="#FFFFFF" />
        <rect x="8" y="0" width="16" height="12" fill="#FC3D32" />
        <rect x="8" y="12" width="16" height="12" fill="#007E3A" />
      </template>

      <!-- Royaume-Uni : Union Jack simplifié -->
      <template v-else>
        <rect x="0" y="0" width="24" height="24" fill="#012169" />
        <path d="M0 0 L24 24 M24 0 L0 24" stroke="#FFFFFF" stroke-width="5" />
        <path d="M0 0 L24 24 M24 0 L0 24" stroke="#C8102E" stroke-width="2.5" />
        <path d="M12 0 V24 M0 12 H24" stroke="#FFFFFF" stroke-width="8" />
        <path d="M12 0 V24 M0 12 H24" stroke="#C8102E" stroke-width="4.5" />
      </template>
    </g>
    <circle cx="12" cy="12" r="11.5" fill="none" stroke="rgba(62,44,31,.18)" stroke-width="1" />
  </svg>
</template>

<script setup>
import { computed, getCurrentInstance } from 'vue'

/**
 * Drapeau dessiné en SVG plutôt qu'en emoji : Windows n'affiche pas les
 * emoji drapeaux (il les remplace par les deux lettres du pays).
 */
const props = defineProps({
  code: { type: String, required: true },   // fr | mg | en
  etiquette: { type: String, default: '' },
  taille: { type: String, default: 'moyen' }, // petit | moyen | grand
})

// Identifiant unique par instance : deux clipPath ne doivent pas se marcher dessus
const uid = getCurrentInstance()?.uid ?? 0
const cle = computed(() => `drapeau-${props.code}-${uid}`)
</script>

<style scoped>
.drapeau { display: block; border-radius: 50%; flex-shrink: 0; }
.petit { width: 18px; height: 18px; }
.moyen { width: 24px; height: 24px; }
.grand { width: 32px; height: 32px; }
</style>
