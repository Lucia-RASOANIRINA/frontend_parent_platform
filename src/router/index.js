import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import Evenements from '../pages/Evenements.vue'
import APropos from '../pages/APropos.vue'
import HomeParent from '../pages/HomeParent.vue'
import HomeTeacher from '../pages/HomeTeacher.vue'
import DiscussionsTeacher from '../pages/DiscussionsTeacher.vue'
import RessourcesTeacher from '../pages/RessourcesTeacher.vue'
import HomePsy from '../pages/HomePsy.vue'
import DiscussionsPsy from '../pages/DiscussionsPsy.vue'
import ParentPub from "../pages/ParentPub.vue";
import DiscussionsParent from "../pages/DiscussionsParent.vue";

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
    meta: { layout: 'parent' }
  },
  {
    path: '/parentpub',
    name: 'ParentPub',
    component: ParentPub,
    meta: { layout: 'parent' }
  },
  {
    path: '/parentdiscussions',
    name: 'DiscussionsParent',
    component: DiscussionsParent,
    meta: { layout: 'parent' }
  },
  {
    path: '/hometeacher',  
    name: 'HomeTeacher',
    component: HomeTeacher,
    meta: { layout: 'educatrice' }
  },
  {
    path: '/discussionsteacher',  
    name: 'DiscussionsTeacher',
    component: DiscussionsTeacher,
    meta: { layout: 'educatrice' }
  },
  {
    path: '/ressourcesteacher',  
    name: 'RessourcesTeacher',
    component: RessourcesTeacher,
    meta: { layout: 'educatrice' }
  },
  {
    path: '/homepsy',  
    name: 'HomePsy',
    component: HomePsy,
    meta: { layout: 'psy' }
  },
  {
    path: '/discussionspsy',  
    name: 'DiscussionsPsy',
    component: DiscussionsPsy,
    meta: { layout: 'psy' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router