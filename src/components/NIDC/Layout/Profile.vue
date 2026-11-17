<template>
  <div class="profile-page">
    <div class="container">
      <PageBreadcrumb title="Profile Overview" />

      <!-- Security Alert -->
      <div v-if="user && user.is_password_changed === 0" class="security-alert mb-6">
        <div class="security-alert-inner">
          <div class="security-icon-wrap">
            <v-icon size="26" color="white">mdi-shield-lock-outline</v-icon>
          </div>
          <div class="security-content">
            <h3 class="security-title">Security Action Required</h3>
            <p class="security-text">
              Please change your temporary password before accessing other features.
            </p>
          </div>
          <v-btn
            class="security-btn"
            elevation="0"
            @click="$router.push('/change-password')"
          >
            <v-icon start size="18">mdi-lock-reset</v-icon>
            Change Password
          </v-btn>
        </div>
      </div>

      <!-- Hero -->
      <div class="profile-hero">
        <div class="hero-top">
          <div class="avatar-wrap">
            <div class="avatar">
              <img v-if="user.avatar" :src="user.avatar" alt="Profile" />
              <span v-else>{{ initials }}</span>
            </div>
          </div>

          <div class="hero-actions">
            <v-btn
              class="btn-edit"
              variant="outlined"
              @click="editUser"
            >
              <v-icon start size="16">mdi-pencil-outline</v-icon>
              Edit Profile
            </v-btn>
          </div>
        </div>

        <div class="hero-info">
          <h1>{{ user.first_name }} {{ user.last_name }}</h1>
          <p class="role">{{ user.roles?.[0]?.name || 'User' }}</p>
          <div class="meta-row">
            <span class="meta-item">
              <v-icon size="14">mdi-email-outline</v-icon>
              {{ user.email }}
            </span>
            <span class="meta-item">
              <v-icon size="14">mdi-phone-outline</v-icon>
              {{ user.phone || '—' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Cards -->
      <div class="cards">
        <!-- Personal Information -->
        <div class="card">
          <div class="card-head">
            <h2>Personal Information</h2>
          </div>
          <div class="card-body">
            <div class="fields">
              <div class="field">
                <label>Full Name</label>
                <div class="value">{{ user.first_name }} {{ user.last_name }}</div>
              </div>
              <div class="field">
                <label>Email</label>
                <div class="value">{{ user.email }}</div>
              </div>
              <div class="field">
                <label>Phone</label>
                <div class="value">{{ user.phone || '—' }}</div>
              </div>
              <div class="field">
                <label>Department</label>
                <div class="value">{{ user.section?.name || '—' }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Account -->
        <div class="card">
          <div class="card-head">
            <h2>Account</h2>
          </div>
          <div class="card-body">
            <div class="row">
              <label>Role</label>
              <div class="value">{{ user.roles?.[0]?.name || 'User' }}</div>
            </div>
            <div class="row">
              <label>Status</label>
              <div class="value">
                <span class="badge">{{ user.status == 1 ? 'Active' : 'Inactive' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Security -->
        <div class="card">
          <div class="card-head">
            <h2>Security</h2>
          </div>
          <div class="card-body">
            <div class="security">
              <div>
                <strong>Password</strong>
                <p>Change your account password</p>
              </div>
              <router-link to="/change-password" class="action">Change</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- EDIT PROFILE DIALOG -->
    <v-dialog v-model="editDialog" max-width="600" persistent>
      <v-card class="premium-dialog" rounded="xl" elevation="0">
        <div class="dialog-header">
          <div class="d-flex align-center">
            <div class="dialog-icon">
              <v-icon size="34" color="white">mdi-account-edit-outline</v-icon>
            </div>
            <div class="ml-5">
              <div class="dialog-title">Edit Profile</div>
              <div class="dialog-subtitle">Update your personal information</div>
            </div>
          </div>
        </div>

        <div class="dialog-body">
          <v-row>
            <v-col cols="12" md="6">
              <div class="premium-input-group">
                <label class="premium-label">First Name</label>
                <v-text-field
                  v-model="editData.first_name"
                  variant="solo-filled"
                  flat
                  rounded="xl"
                  hide-details
                />
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="premium-input-group">
                <label class="premium-label">Last Name</label>
                <v-text-field
                  v-model="editData.last_name"
                  variant="solo-filled"
                  flat
                  rounded="xl"
                  hide-details
                />
              </div>
            </v-col>
            <v-col cols="12">
              <div class="premium-input-group">
                <label class="premium-label">Phone</label>
                <v-text-field
                  v-model="editData.phone"
                  variant="solo-filled"
                  flat
                  rounded="xl"
                  hide-details
                />
              </div>
            </v-col>
            <v-col cols="12">
              <div class="premium-input-group">
                <label class="premium-label">Email</label>
                <v-text-field
                  v-model="editData.email"
                  variant="solo-filled"
                  flat
                  rounded="xl"
                  hide-details
                />
              </div>
            </v-col>
          </v-row>
        </div>

        <div class="dialog-footer">
          <v-btn
            variant="outlined"
            rounded="xl"
            height="48"
            class="outline-btn"
            @click="editDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            class="primary-btn ml-3"
            rounded="xl"
            height="48"
            elevation="0"
            @click="saveProfile"
          >
            Save Changes
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import swtalert from '@/mixins/swtalert';
import PageBreadcrumb from '../SharedComponents/PageBreadcrumb.vue';
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  mixins: [swtalert],
  components: { PageBreadcrumb },

  data() {
    return {
      editDialog: false,
      editData: {},
    };
  },

  computed: {
    ...mapGetters({
      user: 'auth/user',
    }),

    initials() {
      const first = this.user?.first_name?.[0] || '';
      const last = this.user?.last_name?.[0] || '';
      return (first + last).toUpperCase();
    },
  },

  methods: {
    editUser() {
      this.editData = { ...this.user };
      this.editDialog = true;
    },

    saveProfile() {
      const { first_name, last_name, phone, email } = this.editData;

      axios
        .post('/update-user', { first_name, last_name, phone, email })
        .then((response) => {
          this.$store.dispatch('auth/updateUser', response.data.user);
          this.showAlert(response.data.message, 'success');
          this.editDialog = false;
        })
        .catch((error) => {
          this.showAlert(
            error.response?.data?.message || 'Could not update profile.',
            'error'
          );
        });
    },
  },

  mounted() {
    if (this.user) {
      this.editData = { ...this.user };
    }
  },
};
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding: 28px 20px 80px;
  background: var(--surface-alt, #f7f8fa);
}

.container {
  max-width: 860px;
  margin: 0 auto;
}

/* Security Alert */
.security-alert {
  border-radius: 20px;
  background: linear-gradient(135deg, var(--orange, #f59e0b), #d97706);
  padding: 2px;
}

.security-alert-inner {
  background: var(--warning-light, #fffbeb);
  border-radius: 18px;
  padding: 24px 28px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.security-icon-wrap {
  width: 52px;
  height: 52px;
  min-width: 52px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--orange, #f59e0b), #d97706);
  display: flex;
  align-items: center;
  justify-content: center;
}

.security-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--orange, #d97706);
  margin: 0 0 4px;
}

.security-text {
  font-size: 13.5px;
  color: var(--text-secondary);
  margin: 0;
}

.security-btn {
  background: linear-gradient(90deg, var(--orange, #f59e0b), #d97706) !important;
  color: white !important;
  height: 44px;
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
}

/* Hero */
.profile-hero {
  background: var(--surface);
  border-radius: 24px;
  border: 1px solid var(--border);
  padding: 28px;
  margin-bottom: 16px;
}

.hero-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(145deg, var(--brand), var(--brand-dark));
  display: grid;
  place-items: center;
  color: #fff;
  font-size: 24px;
  font-weight: 650;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.btn-edit {
  height: 40px;
  border-radius: 12px;
  text-transform: none;
  font-weight: 600;
}

.hero-info h1 {
  margin: 0 0 4px;
  font-size: 24px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.03em;
}

.role {
  margin: 0 0 14px;
  font-size: 14px;
  color: var(--brand);
  font-weight: 600;
}

.meta-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13.5px;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Cards */
.cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.card {
  background: var(--surface);
  border-radius: 20px;
  border: 1px solid var(--border);
}

.card:first-child {
  grid-column: 1 / -1;
}

.card-head {
  padding: 18px 22px 0;
}

.card-head h2 {
  margin: 0;
  font-size: 14.5px;
  font-weight: 650;
  color: var(--text);
}

.card-body {
  padding: 14px 22px 20px;
}

.fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 20px;
}

.field label,
.row label {
  display: block;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--text-muted, #94a3b8);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: 5px;
}

.field .value,
.row .value {
  font-size: 14.5px;
  color: var(--text);
  font-weight: 500;
}

.row {
  padding: 11px 0;
  border-bottom: 1px solid var(--border-light, #f4f6f8);
}

.row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 650;
  background: #ecfdf5;
  color: #047857;
}

.security {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.security strong {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 2px;
}

.security p {
  margin: 0;
  font-size: 12.5px;
  color: var(--text-secondary);
}

.action {
  padding: 6px 12px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--brand);
  background: var(--surface-alt);
  border-radius: 8px;
  text-decoration: none;
}

.action:hover {
  background: var(--border);
}

/* Dialog styles come from shared premium-dialog.css */
@media (max-width: 768px) {
  .hero-top {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  .hero-info {
    text-align: center;
  }
  .meta-row {
    justify-content: center;
  }
  .cards,
  .fields {
    grid-template-columns: 1fr;
  }
  .security-alert-inner {
    flex-direction: column;
    text-align: center;
  }
}
</style>