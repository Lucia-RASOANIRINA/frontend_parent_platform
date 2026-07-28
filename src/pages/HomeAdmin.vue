<template>
  <div class="admin-dashboard">
    <header class="dash-head">
      <div>
        <h1>Tableau de bord</h1>
        <p>Vue d'ensemble de la communauté Parentia.</p>
      </div>
      <button class="refresh" @click="load" :disabled="loading">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" :class="{ spin: loading }">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Actualiser
      </button>
    </header>

    <div v-if="error" class="error-banner">{{ error }}</div>

    <!-- Cartes principales -->
    <div class="cards">
      <div class="card" v-for="c in mainCards" :key="c.label">
        <div class="card-icon" :style="{ background: c.bg, color: c.color }" v-html="c.icon"></div>
        <div class="card-info">
          <span class="card-value">{{ c.value }}</span>
          <span class="card-label">{{ c.label }}</span>
        </div>
      </div>
    </div>

    <!-- Répartition par rôle -->
    <section class="role-section">
      <h2>Utilisateurs par rôle</h2>
      <div class="role-grid">
        <div class="role-card" v-for="r in roleCards" :key="r.key">
          <div class="role-top">
            <span class="role-dot" :style="{ background: r.color }"></span>
            <span class="role-name">{{ r.label }}</span>
            <span class="role-count">{{ r.count }}</span>
          </div>
          <div class="bar"><div class="bar-fill" :style="{ width: r.pct + '%', background: r.color }"></div></div>
        </div>
      </div>
    </section>

    <section class="quick">
      <router-link to="/admin/utilisateurs" class="quick-link">Gérer les utilisateurs →</router-link>
      <router-link to="/admin/evenements" class="quick-link">Gérer les évènements →</router-link>
      <router-link to="/admin/contenu" class="quick-link">Modérer le contenu (publications & ressources) →</router-link>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchStats } from '../services/adminService'

const stats = ref(null)
const loading = ref(true)
const error = ref('')

const ICONS = {
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
  events: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',
  posts: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>',
  resources: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>'
}

const ROLES = [
  { key: 'PARENT', label: 'Parents', color: '#6F4E37' },
  { key: 'EDUCATEUR', label: 'Éducatrices', color: '#6F4E37' },
  { key: 'PSY', label: 'Psychologues', color: '#C19A6B' },
  { key: 'ADMIN', label: 'Admins', color: '#6F4E37' }
]

const mainCards = computed(() => {
  const s = stats.value || {}
  return [
    { label: 'Utilisateurs', value: s.totalUtilisateurs ?? '—', icon: ICONS.users, bg: '#FAF7F2', color: '#6F4E37' },
    { label: 'Évènements', value: s.totalEvenements ?? '—', icon: ICONS.events, bg: '#FEF3F2', color: '#D2B48C' },
    { label: 'Publications', value: s.totalPosts ?? '—', icon: ICONS.posts, bg: '#ECFDF5', color: '#059669' },
    { label: 'Ressources', value: s.totalRessources ?? '—', icon: ICONS.resources, bg: '#FFF7ED', color: '#EA580C' }
  ]
})

const roleCards = computed(() => {
  const par = (stats.value && stats.value.utilisateursParRole) || {}
  const total = stats.value?.totalUtilisateurs || 0
  return ROLES.map(r => {
    const count = par[r.key] || 0
    return { ...r, count, pct: total ? Math.round((count / total) * 100) : 0 }
  })
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    stats.value = await fetchStats()
  } catch (e) {
    error.value = "Impossible de charger les statistiques. Vérifiez que le backend est démarré (port 8082)."
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.admin-dashboard { max-width: 1100px; margin: 0 auto; padding: 24px 20px; }
.dash-head { display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px; margin-bottom: 28px; }
.dash-head h1 { font-size: 2rem; font-weight: 800; color: #1e293b; margin: 0; }
.dash-head p { color: #64748b; margin: 6px 0 0; }
.refresh { display: inline-flex; align-items: center; gap: 8px; border: 1px solid #e2e8f0; background: #fff;
  color: #6F4E37; font-weight: 600; padding: 9px 18px; border-radius: 30px; cursor: pointer; }
.refresh:hover { border-color: #6F4E37; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.error-banner { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; padding: 12px 18px;
  border-radius: 14px; margin-bottom: 20px; font-size: .9rem; }

.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px; margin-bottom: 32px; }
.card { background: #fff; border: 1px solid #eef0f4; border-radius: 22px; padding: 22px;
  display: flex; align-items: center; gap: 16px; box-shadow: 0 4px 14px rgba(15,23,42,.04); }
.card-icon { width: 54px; height: 54px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
.card-icon :deep(svg) { width: 26px; height: 26px; }
.card-info { display: flex; flex-direction: column; }
.card-value { font-size: 1.8rem; font-weight: 800; color: #1e293b; line-height: 1; }
.card-label { font-size: .82rem; color: #64748b; margin-top: 4px; }

.role-section { background: #fff; border: 1px solid #eef0f4; border-radius: 22px; padding: 24px; margin-bottom: 24px; }
.role-section h2 { font-size: 1.1rem; color: #1e293b; margin: 0 0 18px; }
.role-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px; }
.role-top { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.role-dot { width: 10px; height: 10px; border-radius: 50%; }
.role-name { font-size: .9rem; color: #334155; font-weight: 600; }
.role-count { margin-left: auto; font-weight: 800; color: #1e293b; }
.bar { height: 8px; background: #f1f5f9; border-radius: 8px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 8px; transition: width .5s; }

.quick { display: flex; gap: 18px; flex-wrap: wrap; }
.quick-link { color: #6F4E37; font-weight: 600; text-decoration: none; }
.quick-link:hover { text-decoration: underline; }
</style>
