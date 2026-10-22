<template>
  <v-container fluid class="login-container fill-height d-flex align-center justify-center">
    <!-- Background effects -->
    <div class="bg-glow glow-1"></div>
    <div class="bg-glow glow-2"></div>
    <div class="bg-grid"></div>

    <!-- Login Card -->
    <v-card class="login-card mx-auto" elevation="0" rounded="xl">
      <v-row no-gutters>
        <!-- LEFT SHOWCASE -->
        <v-col cols="12" md="6" class="left-section">
          <div class="left-overlay"></div>

          <div class="slider-wrapper">
            <div class="slide slide-1" :class="{ active: activeSlide === 0 }">
              <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop" alt="" />
            </div>
            <div class="slide slide-2" :class="{ active: activeSlide === 1 }">
              <img src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop" alt="" />
            </div>
            <div class="slide slide-3" :class="{ active: activeSlide === 2 }">
              <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop" alt="" />
            </div>
          </div>

          <div class="brand-wrapper">
            <h1 class="brand-title text-center">
              NIDC Gate Pass System
            </h1>
            <h2 class="brand-subtitle text-center">
              Secure Access Control
            </h2>
          </div>
        </v-col>

        <!-- RIGHT FORM -->
        <v-col cols="12" md="6" class="form-section d-flex align-center justify-center">
          <div class="form-wrapper">
            <div class="d-flex justify-center mb-6">
              <v-img src="@/assets/nidc.png" alt="NIDC Logo" max-width="160" contain />
            </div>

            <div class="text-center mb-8">
              <h2 class="login-title">Welcome Back</h2>
              <p class="login-subtitle">
                Sign in to access the Gate Pass Management System.
              </p>
            </div>

            <v-form ref="form" @submit.prevent="submit">
              <v-text-field
                v-model="form.email"
                label="Email Address"
                placeholder="Enter your email"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
                density="comfortable"
                class="custom-field mb-5"
                :rules="[v => !!v || 'Email is required']"
              />

              <v-text-field
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                label="Password"
                placeholder="Enter your password"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                @click:append-inner="showPassword = !showPassword"
                variant="outlined"
                density="comfortable"
                class="custom-field"
                :rules="[v => !!v || 'Password is required']"
              />

              <div class="d-flex justify-end mt-3 mb-7">
                <a href="#" class="forgot-link">Forgot Password?</a>
              </div>

              <v-btn
                block
                size="large"
                type="submit"
                class="login-btn"
                :loading="loading"
                elevation="0"
              >
                <v-icon start>mdi-login</v-icon>
                Secure Login
              </v-btn>
            </v-form>

            <div class="divider-wrapper">
              <div class="divider-line"></div>
            </div>

            <div class="text-center footer-text">
              © {{ new Date().getFullYear() }} NIDC Gate Pass System.<br>
              All rights reserved.
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import swtalert from "@/mixins/swtalert";
import { mapActions } from "vuex";
import "./Login.css";   // ← import the CSS file

export default {
  name: "Login",
  mixins: [swtalert],

  data() {
    return {
      loading: false,
      showPassword: false,
      activeSlide: 0,
      form: {
        email: "",
        password: "",
      },
      slideInterval: null,
    };
  },

  mounted() {
    this.startSlider();
  },

  beforeUnmount() {
    clearInterval(this.slideInterval);
  },

  methods: {
    ...mapActions("auth", ["login"]),

    startSlider() {
      this.slideInterval = setInterval(() => {
        this.activeSlide = (this.activeSlide + 1) % 3;
      }, 5000);
    },

    async submit() {
      if (!this.$refs.form.validate()) return;

      this.loading = true;
      const result = await this.login(this.form);

      if (result.status === "error") {
        this.showAlert(result.message, "error");
      } else {
        this.$router.push({
          name: "dashboard",
          query: { loginSuccess: 1 },
        });
      }

      this.loading = false;
    },
  },
};
</script>