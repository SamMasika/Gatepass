<template>
    <v-container
        fluid
        class="error-container fill-height d-flex align-center justify-center"
    >
        <!-- ================= BACKGROUND ================= -->
        <div class="bg-orb orb-1"></div>
        <div class="bg-orb orb-2"></div>
        <div class="bg-orb orb-3"></div>
        <div class="bg-grid"></div>

        <!-- ================= CARD ================= -->
        <v-card
            class="error-card pa-10 text-center"
            elevation="0"
            rounded="xl"
        >
            <!-- ICON -->
            <div class="icon-wrapper mb-6">
                <v-icon size="86" class="pulse-icon">
                    mdi-map-search-outline
                </v-icon>
            </div>

            <!-- CODE -->
            <h1 class="error-code">404</h1>

            <!-- TITLE -->
            <h2 class="error-title">
                This Page Drifted Away
            </h2>

            <!-- MESSAGE -->
            <p class="error-description">
                The page you’re looking for doesn’t exist,
                may have been moved, or you don’t have access.
            </p>

            <!-- COUNTDOWN -->
            <div class="countdown mt-4">
                Redirecting to dashboard in
                <span>{{ countdown }}</span>
                seconds...
            </div>

            <!-- ACTIONS -->
            <div class="d-flex justify-center mt-8 gap-4 flex-wrap">
                <v-btn
                    class="primary-btn"
                    size="large"
                    @click="goDashboard"
                >
                    <v-icon start>mdi-view-dashboard</v-icon>
                    Dashboard
                </v-btn>

                <v-btn
                    variant="outlined"
                    class="outline-btn"
                    size="large"
                    @click="$router.go(-1)"
                >
                    <v-icon start>mdi-arrow-left</v-icon>
                    Go Back
                </v-btn>
            </div>
        </v-card>
    </v-container>
</template>

<script>
export default {
    name: "NotFound",

    data() {
        return {
            countdown: 5,
            timer: null,
        };
    },

    mounted() {
        this.startCountdown();
    },

    beforeUnmount() {
        clearInterval(this.timer);
    },

    methods: {
        startCountdown() {
            this.timer = setInterval(() => {
                this.countdown--;

                if (this.countdown === 0) {
                    this.goDashboard();
                }
            }, 1000);
        },

        goDashboard() {
            clearInterval(this.timer);

            const user = this.$store.getters["auth/user"];

            // Smart redirect based on role
            if (user?.roles?.includes("SECURITY")) {
                this.$router.push("/check-in");
            } else if (user?.roles?.includes("FINAL_APPROVER")) {
                this.$router.push("/final-approval");
            } else {
                this.$router.push("/dashboard");
            }
        },
    },
};
</script>

<style scoped>
/* ===================== BACKGROUND ===================== */
.error-container {
    position: relative;
    overflow: hidden;
    min-height: 100vh;

    background: linear-gradient(135deg, #f6f9fc, #eef3f8, #f7fafc);
}

/* ===================== FLOATING ORBS ===================== */
.bg-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);
    opacity: 0.6;
    animation: float 10s ease-in-out infinite;
}

.orb-1 {
    width: 300px;
    height: 300px;
    background: #008080;
    top: -80px;
    left: -80px;
}

.orb-2 {
    width: 350px;
    height: 350px;
    background: #003b73;
    bottom: -120px;
    right: -100px;
    animation-delay: 2s;
}

.orb-3 {
    width: 200px;
    height: 200px;
    background: #070738;
    top: 40%;
    left: 60%;
    animation-delay: 4s;
    opacity: 0.3;
}

@keyframes float {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-20px);
    }
}

/* ===================== GRID ===================== */
.bg-grid {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
    background-size: 42px 42px;
    opacity: 0.4;
}

/* ===================== CARD ===================== */
.error-card {
    position: relative;
    z-index: 2;

    width: 100%;
    max-width: 540px;

    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(22px);

    border: 1px solid rgba(255, 255, 255, 0.7);

    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.12);

    animation: fadeUp 0.8s ease;
}

@keyframes fadeUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* ===================== ICON ===================== */
.icon-wrapper {
    width: 120px;
    height: 120px;
    margin: 0 auto;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 30px;

    background: rgba(0, 128, 128, 0.08);

    border: 1px solid rgba(0, 128, 128, 0.2);
}

.pulse-icon {
    color: #008080;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}

/* ===================== TEXT ===================== */
.error-code {
    font-size: 96px;
    font-weight: 900;
    letter-spacing: -5px;

    background: linear-gradient(135deg, #008080, #003b73);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.error-title {
    font-size: 30px;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 8px;
}

.error-description {
    font-size: 15px;
    color: #64748b;
    line-height: 1.7;
}

/* ===================== COUNTDOWN ===================== */
.countdown {
    font-size: 14px;
    color: #475569;
}

.countdown span {
    font-weight: 800;
    color: #008080;
}

/* ===================== BUTTONS ===================== */
.primary-btn {
    height: 50px;
    padding: 0 22px;
    border-radius: 14px;

    font-weight: 700;
    color: white !important;

    background: linear-gradient(135deg, #008080, #003b73);

    box-shadow: 0 12px 30px rgba(0, 128, 128, 0.25);

    transition: 0.3s ease;
}

.primary-btn:hover {
    transform: translateY(-2px);
}

.outline-btn {
    height: 50px;
    padding: 0 22px;
    border-radius: 14px;

    border: 1px solid rgba(0, 59, 115, 0.3);
    color: #003b73;
}
</style>