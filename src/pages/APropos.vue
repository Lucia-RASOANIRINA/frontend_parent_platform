<template>
  <div class="about-page">
    <!-- Hero -->
    <section class="about-hero">
      <span class="eyebrow">L'ART DE GRANDIR</span>
      <h1>À propos de Parentia</h1>
      <p class="lead">
        Parentiaest une plateforme bienveillante qui réunit parents, éducateurs et
        psychologues autour d'un même objectif : accompagner l'épanouissement de chaque enfant.
      </p>
    </section>

    <!-- Mission -->
    <section class="card mission">
      <div class="mission-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 21s-7-4.35-9.5-8.5C.5 9 2.5 5 6 5c2 0 3.2 1.2 6 4 2.8-2.8 4-4 6-4 3.5 0 5.5 4 3.5 7.5C19 16.65 12 21 12 21z" />
        </svg>
      </div>
      <div>
        <h2>Notre mission</h2>
        <p>
          Créer des liens précieux entre les familles et les professionnels de la petite enfance.
          Nous offrons un espace d'échange, de ressources et de soutien pour que chaque parent se
          sente accompagné, et chaque enfant grandisse dans un environnement épanouissant.
        </p>
      </div>
    </section>

    <!-- Pour qui -->
    <h2 class="section-title">Une communauté, trois rôles</h2>
    <section class="roles">
      <article class="card role">
        <div class="role-badge">P</div>
        <h3>Parents</h3>
        <p>Posez vos questions, partagez votre quotidien et trouvez du soutien auprès d'une communauté bienveillante.</p>
      </article>
      <article class="card role">
        <div class="role-badge">É</div>
        <h3>Éducateurs</h3>
        <p>Partagez des activités, des conseils pédagogiques et accompagnez les familles au quotidien.</p>
      </article>
      <article class="card role">
        <div class="role-badge">Ψ</div>
        <h3>Psychologues</h3>
        <p>Apportez un éclairage professionnel sur le développement et les émotions de l'enfant.</p>
      </article>
    </section>

    <!-- Valeurs -->
    <h2 class="section-title">Nos valeurs</h2>
    <section class="values">
      <div class="card value" v-for="v in values" :key="v.title">
        <div class="value-dot"></div>
        <div>
          <h4>{{ v.title }}</h4>
          <p>{{ v.text }}</p>
        </div>
      </div>
    </section>

    <!-- Chiffres -->
    <section class="card stats">
      <div class="stat" v-for="s in stats" :key="s.label">
        <div class="stat-value">{{ s.value }}</div>
        <div class="stat-label">{{ s.label }}</div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { API_BASE_URL } from '../services/evenementService'
import axios from 'axios'

const values = [
  { title: 'Bienveillance', text: "Un espace sans jugement où chacun se sent écouté et respecté." },
  { title: 'Expertise', text: "Des contenus validés par des professionnels de la petite enfance." },
  { title: 'Proximité', text: "Une communauté locale qui se soutient au quotidien." },
  { title: 'Confiance', text: "Vos échanges restent privés et sécurisés." },
]

// Chiffres RÉELS issus de la base de données
const stats = ref([
  { value: '—', label: 'Familles accompagnées' },
  { value: '—', label: 'Professionnels' },
  { value: '—', label: 'Ressources partagées' },
  { value: '—', label: 'Évènements' },
])

onMounted(async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/stats`)
    const s = data.stats || {}
    stats.value = [
      { value: String(s.familles ?? 0), label: 'Familles accompagnées' },
      { value: String(s.professionnels ?? 0), label: 'Professionnels' },
      { value: String(s.ressources ?? 0), label: 'Ressources partagées' },
      { value: String(s.evenements ?? 0), label: 'Évènements' },
    ]
  } catch (e) {
    // En cas d'échec (backend arrêté), on laisse les tirets.
  }
})
</script>

<style scoped>
.about-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px;
}

.about-hero {
  text-align: center;
  padding: 8px 20px 22px;
}
.eyebrow {
  display: inline-block;
  font-size: 12px;
  letter-spacing: 3px;
  font-weight: 700;
  color: #D2B48C;
  margin-bottom: 12px;
}
.about-hero h1 {
  font-size: 2.6rem;
  font-weight: 800;
  color: #3E2C1F;
  margin: 0 0 14px;
}
.lead {
  max-width: 680px;
  margin: 0 auto;
  color: #6b5d4f;
  font-size: 1.05rem;
  line-height: 1.7;
}

.card {
  background: #fff;
  border-radius: 28px;
  box-shadow: 0 4px 14px rgba(62, 44, 31, 0.08);
}

.mission {
  display: flex;
  gap: 22px;
  align-items: center;
  padding: 28px;
  margin: 16px 0 8px;
}
.mission-icon {
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  border-radius: 22px;
  background: linear-gradient(135deg, #D2B48C, #3E2C1F);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.mission-icon svg { width: 36px; height: 36px; }
.mission h2 { color: #3E2C1F; margin: 0 0 8px; font-size: 1.4rem; }
.mission p { color: #6b5d4f; line-height: 1.7; margin: 0; }

.section-title {
  text-align: center;
  color: #3E2C1F;
  font-size: 1.5rem;
  margin: 38px 0 18px;
}

.roles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
}
.role { padding: 26px; text-align: center; transition: transform 0.2s, box-shadow 0.2s; }
.role:hover { transform: translateY(-4px); box-shadow: 0 14px 28px rgba(62, 44, 31, 0.14); }
.role-badge {
  width: 56px;
  height: 56px;
  margin: 0 auto 14px;
  border-radius: 50%;
  background: linear-gradient(135deg, #D2B48C, #3E2C1F);
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.role h3 { color: #3E2C1F; margin: 0 0 8px; }
.role p { color: #6b5d4f; line-height: 1.6; margin: 0; font-size: 0.95rem; }

.values {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}
.value { display: flex; gap: 16px; padding: 22px; align-items: flex-start; }
.value-dot {
  flex-shrink: 0;
  width: 14px; height: 14px;
  margin-top: 5px;
  border-radius: 50%;
  background: #D2B48C;
  box-shadow: 0 0 0 5px rgba(210, 180, 140, 0.2);
}
.value h4 { color: #3E2C1F; margin: 0 0 6px; }
.value p { color: #6b5d4f; margin: 0; line-height: 1.6; font-size: 0.95rem; }

.stats {
  margin: 30px 0 10px;
  padding: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 18px;
  background: linear-gradient(135deg, #3E2C1F, #5a4332);
}
.stat { text-align: center; }
.stat-value { font-size: 2rem; font-weight: 800; color: #fff; }
.stat-label { color: #D2B48C; font-size: 0.85rem; margin-top: 4px; }
</style>
