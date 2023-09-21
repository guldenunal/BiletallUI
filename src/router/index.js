import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import JourneysView from '../views/JourneysView.vue'
import ReservationView from '../views/ReservationView.vue'
import PaaymentView from '../views/PaymentView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/journey',
      name: 'JourneysView',
      component: JourneysView
    },
    {
      path: '/reservation',
      name: 'ReservationView',
      component: ReservationView
    },
    {
      path: '/payment',
      name:'PaymentView',
      component: PaaymentView
    }
  ]
})
export default router

