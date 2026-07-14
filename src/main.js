import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';

import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';

import Swal from 'sweetalert2';
import ApexCharts from 'apexcharts';
import VueApexCharts from 'vue3-apexcharts';

import 'material-design-icons-iconfont/dist/material-design-icons.css';
import '@mdi/font/css/materialdesignicons.css';

import '@/assets/css/swal.css';
import '@/assets/css/gate-dialog.css';

// custom store subscriptions
require('@/store/subscribe');

loadFonts();

// =========================
// AXIOS CONFIG
// =========================
// axios.defaults.baseURL = 'http://localhost:8000/api/';
axios.defaults.baseURL = 'http://41.59.85.12/Gatepass-api/public/api';

// helper for images
const getImageUrl = (imageName) => {
  // return `http://localhost:8000/${imageName}`;
  return `http://41.59.85.12/Gatepass-api/public/#/${imageName}`;
};

// =========================
// CREATE APP
// =========================
const app = createApp(App);

// Global properties
app.config.globalProperties.$swal = Swal;
app.config.globalProperties.$apexcharts = ApexCharts;
app.config.globalProperties.$getImageUrl = getImageUrl;

// register chart component
app.component('apexchart', VueApexCharts);

// =========================
// GLOBAL PERMISSION HELPERS
// =========================
app.config.globalProperties.$hasPermission = (permission) => {
  return store.getters['auth/hasPermission'](permission);
};

app.config.globalProperties.$hasRole = (role) => {
  return store.getters['auth/hasRole'](role);
};

// =========================
// AUTH BOOTSTRAP (CRITICAL FIX)
// =========================
const token = localStorage.getItem('access_token');

async function bootstrapAuth() {
  if (!token) return;

  try {
    await store.dispatch('auth/attempt', token);
  } catch (e) {
    console.error('Auth bootstrap failed:', e);
  }
}

// =========================
// INIT APP FLOW
// =========================
(async () => {
  await bootstrapAuth();

  // IMPORTANT: mount ONLY after auth is resolved
  app.use(store);
  app.use(router);
  app.use(vuetify);

  app.mount('#app');
})();