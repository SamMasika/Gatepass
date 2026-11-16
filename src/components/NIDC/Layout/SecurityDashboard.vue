<template>
 
    <!-- KPI SECTION -->
    <section class="premium-kpi-section">
      <div
        v-for="kpi in securityKpis"
        :key="kpi.label"
        class="premium-kpi-card"
      >
        <div class="premium-left">
          <div class="premium-icon-wrap" :style="{ background: kpi.bg }">
            <v-icon size="22" :color="kpi.color">{{ kpi.icon }}</v-icon>
          </div>
          <div>
            <div class="premium-label">{{ kpi.label }}</div>
            <div class="premium-sub">Live</div>
          </div>
        </div>
        <div class="premium-value" :style="{ color: kpi.color }">
          {{ kpi.value }}
        </div>
        <div class="premium-glow" :style="{ background: kpi.color }"></div>
      </div>
    </section>

    <!-- MAIN CONTENT -->
    <v-row dense>
      <!-- LEFT: Live Visitors -->
      <v-col cols="12" lg="8">
        <div class="premium-card">
          <div class="card-head">
            <div>
              <div class="card-mini-title">Live Monitoring</div>
              <h2>Visitors Currently Inside</h2>
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
                <div class="list-subtitle">
                  {{ visitor.company }} • {{ visitor.pass_no }}
                </div>
              </div>
            </div>
            <div class="visitor-meta">
              <div class="meta-item">
                <v-icon size="16">mdi-clock-outline</v-icon>
                {{ visitor.time_in }}
              </div>
              <div class="meta-item">
                <v-icon size="16">mdi-timer-outline</v-icon>
                {{ visitor.duration }}
              </div>
            </div>
          </div>

          <div v-if="!visitors.length" class="empty-state">
            No visitors currently inside
          </div>
        </div>
      </v-col>

      <!-- RIGHT: Quick Actions + Gate Status -->
      <v-col cols="12" lg="4">
        <!-- Quick Actions -->
        <div class="premium-card mb-6">
          <div class="card-head no-margin">
            <div>
              <div class="card-mini-title">Operations</div>
              <h2>Quick Actions</h2>
            </div>
          </div>

          <div
            v-for="action in securityActions"
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
                <div class="quick-subtitle">{{ action.subtitle }}</div>
              </div>
            </div>
            <v-icon size="18">mdi-arrow-top-right</v-icon>
          </div>
        </div>

        <!-- Gate Status -->
        <div class="premium-card">
          <div class="card-head no-margin">
            <div>
              <div class="card-mini-title">Infrastructure</div>
              <h2>Gate Status</h2>
            </div>
          </div>

          <div
            v-for="gate in gateStatus"
            :key="gate.gate"
            class="status-card success"
          >
            <div class="status-left">
              <div class="status-icon">
                <v-icon size="18">mdi-gate-open</v-icon>
              </div>
              <div>
                <div class="status-title">{{ gate.gate }}</div>
                <div class="status-sub">{{ gate.status }}</div>
              </div>
            </div>
            <div class="pulse green"></div>
          </div>

          <div class="status-card warning mt-2">
            <div class="status-left">
              <div class="status-icon">
                <v-icon size="18">mdi-account-clock-outline</v-icon>
              </div>
              <div>
                <div class="status-title">{{ stats.inside }} Visitors Inside</div>
                <div class="status-sub">Currently on premises</div>
              </div>
            </div>
            <div class="pulse orange"></div>
          </div>
        </div>
      </v-col>
    </v-row>
 
</template>

<script>
import { mapGetters } from "vuex";
import swtalert from "@/mixins/swtalert";
import dashboardReport from "@/mixins/dashboardReport";

export default {
  name: "SecurityDashboard",

  mixins: [swtalert, dashboardReport],

  data() {
    return {
      stats: {
        totalGatePasses: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        inside: 32,
        outside: 0,
        entry: 0,
        exit: 0,
        waitingApproval: 0,
        completed: 0,
      },

      visitors: [
        {
          id: 1,
          name: "John Doe",
          company: "ABC Limited",
          pass_no: "GP-00124",
          time_in: "08:15 AM",
          duration: "2h 10m",
        },
        {
          id: 2,
          name: "Jane Smith",
          company: "XYZ Company",
          pass_no: "GP-00125",
          time_in: "09:02 AM",
          duration: "1h 23m",
        },
      ],

      gateStatus: [
        { gate: "Gate 1", status: "ONLINE" },
        { gate: "Gate 2", status: "ONLINE" },
      ],

      securityActions: [
        {
          title: "Verify Visitor",
          icon: "mdi-account-check-outline",
          route: "/gate/verify",
          subtitle: "Check-in / Check-out",
        },
        {
          title: "Today's Active Passes",
          icon: "mdi-file-document-outline",
          route: "/active-passes",
          subtitle: "Current valid access",
        },
        {
          title: "Check-In",
          icon: "mdi-login",
          route: "/gate/check-in",
          subtitle: "Record entry",
        },
        {
          title: "Check-Out",
          icon: "mdi-logout",
          route: "/gate/check-out",
          subtitle: "Record exit",
        },
      ],
    };
  },

  computed: {
    ...mapGetters({
      user: "auth/user",
    }),

    securityKpis() {
      return [
        {
          label: "Visitors Inside",
          value: this.stats.inside,
          icon: "mdi-account-group",
          color: "#10b981",
          bg: "rgba(16,185,129,0.12)",
        },
        {
          label: "Checked Out Today",
          value: this.stats.exit || 48,
          icon: "mdi-logout",
          color: "#3b82f6",
          bg: "rgba(59,130,246,0.12)",
        },
        {
          label: "Active Passes",
          value: this.stats.approved || 86,
          icon: "mdi-card-account-details",
          color: "#8b5cf6",
          bg: "rgba(139,92,246,0.12)",
        },
        {
          label: "Pending Verification",
          value: this.stats.waitingApproval || 4,
          icon: "mdi-clock-alert-outline",
          color: "#f59e0b",
          bg: "rgba(245,158,11,0.12)",
        },
      ];
    },
  },

  methods: {
    goTo(route) {
      this.$router.push(route);
    },
  },
};
</script>

