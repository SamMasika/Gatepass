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

// Import custom store subscription
require('@/store/subscribe');

// Initialize the Vue app
const app = createApp(App);

// Global properties
app.config.globalProperties.$swal = Swal;
app.config.globalProperties.$apexcharts = ApexCharts; // Declare ApexCharts globally

// Register VueApexCharts globally
app.component('apexchart', VueApexCharts);

// Load fonts
loadFonts();

// Set the base URL for Axios
// axios.defaults.baseURL = 'http://41.59.228.237/bims-backend/public/api';
axios.defaults.baseURL = 'http://localhost:8000/api/';

// Add method to fetch image URLs
app.config.globalProperties.$getImageUrl = function (imageName) {
//   // return `http://41.59.228.237/bims-backend/public/${imageName}`;
  return `http://localhost:8000/${imageName}`;
};

// Restore token and user from localStorage if available
const savedToken = localStorage.getItem('access_token');
const savedUser = localStorage.getItem('user');
const savedExpiry = localStorage.getItem('expires_in');

if (savedToken && savedUser) {
  store.commit('auth/SET_TOKEN', { token: savedToken, expires_in: savedExpiry });
  store.commit('auth/SET_USER', JSON.parse(savedUser));
}

// Mount the app
app.use(store);
app.use(router);
app.use(vuetify);
app.mount('#app');
