<template>
<!-- Fixed Sidebar -->
<v-navigation-drawer v-model="drawer" app v-if="user?.company?.isComplete !== false" :width="drawer ? 310 : 64">
    <Sidebar />
</v-navigation-drawer>

<!-- App Bar -->
<v-app-bar scroll-behavior="elevate" dark>
    <v-app-bar-nav-icon v-if="user?.company?.isComplete !== false" @click="drawer = !drawer" color="blue-grey lighten-1" class="mx-5" />

    <v-spacer></v-spacer>

    <!-- Theme Toggle -->
    <!-- <v-btn icon @click="toggleTheme" variant="solo-filled">
        <v-icon class="custom-icon">
            {{ darkTheme ? 'mdi-moon-waning-crescent' : 'mdi-white-balance-sunny' }}
        </v-icon>
    </v-btn> -->

    <!-- User Menu -->
    <v-menu open-on-hover>
        <template v-slot:activator="{ props }">
            <v-chip v-bind="props" class="mx-5 chip-color">
               <v-icon>mdi-account</v-icon>
                <span v-if="user">{{ user.firstname }} {{ user.lastname }}</span>
                <span v-else>Guest</span>
                <v-icon>mdi-menu-down</v-icon>
            </v-chip>
        </template>

        <v-list>
            <v-list-item @click="goToProfile">
                <v-icon class="mx-5">mdi-account</v-icon>
                Profile
            </v-list-item>

            <router-link to="/change-password" style="text-decoration: none; color: inherit;">
                <v-list-item>
                    <v-icon class="mx-5">mdi-lock-minus</v-icon>
                    Change Password
                </v-list-item>
            </router-link>

            <v-list-item @click="logout">
                <v-list-item-title>
                    <v-icon class="mx-5">mdi-arrow-right-bold-box-outline</v-icon>
                    Logout
                </v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</v-app-bar>

<!-- Scrollable Main Content -->
<v-main class="main-content">
    <v-container fluid class="fill-height d-flex align-center justify-center">
        <router-view />
    </v-container>
</v-main>

<!-- Footer -->
<v-footer app class="footer">
    <v-container>
        <v-row justify="center" align="center" class="text-center">
            <v-col cols="auto">
                <span class="headline font-weight-bold">Stailika</span>
            </v-col>
            <v-col cols="auto">
                <span class="body-1">© {{ new Date().getFullYear() }} All Rights Reserved</span>
            </v-col>
        </v-row>
    </v-container>
</v-footer>
</template>

<script>
import Sidebar from './Sidebar.vue';
import {
    mapGetters,
    mapActions
} from 'vuex';

export default {
    name: 'App',
    components: {
        Sidebar,
    },
    data: () => ({
        drawer: true,
        darkTheme: false,
    }),
    computed: {
        ...mapGetters({
            authenticated: 'auth/authenticated',
            user: 'auth/user',
        }),
    },
    methods: {
        ...mapActions({
            logoutAction: 'auth/logout',
        }),
        logout() {
            this.logoutAction()
                .then(() => this.$router.replace({
                    name: 'login'
                }))
                .catch((error) => console.error('Logout error:', error));
        },
        toggleTheme() {
            this.darkTheme = !this.darkTheme;
        },
        setThemeBasedOnTime() {
            const hour = new Date().getHours();
            this.darkTheme = hour >= 18 || hour < 6;
        },
        goToProfile() {
            this.$router.push({
                name: 'user-profile',
            });
        },
    },
    created() {
        this.setThemeBasedOnTime();
        setInterval(this.setThemeBasedOnTime, 60000);
    },
};
</script>

<style>
@import 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';

html,
body,
/* #app {
    height: 100%;
    margin: 0;
    overflow: hidden;
} */
/* Buttons */
/* .login-btn {
    background-color: #020B2C !important;
    color: white !important;
    font-weight: bold;
} */
.v-application {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.main-content {
    flex-grow: 1;
    /* Allows content to take remaining space */
    overflow-y: auto;
    /* Enables scrolling */
    padding: 16px;
    /* height: calc(100vh - 64px);  */
}

.v-footer {
    flex-shrink: 0;
}

.custom-icon {
    color: #020B2C !important;
}

.chip-color {
    background-color: #020B2C !important;
    color: white !important;
}

.button-color {
    background-color: #020B2C !important;
    color: white !important;
}

.title {
    font-size: 50px;
    font-weight: 700;
    color: #1a237e;
}

.subtitle {
    font-size: 16px;
    color: #546e7a;
}

.section-title {
    font-weight: 600;
    font-size: 17px;
    padding: 10px 14px;
    border-left: 5px solid #020B2C;
    background-color: #e3f2fd;
    margin-bottom: 12px;
    border-radius: 6px;
    color: #263238;
}

.detail {
    font-size: 15px;
    color: #37474f;
    padding: 8px 0;
    margin-top: 10px;
}

.detail-spacing {
    margin-right: 5px;
}

.relative-container {
    position: relative;
    height: 70vh;
    /* Adjust height as needed */
}

.centered-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -40%);
    /* center, but push slightly up */
}

.custom-breadcrumbs {
    /* background-color: #f9fbfd; */
    padding: 12px 20px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 500;
    color: #455a64;
    /* box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04); */
    display: flex;
    align-items: center;
    gap: 6px;
}

.breadcrumb-item {
    cursor: pointer;
    position: relative;
    transition: color 0.2s ease;
    padding-bottom: 2px;
}

.breadcrumb-item::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0%;
    height: 2px;
    background-color: #020B2C;
    /* Vuetify primary */
    transition: width 0.3s ease;
}

.breadcrumb-item:hover::after {
    width: 100%;
}

.breadcrumb-item:hover {
    color: #020B2C;
}

.breadcrumb-item.active {
    color: #90a4ae;
    cursor: default;
    text-decoration: none;
}

.breadcrumb-separator {
    color: #b0bec5;
}
.v-card{
	border-radius: 10px;
	
}


</style>
