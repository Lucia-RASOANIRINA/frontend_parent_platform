<template>
  <div class="fil">
    <div class="liste" v-if="racines.length">
      <article v-for="c in racines" :key="c.id" class="bloc">
        <CommentItem
          :commentaire="c"
          :utilisateur="utilisateur"
          @repondre="ouvrirReponse"
          @modifier="demarrerEdition"
          @supprimer="supprimer"
          @reagir="reagir"
          v-bind="{ edition: editionId === c.id ? texteEdition : null }"
          @maj-edition="texteEdition = $event"
          @valider-edition="validerEdition(c)"
          @annuler-edition="annulerEdition" />

        <!-- Réponses -->
        <div v-if="reponsesDe(c.id).length" class="reponses">
          <CommentItem
            v-for="r in reponsesDe(c.id)"
            :key="r.id"
            reponse
            :commentaire="r"
            :utilisateur="utilisateur"
            @repondre="ouvrirReponse(c)"
            @modifier="demarrerEdition"
            @supprimer="supprimer"
            @reagir="reagir"
            v-bind="{ edition: editionId === r.id ? texteEdition : null }"
            @maj-edition="texteEdition = $event"
            @valider-edition="validerEdition(r)"
            @annuler-edition="annulerEdition" />
        </div>

        <!-- Champ de réponse -->
        <form v-if="reponseA === c.id" class="champ-reponse" @submit.prevent="envoyerReponse(c)">
          <input v-model="texteReponse" :placeholder="`Répondre à ${c.user?.nom || 'ce commentaire'}…`"
                 :aria-label="t('commun.repondre')" />
          <button type="submit" class="envoyer" :disabled="!texteReponse.trim()">{{ t('chat.envoyer') }}</button>
          <button type="button" class="annuler" @click="reponseA = null">{{ t('commun.annuler') }}</button>
        </form>
      </article>
    </div>

    <p v-else class="vide">{{ t('commun.aucunCommentaire') }}</p>

    <!-- Nouveau commentaire -->
    <form class="champ-nouveau" @submit.prevent="envoyer()">
      <input v-model="texte" :placeholder="t('commun.ecrireCommentaire')" :aria-label="t('commun.ecrireCommentaire')" />
      <button type="submit" class="envoyer" :disabled="!texte.trim()">{{ t('chat.envoyer') }}</button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import CommentItem from './CommentItem.vue'
import {
  fetchCommentaires, ajouterCommentaire, modifierCommentaire,
  supprimerCommentaire, reagirCommentaire, utilisateurCourant,
} from '../services'
import { notify } from '../services/notify'
import { t } from '../i18n'

/**
 * Fil de commentaires complet : écrire, répondre, réagir, modifier et
 * supprimer — les gestes attendus sur une plateforme sociale.
 * Le composant gère son propre état ; le parent lui passe la publication.
 */
const props = defineProps({
  postId: { type: [Number, String], required: true },
  commentaires: { type: Array, default: () => [] },
})

const emit = defineEmits(['change'])

const utilisateur = utilisateurCourant()
const liste = ref([...props.commentaires])
const texte = ref('')
const texteReponse = ref('')
const reponseA = ref(null)
const editionId = ref(null)
const texteEdition = ref('')

const racines = computed(() => liste.value.filter(c => !c.parentId))
const reponsesDe = (id) => liste.value.filter(c => c.parentId === id)

async function recharger() {
  try {
    liste.value = await fetchCommentaires(props.postId)
    emit('change', liste.value.length)
  } catch { /* on garde l'affichage courant */ }
}

function verifierConnexion() {
  if (utilisateur) return true
  notify.visitor(t('notif.connexionRequise'))
  return false
}

async function envoyer() {
  if (!texte.value.trim() || !verifierConnexion()) return
  try {
    await ajouterCommentaire(props.postId, texte.value.trim())
    texte.value = ''
    await recharger()
  } catch {
    notify.error('Oups', "Le commentaire n'a pas pu être publié.")
  }
}

function ouvrirReponse(c) {
  if (!verifierConnexion()) return
  reponseA.value = c.id
  texteReponse.value = ''
}

async function envoyerReponse(parent) {
  if (!texteReponse.value.trim()) return
  try {
    await ajouterCommentaire(props.postId, texteReponse.value.trim(), utilisateur.id, parent.id)
    texteReponse.value = ''
    reponseA.value = null
    await recharger()
  } catch {
    notify.error('Oups', "La réponse n'a pas pu être publiée.")
  }
}

function demarrerEdition(c) {
  editionId.value = c.id
  texteEdition.value = c.contenu
}
function annulerEdition() {
  editionId.value = null
  texteEdition.value = ''
}

async function validerEdition(c) {
  const nouveau = texteEdition.value.trim()
  if (!nouveau) return
  try {
    await modifierCommentaire(c.id, nouveau)
    c.contenu = nouveau
    c.modifie = true
    annulerEdition()
  } catch (e) {
    notify.error(t('notif.oups'), e.response?.data?.error || t('notif.modificationImpossible'))
  }
}

function supprimer(c) {
  const quoi = c.parentId ? t('notif.cetteReponse') : t('notif.ceCommentaire')
  notify.confirmDelete(quoi, () => supprimerVraiment(c))
}

async function supprimerVraiment(c) {
  try {
    await supprimerCommentaire(c.id)
    await recharger()
  } catch (e) {
    notify.error(t('notif.oups'), e.response?.data?.error || t('notif.suppressionImpossible'))
  }
}

async function reagir({ commentaire, type }) {
  if (!verifierConnexion()) return
  try {
    const res = await reagirCommentaire(commentaire.id, type)
    commentaire.reactions = res.reactions || {}
    commentaire.maReaction = res.maReaction || null
  } catch {
    notify.error('Oups', "La réaction n'a pas pu être enregistrée.")
  }
}

// Chargement initial si le parent n'a rien fourni
if (!props.commentaires.length) recharger()
</script>

<style scoped>
.fil { display: flex; flex-direction: column; gap: 14px; }
.liste { display: flex; flex-direction: column; gap: 12px; max-height: 340px; overflow-y: auto; padding-right: 4px; }
.bloc { display: flex; flex-direction: column; gap: 8px; }
.reponses {
  display: flex; flex-direction: column; gap: 8px;
  margin-left: 34px; padding-left: 12px; border-left: 2px solid #EFE5DB;
}
.vide { text-align: center; color: #a99e90; font-size: .82rem; margin: 10px 0; }

.champ-nouveau, .champ-reponse { display: flex; gap: 8px; flex-wrap: wrap; }
.champ-reponse { margin-left: 34px; }
.champ-nouveau input, .champ-reponse input {
  flex: 1 1 160px; min-width: 0;
  border: 1px solid #EFE5DB; border-radius: 12px; padding: 9px 13px;
  font-size: .85rem; font-family: inherit; color: #3E2C1F; background: #fff;
}
.champ-nouveau input:focus, .champ-reponse input:focus { outline: none; border-color: #C19A6B; }
.envoyer, .annuler {
  border: none; cursor: pointer; border-radius: 12px; padding: 9px 16px;
  font-size: .8rem; font-weight: 700;
}
.envoyer { background: linear-gradient(135deg, #C19A6B, #6F4E37); color: #fff; }
.envoyer:disabled { background: #E7DCCE; color: #a99e90; cursor: not-allowed; }
.annuler { background: #F1EDE8; color: #6b5d4f; }
</style>
