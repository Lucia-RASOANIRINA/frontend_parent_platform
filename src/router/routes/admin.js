import HomeAdmin from '../../pages/HomeAdmin.vue'
import UsersAdmin from '../../pages/UsersAdmin.vue'
import EvenementsAdmin from '../../pages/EvenementsAdmin.vue'
import ConferencesAdmin from '../../pages/ConferencesAdmin.vue'
import ContenuAdmin from '../../pages/ContenuAdmin.vue'

/** Espace d'administration. */
const meta = { layout: 'admin', role: 'ADMIN', showFooter: true }

export default [
  { path: '/admin', name: 'HomeAdmin', component: HomeAdmin, meta },
  { path: '/admin/utilisateurs', name: 'UsersAdmin', component: UsersAdmin, meta },
  { path: '/admin/evenements', name: 'EvenementsAdmin', component: EvenementsAdmin, meta },
  { path: '/admin/conferences', name: 'ConferencesAdmin', component: ConferencesAdmin, meta },
  { path: '/admin/contenu', name: 'ContenuAdmin', component: ContenuAdmin, meta },
]
