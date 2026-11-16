<template>
  <v-container fluid class="dashboard">
    <!-- Background Decorations -->
    <div class="bg-wrapper">
      <div class="bg-circle circle-1"></div>
      <div class="bg-circle circle-2"></div>
      <div class="bg-circle circle-3"></div>
      <div class="grid-overlay"></div>
    </div>

    <!-- DASHBOARD TABS (same design, now tabs) -->
    <section class="dashboard-shortcuts mb-6">
      <div class="shortcuts-grid">
        <div
          v-for="dash in availableDashboards"
          :key="dash.key"
          class="dash-card"
          :class="{ 'dash-card-active': activeTab === dash.key }"
          @click="activeTab = dash.key"
        >
          <div class="dash-icon" :style="{ background: dash.bg }">
            <v-icon size="26" :color="dash.color">{{ dash.icon }}</v-icon>
          </div>
          <div class="dash-info">
            <div class="dash-title">{{ dash.title }}</div>
            <div class="dash-sub">{{ dash.subtitle }}</div>
          </div>
          <v-icon size="20" class="dash-arrow">mdi-arrow-right</v-icon>
        </div>
      </div>
    </section>

    <!-- TAB CONTENT -->
    <div v-show="activeTab === 'main'">
      <!-- KPI SECTION -->
      <section class="premium-kpi-section">
        <div
          v-for="kpi in kpis"
          :key="kpi.label"
          class="premium-kpi-card"
        >
          <div class="premium-left">
            <div
              class="premium-icon-wrap"
              :style="{ background: kpi.bg }"
            >
              <v-icon size="22" :color="kpi.color">{{ kpi.icon }}</v-icon>
            </div>
            <div>
              <div class="premium-label">{{ kpi.label }}</div>
              <div class="premium-sub">This period</div>
            </div>
          </div>
          <div class="premium-value" :style="{ color: kpi.color }">
            {{ kpi.value }}
          </div>
          <div
            class="premium-glow"
            :style="{ background: kpi.color }"
          ></div>
        </div>
      </section>

      <!-- MAIN GRID -->
      <v-row dense class="main-grid">
        <!-- LEFT COLUMN -->
        <v-col cols="12" lg="8">
          <div class="premium-card analytics-card mb-6">
            <div class="card-head">
              <div>
                <div class="card-mini-title">Analytics</div>
                <h2>Visitor Access Analytics</h2>
              </div>
            </div>
            <div class="chart-wrapper">
              <gate-chart />
            </div>
          </div>

          <div class="premium-card mb-6">
            <div class="card-head">
              <div>
                <div class="card-mini-title">Access Requests</div>
                <h2>Recent Gate Passes</h2>
              </div>
              <v-btn variant="text" color="primary" size="small">
                View All
              </v-btn>
            </div>
            <div
              v-for="pass in gatePasses"
              :key="pass.id"
              class="list-item"
            >
              <div class="list-left">
                <div class="list-avatar">
                  {{ pass.company.charAt(0) }}
                </div>
                <div>
                  <div class="list-title">{{ pass.company }}</div>
                  <div class="list-subtitle">{{ pass.date }}</div>
                </div>
              </div>
              <v-chip
                size="small"
                :color="getStatusColor(pass.status)"
                variant="flat"
                class="status-chip"
              >
                {{ pass.status }}
              </v-chip>
            </div>
          </div>

          <div class="premium-card">
            <div class="card-head">
              <div>
                <div class="card-mini-title">Monitoring</div>
                <h2>Live Visitor Activity</h2>
              </div>
              <div class="live-pill">
                <span></span>
                LIVE
              </div>
            </div>
            <div
              v-for="visitor in visitors"
              :key="visitor.id"
              class="list-item"
            >
              <div class="list-left">
                <div class="visitor-avatar">
                  {{ visitor.name.charAt(0) }}
                </div>
                <div>
                  <div class="list-title">{{ visitor.name }}</div>
                  <div class="list-subtitle">{{ visitor.company }}</div>
                </div>
              </div>
              <v-chip
                size="small"
                :color="visitor.status === 'inside' ? 'success' : 'grey'"
                variant="flat"
                class="status-chip"
              >
                {{ visitor.status === 'inside' ? 'Inside' : 'Checked Out' }}
              </v-chip>
            </div>
          </div>
        </v-col>

        <!-- RIGHT COLUMN -->
        <v-col cols="12" lg="4">
          <div class="premium-card mb-6">
            <div class="card-head no-margin">
              <div>
                <div class="card-mini-title">Operations</div>
                <h2>Quick Actions</h2>
              </div>
            </div>
            <div
              v-for="action in actions"
              :key="action.title"
              class="quick-action"
              @click="goTo(action.route)"
            >
              <div class="quick-left">
                <div class="quick-icon">
                  <v-icon size="20">{{ action.icon }}</v-icon>
                </div>
                <div>
                  <div class="quick-title">{{ action.title }}</div>
                  <div class="quick-subtitle">Access management</div>
                </div>
              </div>
              <v-icon size="18">mdi-arrow-top-right</v-icon>
            </div>
          </div>

          <div class="premium-card mb-6">
            <div class="card-head no-margin">
              <div>
                <div class="card-mini-title">Infrastructure</div>
                <h2>Gate Status</h2>
              </div>
            </div>
            <div class="status-card success">
              <div class="status-left">
                <div class="status-icon">
                  <v-icon size="18">mdi-gate-open</v-icon>
                </div>
                <div>
                  <div class="status-title">Gate 1 Operational</div>
                  <div class="status-sub">Main Entrance</div>
                </div>
              </div>
              <div class="pulse green"></div>
            </div>
            <div class="status-card success">
              <div class="status-left">
                <div class="status-icon">
                  <v-icon size="18">mdi-gate-open</v-icon>
                </div>
                <div>
                  <div class="status-title">Gate 2 Operational</div>
                  <div class="status-sub">Secondary Entrance</div>
                </div>
              </div>
              <div class="pulse green"></div>
            </div>
            <div class="status-card warning">
              <div class="status-left">
                <div class="status-icon">
                  <v-icon size="18">mdi-account-clock-outline</v-icon>
                </div>
                <div>
                  <div class="status-title">32 Visitors Inside</div>
                  <div class="status-sub">Currently monitored</div>
                </div>
              </div>
              <div class="pulse orange"></div>
            </div>
          </div>

          <div class="security-card">
            <div class="security-bg"></div>
            <div class="security-top">
              <div>
                <div class="security-label">Security Health</div>
                <div class="security-score">98%</div>
              </div>
              <div class="security-icon-box">
                <v-icon size="36">mdi-shield-star-outline</v-icon>
              </div>
            </div>
            <div class="progress-track">
              <div class="progress-fill"></div>
            </div>
            <p>
              All security systems are operational with no active incidents detected.
            </p>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- SECURITY TAB CONTENT -->
    <div v-show="activeTab === 'security'">
   <security-dashboard />
    </div>

    <!-- STAFF TAB CONTENT -->
    <div v-show="activeTab === 'staff'">
    <staff-dashboard />
    </div>

    <!-- Add more tab contents the same way for finance, members, etc. -->
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import gateChart from "../Report/gateChart.vue";
import swtalert from "@/mixins/swtalert";
import dashboardReport from "@/mixins/dashboardReport.js";
import SecurityDashboard from "./SecurityDashboard.vue";
import StaffDashboard from './StaffDashboard.vue';


export default {
  name: "GatePassDashboard",

  components: {
    gateChart,SecurityDashboard,
    StaffDashboard
  },

  mixins: [swtalert, dashboardReport],

  data() {
    return {
      activeTab: "main", // controlled tab

      gatePasses: [
        {
          id: 1,
          company: "ABC Limited",
          status: "Active",
          date: "Today • 08:45 AM",
        },
        {
          id: 2,
          company: "XYZ Company",
          status: "Pending",
          date: "Today • 10:20 AM",
        },
        {
          id: 3,
          company: "Global Technologies",
          status: "Approved",
          date: "Yesterday • 04:15 PM",
        },
      ],

      visitors: [
        {
          id: 1,
          name: "John Doe",
          company: "ABC Limited",
          status: "inside",
        },
        {
          id: 2,
          name: "Jane Smith",
          company: "XYZ Company",
          status: "checked_out",
        },
      ],

      actions: [
        {
          title: "Create Gate Pass",
          icon: "mdi-plus-circle-outline",
          route: "/gate-pass/create",
        },
        {
          title: "Upload Visitors",
          icon: "mdi-file-excel-box-outline",
          route: "/gate-pass/upload",
        },
        {
          title: "Approve Requests",
          icon: "mdi-check-circle-outline",
          route: "/gate-pass/approve",
        },
        {
          title: "Verify Visitors",
          icon: "mdi-account-check-outline",
          route: "/gate/verify",
        },
      ],
    };
  },

  computed: {
    ...mapGetters({
      user: "auth/user",
    }),

    availableDashboards() {
      const list = [];

      if (this.$hasPermission("DASHBOARD_ACCESS")) {
        list.push({
          key: "main",
          title: "Main Dashboard",
          subtitle: "Overview & analytics",
          icon: "mdi-view-dashboard",
          color: "#3b82f6",
          bg: "rgba(59,130,246,0.12)",
        });
      }

      if (this.$hasPermission("SECURITY_DASHBOARD")) {
        list.push({
          key: "security",
          title: "Security Dashboard",
          subtitle: "Live monitoring & gates",
          icon: "mdi-shield-account",
          color: "#10b981",
          bg: "rgba(16,185,129,0.12)",
        });
      }

      if (this.$hasPermission("STAFF_DASHBOARD")) {
        list.push({
          key: "staff",
          title: "Staff Dashboard",
          subtitle: "Personal & team view",
          icon: "mdi-account-group",
          color: "#8b5cf6",
          bg: "rgba(139,92,246,0.12)",
        });
      }

      if (this.$hasRole("admin") || this.$hasPermission("FINANCE_DASHBOARD")) {
        list.push({
          key: "finance",
          title: "Finance Dashboard",
          subtitle: "Payments & reports",
          icon: "mdi-finance",
          color: "#f59e0b",
          bg: "rgba(245,158,11,0.12)",
        });
      }

      if (this.$hasRole("admin") || this.$hasPermission("MEMBERS_DASHBOARD")) {
        list.push({
          key: "members",
          title: "Members Dashboard",
          subtitle: "Member activity",
          icon: "mdi-account-multiple",
          color: "#ef4444",
          bg: "rgba(239,68,68,0.12)",
        });
      }

      return list;
    },
  },

  watch: {
    availableDashboards: {
      immediate: true,
      handler(list) {
        if (list.length && !list.find(d => d.key === this.activeTab)) {
          this.activeTab = list[0].key;
        }
      },
    },
  },

  methods: {
    goTo(route) {
      this.$router.push(route);
    },

    getStatusColor(status) {
      if (status === "Active") return "success";
      if (status === "Pending") return "warning";
      if (status === "Approved") return "primary";
      return "grey";
    },
  },
};
</script>

<style scoped>
/* Add this for the active tab state */
.dash-card-active {
  border: 2px solid var(--brand) !important;
  background: var(--surface-alt) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}
</style>