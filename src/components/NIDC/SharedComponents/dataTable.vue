<template>
<div class="premium-table-container">
    <!-- =====================================================
            TABLE TOOLBAR
    ====================================================== -->
    <div class="table-toolbar">
        <!-- LEFT -->
        <div>
            <h2 class="toolbar-title">
                {{ title }}
            </h2>
            <p class="toolbar-subtitle">
                {{ subtitle }}
            </p>

        </div>

        <!-- RIGHT -->
        <div class="toolbar-actions">

            <!-- SEARCH -->
            <v-text-field v-model="search" placeholder="Search records..." prepend-inner-icon="mdi-magnify" variant="solo" flat density="comfortable" hide-details class="search-field" @input="onSearchChange" />

            <!-- ROWS -->
            <!-- <v-select v-model="itemsPerPage" :items="[5,10,15,20,30]" label="Rows" variant="solo" flat density="comfortable" hide-details class="rows-field" /> -->

        </div>

    </div>

    <!-- =====================================================
            TABLE
    ====================================================== -->
    <div class="table-wrapper">

        <v-data-table-server :headers="headers" :items="items" :items-length="totalItems" :loading="loading" :items-per-page="itemsPerPage" :page="currentPage" item-value="id" class="premium-table" hide-default-footer>

            <!-- =================================================
                    HEADERS
            ================================================== -->
            <template #headers="{ columns }">

                <tr class="custom-head">

                    <th v-for="column in columns" :key="column.key">
                        {{ column.title }}
                    </th>

                </tr>

            </template>

            <!-- =================================================
                    ROWS
            ================================================== -->
            <template #item="{ item }">

                <tr class="premium-row">

                    <td v-for="column in headers" :key="column.value" class="premium-cell">

                        <!-- IMAGE -->
                        <template v-if="column.value === 'filePath'">

                            <div class="avatar-wrapper">

                                <template v-if="
                                        getImageUrl(
                                            getNestedValue(
                                                item,
                                                column.value
                                            )
                                        )
                                    ">

                                    <v-avatar size="50" class="premium-avatar">

                                        <img :src="
                                                getImageUrl(
                                                    getNestedValue(
                                                        item,
                                                        column.value
                                                    )
                                                )
                                            " alt="">

                                    </v-avatar>

                                </template>

                                <template v-else>

                                    <v-avatar size="50" class="premium-avatar placeholder-avatar">

                                        <v-icon size="26">
                                            mdi-account
                                        </v-icon>

                                    </v-avatar>

                                </template>

                            </div>

                        </template>

                        <!-- STATUS -->
                        <template v-else-if="column.value === 'status'||column.value.toLowerCase().includes('operation_status') ||column.value.toLowerCase().includes('workflow_status') ">
                            <v-chip class="status-chip" :class="`status-${getStatusColor(getNestedValue(item, column.value)).color}`">
                                {{
                                    getStatusColor(
                                        getNestedValue(
                                            item,
                                            column.value
                                        )
                                    ).text
                                }}
                            </v-chip>
                        </template>
                        <template v-else-if="
        column.value === 'operation_status' ||
        column.value === 'workflow_status'
    ">
                            <v-chip class="status-chip" :class="`status-${getStatusColor(getNestedValue(item, column.value)).color}`">
                                {{ getStatusColor(getNestedValue(item, column.value)).text }}
                            </v-chip>
                        </template>
                        <template v-else-if="column.value === 'is_multi_day'">
                            <div v-if="getNestedValue(item, column.value) === true || getNestedValue(item, column.value) === '1'">
                                <v-chip class="status-chip status-blue">
                                    Multi-day
                                </v-chip>
                            </div>

                            <div v-else>
                                <v-chip class="status-chip status-grey">
                                    Single-day
                                </v-chip>
                            </div>
                        </template>
                        <template v-else-if="column.value === 'current_gate'">
                            <span v-if="!getNestedValue(item, column.value) || getNestedValue(item, column.value) === null || getNestedValue(item, column.value) === ''">
                                <i class="mdi mdi-gate"> Not Assigned</i>
                            </span>

                            <v-chip v-else class="status-chip" :class="`status-${getStatusColor(getNestedValue(item, column.value)).color}`">
                                {{ getStatusColor(getNestedValue(item, column.value)).text }}
                            </v-chip>
                        </template>

                        <!-- DATE -->
                        <template v-else-if="
    column.format === 'date' ||
    column.value.toLowerCase().includes('date') ||
    column.value.toLowerCase().includes('created_at') ||
	column.value.toLowerCase().includes('updated_at') ||
    column.value.toLowerCase().includes('valid_from')||
    column.value.toLowerCase().includes('valid_to')
">
                            <div class="cell-text">
                                {{
            formatDate(getNestedValue(item, column.value))
        }}
                            </div>
                        </template>

                        <!-- TIME -->
                        <template v-else-if="
    column.format === 'time' ||
    column.value.toLowerCase().includes('time') ||
    column.value.toLowerCase().includes('time_in') ||
    column.value.toLowerCase().includes('time_out') 
">
                            <div class="cell-text">
                                {{
            formatTime(getNestedValue(item, column.value))
        }}
                            </div>
                        </template>
                        <!-- ACTIONS -->
                        <template v-else-if="
                                column.value === 'actions'
                            ">

                            <div class="actions-wrapper">

                                <slot name="actions" :item="item" />

                            </div>

                        </template>

                        <!-- MONEY -->
                        <template v-else-if="
                                column.format &&
                                (
                                    ['price','amount']
                                    .some(term =>
                                        column.value
                                        .toLowerCase()
                                        .includes(term)
                                    )
                                )
                            ">

                            <div class="money-box">

                                <v-icon size="15">
                                    mdi-currency-tzs
                                </v-icon>

                                {{
                                    formatPrice(
                                        getNestedValue(
                                            item,
                                            column.value
                                        )
                                    )
                                }}

                            </div>

                        </template>

                        <!-- DEFAULT -->
                        <template v-else>

                            <div class="cell-text">

                                {{
                                    getNestedValue(
                                        item,
                                        column.value
                                    )
                                }}

                            </div>

                        </template>

                    </td>

                </tr>

            </template>

            <!-- =================================================
                    LOADING
            ================================================== -->
            <template #loading>

                <div class="loading-wrapper">

                    <v-progress-circular indeterminate size="55" width="4" color="teal" />

                    <p>
                        Fetching records...
                    </p>

                </div>

            </template>

            <!-- =================================================
                    EMPTY
            ================================================== -->
            <template #no-data>

                <div class="empty-state">

                    <div class="empty-icon">

                        <v-icon size="90">
                            mdi-database-search-outline
                        </v-icon>

                    </div>

                    <h3>
                        No Records Found
                    </h3>

                    <p>
                        No matching records available.
                    </p>

                </div>

            </template>

        </v-data-table-server>

    </div>

    <!-- =====================================================
            FOOTER
    ====================================================== -->
    <div class="table-footer" v-if="totalItems > 0">

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
                {{ totalItems }}
            </strong>

            entries

        </div>

        <!-- RIGHT -->
        <div class="pagination-wrapper" v-if="totalPages > 1">

            <!-- PREVIOUS -->
            <button class="nav-btn" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">

                <v-icon size="18">
                    mdi-chevron-left
                </v-icon>

            </button>

            <!-- PAGE NUMBERS -->
            <button v-for="page in visiblePages" :key="page" class="page-btn" :class="{ active: currentPage === page }" @click="changePage(page)">
                {{ page }}
            </button>

            <!-- NEXT -->
            <button class="nav-btn" :disabled="
                    currentPage === totalPages
                " @click="changePage(currentPage + 1)">

                <v-icon size="18">
                    mdi-chevron-right
                </v-icon>

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

        apiUrl: {
            type: String,
            required: true
        },

        headers: {
            type: Array,
            required: true
        },

        title: {
            type: String,
            default: "Data Table"
        },

        subtitle: {
            type: String,
            default: "Premium records management"
        }
    },

    data() {

        return {

            items: [],

            loading: false,

            search: "",

            currentPage: 1,

            itemsPerPage: 10,

            totalItems: 0,

            totalPages: 1
        };
    },

    computed: {

        startItem() {

            return this.totalItems ?
                (
                    (
                        this.currentPage - 1
                    ) * this.itemsPerPage
                ) + 1 :
                0;
        },

        endItem() {

            return Math.min(
                this.currentPage *
                this.itemsPerPage,

                this.totalItems
            );
        },

        visiblePages() {

            const pages = [];

            for (
                let i = 1; i <= this.totalPages; i++
            ) {

                pages.push(i);
            }

            return pages;
        }
    },

    methods: {

        /* =========================================
                FETCH DATA
        ========================================= */
        async fetchData() {

            try {

                this.loading = true;

                const response =
                    await axios.get(
                        this.apiUrl, {
                            params: {

                                page: this.currentPage,

                                per_page: this.itemsPerPage,

                                search: this.search
                            }
                        }
                    );

                const responseData =
                    response.data.data;

                // ITEMS
                this.items =
                    responseData.data || [];

                // TOTAL
                this.totalItems =
                    responseData.total || 0;

                // CURRENT PAGE
                this.currentPage =
                    responseData.current_page || 1;

                // LAST PAGE
                this.totalPages =
                    responseData.last_page || 1;

            } catch (error) {

                console.error(error);

            } finally {

                this.loading = false;
            }
        },

        /* =========================================
                PAGE CHANGE
        ========================================= */
        changePage(page) {

            if (
                page < 1 ||
                page > this.totalPages
            ) return;

            this.currentPage = page;

            this.fetchData();
        },

        isEmpty(value) {
            return (
                value === null ||
                value === undefined ||
                value === '' ||
                value === 'null' ||
                value === 'undefined'
            );
        },

        /* =========================================
                SEARCH
        ========================================= */
        onSearchChange: _.debounce(function () {

            this.currentPage = 1;

            this.fetchData();

        }, 500),

        /* =========================================
                FORMAT PRICE
        ========================================= */
        formatPrice(price) {

            if (!price) return "0";

            return parseInt(price)
                .toLocaleString();
        },

        /* =========================================
        FORMAT DATE
========================================= */
        formatDate(date) {
            if (!date) return "";

            const d = new Date(date);

            if (isNaN(d.getTime())) return date;

            return d.toLocaleDateString("en-GB", {
                year: "numeric",
                month: "short",
                day: "2-digit"
            });
        },

        formatTime(time) {
            if (!time) return "";

            // If already HH:mm or HH:mm:ss → normalize it
            if (typeof time === "string") {
                const parts = time.split(":");

                if (parts.length >= 2) {
                    return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
                }
            }

            return time;
        },
        /* =========================================
                NESTED VALUE
        ========================================= */
        getNestedValue(item, field) {

            return field
                .split(".")
                .reduce(

                    (obj, key) =>

                    obj &&
                    obj[key] !== undefined

                    ?
                    obj[key] :
                    "",

                    item
                );
        },

        /* =========================================
                IMAGE
        ========================================= */
        getImageUrl(path) {

            if (!path) return null;

            return this.$getImageUrl(path);
        },

        /* =========================================
        STATUS
========================================= */
        getStatusColor(status) {

            const val = String(status).toUpperCase();
            const statuses = {
                ACTIVE: {
                    text: "Active",
                    color: "green"
                },

                1: {
                    text: "Active",
                    color: "green"
                },

                INACTIVE: {
                    text: "Inactive",
                    color: "red"
                },

                0: {
                    text: "Inactive",
                    color: "red"
                },

                SUSPENDED: {
                    text: "Suspended",
                    color: "orange"
                },
                PENDING: {
                    text: "Pending",
                    color: "orange"
                },
                COMPLETED: {
                    text: "Completed",
                    color: "blue"
                },
                EXPIRED: {
                    text: "Expired",
                    color: "red"
                },
                PENDING_SUBMISSION: {
                    text: "Pending Submission",
                    color: "yellow"
                },
                IN_REVIEW: {
                    text: "In Review",
                    color: "blue"
                },
                FINAL_REVIEW: {
                    text: "Final Review",
                    color: "deep-purple"
                },
                PARTIALLY_APPROVED: {
                    text: "Partially Approved",
                    color: "purple"
                },
                PARTIALLY_CHECKED_OUT: {
                    text: "Partially Checked Out",
                    color: "yellow"
				},
                PARTIALLY_CHECKED_IN: {
                    text: "Partially Checked In",
                    color: "green"
				},
                PARTIALLY_EXITED: {
                    text: "Partially Exited",
                    color: "orange"
				},
				
                CHECKED_IN: {
                    text: "Checked In",
                    color: "green"
				},
                CHECKED_OUT: {
                    text: "Checked Out At Gate 2",
                    color: "red"
				},
			
                APPROVED: {
                    text: "Approved",
                    color: "green"
                },
                REJECTED: {
                    text: "Rejected",
                    color: "red"
                },
                CLEARED: {
                    text: "Cleared",
                    color: "orange"
                },
                CLOSED: {
                    text: "Closed",
                    color: "closed"
                },
                GATE_1: {
                    text: "GATE 1",
                    color: "light-blue"
                },
                INSIDE: {
                    text: "INSIDE",
                    color: "green"
                },
                GATE_2: {
                    text: "GATE 2",
                    color: "orange"
                },

            };

            return statuses[val] || {
                text: status,
                color: "grey"
            };
        }
    },

    watch: {

        itemsPerPage() {

            this.currentPage = 1;

            this.fetchData();
        }
    },

    mounted() {

        this.fetchData();
    }
};
</script>

<style scoped>
/* =====================================================
    CONTAINER
===================================================== */

.premium-table-container {

    background: white;

    border-radius: 32px;

    padding: 28px;

    border: 1px solid #e2e8f0;

    box-shadow:
        0 25px 70px rgba(15, 23, 42, 0.05);
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

    font-size: 20px;

    font-weight: 800;

    background:
        linear-gradient(135deg,
            #1b867c,
            #003B73,
            #0f172a);

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

    overflow-x: auto;
}

.premium-table {

    background: transparent !important;
}

.custom-head {

    background:
        linear-gradient(135deg,
            #1b867c,
            #003B73,
            #0f172a);
}

.custom-head th {

    color:
        rgba(255, 255, 255, 0.9) !important;

    font-size: 13px;

    font-weight: 700;

    letter-spacing: 0.5px;

    padding: 20px 18px !important;

    border: none !important;
}

.custom-head th:first-child {

    border-top-left-radius: 20px;
}

.custom-head th:last-child {

    border-top-right-radius: 20px;
}

/* =====================================================
    ROWS
===================================================== */

.premium-row {

    transition: 0.25s ease;
}

.premium-row:hover {

    background:
        linear-gradient(to right,
            rgba(20, 146, 134, 0.03),
            rgba(17, 69, 117, 0.03));
}

.premium-cell {

    padding: 18px 16px !important;

    border-bottom:
        1px solid #f1f5f9;

    font-size: 14px;

    color: #334155;
}

/* =====================================================
    AVATAR
===================================================== */

.avatar-wrapper {

    display: flex;

    align-items: center;
}

.premium-avatar {

    border:
        3px solid rgba(38, 166, 154, 0.12);
}

.placeholder-avatar {

    background:
        linear-gradient(135deg,
            #26A69A,
            #114575);

    color: white;
}

/* =====================================================
    STATUS
===================================================== */

.status-chip {

    border-radius: 12px !important;

    font-weight: 700;
}

.status-yellow {
    background: rgba(234, 179, 8, 0.15) !important;
    color: #a16207 !important;
}

.status-green {

    background: #ecfdf5 !important;

    color: #16a34a !important;
}

.status-red {

    background: #fee2e2 !important;

    color: #dc2626 !important;
}

.status-rose {
    background: rgba(236, 72, 153, 0.10) !important;
    color: #db2777 !important;
    border: 1px solid rgba(236, 72, 153, 0.12);
}

.status-orange {

    background: #fff7ed !important;

    color: #ea580c !important;
}

.status-blue {
    background: rgba(37, 99, 235, 0.12) !important;
    color: #1d4ed8 !important;
}

.status-grey {

    background: #f1f5f9 !important;

    color: #64748b !important;
}

.status-deep-purple {
    background: rgba(94, 53, 177, 0.12) !important;
    color: #5e35b1 !important;
}

.status-light-blue {
    background: rgba(6, 182, 212, 0.12) !important;
    color: #0891b2 !important;
    border: 1px solid rgba(6, 182, 212, 0.15);
}

.status-gate2 {
    background: rgba(99, 102, 241, 0.12) !important;
    color: #4f46e5 !important;
    border: 1px solid rgba(99, 102, 241, 0.15);
}

.status-closed {
    background: rgba(146, 64, 14, 0.10) !important;
    color: #92400e !important;
    border: 1px solid rgba(146, 64, 14, 0.12);
}

/* =====================================================
    MONEY
===================================================== */

.money-box {

    display: flex;

    align-items: center;

    gap: 6px;

    color: #16a34a;

    font-weight: 700;
}

/* =====================================================
    ACTIONS
===================================================== */

.actions-wrapper {

    display: flex;

    align-items: center;

    gap: 10px;
}

/* =====================================================
    LOADING
===================================================== */

.loading-wrapper {

    padding: 70px 20px;

    display: flex;

    flex-direction: column;

    align-items: center;

    gap: 20px;

    color: #64748b;
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

    background:
        rgba(38, 166, 154, 0.12);

    color: #008080;
}

.page-btn.active {

    background:
        linear-gradient(135deg,
            #26A69A,
            #114575);

    color: white;

    box-shadow:
        0 12px 30px rgba(17, 69, 117, 0.25);
}

.nav-btn:disabled {

    opacity: 0.4;

    cursor: not-allowed;
}

/* =====================================================
    MOBILE
===================================================== */

@media (max-width: 768px) {

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
}
</style>
