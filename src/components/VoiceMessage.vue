<template>
  <div class="vocal-msg" :class="{ sortant }">
    <button
      type="button"
      class="lecture"
      :aria-label="joue ? t('chat.pause') : t('chat.ecouter')"
      @click="basculer">
      <svg v-if="!joue" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d="M8 5v14l11-7z" />
      </svg>
      <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
        <rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" />
      </svg>
    </button>

    <div class="piste" @click="deplacer">
      <div class="barres" aria-hidden="true">
        <span v-for="(h, i) in barres" :key="i"
              class="barre"
              :class="{ lue: (i / barres.length) * 100 <= progression }"
              :style="{ height: h + '%' }"></span>
      </div>
      <input
        class="curseur"
        type="range" min="0" max="100" step="0.5"
        :value="progression"
        :aria-label="t('chat.vocal')"
        @input="deplacerCurseur($event.target.value)" />
    </div>

    <span class="temps">{{ formatDuree(joue || position > 0 ? position : duree) }}</span>

    <audio
      ref="audio"
      :src="source"
      preload="metadata"
      @timeupdate="surProgression"
      @loadedmetadata="surMeta"
      @ended="surFin"></audio>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { t } from '../i18n'

/**
 * Lecture d'un message vocal reçu dans le chat.
 * L'audio arrive en base64 dans le message (même canal que les images).
 */
const props = defineProps({
  fileData: { type: String, required: true },
  fileType: { type: String, default: 'audio/webm' },
  durationSeconds: { type: Number, default: 0 },
  /** true pour les messages envoyés par l'utilisateur (couleurs inversées). */
  sortant: { type: Boolean, default: false },
})

const audio = ref(null)
const joue = ref(false)
const position = ref(0)
const dureeReelle = ref(0)

const source = computed(() => `data:${props.fileType || 'audio/webm'};base64,${props.fileData}`)
const duree = computed(() => dureeReelle.value || props.durationSeconds || 0)
const progression = computed(() => (duree.value ? Math.min(100, (position.value / duree.value) * 100) : 0))

/** Silhouette décorative stable : dépend de la longueur des données, pas du hasard. */
const barres = computed(() => {
  const graine = props.fileData ? props.fileData.length : 42
  return Array.from({ length: 28 }, (_, i) => 30 + ((graine + i * 37) % 70))
})

function basculer() {
  const el = audio.value
  if (!el) return
  if (joue.value) {
    el.pause()
    joue.value = false
  } else {
    el.play().then(() => { joue.value = true }).catch(() => { joue.value = false })
  }
}

function surProgression() { position.value = audio.value?.currentTime || 0 }

function surMeta() {
  const d = audio.value?.duration
  // Certains navigateurs renvoient Infinity pour un flux MediaRecorder
  if (d && Number.isFinite(d)) dureeReelle.value = d
}

function surFin() {
  joue.value = false
  position.value = 0
}

function deplacerCurseur(valeur) {
  if (!audio.value || !duree.value) return
  const t2 = (Number(valeur) / 100) * duree.value
  audio.value.currentTime = t2
  position.value = t2
}

function deplacer(e) {
  if (e.target.classList.contains('curseur')) return
}

function formatDuree(s) {
  const total = Math.round(s || 0)
  const m = Math.floor(total / 60)
  return `${m}:${String(total % 60).padStart(2, '0')}`
}

onUnmounted(() => { audio.value?.pause() })
</script>

<style scoped>
.vocal-msg {
  display: flex; align-items: center; gap: 10px;
  min-width: 210px; max-width: 300px; padding: 4px 2px;
}

.lecture {
  flex-shrink: 0; width: 34px; height: 34px; border-radius: 50%;
  border: none; cursor: pointer; display: grid; place-items: center;
  background: #6F4E37; color: #fff; transition: filter .2s;
}
.sortant .lecture { background: #fff; color: #6F4E37; }
.lecture:hover { filter: brightness(1.1); }
.lecture:focus-visible { outline: 3px solid rgba(193,154,107,.6); outline-offset: 2px; }

.piste { position: relative; flex: 1; min-width: 0; height: 30px; display: flex; align-items: center; }
.barres { display: flex; align-items: center; gap: 2px; width: 100%; height: 24px; }
.barre {
  flex: 1; min-width: 2px; border-radius: 2px;
  background: rgba(111, 78, 55, .25); transition: background .15s;
}
.barre.lue { background: #6F4E37; }
.sortant .barre { background: rgba(255,255,255,.35); }
.sortant .barre.lue { background: #fff; }

.curseur {
  position: absolute; inset: 0; width: 100%; height: 100%;
  opacity: 0; cursor: pointer; margin: 0;
}
.curseur:focus-visible { opacity: .25; outline: 3px solid rgba(193,154,107,.6); }

.temps { flex-shrink: 0; font-size: .7rem; font-variant-numeric: tabular-nums; opacity: .8; }

@media (prefers-reduced-motion: reduce) {
  .barre { transition: none; }
}
</style>
