<template>
<v-container fluid>
    <!-- Section Header -->
    <v-row class="mb-6">
        <v-col>
            <h2 class="dashboard-title">Stailika Back-Office</h2>
            <p class="dashboard-subtitle">Manage appointments and customer comments</p>
        </v-col>
    </v-row>

    <!-- Metrics Cards -->
    <v-row dense>
        <v-col cols="12" sm="6" md="3" v-for="card in metricsCards" :key="card.title">
            <v-card class="dashboard-card" outlined>
                <v-row align="center" no-gutters>
                    <v-col cols="3" class="d-flex justify-center">
                        <v-avatar size="50" color="white">
                            <v-icon :color="card.color" size="30">{{ card.icon }}</v-icon>
                        </v-avatar>
                    </v-col>
                    <v-col cols="9">
                        <div class="card-title">{{ card.title }}</div>
                        <div class="metric-value">{{ card.value }}</div>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
    </v-row>
</v-container>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            appointments: [],
            comments: [],
            loading: false
        };
    },
    computed: {
        todaysAppointments() {
            const today = new Date().toISOString().split("T")[0];
            return this.appointments.filter(a => a.date.startsWith(today)).length;
        },
        upcomingAppointments() {
            const now = new Date();
            return this.appointments.filter(a => new Date(a.date) > now).length;
        },
        metricsCards() {
            return [
                { title: "Booked Appointments", value: this.appointments.length, icon: "mdi-calendar-check", color: "#1976D2" },
                { title: "Customer Comments", value: this.comments.length, icon: "mdi-comment-text", color: "#43A047" },
                { title: "Today's Appointments", value: this.todaysAppointments, icon: "mdi-calendar-today", color: "#FB8C00" },
                { title: "Upcoming Appointments", value: this.upcomingAppointments, icon: "mdi-calendar-clock", color: "#8E24AA" }
            ];
        }
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
        async fetchComments() {
            try {
                const response = await axios.get("/contacts");
                this.comments = response.data.data || [];
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        },
        showAlert(message, type) {
            this.$swal.fire({
                icon: type,
                title: message,
                showConfirmButton: false,
                timer: 2000
            });
        }
    },
    mounted() {
        this.fetchAppointments();
        this.fetchComments();
    }
};
</script>

<style scoped>
.dashboard-title {
    color: #020B2C;
    font-weight: bold;
    font-size: 1.8rem;
}

.dashboard-subtitle {
    color: #555;
    margin-bottom: 1.5rem;
}

.dashboard-card {
    background-color: #ffffff;
    border-radius: 12px;
    padding: 16px;
    transition: all 0.3s;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0,0,0,0.08);
}

.dashboard-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.15);
}

.card-title {
    font-weight: 500;
    color: #333;
}

.metric-value {
    font-size: 1.5rem;
    font-weight: bold;
    color: #020B2C;
    margin-top: 4px;
}
</style>
