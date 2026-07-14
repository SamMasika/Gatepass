<template>
<v-row class="insights-grid">

    <!-- TRAFFIC TREND -->
    <v-col cols="12" md="12">
        <v-card class="insight-card trend" elevation="0">

            <div class="card-head">
                <div>
                    <h3>Gate Pass Activity</h3>
                    <p>Daily flow & processing trends</p>
                </div>

                <div class="badge blue">
                    Live Data
                </div>
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

    <!-- STATUS CHART (OPTIONAL - SAFE) -->
    <v-col cols="12" md="6" v-if="showStatusChart">
        <v-card class="insight-card status" elevation="0">

            <div class="card-head">
                <div>
                    <h3>Approval Intelligence</h3>
                    <p>System decision breakdown</p>
                </div>

                <div class="badge green">
                    Secure
                </div>
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
        <v-card class="insight-card full" elevation="0">

            <div class="card-head">
                <div>
                    <h3>Gate Intelligence Overview</h3>
                    <p>System-wide operational summary</p>
                </div>

                <div class="badge dark">
                    AI Insight
                </div>
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

            showStatusChart: false, // toggle safely if needed

            colors: {
                navy: "#1e3a8a",
                indigo: "#6366f1",
                sky: "#0ea5e9",
                teal: "#14b8a6",
                green: "#10b981",
                amber: "#f59e0b",
                red: "#ef4444"
            },

            trendData: {
                categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                series: [{
                        name: "Approved",
                        data: [12, 18, 20, 15, 25, 10, 8]
                    },
                    {
                        name: "Pending",
                        data: [5, 8, 6, 9, 4, 7, 3]
                    },
                    {
                        name: "Denied",
                        data: [1, 0, 2, 1, 1, 0, 0]
                    }
                ]
            },

            statusData: {
                labels: ["Approved", "Pending", "Denied"],
                series: [120, 45, 5]
            }
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
                    toolbar: {
                        show: false
                    },
                    fontFamily: "Inter, sans-serif"
                },

                series: this.trendData.series,

                colors: [
                    this.colors.navy,
                    this.colors.indigo,
                    this.colors.sky
                ],

                plotOptions: {
                    bar: {
                        borderRadius: 8,
                        columnWidth: "40%"
                    }
                },

                grid: {
                    borderColor: "#e2e8f0",
                    strokeDashArray: 5
                },

                xaxis: {
                    categories: this.trendData.categories,
                    labels: {
                        style: {
                            colors: "#64748b"
                        }
                    }
                },

                yaxis: {
                    labels: {
                        style: {
                            colors: "#64748b"
                        }
                    }
                },

                dataLabels: {
                    enabled: false
                },

                legend: {
                    position: "bottom"
                }
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
                    fontFamily: "Inter, sans-serif"
                },

                series: this.statusData.series,
                labels: this.statusData.labels,

                colors: [
                    this.colors.green,
                    this.colors.amber,
                    this.colors.red
                ],

                stroke: {
                    width: 2,
                    colors: ["#fff"]
                },

                plotOptions: {
                    pie: {
                        donut: {
                            size: "70%",
                            labels: {
                                show: true,
                                value: {
                                    fontSize: "20px",
                                    fontWeight: 800,
                                    color: "#0f172a"
                                },
                                total: {
                                    show: true,
                                    label: "Total",
                                    formatter: (w) =>
                                        w.globals.seriesTotals.reduce((a, b) => a + b, 0)
                                }
                            }
                        }
                    }
                },

                legend: {
                    position: "bottom"
                }
            };

            if (this.statusChart) this.statusChart.destroy();
            this.statusChart = new ApexCharts(this.$refs.statusChart, options);
            this.statusChart.render();
        }

    }
};
</script>

<style scoped>
.insights-grid {
    margin-top: 10px;
}

.insight-card {
    border-radius: 28px;
    padding: 22px;
    background: rgba(255, 255, 255, 0.86);
    backdrop-filter: blur(18px);
    border: 1px solid rgba(226, 232, 240, 0.8);
    box-shadow: 0 12px 35px rgba(15, 23, 42, 0.06);
    transition: .3s ease;
}

.insight-card:hover {
    transform: translateY(-4px);
}

.card-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
}

.card-head h3 {
    font-size: 16px;
    font-weight: 800;
    color: #0f172a;
}

.card-head p {
    font-size: 12px;
    color: #64748b;
}

.badge {
    font-size: 11px;
    font-weight: 700;
    padding: 6px 10px;
    border-radius: 999px;
}

.blue {
    background: rgba(30, 58, 138, 0.1);
    color: #1e3a8a;
}

.green {
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
}

.dark {
    background: rgba(15, 23, 42, 0.08);
    color: #0f172a;
}

.chart-box {
    min-height: 280px;
}

.insight-footer {
    margin-top: 14px;
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
}

.metric {
    font-size: 12px;
    color: #475569;
    display: flex;
    align-items: center;
    gap: 6px;
}

.dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.navy {
    background: #1e3a8a;
}

.indigo {
    background: #6366f1;
}

.green {
    background: #10b981;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-top: 10px;
}

.info-box {
    padding: 16px;
    border-radius: 18px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
}

.info-title {
    font-size: 12px;
    color: #64748b;
}

.info-value {
    margin-top: 6px;
    font-size: 14px;
    font-weight: 800;
    color: #0f172a;
}

.low {
    color: #10b981;
}
</style>
