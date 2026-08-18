<template>
  <div class="profile-page">
    <div class="profile-card">
      <div class="profile-banner" :style="{ background: accent }"></div>

      <!-- Avatar : photo si elle existe, initiale sinon -->
      <div class="avatar-zone">
        <div class="profile-avatar" :style="{ background: accent }">
          <img v-if="photoVisible" :src="urlPhoto" :alt="form.nom" @error="photoCassee = true" />
          <span v-else>{{ initial }}</span>
        </div>
        <button type="button" class="avatar-action" :style="{ background: accent }"
                :title="t('fiche.changerPhoto')" :aria-label="t('fiche.changerPhoto')"
                @click="fichierPhoto?.click()" :disabled="envoiPhoto">
          <Icone nom="appareil" :taille="16" />
        </button>
        <button v-if="photoVisible" type="button" class="avatar-action retirer"
                :title="t('fiche.retirerPhoto')" :aria-label="t('fiche.retirerPhoto')"
                @click="demanderRetrait" :disabled="envoiPhoto">
          <Icone nom="corbeille" :taille="15" />
        </button>
        <input ref="fichierPhoto" type="file" accept="image/*" hidden @change="choisirPhoto" />
      </div>

      <div class="profile-body">
        <h1>{{ form.nom || t('fiche.monProfil') }}</h1>
        <span class="role-chip" :style="{ color: accent, borderColor: accent }">{{ roleLabel }}</span>
        <p v-if="envoiPhoto" class="aide">{{ t('fiche.envoiPhoto') }}</p>
        <p v-else class="aide">{{ t('fiche.aidePhoto') }}</p>

        <form @submit.prevent="save" class="grid">
          <label class="full">{{ t('fiche.nomComplet') }}
            <input v-model="form.nom" required />
          </label>
          <label class="full">{{ t('fiche.email') }}
            <input v-model="form.email" type="email" required />
          </label>
          <label>{{ t('fiche.telephone') }}
            <ChampTelephone v-model="form.telephone" :placeholder="t('fiche.phTelephone')" @validite="telValide = $event" />
          </label>
          <label>{{ t('fiche.adresse') }}
            <input v-model="form.adresse" :placeholder="t('fiche.phAdresse')" />
          </label>
          <label v-if="showWork">{{ t('fiche.lieuTravail') }}
            <input v-model="form.lieuTravail" :placeholder="t('fiche.phLieuTravail')" />
          </label>
          <label v-if="showSpecialite">{{ t('fiche.specialite') }}
            <input v-model="form.specialite" :placeholder="t('fiche.phSpecialite')" />
          </label>
          <label class="full">{{ t('fiche.nouveauMotDePasse') }}
            <input v-model="form.password" type="password" :placeholder="t('fiche.phMotDePasse')" />
          </label>

          <p v-if="message" class="msg" :class="messageType">{{ message }}</p>

          <div class="actions full">
            <button type="submit" class="save-btn" :style="{ background: accent }" :disabled="saving">
              {{ saving ? t('fiche.enregistrement') : t('fiche.enregistrer') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Bilan d'activité : réservé aux éducatrices et psychologues -->
    <section v-if="estProfessionnel" class="bilan">
      <h2><Icone nom="tendance" :taille="20" /> {{ t('bilan.titre') }}</h2>

      <Chargement v-if="chargementBilan" :nombre="2" />

      <template v-else-if="bilan">
        <div class="chiffres">
          <article class="chiffre">
            <Icone nom="agenda" :taille="20" :style="{ color: accent }" />
            <strong>{{ bilan.evenements.total }}</strong>
            <span>{{ t('bilan.rencontres') }}</span>
            <small>{{ t('bilan.dontEnLigne', { n: bilan.evenements.enLigne }) }}</small>
          </article>
          <article class="chiffre">
            <Icone nom="personnes" :taille="20" :style="{ color: accent }" />
            <strong>{{ bilan.evenements.totalInscrits }}</strong>
            <span>{{ t('bilan.inscriptions') }}</span>
            <small>{{ t('bilan.moyenneParRencontre', { n: bilan.evenements.moyenneInscrits }) }}</small>
          </article>
          <article class="chiffre">
            <Icone nom="crayon" :taille="20" :style="{ color: accent }" />
            <strong>{{ bilan.publications.total }}</strong>
            <span>{{ t('bilan.publications') }}</span>
            <small>{{ t('bilan.interactions', { n: bilan.publications.interactionsParPublication }) }}</small>
          </article>
          <article class="chiffre">
            <Icone nom="livre" :taille="20" :style="{ color: accent }" />
            <strong>{{ bilan.ressources.total }}</strong>
            <span>{{ t('bilan.ressources') }}</span>
            <small v-if="bilan.ressources.noteMoyenne">
              {{ t('bilan.noteMoyenne', { n: bilan.ressources.noteMoyenne }) }}
            </small>
            <small v-else>{{ t('bilan.pasDeNote') }}</small>
          </article>
        </div>

        <!-- Détail des rencontres animées -->
        <div class="panneau">
          <h3><Icone nom="agenda" :taille="17" /> {{ t('bilan.mesRencontres') }}</h3>
          <p v-if="!bilan.evenements.detail.length" class="vide">{{ t('bilan.aucuneRencontre') }}</p>
          <ul v-else class="rencontres">
            <li v-for="ev in bilan.evenements.detail" :key="ev.id" :class="{ annule: ev.annule }">
              <div class="rencontre-tete">
                <strong>{{ ev.titre }}</strong>
                <span class="etiquettes">
                  <span v-if="ev.enLigne" class="etiq enligne">{{ t('bilan.enLigne') }}</span>
                  <span v-if="ev.annule" class="etiq annulee">{{ t('bilan.annulee') }}</span>
                </span>
              </div>
              <div class="rencontre-meta">
                <span>{{ formaterDate(ev.date) }}</span>
                <span>{{ t('bilan.inscritsSur', { n: ev.inscrits, total: ev.places ?? '—' }) }}</span>
              </div>
              <div v-if="ev.remplissage !== null" class="jauge" :title="`${ev.remplissage}%`">
                <span :style="{ width: Math.min(ev.remplissage, 100) + '%', background: accent }"></span>
              </div>
              <p v-if="ev.participants.length" class="participants">
                <Icone nom="personnes" :taille="14" />
                {{ ev.participants.map(p => p.nom).filter(Boolean).join(' · ') }}
              </p>
            </li>
          </ul>
        </div>

        <!-- Qui suit ce professionnel -->
        <div class="panneau">
          <h3><Icone nom="coeur" :taille="17" /> {{ t('bilan.audience') }}</h3>
          <p class="explication">{{ t('bilan.audienceExplication') }}</p>
          <p v-if="!bilan.audience.length" class="vide">{{ t('bilan.aucuneAudience') }}</p>
          <ul v-else class="audience">
            <li v-for="p in bilan.audience" :key="p.id">
              <span class="pastille" :style="{ background: accent }">{{ (p.nom || '?').charAt(0).toUpperCase() }}</span>
              <span class="qui">
                <strong>{{ p.nom }}</strong>
                <small>{{ roleLibelle(p.role) }}</small>
              </span>
              <span class="canaux">
                <span v-if="p.inscriptions" :title="t('bilan.inscriptions')">
                  <Icone nom="agenda" :taille="14" /> {{ p.inscriptions }}
                </span>
                <span v-if="p.likes" :title="t('reactions.jaime')">
                  <Icone nom="coeur" :taille="14" /> {{ p.likes }}
                </span>
                <span v-if="p.commentaires" :title="t('bilan.commentaires')">
                  <Icone nom="bulle" :taille="14" /> {{ p.commentaires }}
                </span>
              </span>
            </li>
          </ul>
        </div>
      </template>

      <p v-else class="vide">{{ t('bilan.indisponible') }}</p>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { t, langue } from '../i18n'
import Icone from './Icone.vue'
import ChampTelephone from './ChampTelephone.vue'
import Chargement from './Chargement.vue'
import { notify } from '../services/notify'
import {
  mettreAJourProfil, envoyerPhotoProfil, retirerPhotoProfil,
  urlPhotoProfil, bilanProfessionnel,
} from '../services/authService'

const props = defineProps({
  role: { type: String, default: 'PARENT' },
  accent: { type: String, default: '#D2B48C' }
})

const roleLibelle = (r) => ({
  PARENT: t('roles.parent'),
  EDUCATEUR: t('roles.educatrice'),
  PSY: t('roles.psychologue'),
  ADMIN: t('roles.admin'),
}[r] || r || '')

const roleLabel = computed(() => roleLibelle(props.role))
const showWork = computed(() => ['EDUCATEUR', 'PSY'].includes(props.role))
const showSpecialite = computed(() => props.role === 'PSY')
const estProfessionnel = computed(() => ['EDUCATEUR', 'PSY'].includes(props.role))

const stored = JSON.parse(localStorage.getItem('user') || '{}')
const form = reactive({
  nom: stored.nom || '', email: stored.email || '', telephone: stored.telephone || '',
  adresse: stored.adresse || '', lieuTravail: stored.lieuTravail || '', specialite: stored.specialite || '',
  password: ''
})
const initial = computed(() => (form.nom ? form.nom.charAt(0).toUpperCase() : '?'))

// --- Photo de profil ---
const fichierPhoto = ref(null)
const envoiPhoto = ref(false)
const photoCassee = ref(false)
const aPhoto = ref(!!stored.aphoto)
// Change à chaque envoi pour contourner le cache du navigateur
const versionPhoto = ref(Date.now())

const photoVisible = computed(() => aPhoto.value && !photoCassee.value)
const urlPhoto = computed(() => urlPhotoProfil(stored.id, versionPhoto.value))

async function choisirPhoto(e) {
  const fichier = e.target.files?.[0]
  e.target.value = ''
  if (!fichier) return
  if (fichier.size > 2 * 1024 * 1024) {
    notify.error(t('notif.oups'), t('fiche.photoTropLourde'))
    return
  }
  envoiPhoto.value = true
  try {
    const data = await envoyerPhotoProfil(fichier, stored.id)
    if (data?.user) localStorage.setItem('user', JSON.stringify({ ...stored, ...data.user }))
    aPhoto.value = true
    photoCassee.value = false
    versionPhoto.value = Date.now()
    notify.success(t('notif.cestFait') || t('fiche.photoMiseAJour'), t('fiche.photoMiseAJour'))
  } catch (err) {
    notify.error(t('notif.oups'), err.response?.data?.error || t('fiche.photoEchec'))
  } finally {
    envoiPhoto.value = false
  }
}

function demanderRetrait() {
  notify.confirmDelete(t('fiche.cettePhoto'), retirerPhoto)
}

async function retirerPhoto() {
  envoiPhoto.value = true
  try {
    const data = await retirerPhotoProfil(stored.id)
    if (data?.user) localStorage.setItem('user', JSON.stringify({ ...stored, ...data.user }))
    aPhoto.value = false
  } catch (err) {
    notify.error(t('notif.oups'), err.response?.data?.error || t('fiche.photoEchec'))
  } finally {
    envoiPhoto.value = false
  }
}

// --- Enregistrement du profil ---
const telValide = ref(true)
const saving = ref(false)
const message = ref('')
const messageType = ref('success')

async function save() {
  if (!telValide.value) {
    message.value = t('fiche.telephoneInvalide')
    messageType.value = 'error'
    return
  }
  saving.value = true
  message.value = ''
  try {
    const data = await mettreAJourProfil({
      nom: form.nom, email: form.email, telephone: form.telephone,
      adresse: form.adresse, lieuTravail: form.lieuTravail, specialite: form.specialite,
      password: form.password || null, role: props.role
    }, stored.id)
    if (data.user) localStorage.setItem('user', JSON.stringify({ ...stored, ...data.user }))
    form.password = ''
    message.value = t('fiche.profilMisAJour')
    messageType.value = 'success'
  } catch (e) {
    message.value = e.response?.data?.error || t('fiche.enregistrementImpossible')
    messageType.value = 'error'
  } finally {
    saving.value = false
  }
}

// --- Bilan d'activité ---
const bilan = ref(null)
const chargementBilan = ref(false)

const formaterDate = (d) => {
  if (!d) return ''
  const locale = langue.value === 'en' ? 'en-GB' : 'fr-FR'
  return new Date(d).toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' })
}

onMounted(async () => {
  if (!estProfessionnel.value || !stored.id) return
  chargementBilan.value = true
  try {
    bilan.value = await bilanProfessionnel(stored.id)
  } catch {
    bilan.value = null
  } finally {
    chargementBilan.value = false
  }
})
</script>

<style scoped>
.profile-page { max-width: 760px; margin: 0 auto; padding: 20px; }
.profile-card { background: #fff; border-radius: 28px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,.08); position: relative; }
.profile-banner { height: 110px; opacity: .85; }

/* --- Avatar --- */
.avatar-zone { position: absolute; top: 66px; left: 50%; transform: translateX(-50%); }
.profile-avatar {
  width: 92px; height: 92px; border-radius: 50%; color: #fff; font-size: 2rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center; border: 4px solid #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,.15); overflow: hidden;
}
.profile-avatar img { width: 100%; height: 100%; object-fit: cover; }
.avatar-action {
  position: absolute; bottom: 2px; right: -2px;
  width: 30px; height: 30px; border-radius: 50%; border: 2px solid #fff;
  color: #fff; display: grid; place-items: center; cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,.2); transition: transform .25s cubic-bezier(.34,1.56,.64,1);
}
.avatar-action:hover:not(:disabled) { transform: scale(1.12); }
.avatar-action:disabled { opacity: .5; cursor: wait; }
.avatar-action.retirer { left: -2px; right: auto; background: #b4574a !important; }

.profile-body { padding: 62px 28px 30px; text-align: center; }
.profile-body h1 { font-size: 1.5rem; color: #2d2d2d; margin: 0 0 8px; }
.role-chip { display: inline-block; border: 1px solid; border-radius: 20px; padding: 3px 14px; font-size: .78rem; font-weight: 700; }
.aide { color: #a99e90; font-size: .74rem; margin: 10px 0 18px; }

.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; text-align: left; }
.grid .full { grid-column: 1 / -1; }
.grid label { display: flex; flex-direction: column; font-size: .78rem; font-weight: 600; color: #6b5d4f; gap: 5px; }
.grid input { border: 1px solid #e9e4df; border-radius: 12px; padding: 10px 12px; font-size: .9rem; background: #fafafa; color: #2d2d2d; }
.grid input:focus { outline: none; border-color: #c9b08c; background: #fff; }
.msg { margin: 0; font-size: .85rem; }
.msg.success { color: #4e7a45; }
.msg.error { color: #c0563f; }
.actions { display: flex; justify-content: center; margin-top: 6px; }
.save-btn { border: none; color: #fff; font-weight: 700; padding: 12px 28px; border-radius: 30px; cursor: pointer; transition: opacity .2s; }
.save-btn:hover:not(:disabled) { opacity: .9; }
.save-btn:disabled { opacity: .6; cursor: not-allowed; }

/* --- Bilan --- */
.bilan { margin-top: 26px; }
.bilan h2 {
  display: flex; align-items: center; gap: 9px;
  font-size: 1.1rem; color: #3E2C1F; margin: 0 0 16px;
}
.chiffres { display: grid; grid-template-columns: repeat(auto-fit, minmax(158px, 1fr)); gap: 12px; margin-bottom: 18px; }
.chiffre {
  background: #fff; border: 1px solid #EFE7DC; border-radius: 20px; padding: 16px 14px;
  display: flex; flex-direction: column; gap: 2px;
  transition: transform .28s cubic-bezier(.34,1.56,.64,1), box-shadow .28s;
}
.chiffre:hover { transform: translateY(-3px); box-shadow: 0 10px 24px rgba(62,44,31,.09); }
.chiffre strong { font-size: 1.7rem; font-weight: 800; color: #3E2C1F; line-height: 1.1; margin-top: 6px; }
.chiffre span { font-size: .78rem; font-weight: 700; color: #6b5d4f; }
.chiffre small { font-size: .7rem; color: #a99e90; }

.panneau { background: #fff; border: 1px solid #EFE7DC; border-radius: 22px; padding: 20px; margin-bottom: 14px; }
.panneau h3 { display: flex; align-items: center; gap: 8px; font-size: .95rem; color: #3E2C1F; margin: 0 0 6px; }
.explication { font-size: .74rem; color: #a99e90; margin: 0 0 14px; }
.vide { font-size: .84rem; color: #a99e90; margin: 6px 0 0; }

.rencontres, .audience { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
.rencontres li { border-top: 1px solid #F4EDE3; padding-top: 12px; }
.rencontres li:first-child { border-top: none; padding-top: 4px; }
.rencontres li.annule { opacity: .55; }
.rencontre-tete { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.rencontre-tete strong { font-size: .9rem; color: #3E2C1F; }
.etiquettes { display: flex; gap: 6px; flex-shrink: 0; }
.etiq { font-size: .62rem; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; padding: 3px 8px; border-radius: 20px; }
.etiq.enligne { background: #EAF5EC; color: #3f7a4a; }
.etiq.annulee { background: #FBECE9; color: #b4574a; }
.rencontre-meta { display: flex; gap: 14px; font-size: .74rem; color: #a99e90; margin-top: 3px; }
.jauge { height: 5px; background: #F4EDE3; border-radius: 6px; overflow: hidden; margin-top: 8px; }
.jauge span { display: block; height: 100%; border-radius: 6px; transition: width .6s ease; }
.participants { display: flex; align-items: center; gap: 6px; font-size: .74rem; color: #6b5d4f; margin: 8px 0 0; }

.audience li { display: flex; align-items: center; gap: 11px; border-top: 1px solid #F4EDE3; padding-top: 11px; }
.audience li:first-child { border-top: none; padding-top: 0; }
.pastille { width: 32px; height: 32px; border-radius: 50%; color: #fff; font-weight: 800; font-size: .82rem; display: grid; place-items: center; flex-shrink: 0; }
.qui { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.qui strong { font-size: .86rem; color: #3E2C1F; }
.qui small { font-size: .7rem; color: #a99e90; }
.canaux { display: flex; gap: 12px; font-size: .78rem; color: #6b5d4f; flex-shrink: 0; }
.canaux span { display: inline-flex; align-items: center; gap: 4px; }

@media (max-width: 520px) { .grid { grid-template-columns: 1fr; } }
</style>
