<template>
  <div class="premium-table-container">
    <!-- TOOLBAR -->
    <div class="table-toolbar">
      <div>
        <h2 class="toolbar-title">{{ title }}</h2>
        <p class="toolbar-subtitle">{{ subtitle }}</p>
      </div>

      <div class="toolbar-actions">
        <v-text-field
          v-model="search"
          placeholder="Search records..."
          prepend-inner-icon="mdi-magnify"
          variant="solo"
          flat
          density="comfortable"
          hide-details
          class="search-field"
          @input="onSearchChange"
        />
      </div>
    </div>

    <!-- TABLE -->
    <div class="table-wrapper">
      <v-data-table-server
        :headers="headers"
        :items="items"
        :items-length="totalItems"
        :loading="loading"
        :items-per-page="itemsPerPage"
        :page="currentPage"
        item-value="id"
        class="premium-table"
        hide-default-footer
      >
        <!-- HEADERS -->
        <template #headers="{ columns }">
          <tr class="custom-head">
            <th v-for="column in columns" :key="column.key">
              {{ column.title }}
            </th>
          </tr>
        </template>

        <!-- ROWS -->
        <template #item="{ item }">
          <tr class="premium-row">
            <td
              v-for="column in headers"
              :key="column.value"
              class="premium-cell"
            >
              <!-- IMAGE -->
              <template v-if="column.value === 'filePath'">
                <div class="avatar-wrapper">
                  <template v-if="getImageUrl(getNestedValue(item, column.value))">
                    <v-avatar size="46" class="premium-avatar">
                      <img :src="getImageUrl(getNestedValue(item, column.value))" alt="" />
                    </v-avatar>
                  </template>
                  <template v-else>
                    <v-avatar size="46" class="premium-avatar placeholder-avatar">
                      <v-icon size="22">mdi-account</v-icon>
                    </v-avatar>
                  </template>
                </div>
              </template>

              <!-- STATUS -->
              <template
                v-else-if="
                  column.value === 'status' ||
                  column.value?.toLowerCase().includes('operation_status') ||
                  column.value?.toLowerCase().includes('workflow_status') ||
                  column.value === 'operation_status' ||
                  column.value === 'workflow_status'
                "
              >
                <v-chip
                  class="status-chip"
                  :class="`status-${getStatusColor(getNestedValue(item, column.value)).color}`"
                >
                  {{ getStatusColor(getNestedValue(item, column.value)).text }}
                </v-chip>
              </template>

              <!-- MULTI DAY -->
              <template v-else-if="column.value === 'is_multi_day'">
                <v-chip
                  class="status-chip"
                  :class="getNestedValue(item, column.value) === true || getNestedValue(item, column.value) === '1' ? 'status-blue' : 'status-grey'"
                >
                  {{ getNestedValue(item, column.value) === true || getNestedValue(item, column.value) === '1' ? 'Multi-day' : 'Single-day' }}
                </v-chip>
              </template>

              <!-- CURRENT GATE -->
              <template v-else-if="column.value === 'current_gate'">
                <span v-if="!getNestedValue(item, column.value)">
                  <i class="mdi mdi-gate"> Not Assigned</i>
                </span>
                <v-chip
                  v-else
                  class="status-chip"
                  :class="`status-${getStatusColor(getNestedValue(item, column.value)).color}`"
                >
                  {{ getStatusColor(getNestedValue(item, column.value)).text }}
                </v-chip>
              </template>

              <!-- DATE -->
              <template
                v-else-if="
                  column.format === 'date' ||
                  column.value?.toLowerCase().includes('date') ||
                  column.value?.toLowerCase().includes('created_at') ||
                  column.value?.toLowerCase().includes('updated_at') ||
                  column.value?.toLowerCase().includes('valid_from') ||
                  column.value?.toLowerCase().includes('valid_to')
                "
              >
                <div class="cell-text">
                  {{ formatDate(getNestedValue(item, column.value)) }}
                </div>
              </template>

              <!-- TIME -->
              <template
                v-else-if="
                  column.format === 'time' ||
                  column.value?.toLowerCase().includes('time') ||
                  column.value?.toLowerCase().includes('time_in') ||
                  column.value?.toLowerCase().includes('time_out')
                "
              >
                <div class="cell-text">
                  {{ formatTime(getNestedValue(item, column.value)) }}
                </div>
              </template>

              <!-- ACTIONS -->
              <template v-else-if="column.value === 'actions'">
                <div class="actions-wrapper">
                  <slot name="actions" :item="item" />
                </div>
              </template>

              <!-- MONEY -->
              <template
                v-else-if="
                  column.format &&
                  ['price', 'amount'].some(term => column.value?.toLowerCase().includes(term))
                "
              >
                <div class="money-box">
                  <v-icon size="15">mdi-currency-tzs</v-icon>
                  {{ formatPrice(getNestedValue(item, column.value)) }}
                </div>
              </template>

              <!-- DEFAULT -->
              <template v-else>
                <div class="cell-text">
                  {{ getNestedValue(item, column.value) }}
                </div>
              </template>
            </td>
          </tr>
        </template>

        <!-- LOADING -->
        <template #loading>
          <div class="loading-wrapper">
            <v-progress-circular indeterminate size="48" width="4" color="teal" />
            <p>Fetching records...</p>
          </div>
        </template>

        <!-- EMPTY -->
        <template #no-data>
          <div class="empty-state">
            <div class="empty-icon">
              <v-icon size="72">mdi-database-search-outline</v-icon>
            </div>
            <h3>No Records Found</h3>
            <p>No matching records available.</p>
          </div>
        </template>
      </v-data-table-server>
    </div>

    <!-- FOOTER -->
    <div class="table-footer" v-if="totalItems > 0">
      <div class="footer-info">
        Showing <strong>{{ startItem }}</strong> to <strong>{{ endItem }}</strong> of
        <strong>{{ totalItems }}</strong> entries
      </div>

      <div class="pagination-wrapper" v-if="totalPages > 1">
        <button
          class="nav-btn"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          <v-icon size="18">mdi-chevron-left</v-icon>
        </button>

        <button
          v-for="page in visiblePages"
          :key="page"
          class="page-btn"
          :class="{ active: currentPage === page }"
          @click="changePage(page)"
        >
          {{ page }}
        </button>

        <button
          class="nav-btn"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          <v-icon size="18">mdi-chevron-right</v-icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import _ from "lodash";

export default {
  name: "SharedDataTable",

  props: {
    apiUrl: { type: String, required: true },
    headers: { type: Array, required: true },
    title: { type: String, default: "Data Table" },
    subtitle: { type: String, default: "Premium records management" },
  },

  data() {
    return {
      items: [],
      loading: false,
      search: "",
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 1,
    };
  },

  computed: {
    startItem() {
      return this.totalItems ? (this.currentPage - 1) * this.itemsPerPage + 1 : 0;
    },

    endItem() {
      return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    },

    visiblePages() {
      const pages = [];
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
      return pages;
    },
  },

  methods: {
    async fetchData() {
      try {
        this.loading = true;
        const response = await axios.get(this.apiUrl, {
          params: {
            page: this.currentPage,
            per_page: this.itemsPerPage,
            search: this.search,
          },
        });

        const responseData = response.data.data;
        this.items = responseData.data || [];
        this.totalItems = responseData.total || 0;
        this.currentPage = responseData.current_page || 1;
        this.totalPages = responseData.last_page || 1;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      this.fetchData();
    },

    onSearchChange: _.debounce(function () {
      this.currentPage = 1;
      this.fetchData();
    }, 500),

    formatPrice(price) {
      if (!price) return "0";
      return parseInt(price).toLocaleString();
    },

    formatDate(date) {
      if (!date) return "";
      const d = new Date(date);
      if (isNaN(d.getTime())) return date;
      return d.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    },

    formatTime(time) {
      if (!time) return "";
      if (typeof time === "string") {
        const parts = time.split(":");
        if (parts.length >= 2) {
          return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
        }
      }
      return time;
    },

    getNestedValue(item, field) {
      return field.split(".").reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : ""), item);
    },

    getImageUrl(path) {
      if (!path) return null;
      return this.$getImageUrl(path);
    },

    getStatusColor(status) {
      const val = String(status).toUpperCase();
      const statuses = {
        ACTIVE: { text: "Active", color: "green" },
        1: { text: "Active", color: "green" },
        INACTIVE: { text: "Inactive", color: "red" },
        0: { text: "Inactive", color: "red" },
        SUSPENDED: { text: "Suspended", color: "orange" },
        PENDING: { text: "Pending", color: "orange" },
        COMPLETED: { text: "Completed", color: "blue" },
        EXPIRED: { text: "Expired", color: "red" },
        PENDING_SUBMISSION: { text: "Pending Submission", color: "yellow" },
        IN_REVIEW: { text: "In Review", color: "blue" },
        FINAL_REVIEW: { text: "Final Review", color: "deep-purple" },
        PARTIALLY_APPROVED: { text: "Partially Approved", color: "purple" },
        PARTIALLY_CHECKED_OUT: { text: "Partially Checked Out", color: "yellow" },
        PARTIALLY_CHECKED_IN: { text: "Partially Checked In", color: "green" },
        PARTIALLY_EXITED: { text: "Partially Exited", color: "orange" },
        CHECKED_IN: { text: "Checked In", color: "green" },
        CHECKED_OUT: { text: "Checked Out At Gate 2", color: "red" },
        APPROVED: { text: "Approved", color: "green" },
        REJECTED: { text: "Rejected", color: "red" },
        CLEARED: { text: "Cleared", color: "orange" },
        CLOSED: { text: "Closed", color: "closed" },
        GATE_1: { text: "GATE 1", color: "light-blue" },
        INSIDE: { text: "INSIDE", color: "green" },
        GATE_2: { text: "GATE 2", color: "orange" },
      };
      return statuses[val] || { text: status, color: "grey" };
    },
  },

  watch: {
    itemsPerPage() {
      this.currentPage = 1;
      this.fetchData();
    },
  },

  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
.premium-table-container {
  background: var(--surface);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.toolbar-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.toolbar-subtitle {
  margin-top: 4px;
  color: var(--text-muted);
  font-size: 14px;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.search-field {
  width: 320px;
}

.search-field :deep(.v-field) {
  border-radius: 12px;
  background: var(--surface-alt);
  box-shadow: none !important;
  border: 1px solid var(--border-light);
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 14px;
  border: 1px solid var(--border);
}

.premium-table {
  background: transparent !important;
}

.custom-head {
  background: linear-gradient(135deg, var(--brand), var(--brand-dark));
}

.custom-head th {
  color: var(--white) !important;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.3px;
  padding: 16px 18px !important;
  border: none !important;
  text-transform: uppercase;
}

.premium-row {
  transition: background 0.2s ease;
}

.premium-row:hover {
  background: var(--surface-alt);
}

.premium-cell {
  padding: 16px 18px !important;
  border-bottom: 1px solid var(--border-light);
  font-size: 14px;
  color: var(--text-secondary);
}

.avatar-wrapper {
  display: flex;
  align-items: center;
}

.premium-avatar {
  border: 2px solid var(--border-light);
}

.placeholder-avatar {
  background: linear-gradient(135deg, var(--brand), var(--brand-dark));
  color: white;
}

.status-chip {
  border-radius: 10px !important;
  font-weight: 600;
  font-size: 12px;
  height: 28px;
}

.status-yellow { background: var(--warning-light) !important; color: var(--orange) !important; }
.status-green { background: var(--success-light) !important; color: var(--success) !important; }
.status-red { background: var(--error-light) !important; color: var(--red) !important; }
.status-orange { background: var(--warning-light) !important; color: var(--orange) !important; }
.status-blue { background: var(--blue-light) !important; color: var(--blue) !important; }
.status-grey { background: var(--surface-alt) !important; color: var(--text-muted) !important; }
.status-deep-purple { background: var(--deep-purple-light) !important; color: var(--deep-purple) !important; }
.status-light-blue { background: var(--light-blue-light) !important; color: #0891b2 !important; }
.status-closed { background: rgba(146, 64, 14, 0.12) !important; color: #92400e !important; }

.money-box {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--success);
  font-weight: 600;
}

.actions-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.loading-wrapper {
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: var(--text-muted);
}

.empty-state {
  padding: 70px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.empty-icon {
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-state h3 {
  color: var(--text);
  margin: 0 0 6px;
  font-weight: 600;
}

.table-footer {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.footer-info {
  color: var(--text-muted);
  font-size: 14px;
}

.footer-info strong {
  color: var(--text);
}

.pagination-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
}

.page-btn,
.nav-btn {
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 10px;
  background: var(--surface-alt);
  color: var(--text-secondary);
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid var(--border-light);
}

.page-btn:hover,
.nav-btn:hover {
  background: var(--surface);
  border-color: var(--border);
}

.page-btn.active {
  background: linear-gradient(135deg, var(--brand), var(--brand-dark));
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(27, 134, 124, 0.25);
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .table-toolbar,
  .table-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .toolbar-actions {
    width: 100%;
  }

  .search-field {
    width: 100%;
  }
}
</style>