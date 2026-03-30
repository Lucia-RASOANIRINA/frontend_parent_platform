import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import Evenements from '../pages/Evenements.vue'
import APropos from '../pages/APropos.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/connexion',
    name: 'Login',
    component: Login
  },
  {
    path: '/evenements',
    name: 'Evenements',
    component: Evenements
  },
  {
    path: '/apropos',
    name: 'APropos',
    component: APropos
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router