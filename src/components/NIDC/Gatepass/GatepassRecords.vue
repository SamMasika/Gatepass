<template>
  <v-container fluid class="page-wrapper">
    <PageBreadcrumb title="Gate Pass Records" parent="Gate Passes" parentRoute="/gate-pass" />

    <!-- HERO -->
    <div class="hero">
      <div class="hero-content">
        <div class="hero-icon">
          <v-icon size="26" color="white">mdi-timeline-clock-outline</v-icon>
        </div>
        <div class="hero-text">
          <h1 class="hero-title">Visitor Movement Timeline</h1>
          <p class="hero-subtitle">Complete history of gate activity</p>
        </div>
      </div>

      <div class="hero-chip">
        <v-icon size="16" class="mr-2">mdi-calendar-range</v-icon>
        {{ dailyTransactions.length }} Active Day{{ dailyTransactions.length !== 1 ? 's' : '' }}
      </div>
    </div>

    <!-- EMPTY STATE -->
    <div v-if="!loadingDetails && dailyTransactions.length === 0" class="empty-state">
      <div class="empty-icon">
        <v-icon size="56">mdi-timeline-outline</v-icon>
      </div>
      <h2>No Activity Recorded</h2>
      <p>Visitor movement records will appear here once activity starts.</p>
    </div>

    <!-- PREMIUM TIMELINE -->
    <div v-else class="timeline">
      <div
        v-for="(day, index) in dailyTransactions"
        :key="day.date"
        class="timeline-item"
        :class="{ expanded: expandedDays.includes(index) }"
      >
        <!-- TIMELINE RAIL -->
        <div class="timeline-rail">
          <div class="timeline-dot"></div>
          <div class="timeline-line" v-if="index < dailyTransactions.length - 1"></div>
        </div>

        <!-- DAY CARD -->
        <div class="timeline-card">
          <!-- HEADER -->
          <div class="timeline-header" @click="toggleDay(index)">
            <div class="timeline-header-left">
              <div class="timeline-date-badge">
                <div class="date-day">{{ getDayNumber(day.formatted_date) }}</div>
                <div class="date-month">{{ getMonthName(day.formatted_date) }}</div>
              </div>
              <div class="timeline-info">
                <div class="timeline-title">{{ day.formatted_date }}</div>
                <div class="timeline-meta">
                  {{ day.day_of_week }} · {{ day.transactions.length }} Visitor{{ day.transactions.length !== 1 ? 's' : '' }}
                </div>
              </div>
            </div>

            <div class="timeline-header-right">
              <v-btn
                @click.stop="openDailyPreview(day.date)"
                class="export-btn"
                size="small"
                variant="flat"
                :loading="pdfLoading && selectedDate === day.date"
              >
                <v-icon start size="15">mdi-file-pdf-box</v-icon>
                Preview
              </v-btn>

              <v-icon
                class="expand-icon"
                :class="{ rotated: expandedDays.includes(index) }"
                size="22"
              >
                mdi-chevron-down
              </v-icon>
            </div>
          </div>

          <!-- CONTENT -->
          <v-expand-transition>
            <div v-show="expandedDays.includes(index)" class="timeline-content">
              <!-- STATS -->
              <div class="premium-stats">
                <div class="stat-card total">
                  <div class="stat-icon">
                    <v-icon size="18">mdi-account-group-outline</v-icon>
                  </div>
                  <div class="stat-info">
                    <div class="stat-value">{{ day.transactions.length }}</div>
                    <div class="stat-label">Total Movements</div>
                  </div>
                </div>

                <div class="stat-card checked-in">
                  <div class="stat-icon">
                    <v-icon size="18">mdi-login</v-icon>
                  </div>
                  <div class="stat-info">
                    <div class="stat-value">{{ checkedIn(day.transactions) }}</div>
                    <div class="stat-label">Checked In</div>
                  </div>
                </div>

                <div class="stat-card checked-out">
                  <div class="stat-icon">
                    <v-icon size="18">mdi-logout</v-icon>
                  </div>
                  <div class="stat-info">
                    <div class="stat-value">{{ checkedOut(day.transactions) }}</div>
                    <div class="stat-label">Checked Out</div>
                  </div>
                </div>
              </div>

              <!-- VISITOR TIMELINE -->
              <div class="visitor-timeline">
                <div
                  v-for="transaction in day.transactions"
                  :key="transaction.id"
                  class="visitor-entry"
                >
                  <div class="visitor-entry-left">
                    <div class="avatar">
                      {{ getInitials(transaction.visitor) }}
                    </div>
                    <div class="visitor-details">
                      <div class="visitor-name">
                        {{ transaction.visitor.first_name }} {{ transaction.visitor.last_name }}
                      </div>
                      <div class="visitor-phone">
                        {{ transaction.visitor.phone || 'No phone' }}
                      </div>
                    </div>
                  </div>

                  <div class="visitor-times">
                    <div class="time-block checkin">
                      <v-icon size="14" color="var(--success)">mdi-login</v-icon>
                      <span>{{ transaction.checkin_at || '—' }}</span>
                    </div>
                    <div class="time-block checkout">
                      <v-icon size="14" color="var(--blue)">mdi-logout</v-icon>
                      <span>{{ transaction.checkout_at || '—' }}</span>
                    </div>
                  </div>
                </div>

                <div v-if="!day.transactions.length" class="empty-visitors">
                  No visitor records for this day.
                </div>
              </div>
            </div>
          </v-expand-transition>
        </div>
      </div>
    </div>

    <!-- PDF PREVIEW DIALOG -->
    <v-dialog v-model="pdfDialog" max-width="920" persistent transition="dialog-bottom-transition">
      <v-card class="pdf-card" rounded="xl" elevation="0">
        <div class="pdf-header">
          <div class="pdf-header-left">
            <div class="pdf-badge">
              <v-icon size="18" color="white">mdi-file-document-outline</v-icon>
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
              <v-icon color="white" size="20">mdi-close</v-icon>
            </v-btn>
          </div>
        </div>

        <div class="pdf-body">
          <div v-if="pdfLoading" class="pdf-loading">
            <v-progress-circular indeterminate color="var(--brand)" size="44" width="3" />
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

    getDayNumber(formattedDate) {
      if (!formattedDate) return "—";
      const match = formattedDate.match(/\d+/);
      return match ? match[0] : "—";
    },

    getMonthName(formattedDate) {
      if (!formattedDate) return "";
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const date = new Date(formattedDate);
      if (!isNaN(date)) return months[date.getMonth()];
      return "";
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
  max-width: 1120px;
  margin: 0 auto;
  padding: 24px 20px 100px;
  background: var(--bg);
  min-height: 100vh;
  color: var(--text);
}

/* HERO */
.hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 50%, #003B73 100%);
  border-radius: 20px;
  padding: 28px 32px;
  margin-bottom: 36px;
  color: white;
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: -40%;
  right: -20%;
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
  pointer-events: none;
}

.hero-content {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 1;
}

.hero-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.hero-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 4px;
  letter-spacing: -0.4px;
}

.hero-subtitle {
  font-size: 14px;
  opacity: 0.88;
  margin: 0;
  font-weight: 400;
}

.hero-chip {
  display: flex;
  align-items: center;
  background: var(--surface-alt);
  color: var(--text);
  font-weight: 600;
  font-size: 13px;
  padding: 8px 16px;
  border-radius: 10px;
  box-shadow: var(--shadow-sm);
  position: relative;
  z-index: 1;
}

/* EMPTY STATE */
.empty-state {
  text-align: center;
  padding: 80px 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  border-radius: 20px;
  background: var(--surface-alt);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.empty-state h2 {
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 8px;
  letter-spacing: -0.3px;
}

.empty-state p {
  color: var(--text-muted);
  font-size: 14.5px;
  margin: 0;
}

/* TIMELINE */
.timeline {
  position: relative;
  padding-left: 28px;
}

.timeline-item {
  position: relative;
  margin-bottom: 20px;
}

.timeline-rail {
  position: absolute;
  left: -28px;
  top: 28px;
  bottom: -20px;
  width: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--brand);
  border: 3px solid var(--surface);
  box-shadow: 0 0 0 4px rgba(27, 134, 124, 0.15);
  z-index: 2;
  flex-shrink: 0;
}

.timeline-line {
  flex: 1;
  width: 2px;
  background: linear-gradient(to bottom, var(--brand), transparent);
  margin-top: 6px;
}

.timeline-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all 0.25s ease;
}

.timeline-item.expanded .timeline-card {
  box-shadow: var(--shadow-md);
  border-color: var(--brand);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 22px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.timeline-header:hover {
  background: var(--surface-alt);
}

.timeline-header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.timeline-date-badge {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--brand), var(--brand-dark));
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(27, 134, 124, 0.25);
}

.date-day {
  font-size: 20px;
  font-weight: 800;
  line-height: 1;
}

.date-month {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.5px;
  opacity: 0.9;
  margin-top: 2px;
}

.timeline-title {
  font-size: 16.5px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.2px;
}

.timeline-meta {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 3px;
}

.timeline-header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.export-btn {
  background: linear-gradient(135deg, var(--brand), var(--brand-dark)) !important;
  color: white !important;
  font-weight: 600;
  text-transform: none;
  height: 34px !important;
  padding: 0 12px !important;
  border-radius: 9px !important;
  font-size: 12.5px !important;
}

.expand-icon {
  color: var(--text-muted);
  transition: transform 0.25s ease;
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

/* CONTENT */
.timeline-content {
  padding: 8px 22px 22px;
  border-top: 1px solid var(--border-light);
  background: var(--surface-alt);
}

/* STATS */
.premium-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 16px 0 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.stat-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--surface-alt);
  color: var(--text);
}

.stat-card.checked-in .stat-icon {
  background: var(--success-light);
  color: var(--success);
}

.stat-card.checked-out .stat-icon {
  background: var(--blue-light);
  color: var(--blue);
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
  color: var(--text);
}

.stat-card.checked-in .stat-value { color: var(--success); }
.stat-card.checked-out .stat-value { color: var(--blue); }

.stat-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  margin-top: 2px;
}

/* VISITOR ENTRIES */
.visitor-timeline {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.visitor-entry {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  transition: all 0.2s ease;
}

.visitor-entry:hover {
  border-color: var(--brand);
  box-shadow: var(--shadow-sm);
}

.visitor-entry-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--brand), var(--brand-dark));
  color: white;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.visitor-name {
  font-weight: 600;
  font-size: 14px;
  color: var(--text);
}

.visitor-phone {
  font-size: 12.5px;
  color: var(--text-muted);
  margin-top: 2px;
}

.visitor-times {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-end;
}

.time-block {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

.time-block.checkin { color: var(--success); }
.time-block.checkout { color: var(--blue); }

.empty-visitors {
  text-align: center;
  color: var(--text-muted);
  padding: 28px;
  font-size: 14px;
}

/* PDF DIALOG */
.pdf-card {
  overflow: hidden;
  border: 1px solid var(--border);
  background: var(--surface);
}

.pdf-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  background: linear-gradient(135deg, var(--brand), var(--brand-dark));
  color: white;
}

.pdf-header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.pdf-badge {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pdf-title {
  font-size: 16px;
  font-weight: 700;
}

.pdf-subtitle {
  font-size: 13px;
  opacity: 0.85;
  margin-top: 2px;
}

.download-btn {
  background: rgba(255, 255, 255, 0.16) !important;
  color: white !important;
  font-weight: 600;
  text-transform: none;
  border-radius: 10px !important;
  font-size: 13px !important;
}

.close-btn {
  color: white !important;
}

.pdf-body {
  height: 70vh;
  background: var(--bg);
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
  gap: 16px;
  color: var(--text-muted);
  font-size: 14px;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .page-wrapper {
    padding: 16px 16px 80px;
  }

  .hero {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 22px 20px;
  }

  .timeline {
    padding-left: 20px;
  }

  .timeline-rail {
    left: -20px;
  }

  .premium-stats {
    grid-template-columns: 1fr;
  }

  .timeline-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }

  .timeline-header-right {
    width: 100%;
    justify-content: space-between;
  }

  .visitor-entry {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .visitor-times {
    align-items: flex-start;
    width: 100%;
  }
}
</style>