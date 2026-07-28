import { reactive } from 'vue'

/**
 * Système de notifications unifié pour toute la plateforme.
 * Même style que la message box de connexion réussie (page Login).
 *
 * Utilisation :
 *   import { notify } from '@/services/notify'
 *   notify.success('Titre', 'Message')
 *   notify.error('Titre', 'Message')
 *   notify.info('Titre', 'Message')
 *   notify.visitor('Connectez-vous pour participer.')   // affiche Se connecter / S'inscrire
 */
export const notifyState = reactive({
  show: false,
  type: 'info',        // success | error | info | visitor
  title: '',
  text: '',
  actions: null,       // [{ label, to?, onClick?, primary? }]
})

function open(type, title, text, actions = null) {
  notifyState.type = type
  notifyState.title = title
  notifyState.text = text
  notifyState.actions = actions
  notifyState.show = true
}

export function closeNotify() {
  notifyState.show = false
}

export const notify = {
  success: (title, text) => open('success', title, text),
  error: (title, text) => open('error', title, text),
  info: (title, text) => open('info', title, text),
  /** Message box pour les visiteurs : se connecter, s'inscrire, ou plus tard. */
  visitor: (text, title = 'Rejoignez la communauté Parentia') =>
    open('visitor', title, text, [
      { label: 'Se connecter', to: '/connexion?mode=login', primary: true },
      { label: "Créer mon compte", to: '/connexion?mode=register' },
      { label: 'Plus tard' },
    ]),
  /** Confirmation de déconnexion personnalisée (jeux de mots) selon le rôle. */
  confirmLogout: (onConfirm, role = '') => {
    const messages = {
      ADMIN: { title: 'On se quitte déjà, capitaine ?', text: "Votre tableau de bord va se sentir bien seul sans vous." },
      PARENT: { title: 'Déjà l\'heure de la sieste ?', text: "La communauté garde votre place au chaud pour votre retour." },
      EDUCATEUR: { title: 'Fin de la récré ?', text: "Vos petites graines pédagogiques vous attendront ici." },
      PSY: { title: 'Besoin d\'une pause bien-être ?', text: "Prenez soin de vous, on se retrouve très vite." },
    }
    const m = messages[role] || { title: 'Vous nous quittez déjà ?', text: "La communauté Parentia vous attend pour la suite." }
    open('info', m.title, m.text, [
      { label: 'Je reste encore un peu', primary: true, onClick: null },
      { label: 'Me déconnecter', onClick: onConfirm },
    ])
  },
  custom: open,
}

export default notify
