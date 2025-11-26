<template>
<v-container fluid>
    <!-- Section Header -->
    <v-row class="mb-8">
        <v-col>
            <h2 class="dashboard-title">Welcome MNK Administrator</h2>
            <p class="dashboard-subtitle">
                Manage things efficiently here
            </p>
        </v-col>
    </v-row>

    <!-- Metrics Cards -->
    <v-row dense>
        <v-col cols="12" sm="6" md="3" v-for="card in metricsCards" :key="card.title">
            <v-card class="dashboard-card" outlined>
                <v-row align="center" no-gutters>
                    <!-- Icon -->
                    <v-col cols="3" class="d-flex justify-center">
                        <v-avatar size="54" class="card-icon">
                            <v-icon :color="card.color" size="32">{{ card.icon }}</v-icon>
                        </v-avatar>
                    </v-col>

                    <!-- Content -->
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
import axios from "axios";

export default {
    data() {
        return {
            teamMembers: [],
            comments: [],
            publishedComments: [],
            galleryImages: [],
            loading: false,
        };
    },
    computed: {
        metricsCards() {
            return [{
                    title: "Team Members",
                    value: this.teamMembers.length,
                    icon: "mdi-account-group",
                    color: "white",
                },
                {
                    title: "Customer Comments",
                    value: this.comments.length,
                    icon: "mdi-comment-text",
                    color: "white",
                },
                {
                    title: "Published Comments",
                    value: this.publishedComments.length,
                    icon: "mdi-comment-text",
                    color: "white",
                },
                {
                    title: "Gallery Images",
                    value: this.galleryImages.length,
                    icon: "mdi-image-multiple",
                    color: "white",
                },
            ];
        },
    },
    methods: {
        // async fetchStaff() {
        //     try {
        //         this.loading = true;
        //         const response = await axios.get("/staff");
        //         this.staff = response.data || [];
        //     } catch (error) {
        //         console.error("Error fetching staff:", error);
        //         this.showAlert("Failed to fetch staff", "error");
        //     } finally {
        //         this.loading = false;
        //     }
        // },
        async fetchComments() {
            try {
                const [contactsRes, publishCommentRes, teamMemberRes,galleryImagesRes] = await Promise.all([
                    axios.get("/contacts"),
                    axios.get("/publish-comment"), // second endpoint
                    axios.get("/team-members"), // second endpoint
                    axios.get("/gallery") // second endpoint
                ]);

                this.comments = contactsRes.data.data || [];
                this.publishedComments = publishCommentRes.data.data || [];
                this.teamMembers = teamMemberRes.data || [];
                this.galleryImages = galleryImagesRes.data || [];

                console.log(this.publishedComments)

            } catch (error) {
                console.error("Error fetching comments:", error);
                this.showAlert("Failed to fetch comments", "error");
            }
        },

        showAlert(message, type) {
            this.$swal.fire({
                icon: type,
                title: message,
                showConfirmButton: false,
                timer: 2000,
            });
        },
    },
    mounted() {
        // this.fetchStaff();
        this.fetchComments();

    },
};
</script>

<style scoped>
/* Section Header */
.dashboard-title {
    font-weight: 700;
    font-size: 1.6rem;
    border-left: 6px solid #06923e;
    padding-left: 12px;
}

.dashboard-subtitle {
    color: #555;
    margin-top: 6px;
    font-size: 1rem;
}

/* Card Styling */
.dashboard-card {
    border-radius: 16px;
    padding: 18px;
    transition: all 0.4s ease;
    cursor: pointer;
    background: linear-gradient(135deg, #e6f1f0, #fff);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
    border-top: 4px solid transparent;
}

.dashboard-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 26px rgba(0, 0, 0, 0.12);
    background: linear-gradient(135deg, #e6f1f0, #fff);
}

/* Avatar for Icons */
.card-avatar {
    background: #f4f6f8 !important;
    border: 2px solid #e0e0e0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

/* Card Content */
.card-title {
    font-weight: 600;
    color: #444;
    font-size: 0.95rem;
}

.metric-value {
    font-size: 1.7rem;
    font-weight: 700;
    color: #06923e;
    margin-top: 4px;
}

.card-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2e7d32, #b87c4c);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
</style>
