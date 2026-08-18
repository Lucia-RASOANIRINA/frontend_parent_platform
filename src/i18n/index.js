import { reactive, computed } from 'vue'
import messages from './locales'

/**
 * Traduction légère, sans dépendance externe.
 *
 * Trois langues sont proposées : français (référence), malagasy et anglais.
 * Une clé manquante retombe sur le français, puis sur la clé elle-même :
 * l'interface reste donc toujours lisible.
 *
 *   import { t, langue, definirLangue } from '../i18n'
 *   t('evenements.titre')
 */

const CLE = 'parentia:langue'

export const LANGUES = [
  { code: 'fr', nom: 'Français', natif: 'France', drapeau: '🇫🇷', court: 'FR' },
  { code: 'mg', nom: 'Malagasy', natif: 'Madagasikara', drapeau: '🇲🇬', court: 'MG' },
  { code: 'en', nom: 'English', natif: 'International', drapeau: '🇬🇧', court: 'EN' },
]

function langueInitiale() {
  try {
    const stockee = localStorage.getItem(CLE)
    if (stockee && messages[stockee]) return stockee
  } catch { /* stockage indisponible */ }
  const navigateur = (typeof navigator !== 'undefined' ? navigator.language : 'fr') || 'fr'
  const code = navigateur.slice(0, 2).toLowerCase()
  return messages[code] ? code : 'fr'
}

export const etatLangue = reactive({ code: langueInitiale() })

/** Langue active (lecture seule). */
export const langue = computed(() => etatLangue.code)

/** Détail de la langue active : nom, drapeau, code court. */
export const langueActive = computed(
  () => LANGUES.find(l => l.code === etatLangue.code) || LANGUES[0]
)

export function definirLangue(code) {
  if (!messages[code]) return etatLangue.code
  etatLangue.code = code
  try { localStorage.setItem(CLE, code) } catch { /* stockage indisponible */ }
  if (typeof document !== 'undefined') document.documentElement.lang = code
  return code
}

function lire(objet, chemin) {
  return chemin.split('.').reduce((acc, cle) => (acc && acc[cle] !== undefined ? acc[cle] : undefined), objet)
}

/**
 * Traduit une clé.
 * @param {string} cle     chemin de la traduction, ex. « evenements.filtres.type »
 * @param {object} valeurs valeurs à injecter : t('x', { n: 3 }) remplace {n}
 */
export function t(cle, valeurs = null) {
  let texte = lire(messages[etatLangue.code], cle)
  if (texte === undefined) texte = lire(messages.fr, cle)
  if (texte === undefined) return cle
  if (valeurs && typeof texte === 'string') {
    return texte.replace(/\{(\w+)\}/g, (_, nom) => (valeurs[nom] !== undefined ? valeurs[nom] : `{${nom}}`))
  }
  return texte
}

/** Version réactive : à utiliser dans un computed pour suivre le changement de langue. */
export function useI18n() {
  return {
    t: (cle, valeurs) => {
      etatLangue.code // dépendance réactive
      return t(cle, valeurs)
    },
    langue,
    langueActive,
    definirLangue,
    LANGUES,
  }
}

// Applique la langue au document dès le chargement
if (typeof document !== 'undefined') document.documentElement.lang = etatLangue.code

export default { t, langue, definirLangue, LANGUES, useI18n }
