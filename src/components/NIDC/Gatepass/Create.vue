<template>
<div class="gp">
    <PageBreadcrumb title="Create Passes" />
    <!-- HEADER -->
    <header class="header">

    </header>

    <!-- MODE SWITCH -->
    <div class="mode">

        <button :class="{active: mode==='SINGLE'}" @click="switchMode('SINGLE')">
            <v-icon size="16">mdi-account</v-icon>
            Single Visitor
        </button>

        <button :class="{active: mode==='GROUP'}" @click="switchMode('GROUP')">
            <v-icon size="16">mdi-account-group</v-icon>
            Group Access
        </button>

    </div>

    <!-- GRID -->
    <main class="grid">
        <!-- FORM PANEL -->
        <section class="card">

            <h3 class="">
                Visitor Information
            </h3>
            <p class="sub premium-sub">
                Fields marked
                <span class="req">*</span>
                are required
            </p>
            <!-- ================= SINGLE ================= -->
            <div v-if="mode==='SINGLE'" class="form">

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
            <div v-if="mode==='GROUP'" class="upload">

                <v-icon size="46">mdi-cloud-upload-outline</v-icon>

                <h3>Upload Visitor Excel File</h3>
                <p>Columns: first_name, last_name, phone, id_number</p>

                <input type="file" @change="handleFile" />

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
            <div class="form mt">

                <!-- Contact Person -->
                <div class="field mt-4">
                    <label>Contact Person</label>
                    <input type="text" v-model="form.contact_person" placeholder="Enter contact person name">
                </div>

                <!-- Mobile Number -->
                <div class="field mt-4">
                    <label>Mobile Number</label>
                    <input type="text" v-model="form.contact_mobile" placeholder="e.g. +255 7XX XXX XXX">
                </div>

                <div class="field mt-4">
                    <label>Purpose ID</label>
                    <PaginatedDropdown api-endpoint="/visit-purposes" label="" placeholder="Select visit purpose" item-title="name" v-model="form.visit_purpose_id" />
                </div>
                <div class="field mt-4">
                    <label>Instution/Company</label>
                    <PaginatedDropdownCompany api-endpoint="/companies" label="" placeholder="Select institution/company" item-title="name" v-model="form.company_id" />
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
            <div class="field full-width access-section">

                <label class="section-label my-5">
                    Authorized Access Areas <span class="req">*</span>
                </label>

                <div class="access-grid">
                    <label class="access-item"  v-for="area in accessAreas" :key="area.id">
                        <input type="checkbox" :value="area.id" v-model="form.authorized_areas">
                        <span class="check-ui"></span>
                        <span class="label-text">{{ area.name }}</span>
                    </label>
                </div>

            </div>

            <!-- SUBMIT -->
            <button class="btn-primary" @click="submitGatePass">
                Submit Gate Pass
            </button>

        </section>

        <!-- STATUS PANEL -->
        <section v-if="savedPass" class="card">

            <h3>Live Status</h3>

            <div class="badge">
                {{ savedPass.pass_number }}
            </div>

            <div class="info">

                <p>
                    <b>Mode:</b> {{ mode.toUpperCase() }}
                </p>

                <p v-if="mode==='SINGLE'">
                    <b>Name:</b>
                    {{ savedPass.first_name }}
                    {{ savedPass.last_name }}
                </p>

                <p v-else>
                    <b>Visitors:</b> {{ visitors.length }}
                </p>

                <p><b>Status:</b> {{ savedPass.workflow_status }}</p>
                <p><b>Flow:</b> {{ savedPass.flow }}</p>

            </div>

            <div class="hint">
                Awaiting Gate 1 / Gate 2 approval
            </div>

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
			accessAreas:[],
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
            return this.form.valid_from === this.today ?
                this.currentTime :
                '00:00';
        },
        maxValidTo() {
            if (!this.form.valid_from) return null;

            const date = new Date(this.form.valid_from);
            date.setDate(date.getDate() + 30); // Maximum 30 days

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
        handleFile(event) {
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, {
                    type: "array"
                });

                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const json = XLSX.utils.sheet_to_json(sheet);

                this.visitors = json;
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

                    //  navigate AFTER state updates
                    this.$router.push('/gate-pass');

                })
                .catch(err => {

                    const message =
                        err.response.data.message || 'Error occurred';

                    this.showAlert(message, 'error');
                });
        }

    }
};
</script>

<style scoped>
/* FULL SCREEN */
.gp {
    width: 100vw;
    min-height: 100vh;
    padding: 24px;
    /* background: #f5f7fb; */
    box-sizing: border-box;
    /* font-family: Inter, sans-serif; */
}

/* HEADER */
.header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 18px;
}

.header h1 {
    font-size: 26px;
    font-weight: 800;
}

.header p {
    font-size: 13px;
    color: #6b7280;
}

/* =========================
   PREMIUM MODE SWITCH
========================= */
.mode {
    display: inline-flex;
    gap: 6px;

    padding: 8px;
    /* keep clean */

    margin-bottom: 28px;
    /*  THIS is what you were missing */

    border-radius: 10px;

    /* background: linear-gradient(180deg, #f8fafc, #f1f5f9); */

    border: 1px solid rgba(148, 163, 184, 0.25);

    /* box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.8),
        0 10px 25px rgba(15, 23, 42, 0.06); */
}

/* =========================
   MODE BUTTON BASE
========================= */
.mode button {
    position: relative;

    padding: 10px 20px;

    border-radius: 10px;

    border: 1px solid transparent;

    background: transparent;

    cursor: pointer;

    font-size: 13px;
    font-weight: 700;

    color: #475569;

    transition: all 0.25s cubic-bezier(.4, 0, .2, 1);

    display: flex;
    align-items: center;
    gap: 6px;

    z-index: 1;
}

/* hover state */
.mode button:hover {
    color: #0f172a;

    background: rgba(37, 99, 235, 0.06);

    transform: translateY(-1px);
}

/* =========================
   ACTIVE STATE (PREMIUM)
========================= */
.mode button.active {
    color: #ffffff;

    background: linear-gradient(135deg,
            #0f172a,
            #003B73,
            #1b867c);

    border: 1px solid rgba(255, 255, 255, 0.12);

    /* box-shadow:
        0 12px 30px rgba(15, 23, 42, 0.25); */

    transform: translateY(-1px);
}

/* subtle shine effect on active */
.mode button.active::before {
    content: "";

    position: absolute;
    top: 0;
    left: -40%;
    width: 80%;
    height: 100%;

    background: linear-gradient(90deg,
            transparent,
            rgba(255, 255, 255, 0.18),
            transparent);

    transform: skewX(-20deg);

    animation: modeShine 3.5s infinite linear;

    border-radius: 999px;
}

@keyframes modeShine {
    0% {
        left: -60%;
    }

    100% {
        left: 120%;
    }
}

/* =========================
   ACTIVE CLICK PRESS FEEL
========================= */
.mode button:active {
    transform: scale(0.98);
}

/* =========================
   OPTIONAL ICON SUPPORT
========================= */
.mode button i,
.mode button .v-icon {
    font-size: 16px;
    opacity: 0.9;
}

/* GRID FULL WIDTH */
.grid {
    display: grid;
    gap: 18px;
}

/* CARD */
.card {
    background: white;
    border-radius: 14px;
    padding: 20px;
    border: 1px solid #e5e7eb;
}

/* FORM */
.form {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
}

.field label {
    font-size: 12px;
    display: block;
    margin-bottom: 4px;
}

input {
    width: 100%;
    padding: 12px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
}

.premium-sub {
    display: inline-flex;
    align-items: center;
    gap: 6px;

    font-size: 13px;
    font-weight: 600;
    color: #64748b;

    /* background: rgba(27, 134, 124, 0.06); */
    /* border: 1px solid rgba(27, 134, 124, 0.15); */

    padding: 10px 14px;
    border-radius: 999px;

    width: fit-content;

    backdrop-filter: blur(8px);
}

.premium-section-title {
    font-size: 16px;
    font-weight: 800;
    letter-spacing: 0.5px;

    color: #0f172a;

    display: flex;
    align-items: center;
    gap: 10px;

    margin: 18px 0 14px;

    position: relative;
}

/* Accent line */
.premium-section-title::before {
    content: "";
    width: 6px;
    height: 18px;
    border-radius: 6px;

    background: linear-gradient(135deg, #1b867c, #003B73);

    display: inline-block;
}

/* Subtle underline glow */
.premium-section-title::after {
    content: "";
    position: absolute;
    bottom: -6px;
    left: 0;

    width: 60px;
    height: 2px;

    background: linear-gradient(90deg, #1b867c, transparent);
    border-radius: 10px;
}

/* Required asterisk */
.req {
    color: #ef4444;
    font-weight: 900;
    font-size: 14px;

    margin: 0 2px;
}

/* UPLOAD */
.upload {
    text-align: center;
    padding: 20px;
    border: 2px dashed #cbd5e1;
    border-radius: 12px;
}

/* BUTTON */
.btn-primary {
    width: 100%;
    margin-top: 14px;
    padding: 12px;
    background: linear-gradient(135deg, #1b867c, #003B73, #0f172a);
    color: white;
    border: none;
    border-radius: 10px;
}

/* PREVIEW LIST */
.preview-list {
    margin-top: 12px;
    text-align: left;
}

.row {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    border-bottom: 1px solid #f1f5f9;
}

/* STATUS */
.badge {
    margin-top: 10px;
    padding: 10px;
    background: #114575;
    color: white;
    text-align: center;
    border-radius: 10px;
}

.hint {
    font-size: 12px;
    margin-top: 10px;
    color: #6b7280;
}

/* RESPONSIVE */
@media (max-width: 900px) {
    .grid {
        grid-template-columns: 1fr;
    }

    .form {
        grid-template-columns: 1fr;
    }
}

/* MAIN CONTAINER */
.toggle-visible {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 12px 14px;

    border-radius: 12px;

    background: linear-gradient(180deg, #ffffff, #f1f5f9);

    border: 1px solid #e2e8f0;

    transition: all 0.2s ease;
}

.toggle-visible:hover {
    border-color: #94a3b8;
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
}

/* TEXT */
.toggle-visible .title {
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
}

.toggle-visible .desc {
    font-size: 11px;
    color: #64748b;
    margin-top: 2px;
}

/* SWITCH */
.switch-strong {
    position: relative;
    width: 44px;
    height: 24px;
    display: inline-block;
}

.switch-strong input {
    opacity: 0;
    width: 0;
    height: 0;
}

/* TRACK */
.slider {
    position: absolute;
    inset: 0;
    cursor: pointer;

    background: #cbd5e1;
    border-radius: 999px;

    transition: 0.3s;
}

/* KNOB */
.slider::before {
    content: "";
    position: absolute;

    height: 18px;
    width: 18px;

    left: 3px;
    top: 3px;

    background: white;
    border-radius: 50%;

    transition: 0.3s;

    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

/* ACTIVE STATE (IMPORTANT COLOR) */
.switch-strong input:checked+.slider {
    background: linear-gradient(135deg, #1b867c, #003B73);
}

.switch-strong input:checked+.slider::before {
    transform: translateX(20px);
}

/* Section title */
.section-label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #1f2d3d;
}

.req {
    color: #d32f2f;
    margin-left: 4px;
}

/* Grid layout */
.access-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 12px;
}

/* Card-style checkbox item */
.access-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;

    padding: 12px 14px;
    border-radius: 10px;

    background: #ffffff;
    border: 1px solid #e5e7eb;

    cursor: pointer;
    transition: all 0.25s ease;

    /* box-shadow: 0 2px 6px rgba(0,0,0,0.04); */
}

/* hover */
.access-item:hover {
    border-color: #1976d2;
    /* box-shadow: 0 6px 16px rgba(25,118,210,0.12); */
    transform: translateY(-1px);
}

/* hide default checkbox */
.access-item input {
    display: none;
}

/* custom checkbox box */
.check-ui {
    width: 18px;
    height: 18px;
    border-radius: 5px;
    margin-right: 10px;
    border: 1px solid #b0b0b0;
    background: #fff;

    display: inline-block;
    position: relative;

    transition: all 0.2s ease;
}

/* label text */
.label-text {
    font-size: 13px;
    color: #2c3e50;
    font-weight: 500;
}

/* checked state */
.access-item input:checked+.check-ui {
    background: linear-gradient(135deg, #1b867c, #003B73);
    border-color: #003B73;
    box-shadow: 0 4px 10px rgba(13, 71, 161, 0.25);
}

/* tick mark */
.access-item input:checked+.check-ui::after {
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

/* active selected glow */
.access-item input:checked~.label-text {
    color: #0d47a1;
}
</style>
