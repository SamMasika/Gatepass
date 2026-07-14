<template>
<v-container fluid class="dashboard">

    <!-- =========================================================
        TOP HERO
    ========================================================== -->
    <section class="hero-section">

        <div class="hero-left">

            <h1>
                Gate Pass Dashboard
            </h1>

            <p>
                Smart visitor access management with real-time
                monitoring, approvals, analytics and security tracking.
            </p>

        </div>

    </section>

    <!-- =====================================================
    PREMIUM MINI KPI SECTION
===================================================== -->
    <section class="premium-kpi-section">

        <div v-for="kpi in kpis" :key="kpi.label" class="premium-kpi-card">

            <!-- LEFT -->
            <div class="premium-left">

                <div class="premium-icon-wrap" :style="{
                    background: kpi.bg
                }">

                    <v-icon size="20" :color="kpi.color">
                        {{ kpi.icon }}
                    </v-icon>

                </div>

                <div>

                    <div class="premium-label">
                        {{ kpi.label }}
                    </div>

                    <!-- <div class="premium-sub">
                        Live monitoring
                    </div> -->

                </div>

            </div>

            <!-- RIGHT -->
            <div class="premium-value" :style="{
               
            }">
                {{ kpi.value }}
            </div>

            <!-- GLOW -->
            <div class="premium-glow" :style="{
                background: kpi.color
            }"></div>

        </div>

    </section>
    <!-- =========================================================
        MAIN CONTENT
    ========================================================== -->
    <v-row dense class="main-grid">

        <!-- =====================================================
            LEFT
        ====================================================== -->
        <v-col cols="12" lg="8">

            <!-- ANALYTICS -->
            <div class="premium-card analytics-card mb-5">

                <div class="card-head">

                    <div>

                        <div class="card-mini-title">
                            Analytics
                        </div>

                        <h2>
                            Visitor Access Analytics
                        </h2>

                    </div>

                </div>

                <div class="chart-wrapper">

                    <gate-chart></gate-chart>

                </div>

            </div>

            <!-- RECENT PASSES -->
            <div class="premium-card mb-5">

                <div class="card-head">

                    <div>

                        <div class="card-mini-title">
                            Access Requests
                        </div>

                        <h2>
                            Recent Gate Passes
                        </h2>

                    </div>

                    <v-btn variant="text" color="primary">
                        View All
                    </v-btn>

                </div>

                <div v-for="pass in gatePasses" :key="pass.id" class="list-item">

                    <div class="list-left">

                        <div class="list-avatar">
                            {{ pass.company.charAt(0) }}
                        </div>

                        <div>

                            <div class="list-title">
                                {{ pass.company }}
                            </div>

                            <div class="list-subtitle">
                                {{ pass.date }}
                            </div>

                        </div>

                    </div>

                    <v-chip size="small" :color="getStatusColor(pass.status)" class="status-chip">
                        {{ pass.status }}
                    </v-chip>

                </div>

            </div>

            <!-- LIVE VISITORS -->
            <div class="premium-card">

                <div class="card-head">

                    <div>

                        <div class="card-mini-title">
                            Monitoring
                        </div>

                        <h2>
                            Live Visitor Activity
                        </h2>

                    </div>

                    <div class="live-pill">

                        <span></span>

                        LIVE

                    </div>

                </div>

                <div v-for="visitor in visitors" :key="visitor.id" class="list-item">

                    <div class="list-left">

                        <div class="visitor-avatar">
                            {{ visitor.name.charAt(0) }}
                        </div>

                        <div>

                            <div class="list-title">
                                {{ visitor.name }}
                            </div>

                            <div class="list-subtitle">
                                {{ visitor.company }}
                            </div>

                        </div>

                    </div>

                    <v-chip v-if="visitor.status === 'inside'" size="small" color="success" class="status-chip">
                        Inside
                    </v-chip>

                    <v-chip v-else size="small" color="grey-darken-1" class="status-chip">
                        Checked Out
                    </v-chip>

                </div>

            </div>

        </v-col>

        <!-- =====================================================
            RIGHT
        ====================================================== -->
        <v-col cols="12" lg="4">

            <!-- QUICK ACTIONS -->
            <div class="premium-card mb-5">

                <div class="card-head no-margin">

                    <div>

                        <div class="card-mini-title">
                            Operations
                        </div>

                        <h2>
                            Quick Actions
                        </h2>

                    </div>

                </div>

                <div v-for="action in actions" :key="action.title" class="quick-action" @click="goTo(action.route)">

                    <div class="quick-left">

                        <div class="quick-icon">

                            <v-icon size="18">
                                {{ action.icon }}
                            </v-icon>

                        </div>

                        <div>

                            <div class="quick-title">
                                {{ action.title }}
                            </div>

                            <div class="quick-subtitle">
                                Access management
                            </div>

                        </div>

                    </div>

                    <v-icon size="18">
                        mdi-arrow-top-right
                    </v-icon>

                </div>

            </div>

            <!-- GATE STATUS -->
            <div class="premium-card mb-5">

                <div class="card-head no-margin">

                    <div>

                        <div class="card-mini-title">
                            Infrastructure
                        </div>

                        <h2>
                            Gate Status
                        </h2>

                    </div>

                </div>

                <div class="status-card success">

                    <div class="status-left">

                        <div class="status-icon">

                            <v-icon size="18">
                                mdi-gate-open
                            </v-icon>

                        </div>

                        <div>

                            <div class="status-title">
                                Gate 1 Operational
                            </div>

                            <div class="status-sub">
                                Main Entrance
                            </div>

                        </div>

                    </div>

                    <div class="pulse green"></div>

                </div>

                <div class="status-card success">

                    <div class="status-left">

                        <div class="status-icon">

                            <v-icon size="18">
                                mdi-gate-open
                            </v-icon>

                        </div>

                        <div>

                            <div class="status-title">
                                Gate 2 Operational
                            </div>

                            <div class="status-sub">
                                Secondary Entrance
                            </div>

                        </div>

                    </div>

                    <div class="pulse green"></div>

                </div>

                <div class="status-card warning">

                    <div class="status-left">

                        <div class="status-icon">

                            <v-icon size="18">
                                mdi-account-clock-outline
                            </v-icon>

                        </div>

                        <div>

                            <div class="status-title">
                                32 Visitors Inside
                            </div>

                            <div class="status-sub">
                                Currently monitored
                            </div>

                        </div>

                    </div>

                    <div class="pulse orange"></div>

                </div>

            </div>

            <!-- SECURITY SCORE -->
            <div class="security-card">

                <div class="security-bg"></div>

                <div class="security-top">

                    <div>

                        <div class="security-label">
                            Security Health
                        </div>

                        <div class="security-score">
                            98%
                        </div>

                    </div>

                    <div class="security-icon-box">

                        <v-icon size="34">
                            mdi-shield-star-outline
                        </v-icon>

                    </div>

                </div>

                <div class="progress-track">

                    <div class="progress-fill"></div>

                </div>

                <p>
                    All security systems are operational with
                    no active incidents detected.
                </p>

            </div>

        </v-col>

    </v-row>

</v-container>
</template>

<script>
import {
    mapGetters
} from "vuex";
import gateChart from "../Report/gateChart.vue";
import swtalert from "@/mixins/swtalert";
import dashboardReport from "@/mixins/dashboardReport.js";


export default {

    name: "GatePassDashboard",

    components: {
        gateChart
    },

    mixins: [swtalert,dashboardReport],

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

<style scoped>
/* =========================================================
    GLOBAL
========================================================= */

.dashboard {
    position: relative;
    overflow: hidden;

    min-height: 100vh;

    padding: 30px;

}

/* =========================================================
    BACKGROUND
========================================================= */

.bg-wrapper {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
}

.bg-circle {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);
}

.circle-1 {
    width: 320px;
    height: 320px;

    background: rgba(59, 130, 246, .10);

    top: -120px;
    left: -80px;
}

.circle-2 {
    width: 320px;
    height: 320px;

    background: rgba(139, 92, 246, .10);

    right: -100px;
    top: 120px;
}

.circle-3 {
    width: 260px;
    height: 260px;

    background: rgba(16, 185, 129, .08);

    bottom: -80px;
    left: 40%;
}

.grid-overlay {
    position: absolute;
    inset: 0;

    background-image:
        linear-gradient(rgba(15, 23, 42, .03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(15, 23, 42, .03) 1px, transparent 1px);

    background-size: 50px 50px;
}

/* =========================================================
    HERO
========================================================= */

.hero-section {
    position: relative;
    z-index: 2;

    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;

    margin-bottom: 28px;
}

.hero-chip {
    display: inline-flex;
    align-items: center;
    gap: 10px;

    padding: 10px 16px;

    border-radius: 999px;

    background: rgba(255, 255, 255, .75);

    border: 1px solid rgba(255, 255, 255, .95);

    backdrop-filter: blur(12px);

    margin-bottom: 20px;

    font-size: 12px;
    font-weight: 700;

    color: #334155;
}

.hero-chip span {
    width: 8px;
    height: 8px;

    border-radius: 50%;

    background: #10b981;
}

.hero-left h1 {
    font-size: 1.5rem;
    line-height: 1;

    font-weight: 900;

    letter-spacing: -.06em;

    color: #0f172a;

    margin-bottom: 18px;
}

.hero-left h1 span {
    background: linear-gradient(135deg, #1b867c, #003B73, #0f172a);

    -webkitbackground-clip: text;
    -webkit-text-fill-color: transparent;
}

.hero-left p {
    max-width: 700px;

    color: #64748b;

    line-height: 1.8;

    font-size: 15px;
}

/* =========================================================
    ADMIN
========================================================= */

.admin-card {
    display: flex;
    align-items: center;
    gap: 14px;

    padding: 16px 18px;

    border-radius: 28px;

    background: rgba(255, 255, 255, .72);

    border: 1px solid rgba(255, 255, 255, .95);

    backdrop-filter: blur(14px);

    box-shadow:
        0 12px 35px rgba(15, 23, 42, .05);
}

.admin-avatar {
    width: 56px;
    height: 56px;

    border-radius: 18px;

    background: linear-gradient(135deg, #1b867c, #003B73, #0f172a);

    display: flex;
    align-items: center;
    justify-content: center;

    color: white;

    font-size: 1rem;
    font-weight: 800;
}

.admin-name {
    font-size: 15px;
    font-weight: 700;

    color: #0f172a;
}

.admin-role {
    margin-top: 4px;

    color: #64748b;

    font-size: 12px;
}

/* =========================================================
    HERO GRID
========================================================= */

.hero-grid {
    position: relative;
    z-index: 2;

    display: grid;
    grid-template-columns: 1.5fr 1fr;

    gap: 20px;

    margin-bottom: 24px;
}

/* =====================================================
    PREMIUM MINI KPI SECTION
===================================================== */

.premium-kpi-section {
    position: relative;
    z-index: 2;

    display: grid;
    grid-template-columns: repeat(4, 1fr);

    gap: 14px;

    margin-bottom: 24px;
}

/* =====================================================
    KPI CARD
===================================================== */

.premium-kpi-card {
    position: relative;
    overflow: hidden;

    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 18px 20px;

    border-radius: 24px;

    background:
        linear-gradient(145deg,
            rgba(255, 255, 255, .96),
            rgba(255, 255, 255, .88));

    border: 1px solid rgba(255, 255, 255, .95);

    backdrop-filter: blur(18px);

    box-shadow:
        0 10px 30px rgba(15, 23, 42, .05);

    min-height: 95px;

    transition: .35s ease;
}

.premium-kpi-card:hover {
    transform: translateY(-4px);

    box-shadow:
        0 18px 35px rgba(37, 99, 235, .10);
}

/* =====================================================
    LEFT
===================================================== */

.premium-left {
    display: flex;
    align-items: center;
    gap: 14px;

    position: relative;
    z-index: 2;
}

.premium-icon-wrap {
    width: 52px;
    height: 52px;

    border-radius: 18px;

    display: flex;
    align-items: center;
    justify-content: center;

    flex-shrink: 0;
}

.premium-label {
    font-size: 14px;
    font-weight: 700;

    color: #0f172a;
}

.premium-sub {
    margin-top: 4px;

    font-size: 11px;
    font-weight: 600;

    color: #94a3b8;
}

/* =====================================================
    VALUE
===================================================== */

.premium-value {
    position: relative;
    z-index: 2;

    font-size: 1.5rem;
    line-height: 1;

    font-weight: 900;

    letter-spacing: -.05em;
}

/* =====================================================
    GLOW EFFECT
===================================================== */

.premium-glow {
    position: absolute;

    width: 120px;
    height: 120px;

    border-radius: 50%;

    opacity: .08;

    filter: blur(50px);

    right: -40px;
    top: -40px;
}

/* =====================================================
    RESPONSIVE
===================================================== */

@media(max-width: 1200px) {

    .premium-kpi-section {
        grid-template-columns: repeat(2, 1fr);
    }

}

@media(max-width: 700px) {

    .premium-kpi-section {
        grid-template-columns: 1fr;
    }

}

/* =========================================================
    MAIN HERO
========================================================= */

.hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;

    padding: 10px 18px;

    border-radius: 999px;

    background: rgba(255, 255, 255, .14);

    border: 1px solid rgba(255, 255, 255, .16);

    font-size: 12px;
    font-weight: 700;
}

.hero-badge span {
    width: 8px;
    height: 8px;

    border-radius: 50%;

    background: #34d399;
}

.hero-icon {
    width: 76px;
    height: 76px;

    border-radius: 24px;

    background: rgba(255, 255, 255, .14);

    border: 1px solid rgba(255, 255, 255, .18);

    display: flex;
    align-items: center;
    justify-content: center;
}

.hero-value {
    margin-top: 32px;

    font-size: 5.5rem;
    line-height: 1;

    font-weight: 900;

    letter-spacing: -.08em;
}

.hero-title {
    margin-top: 14px;

    font-size: 1.2rem;
    font-weight: 700;
}

.hero-description {
    margin-top: 12px;

    max-width: 500px;

    color: rgba(255, 255, 255, .82);

    line-height: 1.8;

    font-size: 14px;
}

.hero-footer {
    display: flex;
    gap: 50px;

    margin-top: 36px;
}

.metric strong {
    display: block;

    font-size: 1.4rem;
    font-weight: 800;
}

.metric span {
    font-size: 13px;

    color: rgba(255, 255, 255, .80);
}

/* =========================================================
    STATS GRID
========================================================= */

.stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.stat-card {
    background: rgba(255, 255, 255, .72);

    border: 1px solid rgba(255, 255, 255, .95);

    backdrop-filter: blur(16px);

    border-radius: 30px;

    padding: 24px;

    box-shadow:
        0 12px 40px rgba(15, 23, 42, .05);

    transition: .35s ease;
}

.stat-card:hover {
    transform: translateY(-4px);
}

.stat-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.stat-icon {
    width: 54px;
    height: 54px;

    border-radius: 18px;

    display: flex;
    align-items: center;
    justify-content: center;
}

.growth {
    font-size: 12px;
    font-weight: 800;
}

.stat-value {
    margin-top: 28px;

    font-size: 2.4rem;
    line-height: 1;

    font-weight: 900;

    color: #0f172a;
}

.stat-label {
    margin-top: 10px;

    color: #64748b;

    font-size: 13px;
    font-weight: 600;
}

/* =========================================================
    PREMIUM CARD
========================================================= */

.premium-card {
    position: relative;
    z-index: 2;

    background:
        linear-gradient(145deg,
            rgba(255, 255, 255, .88),
            rgba(255, 255, 255, .74));

    border: 1px solid rgba(255, 255, 255, .95);

    backdrop-filter: blur(18px);

    border-radius: 34px;

    padding: 28px;

    box-shadow:
        0 15px 45px rgba(15, 23, 42, .06);
}

.card-head {
    display: flex;
    justify-content: space-between;
    align-items: center;

    margin-bottom: 24px;
}

.card-mini-title {
    font-size: 12px;
    font-weight: 700;

    color: #2563eb;

    margin-bottom: 8px;

    text-transform: uppercase;
    letter-spacing: .08em;
}

.card-head h2 {
    font-size: 1.0rem;
    /* font-weight: 800; */

    color: #0f172a;
}

.no-margin {
    margin-bottom: 18px;
}

.chart-wrapper {
    min-height: 320px;
}

/* =========================================================
    LISTS
========================================================= */

.list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 18px 0;

    border-bottom: 1px solid rgba(226, 232, 240, .7);
}

.list-item:last-child {
    border-bottom: none;
}

.list-left {
    display: flex;
    align-items: center;
    gap: 14px;
}

.list-avatar,
.visitor-avatar {
    width: 52px;
    height: 52px;

    border-radius: 18px;

    background: linear-gradient(135deg, #1b867c, #003B73, #0f172a);

    display: flex;
    align-items: center;
    justify-content: center;

    color: white;

    font-size: 15px;
    font-weight: 800;
}

.list-title {
    font-size: 14px;
    font-weight: 700;

    color: #0f172a;
}

.list-subtitle {
    margin-top: 5px;

    color: #64748b;

    font-size: 12px;
}

/* =========================================================
    LIVE PILL
========================================================= */

.live-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;

    padding: 8px 14px;

    border-radius: 999px;

    background: rgba(239, 68, 68, .10);

    color: #ef4444;

    font-size: 11px;
    font-weight: 800;
}

.live-pill span {
    width: 8px;
    height: 8px;

    border-radius: 50%;

    background: #ef4444;
}

/* =========================================================
    QUICK ACTIONS
========================================================= */

.quick-action {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 18px;

    border-radius: 24px;

    background: #ffffff;

    border: 1px solid #eef2f7;

    margin-bottom: 14px;

    cursor: pointer;

    transition: .3s ease;
}

.quick-action:hover {
    transform: translateY(-4px);

    box-shadow:
        0 18px 35px rgba(37, 99, 235, .08);
}

.quick-left {
    display: flex;
    align-items: center;
    gap: 14px;
}

.quick-icon {
    width: 50px;
    height: 50px;

    border-radius: 18px;

    background: linear-gradient(135deg, #1b867c, #003B73, #0f172a);

    display: flex;
    align-items: center;
    justify-content: center;

    color: white;
}

.quick-title {
    font-size: 14px;
    font-weight: 700;

    color: #0f172a;
}

.quick-subtitle {
    margin-top: 5px;

    color: #64748b;

    font-size: 12px;
}

/* =========================================================
    STATUS
========================================================= */

.status-card {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 18px;

    border-radius: 24px;

    margin-bottom: 14px;
}

.status-card.success {
    background: rgba(16, 185, 129, .10);
}

.status-card.warning {
    background: rgba(245, 158, 11, .10);
}

.status-left {
    display: flex;
    align-items: center;
    gap: 14px;
}

.status-icon {
    width: 46px;
    height: 46px;

    border-radius: 16px;

    background: rgba(255, 255, 255, .80);

    display: flex;
    align-items: center;
    justify-content: center;

    color: #0f172a;
}

.status-title {
    font-size: 14px;
    font-weight: 700;

    color: #0f172a;
}

.status-sub {
    margin-top: 4px;

    color: #64748b;

    font-size: 12px;
}

.pulse {
    width: 12px;
    height: 12px;

    border-radius: 50%;
}

.green {
    background: #10b981;
}

.orange {
    background: #f59e0b;
}

/* =========================================================
    SECURITY CARD
========================================================= */

.security-card {
    position: relative;
    overflow: hidden;

    border-radius: 34px;

    padding: 30px;

    background: linear-gradient(135deg, #1b867c, #003B73, #0f172a);

    color: white;

    box-shadow:
        0 25px 60px rgba(79, 70, 229, .25);
}

.security-bg {
    position: absolute;

    width: 260px;
    height: 260px;

    border-radius: 50%;

    background:
        radial-gradient(rgba(255, 255, 255, .18),
            transparent 70%);

    right: -80px;
    top: -80px;
}

.security-top {
    position: relative;
    z-index: 2;

    display: flex;
    justify-content: space-between;
    align-items: center;
}

.security-label {
    font-size: 13px;

    color: rgba(255, 255, 255, .80);

    margin-bottom: 10px;
}

.security-score {
    font-size: 4rem;
    line-height: 1;

    font-weight: 900;
}

.security-icon-box {
    width: 90px;
    height: 90px;

    border-radius: 28px;

    background: rgba(255, 255, 255, .14);

    border: 1px solid rgba(255, 255, 255, .16);

    display: flex;
    align-items: center;
    justify-content: center;
}

.progress-track {
    position: relative;
    z-index: 2;

    width: 100%;
    height: 10px;

    border-radius: 999px;

    background: rgba(255, 255, 255, .18);

    overflow: hidden;

    margin-top: 28px;
}

.progress-fill {
    width: 98%;
    height: 100%;

    border-radius: 999px;

    background: white;
}

.security-card p {
    position: relative;
    z-index: 2;

    margin-top: 24px;

    line-height: 1.8;

    color: rgba(255, 255, 255, .90);

    font-size: 14px;
}

/* =========================================================
    RESPONSIVE
========================================================= */

@media(max-width: 1200px) {

    .hero-grid {
        grid-template-columns: 1fr;
    }

}

@media(max-width: 960px) {

    .hero-section {
        flex-direction: column;
    }

    .stats-grid {
        grid-template-columns: 1fr 1fr;
    }

    .hero-left h1 {
        font-size: 2.6rem;
    }

}

@media(max-width: 700px) {

    .dashboard {
        padding: 18px;
    }

    .stats-grid {
        grid-template-columns: 1fr;
    }

    .hero-footer {
        gap: 24px;
        flex-wrap: wrap;
    }

    .hero-value {
        font-size: 4.2rem;
    }

    .premium-card,
    .main-hero-card,
    .security-card {
        padding: 24px;
    }

    .card-head {
        flex-direction: column;
        align-items: flex-start;
        gap: 14px;
    }

}
</style>
