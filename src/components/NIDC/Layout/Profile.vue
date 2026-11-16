<template>
  <v-container fluid class="ultra-wrapper py-12">
    <PageBreadcrumb title="Profile Overview" />

    <v-row justify="center">
      <v-col cols="12" lg="10">
        <v-card class="ultra-card" elevation="0">
          <!-- TOP HEADER -->
          <div class="ultra-header">
            <div class="header-content">
              <v-avatar size="130" class="ultra-avatar">
                <img v-if="user.avatar" :src="user.avatar" alt="Avatar" />
                <v-icon v-else size="80" color="white">mdi-account</v-icon>
              </v-avatar>

              <div class="ml-6">
                <h1 class="ultra-name">{{ user.first_name }} {{ user.last_name }}</h1>
                <p class="ultra-email">{{ user.email }}</p>
              </div>
            </div>
          </div>

          <!-- BODY -->
          <div class="ultra-body px-12 py-10">
            <!-- SECURITY ALERT -->
            <div v-if="user && user.is_password_changed === 0" class="security-alert mb-10">
              <div class="security-alert-inner">
                <div class="security-icon-wrap">
                  <v-icon size="28" color="white">mdi-shield-lock-outline</v-icon>
                </div>

                <div class="security-content">
                  <h3 class="security-title">Security Action Required</h3>
                  <p class="security-text">
                    For your protection, please change your temporary password before accessing other features of your account.
                  </p>
                </div>

                <v-btn
                  class="security-btn"
                  elevation="0"
                  @click="$router.push('/change-password')"
                >
                  <v-icon start size="20">mdi-lock-reset</v-icon>
                  Change Password Now
                </v-btn>
              </div>
            </div>

            <v-row>
              <!-- PERSONAL INFO -->
              <v-col cols="12" md="6">
                <div class="glass-box">
                  <h3 class="section-title mb-6">Personal Information</h3>

                  <div class="info-row">
                    <span class="label">Full Name</span>
                    <span class="value">{{ user.first_name }} {{ user.last_name }}</span>
                  </div>

                  <div class="info-row">
                    <span class="label">Phone</span>
                    <span class="value">{{ user.phone || '—' }}</span>
                  </div>

                  <div class="info-row">
                    <span class="label">Email</span>
                    <span class="value">{{ user.email }}</span>
                  </div>
                </div>
              </v-col>

              <!-- ACCOUNT SETTINGS -->
              <v-col cols="12" md="6">
                <div class="glass-box">
                  <h3 class="section-title mb-6">Account & Security</h3>

                  <v-btn
                    block
                    class="primary-btn mb-4"
                    elevation="0"
                    @click="$router.push('/change-password')"
                  >
                    <v-icon start>mdi-lock-reset</v-icon>
                    Change Password
                  </v-btn>

                  <v-btn
                    block
                    variant="outlined"
                    class="outline-btn"
                    @click="editUser"
                  >
                    <v-icon start>mdi-account-edit</v-icon>
                    Edit Profile
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- EDIT PROFILE DIALOG -->
    <v-dialog v-model="editDialog" max-width="600">
      <v-card class="luxury-dialog pa-10">
        <h2 class="dialog-title mb-6">Edit Profile</h2>

        <v-text-field
          label="First Name"
          v-model="editData.first_name"
          variant="outlined"
          class="mb-3"
        />
        <v-text-field
          label="Last Name"
          v-model="editData.last_name"
          variant="outlined"
          class="mb-3"
        />
        <v-text-field
          label="Phone"
          v-model="editData.phone"
          variant="outlined"
          class="mb-3"
        />
        <v-text-field
          label="Email"
          v-model="editData.email"
          variant="outlined"
        />

        <div class="d-flex justify-end mt-8">
          <v-btn variant="text" @click="editDialog = false">Cancel</v-btn>
          <v-btn class="primary-btn ml-4" @click="saveProfile">
            Save Changes
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import swtalert from '@/mixins/swtalert';
import PageBreadcrumb from '../SharedComponents/PageBreadcrumb.vue';
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  mixins: [swtalert],
  components: {
    PageBreadcrumb
  },
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
    editUser() {
      this.editData = { ...this.user };
      this.editDialog = true;
    },

    saveProfile() {
      const { first_name, last_name, phone, email } = this.editData;

      axios.post(`/update-user`, {
        first_name,
        last_name,
        phone,
        email,
      })
      .then((response) => {
        this.$store.dispatch('auth/updateUser', response.data.user);
        this.showAlert(response.data.message, "success");
        this.editDialog = false;
      })
      .catch((error) => {
        console.error(error);
        this.showAlert(
          error.response?.data?.message || "Could not update profile.",
          "error"
        );
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
.ultra-wrapper {
  min-height: 100vh;
}

/* Card */
.ultra-card {
  background: var(--surface);
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-lg);
}

/* Header */
.ultra-header {
  padding: 50px 60px;
  background: linear-gradient(135deg, var(--brand), var(--brand-dark), #0f172a);
}

.header-content {
  display: flex;
  align-items: center;
}

.ultra-avatar {
  border: 5px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
}

.ultra-name {
  font-size: 30px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.5px;
}

.ultra-email {
  color: rgba(255, 255, 255, 0.85);
  margin-top: 6px;
  font-size: 15px;
}

/* Body */
.ultra-body {
  background: var(--surface);
}

/* Security Alert */
.security-alert {
  border-radius: 20px;
  background: linear-gradient(135deg, var(--orange), #d97706);
  padding: 2px;
  box-shadow: 0 16px 32px rgba(234, 88, 12, 0.2);
}

.security-alert-inner {
  background: var(--warning-light);
  border-radius: 18px;
  padding: 28px 32px;
  display: flex;
  align-items: center;
  gap: 24px;
  border: 1px solid rgba(234, 88, 12, 0.3);
}

.security-icon-wrap {
  width: 56px;
  height: 56px;
  min-width: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--orange), #d97706);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(234, 88, 12, 0.35);
}

.security-content {
  flex: 1;
}

.security-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--orange);
  margin-bottom: 6px;
}

.security-text {
  font-size: 14.5px;
  color: var(--text-secondary);
  line-height: 1.55;
  margin: 0;
  max-width: 520px;
}

.security-btn {
  background: linear-gradient(90deg, var(--orange), #d97706) !important;
  color: white !important;
  height: 48px;
  border-radius: 14px;
  font-weight: 600;
  padding: 0 24px;
  text-transform: none;
  letter-spacing: 0.3px;
  box-shadow: 0 8px 18px rgba(234, 88, 12, 0.35);
  white-space: nowrap;
}

.security-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(234, 88, 12, 0.45);
}

@media (max-width: 960px) {
  .security-alert-inner {
    flex-direction: column;
    text-align: center;
    gap: 18px;
    padding: 28px 24px;
  }

  .security-text {
    max-width: 100%;
  }
}

/* Glass Boxes */
.glass-box {
  background: var(--surface-alt);
  border-radius: 18px;
  padding: 30px;
  border: 1px solid var(--border);
  transition: all 0.3s ease;
}

.glass-box:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--brand);
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.2px;
}

/* Info Rows */
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-light);
}

.info-row:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.label {
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 500;
}

.value {
  font-weight: 600;
  color: var(--text);
  font-size: 14.5px;
}

/* Buttons */
.primary-btn {
  background: linear-gradient(135deg, var(--brand), var(--brand-dark)) !important;
  color: white !important;
  height: 48px;
  border-radius: 14px !important;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.3px;
  box-shadow: 0 6px 16px rgba(27, 134, 124, 0.25);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(27, 134, 124, 0.35);
}

.outline-btn {
  height: 48px;
  border-radius: 14px !important;
  border: 1px solid var(--border) !important;
  color: var(--text) !important;
  font-weight: 600;
  text-transform: none;
}

.outline-btn:hover {
  border-color: var(--brand) !important;
  color: var(--brand) !important;
  background: var(--surface-alt) !important;
}

/* Dialog */
.luxury-dialog {
  border-radius: 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-lg);
}

.dialog-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.3px;
}
</style>