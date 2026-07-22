<template>
<v-container fluid class="ultra-wrapper py-12">

    <PageBreadcrumb title="Profile Overview" />

    <v-row justify="center">
        <v-col cols="12" lg="10">

            <v-card class="ultra-card border" elevation="0">

                <!-- TOP HEADER -->
                <div class="ultra-header">
                    <div class="header-content">

                        <v-avatar size="130" class="ultra-avatar">
                            <img v-if="user.avatar" :src="user.avatar" />
                            <v-icon v-else size="80" color="white">mdi-account</v-icon>
                        </v-avatar>

                        <div class="ml-6">
                            <h1 class="ultra-name">{{ user.first_name }} {{ user.last_name }}</h1>
                            <p class="ultra-email">{{ user.email }}</p>

                          
                        </div>

                    </div>
                </div>

                <!-- BODY -->
                <div class="ultra-body px-12 py-10">

                    <v-row>

                        <!-- PERSONAL INFO -->
                        <v-col cols="12" md="6">
                            <div class="glass-box">
                                <h3 class="section-title mb-6">Personal Information</h3>

                                <div class="info-row">
                                    <span class="label">Full Name</span>
                                    <span class="value">{{ user.first_name }} {{ user.last_name }}</span>
                                </div>

                                <div class="info-row">
                                    <span class="label">Phone</span>
                                    <span class="value">{{ user.phone }}</span>
                                </div>

                                <div class="info-row">
                                    <span class="label">Email</span>
                                    <span class="value">{{ user.email }}</span>
                                </div>
                            </div>
                        </v-col>

                        <!-- ACCOUNT SETTINGS -->
                        <v-col cols="12" md="6">
                            <div class="glass-box">
                                <h3 class="section-title mb-6">Account & Security</h3>

                                <v-btn block class="button-color mb-4" elevation="0" @click="$router.push('/change-password')">
                                    <v-icon start>mdi-lock-reset</v-icon>
                                    Change Password
                                </v-btn>

                                <v-btn block variant="outlined" rounded="xl" class="luxury-otline-btn" @click="editUser">
                                    <v-icon start>mdi-account-edit</v-icon>
                                    Edit Profile
                                </v-btn>

                            </div>
                        </v-col>

                    </v-row>

                </div>

            </v-card>

        </v-col>
    </v-row>

    <!-- EDIT MODAL -->
    <v-dialog v-model="editDialog" max-width="600">
        <v-card class="luxury-dialog pa-10">

            <h2 class="mb-6">Edit Profile</h2>

            <v-text-field label="First Name" v-model="editData.first_name" variant="outlined" />
            <v-text-field label="Last Name" v-model="editData.last_name" variant="outlined" />
            <v-text-field label="Phone" v-model="editData.phone" variant="outlined" />
            <v-text-field label="Email" v-model="editData.email" variant="outlined" />

            <div class="d-flex justify-end mt-8">
                <v-btn variant="text" @click="editDialog = false">Cancel</v-btn>
                <v-btn class="button-color ml-4" @click="saveProfile">
                    Save Changes
                </v-btn>
            </div>

        </v-card>
    </v-dialog>

</v-container>
</template>

<script>
import swtalert from '@/mixins/swtalert';
import PageBreadcrumb from '../SharedComponents/PageBreadcrumb.vue';
import axios from 'axios';

import {
    mapGetters
} from 'vuex';
export default {
    mixins: [swtalert],
    components: {
        PageBreadcrumb
    },
    data() {
        return {
            editDialog: false,
            editData: {}
        };
    },
    computed: {
        ...mapGetters({
            user: 'auth/user',
        })
    },
    methods: {
        // OPEN POPUP WITH USER DATA
        editUser() {
            this.editData = {
                ...this.user
            };
            this.editDialog = true;
        },

        // SAVE PROFILE (Axios + Vuex)
        saveProfile() {
            const {
                name,
                phone,
                email
            } = this.editData;

            axios.post(`/update-user`, {
                    name,
                    phone,
                    email,
                })
                .then((response) => {
                    // Update Vuex store with new user data
                    this.$store.dispatch('auth/updateUser', response.data.user);

                    this.showAlert(response.data.message, "success");

                    this.editDialog = false;
                })
                .catch((error) => {
                    console.error(error);
                    this.$emit("alert", {
                        type: "error",
                        message: "Could not update profile."
                    });
                });
        },
    },

    mounted() {
        if (this.user) {
            this.editData = {
                ...this.user
            };
        }
    }
};
</script>

<style scoped>
.ultra-wrapper {
    /* background: linear-gradient(180deg, #f9fafc 0%, #f3f5f9 100%); */
    min-height: 100vh;
}

/* Breadcrumb */

/* Card */
.ultra-card {
    background: #ffffff;
    border-radius: 24px;
    overflow: hidden;
    box-shadow:
        0 30px 60px rgba(0, 0, 0, 0.05),
        0 10px 20px rgba(0, 0, 0, 0.03);
}

/* Header */
.ultra-header {
    padding: 50px 60px;
    background:
        linear-gradient(135deg,
            #1b867c,
            #003B73,
            #0f172a);

    border-bottom: 1px solid #eef1f5;
    /* color: #ffffff; */
}

.header-content {
    display: flex;
    align-items: center;
}

/* Avatar */
.ultra-avatar {
    border: 5px solid #ffffff;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
}

/* Name */
.ultra-name {
    font-size: 30px;
    font-weight: 700;
    color: #ffffff;
}

.ultra-email {
    color: #ffffff;
    margin-top: 6px;
}

/* Premium Chip */
.gold-chip {
    background: #f7efe6;
    color: #ffffff;
    font-weight: 600;
    border-radius: 14px;
}

.member-since {
    font-size: 13px;
    color: #ffffff;
}

/* Body */
.ultra-body {
    background: #ffffff;
}

/* Glass Info Box */
.glass-box {
    background: #ffffff;
    border-radius: 18px;
    padding: 30px;
    border: 1px solid #eef1f5;
    /* box-shadow: 0 10px 25px rgba(0, 0, 0, 0.03); */
    transition: 0.3s ease;
}

.glass-box:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
}

.section-title {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
}

/* Info Rows */
.info-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 18px;
}

.label {
    color: #9ca3af;
    font-size: 13px;
}

.value {
    font-weight: 600;
    color: #111827;
}

/* Buttons */
.luxury-primary-btn {
    background: linear-gradient(90deg, #06923e, #b87c4c);
    color: white;
    height: 52px;
    border-radius: 14px;
    font-weight: 600;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.06);
}

.luxury-primary-btn:hover {
    transform: translateY(-2px);
}

.luxury-outline-btn {
    height: 52px;
    border-radius: 14px;
    border: 1px solid #e5e7eb;
}

/* Dialog */
.luxury-dialog {
    border-radius: 24px;
}
</style>
