import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
import Login from '@/components/Stailika/Auth/Login.vue';
import Master from '@/components/Stailika/Layout/Master.vue';
import Dashboard from '@/components/Stailika/Layout/Dashboard.vue';
import Pricing from '@/components/Stailika/pages/Pricing.vue';
import Appointment from '@/components/Stailika/pages/Appointment.vue';
import Comments from '@/components/Stailika/pages/Comments.vue';
import Contactus from '@/components/Stailika/pages/Contactus.vue';
import Categories from '@/components/Stailika/pages/Categories.vue';
import Products from '@/components/Stailika/pages/Products.vue';
import AddPricing from '@/components/Stailika/pages/addPricing.vue';




const routes = [

  {
    path: '/',
    name: 'login',
    component: Login,
    beforeEnter: (to, from, next) => {
      if (store.getters['auth/authenticated']) {
        return next({ name: 'dashboard' });
      }
      next();
    }
  },
  {
    path: '/master',
    name: 'master',
    component: Master,
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        beforeEnter: (to, from, next) => {
          if (!store.getters['auth/authenticated']) {
            return next({ name: 'login' });
          }
          next();
        }
      },
      {
        path: '/pricing',
        name: 'pricing',
        component: Pricing,
      },
      {
        path: '/appointments',
        name: 'appointments',
        component: Appointment,
      },
      {
        path: '/comments',
        name: 'comments',
        component: Comments,
      },
      {
        path: '/categories',
        name: 'categories',
        component: Categories,
      },
      {
        path: '/products',
        name: 'products',
        component: Products,
      },
      {
        path: '/pricing/add-package',
        name: 'add-package',
        component: AddPricing,
      },
      {
        path: '/contact-us',
        name: 'contact-us',
        component: Contactus,
      }


    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})



export default router
