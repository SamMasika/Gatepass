import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import Login from '@/components/MNK/Auth/Login.vue';
import Master from '@/components/MNK/Layout/Master.vue';
import Dashboard from '@/components/MNK/Layout/Dashboard.vue';
import Team from '@/components/MNK/pages/Team.vue';
import Comments from '@/components/MNK/pages/Comments.vue';
import Contactus from '@/components/MNK/pages/Contactus.vue';
import Gallery from '@/components/MNK/pages/Gallery.vue';
import Changepassword from '@/components/MNK/Settings/Changepassword.vue';
import Profile from '@/components/MNK/Layout/Profile.vue';




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
        path: '/team',
        name: 'team',
        component: Team,
      },
      {
        path: '/comments',
        name: 'comments',
        component: Comments,
      },
      {
        path: '/gallery',
        name: 'gallery',
        component: Gallery,
      },
      {
        path: '/contact-us',
        name: 'contact-us',
        component: Contactus,
      },
      {
        path: '/change-password',
        name: 'change-password',
        component: Changepassword,
      },
      {
        path: '/profile',
        name: 'profile',
        component: Profile,
      }


    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})



export default router
