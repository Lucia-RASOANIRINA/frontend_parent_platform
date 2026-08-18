import HomeParent from '../../pages/HomeParent.vue'
import ParentPub from '../../pages/ParentPub.vue'
import ProfilParent from '../../pages/ProfilParent.vue'
import DiscussionsParent from '../../pages/DiscussionsParent.vue'
import RessourcesParent from '../../pages/RessourcesParent.vue'
import EvenementsParent from '../../pages/EvenementsParent.vue'
import ConferencesParent from '../../pages/ConferencesParent.vue'

/** Espace des parents. */
const meta = { layout: 'parent', role: 'PARENT', showFooter: true }

export default [
  { path: '/homeparent', name: 'HomeParent', component: HomeParent, meta },
  { path: '/parentpub', name: 'ParentPub', component: ParentPub, meta },
  { path: '/parentdiscussions', name: 'DiscussionsParent', component: DiscussionsParent, meta: { ...meta, showFooter: false } },
  { path: '/ressourcesparent', name: 'RessourcesParent', component: RessourcesParent, meta },
  { path: '/parentprofil', name: 'ProfilParent', component: ProfilParent, meta },
  { path: '/parent/evenements', name: 'EvenementsParent', component: EvenementsParent, meta },
  { path: '/parent/conferences', name: 'ConferencesParent', component: ConferencesParent, meta },
]
