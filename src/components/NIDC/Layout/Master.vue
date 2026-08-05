<template>
<!-- Fixed Sidebar -->
<v-navigation-drawer v-model="drawer" app :width="drawer ? 300 : 68" class="sidebar-rawer" v-if="user?.is_password_changed === 1">
    <Sidebar />
</v-navigation-drawer>
<!-- App Bar -->
<v-app-bar scroll-behavior="elevate" class="light-appbar" height="96">
    <v-app-bar-nav-icon @click="drawer = !drawer" class="menu-btn" />
    <v-spacer></v-spacer>
    <!-- NOTIFICATION ICON -->
    <v-menu offset="10" location="bottom end" transition="fade-transition">
        <template #activator="{ props }">
            <div class="notif-trigger" v-bind="props">
                <v-badge :content="notifications.length" :model-value="notifications.length > 0" color="red-darken-1" overlap>
                    <v-icon class="notif-icon"> mdi-bell-outline </v-icon>
                </v-badge>
            </div>
        </template>

        <!-- DROPDOWN -->
        <v-card class="notif-menu" elevation="2">
            <div class="notif-header">
                <div>
                    <div class="notif-title">Notifications</div>
                    <div class="notif-subtitle">
                        {{ notifications.length }} new updates
                    </div>
                </div>
                <v-icon size="18" class="notif-header-icon">
                    mdi-bell-ring-outline
                </v-icon>
            </div>

            <div class="notif-list">
                <div v-for="(item, i) in notifications" :key="i" class="notif-item">
                    <v-icon class="notif-item-icon">
                        {{ item.icon || "mdi-information-outline" }}
                    </v-icon>

                    <div class="notif-content">
                        <div class="notif-text">
                            {{ item.title }}
                        </div>
                        <div class="notif-meta">
                            {{ item.time }}
                        </div>
                    </div>
                </div>

                <div v-if="notifications.length === 0" class="notif-empty">
                    No new notifications
                </div>
            </div>
        </v-card>
    </v-menu>
    <!-- PREMIUM GATE SWITCHER -->
    <div v-if="$hasRole('Security Officer')">
        <v-menu offset="12" location="bottom end" transition="scale-transition">

            <template #activator="{ props }">
                <div class="gate-switcher-premium" v-bind="props" :class="{ disabled: !canSwitchGate() }">

                    <div class="gate-pill">

                        <div class="gate-icon">
                            <v-icon size="18">mdi-door-closed-lock</v-icon>
                        </div>

                        <div class="gate-info">
                            <div class="gate-label">Active Gate</div>
                            <div class="gate-name">
                                {{ formattedActiveGate }}
                            </div>
                        </div>

                        <v-icon class="gate-arrow">mdi-menu-down</v-icon>

                    </div>

                </div>
            </template>

            <!-- MENU -->
         <v-card class="gate-menu-ultra" elevation="0">

    <!-- TOP HEADER -->
    <div class="gate-top-ultra">
        <div>
            <div class="gate-title-ultra">Gate Control Center</div>
            <div class="gate-subtitle-ultra">
                Manage your active checkpoint
            </div>
        </div>

        <div class="gate-chip-status">
            <v-icon size="14">mdi-shield-check</v-icon>
            Active
        </div>
    </div>

    <!-- ACTIVE GATE HERO CARD -->
    <div class="gate-active-card">
        <div class="active-icon">
            <v-icon size="20">mdi-door-closed-lock</v-icon>
        </div>

        <div class="active-info">
            <div class="active-label">Currently Working At</div>
            <div class="active-value">
                {{ formattedActiveGate }}
            </div>
        </div>
    </div>

    <div class="gate-divider"></div>

    <!-- LIST HEADER -->
    <div class="gate-list-header">
        Available Gates
    </div>

    <!-- LIST -->
    <div class="gate-list-ultra">

        <div
            v-for="(gate, i) in gates"
            :key="i"
            class="gate-item-ultra"
            :class="{ active: activeGate === gate.value }"
             @click="canSwitchGate() && selectGate(gate)"
        >

            <div class="gate-left">

                <div class="gate-dot-ultra" :class="{ active: activeGate === gate.value }"></div>

                <div class="gate-text">
                    <div class="gate-name-ultra">
                        {{ gate.name }}
                    </div>
                    <div class="gate-code-ultra">
                        {{ gate.value }}
                    </div>
                </div>

            </div>

            <div class="gate-right">
                <v-icon
                    v-if="activeGate === gate.value"
                    size="18"
                    color="#1b867c"
                >
                    mdi-check-circle
                </v-icon>
            </div>

        </div>

    </div>

</v-card>
        </v-menu>
    </div>
    <v-menu offset="12" location="bottom end" transition="scale-transition">
        <template #activator="{ props }">
            <div class="user-trigger-premium" v-bind="props">

                <!-- AVATAR -->
                <div class="avatar-premium">
                    {{ user?.first_name?.charAt(0) || "G" }}
                </div>

                <!-- USER META -->
                <div class="meta-premium">
                    <div class="name-premium">
                        {{
                        [user?.first_name, user?.last_name]
                            .filter(Boolean)
                            .join(" ") || "Guest"
                    }}
                    </div>

                    <div class="email-premium">
                        {{ user?.email || "No email" }}
                    </div>
                </div>

                <!-- DROP ICON -->
                <v-icon class="chevron-premium">mdi-menu-down</v-icon>

            </div>
        </template>

        <!-- MENU -->
        <v-card class="menu-premium" elevation="0">
            <!-- HEADER -->
            <div class="menu-header-premium">
                <div class="avatar-lg-premium">
                    {{ user?.first_name?.charAt(0) || "G" }}
                </div>
                <div>
                    <div class="name-lg-premium">
                        {{
                        [user?.first_name, user?.last_name]
                            .filter(Boolean)
                            .join(" ") || "Guest"
                    }}
                    </div>
                    <div class="email-lg-premium">
                        {{ user?.email || "No email" }}
                    </div>
                </div>
            </div>

            <div class="menu-divider-premium"></div>

            <!-- ITEMS -->
            <div class="menu-items-premium">

                <div class="menu-item-premium" @click="goToProfile">
                    <v-icon class="icon-profile">mdi-account-circle-outline</v-icon>
                    <div>
                        <div class="title">My Profile</div>
                        <div class="subtitle">Manage your account details</div>
                    </div>
                </div>

                <div class="menu-item-premium" @click="$router.push('/change-password')">
                    <v-icon class="icon-security">mdi-lock-outline</v-icon>
                    <div>
                        <div class="title">Security</div>
                        <div class="subtitle">Password & authentication</div>
                    </div>
                </div>

                <div class="menu-divider-premium"></div>

                <div class="menu-item-premium logout" @click="logout">
                    <v-icon class="icon-logout">mdi-logout</v-icon>
                    <div>
                        <div class="title">Logout</div>
                        <div class="subtitle">Sign out of system</div>
                    </div>
                </div>

            </div>

        </v-card>
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
                <span class="headline font-weight-bold">NIDC Gate Pass System</span>
            </v-col>
            <v-col cols="auto">
                <span class="body-1">
                    © {{ new Date().getFullYear() }} . All rights reserved.</span>
            </v-col>
        </v-row>
    </v-container>
</v-footer>
</template>

<script>
import axios from "axios";
import Sidebar from "./Sidebar.vue";
import {
    mapGetters,
    mapActions
} from "vuex";
import swtalert from "@/mixins/swtalert.js";

export default {
	name: "App",
	mixins:[swtalert],
    components: {
        Sidebar,
    },
    data: () => ({
        drawer: true,
        darkTheme: false,
        gates: [],
        activeGate: null,
        notifications: [{
                title: "Gate Pass Approved",
                time: "Just now",
                icon: "mdi-shield-check-outline",
            },
            {
                title: "Visitor arrived at Gate 2",
                time: "5 mins ago",
                icon: "mdi-door-open",
            },
            {
                title: "Exit started",
                time: "10 mins ago",
                icon: "mdi-exit-run",
            },
        ],
    }),
    computed: {
        ...mapGetters({
            authenticated: "auth/authenticated",
            user: "auth/user",
        }),
        formattedActiveGate() {
            const map = {
                GATE_1: "Gate 1",
                GATE_2: "Gate 2",
                INSIDE: "Inside",
            };

            return map[this.activeGate] || "No Gate Assigned";
        }
    },
    methods: {
        ...mapActions({
            logoutAction: "auth/logout",
        }),
        logout() {
            this.logoutAction()
                .then(() =>
                    this.$router.replace({
                        name: "login",
                    }),
                )
                .catch((error) => console.error("Logout error:", error));
        },
        toggleTheme() {
            this.darkTheme = !this.darkTheme;
        },
        setThemeBasedOnTime() {
            const hour = new Date().getHours();
            this.darkTheme = hour >= 18 || hour < 6;
		},
		canSwitchGate() {

    if (!this.user?.gate_changed_at) {
        return true;
    }

    const changedAt = new Date(this.user.gate_changed_at);
    const now = new Date();

    const hours =
        (now - changedAt) / (1000 * 60 * 60);

    return hours >= 4;
},
        goToProfile() {
            this.$router.push({
                name: "profile",
            });
        },
        loadGates() {
			this.gates = [
				
                {
                    name: "Gate 1",
                    value: "GATE_1"
                },
                {
                    name: "Gate 2",
                    value: "GATE_2"
                },

            ];
        },

        loadActiveGate() {
            this.activeGate = this.user ?.current_gate || null;
        },
  selectGate(gate) {
    axios.post("gate-passes/set-current-gate", {
        gate: gate.value
    })
    .then((response) => {

        const message =
            response?.data?.message ||
            "Gate updated successfully";

        // update store
        this.$store.commit("auth/SET_USER", {
            ...this.user,
            current_gate: gate.value
        });

        // show success alert
        this.showAlert(message, "success");

        // reload page after short delay (so user sees alert)
        setTimeout(() => {
            window.location.reload();
        }, 1200);

    })
    .catch((error) => {

        const msg =
            error?.response?.data?.message ||
            "Failed to update gate";

        this.showAlert(msg, "error");
    });
}
    },
    created() {
        this.setThemeBasedOnTime();
        setInterval(this.setThemeBasedOnTime, 60000);
    },
    mounted() {
        this.loadGates();
        this.loadActiveGate();
    },
};
</script>

<style>
/* Sidebar Drawer */
.sidebar-drawer {
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
}

/* LIGHT PREMIUM APP BAR */
.light-appbar {
    /* background: rgba(255, 255, 255, 0.92) !important; */
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);

    border-bottom: 1px solid #eef2f7;

    /* box-shadow: 0 4px 18px rgba(15, 23, 42, 0.06); */

    color: #0f172a;
}

/* ICON BUTTON */
.light-appbar .v-app-bar-nav-icon {
    color: #0f172a !important;
}

/* OPTIONAL TITLE STYLE (if you add one) */
.app-title {
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: 0.2px;
}

/* USER TRIGGER CLEAN LOOK */
.user-trigger {
    background: rgba(248, 250, 252, 0.8);
    border: 1px solid #eef2f7;
}

.user-trigger:hover {
    background: #f8fafc;
    transform: translateY(-1px);
}

/* MENU ICON CLEAN */
.menu-btn {
    color: #0f172a !important;
}

.hero-right {
    display: flex;
    align-items: center;
    gap: 14px;
}

.top-glass {
    border: 1px solid rgba(255, 255, 255, 0.9);
    border-radius: 24px;
    padding: 20px 30px;
    display: flex;
    align-items: center;
    gap: 14px;
    /* box-shadow: 0 10px 30px rgba(15, 23, 42, .05); */
}

.profile-avatar {
    width: 48px;
    height: 48px;
    border-radius: 18px;
    background: linear-gradient(135deg, #1b867c, #003b73, #0f172a);

    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
}

.profile-name {
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    color: #0f172a;
}

.profile-role {
    font-size: 12px;
    color: #64748b;
}

/* ACTIVATOR CHIP */
.user-chip {
    background: linear-gradient(135deg, #009688, #00897b);
    border: 1px solid #e5e7eb;
    font-weight: 600;
    color: #fff;
    transition: all 0.25s ease;
}

.user-chip:hover {
    background: #f9fafb;
    border-color: #00897b;
}

.user-name {
    font-size: 14px;
    margin-right: 6px;
}

/* MENU CARD */
.user-menu-card {
    width: 280px;
    border-radius: 16px;
    overflow: hidden;
}

/* HEADER */
.user-menu-header {
    display: flex;
    gap: 14px;
    padding: 16px;
    align-items: center;
    background: linear-gradient(135deg, #00897b, #16a34a);
    color: white;
}

.user-info h4 {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
}

.user-info p {
    margin: 0;
    font-size: 12px;
    opacity: 0.9;
}

/* LIST */
.user-menu-list {
    padding: 6px;
}

/* MENU ITEMS */
.menu-item {
    border-radius: 14px;
    margin: 2px 0;
    transition: all 0.2s ease;
}

.menu-item:hover {
    background: #f0fdf4;
    color: #00897b;
}

.menu-item.logout:hover {
    background: #fef2f2;
}

/* ICON ALIGNMENT */
.menu-item .v-icon {
    margin-right: 12px;
}

/* BREADCRUMB */

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #6b7280;
}

.breadcrumb span {
    cursor: pointer;
    transition: 0.2s;
}

.breadcrumb span:hover {
    color: #2f6b4f;
}

.breadcrumb strong {
    color: #1f2937;
}

.border {
    border: 0.5px solid #eff0ef;
    border-radius: 14px;
}

.menu-btn {
    color: #00897b !important;
    transition: all 0.3s ease;
}

.menu-btn:hover {
    transform: scale(1.1);
    color: #b87c4c !important;
}

/* User Chip */
.user-chip {
    background: linear-gradient(135deg, #1b867c, #003b73, #0f172a);
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
    background: #00897b !important;
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
    background: #00897b !important;
    color: white;
}

.circle-btn {
    border-radius: 50%;
    padding: 4px;
    min-width: 36px;
    min-height: 36px;
}

.btn-design {
    background: linear-gradient(135deg, #00897b, #b87c4c) !important;
    color: #fff !important;
    font-weight: 500;
    padding: 0 24px;
    height: 44px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.top-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 36px;
}

.top-bar h3 {
    font-size: 22px;
    font-weight: 800;
}

.top-bar p {
    font-size: 14px;
    color: #6b7280;
}

.date-chip {
    border-color: #b08b19;
    color: #7a6515;
}

.kpi-card {
    background: #ffffff;
    padding: 20px;
    border-radius: 12px;
    border: 1px solid #eef1ef;
    /* border-left: 4px solid #b08b19; */
    display: flex;
    justify-content: space-between;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    margin-bottom: 16px;
}

.kpi-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 26px rgba(0, 0, 0, 0.08);
}

.kpi-label {
    font-size: 14px;
    font-weight: 600;
}

.kpi-value {
    font-size: 24px;
    font-weight: 700;
}

.kpi-meta {
    font-size: 12px;
    color: #6b7280;
}

.kpi-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* SECTIONS */
.section-card {
    background: #ffffff;
    border-radius: 18px;
    padding: 24px;
    border: 1px solid #e6ebe8;
    margin-bottom: 24px;
}

.section-title {
    font-weight: 700;
    margin-bottom: 18px;
    border-left: 4px solid #00897b;
    padding-left: 12px;
}

.button-color {
    background: linear-gradient(135deg, #1b867c, #003b73, #0f172a);
    color: white !important;
    border-radius: 50px;
}

/* * Permission Cluster */
*/ .cluster-permissions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

/* Permission Pills */
.cluster-permission-pill {
    background: #eef2ff;
    color: #00897b;
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 20px;
    font-weight: 500;
    transition: 0.2s ease;
}

.cluster-permission-pill:hover {
    background: #00897b;
    color: white;
}

/* Larger for permissions tab */
.cluster-permission-pill.large {
    font-size: 12px;
    padding: 6px 12px;
}

.role-chip {
    background: #e0f7fa;
    color: #00695c;
    font-weight: 500;
}

/* =========================================
     SAVE/EDIT DIALOG
========================================= */

.premium-dialog{
    width:min(980px,96vw);
    max-width:980px;
    max-height:95vh;

    display:flex;
    flex-direction:column;

    overflow:hidden;
    border-radius:30px;
}

/* HEADER */
.dialog-header {
    position: relative;
    overflow: hidden;

    padding: 34px 36px;

    background: linear-gradient(135deg, #0f172a, #1e293b, #334155);
}

.header-glow {
    position: absolute;
    width: 280px;
    height: 280px;

    background: rgba(255, 255, 255, 0.08);

    border-radius: 50%;

    top: -120px;
    right: -80px;

    filter: blur(10px);
}

/* ICON */
.dialog-icon {
    width: 78px;
    height: 78px;
    border-radius: 24px;

    background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.2),
            rgba(255, 255, 255, 0.08));

    backdrop-filter: blur(12px);

    border: 1px solid rgba(255, 255, 255, 0.12);

    display: flex;
    align-items: center;
    justify-content: center;

    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

/* TITLE */
.dialog-title {
    font-size: 30px;
    font-weight: 800;
    color: white;
    letter-spacing: -0.5px;
}

.dialog-subtitle {
    margin-top: 8px;

    font-size: 14px;
    line-height: 1.7;

    color: rgba(255, 255, 255, 0.72);
}

/* BADGE */
.dialog-badge {
    display: flex;
    align-items: center;

    padding: 12px 18px;

    border-radius: 999px;

    background: rgba(255, 255, 255, 0.1);

    border: 1px solid rgba(255, 255, 255, 0.12);

    color: white;

    font-size: 13px;
    font-weight: 600;

    backdrop-filter: blur(10px);
}

/* BODY */
.dialog-body{
    flex:1 1 auto;
    overflow-y:auto;
    overflow-x:hidden;

    padding:24px;
    min-height:0;
}
/* SECTION TITLE */
.form-section-title {
    display: flex;
    align-items: center;
}

.section-line {
    width: 42px;
    height: 3px;

    border-radius: 20px;

    background: linear-gradient(to right, #3b82f6, #6366f1);

    margin-right: 12px;
}

.form-section-title span {
    font-size: 18px;
    font-weight: 700;
    color: #0f172a;
}

/* INPUTS */
.premium-input-group {
    margin-bottom: 4px;
}

.premium-label {
    display: block;

    margin-bottom: 10px;

    font-size: 14px;
    font-weight: 700;

    color: #334155;
}

.premium-input :deep(.v-field) {
    background: white !important;

    border-radius: 18px !important;

    box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);

    border: 1px solid #e2e8f0 !important;

    transition: all 0.25s ease;
}

.premium-input :deep(.v-field:hover) {
    border-color: #cbd5e1 !important;
}

.premium-input :deep(.v-field--focused) {
    border-color: #3b82f6 !important;

    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

/* DROPDOWN */
.premium-dropdown-wrapper {
    background: white;

    border-radius: 18px;

    padding: 2px;

    border: 1px solid #e2e8f0;

    box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
}

/* FOOTER */
.dialog-footer {
    padding: 24px 36px;

    background: white;

    border-top: 1px solid #eef2f7;

    display: flex;
    justify-content: flex-end;
    align-items: center;
}

/* BUTTONS */
.cancel-dialog-btn {
    text-transform: uppercase !important;

    font-weight: 700 !important;

    border: 1px solid #d1d5db !important;

    color: #334155 !important;
}

.save-dialog-btn {
    text-transform: none !important;

    font-weight: 700 !important;

    color: white !important;

    background: linear-gradient(135deg, #2563eb, #4f46e5) !important;

    box-shadow: 0 10px 25px rgba(37, 99, 235, 0.25);
}

/* ADD BUTTON */
.premium-add-btn {
    text-transform: none !important;

    font-weight: 700 !important;

    color: white !important;

    background: linear-gradient(135deg, #2563eb, #4f46e5) !important;

    box-shadow: 0 10px 25px rgba(37, 99, 235, 0.25);
}

/* =====================================================
     ACTION BUTTON
===================================================== */

.premium-action-btn {
    width: 42px !important;
    height: 42px !important;

    border-radius: 14px !important;

    background: linear-gradient(to bottom right, #ffffff, #f8fafc) !important;

    border: 1px solid #e2e8f0 !important;

    color: #475569 !important;

    transition: all 0.25s ease;

    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
}

/* HOVER */
.premium-action-btn:hover {
    transform: translateY(-2px);

    border-color: #cbd5e1 !important;

    background: linear-gradient(to bottom right, #eff6ff, #f8fafc) !important;

    box-shadow: 0 12px 24px rgba(37, 99, 235, 0.12);
}

/* =====================================================
    MENU CARD
===================================================== */

.premium-menu-card {
    overflow: hidden;

    border-radius: 24px !important;

    border: 1px solid rgba(226, 232, 240, 0.9);

    background: rgba(255, 255, 255, 0.96) !important;

    backdrop-filter: blur(18px);

    box-shadow: 0 20px 50px rgba(15, 23, 42, 0.12) !important;
}

/* =====================================================
    TOP SECTION
===================================================== */

.menu-top {
    padding: 18px;

    display: flex;
    align-items: center;
}

/* ICON */
.menu-top-icon {
    width: 42px;
    height: 42px;

    border-radius: 14px;

    margin-right: 14px;

    background: linear-gradient(135deg, #1b867c, #003b73, #0f172a);

    display: flex;
    align-items: center;
    justify-content: center;

    box-shadow: 0 10px 25px rgba(37, 99, 235, 0.25);
}

/* TITLE */
.menu-title {
    font-size: 15px;
    font-weight: 800;

    color: #0f172a;

    letter-spacing: 0.2px;
}

/* SUBTITLE */
.menu-subtitle {
    margin-top: 2px;

    font-size: 12px;

    color: #64748b;
}

/* =====================================================
    DIVIDER
===================================================== */

.menu-divider {
    height: 1px;

    background: linear-gradient(to right, transparent, #e2e8f0, transparent);
}

/* =====================================================
    MENU ITEMS
===================================================== */

.menu-items {
    padding: 12px;
}

/* ITEM */
.premium-menu-item {
    min-height: 72px;

    border-radius: 18px;

    padding: 14px 16px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    cursor: pointer;

    transition: all 0.22s ease;
}

/* LEFT */
.menu-item-left {
    display: flex;
    align-items: center;
}

/* ICON WRAPPER */
.menu-item-icon {
    width: 46px;
    height: 46px;

    border-radius: 16px;

    margin-right: 14px;

    display: flex;
    align-items: center;
    justify-content: center;

    transition: all 0.22s ease;
}

/* VIEW */
.view-bg {
    background: linear-gradient(135deg,
            rgba(14, 165, 233, 0.12),
            rgba(59, 130, 246, 0.1));
}

/* CREATE / ADD */
.create-bg {
    background: linear-gradient(135deg,
            rgba(16, 185, 129, 0.12),
            rgba(5, 150, 105, 0.1));
}

/* EDIT */
.edit-bg {
    background: linear-gradient(135deg,
            rgba(37, 99, 235, 0.12),
            rgba(79, 70, 229, 0.1));
}

/* APPROVE */
.approve-bg {
    background: linear-gradient(135deg,
            rgba(34, 197, 94, 0.12),
            rgba(22, 163, 74, 0.1));
}

/* EXIT / CHECKOUT */
.exit-bg {
    background: linear-gradient(135deg,
            rgba(20, 184, 166, 0.12),
            rgba(13, 148, 136, 0.1));
}

/* WARNING */
.warning-bg {
    background: linear-gradient(135deg,
            rgba(245, 158, 11, 0.12),
            rgba(251, 191, 36, 0.1));
}

/* HOLD */
.hold-bg {
    background: linear-gradient(135deg,
            rgba(249, 115, 22, 0.12),
            rgba(234, 88, 12, 0.1));
}

/* REJECT */
.reject-bg {
    background: linear-gradient(135deg,
            rgba(220, 38, 38, 0.12),
            rgba(239, 68, 68, 0.1));
}

/* DELETE */
.delete-bg {
    background: linear-gradient(135deg,
            rgba(239, 68, 68, 0.12),
            rgba(248, 113, 113, 0.1));
}

/* SECURITY */
.security-bg {
    background: linear-gradient(135deg,
            rgba(15, 23, 42, 0.12),
            rgba(51, 65, 85, 0.1));
}

/* INFORMATION */
.info-bg {
    background: linear-gradient(135deg,
            rgba(6, 182, 212, 0.12),
            rgba(14, 165, 233, 0.1));
}

/* SUCCESS */
.success-bg {
    background: linear-gradient(135deg,
            rgba(34, 197, 94, 0.12),
            rgba(74, 222, 128, 0.1));
}

/* VIEW */
.view-icon {
    color: #3b82f6;
    /* blue */
}

/* CREATE / ADD */
.create-icon {
    color: #10b981;
    /* emerald */
}

/* EDIT */
.edit-icon {
    color: #6366f1;
    /* indigo */
}

/* APPROVE */
.approve-icon {
    color: #22c55e;
    /* green */
}

/* EXIT / CHECKOUT */
.exit-icon {
    color: #14b8a6;
    /* teal */
}

/* WARNING */
.warning-icon {
    color: #f59e0b;
    /* amber */
}

/* HOLD */
.hold-icon {
    color: #f97316;
    /* orange */
}

/* REJECT */
.reject-icon {
    color: #ef4444;
    /* red */
}

/* DELETE */
.delete-icon {
    color: #dc2626;
    /* deep red */
}

/* SECURITY */
.security-icon {
    color: #334155;
    /* slate dark */
}

/* INFORMATION */
.info-icon {
    color: #06b6d4;
    /* cyan */
}

/* SUCCESS */
.success-icon {
    color: #22c55e;
    /* green */
}

/* TITLE */
.menu-item-title {
    font-size: 14px;
    font-weight: 700;

    color: #0f172a;
}

/* SUBTITLE */
.menu-item-subtitle {
    margin-top: 2px;

    font-size: 12px;

    color: #64748b;
}

/* =====================================================
    HOVER EFFECTS
===================================================== */

.premium-menu-item:hover {
    transform: translateX(4px);

    background: linear-gradient(to right,
            rgba(37, 99, 235, 0.05),
            rgba(255, 255, 255, 0.8));
}

/* DELETE HOVER */
.delete-item:hover {
    background: linear-gradient(to right,
            rgba(239, 68, 68, 0.06),
            rgba(255, 255, 255, 0.8));
}

/* ICON SCALE */
.premium-menu-item:hover .menu-item-icon {
    transform: scale(1.08);
}

/* TRIGGER */
.user-trigger {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 10px;
    margin-right: 16px;
    margin-top: 4px;
    border-radius: 12px;
    cursor: pointer;
    transition: 0.2s ease;
}

.user-trigger:hover {
    background: rgba(255, 255, 255, 0.06);
}

/* SMALL AVATAR */
.avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1b867c, #003b73, #0f172a);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
}

/* TEXT */
.meta .name {
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    color: #111827;
}

.meta .email {
    font-size: 11px;
    color: #6b7280;
}

/* ARROW */
.arrow {
    opacity: 0.5;
}

/* MENU */
.menu {
    width: 240px;
    border-radius: 14px;
    padding: 10px;
    background: #ffffff;
    border: 1px solid #eef0f3;
}

/* HEADER */
.header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px;
}

.avatar-lg {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #111827;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
}

.name-lg {
    font-weight: 600;
    font-size: 14px;
    color: #111827;
}

.email-lg {
    font-size: 12px;
    color: #6b7280;
}

/* DIVIDER */
.divider {
    height: 1px;
    background: #f1f1f1;
    margin: 6px 0;
}

/* =========================================
   MENU ITEMS CONTAINER
========================================= */
.items {
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

/* =========================================
   PREMIUM ITEM
========================================= */
.item {
    position: relative;

    display: flex;
    align-items: center;
    gap: 14px;

    min-height: 54px;
    padding: 0 16px;

    border-radius: 14px;

    color: #1e293b;
    font-size: 13px;
    font-weight: 600;

    cursor: pointer;
    overflow: hidden;

    border: 1px solid transparent;

    transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
        background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

/* BACKGROUND LAYER */
.item::before {
    content: "";
    position: absolute;
    inset: 0;

    background: linear-gradient(180deg,
            rgba(255, 255, 255, 0.9),
            rgba(248, 250, 252, 0.9));

    opacity: 0;
    transition: opacity 0.25s ease;
}

/* ICON */
.item .v-icon {
    position: relative;
    z-index: 2;

    font-size: 20px;
    color: #64748b;

    transition: color 0.25s ease, transform 0.25s ease;
}

/* LABEL */
.item span,
.item .v-list-item-title {
    position: relative;
    z-index: 2;

    letter-spacing: 0.2px;
}

/* HOVER */
.item:hover {
    transform: translateY(-2px);

    border-color: rgba(148, 163, 184, 0.18);

    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04),
        0 8px 24px rgba(15, 23, 42, 0.08);
}

.item:hover::before {
    opacity: 1;
}

.item:hover .v-icon {
    color: #0f172a;
    transform: scale(1.08);
}

/* ACTIVE */
.item:active {
    transform: translateY(0);
}

/* PREMIUM GLOW EDGE */
.item::after {
    content: "";
    position: absolute;

    left: 0;
    top: 10px;
    bottom: 10px;

    width: 3px;
    border-radius: 20px;

    background: #2563eb;

    transform: scaleY(0);
    transition: transform 0.25s ease;
}

.item:hover::after {
    transform: scaleY(1);
}

/* LOGOUT */
.item.logout {
    color: #dc2626;
}

.item.logout .v-icon {
    color: #dc2626;
}

.item.logout:hover {
    background: rgba(220, 38, 38, 0.03);

    border-color: rgba(220, 38, 38, 0.12);

    box-shadow: 0 1px 2px rgba(220, 38, 38, 0.04),
        0 8px 24px rgba(220, 38, 38, 0.08);
}

.item.logout::after {
    background: #dc2626;
}

.item-content {
    display: flex;
    flex-direction: column;
}

.item-title {
    font-size: 13px;
    font-weight: 600;
    color: #0f172a;
}

.item-description {
    font-size: 11px;
    color: #64748b;
    margin-top: 2px;
}

/* DANGER */
.danger {
    color: #dc2626;
}

.danger:hover {
    background: #fef2f2;
}

/* NOTIFICATION ICON TRIGGER */
.notif-trigger {
    margin-right: 14px;
    margin-top: 6px;
    cursor: pointer;
    padding: 6px;
    border-radius: 12px;
    transition: all 0.2s ease;
}

.notif-trigger:hover {
    background: rgba(0, 0, 0, 0.05);
}

.notif-icon {
    font-size: 22px !important;
    color: #334155;
}

/* BADGE STYLE OVERRIDE */
.v-badge__badge {
    font-size: 10px !important;
    font-weight: 700;
    min-width: 18px;
    height: 18px;
}

/* NOTIFICATION MENU */
.notif-menu {
    width: 420px;
    border-radius: 16px !important;
    overflow: hidden;
    border: 1px solid #eef2f7;
}

/* HEADER */
.notif-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 14px 16px;

    background: linear-gradient(135deg, #1b867c, #003b73, #0f172a);
    color: white;
}

.notif-title {
    font-size: 14px;
    font-weight: 700;
}

.notif-subtitle {
    font-size: 11px;
    opacity: 0.8;
}

.notif-header-icon {
    color: rgba(255, 255, 255, 0.8);
}

/* LIST */
.notif-list {
    max-height: 320px;
    overflow-y: auto;
}

/* ITEM */
.notif-item {
    display: flex;
    align-items: center;
    gap: 12px;

    padding: 12px 14px;

    cursor: pointer;

    transition: 0.2s ease;
}

.notif-item:hover {
    background: #f8fafc;
}

.notif-item-icon {
    font-size: 18px;
    color: #3b82f6;
}

/* CONTENT */
.notif-text {
    font-size: 13px;
    font-weight: 600;
    color: #0f172a;
}

.notif-meta {
    font-size: 11px;
    color: #64748b;
}

/* EMPTY STATE */
.notif-empty {
    padding: 18px;
    text-align: center;
    font-size: 13px;
    color: #94a3b8;
}

/* =========================
   TRIGGER
========================= */
.user-trigger-premium {
    display: flex;
    align-items: center;
    gap: 10px;

    padding: 8px 12px;

    border-radius: 14px;

    cursor: pointer;

    background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.95),
            rgba(241, 245, 249, 0.85));
    margin-right: 16px;
    border: 1px solid #eef2f7;

    transition: all 0.25s ease;

    backdrop-filter: blur(10px);
}

/* .user-trigger-premium:hover {
    transform: translateY(-1px);
    background: #ffffff;
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
} */

/* AVATAR */
.avatar-premium {
    width: 40px;
    height: 40px;
    border-radius: 50%;

    background: linear-gradient(135deg, #1b867c, #003B73, #0f172a);

    display: flex;
    align-items: center;
    justify-content: center;

    color: #fff;
    font-weight: 700;
    font-size: 14px;
}

/* TEXT */
.meta-premium {
    display: flex;
    flex-direction: column;
}

.name-premium {
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    color: #0f172a;
}

.email-premium {
    font-size: 11px;
    color: #64748b;
}

/* CHEVRON */
.chevron-premium {
    font-size: 22px;
    color: #94a3b8;
}

/* =========================
   MENU
========================= */
.menu-premium {
    width: 280px;

    border-radius: 16px !important;

    background: rgba(255, 255, 255, 0.95);

    border: 1px solid #eef2f7;

    backdrop-filter: blur(16px);

    box-shadow: 0 25px 60px rgba(15, 23, 42, 0.15);
    overflow: hidden;
}

/* HEADER */
.menu-header-premium {
    display: flex;
    align-items: center;
    gap: 12px;

    padding: 16px;

    background: linear-gradient(135deg, #1b867c, #003B73, #0f172a);

    color: white;
}

.avatar-lg-premium {
    width: 44px;
    height: 44px;
    border-radius: 14px;

    background: rgba(255, 255, 255, 0.12);

    display: flex;
    align-items: center;
    justify-content: center;

    font-weight: 700;
}

.name-lg-premium {
    font-size: 14px;
    font-weight: 700;
}

.email-lg-premium {
    font-size: 11px;
    opacity: 0.8;
}

/* DIVIDER */
.menu-divider-premium {
    height: 1px;
    background: linear-gradient(to right, transparent, #e2e8f0, transparent);
}

/* ITEMS */
.menu-items-premium {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

/* ITEM */
.menu-item-premium {
    display: flex;
    align-items: center;
    gap: 12px;

    padding: 12px;

    border-radius: 14px;

    cursor: pointer;

    transition: all 0.2s ease;
}

.menu-item-premium:hover {
    background: #f8fafc;
    transform: translateX(4px);
}

/* TEXT */
.menu-item-premium .title {
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
}

.menu-item-premium .subtitle {
    font-size: 11px;
    color: #64748b;
}

/* ICONS */
.icon-profile {
    color: #3b82f6;
}

.icon-security {
    color: #6366f1;
}

.icon-logout {
    color: #ef4444;
}

/* LOGOUT SPECIAL */
.menu-item-premium.logout:hover {
    background: #fef2f2;
}

/* =========================
   GATE SWITCHER BUTTON
========================= */

.gate-switcher-premium {
    margin-right: 14px;
    cursor: pointer;
}

.gate-pill {
    display: flex;
    align-items: center;
    gap: 10px;
	background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.95),
            rgba(241, 245, 249, 0.85));
border: 1px solid rgba(226, 232, 240, 0.9);
    padding: 8px 14px;
    border-radius: 14px;


    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(14px);

    /* border: 1px solid rgba(0, 0, 0, 0.06); */

    transition: all 0.25s ease;
}

.gate-pill:hover {
    transform: translateY(-1px);
    /* box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08); */
}

.gate-icon {
    width: 32px;
    height: 32px;
    border-radius: 10px;

    display: flex;
    align-items: center;
    justify-content: center;

    background: linear-gradient(135deg, #1b867c, #003B73);
    color: white;
}

.gate-info {
    display: flex;
    flex-direction: column;
    line-height: 1.1;
}

.gate-label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #777;
}

.gate-name {
    font-size: 13px;
    font-weight: 600;
    color: #1f2937;
}

.gate-arrow {
    opacity: 0.6;
}

/* =========================
   MENU PANEL
========================= */

.gate-menu-premium {
    width: 420px;
    border-radius: 16px !important;
	
    overflow: hidden;
    border: 1px solid #eef2f7;
}

/* HEADER */
.gate-header-premium {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 14px 16px;

    background: linear-gradient(135deg, #1b867c, #003b73, #0f172a);
    color: white;

}

.gate-title {
    font-size: 14px;
    font-weight: 700;
}

.gate-subtitle {
    font-size: 11px;
    opacity: 0.8;
}

/* LIST */
.gate-list-premium {
    max-height: 320px;
    overflow-y: auto;
}

/* ITEM */
.gate-item-premium {
    display: flex;
    align-items: center;
    gap: 12px;

    padding: 12px 14px;

    cursor: pointer;

    transition: 0.2s ease;
}

.gate-item-premium:hover {
    background: #f8fafc;
}

.gate-item-premium.active {
    background: linear-gradient(135deg, rgba(27, 134, 124, 0.12), rgba(0, 59, 115, 0.08));
}

/* DOT INDICATOR */
.gate-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;

    background: #cbd5e1;
    transition: all 0.2s ease;
}

.gate-dot.active {
    background: #1b867c;
    box-shadow: 0 0 0 4px rgba(27, 134, 124, 0.15);
}

/* TEXT */
.gate-item-title {
    font-weight: 500;
    font-size: 13px;
}

/* CHECK ICON */
.gate-check {
    color: #1b867c;
}
/* ===============================
   ULTRA PREMIUM MENU
================================*/
.gate-menu-ultra {
    width: 300px;
    border-radius: 20px !important;

    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(22px);

    border: 1px solid rgba(226, 232, 240, 0.8);

    box-shadow:
        0 25px 70px rgba(15, 23, 42, 0.18),
        0 8px 25px rgba(15, 23, 42, 0.08);

    overflow: hidden;
}

/* ===============================
   HEADER
================================*/
.gate-top-ultra {
    padding: 16px 18px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    background: linear-gradient(135deg, #1b867c, #003b73, #0f172a);
    color: white;
}

.gate-title-ultra {
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 0.3px;
}

.gate-subtitle-ultra {
    font-size: 11px;
    opacity: 0.8;
    margin-top: 2px;
}

/* STATUS CHIP */
.gate-chip-status {
    display: flex;
    align-items: center;
    gap: 6px;

    padding: 6px 10px;
    border-radius: 999px;

    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);

    font-size: 11px;
    font-weight: 700;
}

/* ===============================
   ACTIVE CARD
================================*/
.gate-active-card {
    margin: 14px;
    padding: 14px;

    border-radius: 16px;

    display: flex;
    align-items: center;
    gap: 12px;

    background: linear-gradient(135deg, rgba(27,134,124,0.10), rgba(0,59,115,0.06));

    border: 1px solid rgba(27,134,124,0.2);
}

.active-icon {
    width: 42px;
    height: 42px;

    border-radius: 14px;

    display: flex;
    align-items: center;
    justify-content: center;

    background: linear-gradient(135deg, #1b867c, #003b73);
    color: white;
}

.active-label {
    font-size: 11px;
    color: #64748b;
    font-weight: 600;
}

.active-value {
    font-size: 14px;
    font-weight: 800;
    color: #0f172a;
}

/* ===============================
   DIVIDER
================================*/
.gate-divider {
    height: 1px;
    background: linear-gradient(to right, transparent, #e2e8f0, transparent);
}

/* ===============================
   LIST HEADER
================================*/
.gate-list-header {
    padding: 10px 16px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    color: #64748b;
    letter-spacing: 0.8px;
}

/* ===============================
   LIST
================================*/
.gate-list-ultra {
    padding: 6px 10px 14px;
}

/* ITEM */
.gate-item-ultra {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 12px 12px;
    margin: 6px 6px;

    border-radius: 14px;

    cursor: pointer;

    transition: all 0.25s ease;

    border: 1px solid transparent;
}

/* HOVER */
.gate-item-ultra:hover {
    background: #f8fafc;
    transform: translateX(5px);
    border-color: #e2e8f0;
}

/* ACTIVE */
.gate-item-ultra.active {
    background: linear-gradient(135deg, rgba(27,134,124,0.12), rgba(0,59,115,0.08));
    border-color: rgba(27,134,124,0.25);
}

/* LEFT SIDE */
.gate-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

/* DOT */
.gate-dot-ultra {
    width: 10px;
    height: 10px;
    border-radius: 50%;

    background: #cbd5e1;

    transition: all 0.25s ease;
}

.gate-dot-ultra.active {
    background: #1b867c;
    box-shadow: 0 0 0 5px rgba(27,134,124,0.15);
}

/* TEXT */
.gate-name-ultra {
    font-size: 13px;
    font-weight: 800;
    color: #0f172a;
}

.gate-code-ultra {
    font-size: 11px;
    color: #64748b;
}

/* RIGHT */
.gate-right {
    display: flex;
    align-items: center;
}
@media (max-width:960px){

.dialog-header{
    padding:22px;
}

.dialog-body{
    padding:20px;
}

.dialog-footer{
    padding:18px;
}

}

@media (max-width:600px){

.premium-dialog{
    width:100vw;
    height:100vh;
    max-width:100vw;
    max-height:100vh;
    border-radius:0;
}

.dialog-header{
    padding:18px;
}

.dialog-body{
    padding:16px;
}

.dialog-footer{
    padding:16px;
}

.dialog-title{
    font-size:22px;
}

.dialog-subtitle{
    font-size:13px;
}

}
/* MAIN CONTAINER */
.toggle-visible {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 12px 14px;

    border-radius: 12px;

    background: linear-gradient(180deg, #ffffff, #f1f5f9);

    border: 1px solid #e2e8f0;

    transition: all 0.2s ease;
}

.toggle-visible:hover {
    border-color: #94a3b8;
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
}

/* TEXT */
.toggle-visible .title {
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
}

.toggle-visible .desc {
    font-size: 11px;
    color: #64748b;
    margin-top: 2px;
}

/* SWITCH */
.switch-strong {
    position: relative;
    width: 44px;
    height: 24px;
    display: inline-block;
}

.switch-strong input {
    opacity: 0;
    width: 0;
    height: 0;
}

/* TRACK */
.slider {
    position: absolute;
    inset: 0;
    cursor: pointer;

    background: #cbd5e1;
    border-radius: 999px;

    transition: 0.3s;
}

/* KNOB */
.slider::before {
    content: "";
    position: absolute;

    height: 18px;
    width: 18px;

    left: 3px;
    top: 3px;

    background: white;
    border-radius: 50%;

    transition: 0.3s;

    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

/* ACTIVE STATE (IMPORTANT COLOR) */
.switch-strong input:checked+.slider {
    background: linear-gradient(135deg, #1b867c, #003B73);
}

.switch-strong input:checked+.slider::before {
    transform: translateX(20px);
}

</style>
