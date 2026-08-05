<template>
  <v-container fluid class="ultra-wrapper py-12">

    <PageBreadcrumb title="Profile Overview" />

    <v-row justify="center">
      <v-col cols="12" lg="10">

        <v-card class="ultra-card border" elevation="0">

          <!-- TOP HEADER -->
          <div class="ultra-header">
            <div class="header-content">
              <v-avatar size="130" class="ultra-avatar">
                <img v-if="user.avatar" :src="user.avatar" />
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

            <!-- WARNING SECURITY ALERT -->
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
                    class="button-color mb-4"
                    elevation="0"
                    @click="$router.push('/change-password')"
                  >
                    <v-icon start>mdi-lock-reset</v-icon>
                    Change Password
                  </v-btn>

                  <v-btn
                    block
                    variant="outlined"
                    rounded="xl"
                    class="luxury-outline-btn"
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
        <h2 class="mb-6">Edit Profile</h2>

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
          <v-btn class="button-color ml-4" @click="saveProfile">
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
  background: #ffffff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow:
    0 30px 60px rgba(0, 0, 0, 0.05),
    0 10px 20px rgba(0, 0, 0, 0.03);
}

/* Header */
.ultra-header {
  padding: 50px 60px;
  background: linear-gradient(135deg, #1b867c, #003B73, #0f172a);
}

.header-content {
  display: flex;
  align-items: center;
}

.ultra-avatar {
  border: 5px solid #ffffff;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
}

.ultra-name {
  font-size: 30px;
  font-weight: 700;
  color: #ffffff;
}

.ultra-email {
  color: #ffffff;
  margin-top: 6px;
  opacity: 0.9;
}

/* Body */
.ultra-body {
  background: #ffffff;
}

/* ========== WARNING SECURITY ALERT ========== */
.security-alert {
  border-radius: 20px;
  background: linear-gradient(135deg, #f59e0b, #d97706, #b45309);
  padding: 2px;
  box-shadow: 0 20px 40px rgba(217, 119, 6, 0.22);
}

.security-alert-inner {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border-radius: 18px;
  padding: 28px 32px;
  display: flex;
  align-items: center;
  gap: 24px;
  border: 1px solid #fcd34d;
}

.security-icon-wrap {
  width: 56px;
  height: 56px;
  min-width: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(217, 119, 6, 0.35);
}

.security-content {
  flex: 1;
}

.security-title {
  font-size: 18px;
  font-weight: 700;
  color: #92400e;
  margin-bottom: 6px;
}

.security-text {
  font-size: 14.5px;
  color: #b45309;
  line-height: 1.55;
  margin: 0;
  max-width: 520px;
}

.security-btn {
  background: linear-gradient(90deg, #f59e0b, #d97706) !important;
  color: white !important;
  height: 48px;
  border-radius: 14px;
  font-weight: 600;
  padding: 0 24px;
  text-transform: none;
  letter-spacing: 0.3px;
  box-shadow: 0 8px 18px rgba(217, 119, 6, 0.35);
  white-space: nowrap;
}

.security-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(217, 119, 6, 0.45);
}

/* Responsive for alert */
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
  background: #ffffff;
  border-radius: 18px;
  padding: 30px;
  border: 1px solid #eef1f5;
  transition: 0.3s ease;
}

.glass-box:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

/* Info Rows */
.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 18px;
}

.label {
  color: #9ca3af;
  font-size: 13px;
}

.value {
  font-weight: 600;
  color: #111827;
}

/* Dialog */
.luxury-dialog {
  border-radius: 24px;
}

/* Outline button */
.luxury-outline-btn {
  height: 48px;
  border-radius: 14px !important;
  border: 1px solid #e5e7eb !important;
}
</style>