<template>
<!-- Fixed Sidebar -->
<v-navigation-drawer v-model="drawer" app :width="drawer ? 300 : 68" class="sidebar-rawer" v-if="user?.company?.isComplete !== false">
    <Sidebar />
</v-navigation-drawer>

<!-- App Bar -->
<v-app-bar scroll-behavior="elevate" flat class="app-bar">
    <v-app-bar-nav-icon @click="drawer = !drawer" class="menu-btn" />
    <v-spacer></v-spacer>
    <!-- User Menu -->
   <v-menu
  open-on-click
  :close-on-content-click="true"
  offset-y
  transition="scale-transition"
>
  <template #activator="{ props }">
    <v-chip v-bind="props" class="user-chip mx-5" pill>
      <v-icon start>mdi-account</v-icon>
      <span v-if="user">{{ user.name }}</span>
      <span v-else>Guest</span>
      <v-icon end>mdi-menu-down</v-icon>
    </v-chip>
  </template>

  <v-list class="user-menu">
    <v-list-item @click="goToProfile">
      <v-icon class="mx-3">mdi-account</v-icon>
      Profile
    </v-list-item>

    <router-link to="/change-password" style="text-decoration: none; color: inherit">
      <v-list-item>
        <v-icon class="mx-3">mdi-lock-minus</v-icon>
        Change Password
      </v-list-item>
    </router-link>

    <v-list-item @click="logout">
      <v-icon class="mx-3">mdi-arrow-right-bold-box-outline</v-icon>
      Logout
    </v-list-item>
  </v-list>
</v-menu>

</v-app-bar>

<!-- Main Content -->
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
                <span class="headline font-weight-bold">MNK Agriventures Ltd.</span>
            </v-col>
            <v-col cols="auto">
                <span class="body-1">© {{ new Date().getFullYear() }} All rights reserved.</span>
            </v-col>
        </v-row>
    </v-container>
</v-footer>
</template>

<script>
import Sidebar from "./Sidebar.vue";
import {
    mapGetters,
    mapActions
} from "vuex";

export default {
    name: "App",
    components: {
        Sidebar,
    },
    data: () => ({
        drawer: true,
        darkTheme: false,
    }),
    computed: {
        ...mapGetters({
            authenticated: "auth/authenticated",
            user: "auth/user",
        }),
    },
    methods: {
        ...mapActions({
            logoutAction: "auth/logout",
        }),
        logout() {
            this.logoutAction()
                .then(() => this.$router.replace({
                    name: "login"
                }))
                .catch((error) => console.error("Logout error:", error));
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
                name: "profile"
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
/* Sidebar Drawer */
.sidebar-drawer {
   
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
}

/* App Bar */
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
    background-color:#06923e;
    /* Vuetify primary */
    transition: width 0.3s ease;
}

.breadcrumb-item:hover::after {
    width: 100%;
}

.breadcrumb-item:hover {
    color: #06923e;
}

.breadcrumb-item.active {
    color: #90a4ae;
    cursor: default;
    text-decoration: none;
}

.breadcrumb-separator {
    color: #b0bec5;
}


.menu-btn {
    color: #06923e !important;
    transition: all 0.3s ease;
}

.menu-btn:hover {
    transform: scale(1.1);
    color: #b87c4c !important;
}

/* User Chip */
.user-chip {
    background: linear-gradient(90deg, #06923e, #b87c4c) !important;
    color: #fff !important;
    font-weight: 600;
    padding: 6px 14px;
    transition: all 0.3s ease;
}

.user-chip:hover {
    box-shadow: 0 4px 10px rgba(6, 146, 62, 0.25);
    transform: translateY(-2px);
}

/* User Menu */
.user-menu {
    min-width: 180px;
}

.user-menu .v-list-item {
    font-weight: 500;
    transition: all 0.2s ease;
}

.user-menu .v-list-item:hover {
    background: #06923e !important;
    color: #fff !important;
}

/* Main Content */
.main-content {
    flex-grow: 1;
    overflow-y: auto;
    padding: 20px;
    /* background: #f9fbfd; */
}

/* Footer */
.footer {
   
    padding: 10px 0;
}
.action-item {
    cursor: pointer;
    transition: background-color 0.2s;
}

.action-item:hover {
   background: #06923e !important;
    color: white;
}
.circle-btn {
    border-radius: 50%;
    padding: 4px;
    min-width: 36px;
    min-height: 36px;
}
.btn-design {
    background: linear-gradient(135deg, #06923e, #b87c4c) !important;
    color: #fff !important;
    font-weight: 500;
    padding: 0 24px;
    height: 44px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

</style>
