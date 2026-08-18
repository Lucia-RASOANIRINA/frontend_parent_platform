/**
 * Numéros de téléphone malgaches.
 *
 * Les champs acceptaient n'importe quelle saisie, y compris des lettres.
 * Deux écritures cohabitent à Madagascar et l'utilisateur doit rester libre
 * de choisir la sienne :
 *
 *   national     0XX XX XXX XX     ex. 034 02 261 37
 *   international +261 XX XX XXX XX ex. +261 34 02 261 37
 *
 * Les opérateurs mobiles sont 032, 033, 034, 037 et 038 ; le fixe est 020.
 * Le groupement des chiffres est appliqué au fil de la frappe.
 */

const PREFIXES = ['20', '32', '33', '34', '37', '38']

/** Ne garde que les chiffres, et le « + » s'il ouvre la saisie. */
export function nettoyer(valeur) {
  if (!valeur) return ''
  const plus = valeur.trimStart().startsWith('+')
  const chiffres = valeur.replace(/\D/g, '')
  return (plus ? '+' : '') + chiffres
}

/**
 * Met en forme au fil de la frappe, sans jamais rejeter une saisie en cours.
 * On respecte l'écriture choisie : si la personne commence par « + », on reste
 * en international ; sinon on reste en national.
 */
export function formater(valeur) {
  const brut = nettoyer(valeur)
  if (!brut) return ''

  const international = brut.startsWith('+')
  let chiffres = international ? brut.slice(1) : brut

  // « +261 0 34 … » : le zéro national n'a pas lieu d'être après l'indicatif
  if (international && chiffres.startsWith('261')) {
    const reste = chiffres.slice(3).replace(/^0+/, '')
    return groupes('+261', reste, [2, 2, 3, 2])
  }
  if (international) return '+' + chiffres

  // National : 0 puis 9 chiffres
  if (chiffres.startsWith('0')) return groupes('', chiffres, [3, 2, 3, 2])
  return chiffres
}

/** Découpe une suite de chiffres selon un gabarit, en gardant les espaces. */
function groupes(prefixe, chiffres, tailles) {
  const morceaux = []
  let reste = chiffres
  for (const taille of tailles) {
    if (!reste) break
    morceaux.push(reste.slice(0, taille))
    reste = reste.slice(taille)
  }
  if (reste) morceaux.push(reste)
  return [prefixe, ...morceaux].filter(Boolean).join(' ')
}

/** Un numéro vide est accepté : le téléphone n'est pas obligatoire. */
export function estValide(valeur) {
  if (!valeur || !valeur.trim()) return true
  const brut = nettoyer(valeur)

  if (brut.startsWith('+')) {
    const chiffres = brut.slice(1)
    if (!chiffres.startsWith('261')) return false
    const national = chiffres.slice(3)
    return national.length === 9 && PREFIXES.includes(national.slice(0, 2))
  }

  if (!brut.startsWith('0')) return false
  return brut.length === 10 && PREFIXES.includes(brut.slice(1, 3))
}

/** Forme canonique pour le serveur : toujours +261XXXXXXXXX. */
export function normaliser(valeur) {
  if (!estValide(valeur) || !valeur?.trim()) return valeur ? valeur.trim() : ''
  const brut = nettoyer(valeur)
  const chiffres = brut.startsWith('+') ? brut.slice(4) : brut.slice(1)
  return '+261' + chiffres
}
