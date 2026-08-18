<template>
  <div class="contenu-admin">
    <header class="head">
      <div>
        <h1>{{ t('admin.moderationContenu') }}</h1>
        <p>{{ t('admin.adminPeut') }} <strong>{{ t('admin.consulterSupprimer') }}</strong> {{ t('admin.maisPasModifier') }}</p>
      </div>
      <button class="refresh" @click="loadAll" :disabled="loading">{{ t('admin.actualiser') }}</button>
    </header>

    <div class="tabs">
      <button v-for="t in tabs" :key="t.key" class="tab" :class="{ active: tab === t.key }" @click="tab = t.key">
        {{ t.label }} <span class="badge">{{ counts[t.key] }}</span>
      </button>
    </div>

    <div v-if="error" class="error-banner">{{ error }}</div>
    <Chargement v-if="loading" variante="silhouettes" />

    <!-- Publications -->
    <div v-else-if="tab === 'posts'" class="list">
      <div v-for="p in posts" :key="p.id" class="row">
        <div class="row-main">
          <div class="row-head">
            <span class="avatar" :style="{ background: roleColor(p.auteurRole) }">{{ initial(p.auteur) }}</span>
            <div>
              <strong>{{ p.auteur || t('profil.utilisateur') }}</strong>
              <span class="role-tag" :style="{ color: roleColor(p.auteurRole) }">{{ roleLabel(p.auteurRole) }}</span>
            </div>
            <span class="date">{{ fmt(p.createdAt) }}</span>
          </div>
          <p class="content">{{ p.contenu }}</p>
          <span class="meta">{{ t('admin.commentairesCount', { n: p.commentsCount }) }}</span>
        </div>
        <button class="del" @click="confirmDelete('post', p)">{{ t('admin.supprimer') }}</button>
      </div>
      <div v-if="posts.length === 0" class="empty">{{ t('admin.aucunePublication') }}</div>
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
          <span class="meta">{{ t('admin.metaRessource', { age: r.age || '—', likes: r.likes || 0, note: (r.averageRating || 0).toFixed(1), total: r.totalRatings || 0 }) }}</span>
        </div>
        <button class="del" @click="confirmDelete('ressource', r)">{{ t('admin.supprimer') }}</button>
      </div>
      <div v-if="ressources.length === 0" class="empty">{{ t('admin.aucuneRessource') }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { t } from '../i18n'
import Chargement from '../components/Chargement.vue'
import { fetchAdminPosts, fetchAdminResources, deletePost, deleteResource } from '../services/adminService'
import { notify } from '../services/notify'

const tab = ref('posts')
const tabs = computed(() => [
  { key: 'posts', label: t('admin.publications') },
  { key: 'ressources', label: t('admin.ressources') },
])
const posts = ref([])
const ressources = ref([])
const loading = ref(true)
const error = ref('')

const counts = computed(() => ({ posts: posts.value.length, ressources: ressources.value.length }))

const COLORS = { PARENT: '#6F4E37', EDUCATEUR: '#6F4E37', PSY: '#C19A6B', ADMIN: '#6F4E37' }
const roleColor = (r) => COLORS[r] || '#64748b'
const roleLabel = (r) => ({ PARENT: t('roles.parent'), EDUCATEUR: t('roles.educatrice'), PSY: t('roles.psychologue'), ADMIN: t('roles.admin') }[r] || '')
const initial = (n) => (n ? n.charAt(0).toUpperCase() : '?')
const fmt = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : ''

async function loadAll() {
  loading.value = true; error.value = ''
  try {
    const [p, r] = await Promise.all([fetchAdminPosts(), fetchAdminResources()])
    posts.value = p; ressources.value = r
  } catch (e) {
    error.value = t('admin.contenuIndisponible')
  } finally {
    loading.value = false
  }
}

function confirmDelete(kind, item) {
  const quoi = kind === 'post' ? t('admin.cettePublication') : t('admin.cetteRessource')
  notify.custom('error', t('admin.supprimerQuestion'), t('admin.confirmerSuppression', { quoi }), [
    { label: t('admin.supprimer'), primary: true, onClick: () => doDelete(kind, item) },
    { label: t('admin.annuler') },
  ])
}

async function doDelete(kind, item) {
  try {
    if (kind === 'post') { await deletePost(item.id); posts.value = posts.value.filter(x => x.id !== item.id) }
    else { await deleteResource(item.id); ressources.value = ressources.value.filter(x => x.id !== item.id) }
    notify.success(t('admin.supprime'), t('admin.contenuSupprime'))
  } catch (e) {
    notify.error(t('admin.oups'), e.response?.data?.error || t('admin.suppressionImpossiblePoint'))
  }
}

onMounted(loadAll)
</script>

<style scoped>
/* Aligné sur le tableau de bord et la page utilisateurs. */
.contenu-admin {
  --sable: #C19A6B; --brun: #6F4E37; --brun-fonce: #3E2C1F;
  --creme: #FBF7F1; --bord: #EFE7DC; --doux: #6b5d4f; --discret: #a99e90;
  max-width: 1020px; margin: 0 auto; padding: 12px 20px 48px;
}

.head {
  display: flex; justify-content: space-between; align-items: flex-end;
  flex-wrap: wrap; gap: 18px; margin-bottom: 22px;
  padding: 30px; border-radius: 28px; border: 1px solid var(--bord);
  background: radial-gradient(120% 130% at 15% 0%, #FFFDFA 0%, #F8F1E7 55%, #F2E7D8 100%);
}
.head h1 { font-size: clamp(1.6rem, 3vw, 2.1rem); font-weight: 800; letter-spacing: -.02em; color: var(--brun-fonce); margin: 0; }
.head p { color: var(--doux); margin: 8px 0 0; font-size: .9rem; max-width: 60ch; line-height: 1.6; }
.refresh {
  border: 1px solid var(--bord); background: #fff; color: var(--brun);
  font-weight: 700; font-size: .84rem; padding: 10px 20px; border-radius: 30px; cursor: pointer;
  transition: border-color .2s, transform .2s, box-shadow .2s;
}
.refresh:hover:not(:disabled) { border-color: var(--sable); transform: translateY(-1px); box-shadow: 0 6px 16px rgba(111,78,55,.14); }
.refresh:disabled { opacity: .6; cursor: progress; }

/* Onglets : bande segmentée plutôt que boutons isolés */
.tabs {
  display: inline-flex; gap: 4px; margin-bottom: 20px; flex-wrap: wrap;
  padding: 4px; border-radius: 30px; background: var(--creme); border: 1px solid var(--bord);
}
.tab {
  border: none; background: transparent; color: var(--doux); font-weight: 600;
  padding: 9px 18px; border-radius: 26px; cursor: pointer; font-size: .85rem;
  transition: background .2s, color .2s, box-shadow .2s;
}
.tab:hover { color: var(--brun-fonce); background: rgba(255,255,255,.75); }
.tab.active { background: #fff; color: var(--brun); font-weight: 700; box-shadow: 0 2px 8px rgba(62,44,31,.12); }
.badge { background: rgba(111,78,55,.12); border-radius: 20px; padding: 2px 9px; font-size: .68rem; font-weight: 700; margin-left: 6px; }
.tab.active .badge { background: rgba(193,154,107,.28); color: var(--brun); }

.error-banner { background: #FBEDE9; color: #a8482f; border: 1px solid #F0D6CD; padding: 13px 18px; border-radius: 16px; margin-bottom: 16px; font-size: .88rem; }
.state, .empty { padding: 48px; text-align: center; color: var(--discret); }

.list { display: flex; flex-direction: column; gap: 13px; }
.row {
  background: #fff; border: 1px solid var(--bord); border-radius: 20px;
  padding: 17px 19px; display: flex; gap: 15px; align-items: flex-start;
  box-shadow: 0 2px 6px rgba(62,44,31,.04);
  transition: transform .22s, box-shadow .22s, border-color .22s;
}
.row:hover { transform: translateY(-2px); border-color: rgba(193,154,107,.45); box-shadow: 0 12px 26px rgba(62,44,31,.1); }
.row-main { flex: 1; min-width: 0; }
.row-head { display: flex; align-items: center; gap: 10px; margin-bottom: 9px; flex-wrap: wrap; }
.avatar { width: 34px; height: 34px; border-radius: 50%; color: #fff; font-weight: 700; display: grid; place-items: center; font-size: .82rem; flex-shrink: 0; }
.row-head strong { color: var(--brun-fonce); font-size: .9rem; }
.role-tag { font-size: .68rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; margin-left: 4px; }
.date { margin-left: auto; font-size: .72rem; color: var(--discret); }
.content { color: var(--doux); margin: 0 0 9px; line-height: 1.6; font-size: .88rem; overflow-wrap: anywhere; }
.meta { font-size: .73rem; color: var(--discret); }
.type-pill { font-size: .64rem; font-weight: 800; letter-spacing: .07em; text-transform: uppercase; padding: 4px 11px; border-radius: 20px; background: rgba(193,154,107,.16); color: #8a6d4b; }
.type-pill.video { background: rgba(176,118,21,.15); color: #a8590a; }
.type-pill.fiche { background: rgba(46,125,50,.13); color: #2E7D32; }
.del {
  flex-shrink: 0; border: 1px solid var(--bord); background: #fff; color: #b4735f;
  border-radius: 12px; padding: 9px 17px; cursor: pointer; font-weight: 700; font-size: .8rem;
  transition: all .2s;
}
.del:hover { background: #FBEDE9; border-color: #E9C9BE; color: #c0563f; }

@media (max-width: 640px) {
  .contenu-admin { padding: 8px 14px 36px; }
  .head { padding: 24px 20px; border-radius: 22px; }
  .row { flex-direction: column; }
  .del { align-self: stretch; }
}
@media (prefers-reduced-motion: reduce) { .row, .refresh, .tab { transition: none; } }
</style>
