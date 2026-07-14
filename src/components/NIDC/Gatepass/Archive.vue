<template>
<v-container fluid class="users-page">
    <!-- BREADCRUMB -->
    <PageBreadcrumb title="Gate Passes" />
    <!-- TABLE -->
    <DataTable ref="gatepassTable" api-url="gate-passes" :headers="headers" title="Gate Passes" subtitle="Manage all gate passes issued" :items-per-page-options="[10, 25, 50, 100]" :searchable="true" :exportable="true">
        <template #actions="{ item }">

            <v-menu location="bottom end" transition="scale-transition" offset="12">

                <!-- ACTIVATOR -->
                <template #activator="{ props }">
                    <v-btn v-bind="props" icon size="42" elevation="0" class="premium-action-btn">
                        <v-icon size="20">mdi-dots-horizontal</v-icon>
                    </v-btn>
                </template>

                <!-- MENU CARD -->
                <v-card class="premium-menu-card" rounded="xl" elevation="0" min-width="220">

                    <!-- TOP -->
                    <div class="menu-top">
                        <div class="menu-top-icon">
                            <v-icon size="18" color="white">mdi-lightning-bolt-outline</v-icon>
                        </div>

                        <div>
                            <div class="menu-title">Quick Actions</div>
                            <div class="menu-subtitle">Manage this record</div>
                        </div>
                    </div>

                    <div class="menu-divider"></div>

                    <div class="menu-items">

                        <!--  ALL OTHER ACTIONS ONLY IF NOT EXPIRED -->
                        <template v-if="item.operation_status !== 'EXPIRED'">

                            <div class="premium-menu-item" @click="viewPass(item)" v-if="item.workflow_status !== 'COMPLETED'">
                                <div class="menu-item-left">
                                    <div class="menu-item-icon edit-bg">
                                        <v-icon size="18" color="#2563EB">mdi-clipboard-check-outline</v-icon>
                                    </div>
                                    <div>
                                        <div class="menu-item-title">Approval Workspace</div>
                                        <div class="menu-item-subtitle">See Pass Details</div>
                                    </div>
                                </div>
									<v-icon size="18" color="#94a3b8">
																			mdi-chevron-right
																	</v-icon>
                            </div>
									<div class="premium-menu-item" @click="addVisitorDialog(item)" v-if="item.workflow_status=='PENDING_SUBMISSION'">
																	<div class="menu-item-left">
																			<div class="menu-item-icon create-bg">
																					<v-icon size="18" color="#10B981"> mdi-account-plus-outline </v-icon>
																			</div>
																			<div>
																					<div class="menu-item-title">Add Visitor</div>
																					<div class="menu-item-subtitle">
																							Attach visitor to this gate pass
																					</div>
																			</div>

																	</div>

																	<v-icon size="18" color="#94a3b8">
																			mdi-chevron-right
																	</v-icon>

															</div>

                            <div class="premium-menu-item" @click="submitPass(item)" v-if="item.workflow_status=='PENDING_SUBMISSION'">
                                <div class="menu-item-left">
                                    <div class="menu-item-icon edit-bg">
                                        <v-icon size="18" color="#6366F1">mdi-send-outline</v-icon>
                                    </div>
                                    <div>
                                        <div class="menu-item-title">Submit to Gate 2 Security</div>
                                        <div class="menu-item-subtitle">Initial security review</div>
                                    </div>
                                </div>
									<v-icon size="18" color="#94a3b8">
																			mdi-chevron-right
																	</v-icon>
                            </div>
                          

                           
                        </template>
                        <!--  ONLY ACTION ALLOWED WHEN EXPIRED -->
                        <div class="premium-menu-item" @click="openPreview(item)">
                            <div class="menu-item-left">

                                <div class="menu-item-icon view-bg">
                                    <v-icon size="18" color="#ef4444">mdi-file-pdf-box</v-icon>
                                </div>

                                <div>
                                    <div class="menu-item-title">Preview Gate Pass(PDF)</div>
                                    <div class="menu-item-subtitle">Open PDF in viewer</div>
                                </div>

                            </div>

                            <v-icon size="18" color="#94a3b8">mdi-chevron-right</v-icon>
                        </div>
                        <!-- EXPIRED LABEL (OPTIONAL) -->
                        <div v-if="item.operation_status === 'EXPIRED'" class="expired-text pa-3 d-flex align-center">
                            <v-icon color="error" size="18" class="mr-2">mdi-alert-circle</v-icon>
                            <span>Gate Pass Expired</span>
                        </div>

                    </div>
                </v-card>

            </v-menu>

        </template>
    </DataTable>
    <v-dialog v-model="pdfDialog" max-width="900" persistent transition="dialog-bottom-transition">

        <v-card class="pdf-premium-card" rounded="lg" elevation="0">

            <!-- ================= HEADER ================= -->
            <div class="pdf-premium-header">

                <div class="pdf-premium-left">

                    <div class="pdf-badge">
                        <v-icon size="20" color="white">mdi-file-document-outline</v-icon>
                    </div>

                    <div>
                        <div class="pdf-title">Gate Pass Preview</div>
                        <div class="pdf-subtitle">Secure document viewer</div>
                    </div>

                </div>

                <div class="pdf-premium-actions">

                    <!-- DOWNLOAD -->
                    <v-btn size="small" class="action-btn download" prepend-icon="mdi-download" @click="downloadPdf(selectedGatePass)">
                        Download
                    </v-btn>

                    <!-- OPEN IN NEW TAB -->
                    <!-- <v-btn
                    size="small"
                    class="action-btn open"
                    prepend-icon="mdi-open-in-new"
                    :href="pdfUrl"
                    target="_blank"
                >
                    Open
                </v-btn> -->

                    <!-- CLOSE -->
                    <v-btn icon variant="text" class="close-btn" @click="pdfDialog = false">
                        <v-icon color="white">mdi-close</v-icon>
                    </v-btn>

                </div>

            </div>

            <!-- ================= BODY ================= -->
            <div class="pdf-premium-body">

                <iframe :src="pdfUrl" class="pdf-frame"></iframe>

            </div>

        </v-card>

    </v-dialog>

    <!-- =========================================================
    PREMIUM VIEW GATE PASS DIALOG
========================================================= -->
    <v-dialog v-model="viewDialog" max-width="1450" transition="dialog-bottom-transition">
        <v-card class="enterprise-dialog" elevation="0" rounded="xl">
            <!-- =========================
            HERO HEADER
        ========================== -->
            <div class="enterprise-hero">
                <div class="hero-left">
                    <div class="hero-icon">
                        <v-icon size="34" color="white">mdi-shield-account</v-icon>
                    </div>

                    <div>
                        <div class="hero-badge">GATE PASS SYSTEM</div>
                        <div class="hero-title">Gate Pass Details</div>
                        <div class="hero-subtitle">Secure access & visitor tracking</div>
                    </div>
                </div>

                <div class="hero-right">
                    <div class="chip">
                        <v-icon size="16">mdi-card</v-icon>
                        {{ selectedGatePass?.pass_number }}
                    </div>

                    <div class="chip" :class="workflowStatusClass(selectedGatePass?.workflow_status)">
                        <v-icon size="16">mdi-shield-check</v-icon>
                        {{ workflowStatusLabel(selectedGatePass?.workflow_status) }}
                    </div>
                </div>
            </div>

            <!-- =========================
            BODY
        ========================== -->
            <div class="enterprise-body">
                <!-- SUMMARY -->
                <div class="summary-grid">
                    <div class="summary-card card-teal">
                        <v-icon>mdi-office-building</v-icon>
                        <div>
                            <div class="label">Institution/Company</div>
                            <div class="value">{{ selectedGatePass?.company?.name }}</div>
                        </div>
                    </div>

                    <div class="summary-card card-blue">
                        <v-icon>mdi-calendar-range</v-icon>
                        <div>
                            <div class="label">Validity</div>
                            <div class="value">
                                {{ formatDate(selectedGatePass?.valid_from) }} →
                                {{ formatDate(selectedGatePass?.valid_to) }}
                            </div>
                        </div>
                    </div>

                    <div class="summary-card card-orange">
                        <v-icon>mdi-clock-outline</v-icon>
                        <div>
                            <div class="label">Time Window</div>
                            <div class="value">
                                {{ selectedGatePass?.time_in }} -
                                {{ selectedGatePass?.time_out }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- =========================
                VISITOR EXPANSION PANEL
            ========================== -->
                <v-expansion-panels class="visitor-panel" elevation="0">
                    <v-expansion-panel>
                        <!-- PANEL HEADER -->
                        <v-expansion-panel-title class="panel-title">
                            <div class="panel-title-left">
                                <v-icon color="#114575">mdi-account-group</v-icon>

                                <div>
                                    <div class="title">VISITORS</div>
                                    <div class="subtitle">
                                        {{ filteredVisitors.length }} registered visitors
                                    </div>
                                </div>
                            </div>
                        </v-expansion-panel-title>

                        <!-- PANEL CONTENT -->
                        <v-expansion-panel-text>
                            <div class="table-container">
                                <!-- =================================================
                TABLE TOOLBAR
            ================================================== -->
                              <!-- TABLE TOOLBAR -->
<!-- TABLE TOOLBAR -->
<div class="table-toolbar">
  <div class="toolbar-actions">
    <!-- SEARCH -->
    <v-text-field 
      v-model="visitorSearch" 
      placeholder="Search visitor, company or pass..." 
      prepend-inner-icon="mdi-magnify" 
      variant="solo" 
      flat 
      density="comfortable" 
      hide-details 
      class="search-field" 
    />

    <!-- BULK ACTIONS -->
  <!-- BULK ACTIONS -->
<div v-if="selectedVisitors.length > 0" class="d-flex align-center flex-wrap gap-3 ml-4">
  
  <!-- Approve at Gate 1 -->
  <v-btn
    v-if="user?.current_gate === 'GATE_1'"
    class="premium-bulk-btn approve-btn"
    rounded="xl"
    elevation="0"
    @click="openBulkApprove"
  >
    <span class="btn-glow"></span>
    <v-icon start size="20">mdi-shield-check-outline</v-icon>
    Approve ({{ selectedVisitors.length }})
  </v-btn>

  <!-- Check In (Gate 2) -->
  <v-btn
    v-if="user?.current_gate === 'GATE_2'"
    class="premium-bulk-btn checkin-btn"
    rounded="xl"
    elevation="0"
    @click="openBulkCheckIn"
  >
    <span class="btn-glow"></span>
    <v-icon start size="20">mdi-check-circle</v-icon>
    Check In ({{ selectedVisitors.length }})
  </v-btn>

  <!-- Check Out (Gate 2) -->
  <v-btn
    v-if="user?.current_gate === 'GATE_2'"
    class="premium-bulk-btn checkout-btn"
    rounded="xl"
    elevation="0"
    @click="openBulkCheckOut"
  >
    <span class="btn-glow"></span>
    <v-icon start size="20">mdi-exit-to-app</v-icon>
    Check Out ({{ selectedVisitors.length }})
  </v-btn>

  <!-- Final Exit (Gate 1) -->
  <v-btn
    v-if="user?.current_gate === 'GATE_1'"
    class="premium-bulk-btn final-exit-btn"
    rounded="xl"
    elevation="0"
    @click="openBulkGate1CheckOut"
  >
    <span class="btn-glow"></span>
    <v-icon start size="20">mdi-exit-to-app</v-icon>
    Final Exit ({{ selectedVisitors.length }})
  </v-btn>

</div>
  </div>
</div>                        <!-- =================================================
                TABLE
            ================================================== -->
                               <!-- =================================================
TABLE WRAPPER
================================================== -->
<div class="table-wrapper">

    <!-- ================= HEADER ================= -->
   <div class="table-head">
      <!-- CHECKBOX HEADER -->
      <div class="th mx-3">
        <v-checkbox
          v-model="selectAll"
          hide-details
          density="compact"
          color="primary"
          @change="toggleSelectAll"
        />
      </div>
        <div class="th mx-5">Visitor</div>
        <div class="th">Phone</div>
        <div class="th">Company/Institution</div>
        <div class="th">Gate Pass</div>
        <div class="th">Current Gate</div>
        <div class="th">Status</div>
        <div class="th">Actions</div>

    </div>

    <!-- ================= BODY ================= -->
    <transition-group name="fade-slide" tag="div">

       <div
        v-for="item in paginatedVisitors"
        :key="item.id"
        class="table-row"
      >
        <!-- CHECKBOX -->
        <div class="td mx-3">
          <v-checkbox
            v-model="selectedVisitors"
            :value="item.id"
            hide-details
            density="compact"
            color="primary"
          />
        </div>

            <!-- VISITOR -->
            <div class="td mx-5">
                <div class="visitor-box">
                    <div class="avatar">
                        {{ item.first_name?.charAt(0)?.toUpperCase() }}
                    </div>

                    <div>
                        <div class="visitor-name">
                            {{ item.first_name }} {{ item.last_name }}
                        </div>

                        <div class="visitor-id">
                            {{ item.id_number || "ID not provided" }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- PHONE -->
            <div class="td">
                {{ item.phone }}
            </div>

            <!-- COMPANY -->
            <div class="td">
                {{ item.company || '-' }}
            </div>

            <!-- PASS -->
            <div class="td">
                <div class="pass-chip">
                    {{ selectedGatePass.pass_number }}
                </div>
            </div>

            <!-- CURRENT GATE -->
            <div class="td">
                <div
                    class="status-chip"
                    :class="movementStatusClass(item.transactions?.[0]?.current_gate)"
                >
                    {{ movementStatusLabel(item.transactions?.[0]?.current_gate) || '-' }}
                </div>
            </div>

            <!-- STATUS -->
            <div class="td">
                <div
                    class="status-chip"
                    :class="movementStatusClass(item.transactions?.[0]?.checkin_status)"
                >
                    {{ movementStatusLabel(item.transactions?.[0]?.checkin_status) || '-' }}
                </div>
            </div>

            <!-- ACTIONS -->
            <div class="td">
                <div class="actions" v-if="selectedGatePass.workflow_status != 'IN_REVIEW'">

                    <v-menu location="bottom end" transition="scale-transition" offset="12">

                        <template #activator="{ props }">
                            <v-btn
                                v-bind="props"
                                icon
                                size="42"
                                elevation="0"
                                class="premium-action-btn"
                            >
                                <v-icon size="20">mdi-dots-horizontal</v-icon>
                            </v-btn>
                        </template>

                        <v-card class="premium-menu-card" rounded="xl" elevation="0" min-width="220">

                            <div class="menu-items">

                                <!-- APPROVE -->
                                <div
                                    class="premium-menu-item"
                                    @click="approveAtGate1(item)"
                                    v-if="user?.current_gate === 'GATE_1' && canApproveAtGate1(item)"
                                >
                                    <div class="menu-item-left">
                                        <div class="menu-item-icon view-bg">
                                            <v-icon size="18">mdi-shield-check-outline</v-icon>
                                        </div>
                                        <div>
                                            <div class="menu-item-title">Approve At Gate 1</div>
                                            <div class="menu-item-subtitle">Approve visitor</div>
                                        </div>
                                    </div>
                                </div>

                                <!-- CHECK IN -->
                                <div
                                    class="premium-menu-item"
                                    @click="checkInVisitorAtGate2Item(item)"
                                    v-if="user?.current_gate === 'GATE_2'"
                                >
                                    <div class="menu-item-left">
                                        <div class="menu-item-icon create-bg">
                                            <v-icon size="18">mdi-check-circle</v-icon>
                                        </div>
                                        <div>
                                            <div class="menu-item-title">Check In</div>
                                            <div class="menu-item-subtitle">Enter premises</div>
                                        </div>
                                    </div>
                                </div>

                                <!-- CHECK OUT -->
                                <div
                                    class="premium-menu-item"
                                    @click="checkOutVisitorAtGate2Item(item)"
                                    v-if="user?.current_gate === 'GATE_2'"
                                >
                                    <div class="menu-item-left">
                                        <div class="menu-item-icon warning-bg">
                                            <v-icon size="18">mdi-exit-to-app</v-icon>
                                        </div>
                                        <div>
                                            <div class="menu-item-title">Check Out</div>
                                            <div class="menu-item-subtitle">Exit premises</div>
                                        </div>
                                    </div>
                                </div>

                                <!-- UPDATE -->
                                <div
                                    class="premium-menu-item"
                                    @click="openVisitorUpdateModal(item)"
                                    v-if="selectedGatePass.workflow_status === 'PENDING_SUBMISSION'"
                                >
                                    <div class="menu-item-left">
                                        <div class="menu-item-icon warning-bg">
                                            <v-icon size="18">mdi-account-edit-outline</v-icon>
                                        </div>
                                        <div>
                                            <div class="menu-item-title">Update Visitor</div>
                                            <div class="menu-item-subtitle">Edit details</div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </v-card>

                    </v-menu>

                </div>

                <div v-else class="completed-text">
                    No further action allowed — Under Security Review
                </div>
            </div>

        </div>

    </transition-group>

    <!-- ================= EMPTY ================= -->
    <div v-if="!paginatedVisitors.length" class="empty-state">
        <v-icon size="80">mdi-account-search-outline</v-icon>
        <h3>No Visitors Found</h3>
        <p>No matching records available.</p>
    </div>

</div>

                                <!-- =================================================

FOOTER

================================================== -->
                                <div class="table-footer" v-if="filteredVisitors.length">
                                    <!-- LEFT -->
                                    <div class="footer-info">
                                        Showing
                                        <strong>
                                            {{ startItem }}
                                        </strong>
                                        to
                                        <strong>
                                            {{ endItem }}
                                        </strong>
                                        of
                                        <strong>
                                            {{ filteredVisitors.length }}
                                        </strong>

                                        entries
                                    </div>

                                    <!-- RIGHT -->
                                    <div class="pagination-wrapper">
                                        <!-- PREV -->
                                        <button class="nav-btn" :disabled="page === 1" @click="page--">
                                            <v-icon size="18"> mdi-chevron-left </v-icon>
                                        </button>

                                        <!-- PAGE NUMBERS -->
                                        <button v-for="p in visiblePages" :key="p" class="page-btn" :class="{ active: page === p }" @click="page = p">
                                            {{ p }}
                                        </button>

                                        <!-- NEXT -->
                                        <button class="nav-btn" :disabled="page === totalPages" @click="page++">
                                            <v-icon size="18"> mdi-chevron-right </v-icon>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </div>

            <!-- FOOTER -->
            <div class="dialog-footer">
                <v-btn rounded="xl" height="56" elevation="0" class="premium-close-btn" @click="viewDialog = false">
                    <!-- glow -->
                    <span class="btn-glow"></span>

                    <!-- icon -->
                    <div class="btn-icon-wrap">
                        <v-icon size="18"> mdi-close </v-icon>
                    </div>

                    <span class="btn-text"> Close Dialog </span>
                </v-btn>
            </div>
        </v-card>
    </v-dialog>
</v-container>
</template>

<script>
import axios from "axios";
import DataTable from "../SharedComponents/dataTable.vue";
import PageBreadcrumb from "@/components/NIDC/SharedComponents/PageBreadcrumb.vue";
import swtalert from "@/mixins/swtalert";

import {
    mapGetters,
} from "vuex";

export default {
    components: {
        DataTable,
        PageBreadcrumb,
    },
    mixins: [swtalert],

    data() {
        return {
            dialog: false,
            viewDialog: false,
            page: 1,
            itemsPerPage: 10,
            selectedVisitor: {},
            selectedVisitorTransactions: [],
            selectedGatePass: {},
			visitorSearch: "",
			selectedVisitors: [],     
			selectAll: false,
			pdfDialog: false,
			visitorDialog: false,
            pdfUrl: null,
            selectedGatePassPdf: null,
            pdfLoading: false,
            confirmDialogVisible: false,
            statusDialogVisible: false,
            loadingStatus: false,
            visitor: {},
            statusAction: "",
            headers: [{
                    title: "Pass Number",
                    value: "pass_number",
                },
                {
                    title: "Visit Type",
                    value: "is_multi_day",
                },
                {
                    title: "Institution",
                    value: "company.name",
                },
                {
                    title: "Valid From",
                    value: "valid_from",
                },
                {
                    title: "Valid To",
                    value: "valid_to",
                },
                {
                    title: "Time In",
                    value: "time_in",
                },
                {
                    title: "Time Out",
                    value: "time_out",
                },

                {
                    title: "Current Gate",
                    value: "current_gate",
                },

                {
                    title: "Operation Status",
                    value: "operation_status",
                },
                {
                    title: "Workflow Status",
                    value: "workflow_status",
                },
                {
                    title: "Actions",
                    value: "actions",
                },
            ],
        };
    },

    // mounted() {
    //     this.fetchRoles();
	// },

	watch: {
    // Keep Select All in sync when search/filter changes
    filteredVisitors(newVal) {
      if (newVal.length === 0) {
        this.selectAll = false;
        return;
      }
      this.selectAll = newVal.every(v => this.selectedVisitors.includes(v.id));
    },

    selectedVisitors(newVal) {
      const filteredIds = this.filteredVisitors.map(v => v.id);
      this.selectAll = filteredIds.length > 0 && filteredIds.every(id => newVal.includes(id));
    }
  },
	computed: {
		
  ...mapGetters({
            authenticated: "auth/authenticated",
            user: "auth/user",
        }),      filteredVisitors() {
            const visitors = this.selectedGatePass ?
                this.selectedGatePass.visitors || [] : [];
            const term = this.visitorSearch.toLowerCase();

            return visitors.filter(
                (v) =>
                `${v.first_name} ${v.last_name}`.toLowerCase().includes(term) ||
                (v.phone || "").toLowerCase().includes(term) ||
                (v.id_number || "").toLowerCase().includes(term)
            );
		},
		

        selectedVisitorTransaction() {
            return this.selectedVisitor ?.transactions ?. [0] || null;
        },

        paginatedVisitors() {
            const start = (this.page - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;

            return this.filteredVisitors.slice(start, end);
        },

        totalPages() {
            return Math.ceil(this.filteredVisitors.length / this.itemsPerPage) || 1;
        },
        startItem() {
            return this.filteredVisitors.length ?
                (this.page - 1) * this.itemsPerPage + 1 :
                0;
        },

        endItem() {
            return Math.min(
                this.page * this.itemsPerPage,
                this.filteredVisitors.length
            );
        },

        visiblePages() {
            const pages = [];

            for (let i = 1; i <= this.totalPages; i++) {
                pages.push(i);
            }

            return pages;
        },
        isInside() {
            return this.selectedVisitor && this.selectedVisitor.transactions && this.selectedVisitor.transactions[0] && this.selectedVisitor.transactions[0].current_gate === 'INSIDE';
		},
		
    },

    methods: {
		toggleSelectAll() {
      if (this.selectAll) {
        this.selectedVisitors = this.filteredVisitors.map(v => v.id);
      } else {
        this.selectedVisitors = [];
      }
    },

        openVisitorUpdateModal(item) {
            this.selectedVisitor = {
                ...item
            };
            this.companyDialog = true;
        },
        async updateCompany() {

            try {
                const response = await axios.patch(
                    `/visitors/${this.selectedVisitor.id}/company`, {
                        company_id: this.selectedVisitor.company_id
                    }
                );

                this.companyDialog = false;
                this.viewDialog = false;

                this.showAlert(response.data.message, "success");

                this.refreshTable();

            } catch (error) {

                this.companyDialog = false;

                this.showAlert(
                    error.response.data.message || "Failed to update company",
                    "error"
                );
            }
        },
        viewPass(item) {
            this.selectedGatePass = JSON.parse(JSON.stringify(item));
			this.viewDialog = true;
      this.selectedVisitors = [];   
      this.selectAll = false;
      this.viewDialog = true;
        },
       
        fetchPdfUrlAndOpen() {
            this.pdfLoading = true;

            const id = this.selectedGatePassPdf.id;

            axios.get(`/gatepass/${id}/pdf`, {
                    responseType: "blob"
                })
                .then(response => {

                    const file = new Blob([response.data], {
                        type: "application/pdf"
                    });
                    const fileURL = URL.createObjectURL(file);

                    this.pdfUrl = fileURL;
                    this.pdfDialog = true;
                })
                .catch(error => {
                    this.showAlert(
                        error.response ?.data ?.message || "Failed to load PDF",
                        "error"
                    );
                })
                .finally(() => {
                    this.pdfLoading = false;
                });
        },

        downloadPdf() {
            this.pdfLoading = true;

            const id = this.selectedGatePassPdf.id;

            axios.get(`/gatepass/${id}/pdf`, {
                    responseType: "blob"
                })
                .then(response => {

                    const blob = new Blob([response.data], {
                        type: "application/pdf"
                    });
                    const url = window.URL.createObjectURL(blob);

                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", `gatepass-${id}.pdf`);

                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    window.URL.revokeObjectURL(url);
                })
                .catch(() => {
                    this.showAlert("Failed to download PDF", "error");
                })
                .finally(() => {
                    this.pdfLoading = false;
                });
        },
        openPreview(item) {
            this.selectedGatePassPdf = item;
            this.fetchPdfUrlAndOpen();
        },

        openDownload(item) {
            this.selectedGatePassPdf = item;
            this.downloadPdf();
        },
      
        workflowStatusLabel(status) {

            return ({
                PENDING_SUBMISSION: "Pending Submission",
                IN_REVIEW: "In Review",
                PARTIALLY_APPROVED: "Partially Approved",
                APPROVED: "Approved",
                REJECTED: "Rejected",

            } [status] || status);
        },
        workflowStatusClass(status) {

            return ({
                PENDING_SUBMISSION: "status-orange",
                IN_REVIEW: "status-blue",
                PARTIALLY_APPROVED: "status-purple",
                APPROVED: "status-green",
                REJECTED: "status-red",
            } [status] || "");
        },

        operationStatusLabel(status) {

            return ({
                PENDING: "Pending",
                ACTIVE: "Active",
                COMPLETED: "Completed",
                EXPIRED: "Expired",
            } [status] || status);
        },
        operationStatusClass(status) {

            return ({
                PENDING: "status-orange",
                ACTIVE: "status-green",
                COMPLETED: "status-blue",
                EXPIRED: "status-gray",
            } [status] || "");
        },
        approvalStatusLabel(status) {

            return ({
                PENDING: "Pending Approval",
                APPROVED: "Approved",
                REJECTED: "Rejected",
            } [status] || status);
        },
        approvalStatusClass(status) {

            return ({
                PENDING: "status-orange",
                APPROVED: "status-green",
                REJECTED: "status-red",
            } [status] || "");
        },
        movementStatusLabel(status) {

            return ({
                NOT_ARRIVED: "Not Arrived",
                INSIDE: "Inside Premises",
                EXITED: "Exited",
                DENIED: "Denied Entry",
                CLEARED: "Cleared At Gate1",
                CHECKED_IN: "Checked In",
                GATE_1: "At Gate 1",
                GATE_2: "At Gate 2",
                CHECKED_OUT: "Checked Out",
                APPROVED: "Approved for Entry",
                EXITING: "Exiting Premises",

            } [status] || status);
        },
        movementStatusClass(status) {

            return ({
                NOT_ARRIVED: "status-gray",
                INSIDE: "status-green",
                EXITED: "status-blue",
                DENIED: "status-red",
                CLEARED: "status-orange",
                CHECKED_IN: "status-green",
                GATE_1: "status-purple",
                GATE_2: "status-blue",
                CHECKED_OUT: "status-gray",
                APPROVED: "status-green",
                EXITING: "status-orange",

            } [status] || "");
        },

        formatDate(date) {
            if (!date) return "N/A";

            return new Date(date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
        },
       

        formatStatus(status) {
            return status ? status.replaceAll("_", " ") : "";
        },
       
        refreshTable() {
            this.$refs.gatepassTable.fetchData();
        },

    },

};
</script>

<style scoped>
/* =========================
   DROPDOWN ITEM CARD STYLE
========================== */
.premium-role-item {
    border-radius: 14px;
    margin: 6px 8px;
    transition: all 0.2s ease;
}

/* hover effect like modern apps */
.premium-role-item:hover {
    background: rgba(37, 99, 235, 0.08);
    transform: translateX(3px);
}

/* avatar styling */
.role-avatar {
    background: linear-gradient(135deg, #2563eb, #1e40af);
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.25);
}

/* title */
.role-title {
    font-weight: 600;
    font-size: 14px;
    color: #0f172a;
}

/* dropdown menu spacing */
.v-overlay .v-list {
    padding: 8px;
}

/* =========================================================
    DIALOG
========================================================= */

.premium-dialog {
    overflow: hidden;

    border-radius: 34px !important;

    background: white;

    box-shadow: 0 30px 80px rgba(15, 23, 42, 0.15);
}

/* =========================================================
    TOP
========================================================= */

.dialog-top {
    height: 150px;

    position: relative;

    display: flex;
    align-items: center;
    justify-content: center;

    overflow: hidden;
}

/* ACTIVATE */
.activate-top {
    background: linear-gradient(135deg, #16a34a, #22c55e, #15803d);
}

/* DEACTIVATE */
.deactivate-top {
    background: linear-gradient(135deg, #ef4444, #dc2626, #991b1b);
}

/* GLOW */
.dialog-glow {
    position: absolute;

    width: 280px;
    height: 280px;

    border-radius: 50%;

    background: rgba(255, 255, 255, 0.08);

    top: -100px;
    right: -60px;
}

/* ICON */
.dialog-icon {
    width: 100px;
    height: 100px;

    border-radius: 30px;

    backdrop-filter: blur(10px);

    border: 1px solid rgba(255, 255, 255, 0.2);

    display: flex;
    align-items: center;
    justify-content: center;

    z-index: 2;

    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.18);
}

/* SUCCESS */
.success-icon {
    background: rgba(255, 255, 255, 0.15);
}

/* DANGER */
.danger-icon {
    background: rgba(255, 255, 255, 0.15);
}

/* =========================================================
    TITLE
========================================================= */

.dialog-title {
    font-size: 30px;

    font-weight: 800;

    color: #ffffff;

    margin-bottom: 12px;
}

.dialog-subtitle {
    font-size: 15px;

    line-height: 1.8;

    color: #64748b;

    max-width: 400px;

    margin: auto;
}

/* =========================================================
    USER CARD
========================================================= */

.premium-user-card {
    padding: 20px;

    border-radius: 28px;

    background: linear-gradient(to bottom right, #ffffff, #f8fafc);

    border: 1px solid #e2e8f0;
}

/* AVATAR */
.premium-avatar {
    width: 68px;
    height: 68px;

    border-radius: 22px;

    display: flex;
    align-items: center;
    justify-content: center;

    color: white;

    font-size: 24px;
    font-weight: 800;
}

/* SUCCESS */
.success-avatar {
    background: linear-gradient(135deg, #22c55e, #15803d);

    box-shadow: 0 12px 25px rgba(34, 197, 94, 0.25);
}

/* DANGER */
.danger-avatar {
    background: linear-gradient(135deg, #ef4444, #b91c1c);

    box-shadow: 0 12px 25px rgba(239, 68, 68, 0.25);
}

/* USER INFO */
.premium-user-name {
    font-size: 18px;

    font-weight: 800;

    color: #0f172a;
}

.premium-user-email {
    margin-top: 4px;

    font-size: 13px;

    color: #64748b;
}

/* =========================================================
    STATUS CHIP
========================================================= */

.status-chip {
    padding: 8px 14px;

    border-radius: 999px;

    font-size: 12px;
    font-weight: 700;

    display: flex;
    align-items: center;
}

/* SUCCESS */
.success-chip {
    background: rgba(34, 197, 94, 0.12);

    color: #15803d;
}

/* DANGER */
.danger-chip {
    background: rgba(239, 68, 68, 0.12);

    color: #dc2626;
}

/* =========================================================
    ALERT BOXES
========================================================= */

.premium-warning-box,
.premium-success-box {
    padding: 16px 18px;

    border-radius: 20px;

    display: flex;
    align-items: center;

    font-size: 14px;
    font-weight: 600;
}

/* WARNING */
.premium-warning-box {
    background: rgba(245, 158, 11, 0.08);

    border: 1px solid rgba(245, 158, 11, 0.15);

    color: #92400e;
}

/* SUCCESS */
.premium-success-box {
    background: rgba(34, 197, 94, 0.08);

    border: 1px solid rgba(34, 197, 94, 0.15);

    color: #166534;
}

/* =========================================================
    BUTTONS
========================================================= */

.cancel-btn {
    text-transform: none !important;

    font-weight: 700 !important;

    border: 1px solid #cbd5e1 !important;

    color: #334155 !important;
}

/* SUCCESS BUTTON */
.success-btn {
    text-transform: none !important;

    font-weight: 700 !important;

    color: white !important;

    background: linear-gradient(135deg, #22c55e, #15803d) !important;

    box-shadow: 0 12px 28px rgba(34, 197, 94, 0.28);
}

/* DANGER BUTTON */
.danger-btn {
    text-transform: none !important;

    font-weight: 700 !important;

    color: white !important;

    background: linear-gradient(135deg, #ef4444, #b91c1c) !important;

    box-shadow: 0 12px 28px rgba(239, 68, 68, 0.28);
}

/* =========================
   DIALOG CORE
========================= */
.enterprise-dialog {
    border-radius: 36px !important;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 50px 140px rgba(0, 0, 0, 0.25);
}

/* =========================
   HERO
========================= */
.enterprise-hero {
    padding: 26px;
    background: linear-gradient(135deg, #114575, #003b73);
    display: flex;
    justify-content: space-between;
    color: white;
}

.hero-left {
    display: flex;
    gap: 14px;
    align-items: center;
}

.hero-icon {
    width: 56px;
    height: 56px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
}

.hero-badge {
    font-size: 11px;
    opacity: 0.8;
}

.hero-title {
    font-size: 22px;
    font-weight: 800;
}

.hero-subtitle {
    font-size: 13px;
    opacity: 0.8;
}

.hero-right {
    display: flex;
    gap: 10px;
}

.chip {
    background: rgba(255, 255, 255, 0.12);
    padding: 10px 14px;
    border-radius: 14px;
    display: flex;
    gap: 8px;
    font-size: 12px;
    font-weight: 700;
}

/* =========================
   BODY
========================= */
.enterprise-body {
    padding: 26px;
}

.summary-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 26px;
}

/* BASE CARD */
.summary-card {
    position: relative;
    display: flex;
    gap: 14px;

    padding: 18px;

    border-radius: 20px;

    background: #ffffff;

    border: 1px solid rgba(226, 232, 240, 0.7);
    /* box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06); */

    overflow: hidden;

    transition: all 0.25s ease;
}

/* HOVER */
.summary-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
}

/* =========================
   CARD 1 - TEAL / BLUE
========================= */
.summary-card.card-teal::before {
    background: radial-gradient(circle at top right,
            rgba(27, 134, 124, 0.18),
            transparent 60%);
}

/* =========================
   CARD 2 - BLUE / INDIGO
========================= */
.summary-card.card-blue::before {
    background: radial-gradient(circle at top right,
            rgba(59, 130, 246, 0.18),
            transparent 60%);
}

/* =========================
   CARD 3 - ORANGE / AMBER
========================= */
.summary-card.card-orange::before {
    background: radial-gradient(circle at top right,
            rgba(245, 158, 11, 0.18),
            transparent 60%);
}

/* =========================
   CARD 4 - PURPLE (if needed later)
========================= */
.summary-card.card-purple::before {
    background: radial-gradient(circle at top right,
            rgba(139, 92, 246, 0.18),
            transparent 60%);
}

/* GLOBAL GLOW LAYER */
.summary-card::before {
    content: "";
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.summary-card:hover::before {
    opacity: 1;
}

/* ICON BASE */
.summary-icon {
    width: 44px;
    height: 44px;
    border-radius: 14px;

    display: flex;
    align-items: center;
    justify-content: center;

    color: white;

    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

/* ICON COLORS MATCH CARDS */
.summary-card.card-teal .summary-icon {
    background: linear-gradient(135deg, #1b867c, #0f766e);
}

.summary-card.card-blue .summary-icon {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.summary-card.card-orange .summary-icon {
    background: linear-gradient(135deg, #f59e0b, #ea580c);
}

.summary-card.card-purple .summary-icon {
    background: linear-gradient(135deg, #8b5cf6, #6d28d9);
}

/* TEXT */
.summary-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: #64748b;
}

.value {
    font-size: 15px;
    font-weight: 800;
    color: #0f172a;
}

.sub {
    font-size: 12px;
    color: #94a3b8;
}

/* =========================
   PANEL
========================= */
.visitor-panel {
    position: relative;

    border-radius: 26px;

    overflow: hidden;

    border: 1px solid rgba(226, 232, 240, 0.65);

    /* very soft neutral gradient (NOT colored) */
    /* background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%); */

    /* box-shadow: 0 18px 45px rgba(15, 23, 42, 0.06),
        0 2px 8px rgba(15, 23, 42, 0.03); */

    transition: all 0.3s ease;
}

/* subtle premium lift */
.visitor-panel:hover {
    transform: translateY(-5px);

    /* box-shadow: 0 28px 70px rgba(15, 23, 42, 0.1),
        0 6px 18px rgba(15, 23, 42, 0.06); */
}

/* =========================
   VERY SUBTLE LIGHT GLOW (NOT COLORED)
========================= */
.visitor-panel::before {
    content: "";
    position: absolute;
    inset: 0;

    /* background: radial-gradient(circle at top right,
            rgba(255, 255, 255, 0.9),
            transparent 60%); */

    opacity: 0.6;

    pointer-events: none;
}

/* =========================
   HEADER (CLEAN ENTERPRISE STYLE)
========================= */
.panel-title {
    position: relative;

    padding: 28px 28px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    background: linear-gradient(180deg,
            rgba(248, 250, 252, 0.9),
            rgba(255, 255, 255, 0.6));

    border-bottom: 1px solid rgba(226, 232, 240, 0.6);
}

/* thin elegant top line */
.panel-title::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 2px;

    /* background: linear-gradient(90deg,
            rgba(148, 163, 184, 0.2),
            rgba(148, 163, 184, 0.05)); */
}

/* =========================
   LEFT SIDE
========================= */
.panel-title-left {
    display: flex;
    gap: 16px;
    align-items: center;
}

/* ICON (VERY CLEAN) */
.panel-icon {
    width: 44px;
    height: 44px;

    border-radius: 16px;

    background: linear-gradient(135deg, #f8fafc, #eef2f7);

    border: 1px solid rgba(226, 232, 240, 0.8);

    display: flex;
    align-items: center;
    justify-content: center;

    color: #0f172a;

    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
}

/* TITLE */
.title {
    font-size: 16px;
    font-weight: 900;
    color: #0f172a;
    letter-spacing: 0.2px;
}

/* SUBTITLE */
.subtitle {
    font-size: 12px;
    font-weight: 600;
    color: #64748b;

    margin-top: 4px;
}

/* =========================
   RIGHT BADGE (CLEAN GLASS STYLE)
========================= */
.panel-badge {
    padding: 8px 14px;

    border-radius: 999px;

    font-size: 11px;
    font-weight: 800;

    color: #334155;

    background: rgba(248, 250, 252, 0.8);

    border: 1px solid rgba(226, 232, 240, 0.9);

    backdrop-filter: blur(10px);

    box-shadow: 0 6px 14px rgba(15, 23, 42, 0.05);
}

/* =========================
   BODY
========================= */
.panel-body {
    padding: 24px 28px;
}

/* visitor */
.visitor {
    display: flex;
    gap: 10px;
    align-items: center;
}

.avatar {
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

.name {
    font-weight: 700;
}

.sub {
    font-size: 11px;
    color: #94a3b8;
}

/* actions */
.actions {
    display: flex;
    justify-content: flex-end;
    gap: 6px;
}

.approve {
    background: rgba(34, 197, 94, 0.12);
    color: #16a34a;
}

.reject {
    background: rgba(239, 68, 68, 0.12);
    color: #dc2626;
}

/* pagination */
.pagination {
    display: flex;
    justify-content: space-between;
    padding: 12px;
    align-items: center;
}

/* empty */
.empty {
    text-align: center;
    padding: 20px;
    color: #94a3b8;
}

/* footer */
.dialog-footer {
    padding: 16px;
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #f1f5f9;
}

/* =========================
   PREMIUM CLOSE BUTTON
========================= */
.premium-close-btn {
    position: relative;

    overflow: hidden;

    padding: 0 28px !important;

    border-radius: 22px !important;

    text-transform: none !important;

    display: flex;
    align-items: center;
    gap: 14px;

    background: linear-gradient(145deg,
            rgba(255, 255, 255, 0.95),
            rgba(248, 250, 252, 0.96)) !important;

    border: 1px solid rgba(226, 232, 240, 0.9);

    backdrop-filter: blur(16px);

    box-shadow: 0 12px 35px rgba(15, 23, 42, 0.06),
        inset 0 1px 0 rgba(255, 255, 255, 0.95);

    transition: transform 0.28s ease, box-shadow 0.28s ease,
        border-color 0.28s ease;

    z-index: 1;
}

/* =========================
   LIGHT GLOW
========================= */
.btn-glow {
    position: absolute;

    inset: 0;

    background: linear-gradient(135deg,
            rgba(27, 134, 124, 0.08),
            rgba(0, 59, 115, 0.04),
            transparent);

    opacity: 0;

    transition: opacity 0.3s ease;

    z-index: 0;
}

/* =========================
   ICON WRAP
========================= */
.btn-icon-wrap {
    width: 34px;
    height: 34px;

    border-radius: 12px;

    display: flex;
    align-items: center;
    justify-content: center;

    /* background: linear-gradient(135deg,
            rgba(27, 134, 124, 0.12),
            rgba(0, 59, 115, 0.08)); */

    /* border: 1px solid rgba(27, 134, 124, 0.1); */

    color: #ffffff;

    position: relative;

    z-index: 2;

    transition: all 0.28s ease;
}

/* =========================
   TEXT
========================= */
.btn-text {
    font-size: 14px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.3px;

    /* color: #0f172a; */

    position: relative;

    z-index: 2;
}

/* =========================
   HOVER
========================= */
.premium-close-btn:hover {
    transform: translateY(-3px);

    border-color: rgba(27, 134, 124, 0.2);

    box-shadow: 0 20px 45px rgba(15, 23, 42, 0.1),
        0 0 0 4px rgba(27, 134, 124, 0.04);
}

/* glow appear */
.premium-close-btn:hover .btn-glow {
    opacity: 1;
}

/* icon animate */
.premium-close-btn:hover .btn-icon-wrap {
    transform: rotate(-8deg) scale(1.06);

    background: linear-gradient(135deg, #1b867c, #003b73);

    color: white;

    box-shadow: 0 12px 24px rgba(0, 59, 115, 0.25);
}

/* =========================
   ACTIVE
========================= */
.premium-close-btn:active {
    transform: scale(0.98);
}

/* =====================================================
    PAGE
===================================================== */

.gate-page {
    padding: 30px;
    min-height: 100vh;
}

/* =====================================================
    HEADER
===================================================== */

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    gap: 20px;
    flex-wrap: wrap;

    margin-bottom: 28px;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 18px;
}

.header-icon {
    width: 50px;
    height: 50px;

    border-radius: 26px;

    background: linear-gradient(135deg, #26a69a, #114575, #003b73);

    display: flex;
    align-items: center;
    justify-content: center;

    color: white;

    box-shadow: 0 18px 45px rgba(17, 69, 117, 0.25);
}

.header-badge {
    width: fit-content;

    padding: 6px 12px;

    border-radius: 30px;

    background: rgba(38, 166, 154, 0.1);

    color: #008080;

    font-size: 11px;
    font-weight: 700;

    letter-spacing: 1px;

    margin-bottom: 10px;
}

.page-title {
    font-size: 20px;
    font-weight: 800;

    color: #0f172a;

    line-height: 1.1;
}

.page-subtitle {
    margin-top: 6px;

    color: #64748b;

    font-size: 15px;
}

/* =====================================================
    TOP CHIPS
===================================================== */

.header-right {
    display: flex;
    align-items: center;
    gap: 12px;
}

.top-chip {
    height: 44px;

    padding: 0 16px;

    border-radius: 14px;

    display: flex;
    align-items: center;
    gap: 8px;

    font-size: 13px;
    font-weight: 700;
}

.role-chip {
    background: linear-gradient(135deg,
            rgba(38, 166, 154, 0.14),
            rgba(17, 69, 117, 0.12));

    color: #114575;
}

.time-chip {
    background: white;

    border: 1px solid #e2e8f0;

    color: #334155;
}

/* =====================================================
    TABLE CONTAINER
===================================================== */

.table-container {
    background: white;

    border-radius: 32px;

    padding: 28px;

    border: 1px solid #e2e8f0;

    box-shadow: 0 25px 70px rgba(15, 23, 42, 0.05);
}

/* =====================================================
    TOOLBAR
===================================================== */

.table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;

    gap: 20px;
    flex-wrap: wrap;

    margin-bottom: 24px;
}

.toolbar-title {
    font-size: 18px;
    font-weight: 800;
    background: linear-gradient(135deg, #1b867c, #003b73, #0f172a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.toolbar-subtitle {
    margin-top: 4px;

    color: #64748b;
}

.toolbar-actions {
    display: flex;
    align-items: center;
    gap: 14px;
}

.search-field {
    width: 340px;
}

.rows-field {
    width: 110px;
}

.search-field :deep(.v-field),
.rows-field :deep(.v-field) {
    border-radius: 50px;

    background: #f8fafc;

    box-shadow: none !important;
}

/* =====================================================
    TABLE
===================================================== */

.table-wrapper {
    width: 100%;
    overflow-x: auto;
}

.table-head {
    min-width: 1150px;

    display: grid;
    grid-template-columns:0.5fr 1.8fr 1.5fr 1.5fr 1.5fr 1.5fr 1.5fr 1.0fr;
    align-items: center;
    padding: 18px 22px;

    background: linear-gradient(135deg, #1b867c, #003b73, #0f172a);

    margin-bottom: 14px;

    /* ONLY TOP CORNERS CURVED */
    border-radius: 20px 20px 0 0;
}

.th {
    color: rgba(255, 255, 255, 0.88);

    font-size: 13px;
    font-weight: 700;
}

.th,
.td {
    display: flex;
    align-items: center;
}

/* =====================================================
    ROWS
===================================================== */

.table-row {
    min-width: 1150px;

    display: grid;
    grid-template-columns:0.5fr 1.8fr 1.5fr 1.5fr 1.5fr 1.5fr 1.5fr 1.0fr;
    align-items: center;

    padding: 18px 22px;

    border-radius: 22px;

    border: 1px solid #edf2f7;

    margin-bottom: 12px;

    transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}

.table-row:hover {
    transform: translateY(-3px);

    background: linear-gradient(to right,
            rgba(38, 166, 154, 0.02),
            rgba(17, 69, 117, 0.03));

    box-shadow: 0 20px 45px rgba(15, 23, 42, 0.06);
}

.td {
    font-size: 14px;

    color: #334155;
}

/* =====================================================
    VISITOR
===================================================== */

.visitor-box {
    display: flex;
    align-items: center;
    gap: 14px;
}

.avatar {
    width: 52px;
    height: 52px;

    border-radius: 18px;

    background: linear-gradient(135deg, #26a69a, #114575, #003b73);

    display: flex;
    align-items: center;
    justify-content: center;

    color: white;

    font-size: 18px;
    font-weight: 800;
}

.visitor-name {
    font-weight: 700;

    color: #0f172a;
}

.visitor-id {
    margin-top: 4px;

    font-size: 12px;

    color: #94a3b8;
}

/* =====================================================
    PASS CHIP
===================================================== */

.pass-chip {
    width: fit-content;

    padding: 8px 12px;

    border-radius: 12px;

    background: rgba(17, 69, 117, 0.08);

    color: #114575;

    font-size: 12px;
    font-weight: 700;
}

/* =====================================================
    STATUS
===================================================== */

.status-chip {
    border-radius: 12px !important;

    font-weight: 700;
}

.status-orange {
    background: #fff7ed;
    color: #ea580c;
}

.status-green {
    background: #ecfdf5;
    color: #16a34a;
}

.status-purple {
    background: #f3e8ff;
    color: #7c3aed;
}

.status-blue {
    background: #dbeafe;
    color: #2563eb;
}

.status-red {
    background: #fee2e2;
    color: #dc2626;
}

/* =====================================================
    ACTIONS
===================================================== */

.actions {
    display: flex;
    gap: 10px;
}

.approve-btn {
    background: rgba(22, 163, 74, 0.08);

    color: #16a34a;

    border-radius: 14px !important;
}

.reject-btn {
    background: rgba(220, 38, 38, 0.08);

    color: #dc2626;

    border-radius: 14px !important;
}

.approve-btn:hover,
.reject-btn:hover {
    transform: translateY(-2px);
}

.completed-text {
    color: #f59e0b;

    font-size: 13px;
    font-weight: 600;
}

.expired-text {
    color: #f72d4e;

    font-size: 13px;
    font-weight: 600;
}

/* =====================================================
    FOOTER
===================================================== */

.table-footer {
    margin-top: 28px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    gap: 20px;
    flex-wrap: wrap;
}

.footer-info {
    color: #64748b;

    font-size: 14px;
}

.footer-info strong {
    color: #0f172a;
}

/* =====================================================
    PAGINATION
===================================================== */

.pagination-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
}

.page-btn,
.nav-btn {
    width: 42px;
    height: 42px;

    border: none;

    border-radius: 14px;

    background: #f8fafc;

    color: #475569;

    font-weight: 700;

    transition: 0.25s ease;

    cursor: pointer;
}

.page-btn:hover,
.nav-btn:hover {
    background: rgba(38, 166, 154, 0.12);

    color: #008080;
}

.page-btn.active {
    background: linear-gradient(135deg, #26a69a, #114575);

    color: white;

    box-shadow: 0 12px 30px rgba(17, 69, 117, 0.25);
}

.nav-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

/* =====================================================
    EMPTY
===================================================== */

.empty-state {
    padding: 90px 20px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    color: #94a3b8;
}

.empty-icon {
    margin-bottom: 20px;
}

/* =====================================================
    ANIMATION
===================================================== */

.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(10px);
}

/* =====================================================
    MOBILE
===================================================== */

@media (max-width: 1200px) {
    .table-wrapper {
        overflow-x: auto;
    }
}

@media (max-width: 768px) {

    .page-header,
    .table-toolbar,
    .table-footer {
        flex-direction: column;
        align-items: flex-start;
    }

    .toolbar-actions {
        width: 100%;
        flex-direction: column;
    }

    .search-field,
    .rows-field {
        width: 100%;
    }

    .page-title {
        font-size: 28px;
    }
}

/* =========================================================
   PREMIUM VISITOR APPROVAL DIALOG
   LIGHT / PREMIUM VERSION
========================================================= */

.premium-visitor-dialog {
    background: #ffffff;
    color: #0f172a;
    overflow: hidden;
    border: 1px solid #eef2f7;
    box-shadow:
        0 20px 50px rgba(15, 23, 42, 0.08),
        0 8px 20px rgba(15, 23, 42, 0.04);
}

/* =========================================================
   HEADER
========================================================= */

.pv-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 24px;
    background:
        linear-gradient(135deg,
            rgba(59, 130, 246, 0.05),
            rgba(16, 185, 129, 0.04));
    border-bottom: 1px solid #edf2f7;
}

.pv-icon-ring {
    width: 52px;
    height: 52px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eff6ff;
    border: 1px solid #dbeafe;
}

.pv-header-text {
    flex: 1;
    margin-left: 14px;
}

.pv-title {
    font-size: 19px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: 0.2px;
}

.pv-subtitle {
    font-size: 13px;
    color: #64748b;
    margin-top: 3px;
}

.pv-status {
    padding: 7px 14px;
    border-radius: 999px;
    background: #fef3c7;
    color: #b45309;
    font-size: 12px;
    font-weight: 700;
    border: 1px solid #fde68a;
}

/* =========================================================
   BODY
========================================================= */

.pv-body {
    padding: 22px 24px;
}

/* =========================================================
   VISITOR CARD
========================================================= */

.pv-visitor-card {
    display: flex;
    align-items: center;
    padding: 18px;
    border-radius: 18px;
    background: #f8fafc;
    border: 1px solid #edf2f7;
    margin-bottom: 18px;
}

.pv-avatar {
    width: 52px;
    height: 52px;
    border-radius: 16px;
    background: linear-gradient(135deg, #1b867c, #003B73, #0f172a);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 18px;
    font-weight: 700;
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.18);
}

.pv-visitor-info {
    margin-left: 14px;
}

.pv-name {
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
}

.pv-meta {
    margin-top: 5px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 5px;

    font-size: 12.5px;
    color: #64748b;
}

/* =========================================================
   INFO GRID
========================================================= */

.pv-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 18px;
}

.pv-info-card {
    display: flex;
    align-items: flex-start;
    gap: 10px;

    padding: 16px;
    border-radius: 16px;

    background: #ffffff;
    border: 1px solid #edf2f7;

    transition: 0.25s ease;
}

.pv-info-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
}

.pv-info-card div {
    font-size: 12.5px;
    color: #64748b;
}

.pv-info-card strong {
    display: block;
    margin-top: 4px;

    color: #0f172a;
    font-size: 13px;
    font-weight: 700;
}

/* =========================================================
   WARNING BOX
========================================================= */

.pv-warning {
    display: flex;
    align-items: flex-start;
    gap: 10px;

    padding: 16px;
    border-radius: 16px;

    background: #fff7ed;
    border: 1px solid #fed7aa;

    color: #9a3412;
    font-size: 13px;
    line-height: 1.5;
}

/* =========================================================
   FOOTER
========================================================= */

.pv-footer {
    display: flex;
    align-items: center;

    padding: 18px 24px;

    background: #fcfcfd;
    border-top: 1px solid #edf2f7;
}

/* =========================================================
   BUTTONS
========================================================= */

.pv-reject {
    color: #ef4444 !important;
    font-weight: 600;
}

.pv-cancel {
    border-radius: 12px !important;
    border-color: #dbe3ec !important;
    color: #475569 !important;
    margin-right: 10px;
}

.pv-approve {
    border-radius: 14px !important;
    padding: 0 20px !important;
    height: 44px !important;

    background: linear-gradient(135deg,
            #3b82f6,
            #2563eb) !important;

    color: white !important;
    font-weight: 700;
    letter-spacing: 0.2px;

    box-shadow:
        0 10px 24px rgba(37, 99, 235, 0.22);

    transition: 0.25s ease;
}

.pv-approve:hover {
    transform: translateY(-1px);
    box-shadow:
        0 14px 30px rgba(37, 99, 235, 0.28);
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 600px) {

    .pv-info-grid {
        grid-template-columns: 1fr;
    }

    .pv-header {
        flex-wrap: wrap;
        gap: 12px;
    }

    .pv-status {
        margin-left: 66px;
    }

}

/* =========================================================
    PREMIUM REVIEW BUTTON
========================================================= */

.premium-review-btn {
    position: relative;

    overflow: hidden;

    height: 44px !important;

    padding: 0 18px 0 12px !important;

    border-radius: 16px !important;

    display: flex;
    align-items: center;
    gap: 12px;
    text-transform: none !important;
    background:
        linear-gradient(135deg,
            #2563eb,
            #3b82f6) !important;

    color: white !important;
    border: 1px solid rgba(255, 255, 255, 0.12);

    box-shadow:
        0 10px 25px rgba(37, 99, 235, 0.22),
        inset 0 1px 0 rgba(255, 255, 255, 0.15);

    transition:
        transform 0.35s ease,
        box-shadow 0.35s ease,
        background 0.35s ease;
}

/* GLOW EFFECT */
.premium-review-btn .btn-glow {
    position: absolute;

    width: 120px;
    height: 120px;

    background:
        radial-gradient(circle,
            rgba(255, 255, 255, 0.22),
            transparent 70%);

    top: -45px;
    left: -35px;

    pointer-events: none;
}

/* ICON WRAPPER */
.btn-icon-wrap {
    width: 28px;
    height: 28px;

    border-radius: 10px;

    display: flex;
    align-items: center;
    justify-content: center;

    /* background:
        rgba(255, 255, 255, 0.14); */

    backdrop-filter: blur(10px);

    border:
        1px solid rgba(255, 255, 255, 0.12);

    position: relative;
    z-index: 2;

    transition: all 0.3s ease;
}

/* TEXT */
.btn-text {
    position: relative;
    z-index: 2;

    font-size: 13px;
    font-weight: 700;

    letter-spacing: 0.2px;
}

/* ARROW */
.btn-arrow {
    position: relative;
    z-index: 2;

    opacity: 0.85;

    transition:
        transform 0.3s ease,
        opacity 0.3s ease;
}

/* HOVER */
.premium-review-btn:hover {
    transform: translateY(-2px);

    box-shadow:
        0 18px 35px rgba(37, 99, 235, 0.32),
        inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

/* ICON ANIMATION */
.premium-review-btn:hover .btn-icon-wrap {
    transform: scale(1.05);

    background:
        rgba(255, 255, 255, 0.18);
}

/* ARROW MOVE */
.premium-review-btn:hover .btn-arrow {
    transform: translateX(4px);

    opacity: 1;
}

/* CLICK */
.premium-review-btn:active {
    transform: scale(0.98);
}

/* RESPONSIVE */
@media (max-width: 600px) {
    .premium-review-btn {
        width: 100%;
        justify-content: center;
    }
}

/* =========================
   PREMIUM SUBMIT DIALOG
========================= */

.premium-submit-dialog {
    overflow: hidden;
    background: #ffffff;
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow:
        0 24px 60px rgba(15, 23, 42, 0.10),
        0 8px 24px rgba(15, 23, 42, 0.05);
}

/* TOP */
.psd-top {
    position: relative;
    padding: 10px 14px 18px;
    text-align: center;
    background:
        linear-gradient(135deg,
            #eff6ff 0%,
            #ffffff 60%,
            #f8fafc 100%);
    overflow: hidden;
}

.psd-glow {
    position: absolute;
    width: 220px;
    height: 220px;
    background: rgba(37, 99, 235, 0.10);
    border-radius: 50%;
    top: -120px;
    right: -80px;
    filter: blur(10px);
}

.psd-icon-wrap {
    position: relative;
    z-index: 2;
    margin-bottom: 10px;
}

.psd-icon-ring {
    width: 78px;
    height: 78px;
    margin: auto;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background:
        linear-gradient(145deg,
            #ffffff,
            #e0ecff);

    border: 1px solid rgba(37, 99, 235, 0.12);

    box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.8),
        0 10px 24px rgba(37, 99, 235, 0.12);
}

.psd-title {
    position: relative;
    z-index: 2;
    font-size: 20px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.5px;
}

.psd-subtitle {
    position: relative;
    z-index: 2;
    margin-top: 10px;
    font-size: 14px;
    line-height: 1.7;
    color: #64748b;
    max-width: 470px;
    margin-left: auto;
    margin-right: auto;
}

/* BODY */
.psd-body {
    padding: 30px 34px;
}

/* VISITOR CARD */
.psd-visitor-card {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 22px;
    border-radius: 22px;
    background: #f8fafc;
    border: 1px solid rgba(148, 163, 184, 0.16);
}

.psd-avatar {
    width: 64px;
    height: 64px;
    border-radius: 18px;
    background: linear-gradient(135deg, #1b867c, #003B73, #0f172a);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 700;

    box-shadow:
        0 10px 24px rgba(37, 99, 235, 0.18);
}

.psd-visitor-info {
    flex: 1;
}

.psd-name {
    font-size: 19px;
    font-weight: 700;
    color: #0f172a;
}

.psd-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 8px;
    color: #64748b;
    font-size: 13px;
}

.psd-meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
}

.psd-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #cbd5e1;
}

.psd-badge {
    padding: 8px 14px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    color: #b45309;
    background: rgba(245, 158, 11, 0.12);
    border: 1px solid rgba(245, 158, 11, 0.18);
}

/* INFO GRID */
.psd-grid {
    margin-top: 22px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
}

.psd-info-card {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 20px;
    border-radius: 20px;
    background: white;
    border: 1px solid rgba(148, 163, 184, 0.14);
}

.psd-info-icon {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.blue-soft {
    background: rgba(37, 99, 235, 0.10);
    color: #2563eb;
}

.amber-soft {
    background: rgba(245, 158, 11, 0.12);
    color: #d97706;
}

.psd-info-text {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.psd-info-text span {
    font-size: 12px;
    color: #64748b;
}

.psd-info-text strong {
    font-size: 14px;
    color: #0f172a;
    font-weight: 700;
}

/* NOTICE */
.psd-notice {
    margin-top: 24px;
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 18px 20px;
    border-radius: 18px;
    background: #eff6ff;
    border: 1px solid rgba(37, 99, 235, 0.12);
}

.psd-notice-icon {
    margin-top: 2px;
}

.psd-notice-text {
    font-size: 13px;
    line-height: 1.7;
    color: #475569;
}

/* FOOTER */
.psd-footer {
    display: flex;
    align-items: center;
    padding: 22px 30px;
    border-top: 1px solid rgba(148, 163, 184, 0.12);
    background: #fcfcfd;
}

.psd-cancel {
    color: #64748b !important;
    font-weight: 600;
    text-transform: none;
    letter-spacing: 0;
}

.psd-submit-btn {
    height: 50px !important;
    padding: 0 26px !important;
    border-radius: 16px !important;
    text-transform: none !important;
    letter-spacing: 0 !important;
    font-weight: 700 !important;
    font-size: 14px !important;
    background:
        linear-gradient(135deg,
            #2563eb,
            #3b82f6) !important;
    color: white !important;
    box-shadow:
        0 12px 28px rgba(37, 99, 235, 0.22);
}

.psd-submit-btn:hover {
    transform: translateY(-1px);
}

.notice-name {
    display: inline-flex;

    padding: 2px 10px;
    margin: 0 4px;

    border-radius: 999px;

    background: rgba(16, 75, 185, 0.12);
    color: #3b82f6;

    font-weight: 700;
    font-size: 13px;

    border: 1px solid rgba(16, 185, 129, 0.25);

    box-shadow: 0 2px 10px rgba(16, 185, 129, 0.08);
}

.tx-premium {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    overflow: hidden;

}

/* ================= HEADER ================= */
.tx-header-premium {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 22px 26px;
    background: linear-gradient(135deg, #1d4ed8, #3b82f6);
    color: white;
}

.tx-header-left {
    display: flex;
    align-items: center;
    gap: 14px;
}

.tx-icon-premium {
    width: 46px;
    height: 46px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
}

.tx-title-premium {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.3px;
}

.tx-subtitle-premium {
    font-size: 13px;
    opacity: 0.9;
    margin-top: 2px;
}

.tx-chip-premium {
    background: rgba(255, 255, 255, 0.18);
    padding: 6px 12px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
}

/* ================= BODY ================= */
.tx-body-premium {
    padding: 26px;
    background: #f8fafc;
    max-height: 600px;
    overflow-y: auto;
}

/* ================= ITEM ================= */
.tx-item-premium {
    display: flex;
    gap: 14px;
    margin-bottom: 18px;
}

/* TIMELINE */
.tx-timeline-premium {
    width: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.tx-dot-premium {
    width: 12px;
    height: 12px;
    background: #2563eb;
    border-radius: 50%;
    box-shadow: 0 0 0 5px rgba(37, 99, 235, 0.15);
    z-index: 2;
}

.tx-line-premium {
    width: 2px;
    flex: 1;
    background: #e2e8f0;
    margin-top: 6px;
}

/* CARD */
.tx-card-premium {
    flex: 1;
    background: white;
    border-radius: 16px;
    padding: 16px 16px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);
    transition: 0.2s ease;
}

.tx-card-premium:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
}

/* TOP */
.tx-top-premium {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.tx-date-premium {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #475569;
}

.tx-gate-premium {
    font-size: 11px;
    padding: 5px 10px;
    border-radius: 999px;
    background: #eef2ff;
    color: #1d4ed8;
    font-weight: 600;
}

/* STATUS PILLS */
.tx-status-premium {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
}

.pill {
    font-size: 11px;
    padding: 5px 10px;
    border-radius: 999px;
    font-weight: 600;
    letter-spacing: 0.3px;
}

.pill.checkin {
    background: #dcfce7;
    color: #16a34a;
}

.pill.checkout {
    background: #ffedd5;
    color: #ea580c;
}

/* META */
.tx-meta-premium {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 12px;
    color: #64748b;
}

.tx-meta-row {
    display: flex;
    align-items: center;
    gap: 6px;
}

/* EMPTY */
.tx-empty-premium {
    text-align: center;
    padding: 60px 20px;
    color: #94a3b8;
}

.tx-empty-icon {
    margin-bottom: 10px;
}

/* FOOTER */
.tx-footer-premium {
    padding: 14px 20px;
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #e2e8f0;
    background: white;
}

.tx-close-premium {
    background: #2563eb;
    color: white;
    font-weight: 600;
}

.pdf-premium-card {
    background: #0b1220;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.06);
}

/* HEADER */
.pdf-premium-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: linear-gradient(135deg, #1b867c, #003B73, #0f172a);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.pdf-premium-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.pdf-badge {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    background: linear-gradient(135deg, #ef4444, #b91c1c);
    display: flex;
    align-items: center;
    justify-content: center;
}

.pdf-title {
    font-size: 15px;
    font-weight: 600;
    color: #fff;
}

.pdf-subtitle {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
}

/* ACTIONS */
.pdf-premium-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.action-btn {
    text-transform: none;
    font-size: 12px;
    font-weight: 500;
    border-radius: 10px;
}

.action-btn.download {
    background: #16a34a;
    color: white;
}

.action-btn.open {
    background: #2563eb;
    color: white;
}

.close-btn {
    background: transparent !important;
    box-shadow: none !important;
    padding: 0 !important;
    min-width: 0 !important;
    width: auto !important;
    height: auto !important;
}

/* BODY */
.pdf-premium-body {
    height: 80vh;
    background: #0a0f1c;
}

/* IFRAME */
.pdf-frame {
    width: 100%;
    height: 100%;
    border: none;
}


</style>
