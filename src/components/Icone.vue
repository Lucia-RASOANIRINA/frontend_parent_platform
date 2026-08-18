<template>
  <svg
    class="icone"
    :class="[`icone--${nom}`, { 'icone--anime': anime, 'icone--plein': plein }]"
    :width="taille" :height="taille"
    viewBox="0 0 24 24"
    :fill="plein ? 'currentColor' : 'none'"
    stroke="currentColor"
    :stroke-width="plein ? 0 : epaisseur"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false">
    <path v-for="(d, i) in traces" :key="i" :d="d" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'

/**
 * Jeu d'icônes de la plateforme.
 *
 * Les emoji rendaient l'interface dépendante de la police du système : sur
 * Windows, plusieurs d'entre eux s'affichaient en noir et blanc ou pas du tout,
 * et leur taille variait d'un navigateur à l'autre. Un tracé SVG prend la
 * couleur du texte, se met à l'échelle proprement et s'anime.
 */
const props = defineProps({
  nom: { type: String, required: true },
  taille: { type: [Number, String], default: 18 },
  /** Tracé plein plutôt que contour : pour l'état « sélectionné ». */
  plein: { type: Boolean, default: false },
  /** Active l'animation d'accueil au survol. */
  anime: { type: Boolean, default: true },
  epaisseur: { type: [Number, String], default: 1.8 },
})

const TRACES = {
  // --- Réactions ---
  pouce: ['M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3zm0 0 4.5-8a2.2 2.2 0 0 1 3 2.6L13.7 9h5.1a2 2 0 0 1 1.95 2.45l-1.4 6A2 2 0 0 1 17.4 19H7'],
  coeur: ['M12 20.5 4.2 13a4.8 4.8 0 0 1 6.8-6.8l1 1 1-1A4.8 4.8 0 0 1 19.8 13L12 20.5z'],
  mains: ['M12 3.5 9.8 8.9a1 1 0 0 1-.6.6L3.8 11l4 3.9a1 1 0 0 1 .3.9L7.2 21l4.3-2.4a1 1 0 0 1 1 0L16.8 21l-.9-5.2a1 1 0 0 1 .3-.9l4-3.9-5.4-1.5a1 1 0 0 1-.6-.6L12 3.5z'],
  applaudir: ['M9 13.5 6.2 10.7a1.7 1.7 0 0 1 2.4-2.4l1.6 1.6', 'M12.3 6.6a1.7 1.7 0 0 1 2.4 2.4', 'M9.5 5.6a1.7 1.7 0 0 1 2.4 2.4', 'M13.4 20.6a6 6 0 0 1-4.2-1.7l-3.4-3.4a1.7 1.7 0 0 1 2.4-2.4l1.5 1.5V7.9a1.7 1.7 0 0 1 3.4 0v4.4l4 1.2a2.6 2.6 0 0 1 1.8 3.1l-.5 2a2.6 2.6 0 0 1-2.5 2h-2.5z'],

  // --- Notifications ---
  horloge: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 7v5l3.2 1.9'],
  valide: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M8.2 12.2l2.6 2.6 5-5.4'],
  alerte: ['M10.3 4.1 2.6 17.4A2 2 0 0 0 4.3 20.4h15.4a2 2 0 0 0 1.7-3L13.7 4.1a2 2 0 0 0-3.4 0z', 'M12 9.5v4', 'M12 17h.01'],
  crayon: ['M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17v3z', 'M14.5 5.5l4 4'],
  etincelle: ['M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z', 'M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8z'],
  bulle: ['M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z'],

  // --- Divers ---
  oeil: ['M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],
  oeilBarre: ['M9.9 5.7A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.5 3.4', 'M6.3 7.5A17 17 0 0 0 2.5 12S6 18.5 12 18.5c1.5 0 2.9-.4 4.1-1', 'M10 10a3 3 0 0 0 4.2 4.2', 'M3.5 3.5l17 17'],
  appareil: ['M4 8h2.5l1.4-2h8.2l1.4 2H20a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 20 19H4a1.5 1.5 0 0 1-1.5-1.5v-8A1.5 1.5 0 0 1 4 8z', 'M12 16.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z'],
  corbeille: ['M4 7h16', 'M9.5 7V5.2A1.2 1.2 0 0 1 10.7 4h2.6a1.2 1.2 0 0 1 1.2 1.2V7', 'M6.5 7l.9 12.1a1.5 1.5 0 0 0 1.5 1.4h6.2a1.5 1.5 0 0 0 1.5-1.4L17.5 7'],
  agenda: ['M5 6h14a1.5 1.5 0 0 1 1.5 1.5v12A1.5 1.5 0 0 1 19 21H5a1.5 1.5 0 0 1-1.5-1.5v-12A1.5 1.5 0 0 1 5 6z', 'M8 3.5V7', 'M16 3.5V7', 'M3.5 10.5h17'],
  personnes: ['M15.5 20.5v-1.8a3.6 3.6 0 0 0-3.6-3.6H6.6A3.6 3.6 0 0 0 3 18.7v1.8', 'M9.2 11.6a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2', 'M21 20.5v-1.8a3.6 3.6 0 0 0-2.7-3.5', 'M15.5 4.6a3.6 3.6 0 0 1 0 7'],
  etoile: ['M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9L3.5 9.7l5.9-.8L12 3.5z'],
  livre: ['M12 6.5v13', 'M12 6.5C10.8 5.7 9.2 5.2 7.5 5.2S4.2 5.7 3 6.5v13c1.2-.8 2.8-1.3 4.5-1.3s3.3.5 4.5 1.3', 'M12 6.5c1.2-.8 2.8-1.3 4.5-1.3s3.3.5 4.5 1.3v13c-1.2-.8-2.8-1.3-4.5-1.3s-3.3.5-4.5 1.3'],
  tendance: ['M3 17l5.5-5.5 3.5 3.5L21 6', 'M15.5 6H21v5.5'],
}

const traces = computed(() => TRACES[props.nom] || TRACES.bulle)
</script>

<style scoped>
.icone { flex-shrink: 0; vertical-align: -.15em; transition: transform .3s cubic-bezier(.34, 1.56, .64, 1); }

/* Chaque famille a son geste : le mouvement dit ce que fait l'icône. */
:where(button, a, .reaction, .item):hover > .icone--anime.icone--pouce { animation: pouce .5s ease; }
:where(button, a, .reaction, .item):hover > .icone--anime.icone--coeur { animation: battement .6s ease; }
:where(button, a, .reaction, .item):hover > .icone--anime.icone--mains { animation: gratitude .55s ease; }
:where(button, a, .reaction, .item):hover > .icone--anime.icone--applaudir { animation: applaudir .5s ease; }
:where(button, a, .reaction, .item):hover > .icone--anime.icone--horloge { animation: tictac .6s ease; }
:where(button, a, .reaction, .item):hover > .icone--anime.icone--etincelle { animation: scintille .7s ease; }
:where(button, a, .reaction, .item):hover > .icone--anime.icone--alerte { animation: secoue .45s ease; }
:where(button, a, .reaction, .item):hover > .icone--anime.icone--corbeille { animation: secoue .45s ease; }
:where(button, a, .reaction, .item):hover > .icone--anime.icone--appareil { animation: rebond .45s ease; }
:where(button, a, .reaction, .item):hover > .icone--anime.icone--etoile { animation: scintille .7s ease; }

@keyframes pouce {
  30% { transform: translateY(-3px) rotate(-12deg); }
  60% { transform: translateY(0) rotate(4deg); }
}
@keyframes battement {
  25% { transform: scale(1.22); }
  45% { transform: scale(.96); }
  70% { transform: scale(1.12); }
}
@keyframes gratitude {
  35% { transform: translateY(-3px) scale(1.1); }
  70% { transform: translateY(1px) scale(.98); }
}
@keyframes applaudir {
  25% { transform: rotate(-14deg) scale(1.08); }
  55% { transform: rotate(10deg) scale(1.08); }
  80% { transform: rotate(-4deg); }
}
@keyframes tictac {
  30% { transform: rotate(-14deg); }
  65% { transform: rotate(10deg); }
}
@keyframes scintille {
  30% { transform: scale(1.2) rotate(18deg); }
  60% { transform: scale(.95) rotate(-8deg); }
}
@keyframes secoue {
  20% { transform: translateX(-2px) rotate(-6deg); }
  50% { transform: translateX(2px) rotate(6deg); }
  80% { transform: translateX(-1px); }
}
@keyframes rebond {
  35% { transform: translateY(-4px) scale(1.06); }
  70% { transform: translateY(0) scale(.98); }
}

/* Un mouvement qui surprend n'est convivial pour personne. */
@media (prefers-reduced-motion: reduce) {
  .icone, .icone--anime { animation: none !important; transition: none; }
}
</style>
