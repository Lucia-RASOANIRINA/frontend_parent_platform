import Home from '../../pages/Home.vue'
import Login from '../../pages/Login.vue'
import Evenements from '../../pages/Evenements.vue'
import Conferences from '../../pages/Conferences.vue'
import APropos from '../../pages/APropos.vue'
import MentionsLegales from '../../pages/MentionsLegales.vue'
import Confidentialite from '../../pages/Confidentialite.vue'
import Cookies from '../../pages/Cookies.vue'

/** Espace visiteur : pages accessibles sans compte. */
export default [
  { path: '/', name: 'Home', component: Home, meta: { layout: 'default', showFooter: true } },
  { path: '/connexion', name: 'Login', component: Login, meta: { layout: 'auth' } },
  { path: '/evenements', name: 'Evenements', component: Evenements, meta: { layout: 'default', showFooter: true } },
  { path: '/conferences', name: 'Conferences', component: Conferences, meta: { layout: 'default', showFooter: true } },
  { path: '/apropos', name: 'APropos', component: APropos, meta: { layout: 'default', showFooter: true } },

  // Pages légales
  { path: '/mentions', name: 'MentionsLegales', component: MentionsLegales, meta: { layout: 'default', showFooter: true } },
  { path: '/confidentialite', name: 'Confidentialite', component: Confidentialite, meta: { layout: 'default', showFooter: true } },
  { path: '/cookies', name: 'Cookies', component: Cookies, meta: { layout: 'default', showFooter: true } },
]
