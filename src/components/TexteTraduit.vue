<template>
  <span class="texte-traduit">
    <template v-if="!traduit">{{ texte }}</template>
    <template v-else>
      <span
        v-for="(part, i) in morceaux"
        :key="i"
        :class="{ 'mot-inconnu': part.inconnu }"
        :title="part.inconnu ? t('traduction.motNonTraduit') : undefined">{{ part.texte }}</span>
      <button type="button" class="bascule" @click="montrerOriginal = !montrerOriginal">
        {{ montrerOriginal ? t('traduction.voirTraduction') : t('traduction.voirOriginal') }}
      </button>
    </template>
  </span>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { t, langue } from '../i18n'
import { traductionContenu } from '../services/traductionService'

/**
 * Affiche un contenu de membre dans la langue choisie.
 *
 * La traduction est produite par le glossaire de la plateforme : les mots qu'il
 * ne connaît pas restent dans la langue d'origine. Plutôt que de les laisser
 * passer inaperçus, on les souligne en rouge — le lecteur sait ce qui n'a pas
 * été traduit, et l'équipe sait quoi ajouter au lexique.
 */
const props = defineProps({
  texte: { type: String, default: '' },
  /** « POST », « COMMENT »… */
  type: { type: String, required: true },
  contenuId: { type: [Number, String], default: null },
  /** Traduction déjà chargée en lot : évite une requête par carte. */
  traductionPrechargee: { type: Object, default: null },
})

const traduction = ref(props.traductionPrechargee)
const montrerOriginal = ref(false)

const traduit = computed(() =>
  !montrerOriginal.value && !!traduction.value?.texte && langue.value !== 'fr')

/** Découpe le texte traduit pour pouvoir souligner mot à mot. */
const morceaux = computed(() => {
  const texte = traduction.value?.texte || ''
  const inconnus = new Set((traduction.value?.motsInconnus || []).map(m => m.toLowerCase()))
  if (!inconnus.size) return [{ texte, inconnu: false }]

  const parts = []
  const re = /[\p{L}][\p{L}'’-]*/gu
  let position = 0
  let m
  while ((m = re.exec(texte)) !== null) {
    if (m.index > position) parts.push({ texte: texte.slice(position, m.index), inconnu: false })
    parts.push({ texte: m[0], inconnu: inconnus.has(m[0].toLowerCase()) })
    position = m.index + m[0].length
  }
  if (position < texte.length) parts.push({ texte: texte.slice(position), inconnu: false })
  return parts
})

async function charger() {
  if (props.traductionPrechargee) { traduction.value = props.traductionPrechargee; return }
  if (langue.value === 'fr' || !props.contenuId) { traduction.value = null; return }
  traduction.value = await traductionContenu(props.type, props.contenuId, langue.value)
}

watch(() => [langue.value, props.contenuId, props.traductionPrechargee], charger, { immediate: true })
</script>

<style scoped>
.texte-traduit { display: inline; }

/* Le soulignement dit « ce mot n'a pas de traduction », sans gêner la lecture. */
.mot-inconnu {
  border-bottom: 2px solid #d4614f;
  border-bottom-style: dotted;
  cursor: help;
}

.bascule {
  display: inline-block; margin-left: 8px; padding: 0;
  border: none; background: none; cursor: pointer;
  font-size: .72rem; font-weight: 700; color: #6F4E37;
  text-decoration: underline; text-underline-offset: 2px;
}
.bascule:hover { color: #3E2C1F; }
</style>
