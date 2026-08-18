<template>
  <div class="lang" :class="{ sombre }" @keydown.esc="ouvert = false">
    <button
      class="declencheur"
      type="button"
      :aria-label="t('langue.choisir')"
      :aria-expanded="ouvert"
      aria-haspopup="listbox"
      @click="ouvert = !ouvert">
      <Drapeau :code="langueActive.code" :etiquette="langueActive.nom" taille="moyen" />
      <span class="sr-only">{{ langueActive.nom }}</span>
    </button>

    <div v-if="ouvert" class="voile" @click="ouvert = false"></div>

    <Transition name="deploie">
      <div v-if="ouvert" class="menu" role="listbox" :aria-label="t('langue.choisir')">
        <span class="fleche" aria-hidden="true"></span>
        <p class="entete">{{ t('langue.choisir') }}</p>
        <button
          v-for="(l, i) in LANGUES"
          :key="l.code"
          type="button"
          role="option"
          :aria-selected="l.code === langueActive.code"
          class="option"
          :class="{ actif: l.code === langueActive.code }"
          :style="{ '--retard': i * 40 + 'ms' }"
          @click="choisir(l.code)">
          <span class="rond"><Drapeau :code="l.code" :etiquette="l.nom" taille="grand" /></span>
          <span class="textes">
            <strong>{{ l.nom }}</strong>
            <small>{{ l.natif }}</small>
          </span>
          <svg v-if="l.code === langueActive.code" class="coche" viewBox="0 0 24 24" width="16" height="16"
               fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { t, LANGUES, langueActive, definirLangue } from '../i18n'
import Drapeau from './Drapeau.vue'

defineProps({
  /** À activer sur un en-tête foncé pour inverser les couleurs. */
  sombre: { type: Boolean, default: false },
})

const ouvert = ref(false)

function choisir(code) {
  definirLangue(code)
  ouvert.value = false
}

function fermerSiExterieur(e) {
  if (!e.target.closest?.('.lang')) ouvert.value = false
}

onMounted(() => document.addEventListener('click', fermerSiExterieur))
onUnmounted(() => document.removeEventListener('click', fermerSiExterieur))
</script>

<style scoped>
.lang { position: relative; display: inline-flex; }

/* --- Déclencheur --- */
/* Drapeau seul : pas d'abréviation, le pavillon suffit à identifier la langue.
   Le nom complet reste lu par les lecteurs d'écran. */
.declencheur {
  display: inline-flex; align-items: center; justify-content: center;
  width: 42px; height: 42px; padding: 0; min-height: 0;
  border: 1px solid #EDE4D8; border-radius: 50%;
  background: #fff; color: #6F4E37; cursor: pointer; line-height: 1;
  box-shadow: 0 2px 8px rgba(62, 44, 31, .06);
  transition: border-color .25s, box-shadow .25s, transform .25s;
}
.declencheur:hover {
  border-color: #C19A6B;
  box-shadow: 0 6px 16px rgba(111, 78, 55, .18);
  transform: translateY(-1px);
}
.declencheur:focus-visible { outline: 3px solid rgba(193, 154, 107, .45); outline-offset: 2px; }


/* Variante pour en-tête foncé */
.lang.sombre .declencheur { background: rgba(255, 255, 255, .12); border-color: rgba(255, 255, 255, .25); color: #fff; }
.lang.sombre .declencheur:hover { background: rgba(255, 255, 255, .2); }

/* --- Menu --- */
.voile { position: fixed; inset: 0; z-index: 40; }

.menu {
  position: absolute; top: calc(100% + 12px); right: 0; z-index: 50;
  min-width: 216px; padding: 8px;
  background: #fff; border: 1px solid #F0E9E0; border-radius: 20px;
  box-shadow: 0 20px 44px rgba(62, 44, 31, .18);
}
.fleche {
  position: absolute; top: -6px; right: 22px; width: 12px; height: 12px;
  background: #fff; border-left: 1px solid #F0E9E0; border-top: 1px solid #F0E9E0;
  transform: rotate(45deg); border-radius: 2px 0 0 0;
}
.entete {
  margin: 4px 10px 8px; font-size: .64rem; font-weight: 700;
  letter-spacing: .14em; text-transform: uppercase; color: #b8a893;
}

.option {
  position: relative; width: 100%;
  display: flex; align-items: center; gap: 11px;
  padding: 9px 10px; border: none; border-radius: 14px;
  background: transparent; cursor: pointer; text-align: left;
  animation: entree .28s ease both; animation-delay: var(--retard);
}
.option:hover { background: #FBF7F1; }
.option:focus-visible { outline: 3px solid rgba(193, 154, 107, .45); outline-offset: -2px; }
.option.actif { background: linear-gradient(120deg, #FBF7F1, #F4EADC); }

.rond {
  display: grid; place-items: center; flex-shrink: 0;
  transition: transform .25s;
}
.option:hover .rond { transform: scale(1.08) rotate(-4deg); }

.textes { display: flex; flex-direction: column; gap: 1px; flex: 1; min-width: 0; }
.textes strong { font-size: .85rem; font-weight: 600; color: #3E2C1F; }
.textes small { font-size: .68rem; color: #a99e90; }
.option.actif .textes strong { color: #6F4E37; font-weight: 700; }
.coche { color: #6F4E37; flex-shrink: 0; }

@keyframes entree {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: none; }
}

.deploie-enter-active { transition: opacity .2s ease, transform .22s cubic-bezier(.2, .9, .3, 1.2); }
.deploie-leave-active { transition: opacity .14s ease, transform .14s ease; }
.deploie-enter-from, .deploie-leave-to { opacity: 0; transform: translateY(-8px) scale(.96); }

@media (prefers-reduced-motion: reduce) {
  .declencheur, .rond, .option { transition: none; animation: none; }
  .deploie-enter-active, .deploie-leave-active { transition: none; }
}
</style>
