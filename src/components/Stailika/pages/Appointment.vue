<template>
<v-container fluid>
    <!-- Breadcrumbs -->
    <nav class="custom-breadcrumbs mb-6">
        <span class="breadcrumb-item" @click="$router.push('/dashboard')">Dashboard</span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active">Appointments</span>
    </nav>

    <!-- Header -->
    <v-row>
        <v-col>
            <h2 class="page-title">Appointments</h2>
            <p class="page-subtitle">Track and manage all booked appointments</p>
        </v-col>
    </v-row>

    <v-card class="elevation-2">
        <!-- Search -->
        <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Search appointments..." single-line hide-details variant="outlined" density="compact" class="search-field" />
        </v-card-title>

        <!-- Appointments Table -->
        <v-data-table :headers="appointmentHeaders" :items="appointments" :search="search" dense class="elevation-1" :loading="loading" loading-text="Loading appointments...">
            <!-- Format Date -->
            <template v-slot:[`item.date`]="{ item }">
                {{ formatDate(item.date) }}
            </template>

            <!-- Status -->
            <template v-slot:[`item.status`]="{ item }">
                <v-chip :color="getStatusColor(item.status)" variant="tonal" size="small">
                    {{ formatStatus(item.status) }}
                </v-chip>

            </template>

                        <!-- Actions -->
                <template v-slot:[`item.actions`]="{ item }">
                    <v-menu transition="scale-transition" offset-y min-width="300" close-on-content-click>
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" icon rounded class="circle-btn" flat>
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>

                        <v-card class="elevation-4 rounded-lg">
                            <v-list dense nav>
                                <!-- Edit -->
                                <v-list-item @click="openViewDialog(item)" class="action-item">
                                    <v-list-item-icon>
                                        <v-icon small>mdi-eye</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>View</v-list-item-title>
                                </v-list-item>

                                <!-- Publish/Unpublish -->
                                <!-- <v-list-item @click="openConfirmDialog(item)" class="action-item">
                                    <v-list-item-icon>
                                        <v-icon small>
                                            {{ item.status === "published"
                          ? "mdi-cancel"
                          : "mdi-check-circle" }}
                                        </v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>
                                        {{ item.status === "published"
                        ? "Unpublish"
                        : "Publish" }}
                                    </v-list-item-title>
                                </v-list-item> -->
                            </v-list>
                        </v-card>
                    </v-menu>
                </template>
          
        </v-data-table>
    </v-card>

    <!-- View Dialog -->
    <v-dialog v-model="viewDialog" max-width="550px">
        <v-card class="dialog-card">
            <v-card-title class="dialog-title">
                <v-icon left>mdi-calendar-check</v-icon>
                Appointment Details
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text v-if="selectedItem" class="dialog-text">
                <v-row dense>
                    <v-col cols="12" sm="6">
                        <strong>Name:</strong> {{ selectedItem.name }}
                    </v-col>
                    <v-col cols="12" sm="6">
                        <strong>Phone:</strong> {{ selectedItem.phone }}
                    </v-col>
                    <v-col cols="12" sm="6">
                        <strong>Email:</strong> {{ selectedItem.email }}
                    </v-col>
                    <v-col cols="12" sm="6">
                        <strong>Service:</strong> {{ selectedItem.appointment_type }}
                    </v-col>
                    <v-col cols="12" sm="6">
                        <strong>Date:</strong> {{ formatDate(selectedItem.date) }}
                    </v-col>
                    <v-col cols="12" sm="6">
                        <strong>Time:</strong> {{ selectedItem.time }}
                    </v-col>
                    <v-col cols="12" sm="6">
                        <strong>Status:</strong>
                        <v-chip :color="getStatusColor(selectedItem.status)" small>
                            {{ formatStatus(selectedItem.status) }}
                        </v-chip>
                    </v-col>
                    <v-col cols="12" v-if="selectedItem.notes">
                        <strong>Notes:</strong> {{ selectedItem.notes }}
                    </v-col>
                </v-row>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn rounded="xl" class="text-none" color="#A82228" @click="viewDialog = false">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</v-container>
</template>

<script>
import dateFormat from "@/mixins/dateFormat";
import axios from "axios";

export default {
    mixins: [dateFormat],
    data() {
        return {
            search: "",
            loading: false,
            viewDialog: false,
            selectedItem: null,
            appointments: [],
            appointmentHeaders: [{
                    title: "Name",
                    value: "name"
                },
                {
                    title: "Phone",
                    value: "phone"
                },
                {
                    title: "Email",
                    value: "email"
                },
                {
                    title: "Service",
                    value: "appointment_type"
                },
                {
                    title: "Date",
                    value: "date"
                },
                {
                    title: "Time",
                    value: "time"
                },
                // {
                //     title: "Status",
                //     value: "status"
                // },
                {
                    title: "Actions",
                    value: "actions",
                    sortable: false
                },
            ],
        };
    },
    created() {
        this.fetchAppointments();
    },
    methods: {
        async fetchAppointments() {
            try {
                this.loading = true;
                const response = await axios.get("/appointments");
                this.appointments = response.data || [];
            } catch (error) {
                console.error("Error fetching appointments:", error);
                this.showAlert("Failed to fetch appointments", "error");
            } finally {
                this.loading = false;
            }
        },

        getStatusColor(status) {
            if (!status) return "grey";
            const lower = status.toLowerCase();
            switch (lower) {
                case "approved":
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
        openViewDialog(item) {
            this.selectedItem = item;
            this.viewDialog = true;
        },
        async approveAppointment(item) {
            try {
                await axios.patch(`/appointments/${item.id}`, {
                    status: "Approved"
                });
                item.status = "Approved";
                this.showAlert("Appointment approved successfully", "success");
            } catch (error) {
                console.error(error);
                this.showAlert("Failed to approve appointment", "error");
            }
        },
        async deleteAppointment(item) {
            if (!confirm("Are you sure you want to delete this appointment?")) return;
            try {
                await axios.delete(`/appointments/${item.id}`);
                this.appointments = this.appointments.filter(a => a.id !== item.id);
                this.showAlert("Appointment deleted successfully", "success");
            } catch (error) {
                console.error(error);
                this.showAlert("Failed to delete appointment", "error");
            }
        },
        showAlert(message, type) {
            // Fallback alert, replace with your toast plugin if available
            this.$toast ?.[type](message) || alert(message);
        },
    },
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
    max-width: 300px;
}

.dialog-card {
    border-radius: 12px;
    overflow: hidden;
}

.dialog-title {
    font-weight: bold;
    font-size: 1.3rem;
    color: #020b2c;
    display: flex;
    align-items: center;
}

.dialog-title v-icon {
    margin-right: 8px;
}

.dialog-text {
    font-size: 1rem;
    color: #333;
    padding-top: 12px;
}

.v-chip {
    font-weight: 600;
}
</style>
