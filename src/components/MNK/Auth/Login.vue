<template>
<v-container fluid class="login-container d-flex align-center justify-center">
    <v-card class="login-card pa-8" elevation="12" rounded="lg" max-width="500">
        <!-- Logo -->
        <div class="d-flex justify-center mb-6">
            <v-avatar size="100" class="logo-avatar">
                <v-img src="@/assets/logo.png" alt="Logo" />
            </v-avatar>
        </div>

        <!-- Title -->
        <div class="text-center mb-6">
            <h2 class="form-title">Welcome Back</h2>
            <p class="form-subtitle">Log in to your account</p>
        </div>

        <!-- Form -->
        <v-card-text>
            <v-form ref="form" @submit.prevent="submit">
                <v-text-field v-model="form.email" type="email" label="Email" prepend-inner-icon="mdi-email" variant="outlined" density="comfortable" class="mb-4" :rules="[v => !!v || 'Email is required']" hide-details="auto" />

                <v-text-field v-model="form.password" :type="visible ? 'text' : 'password'" label="Password" prepend-inner-icon="mdi-lock" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" @click:append-inner="visible = !visible" variant="outlined" density="comfortable" class="mb-3" :rules="[v => !!v || 'Password is required']" hide-details="auto" />

                <div class="text-right mb-6">
                    <a href="#" class="forgot-link">Forgot password?</a>
                </div>

                <v-btn block type="submit" class="login-btn" size="large" prepend-icon="mdi-login" :loading="loading">
                    Log In
                </v-btn>
            </v-form>
        </v-card-text>
    </v-card>
</v-container>
</template>

<script>
import {
    mapActions
} from "vuex";

export default {
    data() {
        return {
            visible: false,
            loading: false,
            form: {
                email: "",
                password: ""
            },
        };
    },
    methods: {
        ...mapActions("auth", ["login"]),
        async submit() {
            if (!this.$refs.form.validate()) return;

            this.loading = true;
            const result = await this.login(this.form);

            if (result.status === "error") {
                this.$swal.fire({
                    icon: "error",
                    title: result.message,
                    timer: 4000
                });
            } else {
                this.$swal.fire({
                    icon: "success",
                    title: "Login Successful",
                    timer: 1500,
                    showConfirmButton: false
                });

                // Redirect to dashboard
                this.$nextTick(() => {
                    this.$router.push({
                        name: "dashboard"
                    });
                });
            }
            this.loading = false;
        }
    }
};
</script>

<style scoped>
.login-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #06923e, #b87c4c);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.login-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(14px);
    /* border-radius: 5px; */
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
    width: 100%;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.login-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 36px rgba(0, 0, 0, 0.25);
}

.logo-avatar {
    background: white;
    border: 2px solid #ffffff;
    padding: 6px;
}

.form-title {
    font-size: 1.9rem;
    font-weight: 700;
    color: #06923e;
}

.form-subtitle {
    font-size: 1rem;
    color: #555;
}

.login-btn {
    background: #06923e !important;
    color: white !important;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-radius: 12px;
    transition: all 0.3s ease;
}

.login-btn:hover {
    background: #b87c4c !important;
    transform: translateY(-2px);
}

.forgot-link {
    font-size: 0.875rem;
    font-weight: 500;
    color: #06923e;
    text-decoration: none;
}

.forgot-link:hover {
    text-decoration: underline;
}
</style>
