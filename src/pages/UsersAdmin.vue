<template>
  <div class="users-admin">
    <header class="head">
      <div>
        <h1>Utilisateurs</h1>
        <p>{{ filtered.length }} compte(s) — gérez les rôles et l'accès.</p>
      </div>
      <div class="tools">
        <div class="search">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="7" /><path stroke-linecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input v-model="query" placeholder="Rechercher par nom ou email…" />
        </div>
        <select v-model="roleFilter" class="role-select">
          <option value="">Tous les rôles</option>
          <option value="PARENT">Parents</option>
          <option value="EDUCATEUR">Éducatrices</option>
          <option value="PSY">Psychologues</option>
          <option value="ADMIN">Admins</option>
        </select>
      </div>
    </header>

    <div v-if="error" class="error-banner">{{ error }}</div>

    <div v-if="loading" class="state">Chargement…</div>

    <div v-else class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th>Email</th>
            <th>Rôle</th>
            <th class="right">Actions</th>
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
                      :disabled="u.role === 'ADMIN'" :title="u.role === 'ADMIN' ? 'Le rôle admin ne peut pas être modifié' : ''"
                      :style="{ color: roleColor(u.role), borderColor: roleColor(u.role) }">
                <option v-if="u.role === 'ADMIN'" value="ADMIN">Admin</option>
                <option value="PARENT">Parent</option>
                <option value="EDUCATEUR">Éducatrice</option>
                <option value="PSY">Psychologue</option>
              </select>
            </td>
            <td class="right">
              <button class="del-btn" @click="askDelete(u)" title="Supprimer">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </td>
          </tr>
          <tr v-if="filtered.length === 0">
            <td colspan="4" class="empty">Aucun utilisateur trouvé.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Confirmation suppression -->
    <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
      <div class="modal">
        <h3>Supprimer ce compte ?</h3>
        <p>« {{ deleteTarget.nom }} » ({{ deleteTarget.email }}) sera supprimé définitivement.</p>
        <div class="actions">
          <button class="ghost" @click="deleteTarget = null">Annuler</button>
          <button class="danger" @click="confirmDelete">Supprimer</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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
  if (type === 'error') notify.error('Oups', msg)
  else notify.success('C\'est fait', msg)
}

async function load() {
  loading.value = true; error.value = ''
  try {
    users.value = await fetchUsers()
  } catch (e) {
    error.value = "Impossible de charger les utilisateurs. Backend démarré (port 8082) ?"
  } finally {
    loading.value = false
  }
}

async function onRoleChange(user, newRole) {
  const old = user.role
  user.role = newRole
  try {
    await changeUserRole(user.id, newRole)
    showToast(`Rôle de ${user.nom} mis à jour`)
  } catch (e) {
    user.role = old
    showToast('Changement de rôle impossible', 'error')
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
    showToast('Utilisateur supprimé')
  } catch (e) {
    showToast(e.response?.data?.error || 'Suppression impossible', 'error')
  }
}

onMounted(load)
</script>

<style scoped>
.users-admin { max-width: 1100px; margin: 0 auto; padding: 24px 20px; }
.head { display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; }
.head h1 { font-size: 2rem; font-weight: 800; color: #1e293b; margin: 0; }
.head p { color: #64748b; margin: 6px 0 0; }
.tools { display: flex; gap: 10px; flex-wrap: wrap; }
.search { display: flex; align-items: center; gap: 8px; background: #fff; border: 1px solid #e2e8f0;
  border-radius: 30px; padding: 8px 16px; color: #94a3b8; }
.search input { border: none; outline: none; font-size: .9rem; color: #1e293b; min-width: 200px; }
.role-select { border: 1px solid #e2e8f0; border-radius: 30px; padding: 8px 16px; color: #334155; background: #fff; }

.error-banner { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; padding: 12px 18px;
  border-radius: 14px; margin-bottom: 20px; font-size: .9rem; }
.state { padding: 40px; text-align: center; color: #64748b; }

.table-wrap { background: #fff; border: 1px solid #eef0f4; border-radius: 22px; overflow: hidden;
  box-shadow: 0 4px 14px rgba(15,23,42,.04); }
table { width: 100%; border-collapse: collapse; }
th { text-align: left; font-size: .72rem; text-transform: uppercase; letter-spacing: .05em; color: #94a3b8;
  padding: 14px 18px; border-bottom: 1px solid #f1f5f9; }
td { padding: 12px 18px; border-bottom: 1px solid #f6f7f9; font-size: .9rem; color: #334155; }
tr:last-child td { border-bottom: none; }
.right { text-align: right; }
.user-cell { display: flex; align-items: center; gap: 10px; }
.avatar { width: 34px; height: 34px; border-radius: 50%; color: #fff; font-weight: 700;
  display: flex; align-items: center; justify-content: center; font-size: .85rem; }
.name { font-weight: 600; color: #1e293b; }
.email { color: #64748b; }
.role-badge-select { border: 1px solid; border-radius: 20px; padding: 4px 12px; font-size: .78rem;
  font-weight: 700; background: #fff; cursor: pointer; }
.del-btn { border: 1px solid #fee2e2; background: #fff; color: #ef4444; border-radius: 10px;
  padding: 7px; cursor: pointer; transition: all .2s; }
.del-btn:hover { background: #ef4444; color: #fff; }
.empty { text-align: center; color: #94a3b8; padding: 30px; }

.modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,.5); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 16px; }
.modal { background: #fff; border-radius: 24px; padding: 28px; max-width: 420px; width: 100%; text-align: center;
  box-shadow: 0 25px 50px rgba(0,0,0,.25); }
.modal h3 { color: #1e293b; margin: 0 0 10px; }
.modal p { color: #64748b; margin: 0 0 22px; }
.actions { display: flex; justify-content: center; gap: 12px; }
.actions button { padding: 10px 24px; border-radius: 30px; font-weight: 700; cursor: pointer; border: none; }
.ghost { background: #f1f5f9; color: #475569; }
.danger { background: #ef4444; color: #fff; }

.toast { position: fixed; top: 24px; left: 50%; transform: translateX(-50%); z-index: 1100;
  background: #1e293b; color: #fff; padding: 12px 24px; border-radius: 30px; font-weight: 600;
  box-shadow: 0 10px 30px rgba(0,0,0,.2); }
.toast.error { background: #ef4444; }
.toast-enter-active, .toast-leave-active { transition: all .3s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, -10px); }
</style>
