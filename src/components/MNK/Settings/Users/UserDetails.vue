<template>
  <v-container fluid class="user-details">
    <!-- Header -->
    <v-row justify="center" class="mb-10">
      <v-col cols="12" md="8" class="text-center">
        <h1 class="title">👤 User Details</h1>
        <p class="subtitle">Here is everything you need to know about this user</p>
      </v-col>
      <v-btn color="primary" variant="outlined" rounded="xl" elevation="0" @click="goBack">
        <v-icon>mdi-arrow-left-bold</v-icon> Back
      </v-btn>
    </v-row>

    <!-- Main Card -->
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-card elevation="10" class="user-card">
          <v-row>
            <!-- User Image -->
            <v-col cols="12" md="4" class="d-flex justify-center align-center">
              <v-img
                :src="getImageUrl(user.company.image) || '/lib/images/no-image.png'"
                class="user-image"
                aspect-ratio="1"
                contain
              />
            </v-col>

            <!-- User Info -->
            <v-col cols="12" md="8">
              <!-- General Info -->
              <div class="section-title blue lighten-4">📝 General Info</div>
              <v-row dense>
                <v-col cols="12" sm="6" class="detail"><strong>Name:</strong> {{ user.name }}</v-col>
                <v-col cols="12" sm="6" class="detail"><strong>Username:</strong> {{ user.username }}</v-col>
                <v-col cols="12" sm="6" class="detail"><strong>Email:</strong> {{ user.email }}</v-col>
                <v-col cols="12" sm="6" class="detail"><strong>Phone:</strong> {{ user.phone }}</v-col>
                <v-col cols="12" sm="6" class="detail"><strong>Status:</strong>
                  <v-chip :color="user.status ? 'green' : 'red'" variant="flat" dark>
                    {{ user.status ? 'ACTIVE' : 'INACTIVE' }}
                  </v-chip>
                </v-col>
              </v-row>

              <!-- Company Info -->
              <div class="section-title green lighten-4 mt-6">🏢 Company Info</div>
              <v-row dense>
                <v-col cols="12" sm="6" class="detail"><strong>Name:</strong> {{ user.company.companyName }}</v-col>
                <v-col cols="12" sm="6" class="detail"><strong>Email:</strong> {{ user.company.companyEmail }}</v-col>
                <v-col cols="12" sm="6" class="detail"><strong>Phone:</strong> {{ user.company.companyPhone }}</v-col>
                <v-col cols="12" sm="6" class="detail"><strong>City:</strong> {{ user.company.companyCity }}</v-col>
                <v-col cols="12" sm="6" class="detail"><strong>Country:</strong> {{ user.company.companyCountry }}</v-col>
                <v-col cols="12" sm="6" class="detail"><strong>Status:</strong>
                  <v-chip :color="user.company.status === 'ACTIVE' ? 'green' : 'red'" variant="flat" dark>
                    {{ user.company.status }}
                  </v-chip>
                </v-col>
              </v-row>

              <!-- Store Info -->
              <div class="section-title amber lighten-4 mt-6">🏬 Store Info</div>
              <v-row dense>
                <v-col
                  v-for="store in user.company.stores"
                  :key="store.id"
                  cols="12"
                  sm="6"
                  class="detail"
                >
                  <strong>Store Name:</strong> {{ store.store_name }}<br />
                  <strong>Location:</strong> {{ store.location }}
                </v-col>
              </v-row>

              <!-- Role & Permissions -->
              <div class="section-title deep-purple lighten-4 mt-6">🔐 Role & Permissions</div>
              <v-row dense>
                <v-col cols="12" sm="6" class="detail">
                  <strong>Role:</strong> {{ user.roles[0].displayName }}
                </v-col>
                <v-col cols="12">
                  <strong>Permissions:</strong>
                  <v-chip
                    v-for="permission in user.roles[0].permissions"
                    :key="permission.id"
                    color="blue lighten-3"
                    class="ma-1"
                    variant="flat"
                    size="small"
                  >
                    {{ permission.displayName }}
                  </v-chip>
                </v-col>
              </v-row>

              <!-- Metadata -->
              <div class="section-title grey lighten-3 mt-6">📅 Metadata</div>
              <v-row dense>
                <v-col cols="12" sm="6" class="detail"><strong>Created At:</strong> {{ formatDate(user.createdAt) }}</v-col>
                <v-col cols="12" sm="6" class="detail"><strong>Updated At:</strong> {{ formatDate(user.updatedAt) }}</v-col>
                <v-col cols="12" sm="6" class="detail"><strong>Last Login:</strong> {{ formatDate(user.lastLogin) }}</v-col>
                <v-col cols="12" sm="6" class="detail"><strong>Login Count:</strong> {{ user.loginCount }}</v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      user: {}, // should be filled with API data
    };
  },
  created() {
    const userId = this.$route.params.id;
    this.fetchUserDetails(userId);
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    getImageUrl(imageName) {
      return this.$getImageUrl(imageName);
    },
    formatDate(date) {
      if (!date) return "N/A";
      return new Date(date).toLocaleString();
    },
    async fetchUserDetails(id) {
      try {
        const response = await axios.get(`/user-show/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        this.user = response.data.data;
      } catch (error) {
        console.error("User fetch failed:", error);
      }
    },
  },
};
</script>

<style scoped>
.user-card {
  background: #ffffff;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.section-title {
  font-weight: 600;
  font-size: 17px;
  padding: 10px 14px;
  border-left: 5px solid #3f51b5;
  background-color: #e3f2fd;
  margin-bottom: 12px;
  border-radius: 6px;
  color: #263238;
}

.detail {
  font-size: 15px;
  color: #37474f;
  padding: 8px 0;
}

.user-image {
  max-width: 280px;
  width: 100%;
  border-radius: 12px;
  background: #f5f5f5;
  border: 2px solid #e0e0e0;
}
</style>
