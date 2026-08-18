import api from './api'

/**
 * Traductions automatiques des contenus écrits par les membres.
 * Produites côté serveur à la publication, supprimées avec le contenu.
 */

/** Traduction d'un contenu unique. Renvoie null si elle n'existe pas. */
export async function traductionContenu(type, id, langue) {
  try {
    const { data } = await api.get(`/traductions/${type}/${id}`, { params: { langue } })
    return data.traduction || null
  } catch {
    // Une traduction manquante ne doit jamais empêcher d'afficher le contenu
    return null
  }
}

/**
 * Traductions d'un lot de contenus, indexées par identifiant.
 * Un fil de vingt publications tient en une requête.
 */
export async function traductionsLot(type, ids, langue) {
  const liste = (ids || []).filter(Boolean)
  if (!liste.length || langue === 'fr') return {}
  try {
    const { data } = await api.get(`/traductions/${type}`, {
      params: { langue, ids: liste.join(',') },
    })
    return data.traductions || {}
  } catch {
    return {}
  }
}
