<template>
  <div class="contenu-admin">
    <header class="head">
      <div>
        <h1>Modération du contenu</h1>
        <p>L'administrateur peut <strong>consulter et supprimer</strong> — mais ne modifie pas le contenu des utilisateurs.</p>
      </div>
      <button class="refresh" @click="loadAll" :disabled="loading">Actualiser</button>
    </header>

    <div class="tabs">
      <button v-for="t in tabs" :key="t.key" class="tab" :class="{ active: tab === t.key }" @click="tab = t.key">
        {{ t.label }} <span class="badge">{{ counts[t.key] }}</span>
      </button>
    </div>

    <div v-if="error" class="error-banner">{{ error }}</div>
    <div v-if="loading" class="state">Chargement…</div>

    <!-- Publications -->
    <div v-else-if="tab === 'posts'" class="list">
      <div v-for="p in posts" :key="p.id" class="row">
        <div class="row-main">
          <div class="row-head">
            <span class="avatar" :style="{ background: roleColor(p.auteurRole) }">{{ initial(p.auteur) }}</span>
            <div>
              <strong>{{ p.auteur || 'Utilisateur' }}</strong>
              <span class="role-tag" :style="{ color: roleColor(p.auteurRole) }">{{ roleLabel(p.auteurRole) }}</span>
            </div>
            <span class="date">{{ fmt(p.createdAt) }}</span>
          </div>
          <p class="content">{{ p.contenu }}</p>
          <span class="meta">{{ p.commentsCount }} commentaire(s)</span>
        </div>
        <button class="del" @click="confirmDelete('post', p)">Supprimer</button>
      </div>
      <div v-if="posts.length === 0" class="empty">Aucune publication.</div>
    </div>

    <!-- Ressources -->
    <div v-else-if="tab === 'ressources'" class="list">
      <div v-for="r in ressources" :key="r.id" class="row">
        <div class="row-main">
          <div class="row-head">
            <span class="type-pill" :class="r.type">{{ r.type }}</span>
            <strong>{{ r.title }}</strong>
            <span class="date">{{ fmt(r.createdAt) }}</span>
          </div>
          <span class="meta">Âge {{ r.age || '—' }} · {{ r.likes || 0 }} likes · note {{ (r.averageRating || 0).toFixed(1) }} ({{ r.totalRatings || 0 }})</span>
        </div>
        <button class="del" @click="confirmDelete('ressource', r)">Supprimer</button>
      </div>
      <div v-if="ressources.length === 0" class="empty">Aucune ressource.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { fetchAdminPosts, fetchAdminResources, deletePost, deleteResource } from '../services/adminService'
import { notify } from '../services/notify'

const tab = ref('posts')
const tabs = [
  { key: 'posts', label: 'Publications' },
  { key: 'ressources', label: 'Ressources' },
]
const posts = ref([])
const ressources = ref([])
const loading = ref(true)
const error = ref('')

const counts = computed(() => ({ posts: posts.value.length, ressources: ressources.value.length }))

const COLORS = { PARENT: '#6F4E37', EDUCATEUR: '#6F4E37', PSY: '#C19A6B', ADMIN: '#6F4E37' }
const roleColor = (r) => COLORS[r] || '#64748b'
const roleLabel = (r) => ({ PARENT: 'Parent', EDUCATEUR: 'Éducatrice', PSY: 'Psychologue', ADMIN: 'Admin' }[r] || '')
const initial = (n) => (n ? n.charAt(0).toUpperCase() : '?')
const fmt = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : ''

async function loadAll() {
  loading.value = true; error.value = ''
  try {
    const [p, r] = await Promise.all([fetchAdminPosts(), fetchAdminResources()])
    posts.value = p; ressources.value = r
  } catch (e) {
    error.value = "Impossible de charger le contenu. Backend démarré (port 8082) ?"
  } finally {
    loading.value = false
  }
}

function confirmDelete(kind, item) {
  const label = kind === 'post' ? 'cette publication' : 'cette ressource'
  notify.custom('error', 'Supprimer ?', `Voulez-vous vraiment supprimer ${label} ? Cette action est définitive.`, [
    { label: 'Supprimer', primary: true, onClick: () => doDelete(kind, item) },
    { label: 'Annuler' },
  ])
}

async function doDelete(kind, item) {
  try {
    if (kind === 'post') { await deletePost(item.id); posts.value = posts.value.filter(x => x.id !== item.id) }
    else { await deleteResource(item.id); ressources.value = ressources.value.filter(x => x.id !== item.id) }
    notify.success('Supprimé', 'Le contenu a été supprimé.')
  } catch (e) {
    notify.error('Oups', e.response?.data?.error || 'Suppression impossible.')
  }
}

onMounted(loadAll)
</script>

<style scoped>
.contenu-admin { max-width: 1000px; margin: 0 auto; padding: 24px 20px; }
.head { display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px; margin-bottom: 20px; }
.head h1 { font-size: 2rem; font-weight: 800; color: #1e293b; margin: 0; }
.head p { color: #64748b; margin: 6px 0 0; }
.refresh { border: 1px solid #e2e8f0; background: #fff; color: #6F4E37; font-weight: 600; padding: 9px 18px; border-radius: 30px; cursor: pointer; }
.tabs { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
.tab { border: 1px solid #e2e8f0; background: #fff; color: #475569; font-weight: 600; padding: 9px 18px; border-radius: 30px; cursor: pointer; }
.tab.active { background: #6F4E37; border-color: #6F4E37; color: #fff; }
.badge { background: rgba(0,0,0,.08); border-radius: 20px; padding: 1px 8px; font-size: .72rem; margin-left: 4px; }
.tab.active .badge { background: rgba(255,255,255,.25); }
.error-banner { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; padding: 12px 18px; border-radius: 14px; margin-bottom: 16px; }
.state, .empty { padding: 40px; text-align: center; color: #94a3b8; }

.list { display: flex; flex-direction: column; gap: 12px; }
.row { background: #fff; border: 1px solid #eef0f4; border-radius: 18px; padding: 16px 18px; display: flex; gap: 14px; align-items: flex-start; box-shadow: 0 4px 12px rgba(15,23,42,.04); }
.row-main { flex: 1; min-width: 0; }
.row-head { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; flex-wrap: wrap; }
.avatar { width: 32px; height: 32px; border-radius: 50%; color: #fff; font-weight: 700; display: flex; align-items: center; justify-content: center; font-size: .82rem; }
.row-head strong { color: #1e293b; }
.role-tag { font-size: .72rem; font-weight: 700; margin-left: 4px; }
.date { margin-left: auto; font-size: .75rem; color: #94a3b8; }
.content { color: #334155; margin: 0 0 8px; line-height: 1.5; }
.meta { font-size: .76rem; color: #94a3b8; }
.type-pill { font-size: .68rem; font-weight: 700; text-transform: uppercase; padding: 3px 10px; border-radius: 12px; background: #FAF7F2; color: #6F4E37; }
.type-pill.video { background: #FEF3F2; color: #c2410c; }
.type-pill.fiche { background: #ECFDF5; color: #059669; }
.del { flex-shrink: 0; border: 1px solid #fee2e2; background: #fff; color: #ef4444; border-radius: 12px; padding: 8px 16px; cursor: pointer; font-weight: 600; transition: all .2s; }
.del:hover { background: #ef4444; color: #fff; }
</style>
