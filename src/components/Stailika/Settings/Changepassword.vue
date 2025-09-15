<template>
<v-row class="mb-4" justify="start" align="start">
  <v-col cols="12" md="6">
    <nav class="custom-breadcrumbs">
      <span class="breadcrumb-item" @click="$router.push('/dashboard')">Dashboard</span>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-item active">Change Password</span>
    </nav>
  </v-col>
</v-row>

  <v-container class="d-flex justify-center align-center fill-height" fluid>
    <v-card class="password-card pa-8" max-width="600">
      <!-- Title -->
      <v-card-title class=" font-weight-bold text-center">
        Change Password
      </v-card-title>

      <!-- Subtitle -->
      <v-card-subtitle class="text-center mb-5">
        Ensure your new password is strong and secure.
      </v-card-subtitle>

      <!-- Form -->
      <v-form ref="form" v-model="formValid" @submit.prevent="changePassword">
        <!-- Current Password -->
        <v-text-field
          v-model="change_password.old_password"
          label="Current Password"
          variant="outlined"
          :type="showCurrent ? 'text' : 'password'"
          :append-inner-icon="showCurrent ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showCurrent = !showCurrent"
          prepend-inner-icon="mdi-lock"
          class="my-3"
          :rules="[v => v && v.length > 0 || 'Current password is required']"
        ></v-text-field>

        <!-- New Password -->
        <v-text-field
          v-model="change_password.new_password"
          label="New Password"
          variant="outlined"
          :type="showNew ? 'text' : 'password'"
          :append-inner-icon="showNew ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showNew = !showNew"
          prepend-inner-icon="mdi-lock-check"
          class="my-3"
          :rules="[v => v && v.length >= 8 || 'Password must be at least 8 characters']"
        ></v-text-field>

        <!-- Confirm New Password -->
        <v-text-field
          v-model="change_password.confirm_password"
          label="Confirm New Password"
          variant="outlined"
          :type="showConfirm ? 'text' : 'password'"
          :append-inner-icon="showConfirm ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showConfirm = !showConfirm"
          prepend-inner-icon="mdi-lock-check"
          class="my-3"
          :rules="[v => v && v === change_password.new_password || 'Passwords do not match']"
        ></v-text-field>

        <!-- Submit Button -->
        <v-btn type="submit" block class="change-btn" size="large" elevation="2">
          <v-icon left>mdi-check-bold</v-icon> Update
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      showCurrent: false,
      showNew: false,
      showConfirm: false,
      change_password: {
        old_password: "",
        new_password: "",
        confirm_password: "",
      },
    };
  },
  methods: {
    async changePassword() {
      // First validate the form
      const isValid = this.$refs.form.validate();
      console.log('Form is valid:', isValid); // Debugging the form validation
      console.log('Form data:', this.change_password); // Debugging the form data

      if (!isValid) return;

      try {
        const response = await axios.post("/update-password", this.change_password);

        // Use the showAlert function for success
        this.showAlert(response.data.message, "success");

        // Reset the form
        this.$refs.form.reset();
        this.$refs.form.resetValidation();
      } catch (error) {
        // Use the showAlert function for error
        this.showAlert(
          error.response?.data?.message || "An error occurred. Please try again.",
          "error"
        );
      }
    },

    showAlert(message, type) {
      this.$swal.fire({
        icon: type, // 'success' or 'error'
        title: message,
        showConfirmButton: false,
        timer: 2000,
      });
    },
  },
};
</script>

<style scoped>
/* Center the card */
.v-container {
  height: 100vh;
}

/* Password Card */
.password-card {
  width: 100%;
  max-width: 600px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

/* Title and subtitle styling */
.text-h5 {
  font-weight: bold;
}

/* Update Button */
.change-btn {
  background-color: #3674b5 !important;
  color: white !important;
  font-weight: bold;
}

/* Adjusting form fields for consistent padding */
.my-3 {
  margin-top: 16px;
  margin-bottom: 16px;
}

/* Icon adjustments */
.mdi-lock,
.mdi-lock-check {
  color: #3674b5;
}
</style>
