import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login/index.vue'
import Home from '../views/Home/index.vue'
import Project from '../views/Project/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Project', component: Project },
    { path: '/login', name: 'Login', component: Login },
    { path: '/list', name: 'Home', component: Home },
  ],
})

export default router
