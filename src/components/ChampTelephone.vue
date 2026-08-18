<template>
  <div class="champ-tel">
    <input
      :value="affichage"
      type="tel"
      inputmode="tel"
      autocomplete="tel"
      :placeholder="placeholder || '034 02 261 37'"
      :aria-invalid="enErreur"
      :aria-describedby="enErreur ? idErreur : undefined"
      @input="saisir"
      @blur="touche = true"
      @keypress="filtrer" />
    <p v-if="enErreur" :id="idErreur" class="erreur-tel" role="alert">
      {{ t('fiche.telephoneInvalide') }}
    </p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { t } from '../i18n'
import { formater, estValide } from '../services/telephone'

/**
 * Champ téléphone au format malgache.
 *
 * Les lettres sont refusées à la frappe plutôt que signalées après coup :
 * corriger une saisie déjà écrite est plus pénible que de l'empêcher.
 * L'espacement suit l'écriture choisie, nationale ou internationale.
 */
const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'validite'])

const touche = ref(false)
const idErreur = `tel-err-${Math.random().toString(36).slice(2, 8)}`

const affichage = computed(() => formater(props.modelValue))
const enErreur = computed(() => touche.value && !!props.modelValue?.trim() && !estValide(props.modelValue))

/** Seuls les chiffres et un « + » en tête peuvent être tapés. */
function filtrer(e) {
  if (e.ctrlKey || e.metaKey) return
  const c = e.key
  if (/\d/.test(c)) return
  if (c === '+' && e.target.selectionStart === 0 && !props.modelValue?.includes('+')) return
  e.preventDefault()
}

function saisir(e) {
  const formate = formater(e.target.value)
  // On réécrit la valeur affichée : sans cela le curseur saute au collage
  e.target.value = formate
  emit('update:modelValue', formate)
  emit('validite', estValide(formate))
}
</script>

<style scoped>
.champ-tel { display: flex; flex-direction: column; gap: 4px; }
.champ-tel input[aria-invalid='true'] { border-color: #c0563f; }
.erreur-tel { margin: 0; font-size: .72rem; font-weight: 600; color: #c0563f; }
</style>
