<template>
  <v-row class="insights-grid">
    <!-- TRAFFIC TREND -->
    <v-col cols="12">
      <v-card class="insight-card" elevation="0">
        <div class="card-head">
          <div>
            <h3>Gate Pass Activity</h3>
            <p>Daily flow & processing trends</p>
          </div>
          <div class="badge blue">Live Data</div>
        </div>

        <div ref="trendChart" class="chart-box"></div>

        <div class="insight-footer">
          <div class="metric">
            <span class="dot navy"></span>
            Approved: <b>High stability</b>
          </div>
          <div class="metric">
            <span class="dot indigo"></span>
            Pending: <b>Moderate load</b>
          </div>
        </div>
      </v-card>
    </v-col>

    <!-- STATUS CHART -->
    <v-col cols="12" md="6" v-if="showStatusChart">
      <v-card class="insight-card" elevation="0">
        <div class="card-head">
          <div>
            <h3>Approval Intelligence</h3>
            <p>System decision breakdown</p>
          </div>
          <div class="badge green">Secure</div>
        </div>

        <div ref="statusChart" class="chart-box"></div>

        <div class="insight-footer">
          <div class="metric">
            <span class="dot green"></span>
            Approved passes dominate system flow
          </div>
        </div>
      </v-card>
    </v-col>

    <!-- EXTRA INSIGHT CARD -->
    <v-col cols="12">
      <v-card class="insight-card" elevation="0">
        <div class="card-head">
          <div>
            <h3>Gate Intelligence Overview</h3>
            <p>System-wide operational summary</p>
          </div>
          <div class="badge dark">AI Insight</div>
        </div>

        <div class="info-grid">
          <div class="info-box">
            <div class="info-title">Peak Hour</div>
            <div class="info-value">10:00 - 12:00</div>
          </div>
          <div class="info-box">
            <div class="info-title">Gate Load</div>
            <div class="info-value">Gate 1 (High)</div>
          </div>
          <div class="info-box">
            <div class="info-title">Approval Rate</div>
            <div class="info-value">92%</div>
          </div>
          <div class="info-box">
            <div class="info-title">Risk Level</div>
            <div class="info-value low">Low</div>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import ApexCharts from "apexcharts";

export default {
  name: "GatePassInsights",

  data() {
    return {
      trendChart: null,
      statusChart: null,
      showStatusChart: false,

      colors: {
        navy: "#1e3a8a",
        indigo: "#6366f1",
        sky: "#0ea5e9",
        teal: "#14b8a6",
        green: "#10b981",
        amber: "#f59e0b",
        red: "#ef4444",
      },

      trendData: {
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        series: [
          { name: "Approved", data: [12, 18, 20, 15, 25, 10, 8] },
          { name: "Pending", data: [5, 8, 6, 9, 4, 7, 3] },
          { name: "Denied", data: [1, 0, 2, 1, 1, 0, 0] },
        ],
      },

      statusData: {
        labels: ["Approved", "Pending", "Denied"],
        series: [120, 45, 5],
      },
    };
  },

  mounted() {
    this.$nextTick(() => {
      this.renderTrend();
      this.renderStatus();
    });
  },

  beforeUnmount() {
    if (this.trendChart) this.trendChart.destroy();
    if (this.statusChart) this.statusChart.destroy();
  },

  methods: {
    renderTrend() {
      if (!this.$refs.trendChart) return;

      const options = {
        chart: {
          type: "bar",
          stacked: true,
          height: 300,
          toolbar: { show: false },
          fontFamily: "Inter, sans-serif",
          background: "transparent",
        },
        series: this.trendData.series,
        colors: [this.colors.navy, this.colors.indigo, this.colors.sky],
        plotOptions: {
          bar: {
            borderRadius: 8,
            columnWidth: "42%",
          },
        },
        grid: {
          borderColor: "var(--border)",
          strokeDashArray: 4,
        },
        xaxis: {
          categories: this.trendData.categories,
          labels: { style: { colors: "var(--text-muted)" } },
        },
        yaxis: {
          labels: { style: { colors: "var(--text-muted)" } },
        },
        dataLabels: { enabled: false },
        legend: {
          position: "bottom",
          labels: { colors: "var(--text-secondary)" },
        },
        tooltip: { theme: document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light" },
      };

      if (this.trendChart) this.trendChart.destroy();
      this.trendChart = new ApexCharts(this.$refs.trendChart, options);
      this.trendChart.render();
    },

    renderStatus() {
      if (!this.showStatusChart || !this.$refs.statusChart) return;

      const options = {
        chart: {
          type: "donut",
          height: 300,
          fontFamily: "Inter, sans-serif",
          background: "transparent",
        },
        series: this.statusData.series,
        labels: this.statusData.labels,
        colors: [this.colors.green, this.colors.amber, this.colors.red],
        stroke: { width: 2, colors: ["var(--surface)"] },
        plotOptions: {
          pie: {
            donut: {
              size: "70%",
              labels: {
                show: true,
                value: {
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "var(--text)",
                },
                total: {
                  show: true,
                  label: "Total",
                  color: "var(--text-muted)",
                  formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0),
                },
              },
            },
          },
        },
        legend: {
          position: "bottom",
          labels: { colors: "var(--text-secondary)" },
        },
        tooltip: { theme: document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light" },
      };

      if (this.statusChart) this.statusChart.destroy();
      this.statusChart = new ApexCharts(this.$refs.statusChart, options);
      this.statusChart.render();
    },
  },
};
</script>

<style scoped>
.insights-grid {
  margin-top: 8px;
}

.insight-card {
  border-radius: 20px;
  padding: 22px;
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  transition: all 0.25s ease;
}

.insight-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.card-head h3 {
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 4px;
}

.card-head p {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
}

.badge {
  font-size: 11px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 999px;
  white-space: nowrap;
}

.blue {
  background: var(--blue-light);
  color: var(--blue);
}

.green {
  background: var(--success-light);
  color: var(--success);
}

.dark {
  background: var(--surface-alt);
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

.chart-box {
  min-height: 280px;
}

.insight-footer {
  margin-top: 16px;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.metric {
  font-size: 13px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 6px;
}

.metric b {
  color: var(--text);
  font-weight: 600;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.navy { background: #1e3a8a; }
.indigo { background: #6366f1; }
.green { background: #10b981; }

.info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-top: 12px;
}

.info-box {
  padding: 16px;
  border-radius: 14px;
  background: var(--surface-alt);
  border: 1px solid var(--border-light);
}

.info-title {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
}

.info-value {
  margin-top: 6px;
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
}

.low {
  color: var(--success);
}

@media (max-width: 960px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .card-head {
    flex-direction: column;
    gap: 10px;
  }
}
</style>