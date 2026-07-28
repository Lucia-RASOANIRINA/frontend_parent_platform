import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import Evenements from '../pages/Evenements.vue'
import APropos from '../pages/APropos.vue'

// Parent
import HomeParent from '../pages/HomeParent.vue'
import ParentPub from '../pages/ParentPub.vue'
import ProfilParent from '../pages/ProfilParent.vue'
import DiscussionsParent from '../pages/DiscussionsParent.vue'
import RessourcesParent from '../pages/RessourcesParent.vue'
import EvenementsParent from '../pages/EvenementsParent.vue'

// Éducatrice / Teacher
import HomeTeacher from '../pages/HomeTeacher.vue'
import DiscussionsTeacher from '../pages/DiscussionsTeacher.vue'
import RessourcesTeacher from '../pages/RessourcesTeacher.vue'
import TeacherPub from '../pages/TeacherPub.vue'
import ProfilTeacher from '../pages/ProfilTeacher.vue'
import EvenementsTeacher from '../pages/EvenementsTeacher.vue'

// Psychologue
import HomePsy from '../pages/HomePsy.vue'
import PsyPub from '../pages/PsyPub.vue'
import DiscussionsPsy from '../pages/DiscussionsPsy.vue'
import RessourcesPsy from '../pages/RessourcesPsy.vue'
import ProfilPsy from '../pages/ProfilPsy.vue'
import EvenementsPsy from '../pages/EvenementsPsy.vue'

// Admin
import HomeAdmin from '../pages/HomeAdmin.vue'
import UsersAdmin from '../pages/UsersAdmin.vue'
import EvenementsAdmin from '../pages/EvenementsAdmin.vue'
import ContenuAdmin from '../pages/ContenuAdmin.vue'

// Pages légales
import MentionsLegales from '../pages/MentionsLegales.vue'
import Confidentialite from '../pages/Confidentialite.vue'
import Cookies from '../pages/Cookies.vue'

const routes = [
  // --- Public ---
  { path: '/', name: 'Home', component: Home, meta: { layout: 'default', showFooter: true } },
  { path: '/connexion', name: 'Login', component: Login, meta: { layout: 'auth' } },
  { path: '/evenements', name: 'Evenements', component: Evenements, meta: { layout: 'default', showFooter: true } },
  { path: '/apropos', name: 'APropos', component: APropos, meta: { layout: 'default', showFooter: true } },

  // --- Parent ---
  { path: '/homeparent', name: 'HomeParent', component: HomeParent, meta: { layout: 'parent' } },
  { path: '/parentpub', name: 'ParentPub', component: ParentPub, meta: { layout: 'parent' } },
  { path: '/parentdiscussions', name: 'DiscussionsParent', component: DiscussionsParent, meta: { layout: 'parent' } },
  { path: '/ressourcesparent', name: 'RessourcesParent', component: RessourcesParent, meta: { layout: 'parent' } },
  { path: '/parentprofil', name: 'ProfilParent', component: ProfilParent, meta: { layout: 'parent' } },
  { path: '/parent/evenements', name: 'EvenementsParent', component: EvenementsParent, meta: { layout: 'parent' } },

  // --- Éducatrice / Teacher ---
  { path: '/hometeacher', name: 'HomeTeacher', component: HomeTeacher, meta: { layout: 'educatrice', showFooter: true } },
  { path: '/discussionsteacher', name: 'DiscussionsTeacher', component: DiscussionsTeacher, meta: { layout: 'educatrice', showFooter: true } },
  { path: '/teacherpub', name: 'TeacherPub', component: TeacherPub, meta: { layout: 'educatrice', showFooter: true } },
  { path: '/ressourcesteacher', name: 'RessourcesTeacher', component: RessourcesTeacher, meta: { layout: 'educatrice', showFooter: true } },
  { path: '/profilteacher', name: 'ProfilTeacher', component: ProfilTeacher, meta: { layout: 'educatrice', showFooter: true } },
  { path: '/teacher/evenements', name: 'EvenementsTeacher', component: EvenementsTeacher, meta: { layout: 'educatrice', showFooter: true } },

  // --- Psychologue ---
  { path: '/homepsy', name: 'HomePsy', component: HomePsy, meta: { layout: 'psy', showFooter: true } },
  { path: '/psypub', name: 'PsyPub', component: PsyPub, meta: { layout: 'psy', showFooter: true } },
  { path: '/ressourcespsy', name: 'RessourcesPsy', component: RessourcesPsy, meta: { layout: 'psy', showFooter: true } },
  { path: '/discussionspsy', name: 'DiscussionsPsy', component: DiscussionsPsy, meta: { layout: 'psy', showFooter: true } },
  { path: '/profilpsy', name: 'ProfilPsy', component: ProfilPsy, meta: { layout: 'psy', showFooter: true } },
  { path: '/psy/evenements', name: 'EvenementsPsy', component: EvenementsPsy, meta: { layout: 'psy', showFooter: true } },

  // --- Admin ---
  { path: '/admin', name: 'HomeAdmin', component: HomeAdmin, meta: { layout: 'admin', showFooter: true } },
  { path: '/admin/utilisateurs', name: 'UsersAdmin', component: UsersAdmin, meta: { layout: 'admin', showFooter: true } },
  { path: '/admin/evenements', name: 'EvenementsAdmin', component: EvenementsAdmin, meta: { layout: 'admin', showFooter: true } },
  { path: '/admin/contenu', name: 'ContenuAdmin', component: ContenuAdmin, meta: { layout: 'admin', showFooter: true } },

  // --- Pages légales ---
  { path: '/mentions', name: 'MentionsLegales', component: MentionsLegales, meta: { layout: 'default', showFooter: true } },
  { path: '/confidentialite', name: 'Confidentialite', component: Confidentialite, meta: { layout: 'default', showFooter: true } },
  { path: '/cookies', name: 'Cookies', component: Cookies, meta: { layout: 'default', showFooter: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
