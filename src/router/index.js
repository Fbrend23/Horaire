import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import WeeklyView from '@/views/WeeklyView.vue'
import GraduationView from '@/views/GraduationView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'graduation',
      component: GraduationView,
    },
    {
      path: '/dashboard',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/semaine',
      name: 'weekly',
      component: WeeklyView,
    },
  ],
})

export default router
