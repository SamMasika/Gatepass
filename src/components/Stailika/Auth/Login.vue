<template>
  <v-container fluid class="login-container d-flex align-center justify-center">
    <v-card class="login-card pa-10" elevation="10" rounded="xl" max-width="420">
      <!-- Logo -->
      <div class="d-flex justify-center mb-6">
        <v-avatar size="90" class="logo-avatar">
          <v-img src="@/assets/stailika.png" alt="Logo" />
        </v-avatar>
      </div>

      <!-- Title -->
      <div class="text-center mb-8">
        <h2 class="form-title">Welcome Back</h2>
        <p class="form-subtitle">Login to your account</p>
      </div>

      <!-- Form -->
      <v-form @submit.prevent="submit" ref="form">
        <!-- Phone -->
        <v-text-field
          v-model="form.phone"
          label="Phone Number"
          prepend-inner-icon="mdi-account"
          variant="outlined"
          density="comfortable"
          autocomplete="off"
          class="mb-4"
          :rules="[v => !!v || 'Phone number is required']"
        />

        <!-- Password -->
        <v-text-field
          v-model="form.password"
          :type="visible ? 'text' : 'password'"
          label="Password"
          prepend-inner-icon="mdi-lock"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="visible = !visible"
          variant="outlined"
          density="comfortable"
          class="mb-2"
          :rules="[v => !!v || 'Password is required']"
        />

        <!-- Forgot password -->
        <div class="text-right mb-6">
          <a href="#" class="forgot-link">Forgot password?</a>
        </div>

        <!-- Login button -->
        <v-btn
          block
          type="submit"
          class="login-btn"
          size="large"
          prepend-icon="mdi-login"
          elevation="4"
          :loading="loading"
        >
          Log In
        </v-btn>
      </v-form>

      <!-- Sign Up -->
      <div class="text-center mt-6">
        <span class="text-grey-darken-1">Don’t have an account?</span>
        <a href="#" class="signup-link"> Sign Up</a>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      visible: false,
      loading: false,
      form: {
        phone: "",
        password: "",
      },
    };
  },

  methods: {
    ...mapActions({
      login: "auth/login",
    }),

    async submit() {
      if (!this.$refs.form.validate()) return;

      this.loading = true;
      const result = await this.login(this.form);

      if (result.status === "error") {
        this.$swal.fire({
          icon: "error",
          title: result.message,
          timer: 4000,
        });
      } else {
        this.$swal.fire({
          icon: "success",
          title: "Login Successful",
          timer: 1500,
          showConfirmButton: false,
        });
        this.$router.replace({ name: "dashboard" });
      }

      this.loading = false;
    },
  },
};
</script>

<style scoped>
/* Background */
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #002147, #004080);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

/* Card (Glassmorphism style) */
.login-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  width: 100%;
}

/* Logo */
.logo-avatar {
  background: #ffffff;
  border: 2px solid #e0e0e0;
  padding: 8px;
}

/* Title */
.form-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #002147;
}
.form-subtitle {
  font-size: 1rem;
  color: #555;
}

/* Button */
.login-btn {
  background: #002147 !important;
  color: white !important;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}
.login-btn:hover {
  background: #004080 !important;
  transform: translateY(-2px);
}

/* Links */
.forgot-link {
  font-size: 0.9rem;
  font-weight: 500;
  color: #002147;
  text-decoration: none;
}
.forgot-link:hover {
  text-decoration: underline;
}
.signup-link {
  color: #002147;
  font-weight: 600;
  margin-left: 4px;
  text-decoration: none;
}
.signup-link:hover {
  text-decoration: underline;
}
</style>
