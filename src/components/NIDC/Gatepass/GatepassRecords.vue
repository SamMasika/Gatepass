<template>
<v-container fluid class="premium-page-wrapper">
    <PageBreadcrumb title="Gate Pass Records" parent="Gate Passes" parentRoute="/gate-pass" />

    <!-- PREMIUM HERO -->
    <div class="premium-hero">
        <div class="hero-content">
            <div class="hero-icon">
                <v-icon size="50" color="#ffffff">mdi-gate-arrow-right</v-icon>
            </div>
            <div class="hero-text">
                <h1 class="hero-title">Gate Pass Records</h1>
                <p class="hero-subtitle">Detailed visitor movement history</p>
            </div>
        </div>

        <v-chip color="white" dark large class="total-stats-chip" label rounded="xl">
            <v-icon left size="22">mdi-calendar-range</v-icon>
            {{ dailyTransactions.length }} Active Day(s)
        </v-chip>
    </div>

    <!-- EMPTY STATE -->
    <v-card v-if="!loadingDetails && dailyTransactions.length === 0" class="empty-premium-card" rounded="xl" elevation="0">
        <v-icon size="108" color="#e2e8f0">mdi-calendar-blank-outline</v-icon>
        <h2 class="empty-title">No Activity Recorded</h2>
        <p class="empty-subtitle">Visitor records will appear here.</p>
    </v-card>

    <!-- EXPANSION PANELS -->
    <v-expansion-panels v-else v-model="expandedPanels" multiple class="visitor-panel" elevation="0">
        <v-expansion-panel v-for="day in dailyTransactions" :key="day.date">
            <!-- HEADER -->
            <v-expansion-panel-title class="panel-title">
                <div class="panel-title-left">
                    <v-icon color="#0f766e" size="28">mdi-calendar-month</v-icon>

                    <div>
                        <div class="title">{{ day.formatted_date }}</div>
                        <div class="subtitle">
                            {{ day.day_of_week }} • {{ day.transactions.length }} Visitors
                        </div>
                    </div>
                </div>
                <v-spacer></v-spacer>
                <div class="panel-title-right">
                    <v-btn @click.stop="downloadDailyGatePass(day.date)" color="primary" rounded depressed class="export-btn premium-bulk-btn" flat>
                        <v-icon left>mdi-file-pdf-box</v-icon>
                        Export PDF
                    </v-btn>
                </div>
            </v-expansion-panel-title>

            <!-- CONTENT -->
            <v-expansion-panel-text>
                <div class="table-container">
                    <!-- STATS BAR -->
                   <!-- PREMIUM STATS BAR -->
<div class="premium-stats-bar">
    <div class="stat-item total">
        <div class="stat-value">{{ day.transactions.length }}</div>
        <div class="stat-name">Total Movements</div>
    </div>
    
    <div class="stat-item checked-in">
        <div class="stat-value">{{ checkedIn(day.transactions) }}</div>
        <div class="stat-name">Checked In</div>
    </div>
    
    <div class="stat-item checked-out">
        <div class="stat-value">{{ checkedOut(day.transactions) }}</div>
        <div class="stat-name">Checked Out</div>
    </div>
</div>

                    <!-- TABLE -->
                    <div class="table-wrapper">
                        <div class="table-head">
                            <div class="th">Visitor</div>
                            <div class="th">Phone</div>
                            <div class="th text-right">Check In</div>
                            <div class="th text-right">Check Out</div>
                        </div>

                        <div v-for="transaction in day.transactions" :key="transaction.id" class="table-row">
                            <!-- VISITOR -->
                            <div class="td">
                                <div class="visitor-box">
                                    <v-avatar size="48" class="mr-3">
                                        <span class="avatar-initials">{{ getInitials(transaction.visitor) }}</span>
                                    </v-avatar>
                                    <div>
                                        <div class="visitor-name">
                                            {{ transaction.visitor.first_name }} {{ transaction.visitor.last_name }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- PHONE -->
                            <div class="td">{{ transaction.visitor.phone }}</div>

                          
                            <!-- CHECK IN -->
                            <div class="td text-right time-cell">
                                {{ transaction.checkin_at || '—' }}
                            </div>

                            <!-- CHECK OUT -->
                            <div class="td text-right time-cell">
                                {{ transaction.checkout_at || '—' }}
                            </div>
                        </div>

                        <!-- Empty State Inside Panel -->
                        <div v-if="!day.transactions.length" class="empty-state">
                            <p>No visitor records for this day.</p>
                        </div>
                    </div>
                </div>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</v-container>
</template>

<script>
import axios from "axios";
import PageBreadcrumb from '@/components/NIDC/SharedComponents/PageBreadcrumb.vue'
import swtalert from "@/mixins/swtalert";

export default {
    components: {
        PageBreadcrumb
	},
	mixins: [swtalert],

    props: {
        id: {
            required: true,
            type: [String, Number]
        }
    },

    data() {
        return {
            loadingDetails: true,
            selectedGatePass: {},
            dailyTransactions: [],
            expandedPanels: [] // Control which panels are open
        };
    },

    created() {
        const gatepassId = this.$route.params.id || this.id;
        this.loadGatePassDetails(gatepassId);
    },

    methods: {
        async loadGatePassDetails(id) {
            this.loadingDetails = true;
            try {
                const res = await axios.get(`/gate-passes/${id}`);
                this.selectedGatePass = res.data.data.gate_pass;
                this.dailyTransactions = res.data.data.daily_transactions || [];
            } catch (err) {
                console.error(err);
            } finally {
                this.loadingDetails = false;
            }
        },

      downloadDailyGatePass(date) {
    const url = `/gate-passes/${this.selectedGatePass.id}/download-daily?date=${date}`;

    axios.get(url, {
            responseType: "blob",
        })
        .then((res) => {
            const blob = new Blob([res.data], {
                type: "application/pdf",
            });

            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = `GatePass-${date}.pdf`;
            document.body.appendChild(link);
            link.click();

            window.URL.revokeObjectURL(link.href);
            document.body.removeChild(link);
        })
        .catch((err) => {
            const message =
                err.response?.data?.message || "Failed to download gate pass.";

            this.showAlert(message, "error");
        });
},

        getInitials(visitor) {
            if (!visitor) return "??";
            return `${visitor.first_name?.[0] || ""}${visitor.last_name?.[0] || ""}`.toUpperCase();
        },

        checkedIn(list) {
            return list.filter(i => i.checkin_status === "checked_in").length;
        },

        checkedOut(list) {
            return list.filter(i => i.checkin_status === "checked_out").length;
        },

        getStatusColor(status) {
            if (status === "checked_in") return "success";
            if (status === "checked_out") return "info";
            return "warning";
        },

        movementStatusLabel(status) {
            return status.replace(/_/g, " ").toUpperCase();
        }
    }
};
</script>

<style scoped>
.premium-page-wrapper {
    padding: 20px 0;
    max-width: 1280px;
    margin: 0 auto;
}

.premium-hero {
    display: flex;
    justify-content: space-between;
    align-items: center;
   background: linear-gradient(135deg, #1b867c, #003B73, #0f172a);
    border-radius: 18px;
    padding: 14px 26px;
    margin-bottom: 36px;
}

.hero-icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #14b8a6, #0ea5e9);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hero-title {
    font-size: 25px;
    font-weight: 800;
    color: white;
    margin: 0;
}

.hero-subtitle {
    color: #94a3b8;
    font-size: 15.5px;
}

.visitor-panel .v-expansion-panel {
    margin-bottom: 16px;
    border: 1px solid #e2e8f0;
    border-radius: 16px !important;
    overflow: hidden;
}

.panel-title {
    padding: 24px 32px;
}

.panel-title-left {
    display: flex;
    align-items: center;
    gap: 20px;
}

.title {
    font-size: 20px;
    font-weight: 700;
    color: #0f172a;
}

.subtitle {
    font-size: 14px;
    color: #64748b;
}

.panel-title-right {
    margin-left: auto;
}

/* ===================== PREMIUM STATS BAR ===================== */
.premium-stats-bar {
    display: flex;
    justify-content: space-between;
    background: linear-gradient(145deg, #ffffff, #f8fafc);
    border-radius: 20px;
    padding: 28px 40px;
    margin-bottom: 32px;
    /* box-shadow: 
        0 10px 30px rgba(15, 23, 42, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.9); */
    border: 1px solid rgba(226, 232, 240, 0.8);
    position: relative;
    overflow: hidden;
}

.premium-stats-bar::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    /* background: linear-gradient(90deg, #1b867c, #003b73, #0f172a); */
}

.stat-item {
    flex: 1;
    text-align: center;
    position: relative;
}

.stat-item:not(:last-child)::after {
    content: '';
    position: absolute;
    right: -8px;
    top: 50%;
    transform: translateY(-50%);
    height: 48px;
    width: 1px;
    background: linear-gradient(to bottom, transparent, #e2e8f0, transparent);
}

.stat-value {
    font-size: 20px;
    font-weight: 900;
    line-height: 1;
    letter-spacing: -2px;
    background: linear-gradient(90deg, #0f172a, #1e2937);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 6px;
}

.checked-in .stat-value {
    background: linear-gradient(90deg, #10b981, #34d399);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.checked-out .stat-value {
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.stat-name {
    font-size: 13.5px;
    font-weight: 700;
    color: #64748b;
    text-transform: none;
    letter-spacing: 1.2px;
    margin-top: 4px;
}

/* Hover Effect */
.premium-stats-bar:hover {
    box-shadow: 
        0 15px 35px rgba(15, 23, 42, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.95);
    transform: translateY(-2px);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}


/* =====================================================
    TABLE
===================================================== */

.table-wrapper {
    width: 100%;
    overflow-x: auto;
    background: white;
    border-radius: 20px;
    /* box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06); */
}

/* ===================== TABLE HEADER ===================== */
.table-head {
    width: 100%;
    min-width: 1050px;
    /* Good balance */

    display: grid;
    grid-template-columns:
     2.5fr  1.50fr 1.50fr 1.50fr;
    /* Check Out */

    align-items: center;
    padding: 18px 24px;
    background: linear-gradient(135deg, #1b867c, #003b73, #0f172a);
    border-radius: 20px 20px 0 0;
    margin-bottom: 12px;
    gap: 16px;
}

.th {
    color: rgba(255, 255, 255, 0.93);
    font-size: 13.5px;
    font-weight: 700;
    letter-spacing: 0.5px;
}

/* ===================== TABLE ROWS ===================== */
.table-row {
    width: 100%;
    min-width: 1050px;

    display: grid;
    grid-template-columns:
       2.5fr  1.50fr 1.50fr 1.50fr;

    align-items: center;
    padding: 18px 24px;
    gap: 16px;

    border: 1px solid #edf2f7;
    border-radius: 18px;
    margin-bottom: 10px;

    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    background: white;
}

.table-row:hover {
    transform: translateY(-3px);
    background: linear-gradient(to right, rgba(38, 166, 154, 0.025), rgba(17, 69, 117, 0.035));
    box-shadow: 0 20px 45px rgba(15, 23, 42, 0.07);
    border-color: #cbd5e1;
}

/* Cell Styling */
.td,
.th {
    display: flex;
    align-items: center;
}

.td {
    font-size: 14.8px;
    color: #334155;
}

/* Visitor Column */
.visitor-box {
    display: flex;
    align-items: center;
    gap: 16px;
}

.avatar-text {
    font-size: 20px;
    font-weight: 700;
    color: white;
    background: linear-gradient(135deg, #1b867c, #003b73);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

/* Prevent text overflow */
.td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* Responsive */
@media (max-width: 1280px) {

    .table-head,
    .table-row {
        min-width: 960px;
        grid-template-columns:
            2.5fr  1.50fr 1.50fr 1.50fr;
    }
}

@media (max-width: 960px) {

    .table-head,
    .table-row {
        min-width: 820px;
    }
}

.visitor-box {
    display: flex;
    align-items: center;
}

.avatar-initials {
    width: 38px;
    height: 38px;
    border-radius: 14px;
    background: linear-gradient(135deg, #26a69a, #114575);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 800;
}

.visitor-name {
    font-weight: 700;
    color: #0f172a;
}

.gate-text,
.time-cell {
    color: #475569;
}
.premium-bulk-btn {
  position: relative;
  overflow: hidden;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.3px;
  padding: 10px 20px !important;
  height: 40px !important;
  transition: all 0.3s ease;
}

.export-btn {
  /* Gradient Variants */

   background: linear-gradient(135deg, #10b981, #047857) !important;
    color: white;

}

/* Responsive */
@media (max-width: 960px) {

    .table-head,
    .table-row {
        grid-template-columns: 1fr;
    }

    .table-head {
        display: none;
    }
}
</style>
