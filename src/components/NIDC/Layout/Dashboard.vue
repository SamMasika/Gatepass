<template>
  <v-container fluid class="dashboard">

    <!-- ==================== HERO ==================== -->
    <section class="hero-section">
      <div class="hero-left">
        <h1>Gate Pass Dashboard</h1>
        <p>
          Smart visitor access management with real-time monitoring,
          approvals, analytics and security tracking.
        </p>
      </div>
    </section>

    <!-- ==================== KPI SECTION ==================== -->
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
            <v-icon size="20" :color="kpi.color">
              {{ kpi.icon }}
            </v-icon>
          </div>

          <div>
            <div class="premium-label">{{ kpi.label }}</div>
          </div>
        </div>

        <div class="premium-value">
          {{ kpi.value }}
        </div>

        <div
          class="premium-glow"
          :style="{ background: kpi.color }"
        ></div>
      </div>
    </section>

    <!-- ==================== MAIN GRID ==================== -->
    <v-row dense class="main-grid">

      <!-- ==================== LEFT COLUMN ==================== -->
      <v-col cols="12" lg="8">

        <!-- Analytics -->
        <div class="premium-card analytics-card mb-5">
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

        <!-- Recent Gate Passes -->
        <div class="premium-card mb-5">
          <div class="card-head">
            <div>
              <div class="card-mini-title">Access Requests</div>
              <h2>Recent Gate Passes</h2>
            </div>
            <v-btn variant="text" color="primary">
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
              class="status-chip"
            >
              {{ pass.status }}
            </v-chip>
          </div>
        </div>

        <!-- Live Visitors -->
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
              :color="visitor.status === 'inside' ? 'success' : 'grey-darken-1'"
              class="status-chip"
            >
              {{ visitor.status === 'inside' ? 'Inside' : 'Checked Out' }}
            </v-chip>
          </div>
        </div>

      </v-col>

      <!-- ==================== RIGHT COLUMN ==================== -->
      <v-col cols="12" lg="4">

        <!-- Quick Actions -->
        <div class="premium-card mb-5">
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
                <v-icon size="18">{{ action.icon }}</v-icon>
              </div>
              <div>
                <div class="quick-title">{{ action.title }}</div>
                <div class="quick-subtitle">Access management</div>
              </div>
            </div>
            <v-icon size="18">mdi-arrow-top-right</v-icon>
          </div>
        </div>

        <!-- Gate Status -->
        <div class="premium-card mb-5">
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

        <!-- Security Score -->
        <div class="security-card">
          <div class="security-bg"></div>

          <div class="security-top">
            <div>
              <div class="security-label">Security Health</div>
              <div class="security-score">98%</div>
            </div>
            <div class="security-icon-box">
              <v-icon size="34">mdi-shield-star-outline</v-icon>
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

  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import gateChart from "../Report/gateChart.vue";
import swtalert from "@/mixins/swtalert";
import dashboardReport from "@/mixins/dashboardReport.js";
import "./Dashboard.css";

export default {
  name: "GatePassDashboard",

  components: {
    gateChart
  },

  mixins: [swtalert, dashboardReport],

  data() {
    return {
      gatePasses: [
        {
          id: 1,
          company: "ABC Limited",
          status: "Active",
          date: "Today • 08:45 AM"
        },
        {
          id: 2,
          company: "XYZ Company",
          status: "Pending",
          date: "Today • 10:20 AM"
        },
        {
          id: 3,
          company: "Global Technologies",
          status: "Approved",
          date: "Yesterday • 04:15 PM"
        }
      ],

      visitors: [
        {
          id: 1,
          name: "John Doe",
          company: "ABC Limited",
          status: "inside"
        },
        {
          id: 2,
          name: "Jane Smith",
          company: "XYZ Company",
          status: "checked_out"
        }
      ],

      actions: [
        {
          title: "Create Gate Pass",
          icon: "mdi-plus-circle-outline",
          route: "/gate-pass/create"
        },
        {
          title: "Upload Visitors",
          icon: "mdi-file-excel-box-outline",
          route: "/gate-pass/upload"
        },
        {
          title: "Approve Requests",
          icon: "mdi-check-circle-outline",
          route: "/gate-pass/approve"
        },
        {
          title: "Verify Visitors",
          icon: "mdi-account-check-outline",
          route: "/gate/verify"
        }
      ]
    };
  },

  computed: {
    ...mapGetters({
      user: "auth/user"
    })
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
    }
  }
};
</script>