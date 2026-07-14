<template>
<v-container fluid class="dashboard">

    <!-- =========================================================
        TOP HERO
    ========================================================== -->
    <section class="hero-section">

        <div class="hero-left">

            <div class="dashboard-header">
                <h1 class="dashboard-title">
                    My Gate Pass Dashboard
                </h1>

              <p class="dashboard-subtitle">
    Stay updated on your gate pass requests and approval status.
</p>
            </div>

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
                    <!-- 
                    <div class="premium-sub">
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

</v-container>
</template>

<script>
import {
    mapGetters
} from "vuex";
import swtalert from "@/mixins/swtalert";
import dashboardReport from "@/mixins/dashboardReport";

export default {

    name: "SecurityDashboard",

    mixins: [swtalert, dashboardReport],

    data() {
        return {

            filters: [{
                    label: "Today",
                    value: "today"
                },
                {
                    label: "Week",
                    value: "week"
                },
                {
                    label: "Month",
                    value: "month"
                },
                {
                    label: "Year",
                    value: "year"
                },
            ],

            selectedFilter: "today",

            visitors: [

                {
                    id: 1,
                    name: "John Doe",
                    company: "ABC Limited",
                    pass_no: "GP-00124",
                    time_in: "08:15 AM",
                    duration: "2h 10m"
                },

                {
                    id: 2,
                    name: "Jane Smith",
                    company: "XYZ Company",
                    pass_no: "GP-00125",
                    time_in: "09:02 AM",
                    duration: "1h 23m"
                }

            ],

        }
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
                const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
                start = firstDay;
                end = new Date();
            }

            if (filter === "year") {
                const firstDay = new Date(now.getFullYear(), 0, 1);
                start = firstDay;
                end = new Date();
            }

            this.fetchCustomRangeData(start, end);
        },

        getStatusColor(status) {

            if (status === "Active") return "success";
            if (status === "Pending") return "warning";
            if (status === "Approved") return "primary";

            return "grey";

        }

    },
    mounted() {
        this.applyFilter("today");
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

.filter-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
}

/* MAIN CONTAINER */
.premium-filter {
    display: flex;
    gap: 6px;

    padding: 6px;

    background: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(18px);

    border: 1px solid rgba(226, 232, 240, 0.7);

    border-radius: 16px;

    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);

    position: relative;
}

/* EACH ITEM */
.premium-filter-item {
    position: relative;
    padding: 10px 16px;

    font-size: 12px;
    font-weight: 700;

    color: #64748b;

    cursor: pointer;

    border-radius: 12px;

    transition: all 0.3s ease;

    user-select: none;
}

/* HOVER */
.premium-filter-item:hover {
    color: #0f172a;
    background: rgba(241, 245, 249, 0.7);
}

/* ACTIVE STATE */
.premium-filter-item.active {
    color: #ffffff;
    background: linear-gradient(135deg, #1b867c, #003B73);

    box-shadow: 0 8px 20px rgba(27, 134, 124, 0.25);
}

/* ACTIVE GLOW DOT */
.premium-filter-item.active .active-indicator {
    position: absolute;

    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);

    width: 6px;
    height: 6px;

    background: #22c55e;

    border-radius: 50%;

    box-shadow: 0 0 10px rgba(34, 197, 94, 0.8);
}

/* SMOOTH CLICK ANIMATION */
.premium-filter-item:active {
    transform: scale(0.96);
}
</style>
