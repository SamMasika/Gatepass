<template>
<v-container class="pa-6" max-width="800px">
    <!-- Breadcrumbs -->
    <nav class="custom-breadcrumbs mb-6">
        <span class="breadcrumb-item" @click="$router.push('/dashboard')">Dashboard</span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active">Contact Us</span>
    </nav>

    <v-card class="rounded-lg elevation-0">

        <!-- Form Header -->
        <v-card-title class="font-weight-bold px-6 py-4 text-center" style="border-bottom: 1px solid #eee;">
            Stailika Address Information
        </v-card-title>

        <!-- Form Content -->
        <v-card-text class="px-6 py-4">
            <v-form ref="form" v-model="valid" lazy-validation>

                <!-- Email -->
                <v-text-field v-model="form.email" label="Email" placeholder="example@stailika.com" prepend-icon="mdi-email" type="email" :rules="[rules.required, rules.email]" variant="outlined" density="comfortable" class="mb-4"></v-text-field>

                <!-- Phone -->
                <v-text-field v-model="form.phone" label="Phone" placeholder="07XXXXXXXX" prepend-icon="mdi-phone" type="tel" :rules="[rules.required, rules.phone]" variant="outlined" density="comfortable" class="mb-4"></v-text-field>

                <!-- Location -->
                <v-text-field v-model="form.location" label="Location / Address" placeholder="Street, Building, Suite No." prepend-icon="mdi-map-marker" :rules="[rules.required]" variant="outlined" density="comfortable" class="mb-4"></v-text-field>

                <!-- City -->
                <v-text-field v-model="form.city" label="City" placeholder="Dar es Salaam" prepend-icon="mdi-city" variant="outlined" density="comfortable" class="mb-4"></v-text-field>

            </v-form>
        </v-card-text>

        <!-- Actions -->
        <v-card-actions class="px-6 py-4" style="border-top: 1px solid #eee;">
            <v-spacer></v-spacer>
            <v-btn variant="flat" class="px-6 py-2 button-color" rounded="xl" @click="submitForm">
                Save Information
            </v-btn>
            <v-spacer></v-spacer>
        </v-card-actions>

    </v-card>
</v-container>
</template>

<script>
import axios from "axios";
import swtalert from "@/mixins/swtalert";

export default {
    mixins: [swtalert],
    data() {
        return {
            valid: false,
            form: {
                email: "",
                phone: "",
                location: "",
                city: "",
            },
            rules: {
                required: value => !!value || "This field is required",
                email: value => {
                    const pattern = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
                    return pattern.test(value) || "Invalid email";
                },
                phone: value => {
                    const pattern = /^[0-9]{7,15}$/;
                    return pattern.test(value) || "Invalid phone number";
                },
            },
        };
    },
    mounted() {
        this.loadAddress();
    },
    methods: {
        // Load the first company address
        loadAddress() {
            axios
                .get("/company-address", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`
                    },
                })
                .then(response => {
                    if (response.data && response.data.data) {
                        this.form = {
                            ...response.data.data
                        };
                    }
                })
                .catch(() => {
                    this.showAlert("Failed to load company address.", "error");
                });
        },

        // Submit updated address
        submitForm() {
            if (this.$refs.form.validate()) {
                axios
                    .put("/company-address", {
                        ...this.form
                    }, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("access_token")}`
                        },
                    })
                    .then(response => {
                        this.showAlert(response.data.message, "success");
                    })
                    .catch(error => {
                        this.showAlert(error.response.data.message || "Error updating address.", "error");
                    });
            } else {
                this.showAlert("Please fill all required fields correctly.", "error");
            }
        },
    },
};
</script>

<style scoped>
.v-card-title {
    font-weight: 600;
    color: #333;
}

.v-text-field .v-label {
    font-weight: 500;
    color: #555;
}

.v-text-field input::placeholder {
    color: #999;
    font-style: italic;
}

.v-btn {
    font-weight: 600;
    text-transform: none;
}
</style>
