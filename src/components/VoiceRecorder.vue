<template>
  <div class="vocal">
    <!-- Bouton micro -->
    <button
      v-if="!enregistre && !apercu"
      type="button"
      class="btn-micro"
      :disabled="!supporte"
      :title="supporte ? t('chat.enregistrer') : t('chat.microIndisponible')"
      :aria-label="t('chat.enregistrer')"
      @click="demarrer">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 1a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4m-4 0h8" />
      </svg>
    </button>

    <!-- Enregistrement en cours -->
    <div v-else-if="enregistre" class="barre enregistrement" role="status" aria-live="polite">
      <button type="button" class="btn-annuler" :aria-label="t('commun.annuler')" @click="annuler">✕</button>
      <span class="pastille-rec" aria-hidden="true"></span>
      <span class="duree">{{ formatDuree(secondes) }}</span>
      <div class="ondes" aria-hidden="true">
        <span v-for="(n, i) in niveaux" :key="i" class="onde" :style="{ height: (6 + n * 22) + 'px' }"></span>
      </div>
      <span class="aide">{{ t('chat.enregistrement') }}</span>
      <button type="button" class="btn-stop" :aria-label="t('chat.arreter')" @click="arreter">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
      </button>
    </div>

    <!-- Aperçu avant envoi -->
    <div v-else class="barre apercu">
      <button type="button" class="btn-annuler" :aria-label="t('commun.annuler')" @click="annuler">✕</button>
      <audio :src="apercu" controls class="lecteur"></audio>
      <span class="duree">{{ formatDuree(secondes) }}</span>
      <button type="button" class="btn-envoyer" :aria-label="t('chat.envoyer')" @click="envoyer">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </div>

    <p v-if="erreur" class="erreur" role="alert">{{ erreur }}</p>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { t } from '../i18n'

/**
 * Enregistrement d'un message vocal.
 *
 * L'audio est capté par MediaRecorder puis transmis en base64, comme les autres
 * pièces jointes du chat. Un aperçu permet de réécouter avant d'envoyer — utile
 * quand la connexion est lente et qu'on ne veut pas renvoyer deux fois.
 */
const props = defineProps({
  /** Durée maximale en secondes (au-delà, l'enregistrement s'arrête seul). */
  dureeMax: { type: Number, default: 120 },
})

/** « envoyer » : audio prêt — « etat » : idle | enregistrement | apercu */
const emit = defineEmits(['envoyer', 'etat'])

const supporte = typeof navigator !== 'undefined'
  && !!navigator.mediaDevices?.getUserMedia
  && typeof window !== 'undefined' && 'MediaRecorder' in window

const enregistre = ref(false)
const apercu = ref('')
const secondes = ref(0)
const erreur = ref('')
const niveaux = ref([0.3, 0.5, 0.8, 0.4, 0.6, 0.35, 0.7])

// Prévient le parent pour qu'il masque le champ texte pendant l'enregistrement
watch([enregistre, apercu], ([rec, ap]) => {
  emit('etat', rec ? 'enregistrement' : (ap ? 'apercu' : 'idle'))
})

let recorder = null
let flux = null
let morceaux = []
let minuteur = null
let animation = null
let blobFinal = null
let mimeChoisi = 'audio/webm'

/** Choisit un format supporté par le navigateur (Chrome/Firefox : webm, Safari : mp4). */
function choisirMime() {
  const candidats = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus']
  for (const m of candidats) {
    if (window.MediaRecorder?.isTypeSupported?.(m)) return m
  }
  return ''
}

async function demarrer() {
  erreur.value = ''
  if (!supporte) {
    erreur.value = t('chat.microIndisponible')
    return
  }
  try {
    flux = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true },
    })
  } catch {
    erreur.value = t('chat.microRefuse')
    return
  }

  mimeChoisi = choisirMime()
  morceaux = []
  recorder = new MediaRecorder(flux, mimeChoisi ? { mimeType: mimeChoisi } : undefined)
  recorder.ondataavailable = (e) => { if (e.data.size > 0) morceaux.push(e.data) }
  recorder.onstop = () => {
    blobFinal = new Blob(morceaux, { type: mimeChoisi || 'audio/webm' })
    apercu.value = URL.createObjectURL(blobFinal)
    libererMicro()
  }

  recorder.start()
  enregistre.value = true
  secondes.value = 0
  minuteur = setInterval(() => {
    secondes.value += 1
    if (secondes.value >= props.dureeMax) arreter()
  }, 1000)
  animerOndes()
}

/** Petite animation de niveaux : signale visuellement que le micro capte. */
function animerOndes() {
  animation = setInterval(() => {
    niveaux.value = niveaux.value.map(() => Math.random())
  }, 180)
}

function arreter() {
  if (recorder && recorder.state !== 'inactive') recorder.stop()
  enregistre.value = false
  clearInterval(minuteur); minuteur = null
  clearInterval(animation); animation = null
}

function annuler() {
  arreter()
  libererMicro()
  if (apercu.value) URL.revokeObjectURL(apercu.value)
  apercu.value = ''
  blobFinal = null
  secondes.value = 0
  erreur.value = ''
}

function libererMicro() {
  if (flux) {
    flux.getTracks().forEach(p => p.stop())
    flux = null
  }
}

async function envoyer() {
  if (!blobFinal) return
  const base64 = await versBase64(blobFinal)
  emit('envoyer', {
    base64,
    mimeType: blobFinal.type || 'audio/webm',
    secondes: Math.max(1, secondes.value),
  })
  annuler()
}

function versBase64(blob) {
  return new Promise((resoudre, rejeter) => {
    const lecteur = new FileReader()
    lecteur.onload = () => resoudre(String(lecteur.result).split(',')[1])
    lecteur.onerror = rejeter
    lecteur.readAsDataURL(blob)
  })
}

function formatDuree(s) {
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${String(r).padStart(2, '0')}`
}

onUnmounted(() => {
  clearInterval(minuteur)
  clearInterval(animation)
  libererMicro()
  if (apercu.value) URL.revokeObjectURL(apercu.value)
})
</script>

<style scoped>
.vocal { display: inline-flex; flex-direction: column; gap: 4px; }

.btn-micro {
  border: none; background: transparent; color: #6b5d4f; cursor: pointer;
  width: 42px; height: 42px; border-radius: 50%; display: grid; place-items: center;
  transition: background .2s, color .2s;
}
.btn-micro:hover:not(:disabled) { background: #F4EDE4; color: #6F4E37; }
.btn-micro:disabled { opacity: .4; cursor: not-allowed; }
.btn-micro:focus-visible { outline: 3px solid rgba(193,154,107,.45); outline-offset: 2px; }

.barre {
  display: flex; align-items: center; gap: 10px;
  background: #FBF7F1; border: 1px solid #EDE4D8; border-radius: 30px;
  padding: 6px 12px; min-height: 44px; flex: 1; min-width: 0;
}
.barre.enregistrement { border-color: #e6c2b8; background: #fdf5f2; }

.pastille-rec { width: 9px; height: 9px; border-radius: 50%; background: #c0563f; animation: pulse 1.2s ease-in-out infinite; flex-shrink: 0; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .25; } }

.duree { font-size: .78rem; font-weight: 700; color: #6F4E37; font-variant-numeric: tabular-nums; flex-shrink: 0; }
.ondes { display: flex; align-items: center; gap: 3px; height: 28px; flex: 1; overflow: hidden; }
.onde { width: 3px; border-radius: 3px; background: linear-gradient(180deg, #C19A6B, #6F4E37); transition: height .18s ease; }
.aide { font-size: .72rem; color: #8a7c6d; white-space: nowrap; }

.lecteur { flex: 1; min-width: 0; height: 34px; }

.btn-annuler, .btn-stop, .btn-envoyer {
  border: none; cursor: pointer; border-radius: 50%; width: 32px; height: 32px;
  display: grid; place-items: center; flex-shrink: 0;
}
.btn-annuler { background: #f0e8e2; color: #8a7c6d; font-size: .8rem; }
.btn-annuler:hover { background: #e6d9cf; }
.btn-stop { background: #c0563f; color: #fff; }
.btn-stop:hover { background: #a8482f; }
.btn-envoyer { background: linear-gradient(135deg, #C19A6B, #6F4E37); color: #fff; }
.btn-envoyer:hover { filter: brightness(1.07); }
.btn-annuler:focus-visible, .btn-stop:focus-visible, .btn-envoyer:focus-visible {
  outline: 3px solid rgba(193,154,107,.5); outline-offset: 2px;
}

.erreur { margin: 0; font-size: .72rem; color: #c0563f; }

@media (max-width: 560px) {
  .aide { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .pastille-rec { animation: none; }
  .onde { transition: none; }
}
</style>
