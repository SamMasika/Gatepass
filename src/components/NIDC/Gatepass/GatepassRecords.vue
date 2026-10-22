<template>
  <v-container fluid class="page-wrapper">
    <PageBreadcrumb title="Gate Pass Records" parent="Gate Passes" parentRoute="/gate-pass" />

    <!-- HERO -->
    <div class="hero">
      <div class="hero-left">
        <div class="hero-icon">
          <v-icon size="28" color="white">mdi-gate-arrow-right</v-icon>
        </div>
        <div>
          <h1 class="hero-title">Gate Pass Records</h1>
          <p class="hero-subtitle">Detailed visitor movement history</p>
        </div>
      </div>

      <div class="hero-chip">
        <v-icon size="18" class="mr-2">mdi-calendar-range</v-icon>
        {{ dailyTransactions.length }} Active Day(s)
      </div>
    </div>

    <!-- EMPTY STATE -->
    <div v-if="!loadingDetails && dailyTransactions.length === 0" class="empty-state">
      <v-icon size="72" color="#cbd5e1">mdi-calendar-blank-outline</v-icon>
      <h2>No Activity Recorded</h2>
      <p>Visitor movement records will appear here once activity starts.</p>
    </div>

    <!-- DAYS LIST -->
    <div v-else class="days-list">
      <div
        v-for="(day, index) in dailyTransactions"
        :key="day.date"
        class="day-card"
      >
        <!-- DAY HEADER -->
        <div class="day-header" @click="toggleDay(index)">
          <div class="day-header-left">
            <div class="day-icon">
              <v-icon size="20" color="#0f766e">mdi-calendar-month</v-icon>
            </div>
            <div>
              <div class="day-title">{{ day.formatted_date }}</div>
              <div class="day-meta">
                {{ day.day_of_week }} · {{ day.transactions.length }} Visitors
              </div>
            </div>
          </div>

          <div class="day-header-right">
            <v-btn
              @click.stop="openDailyPreview(day.date)"
              class="export-btn"
              size="small"
              flat
              :loading="pdfLoading && selectedDate === day.date"
            >
              <v-icon start size="16">mdi-file-pdf-box</v-icon>
              Preview PDF
            </v-btn>

            <v-icon
              class="expand-icon"
              :class="{ rotated: expandedDays.includes(index) }"
              size="22"
            >
              mdi-menu-down
            </v-icon>
          </div>
        </div>

        <!-- DAY CONTENT -->
        <div v-show="expandedDays.includes(index)" class="day-content">
          <!-- PREMIUM STATS -->
          <div class="premium-stats">
            <div class="stat-card total">
              <div class="stat-icon">
                <v-icon size="20" color="#0f172a">mdi-account-group-outline</v-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ day.transactions.length }}</div>
                <div class="stat-label">Total Movements</div>
              </div>
            </div>

            <div class="stat-card checked-in">
              <div class="stat-icon">
                <v-icon size="20" color="#059669">mdi-login</v-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ checkedIn(day.transactions) }}</div>
                <div class="stat-label">Checked In</div>
              </div>
            </div>

            <div class="stat-card checked-out">
              <div class="stat-icon">
                <v-icon size="20" color="#2563eb">mdi-logout</v-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ checkedOut(day.transactions) }}</div>
                <div class="stat-label">Checked Out</div>
              </div>
            </div>
          </div>

          <!-- TABLE -->
          <div class="table-wrapper">
            <table class="records-table">
              <thead>
                <tr>
                  <th class="col-visitor">Visitor</th>
                  <th class="col-phone">Phone</th>
                  <th class="col-time text-right">Check In</th>
                  <th class="col-time text-right">Check Out</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="transaction in day.transactions" :key="transaction.id">
                  <td class="col-visitor">
                    <div class="visitor-cell">
                      <div class="avatar">
                        {{ getInitials(transaction.visitor) }}
                      </div>
                      <span class="visitor-name">
                        {{ transaction.visitor.first_name }} {{ transaction.visitor.last_name }}
                      </span>
                    </div>
                  </td>
                  <td class="col-phone">
                    {{ transaction.visitor.phone || '—' }}
                  </td>
                  <td class="col-time text-right">
                    {{ transaction.checkin_at || '—' }}
                  </td>
                  <td class="col-time text-right">
                    {{ transaction.checkout_at || '—' }}
                  </td>
                </tr>
                <tr v-if="!day.transactions.length">
                  <td colspan="4" class="empty-row">
                    No visitor records for this day.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- PDF PREVIEW DIALOG -->
    <v-dialog v-model="pdfDialog" max-width="900" persistent transition="dialog-bottom-transition">
      <v-card class="pdf-card" rounded="lg" elevation="0">
        <div class="pdf-header">
          <div class="pdf-header-left">
            <div class="pdf-badge">
              <v-icon size="20" color="white">mdi-file-document-outline</v-icon>
            </div>
            <div>
              <div class="pdf-title">Gate Pass Preview</div>
              <div class="pdf-subtitle">
                {{ selectedDate ? `Daily report · ${selectedDate}` : 'Secure document viewer' }}
              </div>
            </div>
          </div>

          <div class="pdf-header-actions">
            <v-btn
              size="small"
              class="download-btn"
              prepend-icon="mdi-download"
              :loading="downloadLoading"
              @click="downloadCurrentPdf"
            >
              Download
            </v-btn>

            <v-btn icon variant="text" class="close-btn" @click="closePdfPreview">
              <v-icon color="white">mdi-close</v-icon>
            </v-btn>
          </div>
        </div>

        <div class="pdf-body">
          <div v-if="pdfLoading" class="pdf-loading">
            <v-progress-circular indeterminate color="#1b867c" size="48" />
            <p>Loading document...</p>
          </div>
          <iframe v-else-if="pdfUrl" :src="pdfUrl" class="pdf-frame"></iframe>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
import PageBreadcrumb from '@/components/NIDC/SharedComponents/PageBreadcrumb.vue';
import swtalert from "@/mixins/swtalert";

export default {
  components: { PageBreadcrumb },
  mixins: [swtalert],

  props: {
    id: { required: true, type: [String, Number] }
  },

  data() {
    return {
      loadingDetails: true,
      selectedGatePass: {},
      dailyTransactions: [],
      expandedDays: [],
      pdfDialog: false,
      pdfUrl: null,
      pdfLoading: false,
      downloadLoading: false,
      selectedDate: null,
    };
  },

  created() {
    const gatepassId = this.$route.params.id || this.id;
    this.loadGatePassDetails(gatepassId);
  },

  beforeUnmount() {
    this.revokePdfUrl();
  },

  methods: {
    async loadGatePassDetails(id) {
      this.loadingDetails = true;
      try {
        const res = await axios.get(`/gate-passes/${id}`);
        this.selectedGatePass = res.data.data.gate_pass;
        this.dailyTransactions = res.data.data.daily_transactions || [];
        this.expandedDays = [];
      } catch (err) {
        console.error(err);
        this.showAlert("Failed to load gate pass records.", "error");
      } finally {
        this.loadingDetails = false;
      }
    },

    toggleDay(index) {
      if (this.expandedDays.includes(index)) {
        this.expandedDays = this.expandedDays.filter(i => i !== index);
      } else {
        this.expandedDays.push(index);
      }
    },

    openDailyPreview(date) {
      this.selectedDate = date;
      this.pdfLoading = true;
      this.pdfDialog = true;
      this.revokePdfUrl();

      const url = `/gate-passes/${this.selectedGatePass.id}/download-daily?date=${date}`;

      axios.get(url, { responseType: "blob" })
        .then((res) => {
          const blob = new Blob([res.data], { type: "application/pdf" });
          this.pdfUrl = URL.createObjectURL(blob);
        })
        .catch((err) => {
          this.pdfDialog = false;
          const message = err.response?.data?.message || "Failed to load PDF.";
          this.showAlert(message, "error");
        })
        .finally(() => {
          this.pdfLoading = false;
        });
    },

    downloadCurrentPdf() {
      if (!this.pdfUrl || !this.selectedDate) return;

      this.downloadLoading = true;
      const link = document.createElement("a");
      link.href = this.pdfUrl;
      link.download = `GatePass-${this.selectedDate}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      this.downloadLoading = false;
    },

    closePdfPreview() {
      this.pdfDialog = false;
      this.revokePdfUrl();
      this.selectedDate = null;
    },

    revokePdfUrl() {
      if (this.pdfUrl) {
        URL.revokeObjectURL(this.pdfUrl);
        this.pdfUrl = null;
      }
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
    }
  }
};
</script>

<style scoped>
.page-wrapper {
  max-width: 1080px;
  margin: 0 auto;
  padding: 28px 20px 80px;
}

/* ===================== HERO ===================== */
.hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #1b867c 0%, #003B73 55%, #0f172a 100%);
  border-radius: 22px;
  padding: 28px 32px;
  margin-bottom: 32px;
  color: white;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.15);
}

.hero-left {
  display: flex;
  align-items: center;
  gap: 18px;
}

.hero-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.14);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
}

.hero-title {
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 4px;
  letter-spacing: -0.5px;
}

.hero-subtitle {
  font-size: 14.5px;
  opacity: 0.85;
  margin: 0;
}

.hero-chip {
  display: flex;
  align-items: center;
  background: white;
  color: #0f172a;
  font-weight: 700;
  font-size: 13.5px;
  padding: 10px 18px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* ===================== EMPTY STATE ===================== */
.empty-state {
  text-align: center;
  padding: 100px 20px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
}

.empty-state h2 {
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
  margin: 20px 0 8px;
}

.empty-state p {
  color: #64748b;
  font-size: 15px;
}

/* ===================== DAY CARD ===================== */
.day-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(15, 23, 42, 0.04);
  transition: all 0.25s ease;
}

.day-card:hover {
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 28px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.day-header:hover {
  background: #f8fafc;
}

.day-header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.day-icon {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: #f0fdfa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.day-title {
  font-size: 17px;
  font-weight: 800;
  color: #0f172a;
}

.day-meta {
  font-size: 13.5px;
  color: #64748b;
  margin-top: 3px;
}

.day-header-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.export-btn {
  background: linear-gradient(135deg, #1b867c, #003B73) !important;
  color: white !important;
  font-weight: 700;
  text-transform: none;
  height: 38px !important;
  padding: 0 16px !important;
  border-radius: 12px !important;
  letter-spacing: 0.2px;
}

.expand-icon {
  color: #94a3b8;
  transition: transform 0.3s ease;
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

/* ===================== DAY CONTENT ===================== */
.day-content {
  padding: 8px 28px 28px;
  border-top: 1px solid #f1f5f9;
}

/* ===================== PREMIUM STATS ===================== */
.premium-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 24px 0 28px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  transition: all 0.25s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.stat-icon {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-card.total .stat-icon { background: #f1f5f9; }
.stat-card.checked-in .stat-icon { background: #ecfdf5; }
.stat-card.checked-out .stat-icon { background: #eff6ff; }

.stat-value {
  font-size: 24px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.6px;
}

.stat-card.total .stat-value { color: #0f172a; }
.stat-card.checked-in .stat-value { color: #059669; }
.stat-card.checked-out .stat-value { color: #2563eb; }

.stat-label {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  margin-top: 4px;
}

/* ===================== TABLE ===================== */
.table-wrapper {
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: white;
}

.records-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.records-table thead {
  background: linear-gradient(135deg, #1b867c, #003B73, #0f172a);
}

.records-table th {
  padding: 16px 24px;
  font-size: 12.5px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  text-align: left;
  letter-spacing: 0.4px;
  white-space: nowrap;
}

.records-table th.text-right,
.records-table td.text-right {
  text-align: right !important;
}

.records-table td {
  padding: 16px 24px;
  font-size: 14.5px;
  color: #334155;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.records-table tbody tr:last-child td {
  border-bottom: none;
}

.records-table tbody tr:hover {
  background: #f8fafc;
}

.col-visitor { width: 36%; }
.col-phone { width: 22%; }
.col-time { width: 21%; font-variant-numeric: tabular-nums; }

.visitor-cell {
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #1b867c, #003B73);
  color: white;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.visitor-name {
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty-row {
  text-align: center;
  color: #94a3b8;
  padding: 40px 20px !important;
}

/* ===================== PDF DIALOG ===================== */
.pdf-card {
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 20px !important;
}

.pdf-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 28px;
  background: linear-gradient(135deg, #1b867c, #003B73, #0f172a);
  color: white;
}

.pdf-header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.pdf-badge {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ef4444, #b91c1c);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pdf-title {
  font-size: 17px;
  font-weight: 800;
}

.pdf-subtitle {
  font-size: 13.5px;
  opacity: 0.85;
  margin-top: 3px;
}

.download-btn {
  background: rgba(255, 255, 255, 0.18) !important;
  color: white !important;
  font-weight: 700;
  text-transform: none;
  border-radius: 12px !important;
}

.close-btn {
  color: white !important;
}

.pdf-body {
  height: 72vh;
  background: #f1f5f9;
  position: relative;
}

.pdf-frame {
  width: 100%;
  height: 100%;
  border: none;
}

.pdf-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  color: #64748b;
  font-size: 15px;
}

/* ===================== RESPONSIVE ===================== */
@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;
    padding: 24px;
  }

  .premium-stats {
    grid-template-columns: 1fr;
  }

  .day-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 18px 20px;
  }

  .day-header-right {
    width: 100%;
    justify-content: space-between;
  }

  .day-content {
    padding: 8px 20px 24px;
  }
}
</style>