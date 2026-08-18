import { reactive } from 'vue'
import { t } from '../i18n'

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
  visitor: (text, title = null) =>
    open('visitor', title || t('notif.rejoindre'), text, [
      { label: t('notif.seConnecter'), to: '/connexion?mode=login', primary: true },
      { label: t('notif.creerCompte'), to: '/connexion?mode=register' },
      { label: t('notif.plusTard') },
    ]),
  /**
   * Confirmation avant toute suppression définitive.
   * Le bouton neutre est mis en avant : on ne supprime jamais par inadvertance.
   *
   * @param {string} quoi  ce qui va disparaître, ex. t('notif.ceCommentaire')
   */
  confirmDelete: (quoi, onConfirm) =>
    open('error', t('notif.supprimerTitre'), t('notif.supprimerTexte', { quoi }), [
      { label: t('notif.nonGarder'), primary: true, onClick: null },
      { label: t('notif.ouiSupprimer'), onClick: onConfirm },
    ]),
  /** Confirmation de déconnexion personnalisée (jeux de mots) selon le rôle. */
  confirmLogout: (onConfirm, role = '') => {
    const cle = ['ADMIN', 'PARENT', 'EDUCATEUR', 'PSY'].includes(role) ? role.toLowerCase() : 'defaut'
    open('info', t(`notif.adieu.${cle}Titre`), t(`notif.adieu.${cle}Texte`), [
      { label: t('notif.jeReste'), primary: true, onClick: null },
      { label: t('notif.meDeconnecter'), onClick: onConfirm },
    ])
  },
  custom: open,
}

export default notify
