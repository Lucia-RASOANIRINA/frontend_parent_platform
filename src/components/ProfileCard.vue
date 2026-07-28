<template>
  <div class="profile-page">
    <div class="profile-card">
      <div class="profile-banner" :style="{ background: accent }"></div>
      <div class="profile-avatar" :style="{ background: accent }">{{ initial }}</div>

      <div class="profile-body">
        <h1>{{ form.nom || 'Mon profil' }}</h1>
        <span class="role-chip" :style="{ color: accent, borderColor: accent }">{{ roleLabel }}</span>

        <form @submit.prevent="save" class="grid">
          <label class="full">Nom complet
            <input v-model="form.nom" required />
          </label>
          <label class="full">Email
            <input v-model="form.email" type="email" required />
          </label>
          <label>Téléphone
            <input v-model="form.telephone" placeholder="+261 ..." />
          </label>
          <label>Adresse
            <input v-model="form.adresse" placeholder="Ville / quartier" />
          </label>
          <label v-if="showWork">Lieu de travail
            <input v-model="form.lieuTravail" placeholder="Établissement / cabinet" />
          </label>
          <label v-if="showSpecialite">Spécialité
            <input v-model="form.specialite" placeholder="Ex: Psychologie de l'enfant" />
          </label>
          <label class="full">Nouveau mot de passe (optionnel)
            <input v-model="form.password" type="password" placeholder="Laisser vide pour ne pas changer" />
          </label>

          <p v-if="message" class="msg" :class="messageType">{{ message }}</p>

          <div class="actions full">
            <button type="submit" class="save-btn" :style="{ background: accent }" :disabled="saving">
              {{ saving ? 'Enregistrement…' : 'Enregistrer les modifications' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import axios from 'axios'
import { API_BASE_URL } from '../services/evenementService'

const props = defineProps({
  role: { type: String, default: 'PARENT' },
  accent: { type: String, default: '#D2B48C' }
})

const ROLE_LABELS = { PARENT: 'Parent', EDUCATEUR: 'Éducatrice', PSY: 'Psychologue', ADMIN: 'Administrateur' }
const roleLabel = computed(() => ROLE_LABELS[props.role] || props.role)
const showWork = computed(() => ['EDUCATEUR', 'PSY'].includes(props.role))
const showSpecialite = computed(() => props.role === 'PSY')

const stored = JSON.parse(localStorage.getItem('user') || '{}')
const form = reactive({
  nom: stored.nom || '', email: stored.email || '', telephone: stored.telephone || '',
  adresse: stored.adresse || '', lieuTravail: stored.lieuTravail || '', specialite: stored.specialite || '',
  password: ''
})
const initial = computed(() => (form.nom ? form.nom.charAt(0).toUpperCase() : '?'))

const saving = ref(false)
const message = ref('')
const messageType = ref('success')

async function save() {
  saving.value = true
  message.value = ''
  try {
    const { data } = await axios.put(`${API_BASE_URL}/auth/profile`, {
      nom: form.nom, email: form.email, telephone: form.telephone,
      adresse: form.adresse, lieuTravail: form.lieuTravail, specialite: form.specialite,
      password: form.password || null, role: props.role
    }, { headers: { 'X-User-Id': stored.id } })

    if (data.user) {
      const updated = { ...stored, ...data.user }
      localStorage.setItem('user', JSON.stringify(updated))
    }
    form.password = ''
    message.value = 'Profil mis à jour avec succès ✓'
    messageType.value = 'success'
  } catch (e) {
    message.value = e.response?.data?.error || "Impossible d'enregistrer (backend démarré ?)"
    messageType.value = 'error'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.profile-page { max-width: 640px; margin: 0 auto; padding: 20px; }
.profile-card { background: #fff; border-radius: 28px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,.08); position: relative; }
.profile-banner { height: 110px; opacity: .85; }
.profile-avatar { width: 84px; height: 84px; border-radius: 50%; color: #fff; font-size: 2rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center; border: 4px solid #fff;
  position: absolute; top: 66px; left: 50%; transform: translateX(-50%); box-shadow: 0 4px 12px rgba(0,0,0,.15); }
.profile-body { padding: 56px 28px 30px; text-align: center; }
.profile-body h1 { font-size: 1.5rem; color: #2d2d2d; margin: 0 0 8px; }
.role-chip { display: inline-block; border: 1px solid; border-radius: 20px; padding: 3px 14px; font-size: .78rem;
  font-weight: 700; margin-bottom: 20px; }
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
@media (max-width: 520px) { .grid { grid-template-columns: 1fr; } }
</style>
