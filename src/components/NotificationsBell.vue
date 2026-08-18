<template>
  <div class="notif" v-if="userId">
    <button
      type="button"
      class="cloche"
      :aria-label="`${t('notifications.titre')} — ${etat.nonLues} ${t('notifications.nonLues')}`"
      :aria-expanded="ouvert"
      @click="basculer">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" />
      </svg>
      <span v-if="etat.nonLues > 0" class="badge" aria-hidden="true">{{ etat.nonLues > 9 ? '9+' : etat.nonLues }}</span>
    </button>

    <div v-if="ouvert" class="backdrop" @click="ouvert = false"></div>

    <div v-if="ouvert" class="panneau" role="dialog" :aria-label="t('notifications.titre')">
      <header class="tete">
        <h3>{{ t('notifications.titre') }}</h3>
        <div class="actions-tete">
          <button v-if="etat.nonLues > 0" type="button" class="lien" @click="toutLire">
            {{ t('notifications.toutLire') }}
          </button>
          <button v-if="etat.liste.length" type="button" class="lien danger" @click="vider">
            {{ t('notifications.vider') }}
          </button>
        </div>
      </header>

      <p v-if="etat.chargement" class="vide">{{ t('commun.chargement') }}</p>
      <p v-else-if="!etat.liste.length" class="vide">{{ t('notifications.aucune') }}</p>

      <ul v-else class="liste">
        <li v-for="n in etat.liste" :key="n.id" :class="['item', typeClasse(n.type), { nonLu: !n.lu }]">
          <Icone class="icone" :nom="icone(n.type)" :taille="17" />
          <div class="corps" @click="ouvrir(n)">
            <strong>{{ n.titre }}</strong>
            <p>{{ n.message }}</p>
            <time :datetime="n.createdAt">{{ quand(n.createdAt) }}</time>
          </div>
          <button type="button" class="supprimer" :aria-label="t('commun.supprimer')" @click="supprimer(n.id)">✕</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  etatNotifications as etat, chargerNotifications, marquerLue, marquerToutLu,
  supprimerNotification, viderNotifications, demarrerSuivi, arreterSuivi,
} from '../services/notificationService'
import { idUtilisateurCourant } from '../services/api'
import { t } from '../i18n'
import Icone from './Icone.vue'

const router = useRouter()
const ouvert = ref(false)
const userId = idUtilisateurCourant()

const ICONES = {
  EVENEMENT_RAPPEL: 'horloge',
  EVENEMENT_INSCRIPTION: 'valide',
  EVENEMENT_ANNULE: 'alerte',
  EVENEMENT_MODIFIE: 'crayon',
  EVENEMENT_NOUVEAU: 'etincelle',
  SYSTEME: 'bulle',
}
const icone = (type) => ICONES[type] || ICONES.SYSTEME
const typeClasse = (type) => (type === 'EVENEMENT_ANNULE' ? 'alerte' : '')

async function basculer() {
  ouvert.value = !ouvert.value
  if (ouvert.value) await chargerNotifications(userId)
}

async function ouvrir(n) {
  if (!n.lu) await marquerLue(n.id)
  if (n.lien) {
    ouvert.value = false
    router.push(lienRole(n.lien))
  }
}

/** Redirige vers l'espace évènements correspondant au rôle connecté. */
function lienRole(lien) {
  if (lien !== '/evenements') return lien
  const role = (JSON.parse(localStorage.getItem('user') || 'null') || {}).role
  return {
    PARENT: '/parent/evenements',
    EDUCATEUR: '/teacher/evenements',
    PSY: '/psy/evenements',
    ADMIN: '/admin/evenements',
  }[role] || '/evenements'
}

const toutLire = () => marquerToutLu(userId)
const supprimer = (id) => supprimerNotification(id)
const vider = () => viderNotifications(userId)

function quand(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const ecart = Date.now() - d.getTime()
  if (ecart < 60000) return "à l'instant"
  if (ecart < 3600000) return `il y a ${Math.floor(ecart / 60000)} min`
  if (ecart < 86400000) return `il y a ${Math.floor(ecart / 3600000)} h`
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}

onMounted(() => demarrerSuivi(userId))
onUnmounted(() => arreterSuivi())
</script>

<style scoped>
.notif { position: relative; display: inline-flex; }

.cloche {
  position: relative; border: 1px solid #EDE4D8; background: #fff; color: #6b5d4f;
  border-radius: 50%; width: 40px; height: 40px; display: grid; place-items: center;
  cursor: pointer; transition: border-color .2s, transform .2s;
}
.cloche:hover { border-color: #C19A6B; transform: translateY(-1px); }
.cloche:focus-visible { outline: 3px solid rgba(193,154,107,.45); outline-offset: 2px; }
.badge {
  position: absolute; top: -3px; right: -3px; min-width: 18px; height: 18px; padding: 0 4px;
  background: #c0563f; color: #fff; border-radius: 9px; font-size: .64rem; font-weight: 700;
  display: grid; place-items: center; border: 2px solid #fff;
}

.backdrop { position: fixed; inset: 0; z-index: 55; }

.panneau {
  position: absolute; top: calc(100% + 10px); right: 0; z-index: 60;
  width: 340px; max-width: calc(100vw - 24px); max-height: 70vh; overflow-y: auto;
  background: #fff; border: 1px solid #F0E9E0; border-radius: 18px;
  box-shadow: 0 18px 40px rgba(62,44,31,.18);
}
.tete { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px 10px; padding: 14px 16px 10px; border-bottom: 1px solid #F4EFE8; position: sticky; top: 0; background: #fff; border-radius: 18px 18px 0 0; }
.tete h3 { margin: 0; font-size: .95rem; color: #3E2C1F; }
.actions-tete { display: flex; gap: 10px; margin-left: auto; }
.lien { border: none; background: transparent; color: #8a6d4b; font-size: .72rem; font-weight: 600; cursor: pointer; padding: 3px 5px; border-radius: 7px; white-space: nowrap; }
.lien:hover { background: #FBF7F1; }
.lien.danger { color: #c0563f; }

.vide { padding: 28px 16px; text-align: center; color: #8a7c6d; font-size: .85rem; margin: 0; }

.liste { list-style: none; margin: 0; padding: 6px; display: flex; flex-direction: column; gap: 2px; }
.item { display: flex; gap: 10px; align-items: flex-start; padding: 10px 11px; border-radius: 13px; }
.item:hover { background: #FBF7F1; }
.item.nonLu { background: #FCF6EE; }
.item.alerte .icone { filter: none; }
.icone { font-size: 1rem; line-height: 1.4; flex-shrink: 0; }
.corps { flex: 1; cursor: pointer; min-width: 0; }
.corps strong { display: block; font-size: .82rem; color: #3E2C1F; margin-bottom: 2px; }
.corps p { margin: 0 0 4px; font-size: .76rem; color: #6b5d4f; line-height: 1.45; }
.corps time { font-size: .68rem; color: #a99e90; }
.supprimer { border: none; background: transparent; color: #b8ada0; cursor: pointer; font-size: .78rem; padding: 2px 5px; border-radius: 7px; flex-shrink: 0; }
.supprimer:hover { background: #f4ece7; color: #c0563f; }

@media (max-width: 420px) {
  .panneau { position: fixed; top: 70px; right: 12px; left: 12px; width: auto; }
}
</style>
