import HomePsy from '../../pages/HomePsy.vue'
import PsyPub from '../../pages/PsyPub.vue'
import DiscussionsPsy from '../../pages/DiscussionsPsy.vue'
import RessourcesPsy from '../../pages/RessourcesPsy.vue'
import ProfilPsy from '../../pages/ProfilPsy.vue'
import EvenementsPsy from '../../pages/EvenementsPsy.vue'
import ConferencesPsy from '../../pages/ConferencesPsy.vue'

/** Espace des psychologues. */
const meta = { layout: 'psy', role: 'PSY', showFooter: true }

export default [
  { path: '/homepsy', name: 'HomePsy', component: HomePsy, meta },
  { path: '/psypub', name: 'PsyPub', component: PsyPub, meta },
  { path: '/ressourcespsy', name: 'RessourcesPsy', component: RessourcesPsy, meta },
  { path: '/discussionspsy', name: 'DiscussionsPsy', component: DiscussionsPsy, meta: { ...meta, showFooter: false } },
  { path: '/profilpsy', name: 'ProfilPsy', component: ProfilPsy, meta },
  { path: '/psy/evenements', name: 'EvenementsPsy', component: EvenementsPsy, meta },
  { path: '/psy/conferences', name: 'ConferencesPsy', component: ConferencesPsy, meta },
]
