<template>
<v-container class="pa-6" fluid>
    <!-- Breadcrumbs -->
    <nav class="custom-breadcrumbs mb-6 d-flex align-center">
        <span class="breadcrumb-item" @click="$router.push('/dashboard')">
            Dashboard
        </span>
        <span class="breadcrumb-separator mx-2">/</span>
        <span class="breadcrumb-item active">Contact Us</span>
    </nav>

    <v-row justify="center">
        <v-col cols="12" md="7" lg="5">
            <!-- Card -->
            <v-card class="address-card rounded-lg">
                <!-- Header -->
                <v-card-title class="font-weight-bold  py-4 text-center card-header">
                    <v-icon :color="green" class="mr-2">mdi-office-building-marker</v-icon>
                    MNK Address Information
                </v-card-title>

                <!-- Content -->
                <v-card-text class="px-6 py-6">
                    <v-form ref="form" v-model="valid" lazy-validation>
                        <!-- Email -->
                        <v-text-field v-model="form.email" label="Email" placeholder="example@stailika.com" prepend-icon="mdi-email" type="email" :rules="[rules.required, rules.email]" variant="outlined" density="comfortable" class="mb-4"></v-text-field>

                        <!-- Phone -->
                        <v-text-field v-model="form.phone" label="Phone" placeholder="07XXXXXXXX" prepend-icon="mdi-phone" type="tel" :rules="[rules.required, rules.phone]" variant="outlined" density="comfortable" class="mb-4"></v-text-field>

                        <!-- Location -->
                        <v-text-field v-model="form.location" label="Location / Address" placeholder="Street, Building, Suite No." prepend-icon="mdi-map-marker" :rules="[rules.required]" variant="outlined" density="comfortable" class="mb-4"></v-text-field>

                        <!-- City -->
                        <v-text-field v-model="form.city" label="City" placeholder="Dar es Salaam" prepend-icon="mdi-city" variant="outlined" density="comfortable" class="mb-2"></v-text-field>
                    </v-form>
                </v-card-text>

                <!-- Actions -->
                <v-card-actions class="py-4 justify-center card-footer">
                    <v-btn variant="flat" class="px-8 py-2 btn-design" rounded="xl" size="large" @click="submitForm">
                        <v-icon left>mdi-content-save</v-icon>
                        Save Information
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</v-container>
</template>

<script>
import axios from "axios";
import swtalert from "@/mixins/swtalert";

export default {
    mixins: [swtalert],
    data() {
        return {
            green: "#06923e",
            brown: "#b87c4c",
            valid: false,
            form: {
                email: "",
                phone: "",
                location: "",
                city: "",
            },
            rules: {
                required: (value) => !!value || "This field is required",
                email: (value) => {
                    const pattern = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
                    return pattern.test(value) || "Invalid email";
                },
                phone: (value) => {
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
        loadAddress() {
            axios
                .get("/company-address", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                })
                .then((response) => {
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

        submitForm() {
            if (this.$refs.form.validate()) {
                axios
                    .put("/company-address", this.form, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        },
                    })
                    .then((response) => {
                        this.showAlert(response.data.message, "success");
                    })
                    .catch((error) => {
                        this.showAlert(
                            error.response.data.message || "Error updating address.",
                            "error"
                        );
                    });
            } else {
                this.showAlert("Please fill all required fields correctly.", "error");
            }
        },
    },
};
</script>

<style scoped>
/* Card */
.address-card {
   overflow: hidden;
    position: relative;
    background: #ffffff;
    border-radius: 1rem;
}

.address-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
}

.card-header {

    /* brown accent */
    color: #06923e;
    /* green title */
}

/* Text fields */
.v-text-field .v-label {
    font-weight: 500;
    color: #b87c4c;
    /* brown label */
}

.v-text-field input::placeholder {
    color: #b87c4c;
    /* brown placeholder */
    font-style: italic;
}

/* Button */
.button-save {
    background: linear-gradient(90deg, #06923e, #0bb74f);
    /* green shades */
    color: #fff;
    font-weight: 600;
    text-transform: none;
    box-shadow: 0 4px 10px rgba(6, 146, 62, 0.3);
    transition: all 0.3s ease;
}

.button-save:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(6, 146, 62, 0.45);
}
</style>
