<template>
  <div class="commentaire" :class="{ reponse }">
    <span class="avatar" aria-hidden="true">{{ initiale }}</span>

    <div class="corps">
      <div class="bulle">
        <div class="entete">
          <strong>{{ commentaire.user?.nom || 'Utilisateur' }}</strong>
          <span v-if="commentaire.user?.role" class="role">{{ roleCourt }}</span>
          <span v-if="commentaire.modifie" class="modifie">{{ t('chat.modifie') }}</span>
        </div>

        <p v-if="edition === null" class="texte"><TexteTraduit :texte="commentaire.contenu" type="COMMENT" :contenu-id="commentaire.id" /></p>

        <div v-else class="edition">
          <input :value="edition" class="champ-edition" :aria-label="t('commun.modifier')"
                 @input="$emit('maj-edition', $event.target.value)"
                 @keyup.enter="$emit('valider-edition')"
                 @keyup.esc="$emit('annuler-edition')" />
          <button type="button" class="mini plein" @click="$emit('valider-edition')">{{ t('commun.enregistrer') }}</button>
          <button type="button" class="mini" @click="$emit('annuler-edition')">{{ t('commun.annuler') }}</button>
        </div>
      </div>

      <div class="barre">
        <!-- Réactions -->
        <div class="reactions">
          <button
            v-for="r in REACTIONS"
            :key="r.type"
            type="button"
            class="reaction"
            :class="{ actif: commentaire.maReaction === r.type }"
            :title="r.libelle"
            :aria-label="r.libelle"
            :aria-pressed="commentaire.maReaction === r.type"
            @click="$emit('reagir', { commentaire, type: r.type })">
            <Icone :nom="r.icone" :plein="commentaire.maReaction === r.type" :taille="17" />
            <span v-if="compte(r.type)" class="compte">{{ compte(r.type) }}</span>
          </button>
        </div>

        <button type="button" class="lien" @click="$emit('repondre', commentaire)">{{ t('commun.repondre') }}</button>

        <template v-if="estAuteur">
          <button type="button" class="lien" @click="$emit('modifier', commentaire)">{{ t('commun.modifier') }}</button>
          <button type="button" class="lien rouge" @click="$emit('supprimer', commentaire)">{{ t('commun.supprimer') }}</button>
        </template>

        <time :datetime="commentaire.createdAt">{{ quand }}</time>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { t } from '../i18n'
import Icone from './Icone.vue'
import TexteTraduit from './TexteTraduit.vue'

/** Un commentaire (ou une réponse) avec ses réactions et ses actions d'auteur. */
const props = defineProps({
  commentaire: { type: Object, required: true },
  utilisateur: { type: Object, default: null },
  /** Texte en cours d'édition, ou null si le commentaire n'est pas édité. */
  edition: { type: String, default: null },
  reponse: { type: Boolean, default: false },
})

defineEmits(['repondre', 'modifier', 'supprimer', 'reagir', 'maj-edition', 'valider-edition', 'annuler-edition'])

const REACTIONS = computed(() => [
  { type: 'JAIME', icone: 'pouce', libelle: t('reactions.jaime') },
  { type: 'SOUTIEN', icone: 'coeur', libelle: t('reactions.soutien') },
  { type: 'MERCI', icone: 'mains', libelle: t('reactions.merci') },
  { type: 'BRAVO', icone: 'applaudir', libelle: t('reactions.bravo') },
])

const roleLibelle = (r) => ({ PARENT: t('roles.parent'), EDUCATEUR: t('roles.educatrice'), PSY: t('roles.psychologue'), ADMIN: t('roles.admin') }[r] || '')

const initiale = computed(() => (props.commentaire.user?.nom || '?').charAt(0).toUpperCase())
const roleCourt = computed(() => roleLibelle(props.commentaire.user?.role))
const estAuteur = computed(() =>
  !!props.utilisateur && props.commentaire.user?.id === props.utilisateur.id)

const compte = (type) => props.commentaire.reactions?.[type] || 0

const quand = computed(() => {
  const brut = props.commentaire.createdAt
  if (!brut) return ''
  const d = new Date(String(brut).replace(' ', 'T'))
  if (Number.isNaN(d.getTime())) return ''
  const ecart = Date.now() - d.getTime()
  if (ecart < 60000) return t('chat.alInstant')
  if (ecart < 3600000) return t('reactions.ilYaMinutes', { n: Math.floor(ecart / 60000) })
  if (ecart < 86400000) return t('reactions.ilYaHeures', { n: Math.floor(ecart / 3600000) })
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
})
</script>

<style scoped>
.commentaire { display: flex; gap: 10px; align-items: flex-start; }

.avatar {
  width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
  display: grid; place-items: center; color: #fff; font-weight: 700; font-size: .8rem;
  background: linear-gradient(135deg, #C19A6B, #6F4E37);
}
.commentaire.reponse .avatar { width: 26px; height: 26px; font-size: .7rem; }

.corps { flex: 1; min-width: 0; }
.bulle { background: #FBF7F1; border-radius: 4px 16px 16px 16px; padding: 9px 13px; }
.commentaire.reponse .bulle { background: #F6F1EA; }

.entete { display: flex; align-items: baseline; flex-wrap: wrap; gap: 7px; margin-bottom: 3px; }
.entete strong { font-size: .82rem; color: #3E2C1F; }
.role {
  font-size: .6rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
  color: #8a6d4b; background: rgba(193,154,107,.18); padding: 2px 7px; border-radius: 10px;
}
.modifie { font-size: .64rem; color: #a99e90; }
.texte { margin: 0; font-size: .85rem; line-height: 1.55; color: #4a3c2f; overflow-wrap: anywhere; }

.edition { display: flex; flex-wrap: wrap; gap: 6px; }
.champ-edition {
  flex: 1 1 140px; min-width: 0; border: 1px solid #EFE5DB; border-radius: 10px;
  padding: 7px 10px; font-size: .84rem; font-family: inherit; color: #3E2C1F; background: #fff;
}
.champ-edition:focus { outline: none; border-color: #C19A6B; }
.mini {
  border: none; cursor: pointer; border-radius: 10px; padding: 7px 12px;
  font-size: .72rem; font-weight: 700; background: #F1EDE8; color: #6b5d4f;
}
.mini.plein { background: #6F4E37; color: #fff; }

.barre { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; margin: 5px 0 0 4px; }
.reactions { display: inline-flex; gap: 2px; }
.reaction {
  display: inline-flex; align-items: center; gap: 3px;
  border: none; background: transparent; cursor: pointer;
  padding: 3px 6px; border-radius: 20px; font-size: .82rem; line-height: 1;
  opacity: .55; transition: opacity .18s, background .18s, transform .18s;
}
.reaction:hover { opacity: 1; background: #F4EDE4; transform: translateY(-1px); }
.reaction.actif { opacity: 1; background: rgba(193,154,107,.22); }
.reaction .compte { font-size: .66rem; font-weight: 700; color: #6F4E37; }

.lien {
  border: none; background: transparent; cursor: pointer; padding: 0;
  font-size: .7rem; font-weight: 700; color: #8a7c6d;
}
.lien:hover { color: #6F4E37; text-decoration: underline; text-underline-offset: 2px; }
.lien.rouge { color: #b4735f; }
.lien.rouge:hover { color: #c0563f; }

.barre time { font-size: .66rem; color: #b8ada0; margin-left: auto; }

@media (prefers-reduced-motion: reduce) {
  .reaction { transition: none; }
}
</style>
