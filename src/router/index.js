import { createRouter, createWebHistory } from 'vue-router'

import publiques from './routes/public'
import parent from './routes/parent'
import educatrice from './routes/educatrice'
import psy from './routes/psy'
import admin from './routes/admin'

/**
 * Routeur unique de Parentia.
 *
 * Chaque espace (visiteur, parent, éducatrice, psychologue, administration)
 * décrit ses propres routes dans « router/routes/ » ; ce fichier les rassemble.
 * Ajouter une page revient donc à toucher un seul module, et la table complète
 * des routes reste lisible d'un coup d'œil.
 */
const routes = [
  ...publiques,
  ...parent,
  ...educatrice,
  ...psy,
  ...admin,

  // Toute adresse inconnue ramène à l'accueil
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Revenir en haut à chaque navigation, sauf retour arrière du navigateur
  scrollBehavior(to, from, position) {
    if (position) return position
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

/** Titre de l'onglet cohérent avec la page ouverte. */
router.afterEach((to) => {
  const nom = typeof to.name === 'string' ? to.name : ''
  document.title = nom && nom !== 'Home'
    ? `Parentia — ${nom.replace(/([A-Z])/g, ' $1').trim()}`
    : 'Parentia — Communauté Parentale et Bien-être Éducatif'
})

export default router
