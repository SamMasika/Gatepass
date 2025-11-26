<template>
  <v-container fluid>
    <!-- Breadcrumbs -->
    <nav class="custom-breadcrumbs mb-6">
      <span class="breadcrumb-item" @click="$router.push('/dashboard')">Dashboard</span>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-item active">Team Members</span>
    </nav>

    <!-- Header -->
    <v-row class="align-center mb-4">
      <v-col>
        <h2 class="page-title">Team Members</h2>
        <p class="page-subtitle">Manage and view all staff members</p>
      </v-col>
      <v-col class="text-right">
        <v-btn color="#2e7d32" dark rounded @click="openAddDialog" class="text-none elevation-0">
          <v-icon left>mdi-plus</v-icon>
          Add Member
        </v-btn>
      </v-col>
    </v-row>

    <!-- Members Table -->
    <v-card class="rounded-lg">
      <v-card-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search team members..."
          single-line
          hide-details
          variant="outlined"
          density="compact"
          class="search-field"
        />
      </v-card-title>

      <v-card-text>
        <v-data-table
          :headers="tableHeaders"
          :items="teamMembers"
          :search="search"
          dense
          :loading="loading"
          loading-text="Loading team members..."
        >
          <!-- Image -->
          <template v-slot:[`item.image`]="{ item }">
            <v-avatar size="60">
              <v-img :src="getImageUrl(item.image)" cover />
            </v-avatar>
          </template>

          <!-- Status -->
          <template v-slot:[`item.status`]="{ item }">
            <v-chip :color="getStatusColor(item.status)" variant="tonal" size="small">
              {{ formatStatus(item.status) }}
            </v-chip>
          </template>

          <!-- Actions -->
          <template v-slot:[`item.actions`]="{ item }">
            <v-menu transition="scale-transition" offset-y>
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon flat>
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-card class="elevation-4 rounded-lg">
                <v-list dense nav>
                  <v-list-item @click="openViewDialog(item)" class="action-item">
                    <v-list-item-icon>
                      <v-icon small>mdi-eye</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>View</v-list-item-title>
                  </v-list-item>

                  <v-list-item @click="openEditDialog(item)" class="action-item">
                    <v-list-item-icon>
                      <v-icon small>mdi-pencil</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>

                  <v-list-item @click="openConfirmDialog(item)" class="action-item">
                    <v-list-item-icon>
                      <v-icon small>
                        {{ item.status === 'published' ? 'mdi-cancel' : 'mdi-check-circle' }}
                      </v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                      {{ item.status === 'published' ? 'Unpublish' : 'Publish' }}
                    </v-list-item-title>
                  </v-list-item>

                  <v-list-item @click="openDeleteDialog(item)" class="action-item">
                    <v-list-item-icon>
                      <v-icon small>mdi-delete</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Delete</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- View Member Dialog -->
    <v-dialog v-model="viewDialog" max-width="700px">
      <v-card elevation="6" class="dialog-card">
        <div class="dialog-header">
          <div class="dialog-avatar">
            <v-img :src="getImageUrl(selectedMember.image)" class="ava-image" />
          </div>
          <div class="dialog-header-text">
            <h2>{{ selectedMember.name }}</h2>
            <span class="role">{{ selectedMember.position.en }}</span>
          </div>
        </div>

        <v-card-text>
          <v-simple-table dense>
            <tbody>
              <tr>
                <td><strong>Name</strong></td>
                <td>{{ selectedMember.name }}</td>
              </tr>
              <tr>
                <td><strong>Role</strong></td>
                <td>{{ selectedMember.position.en }}</td>
              </tr>
              <tr>
                <td><strong>Email</strong></td>
                <td>{{ selectedMember.email || '-' }}</td>
              </tr>
              <tr>
                <td><strong>Phone</strong></td>
                <td>{{ selectedMember.phone || '-' }}</td>
              </tr>
              <tr>
                <td><strong>Status</strong></td>
                <td>
                  <v-chip :color="getStatusColor(selectedMember.status)" small>
                    {{ formatStatus(selectedMember.status) }}
                  </v-chip>
                </td>
              </tr>
              <tr>
                <td><strong>Bio (EN)</strong></td>
                <td>{{ selectedMember.bio.en || '-' }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn color="#2e7d32" rounded @click="viewDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add / Edit Member Dialog -->
    <v-dialog v-model="formDialog" max-width="1100px">
      <v-card elevation="6" class="dialog-card">
        <v-card-title class="dialog-add-title">
          <v-icon left class="mx-5">mdi-account-plus</v-icon>
          {{ isEditing ? 'Edit Team Member' : 'Add New Team Member' }}
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text>
          <v-form ref="memberForm" @submit.prevent="submitMember">
            <v-row dense>
              <!-- Basic info -->
              <v-col cols="12" sm="6">
                <v-text-field v-model="formMember.name" label="Full Name" variant="outlined" required />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="formMember.phone" label="Phone" variant="outlined" />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="formMember.email" label="Email" type="email" variant="outlined" />
              </v-col>

              <!-- Position translations -->
              <v-col cols="12" sm="3" v-for="lang in ['en','sw','fr','ar']" :key="'pos-'+lang">
                <small>Position ({{ lang.toUpperCase() }})</small>
                <v-text-field v-model="formMember.position[lang]" variant="outlined" />
              </v-col>

              <!-- Bio translations -->
              <v-col cols="12" sm="3" v-for="lang in ['en','sw','fr','ar']" :key="'bio-'+lang">
                <small>Bio ({{ lang.toUpperCase() }})</small>
                <v-textarea v-model="formMember.bio[lang]" variant="outlined" />
              </v-col>

              <!-- Profile image -->
              <v-col cols="12">
                <v-file-input
                  v-model="formMember.image"
                  label="Profile Image"
                  accept="image/*"
                  prepend-icon="mdi-camera"
                  show-size
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn text rounded @click="formDialog = false">Cancel</v-btn>
          <v-btn color="#2e7d32" rounded @click="submitMember">{{ isEditing ? 'Update Member' : 'Add Member' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirm Publish/Unpublish Dialog -->
    <v-dialog v-model="confirmDialog" max-width="420px" persistent>
      <v-card class="rounded-lg elevation-6">
        <v-card-title class="font-weight-bold px-6 py-4">Confirmation</v-card-title>
        <v-card-text class="text-center px-6 py-6">
          <v-icon size="60" :color="selectedItem?.status === 'published' ? 'error' : 'success'" class="mb-4">
            {{ selectedItem?.status === 'published' ? 'mdi-cancel' : 'mdi-check-circle' }}
          </v-icon>
          <p>
            Are you sure you want to
            <strong>{{ selectedItem?.status === 'published' ? 'Unpublish' : 'Publish' }}</strong>
            <br /> <b>{{ selectedItem?.name }}</b>?
          </p>
        </v-card-text>

        <v-card-actions class="justify-end px-6 pb-4">
          <v-btn text rounded @click="confirmDialog = false">Cancel</v-btn>
          <v-btn :color="selectedItem?.status === 'published' ? 'error' : 'success'" rounded @click="confirmPublish">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="confirmDeleteDialog" max-width="420px" persistent>
      <v-card class="rounded-lg elevation-6">
        <v-card-title class="font-weight-bold px-6 py-4 text-error">Delete Confirmation</v-card-title>
        <v-card-text class="text-center px-6 py-6">
          <v-icon size="64" color="error" class="mb-4">mdi-delete-alert</v-icon>
          <p>Are you sure you want to delete <strong>{{ itemToDelete.name }}</strong>?</p>
          <small>This action cannot be undone.</small>
        </v-card-text>
        <v-card-actions class="justify-end px-6 pb-4">
          <v-btn text rounded @click="confirmDeleteDialog = false">Cancel</v-btn>
          <v-btn color="error" rounded @click="deleteItem">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
import swtalert from "@/mixins/swtalert";

export default {
  mixins: [swtalert],
  data() {
    return {
      search: "",
      loading: false,
      teamMembers: [],
      tableHeaders: [
        { title: "Name", value: "name" },
        { title: "Position", value: "position.en" },
        { title: "Email", value: "email" },
        { title: "Phone", value: "phone" },
        { title: "Status", value: "status" },
        { title: "Actions", value: "actions", sortable: false },
      ],
      viewDialog: false,
      formDialog: false,
      confirmDialog: false,
      confirmDeleteDialog: false,
      isEditing: false,
      selectedMember: {},
      selectedItem: {},
      itemToDelete: {},
      formMember: {
        name: "",
        email: "",
        phone: "",
        image: null,
        position: { en: "", sw: "", fr: "", ar: "" },
        bio: { en: "", sw: "", fr: "", ar: "" },
      },
    };
  },
  methods: {
    getImageUrl(image) {
      return image ? this.$getImageUrl(image) : "https://via.placeholder.com/150";
    },
    getStatusColor(status) {
      if (!status) return "grey";
      switch (status.toLowerCase()) {
        case "pending":
          return "orange";
        case "published":
          return "green";
        default:
          return "grey";
      }
    },
    formatStatus(status) {
      return status ? status.charAt(0).toUpperCase() + status.slice(1) : "";
    },
    fetchItems() {
      this.loading = true;
      axios
        .get("/team-members")
        .then((res) => (this.teamMembers = res.data))
        .catch(() => this.showAlert("Failed to load team members", "error"))
        .finally(() => (this.loading = false));
    },
    openViewDialog(member) {
      this.selectedMember = member;
      this.viewDialog = true;
    },
    openAddDialog() {
      this.isEditing = false;
      this.resetForm();
      this.formDialog = true;
    },
    openEditDialog(member) {
      this.isEditing = true;
      this.formMember = JSON.parse(JSON.stringify(member));
      this.formDialog = true;
    },
    resetForm() {
      this.formMember = {
        name: "",
        email: "",
        phone: "",
        image: null,
        position: { en: "", sw: "", fr: "", ar: "" },
        bio: { en: "", sw: "", fr: "", ar: "" },
      };
    },
    submitMember() {
      const formData = new FormData();
      formData.append("name", this.formMember.name);
      formData.append("email", this.formMember.email);
      formData.append("phone", this.formMember.phone);

      if (this.formMember.image) formData.append("image", this.formMember.image);

      Object.entries(this.formMember.position).forEach(([lang, val]) => formData.append(`position[${lang}]`, val));
      Object.entries(this.formMember.bio).forEach(([lang, val]) => formData.append(`bio[${lang}]`, val));

      const headers = { Authorization: `Bearer ${localStorage.getItem("access_token")}`, "Content-Type": "multipart/form-data" };
      this.loading = true;

      const request = this.isEditing
        ? axios.post(`/team-members/${this.formMember.id}?_method=PUT`, formData, { headers })
        : axios.post("/team-members", formData, { headers });

      request
        .then((res) => {
          this.showAlert(res.data.message, "success");
          this.formDialog = false;
          this.fetchItems();
        })
        .catch((err) => this.showAlert(err.response?.data?.message || "Failed to save member", "error"))
        .finally(() => (this.loading = false));
    },
    openConfirmDialog(item) {
      this.selectedItem = item;
      this.confirmDialog = true;
    },
    confirmPublish() {
      axios
        .post(`/member/${this.selectedItem.id}/toggle-status`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } })
        .then((res) => this.showAlert(res.data.message, "success"))
        .catch(() => this.showAlert("Failed to update status", "error"))
        .finally(() => (this.confirmDialog = false));
    },
    openDeleteDialog(item) {
      this.itemToDelete = item;
      this.confirmDeleteDialog = true;
    },
    deleteItem() {
      axios
        .delete(`/team-members/${this.itemToDelete.id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } })
        .then((res) => {
          this.showAlert(res.data.message, "success");
          this.fetchItems();
        })
        .catch(() => this.showAlert("Failed to delete member", "error"))
        .finally(() => (this.confirmDeleteDialog = false));
    },
  },
  mounted() {
    this.fetchItems();
  },
};
</script>

<style scoped>
.page-title { font-weight: bold; font-size: 1.6rem; }
.page-subtitle { color: #555; margin-bottom: 1rem; }
.search-field { max-width: 300px; }
.dialog-card { border-radius: 16px; overflow: hidden; }
.dialog-header { background: linear-gradient(135deg, #2e7d32, #4caf50); display: flex; align-items: center; padding: 1.5rem; position: relative; }
.dialog-avatar { width: 130px; height: 130px; border-radius: 50%; overflow: hidden; border: 6px solid #fff; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15); margin-right: 1rem; }
.ava-image { width: 100%; height: 100%; object-fit: cover; }
.dialog-header-text { color: #fff; flex-grow: 1; }
.dialog-header-text h2 { margin: 0; font-weight: 700; font-size: 1.5rem; }
.dialog-header-text .role { font-size: 0.95rem; opacity: 0.85; }
.dialog-add-title { font-weight: 700; font-size: 1.3rem; display: flex; align-items: center; }
.v-chip { font-weight: 600; }
</style>
