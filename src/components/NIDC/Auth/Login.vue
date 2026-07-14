<template>
<v-container fluid class="login-container fill-height d-flex align-center justify-center">
    <!-- ===================== BACKGROUND GLOW ===================== -->
    <div class="bg-glow glow-1"></div>
    <div class="bg-glow glow-2"></div>
    <div class="bg-grid"></div>

    <!-- ===================== LOGIN CARD ===================== -->
    <v-card class="login-card" elevation="0" rounded="xl">
        <v-row no-gutters>
            <!-- =========================================================
                    LEFT PREMIUM SHOWCASE
                ========================================================== -->
            <v-col cols="12" md="6" class="left-section">
                <!-- OVERLAY -->
                <div class="left-overlay"></div>

                <!-- SLIDING IMAGES -->
                <div class="slider-wrapper">

                    <!-- IMAGE 1 -->
                    <div class="slide slide-1" :class="{ active: activeSlide === 0 }">
                        <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop" alt="" />
                    </div>

                    <!-- IMAGE 2 -->
                    <div class="slide slide-2" :class="{ active: activeSlide === 1 }">
                        <img src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop" alt="" />
                    </div>

                    <!-- IMAGE 3 -->
                    <div class="slide slide-3" :class="{ active: activeSlide === 2 }">
                        <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop" alt="" />
                    </div>
                </div>

                <!-- CONTENT -->
                <div class="brand-wrapper">

                    <!-- <div class="top-badge">
                        <v-icon size="18">mdi-shield-check</v-icon>
                        Secure Access Platform
                    </div> -->

                    <h1 class="brand-title text-center">
                        NIDC Gate Pass System
                    </h1>

                    <h2 class="brand-subtitle text-center">
                        Secure Entry Management
                    </h2>

                    <!-- <p class="brand-description">
                        Modern enterprise-grade visitor and gate pass
                        management designed for secure facilities,
                        seamless monitoring, and intelligent access control.
                    </p> -->

                    <!-- FEATURE ITEMS -->
                    <div class="feature-list">

                        <div class="feature-item">
                            <div class="feature-icon">
                                <v-icon>mdi-cctv</v-icon>
                            </div>

                            <div>
                                <h4>Real-time Monitoring</h4>
                                <p>Track entries and exits instantly.</p>
                            </div>
                        </div>

                        <div class="feature-item">
                            <div class="feature-icon">
                                <v-icon>mdi-shield-lock</v-icon>
                            </div>

                            <div>
                                <h4>Advanced Security</h4>
                                <p>Enterprise-level access protection.</p>
                            </div>
                        </div>

                        <div class="feature-item">
                            <div class="feature-icon">
                                <v-icon>mdi-chart-line</v-icon>
                            </div>

                            <div>
                                <h4>Smart Analytics</h4>
                                <p>Powerful operational insights.</p>
                            </div>
                        </div>

                    </div>

                </div>
            </v-col>

            <!-- =========================================================
                    RIGHT LOGIN FORM
                ========================================================== -->
            <v-col cols="12" md="6" class="form-section d-flex align-center justify-center">
                <div class="form-wrapper">

                    <!-- LOGO -->
                    <div class="d-flex justify-center mb-6">
                        <v-img src="@/assets/nidc.png" alt="NIDC Logo" max-width="180" contain />
                    </div>
                    <!-- WELCOME -->
                    <div class="text-center mb-8">
                        <h2 class="login-title">
                            Welcome Back
                        </h2>

                        <p class="login-subtitle">
                            Sign in to access the Gate Pass Management System.
                        </p>
                    </div>
                    <!-- FORM -->
                    <v-form ref="form" @submit.prevent="submit">

                        <!-- EMAIL -->
                        <v-text-field v-model="form.email" label="Email Address" placeholder="Enter your email" prepend-inner-icon="mdi-email-outline" variant="outlined" density="comfortable" class="custom-field mb-5" :rules="[v => !!v || 'Email is required']" />

                        <!-- PASSWORD -->
                        <v-text-field v-model="form.password" :type="showPassword ? 'text' : 'password'" label="Password" placeholder="Enter your password" prepend-inner-icon="mdi-lock-outline" :append-inner-icon="
                                    showPassword
                                        ? 'mdi-eye-off-outline'
                                        : 'mdi-eye-outline'
                                " @click:append-inner="
                                    showPassword = !showPassword
                                " variant="outlined" density="comfortable" class="custom-field" :rules="[v => !!v || 'Password is required']" />

                        <!-- OPTIONS -->
                        <div class="d-flex justify-space-between align-center mt-3 mb-7">
                            <!-- <v-checkbox density="compact" hide-details label="Remember me" color="#008080" /> -->

                            <a href="#" class="forgot-link">
                                Forgot Password?
                            </a>
                        </div>

                        <!-- LOGIN BUTTON -->
                        <v-btn block size="large" type="submit" class="login-btn" :loading="loading" elevation="0">
                            <v-icon start>
                                mdi-login
                            </v-icon>

                            Secure Login
                        </v-btn>

                    </v-form>

                    <!-- DIVIDER -->
                    <div class="divider-wrapper">
                        <div class="divider-line"></div>
                    </div>

                    <!-- FOOTER -->
                    <div class="text-center footer-text">
                        © {{ new Date().getFullYear() }}
                        NIDC Gate Pass System.
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
import {
    mapActions
} from "vuex";

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
                this.activeSlide++;

                if (this.activeSlide > 2) {
                    this.activeSlide = 0;
                }
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
                    query: {
                        loginSuccess: 1,
                    },
                });
            }

            this.loading = false;
        },
    },
};
</script>

<style scoped>
/* =========================================================
    PAGE BACKGROUND
========================================================= */
.login-container {
    position: relative;
    overflow: hidden;
    min-height: 100vh;

    background:
        radial-gradient(circle at top left,
            rgba(0, 128, 128, 0.08),
            transparent 30%),

        radial-gradient(circle at bottom right,
            rgba(0, 59, 115, 0.12),
            transparent 35%),

        linear-gradient(135deg,
            #f4f7fb,
            #eef3f8,
            #f7fafc);
}

/* =========================================================
    BACKGROUND EFFECTS
========================================================= */
.bg-glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    z-index: 0;
}

.glow-1 {
    width: 320px;
    height: 320px;
    background: rgba(0, 128, 128, 0.15);
    top: -100px;
    left: -100px;
}

.glow-2 {
    width: 380px;
    height: 380px;
    background: rgba(0, 59, 115, 0.15);
    right: -120px;
    bottom: -120px;
}

.bg-grid {
    position: absolute;
    inset: 0;

    background-image:
        linear-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px);

    background-size: 40px 40px;

    opacity: 0.15;
}

/* =========================================================
    CARD
========================================================= */
.login-card {
    position: relative;
    z-index: 2;

    width: 100%;
    max-width: 1180px;

    overflow: hidden;

    border-radius: 34px !important;

    background: rgba(255, 255, 255, 0.7);

    backdrop-filter: blur(20px);

    border: 1px solid rgba(255, 255, 255, 0.6);

    box-shadow:
        0 25px 60px rgba(15, 23, 42, 0.15),
        0 10px 25px rgba(15, 23, 42, 0.06);
}

/* =========================================================
    LEFT SECTION
========================================================= */
.left-section {
    position: relative;
    min-height: 720px;
    overflow: hidden;

    background: linear-gradient(135deg,
            #2bbcbc,
            #2f6fbf,
            #2a3f6f);
}

/* =========================================================
    SLIDER
========================================================= */
.slider-wrapper {
    position: absolute;
    inset: 0;
}

.slide {
    position: absolute;
    inset: 0;

    opacity: 0;

    transform: scale(1.08);

    transition:
        opacity 1.5s ease,
        transform 7s ease;
}

.slide.active {
    opacity: 1;
    transform: scale(1);
}

.slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;

    filter:
        brightness(0.45) saturate(1.1);
}

/* =========================================================
    OVERLAY
========================================================= */
.left-overlay {
    position: absolute;
    inset: 0;

    background:
        linear-gradient(135deg,
            rgba(0, 128, 128, 0.80),
            rgba(0, 59, 115, 0.78),
            rgba(7, 7, 56, 0.92));

    z-index: 1;
}

/* =========================================================
    BRAND CONTENT
========================================================= */
.brand-wrapper {
    position: relative;
    z-index: 3;

    padding: 60px;

    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;

    color: white;
}

.top-badge {
    width: fit-content;

    display: flex;
    align-items: center;
    gap: 8px;

    padding: 10px 18px;

    border-radius: 999px;

    background: rgba(255, 255, 255, 0.12);

    backdrop-filter: blur(10px);

    border: 1px solid rgba(255, 255, 255, 0.15);

    margin-bottom: 28px;

    font-size: 13px;
    font-weight: 600;
}

.brand-title {
    font-size: 42px;
    font-weight: 900;
    line-height: 1.05;

    margin-bottom: 18px;

    letter-spacing: -2px;
}

.brand-subtitle {
    font-size: 24px;
    font-weight: 500;
    opacity: 0.95;

    margin-bottom: 20px;
}

.brand-description {
    max-width: 500px;

    font-size: 15px;
    line-height: 1.9;

    opacity: 0.85;

    margin-bottom: 40px;
}

/* =========================================================
    FEATURES
========================================================= */
.feature-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.feature-item {
    display: flex;
    align-items: center;
    gap: 18px;

    padding: 18px 20px;

    border-radius: 18px;

    background: rgba(255, 255, 255, 0.08);

    backdrop-filter: blur(12px);

    border: 1px solid rgba(255, 255, 255, 0.08);

    transition: 0.4s ease;
}

.feature-item:hover {
    transform: translateX(10px);

    background: rgba(255, 255, 255, 0.12);
}

.feature-icon {
    width: 52px;
    height: 52px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 16px;

    background: rgba(255, 255, 255, 0.14);

    font-size: 22px;
}

.feature-item h4 {
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 4px;
}

.feature-item p {
    font-size: 13px;
    opacity: 0.8;
}

/* =========================================================
    FORM SECTION
========================================================= */
.form-section {
    background:
        linear-gradient(180deg,
            rgba(255, 255, 255, 0.96),
            rgba(248, 250, 252, 0.98));
}

.form-wrapper {
    width: 100%;
    max-width: 420px;
    padding: 50px 20px;
}

/* =========================================================
    LOGO
========================================================= */
.logo-wrapper {
    padding: 18px;

    border-radius: 24px;

    background: white;

    box-shadow:
        0 15px 40px rgba(15, 23, 42, 0.08);
}

/* =========================================================
    TITLES
========================================================= */
.login-title {
    font-size: 28px;
    font-weight: 800;

    color: #0f172a;

    margin-bottom: 8px;
}

.login-subtitle {
    font-size: 15px;
    color: #64748b;
}

/* =========================================================
    INPUTS
========================================================= */
.custom-field :deep(.v-field) {
    border-radius: 16px !important;
    box-shadow: none !important;
}

.custom-field :deep(.v-field--focused) {
    box-shadow:
        0 0 0 4px rgba(0, 128, 128, 0.08) !important;
}

/* =========================================================
    LOGIN BUTTON
========================================================= */
.login-btn {
    height: 56px !important;

    border-radius: 18px !important;

    font-weight: 700;

    letter-spacing: 0.5px;

    color: white !important;

    background:
        linear-gradient(135deg,
            #008080,
            #003B73,
            #070738);

    box-shadow:
        0 12px 25px rgba(0, 59, 115, 0.25);

    transition: 0.4s ease;
}

.login-btn:hover {
    transform: translateY(-3px);

    box-shadow:
        0 18px 35px rgba(0, 59, 115, 0.35);
}

/* =========================================================
    LINKS
========================================================= */
.forgot-link {
    font-size: 14px;
    font-weight: 600;

    color: #008080;

    text-decoration: none;

    transition: 0.3s ease;
}

.forgot-link:hover {
    color: #003B73;
}

/* =========================================================
    DIVIDER
========================================================= */
.divider-wrapper {
    margin: 34px 0 20px;
}

.divider-line {
    height: 1px;

    background:
        linear-gradient(to right,
            transparent,
            rgba(148, 163, 184, 0.4),
            transparent);
}

/* =========================================================
    FOOTER
========================================================= */
.footer-text {
    font-size: 13px;
    color: #94a3b8;
}

/* =========================================================
    RESPONSIVE
========================================================= */
@media (max-width: 960px) {

    .left-section {
        min-height: 600px;
    }

    .brand-wrapper {
        padding: 40px;
    }

    .brand-title {
        font-size: 38px;
    }

    .brand-subtitle {
        font-size: 20px;
    }
}

@media (max-width: 600px) {

    .login-container {
        padding: 18px;
    }

    .brand-wrapper {
        padding: 30px;
    }

    .brand-title {
        font-size: 32px;
    }

    .feature-item {
        padding: 16px;
    }

    .form-wrapper {
        padding: 40px 10px;
    }
}
</style>
