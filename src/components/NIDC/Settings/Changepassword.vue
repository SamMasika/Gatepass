<template>
<v-container fluid class="px-6 py-4">
    <!-- BREADCRUMB -->
    <PageBreadcrumb title="Change Password" />

    <!-- CENTERED CARD -->
    <v-row justify="center" class="mt-6">
        <v-col cols="12" sm="10" md="7" lg="5">
            <v-card class="premium-password-card" rounded="xl" elevation="0">
                <!-- HEADER -->
                <div class="password-header">
                    <div class="password-icon">
                        <v-icon size="36" color="white">mdi-shield-lock-outline</v-icon>
                    </div>
                    <div class="ml-4">
                        <div class="password-title">Change Password</div>
                        <div class="password-subtitle">
                            Ensure your new password is strong and secure.
                        </div>
                    </div>
                </div>

                <!-- BODY -->
                <div class="password-body">
                    <v-form ref="form" v-model="formValid" @submit.prevent="changePassword">
                        <!-- CURRENT PASSWORD -->
                        <div class="premium-input-group">
                            <label class="premium-label">Current Password</label>
                            <v-text-field v-model="change_password.old_password" placeholder="Enter current password" variant="solo-filled" flat rounded="lg" hide-details="auto" prepend-inner-icon="mdi-lock-outline" :type="showCurrent ? 'text' : 'password'" :append-inner-icon="showCurrent ? 'mdi-eye-off' : 'mdi-eye'" @click:append-inner="showCurrent = !showCurrent" :rules="[(v) => !!v || 'Current password is required']" />
                        </div>

                        <!-- NEW PASSWORD -->
                        <div class="premium-input-group">
                            <label class="premium-label">New Password</label>
                            <v-text-field v-model="change_password.new_password" placeholder="Enter new password" variant="solo-filled" flat rounded="lg" hide-details="auto" prepend-inner-icon="mdi-lock-check-outline" :type="showNew ? 'text' : 'password'" :append-inner-icon="showNew ? 'mdi-eye-off' : 'mdi-eye'" @click:append-inner="showNew = !showNew" :rules="[
                    (v) => !!v || 'New password is required',
                    (v) => (v && v.length >= 8) || 'Password must be at least 8 characters',
                  ]" />
                        </div>

                        <!-- CONFIRM PASSWORD -->
                        <div class="premium-input-group">
                            <label class="premium-label">Confirm New Password</label>
                            <v-text-field v-model="change_password.new_password_confirmation" placeholder="Confirm new password" variant="solo-filled" flat rounded="lg" hide-details="auto" prepend-inner-icon="mdi-lock-check-outline" :type="showConfirm ? 'text' : 'password'" :append-inner-icon="showConfirm ? 'mdi-eye-off' : 'mdi-eye'" @click:append-inner="showConfirm = !showConfirm" :rules="[
                    (v) => !!v || 'Please confirm your password',
                    (v) => v === change_password.new_password || 'Passwords do not match',
                  ]" />
                        </div>

                        <!-- SUBMIT -->
                        <div class="mt-6">
                            <v-btn type="submit" block class="primary-btn" rounded="lg" height="52" elevation="0">
                                <v-icon start>mdi-check-bold</v-icon>
                                Update Password
                            </v-btn>
                        </div>
                    </v-form>
                </div>
            </v-card>
        </v-col>
    </v-row>
</v-container>
</template>

<script>
import axios from "axios";
import PageBreadcrumb from "../SharedComponents/PageBreadcrumb.vue";

export default {
    components: {
        PageBreadcrumb,
    },

    data() {
        return {
            formValid: false,
            showCurrent: false,
            showNew: false,
            showConfirm: false,
            change_password: {
                old_password: "",
                new_password: "",
                new_password_confirmation: "",
            },
        };
    },

    methods: {
        async changePassword() {
            const {
                valid
            } = await this.$refs.form.validate();
            if (!valid) return;

            try {
                const response = await axios.post("/update-password", this.change_password);

                this.showAlert(response.data.message || "Password updated successfully", "success");

                this.$refs.form.reset();
                this.$refs.form.resetValidation();

                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } catch (error) {
                this.showAlert(
                    error.response ?.data ?.message || "An error occurred. Please try again.",
                    "error"
                );
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
};
</script>

<style scoped>
.premium-password-card {
    background: var(--surface);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-lg);
    overflow: hidden;
}

.password-header {
    display: flex;
    align-items: center;
    padding: 32px;
    background: linear-gradient(135deg, var(--brand), var(--brand-dark), #0f172a);
    color: var(--white);
}

.password-icon {
    width: 72px;
    height: 72px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(8px);
}

.password-title {
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.3px;
}

.password-subtitle {
    font-size: 14px;
    opacity: 0.85;
    margin-top: 4px;
}

.password-body {
    padding: 32px;
    background: var(--surface);
}

.premium-input-group {
    margin-bottom: 20px;
}

.premium-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: 8px;
    letter-spacing: 0.2px;
}

.primary-btn {
    background: linear-gradient(135deg, var(--brand), var(--brand-dark)) !important;
    color: var(--white) !important;
    font-weight: 600;
    text-transform: none;
    letter-spacing: 0.3px;
    box-shadow: 0 6px 16px color-mix(in srgb, var(--brand) 25%, transparent);
}

.primary-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 22px color-mix(in srgb, var(--brand) 35%, transparent);
}
</style>
