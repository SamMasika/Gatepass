<template>
<div class="smart-dropdown">

    <!-- LABEL -->
    <div v-if="label" class="dropdown-label">
        {{ label }}
    </div>

    <!-- AUTOCOMPLETE -->
    <v-autocomplete v-model="internalValue" v-model:search="search" :items="items" :loading="loading" :item-title="itemTitle" item-value="id" density="comfortable" :placeholder="placeholder" variant="plain" hide-details flat class="ultra-premium-autocomplete" :menu-props="{
        contentClass: 'ultra-premium-menu',
        transition: false
    }">

        <!-- PREPEND -->
        <template #prepend-inner>

            <div class="search-icon-wrapper">

                <div class="search-icon-glow"></div>

                <v-icon size="18" color="#64748b">
                    mdi-magnify
                </v-icon>

            </div>

        </template>

        <!-- ITEM -->
        <template #item="{ props, item }">

            <v-list-item v-bind="props" class="premium-dropdown-item" rounded="xl">

                <template #prepend>

                    <div class="premium-avatar">

                        <div class="avatar-shine"></div>

                        {{
                        item.raw[itemTitle]
                            ? item.raw[itemTitle]
                                .charAt(0)
                                .toUpperCase()
                            : 'A'
                    }}

                    </div>

                </template>

                <v-list-item-title class="premium-item-text">
                    {{ item.raw[itemTitle] }}
                </v-list-item-title>

            </v-list-item>

        </template>

        <!-- EMPTY -->
        <template #no-data>

            <div class="premium-empty-state">

                <div class="empty-icon-wrap">

                    <v-icon size="42">
                        mdi-database-search-outline
                    </v-icon>

                </div>

                <div class="empty-title">
                    No Results Found
                </div>

                <div class="empty-subtitle">
                    Try another keyword or search term
                </div>

            </div>

        </template>

        <!-- LOADING -->
        <template #append-item>

            <div v-if="loading" class="premium-loading">

                <v-progress-circular indeterminate size="20" width="2" color="primary" />

                <span>
                    Fetching data...
                </span>

            </div>

        </template>

        <!-- LOAD MORE -->
        <!-- ADD COMPANY (TOP OF DROPDOWN) -->
        <template #prepend-item>

            <div @click.stop="openDialog">
                <v-btn block elevation="0" rounded="lg" class="button-color">
                    <v-icon start size="18">mdi-plus-circle-outline</v-icon>
                    Add New Company
                </v-btn>
            </div>

            <!-- KEEP EXISTING LOAD MORE BELOW -->
            <div v-if="hasMore && !loading && items.length" class="load-more-container">

                <v-btn block elevation="0" rounded="xl" class="premium-load-btn" @click="loadMore">

                    <v-icon start size="18">
                        mdi-arrow-down-circle-outline
                    </v-icon>

                    Load More Results

                </v-btn>

            </div>

        </template>
    </v-autocomplete>

    <v-dialog v-model="dialog" max-width="760" persistent transition="dialog-bottom-transition">

        <!-- DIALOG -->
        <v-card class="premium-dialog overflow-hidden" rounded="xl" elevation="0">

            <!-- HEADER -->
            <div class="dialog-header">

                <div class="header-glow"></div>

                <div class="d-flex align-center justify-space-between flex-wrap position-relative">

                    <div class="d-flex align-center">

                        <div class="dialog-icon">

                            <v-icon size="34" color="white">
                                {{
                                            company.id
                                                ? 'mdi-domain'
                                                : 'mdi-domain'
                                        }}
                            </v-icon>

                        </div>

                        <div class="ml-5">

                            <div class="dialog-title">
                                {{
                                            company.id
                                                ? 'Edit Company / Source'
                                                : 'Create Company / Visitor Source'
                                        }}
                            </div>

                            <div class="dialog-subtitle">
                                Manage visitor origin companies or organizations
                            </div>

                        </div>

                    </div>

                    <div class="dialog-badge mt-4 mt-md-0">

                        <v-icon size="18" class="mr-2">
                            mdi-map-marker-radius-outline
                        </v-icon>

                        Visitor Tracking

                    </div>

                </div>

            </div>

            <!-- BODY -->
            <div class="dialog-body">

                <v-form>

                    <v-row>

                        <!-- NAME -->
                        <v-col cols="12">

                            <div class="premium-input-group">

                                <label class="premium-label">
                                    Company / Visitor Source Name
                                </label>

                                <v-text-field v-model="company.name" placeholder="e.g. NIDC, Ministry, Private Company, NGO" variant="solo-filled" flat rounded="xl" hide-details prepend-inner-icon="mdi-domain" class="premium-input" />

                            </div>

                        </v-col>

                        <!-- EMAIL -->
                        <v-col cols="12" md="6">

                            <div class="premium-input-group">

                                <label class="premium-label">
                                    Email
                                </label>

                                <v-text-field v-model="company.email" placeholder="Enter email" variant="solo-filled" flat rounded="xl" hide-details prepend-inner-icon="mdi-email-outline" class="premium-input" />

                            </div>

                        </v-col>

                        <!-- PHONE -->
                        <v-col cols="12" md="6">

                            <div class="premium-input-group">

                                <label class="premium-label">
                                    Phone
                                </label>

                                <v-text-field v-model="company.phone" placeholder="Enter phone number" variant="solo-filled" flat rounded="xl" hide-details prepend-inner-icon="mdi-phone-outline" class="premium-input" />

                            </div>

                        </v-col>

                        <!-- ADDRESS -->
                        <v-col cols="12">

                            <div class="premium-input-group">

                                <label class="premium-label">
                                    Address / Location
                                </label>

                                <v-textarea v-model="company.address" placeholder="Enter company address or visitor origin location" variant="solo-filled" flat rounded="xl" rows="3" hide-details prepend-inner-icon="mdi-map-marker-outline" class="premium-input" />

                            </div>

                        </v-col>

                    </v-row>

                </v-form>

            </div>

            <!-- FOOTER -->
            <div class="dialog-footer">

                <v-btn variant="outlined" rounded="xl" height="48" class="px-8 cancel-dialog-btn" @click="closeDialog">
                    Cancel
                </v-btn>

                <v-btn rounded="xl" height="48" class="px-8 button-color ml-3" elevation="0" @click="saveCompany">

                    <v-icon start size="18">
                        mdi-content-save-outline
                    </v-icon>

                    {{
                                company.id
                                    ? 'Update Company'
                                    : 'Save Company'
                            }}

                </v-btn>

            </div>

        </v-card>

    </v-dialog>

</div>
</template>

<script>
import swtalert from "@/mixins/swtalert";
import axios from "axios";

export default {

    name: "PaginatedDropdownCompany",
    mixins: [swtalert],

    props: {

        apiEndpoint: {
            type: String,
            required: true
        },

        label: {
            type: String,
            default: ""
        },

        placeholder: {
            type: String,
            default: "Search..."
        },

        itemTitle: {
            type: String,
            required: true
        },

        modelValue: [
            String,
            Number,
            Object
        ]

    },

    data() {

        return {

            internalValue: this.modelValue,

            items: [],

            search: "",

            page: 1,

            loading: false,

            hasMore: true,

            debounce: null,
            dialog: false,
            company: {
                id: null,
                name: '',
                email: '',
                phone: '',
                address: ''
            },

        };

    },

    watch: {

        modelValue(val) {
            this.internalValue = val;
        },

        internalValue(val) {
            this.$emit("update:modelValue", val);
        },

        search() {

            clearTimeout(this.debounce);

            this.debounce = setTimeout(() => {

                this.resetAndFetch();

            }, 400);

        }

    },

    mounted() {

        this.fetchData(true);

    },

    methods: {

        /* RESET */
        resetAndFetch() {

            this.page = 1;

            this.items = [];

            this.hasMore = true;

            this.fetchData(true);

        },
        closeDialog() {
            this.dialog = false
        },
        openDialog() {
            // this.selectedVisitor = JSON.parse(JSON.stringify(item));
            this.dialog = true;
        },
        saveCompany() {
            const request = this.company.id ?
                axios.put(`/companies/${this.company.id}`, this.company) :
                axios.post('/companies', this.company)

            request
                .then(res => {
                    this.dialog = false
                    this.showAlert(res.data.message, 'success')

                    setTimeout(() => {
                        window.location.reload()
                    }, 1000) // optional delay to allow user to see the success message
                })
                .catch(err => {
                    this.showAlert(
                        err.response.data.message || 'Error occurred',
                        'error'
                    )
                })
        },

        /* FETCH */
        async fetchData(reset = false) {

            if (this.loading) return;

            this.loading = true;

            try {

                const res = await axios.get(
                    this.apiEndpoint, {
                        params: {
                            page: this.page,
                            search: this.search || ""
                        }
                    }
                );

                const root = res.data.data;
                const newItems = root.data || [];

                if (reset || this.page === 1) {
                    this.items = newItems;
                } else {
                    this.items = [...this.items, ...newItems];
                }

                this.hasMore = this.page < root.last_page;

            } catch (err) {

                console.error(
                    "Dropdown fetch error:",
                    err
                );

            } finally {

                this.loading = false;

            }

        },

        /* LOAD MORE */
        loadMore() {

            if (!this.hasMore) return;

            this.page++;

            this.fetchData();

        }

    }

};
</script>

<style scoped>
/* ========================================
    WRAPPER
======================================== */

.smart-dropdown {
    width: 100%;
}

/* ========================================
    LABEL
======================================== */

.dropdown-label {
    margin-bottom: 12px;

    font-size: 14px;
    font-weight: 700;

    color: #334155;
}

/* ========================================
    FIELD
======================================== */

.premium-autocomplete {
    border-radius: 8px;
}

/* MAIN FIELD */
.premium-autocomplete :deep(.v-field) {
    min-height: 58px !important;

    border-radius: 10px !important;

    background: #ffffff !important;

    border: 1px solid #e2e8f0 !important;

    box-shadow:
        0 2px 12px rgba(15, 23, 42, 0.04);

    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}

/* REMOVE SHAKING */
.premium-autocomplete :deep(.v-field__outline) {
    display: none !important;
}

.premium-autocomplete :deep(.v-field__overlay) {
    display: none !important;
}

/* HOVER */
.premium-autocomplete :deep(.v-field:hover) {
    border-color: #cbd5e1 !important;
}

/* FOCUS */
.premium-autocomplete :deep(.v-field--focused) {
    border-color: #2563eb !important;

    box-shadow:
        0 0 0 4px rgba(37, 99, 235, 0.08);
}

/* INPUT */
.premium-autocomplete :deep(input) {
    font-size: 15px !important;

    font-weight: 500 !important;

    color: #0f172a !important;
}

/* PLACEHOLDER */
.premium-autocomplete :deep(input::placeholder) {
    color: #94a3b8 !important;
}

/* REMOVE DEFAULT PADDING JUMPS */
.premium-autocomplete :deep(.v-field__input) {
    min-height: 58px !important;

    padding-top: 0 !important;
    padding-bottom: 0 !important;

    display: flex;
    align-items: center;
}

/* ========================================
    SEARCH ICON
======================================== */

.search-icon-box {
    width: 34px;
    height: 34px;
    border-radius: 12px;

    background: #f1f5f9;

    display: flex;
    align-items: center;
    justify-content: center;

    margin-right: 10px;
}

/* ========================================
    MENU
======================================== */

:deep(.premium-menu) {
    margin-top: 10px;

    border-radius: 22px !important;

    background: #ffffff !important;

    /* border: 1px solid #e2e8f0; */

    overflow: hidden;

    box-shadow:
        0 20px 40px rgba(15, 23, 42, 0.10) !important;
}

/* LIST */
:deep(.premium-menu .v-list) {
    padding: 10px !important;
}

/* ========================================
    ITEM
======================================== */

.dropdown-item {
    min-height: 58px;

    border-radius: 16px !important;

    margin-bottom: 4px;

    transition:
        background 0.2s ease,
        transform 0.2s ease;
}

/* HOVER */
.dropdown-item:hover {
    background:
        linear-gradient(to right,
            rgba(37, 99, 235, 0.06),
            rgba(99, 102, 241, 0.04)) !important;

    transform: translateX(2px);
}

/* AVATAR */
.item-avatar {
    width: 38px;
    height: 38px;

    border-radius: 14px;

    background:
        linear-gradient(135deg,
            #2563eb,
            #4f46e5);

    color: white;

    font-size: 14px;
    font-weight: 700;

    display: flex;
    align-items: center;
    justify-content: center;

    box-shadow:
        0 6px 16px rgba(37, 99, 235, 0.18);
}

/* TEXT */
.item-text {
    font-size: 14px !important;
    font-weight: 600 !important;
    color: #0f172a !important;
}

/* ========================================
    LOADING
======================================== */

.loading-box {
    padding: 18px;

    display: flex;
    align-items: center;
    justify-content: center;

    gap: 10px;

    font-size: 13px;
    font-weight: 600;

    color: #64748b;
}

/* ========================================
    LOAD MORE
======================================== */

.load-more-box {
    padding: 10px;
}

.load-more-btn {
    height: 44px !important;

    text-transform: none !important;

    font-weight: 700 !important;

    color: white !important;

    background:
        linear-gradient(135deg,
            #2563eb,
            #4f46e5) !important;

    box-shadow:
        0 10px 20px rgba(37, 99, 235, 0.18);
}

/* ========================================
    EMPTY STATE
======================================== */

.empty-box {
    padding: 40px 20px;

    text-align: center;
}

/* TITLE */
.empty-title {
    margin-top: 14px;

    font-size: 16px;
    font-weight: 700;

    color: #0f172a;
}

/* SUBTITLE */
.empty-subtitle {
    margin-top: 6px;

    font-size: 13px;

    color: #64748b;
}

/* ======================================================
   MAIN FIELD
====================================================== */

.ultra-premium-autocomplete {
    border-radius: 10px;
}

/* FIELD */
.ultra-premium-autocomplete :deep(.v-field) {

    /* min-height: 62px !important; */

    border-radius: 10px !important;

    background:
        linear-gradient(145deg,
            #ffffff,
            #f8fafc) !important;

    border:
        1px solid rgba(226, 232, 240, 0.9) !important;
    /* 
    box-shadow:
        0 4px 18px rgba(15, 23, 42, 0.05),
        inset 0 1px 0 rgba(255, 255, 255, 0.9); */

    transition:
        all 0.25s ease;
}

/* REMOVE DEFAULT OUTLINES */
.ultra-premium-autocomplete :deep(.v-field__outline),
.ultra-premium-autocomplete :deep(.v-field__overlay) {
    display: none !important;
}

/* HOVER */
.ultra-premium-autocomplete :deep(.v-field:hover) {

    border-color:
        rgba(59, 130, 246, 0.25) !important;

    transform: translateY(-1px);

    box-shadow:
        0 10px 28px rgba(37, 99, 235, 0.08);
}

/* FOCUS */
.ultra-premium-autocomplete :deep(.v-field--focused) {

    border-color:
        rgba(37, 99, 235, 0.55) !important;

    box-shadow:
        0 0 0 5px rgba(37, 99, 235, 0.08),
        0 12px 30px rgba(37, 99, 235, 0.12);
}

/* INPUT */
.ultra-premium-autocomplete :deep(input) {

    font-size: 14px !important;

    font-weight: 600 !important;

    color: #0f172a !important;
}

/* PLACEHOLDER */
.ultra-premium-autocomplete :deep(input::placeholder) {

    color: #94a3b8 !important;

    font-weight: 500;
}

/* INPUT AREA */
.ultra-premium-autocomplete :deep(.v-field__input) {

    min-height: 50px !important;

    padding-top: 0 !important;
    padding-bottom: 0 !important;

    display: flex;
    align-items: center;
}

/* ======================================================
   SEARCH ICON
====================================================== */

.search-icon-wrapper {

    position: relative;

    width: 30px;
    height: 30px;

    min-width: 30px;

    border-radius: 10px;

    background:
        linear-gradient(135deg,
            #f8fafc,
            #eef2ff);

    display: flex;
    align-items: center;
    justify-content: center;

    border:
        1px solid rgba(226, 232, 240, 0.8);

    overflow: hidden;

    margin-right: 10px;

    transform: translateY(1px);
}

.search-icon-glow {

    position: absolute;
    inset: 0;

    background:
        radial-gradient(circle at top,
            rgba(59, 130, 246, 0.18),
            transparent 70%);
}

/* PREPEND AREA ALIGNMENT */
.ultra-premium-autocomplete :deep(.v-field__prepend-inner) {

    display: flex;
    align-items: center;

    padding-top: 0 !important;

    height: 100%;
}

/* INPUT ALIGNMENT */
.ultra-premium-autocomplete :deep(.v-field__input) {

    display: flex;
    align-items: center;

    min-height: 50px !important;

    padding-top: 0 !important;
    padding-bottom: 0 !important;
}

/* REMOVE EXTRA TOP SPACING */
.ultra-premium-autocomplete :deep(.v-field) {

    align-items: center;
}

/* ======================================================
   MENU
====================================================== */

:deep(.ultra-premium-menu) {

    margin-top: 12px;

    border-radius: 10px !important;

    overflow: hidden;

    background:
        rgba(255, 255, 255, 0.96) !important;

    backdrop-filter: blur(20px);

    border:
        1px solid rgba(226, 232, 240, 0.8);

    box-shadow:
        0 24px 50px rgba(15, 23, 42, 0.14) !important;
}

/* LIST */
:deep(.ultra-premium-menu .v-list) {

    padding: 12px !important;

    background: transparent !important;
}

/* ======================================================
   ITEM
====================================================== */

.premium-dropdown-item {

    min-height: 62px;

    border-radius: 12px !important;

    margin-bottom: 6px;

    transition:
        all 0.22s ease;
}

/* HOVER */
.premium-dropdown-item:hover {

    transform:
        translateX(4px) scale(1.01);

    background:
        linear-gradient(90deg,
            rgba(37, 99, 235, 0.08),
            rgba(99, 102, 241, 0.05)) !important;
}

/* ======================================================
   AVATAR
====================================================== */

.premium-avatar {

    position: relative;

    width: 42px;
    height: 42px;

    border-radius: 16px;

    background: linear-gradient(135deg, #26a69a, #114575, #003b73);

    color: white;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 14px;
    font-weight: 800;

    overflow: hidden;

    box-shadow:
        0 10px 22px rgba(37, 99, 235, 0.22);
}

.avatar-shine {

    position: absolute;

    top: -12px;
    left: -20px;

    width: 30px;
    height: 80px;

    background:
        rgba(255, 255, 255, 0.25);

    transform:
        rotate(25deg);
}

/* ======================================================
   ITEM TEXT
====================================================== */

.premium-item-text {

    font-size: 14px !important;

    font-weight: 700 !important;

    letter-spacing: 0.2px;

    color: #0f172a !important;
}

/* ======================================================
   LOADING
====================================================== */

.premium-loading {

    padding: 18px;

    display: flex;
    align-items: center;
    justify-content: center;

    gap: 10px;

    font-size: 13px;
    font-weight: 700;

    color: #64748b;
}

/* ======================================================
   LOAD MORE
====================================================== */

.load-more-container {
    padding: 10px;
}

.premium-load-btn {

    height: 48px !important;

    text-transform: none !important;

    font-size: 13px !important;

    font-weight: 800 !important;

    letter-spacing: 0.3px;

    color: white !important;

    background:
        linear-gradient(135deg,
            #2563eb,
            #4f46e5) !important;

    box-shadow:
        0 14px 28px rgba(37, 99, 235, 0.22);

    transition: all 0.25s ease;
}

.premium-load-btn:hover {

    transform:
        translateY(-2px);

    box-shadow:
        0 18px 36px rgba(37, 99, 235, 0.30);
}

/* ======================================================
   EMPTY STATE
====================================================== */

.premium-empty-state {

    padding: 42px 20px;

    text-align: center;
}

.empty-icon-wrap {

    width: 72px;
    height: 72px;

    margin: auto;

    border-radius: 24px;

    background:
        linear-gradient(135deg,
            #f8fafc,
            #eef2ff);

    display: flex;
    align-items: center;
    justify-content: center;

    color: #94a3b8;

    border:
        1px solid rgba(226, 232, 240, 0.9);
}

.empty-title {

    margin-top: 18px;

    font-size: 17px;
    font-weight: 800;

    color: #0f172a;
}

.empty-subtitle {

    margin-top: 8px;

    font-size: 13px;

    line-height: 1.5;

    color: #64748b;
}
</style>
