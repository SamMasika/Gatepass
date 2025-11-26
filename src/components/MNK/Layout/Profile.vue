<template>
<v-container class="py-12" fluid>
    <!-- Breadcrumbs -->
    <nav class="custom-breadcrumbs mb-6">
        <span class="breadcrumb-item" @click="$router.push('/dashboard')">Dashboard</span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active">Profile</span>
    </nav>
    <v-row justify="center">
        <v-col cols="12" md="7" lg="5">
            <v-card class="profile-card pa-0" rounded="lg" elevation="8">

                <!-- TOP HEADER BAR -->
                <div class="profile-banner"></div>

                <!-- AVATAR -->
                <div class="avatar-container">
                    <v-avatar size="130" class="avatar-shadow">
                        <template v-if="user.avatar">
                            <img :src="user.avatar" alt="Profile" />
                        </template>
                        <template v-else>
                            <v-icon size="80" color="white">mdi-account-circle</v-icon>
                        </template>
                    </v-avatar>
                </div>

                <!-- USER INFO -->
                <div class="user-info text-center">
                    <h2 class="font-weight-bold">{{ user.name }}</h2>
                    <p class="text-subtitle-2"><i>{{ user.email }}</i></p>
                </div>

                <!-- DETAILS -->
                <v-card class="details-section mx-6 mb-10 pa-5" rounded="lg" elevation="2">
                    <h3 class="font-weight-bold mb-4">Personal Information</h3>

                    <v-row>
                        <v-col cols="12" sm="6">
                            <p class="detail-label">Name</p>
                            <p class="detail-value">{{ user.name }}</p>
                        </v-col>

                        <v-col cols="12" sm="6">
                            <p class="detail-label">Phone</p>
                            <p class="detail-value">{{ user.phone }}</p>
                        </v-col>

                        <v-col cols="12" sm="6">
                            <p class="detail-label">Email</p>
                            <p class="detail-value">{{ user.email }}</p>
                        </v-col>
                    </v-row>
                </v-card>

                <!-- SETTINGS BUTTONS -->
                <v-card class="mx-6 mb-10 pa-5 settings-section" rounded="lg" elevation="3">
                    <h3 class="font-weight-bold mb-4">Account Settings</h3>

                    <v-btn block color="#06923e" rounded="xl" size="large" class="mb-3" @click="$router.push('/change-password')">
                        <v-icon left size="20">mdi-lock-reset</v-icon>
                        Change Password
                    </v-btn>

                    <!-- Optional: Edit Profile -->
                   <v-btn block variant="outlined" color="#b87c4c" rounded="xl" size="large" @click="editUser">
                        <v-icon left size="20">mdi-account-edit</v-icon>
                        Edit Profile
                    </v-btn>
                </v-card>

            </v-card>
        </v-col>
    </v-row>

    <!-- POPUP: EDIT PROFILE -->
    <v-dialog v-model="editDialog" max-width="600px">
        <v-card rounded="lg" class="pa-6">
            <h3 class=" font-weight-bold mb-4">Edit Profile</h3>

            <v-text-field label="Full Name" v-model="editData.name" variant="outlined" density="comfortable"></v-text-field>
            <v-text-field label="Phone" v-model="editData.phone" variant="outlined" density="comfortable"></v-text-field>
            <v-text-field label="Email" v-model="editData.email" variant="outlined" density="comfortable"></v-text-field>

            <div class="d-flex justify-end mt-4">
                <v-btn text @click="editDialog = false" rounded="xl" flat>Cancel</v-btn>
                <v-btn color="#06923e" class="ml-3" @click="saveProfile" rounded="xl" flat="">Save</v-btn>
            </div>
        </v-card>
    </v-dialog>
</v-container>
</template>

<script>
import swtalert from '@/mixins/swtalert';
import axios from 'axios';

import {
    mapGetters
} from 'vuex';
export default {
	mixins:[swtalert],
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
            this.editData = { ...this.user };
            this.editDialog = true;
        },

        // SAVE PROFILE (Axios + Vuex)
        saveProfile() {
            const {  name, phone, email } = this.editData;

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
            this.editData = { ...this.user };
        }
    }
};
</script>

<style scoped>
.profile-card {
    overflow: hidden;
    position: relative;
    background: #ffffff;
    border-radius: 1rem;
}

/* Banner uses green primary color */
.profile-banner {
    height: 150px;
    background: linear-gradient(90deg, #06923e, #b87c4c);
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
}

/* Avatar styling */
.avatar-container {
    position: absolute;
    top: 90px;
    left: 50%;
    transform: translateX(-50%);
}

.avatar-shadow {
    border: 4px solid white;
    background: linear-gradient(90deg, #06923e, #b87c4c);
    box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
}

/* User info below avatar */
.user-info {
    margin-top: 80px;
    margin-bottom: 24px;
    padding: 0 24px;
}

/* Cards for details & settings */
.details-section,
.settings-section {
    background: #ffffff;
}

/* Labels and values */
.detail-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #6c757d;
}

.detail-value {
    font-size: 1rem;
    font-weight: 600;
    color: #020B2C;
}
</style>
