<template>
  <div class="users-admin">
    <header class="head">
      <div>
        <h1>{{ t('admin.utilisateurs') }}</h1>
        <p>{{ t('admin.comptes', { n: filtered.length }) }}</p>
      </div>
      <div class="tools">
        <div class="search">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="7" /><path stroke-linecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input v-model="query" :placeholder="t('admin.rechercher')" />
        </div>
        <select v-model="roleFilter" class="role-select">
          <option value="">{{ t('admin.tousLesRoles') }}</option>
          <option value="PARENT">{{ t('roles.parents') }}</option>
          <option value="EDUCATEUR">{{ t('roles.educatrices') }}</option>
          <option value="PSY">{{ t('roles.psychologues') }}</option>
          <option value="ADMIN">{{ t('roles.admins') }}</option>
        </select>
      </div>
    </header>

    <div v-if="error" class="error-banner">{{ error }}</div>

    <Chargement v-if="loading" variante="silhouettes" :nombre="4" />

    <div v-else class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>{{ t('admin.utilisateur') }}</th>
            <th>{{ t('admin.email') }}</th>
            <th>{{ t('admin.role') }}</th>
            <th class="right">{{ t('admin.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in filtered" :key="u.id">
            <td>
              <div class="user-cell">
                <span class="avatar" :style="{ background: roleColor(u.role) }">{{ initial(u.nom) }}</span>
                <span class="name">{{ u.nom }}</span>
              </div>
            </td>
            <td class="email">{{ u.email }}</td>
            <td>
              <select :value="u.role" @change="onRoleChange(u, $event.target.value)" class="role-badge-select"
                      :disabled="u.role === 'ADMIN'" :title="u.role === 'ADMIN' ? t('admin.roleAdminFige') : ''"
                      :style="{ color: roleColor(u.role), borderColor: roleColor(u.role) }">
                <option v-if="u.role === 'ADMIN'" value="ADMIN">{{ t('roles.admin') }}</option>
                <option value="PARENT">{{ t('roles.parent') }}</option>
                <option value="EDUCATEUR">{{ t('roles.educatrice') }}</option>
                <option value="PSY">{{ t('roles.psychologue') }}</option>
              </select>
            </td>
            <td class="right">
              <button class="del-btn" @click="askDelete(u)" :title="t('admin.supprimer')">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </td>
          </tr>
          <tr v-if="filtered.length === 0">
            <td colspan="4" class="empty">{{ t('admin.aucunUtilisateur') }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Confirmation suppression -->
    <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
      <div class="modal">
        <h3>{{ t('admin.supprimerCompte') }}</h3>
        <p>{{ t('admin.supprimerDefinitivement', { nom: deleteTarget.nom, email: deleteTarget.email }) }}</p>
        <div class="actions">
          <button class="ghost" @click="deleteTarget = null">{{ t('admin.annuler') }}</button>
          <button class="danger" @click="confirmDelete">{{ t('admin.supprimer') }}</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { t } from '../i18n'
import Chargement from '../components/Chargement.vue'
import { fetchUsers, changeUserRole, deleteUser } from '../services/adminService'
import { notify } from '../services/notify'

const users = ref([])
const loading = ref(true)
const error = ref('')
const query = ref('')
const roleFilter = ref('')

const filtered = computed(() => {
  let list = users.value
  if (roleFilter.value) list = list.filter(u => u.role === roleFilter.value)
  if (query.value.trim()) {
    const q = query.value.toLowerCase()
    list = list.filter(u => (u.nom || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q))
  }
  return list
})

const COLORS = { PARENT: '#6F4E37', EDUCATEUR: '#6F4E37', PSY: '#C19A6B', ADMIN: '#6F4E37' }
const roleColor = (r) => COLORS[r] || '#64748b'
const initial = (n) => (n ? n.charAt(0).toUpperCase() : '?')

function showToast(msg, type = 'success') {
  if (type === 'error') notify.error(t('admin.oups'), msg)
  else notify.success(t('admin.cestFait'), msg)
}

async function load() {
  loading.value = true; error.value = ''
  try {
    users.value = await fetchUsers()
  } catch (e) {
    error.value = t('admin.utilisateursIndisponibles')
  } finally {
    loading.value = false
  }
}

async function onRoleChange(user, newRole) {
  const old = user.role
  user.role = newRole
  try {
    await changeUserRole(user.id, newRole)
    showToast(t('admin.roleMisAJour', { nom: user.nom }))
  } catch (e) {
    user.role = old
    showToast(t('admin.changementRoleImpossible'), 'error')
  }
}

const deleteTarget = ref(null)
function askDelete(u) { deleteTarget.value = u }
async function confirmDelete() {
  const u = deleteTarget.value
  deleteTarget.value = null
  try {
    await deleteUser(u.id)
    users.value = users.value.filter(x => x.id !== u.id)
    showToast(t('admin.utilisateurSupprime'))
  } catch (e) {
    showToast(e.response?.data?.error || t('admin.suppressionImpossible'), 'error')
  }
}

onMounted(load)
</script>

<style scoped>
/* Même langage visuel que le tableau de bord : palette café, en-tête en
   panneau, tableau aéré. La page utilisait des gris bleutés isolés du reste. */
.users-admin {
  --sable: #C19A6B; --brun: #6F4E37; --brun-fonce: #3E2C1F;
  --creme: #FBF7F1; --bord: #EFE7DC; --doux: #6b5d4f; --discret: #a99e90;
  max-width: 1120px; margin: 0 auto; padding: 12px 20px 48px;
}

.head {
  display: flex; justify-content: space-between; align-items: flex-end;
  flex-wrap: wrap; gap: 18px; margin-bottom: 24px;
  padding: 30px; border-radius: 28px; border: 1px solid var(--bord);
  background: radial-gradient(120% 130% at 15% 0%, #FFFDFA 0%, #F8F1E7 55%, #F2E7D8 100%);
}
.head h1 { font-size: clamp(1.6rem, 3vw, 2.1rem); font-weight: 800; letter-spacing: -.02em; color: var(--brun-fonce); margin: 0; }
.head p { color: var(--doux); margin: 8px 0 0; font-size: .9rem; }
.tools { display: flex; gap: 10px; flex-wrap: wrap; }
.search {
  display: flex; align-items: center; gap: 9px; background: #fff;
  border: 1px solid var(--bord); border-radius: 30px; padding: 9px 16px; color: var(--discret);
  transition: border-color .2s, box-shadow .2s;
}
.search:focus-within { border-color: var(--sable); box-shadow: 0 0 0 4px rgba(193,154,107,.14); }
.search input { border: none; outline: none; font-size: .88rem; color: var(--brun-fonce); min-width: 200px; background: transparent; }
.role-select {
  border: 1px solid var(--bord); border-radius: 30px; padding: 9px 16px;
  color: var(--doux); background: #fff; font-size: .85rem; cursor: pointer;
}
.role-select:focus { outline: none; border-color: var(--sable); }

.error-banner { background: #FBEDE9; color: #a8482f; border: 1px solid #F0D6CD; padding: 13px 18px; border-radius: 16px; margin-bottom: 20px; font-size: .88rem; }
.state { padding: 48px; text-align: center; color: var(--discret); }

.table-wrap { background: #fff; border: 1px solid var(--bord); border-radius: 24px; overflow: hidden; box-shadow: 0 2px 6px rgba(62,44,31,.04); }
table { width: 100%; border-collapse: collapse; }
th {
  text-align: left; font-size: .68rem; text-transform: uppercase; letter-spacing: .1em;
  color: var(--discret); font-weight: 700; padding: 15px 20px;
  background: var(--creme); border-bottom: 1px solid var(--bord);
}
td { padding: 13px 20px; border-bottom: 1px solid #F6F1EA; font-size: .88rem; color: var(--doux); }
tbody tr { transition: background .18s; }
tbody tr:hover { background: #FDFAF6; }
tr:last-child td { border-bottom: none; }
.right { text-align: right; }
.user-cell { display: flex; align-items: center; gap: 11px; }
.avatar { width: 36px; height: 36px; border-radius: 50%; color: #fff; font-weight: 700; display: grid; place-items: center; font-size: .84rem; flex-shrink: 0; }
.name { font-weight: 600; color: var(--brun-fonce); }
.email { color: var(--discret); }
.role-badge-select {
  border: 1px solid; border-radius: 20px; padding: 5px 13px; font-size: .74rem;
  font-weight: 700; background: #fff; cursor: pointer;
}
.role-badge-select:disabled { opacity: .65; cursor: not-allowed; }
.del-btn {
  border: 1px solid var(--bord); background: #fff; color: #b4735f;
  border-radius: 12px; padding: 8px; cursor: pointer; transition: all .2s;
}
.del-btn:hover { background: #FBEDE9; border-color: #E9C9BE; color: #c0563f; }
.empty { text-align: center; color: var(--discret); padding: 40px; }

.modal-overlay { position: fixed; inset: 0; background: rgba(62,44,31,.48); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 16px; }
.modal { background: #fff; border-radius: 28px; padding: 30px; max-width: 430px; width: 100%; text-align: center; box-shadow: 0 30px 60px rgba(0,0,0,.26); }
.modal h3 { color: var(--brun-fonce); margin: 0 0 10px; }
.modal p { color: var(--doux); margin: 0 0 22px; font-size: .9rem; }
.actions { display: flex; justify-content: center; gap: 12px; }
.actions button { padding: 11px 24px; border-radius: 30px; font-weight: 700; cursor: pointer; border: none; font-size: .86rem; }
.ghost { background: #F1EDE8; color: var(--doux); }
.danger { background: #c0563f; color: #fff; }

.toast { position: fixed; top: 24px; left: 50%; transform: translateX(-50%); z-index: 1100; background: var(--brun-fonce); color: #fff; padding: 12px 24px; border-radius: 30px; font-weight: 600; box-shadow: 0 10px 30px rgba(0,0,0,.2); }
.toast.error { background: #c0563f; }
.toast-enter-active, .toast-leave-active { transition: all .3s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, -10px); }

@media (max-width: 640px) {
  .users-admin { padding: 8px 14px 36px; }
  .head { padding: 24px 20px; border-radius: 22px; }
  .search input { min-width: 0; }
}
@media (prefers-reduced-motion: reduce) { tbody tr, .del-btn, .search { transition: none; } }
</style>
