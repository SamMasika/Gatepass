<template>
  <div class="gp">
    <PageBreadcrumb title="Create Passes" />

    <!-- HEADER -->
    <header class="header">
      <div>
        <h1 class="header-title">Create Gate Pass</h1>
        <p class="header-sub">Issue a new visitor access pass</p>
      </div>
    </header>

    <!-- MODE SWITCH -->
    <div class="mode">
      <button :class="{ active: mode === 'SINGLE' }" @click="switchMode('SINGLE')">
        <v-icon size="16">mdi-account</v-icon>
        Single Visitor
      </button>
      <button :class="{ active: mode === 'GROUP' }" @click="switchMode('GROUP')">
        <v-icon size="16">mdi-account-group</v-icon>
        Group Access
      </button>
    </div>

    <!-- GRID -->
    <main class="grid">
      <!-- FORM PANEL -->
      <section class="card">
        <div class="card-header">
          <h3 class="card-title">Visitor Information</h3>
          <p class="premium-sub">
            Fields marked <span class="req">*</span> are required
          </p>
        </div>

        <!-- ================= SINGLE ================= -->
        <div v-if="mode === 'SINGLE'" class="form">
          <div class="field">
            <label>First Name <span class="req">*</span></label>
            <input v-model="form.first_name" placeholder="Enter first name" />
          </div>
          <div class="field">
            <label>Middle Name</label>
            <input v-model="form.middle_name" placeholder="Enter middle name (optional)" />
          </div>
          <div class="field">
            <label>Last Name <span class="req">*</span></label>
            <input v-model="form.last_name" placeholder="Enter last name" />
          </div>
          <div class="field">
            <label>Phone</label>
            <input v-model="form.visitor_phone" placeholder="e.g. +255 7XX XXX XXX" />
          </div>
          <div class="field">
            <label>Email</label>
            <input v-model="form.visitor_email" placeholder="e.g. example@mail.com" />
          </div>
          <div class="field">
            <label>ID Number</label>
            <input v-model="form.id_number" placeholder="National ID / Passport No." />
          </div>
        </div>

        <!-- ================= GROUP ================= -->
        <div v-if="mode === 'GROUP'" class="upload">
          <div class="upload-icon-wrap">
            <v-icon size="42">mdi-cloud-upload-outline</v-icon>
          </div>
          <h3 class="upload-title">Upload Visitor Excel File</h3>
          <p class="upload-desc">
            Required columns:
            <span class="col-tag">first_name</span>
            <span class="col-tag">last_name</span>
            <span class="col-tag">phone</span>
            <span class="col-tag">id_number</span>
          </p>

          <button type="button" class="btn-sample" @click="downloadSampleExcel">
            <v-icon size="18">mdi-file-excel</v-icon>
            <span>Download Sample Template</span>
            <v-icon size="16" class="arrow">mdi-download</v-icon>
          </button>

          <div class="or-divider"><span>or</span></div>

          <label class="file-drop">
            <input type="file" accept=".xlsx,.xls" @change="handleFile" hidden />
            <v-icon size="20">mdi-paperclip</v-icon>
            <span>Choose Excel file</span>
          </label>

          <div v-if="visitors.length" class="preview-list">
            <h4>Preview ({{ visitors.length }} visitors)</h4>
            <div v-for="(v, i) in visitors" :key="i" class="row">
              <span>{{ i + 1 }}</span>
              <strong>{{ v.first_name }} {{ v.last_name }}</strong>
              <small>{{ v.phone }}</small>
            </div>
          </div>
        </div>

        <!-- ================= VISIT DETAILS ================= -->
        <div class="section-divider"></div>
        <h3 class="section-title">Visit Details</h3>

        <div class="form mt">
          <div class="field">
            <label>Contact Person</label>
            <input type="text" v-model="form.contact_person" placeholder="Enter contact person name" />
          </div>
          <div class="field">
            <label>Mobile Number</label>
            <input type="text" v-model="form.contact_mobile" placeholder="e.g. +255 7XX XXX XXX" />
          </div>
          <div class="field">
            <label>Purpose of Visit</label>
            <PaginatedDropdown
              api-endpoint="/visit-purposes"
              placeholder="Select visit purpose"
              item-title="name"
              v-model="form.visit_purpose_id"
            />
          </div>
          <div class="field">
            <label>Institution / Company</label>
            <PaginatedDropdownCompany
              api-endpoint="/companies"
              placeholder="Select institution/company"
              item-title="name"
              v-model="form.company_id"
            />
          </div>
        </div>

        <div class="field mt-4">
          <div class="toggle-visible">
            <div class="text">
              <div class="title">Multi-day Visit</div>
              <div class="desc">Enable if visitor stays for more than one day</div>
            </div>
            <label class="switch-strong">
              <input type="checkbox" v-model="form.is_multi_day" />
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <div class="form mt">
          <div class="field">
            <label>Valid From <span class="req">*</span></label>
            <input type="date" v-model="form.valid_from" :min="today" />
          </div>
          <div class="field" v-if="form.is_multi_day">
            <label>Valid To <span class="req">*</span></label>
            <input type="date" v-model="form.valid_to" :min="form.valid_from" :max="maxValidTo" />
          </div>
          <div class="field">
            <label>Time In</label>
            <input type="time" v-model="form.time_in" />
          </div>
          <div class="field">
            <label>Time Out</label>
            <input type="time" v-model="form.time_out" :min="form.time_in || timeInMin" />
          </div>
          <div class="field">
            <label>Flow <span class="req">*</span></label>
            <input v-model="form.flow" />
          </div>
        </div>

        <!-- Access Areas -->
        <div class="section-divider"></div>
        <div class="field full-width access-section">
          <label class="section-label">
            Authorized Access Areas <span class="req">*</span>
          </label>
          <div class="access-grid">
            <label class="access-item" v-for="area in accessAreas" :key="area.id">
              <input type="checkbox" :value="area.id" v-model="form.authorized_areas" />
              <span class="check-ui"></span>
              <span class="label-text">{{ area.name }}</span>
            </label>
          </div>
        </div>

        <!-- SUBMIT -->
        <button class="btn-primary" @click="submitGatePass">
          <v-icon size="18" class="mr-2">mdi-check-circle-outline</v-icon>
          Submit Gate Pass
        </button>
      </section>

      <!-- STATUS PANEL -->
      <section v-if="savedPass" class="card status-card">
        <h3 class="card-title">Live Status</h3>
        <div class="badge">{{ savedPass.pass_number }}</div>
        <div class="info">
          <p><b>Mode:</b> {{ mode.toUpperCase() }}</p>
          <p v-if="mode === 'SINGLE'">
            <b>Name:</b> {{ savedPass.first_name }} {{ savedPass.last_name }}
          </p>
          <p v-else><b>Visitors:</b> {{ visitors.length }}</p>
          <p><b>Status:</b> {{ savedPass.workflow_status }}</p>
          <p><b>Flow:</b> {{ savedPass.flow }}</p>
        </div>
        <div class="hint">Awaiting Gate 1 / Gate 2 approval</div>
      </section>
    </main>
  </div>
</template>

<script>
import * as XLSX from "xlsx";
import axios from "axios";
import PageBreadcrumb from '@/components/NIDC/SharedComponents/PageBreadcrumb.vue';
import PaginatedDropdown from '@/components/NIDC/SharedComponents/paginatedDropdown.vue';
import swtalert from "@/mixins/swtalert";
import PaginatedDropdownCompany from "../SharedComponents/paginatedDropdownCompany.vue";

export default {
  components: {
    PageBreadcrumb,
    PaginatedDropdown,
    PaginatedDropdownCompany
  },
  mixins: [swtalert],
  data() {
    return {
      mode: "SINGLE",
      now: "",
      savedPass: null,
      accessAreas: [],
      visitors: [],
      form: {
        first_name: "",
        middle_name: "",
        last_name: "",
        visitor_phone: "",
        visitor_email: "",
        id_number: "",
        visit_purpose_id: "",
        company_id: "",
        valid_from: "",
        valid_to: "",
        time_in: "",
        time_out: "",
        flow: "ENTRY",
        is_multi_day: false,
        authorized_areas: [],
        contact_person: "",
        contact_mobile: "",
      }
    };
  },
  mounted() {
    setInterval(() => {
      this.now = new Date().toLocaleString();
    }, 1000);
    this.getAccessAreas();
  },
  watch: {
    'form.valid_from'(val) {
      if (!this.form.is_multi_day) {
        this.form.valid_to = val;
      }
    },
    'form.is_multi_day'(val) {
      if (!val) {
        this.form.valid_to = this.form.valid_from;
      }
    }
  },
  computed: {
    today() {
      return new Date().toISOString().split('T')[0];
    },
    currentTime() {
      const now = new Date();
      return now.toTimeString().slice(0, 5);
    },
    timeInMin() {
      return this.form.valid_from === this.today ? this.currentTime : '00:00';
    },
    maxValidTo() {
      if (!this.form.valid_from) return null;
      const date = new Date(this.form.valid_from);
      date.setDate(date.getDate() + 30);
      return date.toISOString().split('T')[0];
    }
  },
  methods: {
    switchMode(mode) {
      this.mode = mode;
      this.savedPass = null;
      this.visitors = [];
    },
    getAccessAreas() {
      axios.get('/access-areas')
        .then(response => {
          this.accessAreas = response.data.data.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    downloadSampleExcel() {
      const sampleData = [
        { first_name: "John", last_name: "Doe", phone: "+255712345678", id_number: "1990010112345678" },
        { first_name: "Jane", last_name: "Smith", phone: "+255798765432", id_number: "A1234567" },
        { first_name: "Michael", last_name: "Johnson", phone: "+255755512345", id_number: "P9876543" }
      ];
      const worksheet = XLSX.utils.json_to_sheet(sampleData);
      worksheet['!cols'] = [{ wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 20 }];
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Visitors");
      XLSX.writeFile(workbook, "group_visitors_sample.xlsx");
    },
    handleFile(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        this.visitors = XLSX.utils.sheet_to_json(sheet);
      };
      reader.readAsArrayBuffer(file);
    },
    submitGatePass() {
      const type = this.mode.toUpperCase();
      let payload = {
        type,
        company_id: this.form.company_id,
        is_multi_day: this.form.is_multi_day,
        visit_purpose_id: this.form.visit_purpose_id,
        flow: this.form.flow,
        valid_from: this.form.valid_from,
        valid_to: this.form.valid_to,
        time_in: this.form.time_in,
        time_out: this.form.time_out,
        contact_person: this.form.contact_person,
        contact_mobile: this.form.contact_mobile,
        authorized_areas: this.form.authorized_areas || [],
      };

      if (type === "SINGLE") {
        Object.assign(payload, {
          first_name: this.form.first_name,
          middle_name: this.form.middle_name,
          last_name: this.form.last_name,
          visitor_phone: this.form.visitor_phone,
          visitor_email: this.form.visitor_email,
          id_number: this.form.id_number,
        });
      }

      if (type === "GROUP") {
        payload.visitors = this.visitors;
      }

      axios.post('/gate-passes', payload)
        .then(res => {
          this.showAlert(res.data.message, 'success');
          this.$router.push('/gate-pass');
        })
        .catch(err => {
          const message = err.response?.data?.message || 'Error occurred';
          this.showAlert(message, 'error');
        });
    }
  }
};
</script>

<style scoped>
.gp {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 20px 80px;
  background: var(--bg);
  min-height: 100vh;
  color: var(--text);
}

/* HEADER */
.header {
  margin-bottom: 24px;
}

.header-title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin: 0 0 4px;
  color: var(--text);
}

.header-sub {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0;
}

/* MODE SWITCH */
.mode {
  display: inline-flex;
  gap: 6px;
  padding: 6px;
  margin-bottom: 28px;
  border-radius: 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
}

.mode button {
  position: relative;
  padding: 10px 22px;
  border-radius: 11px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  font-size: 13.5px;
  font-weight: 700;
  color: var(--text-secondary);
  transition: all 0.22s ease;
  display: flex;
  align-items: center;
  gap: 7px;
}

.mode button:hover {
  color: var(--text);
  background: var(--surface-alt);
}

.mode button.active {
  color: white;
  background: linear-gradient(135deg, var(--brand), var(--brand-dark));
  border-color: transparent;
  box-shadow: 0 8px 20px rgba(27, 134, 124, 0.25);
}

/* CARD */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 28px;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: var(--shadow-md);
}

.card-header {
  margin-bottom: 20px;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 6px;
  color: var(--text);
}

.premium-sub {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  margin: 8px 0 16px;
  color: var(--text);
}

.section-divider {
  height: 1px;
  background: var(--border-light);
  margin: 28px 0 20px;
}

/* FORM */
.form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.field label {
  display: block;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

input,
.field :deep(.v-field) {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: 11px;
  background: var(--input-bg);
  color: var(--text);
  font-size: 14px;
  transition: all 0.2s ease;
}

input:focus,
.field :deep(.v-field--focused) {
  outline: none;
  border-color: var(--brand);
  box-shadow: 0 0 0 3px rgba(27, 134, 124, 0.12);
}

.req {
  color: #ef4444;
  font-weight: 700;
}

/* TOGGLE */
.toggle-visible {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: var(--surface-alt);
  border: 1px solid var(--border);
  border-radius: 14px;
}

.toggle-visible .title {
  font-weight: 600;
  font-size: 14px;
  color: var(--text);
}

.toggle-visible .desc {
  font-size: 12.5px;
  color: var(--text-muted);
  margin-top: 2px;
}

.switch-strong {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
}

.switch-strong input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: #cbd5e1;
  border-radius: 999px;
  transition: 0.3s;
}

.slider:before {
  content: "";
  position: absolute;
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background: white;
  border-radius: 50%;
  transition: 0.3s;
}

input:checked + .slider {
  background: var(--brand);
}

input:checked + .slider:before {
  transform: translateX(22px);
}

/* UPLOAD */
.upload {
  text-align: center;
  padding: 36px 24px;
  border-radius: 16px;
  background: var(--surface-alt);
  border: 1px solid var(--border);
}

.upload-icon-wrap {
  width: 72px;
  height: 72px;
  margin: 0 auto 16px;
  border-radius: 20px;
  background: linear-gradient(135deg, var(--brand), var(--brand-dark));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 10px 25px rgba(27, 134, 124, 0.25);
}

.upload-title {
  font-size: 17px;
  font-weight: 700;
  margin: 0 0 8px;
  color: var(--text);
}

.upload-desc {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  align-items: center;
}

.col-tag {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  font-family: monospace;
}

.btn-sample {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 11px 20px;
  background: linear-gradient(135deg, var(--brand), var(--brand-dark));
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.22s ease;
  box-shadow: 0 8px 20px rgba(27, 134, 124, 0.25);
}

.btn-sample:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(27, 134, 124, 0.35);
}

.or-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 18px 0;
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 600;
}

.or-divider::before,
.or-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--border);
}

.file-drop {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 20px;
  background: var(--surface);
  border: 1.5px dashed var(--border);
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.file-drop:hover {
  border-color: var(--brand);
  color: var(--text);
  background: var(--surface-alt);
}

.preview-list {
  margin-top: 20px;
  text-align: left;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 16px;
}

.preview-list h4 {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 700;
}

.row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-light);
  font-size: 13.5px;
}

.row:last-child {
  border-bottom: none;
}

/* ACCESS AREAS */
.access-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.access-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.2s ease;
}

.access-item:hover {
  border-color: var(--brand);
  transform: translateY(-1px);
}

.access-item input {
  display: none;
}

.check-ui {
  width: 18px;
  height: 18px;
  border-radius: 5px;
  border: 1.5px solid var(--border);
  background: var(--surface);
  display: inline-block;
  position: relative;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.access-item input:checked + .check-ui {
  background: linear-gradient(135deg, var(--brand), var(--brand-dark));
  border-color: var(--brand);
}

.access-item input:checked + .check-ui::after {
  content: "";
  position: absolute;
  left: 5px;
  top: 1px;
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.label-text {
  font-size: 13.5px;
  font-weight: 500;
  color: var(--text);
}

/* BUTTON */
.btn-primary {
  width: 100%;
  margin-top: 28px;
  padding: 14px;
  background: linear-gradient(135deg, var(--brand), var(--brand-dark));
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.22s ease;
  box-shadow: 0 8px 20px rgba(27, 134, 124, 0.25);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 28px rgba(27, 134, 124, 0.35);
}

/* STATUS */
.badge {
  margin: 16px 0;
  padding: 12px;
  background: linear-gradient(135deg, var(--brand), var(--brand-dark));
  color: white;
  text-align: center;
  border-radius: 12px;
  font-weight: 700;
  font-size: 15px;
}

.info p {
  margin: 8px 0;
  font-size: 14px;
}

.hint {
  font-size: 12.5px;
  margin-top: 16px;
  color: var(--text-muted);
  font-style: italic;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .form {
    grid-template-columns: 1fr;
  }

  .gp {
    padding: 16px 16px 60px;
  }
}
</style>