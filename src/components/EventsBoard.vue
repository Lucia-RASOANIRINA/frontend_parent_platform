<template>
  <div class="events-page">
    <!-- En-tête -->
    <header class="events-head">
      <span class="eyebrow">AGENDA PARENTIA</span>
      <h1>{{ title }}</h1>
      <p class="lead">{{ subtitle }}</p>

      <button v-if="canCreate" class="create-btn" @click="openCreate">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        {{ isEducatrice && !isAdmin ? 'Planifier une conférence en ligne' : 'Créer un évènement' }}
      </button>
    </header>

    <!-- Filtres par type : Tous / Ateliers / Conférences -->
    <div class="filters">
      <button
        v-for="f in typeFilters"
        :key="f.value"
        class="filter-pill"
        :class="{ active: activeType === f.value }"
        @click="activeType = f.value">
        <span v-html="f.icon" class="pill-icon"></span>{{ f.label }}
      </button>
    </div>

    <!-- États -->
    <div v-if="loading" class="state-box">
      <svg class="spin" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" d="M12 3a9 9 0 1 0 9 9" />
      </svg>
      <span>Chargement des évènements…</span>
    </div>

    <div v-else-if="error" class="state-box error">
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
      </svg>
      <span>{{ error }}</span>
      <button class="retry" @click="load">Réessayer</button>
    </div>

    <div v-else-if="filteredEvents.length === 0" class="state-box">
      <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
      </svg>
      <span>Aucun évènement pour le moment.</span>
    </div>

    <!-- Grille d'évènements -->
    <section v-else class="events-grid">
      <article class="event-card" v-for="ev in filteredEvents" :key="ev.id" :class="ev.type">
        <div class="card-top">
          <div class="event-date">
            <span class="day">{{ dayOf(ev.date) }}</span>
            <span class="month">{{ monthOf(ev.date) }}</span>
          </div>
          <div class="tags">
            <span class="event-tag" :class="ev.type">{{ typeLabel(ev.type) }}</span>
            <span v-if="ev.online" class="event-tag online">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z"/></svg>
              En ligne
            </span>
          </div>
        </div>

        <h3>{{ ev.titre }}</h3>
        <p class="desc">{{ ev.description }}</p>

        <div class="event-meta">
          <span class="meta-item">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9" /><path stroke-linecap="round" d="M12 7v5l3 2" /></svg>
            {{ ev.heureDebut }}<span v-if="ev.heureFin"> — {{ ev.heureFin }}</span>
          </span>
          <span class="meta-item">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" /><circle cx="12" cy="11" r="3" /></svg>
            {{ ev.lieu }}
          </span>
          <span class="meta-item" v-if="ev.animateur">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4" /><path stroke-linecap="round" d="M4 21c0-3.314 3.582-6 8-6s8 2.686 8 6" /></svg>
            {{ ev.animateur }}
          </span>
        </div>

        <div class="card-footer">
          <div class="seats-wrap">
            <div class="seats-bar"><div class="seats-fill" :style="{ width: fillPct(ev) + '%' }"></div></div>
            <span class="seats" :class="{ low: ev.placesRestantes <= 3 }">{{ ev.placesRestantes }} / {{ ev.capacite }} places</span>
          </div>

          <div class="card-actions">
            <!-- Rejoindre la réunion en ligne -->
            <a v-if="ev.online && ev.meetingUrl && (ev.estInscrit || canManageEvent(ev))"
               :href="ev.meetingUrl" target="_blank" rel="noopener" class="join-btn">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z"/></svg>
              Rejoindre
            </a>

            <!-- Gestion (admin sur tout, éducatrice sur ses conférences) -->
            <template v-if="canManageEvent(ev)">
              <button class="icon-btn edit" @click="openEdit(ev)" title="Modifier">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828z" /></svg>
              </button>
              <button class="icon-btn delete" @click="askDelete(ev)" title="Supprimer">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16" /></svg>
              </button>
            </template>

            <!-- Inscription (utilisateurs) -->
            <button v-else
              class="register-btn"
              :class="{ registered: ev.estInscrit, full: !ev.estInscrit && ev.placesRestantes <= 0 }"
              :disabled="busyId === ev.id || (!ev.estInscrit && ev.placesRestantes <= 0)"
              @click="toggleInscription(ev)">
              <span v-if="busyId === ev.id">…</span>
              <span v-else-if="ev.estInscrit">✓ Inscrit</span>
              <span v-else-if="ev.placesRestantes <= 0">Complet</span>
              <span v-else>S'inscrire</span>
            </button>
          </div>
        </div>
      </article>
    </section>

    <!-- Modale création / édition -->
    <div v-if="formOpen" class="modal-overlay" @click.self="formOpen = false">
      <div class="modal">
        <h2>{{ editing ? "Modifier l'évènement" : (isEducatrice && !isAdmin ? "Planifier une conférence en ligne" : "Nouvel évènement") }}</h2>
        <form @submit.prevent="submitForm" class="form-grid">
          <label class="full">Titre
            <input v-model="form.titre" required placeholder="Titre de l'évènement" />
          </label>
          <label class="full">Description
            <textarea v-model="form.description" rows="3" placeholder="Décrivez l'évènement…"></textarea>
          </label>
          <label>Type
            <select v-model="form.type" :disabled="isEducatrice && !isAdmin">
              <option value="atelier" v-if="isAdmin">Atelier</option>
              <option value="conference">Conférence</option>
            </select>
          </label>
          <label>Date
            <input v-model="form.date" type="date" required />
          </label>
          <label>Heure début
            <input v-model="form.heureDebut" placeholder="10h00" />
          </label>
          <label>Heure fin
            <input v-model="form.heureFin" placeholder="11h30" />
          </label>
          <label>Lieu
            <input v-model="form.lieu" placeholder="En ligne / Antananarivo" :disabled="form.online" />
          </label>
          <label>Animateur
            <input v-model="form.animateur" placeholder="Nom de l'intervenant" />
          </label>
          <label>Places
            <input v-model.number="form.capacite" type="number" min="1" :max="form.online ? 4 : undefined" />
          </label>

          <!-- Réunion en ligne (visio type Google Meet) -->
          <label class="full check" v-if="form.type === 'conference'">
            <input type="checkbox" v-model="form.online" :disabled="isEducatrice && !isAdmin" />
            <span>Réunion en ligne (visio) — limitée à 4 participants, lien généré automatiquement</span>
          </label>

          <p v-if="formError" class="form-error full">{{ formError }}</p>
          <div class="form-actions full">
            <button type="button" class="ghost" @click="formOpen = false">Annuler</button>
            <button type="submit" class="primary" :disabled="saving">
              {{ saving ? 'Enregistrement…' : (editing ? 'Mettre à jour' : 'Créer') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirmation suppression -->
    <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
      <div class="modal confirm">
        <h3>Supprimer cet évènement ?</h3>
        <p>« {{ deleteTarget.titre }} » sera définitivement supprimé.</p>
        <div class="form-actions">
          <button class="ghost" @click="deleteTarget = null">Annuler</button>
          <button class="danger" @click="confirmDelete">Supprimer</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  fetchEvenements, createEvenement, updateEvenement, deleteEvenement,
  inscrireEvenement, desinscrireEvenement, getCurrentUser
} from '../services/evenementService'
import { notify } from '../services/notify'

const props = defineProps({
  title: { type: String, default: 'Événements à venir' },
  subtitle: { type: String, default: "Ateliers et conférences pour accompagner les parents et les professionnels de la petite enfance." },
  showAll: { type: Boolean, default: false }
})

// --- Rôle & permissions ---
const user = getCurrentUser()
const role = user?.role || null
const isAdmin = computed(() => role === 'ADMIN')
const isEducatrice = computed(() => role === 'EDUCATEUR')
// Admin crée tout ; éducatrice crée uniquement des conférences en ligne
const canCreate = computed(() => isAdmin.value || isEducatrice.value)

function canManageEvent(ev) {
  if (isAdmin.value) return true
  if (isEducatrice.value && ev.createdById && user && ev.createdById === user.id) return true
  return false
}

const events = ref([])
const loading = ref(true)
const error = ref('')
const busyId = ref(null)
const activeType = ref('')

const ICON_ALL = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>'
const ICON_ATELIER = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828z"/></svg>'
const ICON_CONF = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M18 8a6 6 0 0 1-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1 1 18 8z"/></svg>'

const typeFilters = [
  { value: '', label: 'Tous', icon: ICON_ALL },
  { value: 'atelier', label: 'Ateliers', icon: ICON_ATELIER },
  { value: 'conference', label: 'Conférences', icon: ICON_CONF }
]

const filteredEvents = computed(() =>
  activeType.value ? events.value.filter(e => e.type === activeType.value) : events.value
)

const MONTHS = ['JANV', 'FÉVR', 'MARS', 'AVR', 'MAI', 'JUIN', 'JUIL', 'AOÛT', 'SEPT', 'OCT', 'NOV', 'DÉC']
const dayOf = (d) => d ? String(new Date(d).getDate()).padStart(2, '0') : '--'
const monthOf = (d) => d ? MONTHS[new Date(d).getMonth()] : ''
const typeLabel = (t) => ({ atelier: 'Atelier', conference: 'Conférence' }[t] || t)
const fillPct = (ev) => {
  const cap = ev.capacite || 0
  if (!cap) return 0
  return Math.min(100, Math.round(((cap - ev.placesRestantes) / cap) * 100))
}

// Notifications unifiées
function showToast(msg, type = 'success') {
  if (type === 'error') notify.error('Oups', msg)
  else notify.success('C\'est fait', msg)
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    events.value = await fetchEvenements({ all: props.showAll })
  } catch (e) {
    error.value = "Impossible de charger les évènements. Le serveur est-il démarré ?"
  } finally {
    loading.value = false
  }
}

async function toggleInscription(ev) {
  if (!user) {
    notify.visitor("Connectez-vous ou inscrivez-vous pour participer aux ateliers et conférences de la communauté.")
    return
  }
  busyId.value = ev.id
  try {
    const res = ev.estInscrit ? await desinscrireEvenement(ev.id) : await inscrireEvenement(ev.id)
    if (res.evenement) Object.assign(ev, res.evenement)
    showToast(ev.estInscrit ? 'Inscription confirmée ✓' : 'Désinscription effectuée')
  } catch (e) {
    showToast(e.response?.data?.error || "Action impossible", 'error')
  } finally {
    busyId.value = null
  }
}

// ---- Formulaire ----
const formOpen = ref(false)
const editing = ref(false)
const saving = ref(false)
const formError = ref('')
const emptyForm = () => ({
  titre: '', description: '',
  type: (isEducatrice.value && !isAdmin.value) ? 'conference' : 'atelier',
  date: '', heureDebut: '', heureFin: '', lieu: '', animateur: user?.nom || '',
  capacite: 20, online: (isEducatrice.value && !isAdmin.value), meetingUrl: '', id: null
})
const form = ref(emptyForm())

function openCreate() {
  editing.value = false
  formError.value = ''
  form.value = emptyForm()
  formOpen.value = true
}
function openEdit(ev) {
  editing.value = true
  formError.value = ''
  form.value = { ...ev }
  formOpen.value = true
}

async function submitForm() {
  if (!form.value.titre || !form.value.date) {
    formError.value = 'Le titre et la date sont requis.'
    return
  }
  // Éducatrice : forcer conférence en ligne, max 4
  if (isEducatrice.value && !isAdmin.value) {
    form.value.type = 'conference'
    form.value.online = true
  }
  if (form.value.online) {
    form.value.type = 'conference'
    if (!form.value.capacite || form.value.capacite > 4) form.value.capacite = 4
  }
  saving.value = true
  try {
    if (editing.value) {
      await updateEvenement(form.value.id, form.value)
      showToast('Évènement mis à jour ✓')
    } else {
      await createEvenement(form.value)
      showToast(form.value.online ? 'Conférence en ligne planifiée ✓' : 'Évènement créé ✓')
    }
    formOpen.value = false
    await load()
  } catch (e) {
    formError.value = e.response?.data?.error || "Enregistrement impossible."
  } finally {
    saving.value = false
  }
}

// ---- Suppression ----
const deleteTarget = ref(null)
function askDelete(ev) { deleteTarget.value = ev }
async function confirmDelete() {
  try {
    await deleteEvenement(deleteTarget.value.id)
    showToast('Évènement supprimé')
    deleteTarget.value = null
    await load()
  } catch (e) {
    showToast('Suppression impossible', 'error')
  }
}

onMounted(load)
</script>

<style scoped>
.events-page { max-width: 1080px; margin: 0 auto; padding: 20px; }
.events-head { text-align: center; padding: 6px 20px 12px; }
.eyebrow { display: inline-block; font-size: 12px; letter-spacing: 3px; font-weight: 700; color: #C19A6B; margin-bottom: 12px; }
.events-head h1 { font-size: 2.5rem; font-weight: 800; color: #3E2C1F; margin: 0 0 12px; letter-spacing: -.02em; }
.lead { max-width: 640px; margin: 0 auto; color: #6b5d4f; line-height: 1.7; }
.create-btn {
  margin-top: 20px; display: inline-flex; align-items: center; gap: 8px;
  background: linear-gradient(135deg, #C19A6B, #6F4E37); color: #fff; border: none;
  font-weight: 700; padding: 12px 24px; border-radius: 30px; cursor: pointer;
  box-shadow: 0 8px 20px rgba(111,78,55,.25); transition: transform .2s, box-shadow .2s;
}
.create-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 26px rgba(111,78,55,.35); }

.filters { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin: 10px 0 28px; }
.filter-pill {
  display: inline-flex; align-items: center; gap: 7px;
  border: 1px solid #EDE4D8; background: #fff; color: #6b5d4f; border-radius: 30px;
  padding: 9px 20px; font-size: .85rem; font-weight: 600; cursor: pointer; transition: all .2s;
}
.pill-icon { display: inline-flex; }
.filter-pill:hover { border-color: #C19A6B; transform: translateY(-1px); }
.filter-pill.active { background: linear-gradient(135deg, #C19A6B, #6F4E37); border-color: transparent; color: #fff; }

.state-box { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px 20px; color: #8a7c6d; text-align: center; }
.state-box.error { color: #c0563f; }
.state-box .retry { border: 1px solid #C19A6B; background: #fff; color: #8a6d4b; padding: 8px 20px; border-radius: 30px; cursor: pointer; font-weight: 600; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Grille moderne */
.events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(330px, 1fr)); gap: 22px; }
.event-card {
  background: #fff; border-radius: 24px; padding: 22px; display: flex; flex-direction: column;
  border: 1px solid #F0E9E0; box-shadow: 0 6px 20px rgba(62,44,31,.06);
  transition: transform .22s, box-shadow .22s; position: relative; overflow: hidden;
}
.event-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #C19A6B, #6F4E37); }
.event-card.conference::before { background: linear-gradient(90deg, #6F4E37, #3E2C1F); }
.event-card:hover { transform: translateY(-5px); box-shadow: 0 18px 36px rgba(62,44,31,.14); }

.card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
.event-date {
  flex-shrink: 0; width: 66px; height: 66px; border-radius: 18px;
  background: linear-gradient(135deg, #C19A6B, #3E2C1F); color: #fff;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.event-date .day { font-size: 1.6rem; font-weight: 800; line-height: 1; }
.event-date .month { font-size: .65rem; letter-spacing: 1px; margin-top: 2px; }
.tags { display: flex; flex-direction: column; gap: 6px; align-items: flex-end; }
.event-tag { display: inline-flex; align-items: center; gap: 4px; font-size: .66rem; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; padding: 4px 11px; border-radius: 12px; background: rgba(193,154,107,.16); color: #8a6d4b; }
.event-tag.conference { background: rgba(62,44,31,.1); color: #3E2C1F; }
.event-tag.online { background: rgba(46,125,80,.14); color: #2E7D32; }

.event-card h3 { color: #3E2C1F; margin: 0 0 8px; font-size: 1.2rem; line-height: 1.3; }
.desc { color: #6b5d4f; margin: 0 0 14px; line-height: 1.6; font-size: .92rem; flex-grow: 1; }
.event-meta { display: flex; flex-direction: column; gap: 7px; margin-bottom: 16px; }
.meta-item { font-size: .82rem; color: #8a7c6d; display: inline-flex; align-items: center; gap: 7px; }
.meta-item svg { color: #C19A6B; flex-shrink: 0; }

.card-footer { border-top: 1px solid #F4EFE8; padding-top: 14px; display: flex; flex-direction: column; gap: 12px; }
.seats-wrap { display: flex; flex-direction: column; gap: 5px; }
.seats-bar { height: 6px; background: #F2ECE3; border-radius: 6px; overflow: hidden; }
.seats-fill { height: 100%; background: linear-gradient(90deg, #C19A6B, #6F4E37); border-radius: 6px; transition: width .4s; }
.seats { font-size: .72rem; color: #a99e90; }
.seats.low { color: #c0563f; font-weight: 600; }

.card-actions { display: flex; align-items: center; justify-content: flex-end; gap: 8px; }
.register-btn {
  border: none; cursor: pointer; background: linear-gradient(135deg, #C19A6B, #6F4E37);
  color: #fff; font-weight: 700; padding: 10px 24px; border-radius: 30px;
  transition: transform .2s, box-shadow .2s; font-size: .85rem;
}
.register-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 18px rgba(111,78,55,.3); }
.register-btn.registered { background: #4e7a45; }
.register-btn.full, .register-btn:disabled { background: #cfc7bb; cursor: not-allowed; }
.join-btn {
  display: inline-flex; align-items: center; gap: 6px; text-decoration: none;
  background: #2E7D32; color: #fff; font-weight: 700; font-size: .82rem;
  padding: 9px 18px; border-radius: 30px; transition: background .2s, transform .2s;
}
.join-btn:hover { background: #266a2a; transform: translateY(-2px); }
.icon-btn { border: 1px solid #EDE4D8; background: #fff; border-radius: 12px; padding: 8px; cursor: pointer; color: #8a6d4b; transition: all .2s; }
.icon-btn.edit:hover { border-color: #C19A6B; color: #3E2C1F; }
.icon-btn.delete:hover { border-color: #e0a89b; color: #c0563f; }

/* Modale */
.modal-overlay { position: fixed; inset: 0; background: rgba(62,44,31,.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 16px; }
.modal { background: #fff; border-radius: 28px; padding: 28px; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px rgba(0,0,0,.25); }
.modal h2 { color: #3E2C1F; margin: 0 0 18px; }
.modal.confirm { max-width: 420px; text-align: center; }
.modal.confirm h3 { color: #3E2C1F; margin: 0 0 10px; }
.modal.confirm p { color: #6b5d4f; margin: 0 0 20px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-grid .full { grid-column: 1 / -1; }
.form-grid label { display: flex; flex-direction: column; font-size: .78rem; font-weight: 600; color: #8a6d4b; gap: 5px; }
.form-grid label.check { flex-direction: row; align-items: center; gap: 9px; background: #FBF7F1; padding: 12px 14px; border-radius: 14px; color: #6b5d4f; font-weight: 500; }
.form-grid label.check input { width: auto; }
.form-grid input, .form-grid select, .form-grid textarea { border: 1px solid #EDE4D8; border-radius: 12px; padding: 10px 12px; font-size: .9rem; font-family: inherit; color: #3E2C1F; background: #fafafa; }
.form-grid input:focus, .form-grid select:focus, .form-grid textarea:focus { outline: none; border-color: #C19A6B; background: #fff; }
.form-error { color: #c0563f; font-size: .82rem; margin: 0; }
.form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 6px; }
.form-actions button { padding: 10px 22px; border-radius: 30px; font-weight: 700; cursor: pointer; border: none; }
.ghost { background: #f0ede9; color: #6b5d4f; }
.primary { background: linear-gradient(135deg, #C19A6B, #6F4E37); color: #fff; }
.danger { background: #c0563f; color: #fff; }
.primary:disabled { opacity: .6; cursor: not-allowed; }

/* Toast */
.toast { position: fixed; top: 24px; left: 50%; transform: translateX(-50%); z-index: 1100; background: #3E2C1F; color: #fff; padding: 12px 24px; border-radius: 30px; font-weight: 600; box-shadow: 0 10px 30px rgba(0,0,0,.2); }
.toast.error { background: #c0563f; }
.toast-enter-active, .toast-leave-active { transition: all .3s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, -10px); }

@media (max-width: 560px) {
  .events-head h1 { font-size: 2rem; }
  .events-grid { grid-template-columns: 1fr; }
  .form-grid { grid-template-columns: 1fr; }
}
</style>
