import { createApp, watch } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/theme.css'
import { resoudreApi, economie } from './services/api'
import './i18n'

/**
 * Démarrage de l'application.
 *
 * L'adresse du backend (local ou en ligne) est résolue AVANT le montage :
 * les pages n'ont donc jamais à s'en préoccuper.
 */

// Le mode économie de données pilote quelques règles CSS globales
function appliquerEconomie(actif) {
  document.documentElement.classList.toggle('economie', !!actif)
}
appliquerEconomie(economie.actif)
watch(() => economie.actif, appliquerEconomie)

// Mise en cache hors ligne (uniquement sur le site déployé / build de production)
function enregistrerServiceWorker() {
  if (!('serviceWorker' in navigator) || !import.meta.env.PROD) return
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Pas de mise en cache hors ligne : l'application reste pleinement utilisable
    })
  })
}

async function demarrer() {
  try {
    await resoudreApi()
  } catch {
    // Même sans serveur joignable, l'interface doit s'afficher
  }
  createApp(App).use(router).mount('#app')
  enregistrerServiceWorker()
}

demarrer()
