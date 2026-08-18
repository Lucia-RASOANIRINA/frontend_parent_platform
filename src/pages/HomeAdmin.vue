<template>
  <div class="admin-dashboard">
    <header class="dash-head">
      <div>
        <h1>{{ t('admin.tableauBord') }}</h1>
        <p>{{ t('admin.vueEnsemble') }}</p>
      </div>
      <button class="refresh" @click="load" :disabled="loading">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" :class="{ spin: loading }">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        {{ t('admin.actualiser') }}
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
      <h2>{{ t('admin.utilisateursParRole') }}</h2>
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

    <section class="raccourcis">
      <router-link v-for="r in raccourcis" :key="r.to" :to="r.to" class="raccourci">
        <span class="raccourci-icone" v-html="r.icone" aria-hidden="true"></span>
        <span class="raccourci-texte">
          <strong>{{ r.titre }}</strong>
          <small>{{ r.detail }}</small>
        </span>
        <svg class="fleche" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
        </svg>
      </router-link>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { t } from '../i18n'
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
  { key: 'PARENT', cle: 'roles.parents', color: '#6F4E37' },
  { key: 'EDUCATEUR', cle: 'roles.educatrices', color: '#C19A6B' },
  { key: 'PSY', cle: 'roles.psychologues', color: '#4C9A57' },
  { key: 'ADMIN', cle: 'roles.admins', color: '#8a6d4b' }
]

const mainCards = computed(() => {
  const s = stats.value || {}
  return [
    { label: t('admin.utilisateurs'), value: s.totalUtilisateurs ?? '—', icon: ICONS.users, bg: '#FAF7F2', color: '#6F4E37' },
    { label: t('admin.evenements'), value: s.totalEvenements ?? '—', icon: ICONS.events, bg: '#FEF3F2', color: '#D2B48C' },
    { label: t('admin.publications'), value: s.totalPosts ?? '—', icon: ICONS.posts, bg: '#ECFDF5', color: '#059669' },
    { label: t('admin.ressources'), value: s.totalRessources ?? '—', icon: ICONS.resources, bg: '#FFF7ED', color: '#EA580C' }
  ]
})

const roleCards = computed(() => {
  const par = (stats.value && stats.value.utilisateursParRole) || {}
  const total = stats.value?.totalUtilisateurs || 0
  return ROLES.map(r => {
    const count = par[r.key] || 0
    return { ...r, label: t(r.cle), count, pct: total ? Math.round((count / total) * 100) : 0 }
  })
})

const raccourcis = computed(() => [
  { to: '/admin/utilisateurs', titre: t('admin.utilisateurs'), detail: t('admin.detailUtilisateurs'),
    icone: ICONS.users },
  { to: '/admin/evenements', titre: t('admin.evenements'), detail: t('admin.detailEvenements'),
    icone: ICONS.events },
  { to: '/admin/contenu', titre: t('admin.moderation'), detail: t('admin.detailModeration'),
    icone: ICONS.posts },
])

async function load() {
  loading.value = true
  error.value = ''
  try {
    stats.value = await fetchStats()
  } catch (e) {
    error.value = t('admin.statsIndisponibles')
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<style scoped>
/* Palette alignée sur l'identité Parentia : le tableau de bord utilisait
   des gris bleutés qui juraient avec le reste de la plateforme. */
.admin-dashboard {
  --sable: #C19A6B; --brun: #6F4E37; --brun-fonce: #3E2C1F;
  --creme: #FBF7F1; --bord: #EFE7DC; --doux: #6b5d4f; --discret: #a99e90;
  max-width: 1120px; margin: 0 auto; padding: 12px 20px 48px;
}

/* En-tête */
.dash-head {
  position: relative; overflow: hidden;
  display: flex; justify-content: space-between; align-items: flex-end;
  flex-wrap: wrap; gap: 18px; margin-bottom: 26px;
  padding: 34px 30px; border-radius: 28px; border: 1px solid var(--bord);
  background: radial-gradient(120% 130% at 15% 0%, #FFFDFA 0%, #F8F1E7 55%, #F2E7D8 100%);
}
.dash-head h1 { font-size: clamp(1.7rem, 3vw, 2.3rem); font-weight: 800; letter-spacing: -.02em; color: var(--brun-fonce); margin: 0; }
.dash-head p { color: var(--doux); margin: 8px 0 0; font-size: .93rem; }
.refresh {
  display: inline-flex; align-items: center; gap: 8px;
  border: 1px solid var(--bord); background: #fff; color: var(--brun);
  font-weight: 700; font-size: .84rem; padding: 10px 20px; border-radius: 30px; cursor: pointer;
  transition: border-color .2s, transform .2s, box-shadow .2s;
}
.refresh:hover:not(:disabled) { border-color: var(--sable); transform: translateY(-1px); box-shadow: 0 6px 16px rgba(111,78,55,.14); }
.refresh:disabled { opacity: .6; cursor: progress; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.error-banner {
  background: #FBEDE9; color: #a8482f; border: 1px solid #F0D6CD;
  padding: 13px 18px; border-radius: 16px; margin-bottom: 20px; font-size: .88rem;
}

/* Chiffres clés */
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(212px, 1fr)); gap: 18px; margin-bottom: 26px; }
.card {
  position: relative; overflow: hidden;
  background: #fff; border: 1px solid var(--bord); border-radius: 22px; padding: 22px;
  display: flex; align-items: center; gap: 16px;
  box-shadow: 0 2px 6px rgba(62,44,31,.04);
  transition: transform .25s, box-shadow .25s, border-color .25s;
}
.card::after {
  content: ''; position: absolute; inset: 0 auto auto 0; width: 100%; height: 3px;
  background: linear-gradient(90deg, var(--sable), var(--brun)); opacity: .85;
}
.card:hover { transform: translateY(-4px); border-color: rgba(193,154,107,.5); box-shadow: 0 16px 32px rgba(62,44,31,.12); }
.card-icon { width: 52px; height: 52px; border-radius: 16px; display: grid; place-items: center; flex-shrink: 0; }
.card-icon :deep(svg) { width: 24px; height: 24px; }
.card-info { display: flex; flex-direction: column; min-width: 0; }
.card-value { font-size: 1.85rem; font-weight: 800; color: var(--brun-fonce); line-height: 1; }
.card-label { font-size: .74rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--discret); margin-top: 6px; }

/* Répartition par rôle */
.role-section { background: #fff; border: 1px solid var(--bord); border-radius: 24px; padding: 26px; margin-bottom: 26px; }
.role-section h2 { font-size: 1.02rem; font-weight: 700; color: var(--brun-fonce); margin: 0 0 20px; }
.role-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(238px, 1fr)); gap: 20px; }
.role-top { display: flex; align-items: center; gap: 9px; margin-bottom: 9px; }
.role-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
.role-name { font-size: .87rem; color: var(--doux); font-weight: 600; }
.role-count { margin-left: auto; font-weight: 800; color: var(--brun-fonce); font-size: 1.02rem; }
.bar { height: 7px; background: #F3EDE5; border-radius: 7px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 7px; transition: width .6s ease; }

/* Raccourcis : de vraies cartes cliquables */
.raccourcis { display: grid; grid-template-columns: repeat(auto-fit, minmax(258px, 1fr)); gap: 16px; }
.raccourci {
  display: flex; align-items: center; gap: 14px; text-decoration: none;
  background: #fff; border: 1px solid var(--bord); border-radius: 20px; padding: 18px 20px;
  transition: transform .25s, box-shadow .25s, border-color .25s;
}
.raccourci:hover { transform: translateY(-3px); border-color: rgba(193,154,107,.55); box-shadow: 0 14px 28px rgba(62,44,31,.12); }
.raccourci:focus-visible { outline: 3px solid rgba(193,154,107,.5); outline-offset: 3px; }
.raccourci-icone {
  width: 44px; height: 44px; border-radius: 14px; flex-shrink: 0;
  display: grid; place-items: center; color: var(--brun);
  background: linear-gradient(135deg, #F7EFE4, #EADCC7);
}
.raccourci-icone :deep(svg) { width: 21px; height: 21px; }
.raccourci-texte { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.raccourci-texte strong { font-size: .92rem; color: var(--brun-fonce); }
.raccourci-texte small { font-size: .75rem; color: var(--discret); }
.fleche { margin-left: auto; color: var(--sable); flex-shrink: 0; transition: transform .25s; }
.raccourci:hover .fleche { transform: translateX(4px); }

@media (max-width: 640px) {
  .admin-dashboard { padding: 8px 14px 36px; }
  .dash-head { padding: 26px 20px; border-radius: 22px; }
}
@media (prefers-reduced-motion: reduce) {
  .card, .raccourci, .fleche, .refresh, .bar-fill { transition: none; }
  .spin { animation: none; }
}
</style>
