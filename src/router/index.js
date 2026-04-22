import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import Evenements from '../pages/Evenements.vue'
import APropos from '../pages/APropos.vue'
import HomeParent from '../pages/HomeParent.vue'
import HomeTeacher from '../pages/HomeTeacher.vue'
import DiscussionsTeacher from '../pages/DiscussionsTeacher.vue'
import RessourcesTeacher from '../pages/RessourcesTeacher.vue'
import TeacherPub from '../pages/TeacherPub.vue'
import HomePsy from '../pages/HomePsy.vue'
import PsyPub from '../pages/PsyPub.vue'
import DiscussionsPsy from '../pages/DiscussionsPsy.vue'
import RessourcesPsy from '../pages/RessourcesPsy.vue'
import ParentPub from "../pages/ParentPub.vue";
import ProfilParent from "../pages/ProfilParent.vue";
import DiscussionsParent from "../pages/DiscussionsParent.vue";
import RessourcesParent from "../pages/RessourcesParent.vue";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { layout: 'default', showFooter: true }  // ← ajout showFooter
  },
  {
    path: '/connexion',
    name: 'Login',
    component: Login,
    meta: { layout: 'auth' }
  },
  {
    path: '/evenements',
    name: 'Evenements',
    component: Evenements,
    meta: { layout: 'default', showFooter: true }  // ← ajout showFooter
  },
  {
    path: '/apropos',
    name: 'APropos',
    component: APropos,
    meta: { layout: 'default', showFooter: true }  // ← ajout showFooter
  },
  {
    path: '/homeparent',
    name: 'HomeParent',
    component: HomeParent,
    meta: { layout: 'parent', showFooter: true }
  },
  {
    path: '/parentpub',
    name: 'ParentPub',
    component: ParentPub,
    meta: { layout: 'parent', showFooter: true }
  },
  {
    path: '/parentdiscussions',
    name: 'DiscussionsParent',
    component: DiscussionsParent,
    meta: { layout: 'parent', showFooter: true }
  },
  {
    path: '/ressourcesparent',
    name: 'RessourcesParent',
    component: RessourcesParent,
    meta: { layout: 'parent', showFooter: true }
  },
  {
    path: '/parentprofil',
    name: 'ProfilParent',
    component: ProfilParent,
    meta: { layout: 'parent', showFooter: true }
  },
  {
    path: '/hometeacher',  
    name: 'HomeTeacher',
    component: HomeTeacher,
    meta: { layout: 'educatrice', showFooter: true }
  },
  {
    path: '/discussionsteacher',  
    name: 'DiscussionsTeacher',
    component: DiscussionsTeacher,
    meta: { layout: 'educatrice', showFooter: true }
  },
  {
    path: '/teacherpub',  
    name: 'TeacherPub',
    component: TeacherPub,
    meta: { layout: 'educatrice', showFooter: true }
  },
  {
    path: '/ressourcesteacher',  
    name: 'RessourcesTeacher',
    component: RessourcesTeacher,
    meta: { layout: 'educatrice', showFooter: true }
  },
  {
  path: '/homepsy',
  name: 'HomePsy',
  component: HomePsy,
  meta: { layout: 'psy', showFooter: true }
  },
  {
    path: '/psypub',
    name: 'PsyPub',
    component: PsyPub,
    meta: { layout: 'psy', showFooter: true }
  },
  {
    path: '/ressourcespsy',
    name: 'RessourcesPsy',
    component: RessourcesPsy,
    meta: { layout: 'psy', showFooter: true }
  },
  {
    path: '/discussionspsy',
    name: 'DiscussionsPsy',
    component: DiscussionsPsy,
    meta: { layout: 'psy', showFooter: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router