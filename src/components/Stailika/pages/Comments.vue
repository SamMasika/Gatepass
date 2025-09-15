<template>
<v-container fluid>
    <!-- Breadcrumbs -->
    <nav class="custom-breadcrumbs mb-6">
        <span class="breadcrumb-item" @click="$router.push('/dashboard')">Dashboard</span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active">Comments</span>
    </nav>

    <!-- Header -->
    <v-row>
        <v-col>
            <h2 class="page-title"> Comments</h2>
            <p class="page-subtitle">Review and moderate customer feedback</p>
        </v-col>
    </v-row>

    <v-card>
        <!-- Search -->
        <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Search" single-line hide-details variant="outlined" density="compact" class="search-field mt-4" />
        </v-card-title>

        <!-- Table -->
        <v-card-text>
            <v-data-table :headers="commentHeaders" :items="comments" :search="search">
                <!-- Format Date -->
                <template v-slot:[`item.created_at`]="{ item }">
                    {{ formatDate(item.created_at) }}
                </template>

                <!-- Status -->
                <template v-slot:[`item.status`]="{ item }">
                    <v-chip :color="getStatusColor(item.status)" variant="tonal" size="small">
                        {{ formatStatus(item.status) }}
                    </v-chip>
                </template>

                <!-- Actions -->
                <template v-slot:[`item.actions`]="{ item }">
                    <v-menu transition="scale-transition" offset-y min-width="220" close-on-content-click>
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" icon rounded class="circle-btn" flat>
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>

                        <v-card class="elevation-4 rounded-lg">
                            <v-list dense nav>
                                <v-list-item @click="openViewDialog(item)" class="action-item">
                                    <v-list-item-icon>
                                        <v-icon small>mdi-eye</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>View</v-list-item-title>
                                </v-list-item>

                                <v-list-item @click="openConfirmDialog(item)" class="action-item">
                                    <v-list-item-icon>
                                        <v-icon small>
                                            {{ item.status === 'published' ? 'mdi-cancel' : 'mdi-check-circle' }}
                                        </v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>
                                        {{ item.status === 'published' ? 'Unpublish' : 'Publish' }}
                                    </v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-card>
                    </v-menu>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>

    <!-- View Dialog -->
    <v-dialog v-model="viewDialog" max-width="520px">
        <v-card class="rounded-lg elevation-6">
            <v-card-title class="font-weight-bold px-6 py-4" style="border-bottom: 1px solid #eee;">
                Comment Details
            </v-card-title>

            <v-card-text v-if="selectedItem" class="px-6">
                <v-row class="mb-3">
                    <v-col cols="12" sm="6">
                        <strong>Customer:</strong> {{ selectedItem.name }}
                    </v-col>
                    <v-col cols="12" sm="6">
                        <strong>Date:</strong> {{ formatDate(selectedItem.created_at) }}
                    </v-col>
                    <v-col cols="12" sm="6">
                        <strong>Status:</strong>
                        <v-chip :color="getStatusColor(selectedItem.status)" small>
                            {{ formatStatus(selectedItem.status) }}
                        </v-chip>
                    </v-col>
                    <v-col cols="12" v-if="selectedItem.message" class="font-italic">
                        <strong>Notes:</strong> {{ selectedItem.message }}
                    </v-col>
                </v-row>
            </v-card-text>

            <v-card-actions class="px-6 py-4" style="border-top: 1px solid #eee;">
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="outlined" rounded="xl" @click="viewDialog = false">
                    Close
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- Confirm Publish/Unpublish Dialog -->
    <v-dialog v-model="confirmDialog" max-width="420px" persistent>
        <v-card class="rounded-lg elevation-6">
            <v-card-title class="font-weight-bold px-6 py-4" style="border-bottom: 1px solid #eee;">
                Confirmation
            </v-card-title>

            <v-card-text class="px-6 py-6 text-center">
                <v-icon size="60" :color="selectedItem?.status === 'published' ? 'error' : 'success'" class="mb-4">
                    {{ selectedItem?.status === 'published' ? 'mdi-cancel' : 'mdi-check-circle' }}
                </v-icon>
                <p class="text-lg font-weight-medium">
                    Are you sure you want to
                    <strong :class="selectedItem?.status === 'published' ? 'text-error' : 'text-success'">
                        {{ selectedItem?.status === 'published' ? 'Unpublish' : 'Publish' }}
                    </strong>
                    this comment?
                </p>
            </v-card-text>

            <v-card-actions class="px-6 py-4" style="border-top: 1px solid #eee;">
                <v-spacer></v-spacer>
                <v-btn variant="outlined" color="grey" rounded="xl" @click="confirmDialog = false">
                    Cancel
                </v-btn>
                <v-btn :color="selectedItem?.status === 'published' ? 'error' : 'success'" rounded="xl" @click="confirmPublish">
                    Yes, Confirm
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</v-container>
</template>

<script>
import dateFormat from '@/mixins/dateFormat';
import swtalert from '@/mixins/swtalert';
import axios from 'axios';

export default {
    mixins: [dateFormat, swtalert],
    data() {
        return {
            search: "",
            viewDialog: false,
            confirmDialog: false,
            selectedItem: null,

            comments: [],
            commentHeaders: [{
                    title: "Customer",
                    value: "name"
                },
                {
                    title: "Email",
                    value: "email"
                },
                {
                    title: "Phone No.",
                    value: "phone"
                },
                {
                    title: "Date",
                    value: "created_at"
                },
                {
                    title: "Status",
                    value: "status"
                },
                {
                    title: "Actions",
                    value: "actions",
                    sortable: false
                },
            ],
        };
    },
    methods: {
        openViewDialog(item) {
            this.selectedItem = item;
            this.viewDialog = true;
        },
        openConfirmDialog(item) {
            this.selectedItem = item;
            this.confirmDialog = true;
        },
        confirmPublish() {
            if (!this.selectedItem) return;

            axios.post(`/comments/${this.selectedItem.id}/toggle-status`, {}, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                })
                .then((response) => {
                    this.selectedItem.status = response.data.status;
                    this.showAlert(response.data.message, "success");
                })
                .catch((error) => {
                    this.showAlert(error.response ?.data ?.message || "Failed to update status", "error");
                })
                .finally(() => {
                    this.confirmDialog = false;
                });
        },
        getStatusColor(status) {
            if (!status) return "grey";
            const lower = status.toLowerCase();
            switch (lower) {
                case "published":
                    return "green";
                case "pending":
                    return "orange";
                case "rejected":
                    return "red";
                default:
                    return "grey";
            }
        },
        formatStatus(status) {
            if (!status) return "";
            return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
        },
        fetchItems() {
            axios.get('/contacts')
                .then(response => {
                    this.comments = response.data.data;
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                });
        },
    },
    mounted() {
        this.fetchItems();
    }
};
</script>

<style scoped>
.page-title {
    font-weight: bold;
    font-size: 1.6rem;
}

.page-subtitle {
    color: #555;
    margin-bottom: 1rem;
}

.search-field {
    max-width: 250px;
}

.circle-btn {
    border-radius: 50%;
    padding: 4px;
    min-width: 36px;
    min-height: 36px;
}

.action-item {
    cursor: pointer;
    transition: background-color 0.2s;
}

.action-item:hover {
    background-color: #020B2C;
    color: white;
}

.font-italic {
    font-style: italic;
}

.text-error {
    color: #d32f2f !important;
}

.text-success {
    color: #2e7d32 !important;
}
</style>
