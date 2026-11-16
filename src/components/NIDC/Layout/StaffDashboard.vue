<template>

    <!-- FILTER -->
    <div class="filter-wrapper">
      <div class="premium-filter">
        <div
          v-for="filter in filters"
          :key="filter.value"
          class="premium-filter-item"
          :class="{ active: selectedFilter === filter.value }"
          @click="applyFilter(filter.value)"
        >
          {{ filter.label }}
          <span class="active-indicator"></span>
        </div>
      </div>
    </div>

    <!-- KPI SECTION -->
    <section class="premium-kpi-section">
      <div
        v-for="kpi in staffKpis"
        :key="kpi.label"
        class="premium-kpi-card"
      >
        <div class="premium-left">
          <div class="premium-icon-wrap" :style="{ background: kpi.bg }">
            <v-icon size="22" :color="kpi.color">{{ kpi.icon }}</v-icon>
          </div>
          <div>
            <div class="premium-label">{{ kpi.label }}</div>
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
      <!-- LEFT: My Recent Requests -->
      <v-col cols="12" lg="8">
        <div class="premium-card">
          <div class="card-head">
            <div>
              <div class="card-mini-title">My Requests</div>
              <h2>Recent Gate Passes</h2>
            </div>
            <v-btn variant="text" color="primary" size="small" @click="goTo('/gate-pass')">
              View All
            </v-btn>
          </div>

          <div
            v-for="pass in myPasses"
            :key="pass.id"
            class="list-item"
          >
            <div class="list-left">
              <div class="list-avatar">
                {{ pass.company.charAt(0) }}
              </div>
              <div>
                <div class="list-title">{{ pass.company }}</div>
                <div class="list-subtitle">{{ pass.date }} • {{ pass.pass_no }}</div>
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

          <div v-if="!myPasses.length" class="empty-state">
            No gate pass requests found for this period
          </div>
        </div>
      </v-col>

      <!-- RIGHT: Quick Actions -->
      <v-col cols="12" lg="4">
        <div class="premium-card">
          <div class="card-head no-margin">
            <div>
              <div class="card-mini-title">Actions</div>
              <h2>Quick Actions</h2>
            </div>
          </div>

          <div
            v-for="action in staffActions"
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
      </v-col>
    </v-row>

</template>

<script>
import { mapGetters } from "vuex";
import swtalert from "@/mixins/swtalert";
import dashboardReport from "@/mixins/dashboardReport";

export default {
  name: "StaffDashboard",

  mixins: [swtalert, dashboardReport],

  data() {
    return {
      filters: [
        { label: "Today", value: "today" },
        { label: "Week", value: "week" },
        { label: "Month", value: "month" },
        { label: "Year", value: "year" },
      ],
      selectedFilter: "today",

      myPasses: [
        {
          id: 1,
          company: "ABC Limited",
          status: "Pending",
          date: "Today • 08:45 AM",
          pass_no: "GP-00124",
        },
        {
          id: 2,
          company: "XYZ Company",
          status: "Approved",
          date: "Yesterday • 02:30 PM",
          pass_no: "GP-00118",
        },
        {
          id: 3,
          company: "Global Technologies",
          status: "Rejected",
          date: "2 days ago",
          pass_no: "GP-00112",
        },
      ],

      staffActions: [
        {
          title: "Create Gate Pass",
          icon: "mdi-plus-circle-outline",
          route: "/gate-pass/create",
          subtitle: "New request",
        },
        {
          title: "My Passes",
          icon: "mdi-file-document-outline",
          route: "/gate-pass",
          subtitle: "Track all requests",
        },
        {
          title: "Upload Visitors",
          icon: "mdi-file-excel-box-outline",
          route: "/gate-pass/upload",
          subtitle: "Bulk request",
        },
      ],
    };
  },

  computed: {
    ...mapGetters({
      user: "auth/user",
    }),

    staffKpis() {
      return [
        {
          label: "Pending Requests",
          value: 3,
          icon: "mdi-clock-outline",
          color: "#f59e0b",
          bg: "rgba(245,158,11,0.12)",
        },
        {
          label: "Approved",
          value: 12,
          icon: "mdi-check-circle-outline",
          color: "#10b981",
          bg: "rgba(16,185,129,0.12)",
        },
        {
          label: "Rejected",
          value: 2,
          icon: "mdi-close-circle-outline",
          color: "#ef4444",
          bg: "rgba(239,68,68,0.12)",
        },
        {
          label: "Active Passes",
          value: 5,
          icon: "mdi-card-account-details",
          color: "#3b82f6",
          bg: "rgba(59,130,246,0.12)",
        },
      ];
    },
  },

  methods: {
    goTo(route) {
      this.$router.push(route);
    },

    applyFilter(filter) {
      this.selectedFilter = filter;

      let start = null;
      let end = null;
      const now = new Date();

      if (filter === "today") {
        start = new Date(now.setHours(0, 0, 0, 0));
        end = new Date();
      }
      if (filter === "week") {
        const firstDay = new Date(now);
        firstDay.setDate(now.getDate() - 7);
        start = firstDay;
        end = new Date();
      }
      if (filter === "month") {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date();
      }
      if (filter === "year") {
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date();
      }

      this.fetchCustomRangeData(start, end);
    },

    getStatusColor(status) {
      if (status === "Active" || status === "Approved") return "success";
      if (status === "Pending") return "warning";
      if (status === "Rejected") return "error";
      return "grey";
    },
  },

  mounted() {
    this.applyFilter("today");
  },
};
</script>

