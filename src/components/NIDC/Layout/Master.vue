<template>
  <!-- Fixed Sidebar -->
  <v-navigation-drawer
    v-model="drawer"
    app
    :width="drawer ? 300 : 68"
    class="sidebar-drawer"
    v-if="user?.is_password_changed === 1"
  >
    <Sidebar />
  </v-navigation-drawer>

  <!-- App Bar -->
  <v-app-bar scroll-behavior="elevate" class="light-appbar" height="72">
    <v-app-bar-nav-icon @click="drawer = !drawer" class="menu-btn" />
    <v-spacer />

    <!-- Theme Toggle -->
    <v-btn icon variant="text" class="theme-toggle" @click="toggleTheme">
      <v-icon>{{ darkTheme ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
    </v-btn>

    <!-- Notifications -->
    <v-menu offset="10" location="bottom end" transition="fade-transition">
      <template #activator="{ props }">
        <div class="notif-trigger" v-bind="props">
          <v-badge
            :content="notifications.length"
            :model-value="notifications.length > 0"
            color="red-darken-1"
            overlap
          >
            <v-icon class="notif-icon">mdi-bell-outline</v-icon>
          </v-badge>
        </div>
      </template>

      <v-card class="notif-menu" elevation="0">
        <div class="notif-header">
          <div>
            <div class="notif-title">Notifications</div>
            <div class="notif-subtitle">{{ notifications.length }} new updates</div>
          </div>
          <v-icon size="18" class="notif-header-icon">mdi-bell-ring-outline</v-icon>
        </div>

        <div class="notif-list">
          <div
            v-for="(item, i) in notifications"
            :key="i"
            class="notif-item"
          >
            <v-icon class="notif-item-icon">
              {{ item.icon || 'mdi-information-outline' }}
            </v-icon>
            <div class="notif-content">
              <div class="notif-text">{{ item.title }}</div>
              <div class="notif-meta">{{ item.time }}</div>
            </div>
          </div>

          <div v-if="notifications.length === 0" class="notif-empty">
            No new notifications
          </div>
        </div>
      </v-card>
    </v-menu>

    <!-- Gate Switcher -->
    <div v-if="$hasRole('Security Officer')">
      <v-menu offset="12" location="bottom end" transition="scale-transition">
        <template #activator="{ props }">
          <div
            class="gate-switcher-premium"
            v-bind="props"
            :class="{ disabled: !canSwitchGate() }"
          >
            <div class="gate-pill">
              <div class="gate-icon">
                <v-icon size="18">mdi-door-closed-lock</v-icon>
              </div>
              <div class="gate-info">
                <div class="gate-label">Active Gate</div>
                <div class="gate-name">{{ formattedActiveGate }}</div>
              </div>
              <v-icon class="gate-arrow">mdi-menu-down</v-icon>
            </div>
          </div>
        </template>

        <v-card class="gate-menu-ultra" elevation="0">
          <div class="gate-top-ultra">
            <div>
              <div class="gate-title-ultra">Gate Control Center</div>
              <div class="gate-subtitle-ultra">Manage your active checkpoint</div>
            </div>
            <div class="gate-chip-status">
              <v-icon size="14">mdi-shield-check</v-icon>
              Active
            </div>
          </div>

          <div class="gate-active-card">
            <div class="active-icon">
              <v-icon size="20">mdi-door-closed-lock</v-icon>
            </div>
            <div class="active-info">
              <div class="active-label">Currently Working At</div>
              <div class="active-value">{{ formattedActiveGate }}</div>
            </div>
          </div>

          <div class="gate-divider" />

          <div class="gate-list-header">Available Gates</div>

          <div class="gate-list-ultra">
            <div
              v-for="(gate, i) in gates"
              :key="i"
              class="gate-item-ultra"
              :class="{ active: activeGate === gate.value }"
              @click="canSwitchGate() && requestGateSwitch(gate)"
            >
              <div class="gate-left">
                <div
                  class="gate-dot-ultra"
                  :class="{ active: activeGate === gate.value }"
                />
                <div class="gate-text">
                  <div class="gate-name-ultra">{{ gate.name }}</div>
                  <div class="gate-code-ultra">{{ gate.value }}</div>
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

    <!-- User Menu -->
    <v-menu offset="12" location="bottom end" transition="scale-transition">
      <template #activator="{ props }">
        <div class="user-trigger-premium" v-bind="props">
          <div class="avatar-premium">
            {{ user?.first_name?.charAt(0) || 'G' }}
          </div>
          <div class="meta-premium">
            <div class="name-premium">
              {{ [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Guest' }}
            </div>
            <div class="email-premium">
              {{ user?.email || 'No email' }}
            </div>
          </div>
          <v-icon class="chevron-premium">mdi-menu-down</v-icon>
        </div>
      </template>

      <v-card class="menu-premium" elevation="0">
        <div class="menu-header-premium">
          <div class="avatar-lg-premium">
            {{ user?.first_name?.charAt(0) || 'G' }}
          </div>
          <div>
            <div class="name-lg-premium">
              {{ [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Guest' }}
            </div>
            <div class="email-lg-premium">
              {{ user?.email || 'No email' }}
            </div>
          </div>
        </div>

        <div class="menu-divider-premium" />

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

          <div class="menu-divider-premium" />

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
          <span class="font-weight-bold">NIDC Gate Pass System</span>
        </v-col>
        <v-col cols="auto">
          <span>© {{ new Date().getFullYear() }}. All rights reserved.</span>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>

  <!-- Gate Switch Confirmation Dialog -->
  <v-dialog v-model="gateConfirmDialog" max-width="460" persistent>
    <v-card class="gate-confirm-dialog" elevation="0">
      <div class="confirm-header">
        <div class="confirm-icon-wrap">
          <v-icon size="32" color="white">mdi-swap-horizontal-bold</v-icon>
        </div>
        <div>
          <div class="confirm-title">Switch Active Gate?</div>
          <div class="confirm-subtitle">This action will change your current checkpoint</div>
        </div>
      </div>

      <div class="confirm-body">
        <p class="confirm-message">
          Are you sure you want to switch from
          <strong>{{ formattedActiveGate }}</strong> to
          <strong>{{ pendingGate?.name }}</strong>?
        </p>
        <p class="confirm-note">
          You will need to wait at least 4 hours before switching again.
        </p>
      </div>

      <div class="confirm-actions">
        <v-btn
          variant="outlined"
          class="cancel-btn"
          @click="gateConfirmDialog = false"
        >
          Cancel
        </v-btn>
        <v-btn
          class="confirm-btn"
          :loading="switchingGate"
          @click="confirmGateSwitch"
        >
          Yes, Switch Gate
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
import Sidebar from "./Sidebar.vue";
import { mapGetters, mapActions } from "vuex";
import swtalert from "@/mixins/swtalert.js";

export default {
  name: "App",
  mixins: [swtalert],
  components: { Sidebar },

  data: () => ({
    drawer: true,
    darkTheme: false,
    gates: [],
    activeGate: null,
    gateConfirmDialog: false,
    pendingGate: null,
    switchingGate: false,
    notifications: [
      {
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
    },
  },

  methods: {
    ...mapActions({
      logoutAction: "auth/logout",
    }),

    logout() {
      this.logoutAction()
        .then(() => this.$router.replace({ name: "login" }))
        .catch((error) => console.error("Logout error:", error));
    },

    toggleTheme() {
      this.darkTheme = !this.darkTheme;
      this.applyTheme();
      localStorage.setItem("theme", this.darkTheme ? "dark" : "light");
    },

    applyTheme() {
      const theme = this.darkTheme ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", theme);
    },

    initTheme() {
      const saved = localStorage.getItem("theme");
      if (saved) {
        this.darkTheme = saved === "dark";
      } else {
        this.setThemeBasedOnTime();
      }
      this.applyTheme();
    },

    setThemeBasedOnTime() {
      const hour = new Date().getHours();
      this.darkTheme = hour >= 18 || hour < 6;
    },

    canSwitchGate() {
      if (!this.user?.gate_changed_at) return true;
      const changedAt = new Date(this.user.gate_changed_at);
      const now = new Date();
      const hours = (now - changedAt) / (1000 * 60 * 60);
      return hours >= 4;
    },

    goToProfile() {
      this.$router.push({ name: "profile" });
    },

    loadGates() {
      this.gates = [
        { name: "Gate 1", value: "GATE_1" },
        { name: "Gate 2", value: "GATE_2" },
      ];
    },

    loadActiveGate() {
      this.activeGate = this.user?.current_gate || null;
    },

    requestGateSwitch(gate) {
      if (gate.value === this.activeGate) return;
      this.pendingGate = gate;
      this.gateConfirmDialog = true;
    },

    async confirmGateSwitch() {
      if (!this.pendingGate) return;

      this.switchingGate = true;

      try {
        const response = await axios.post("gate-passes/set-current-gate", {
          gate: this.pendingGate.value,
        });

        const message = response?.data?.message || "Gate updated successfully";

        this.$store.commit("auth/SET_USER", {
          ...this.user,
          current_gate: this.pendingGate.value,
          gate_changed_at: new Date().toISOString(),
        });

        this.showAlert(message, "success");
        this.gateConfirmDialog = false;

        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } catch (error) {
        const msg = error?.response?.data?.message || "Failed to update gate";
        this.showAlert(msg, "error");
      } finally {
        this.switchingGate = false;
      }
    },
  },

  created() {
    this.initTheme();
  },

  mounted() {
    this.loadGates();
    this.loadActiveGate();
  },
};
</script>