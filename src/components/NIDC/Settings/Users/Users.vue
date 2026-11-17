<template>
  <v-container fluid class="px-6 py-4">
    <!-- BREADCRUMB -->
    <PageBreadcrumb title="Users" />

    <!-- TOP ACTION -->
    <v-row justify="end" class="mb-5">
      <v-col cols="12" md="auto" class="d-flex justify-end">
        <v-dialog v-model="dialog" max-width="980" persistent transition="dialog-bottom-transition" scrollable>
          <!-- ACTIVATOR -->
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              class="primary-btn"
              rounded="xl"
              height="50"
              elevation="0"
              prepend-icon="mdi-account-plus-outline"
            >
              Add User
            </v-btn>
          </template>

          <!-- DIALOG -->
          <v-card class="premium-dialog" rounded="xl" elevation="0">
            <!-- HEADER -->
            <div class="dialog-header">
              <div class="d-flex align-center justify-space-between flex-wrap">
                <div class="d-flex align-center">
                  <div class="dialog-icon">
                    <v-icon size="34" color="white">
                      {{ user.id ? 'mdi-account-edit-outline' : 'mdi-account-plus-outline' }}
                    </v-icon>
                  </div>

                  <div class="ml-5">
                    <div class="dialog-title">
                      {{ user.id ? 'Edit User' : 'Create User' }}
                    </div>
                    <div class="dialog-subtitle">
                      Manage user account information and access
                    </div>
                  </div>
                </div>

                <v-chip color="white" variant="flat" class="font-weight-medium">
                  Secure User Profile
                </v-chip>
              </div>
            </div>

            <!-- BODY -->
            <div class="dialog-body">
              <v-form ref="form">
                <div class="form-section-title mb-6">
                  <div class="section-line"></div>
                  <span>User Information</span>
                </div>

                <v-row>
                  <!-- FIRST NAME -->
                  <v-col cols="12" md="4">
                    <div class="premium-input-group">
                      <label class="premium-label">
                        First Name <span class="text-red">*</span>
                      </label>
                      <v-text-field
                        v-model="user.first_name"
                        placeholder="Enter first name"
                        variant="solo-filled"
                        flat
                        rounded="xl"
                        hide-details
                        prepend-inner-icon="mdi-account-outline"
                      />
                    </div>
                  </v-col>

                  <!-- MIDDLE NAME -->
                  <v-col cols="12" md="4">
                    <div class="premium-input-group">
                      <label class="premium-label">Middle Name</label>
                      <v-text-field
                        v-model="user.middle_name"
                        placeholder="Enter middle name"
                        variant="solo-filled"
                        flat
                        rounded="xl"
                        hide-details
                        prepend-inner-icon="mdi-account-outline"
                      />
                    </div>
                  </v-col>

                  <!-- LAST NAME -->
                  <v-col cols="12" md="4">
                    <div class="premium-input-group">
                      <label class="premium-label">
                        Last Name <span class="text-red">*</span>
                      </label>
                      <v-text-field
                        v-model="user.last_name"
                        placeholder="Enter last name"
                        variant="solo-filled"
                        flat
                        rounded="xl"
                        hide-details
                        prepend-inner-icon="mdi-account-outline"
                      />
                    </div>
                  </v-col>

                  <!-- EMAIL -->
                  <v-col cols="12" md="6">
                    <div class="premium-input-group">
                      <label class="premium-label">
                        Email Address <span class="text-red">*</span>
                      </label>
                      <v-text-field
                        v-model="user.email"
                        placeholder="Enter email address"
                        variant="solo-filled"
                        flat
                        rounded="xl"
                        hide-details
                        prepend-inner-icon="mdi-email-outline"
                      />
                    </div>
                  </v-col>

                  <!-- PHONE -->
                  <v-col cols="12" md="6">
                    <div class="premium-input-group">
                      <label class="premium-label">
                        Phone Number <span class="text-red">*</span>
                      </label>
                      <v-text-field
                        v-model="user.phone"
                        placeholder="Enter phone number"
                        variant="solo-filled"
                        flat
                        rounded="xl"
                        hide-details
                        prepend-inner-icon="mdi-phone-outline"
                      />
                    </div>
                  </v-col>

                  <!-- DEPARTMENT -->
                  <v-col cols="12" md="6">
                    <div class="premium-input-group">
                      <label class="premium-label">Department</label>
                      <PaginatedDropdown
                        api-endpoint="/sections"
                        placeholder="Select department"
                        item-title="name"
                        v-model="user.section_id"
                      />
                    </div>
                  </v-col>

                  <!-- ROLES -->
                  <v-col cols="12" md="6">
                    <div class="premium-input-group">
                      <label class="premium-label">Roles</label>
                      <v-autocomplete
                        v-model="selectedRoles"
                        :items="Array.isArray(roles) ? roles : []"
                        item-title="name"
                        item-value="id"
                        multiple
                        chips
                        closable-chips
                        variant="solo-filled"
                        flat
                        hide-details
                        rounded="xl"
                        placeholder="Select roles for this user"
                      >
                        <template #item="{ props, item }">
                          <v-list-item v-bind="props" class="premium-role-item">
                            <template #prepend>
                              <v-avatar size="36" class="role-avatar">
                                <v-icon size="18" color="white">mdi-shield-account</v-icon>
                              </v-avatar>
                            </template>
                            <v-list-item-title class="role-title">
                              {{ item.raw.name }}
                            </v-list-item-title>
                            <v-list-item-subtitle class="role-subtitle">
                              System role & permissions access
                            </v-list-item-subtitle>
                          </v-list-item>
                        </template>

                        <template #chip="{ props, item }">
                          <v-chip
                            v-bind="props"
                            class="premium-role-chip"
                            variant="flat"
                            closable
                          >
                            <v-icon start size="14">mdi-shield-check</v-icon>
                            {{ item.raw.name }}
                          </v-chip>
                        </template>
                      </v-autocomplete>
                    </div>
                  </v-col>
                </v-row>
              </v-form>
            </div>

            <!-- FOOTER -->
            <div class="dialog-footer">
              <v-btn
                variant="outlined"
                rounded="xl"
                height="48"
                class="outline-btn"
                @click="closeDialog"
              >
                Cancel
              </v-btn>

              <v-btn
                class="primary-btn ml-3"
                rounded="xl"
                height="48"
                elevation="0"
                @click="saveItem"
              >
                <v-icon start>mdi-content-save-outline</v-icon>
                {{ user.id ? 'Update User' : 'Save User' }}
              </v-btn>
            </div>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>

    <!-- TABLE -->
    <DataTable
      ref="userTable"
      api-url="users"
      :headers="headers"
      title="User Management"
      subtitle="Manage system users"
    >
      <template #actions="{ item }">
        <v-menu location="bottom end" transition="scale-transition" offset="12">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon size="42" elevation="0" class="premium-action-btn">
              <v-icon size="20">mdi-dots-horizontal</v-icon>
            </v-btn>
          </template>

          <v-card class="premium-menu-card" rounded="xl" elevation="0" min-width="240">
            <div class="menu-top">
              <div class="menu-top-icon">
                <v-icon size="18" color="white">mdi-account-outline</v-icon>
              </div>
              <div>
                <div class="menu-title">Quick Actions</div>
                <div class="menu-subtitle">Manage this user</div>
              </div>
            </div>

            <div class="menu-divider"></div>

            <div class="menu-items">
              <!-- EDIT -->
              <div class="premium-menu-item" @click="editItem(item)">
                <div class="menu-item-left">
                  <div class="menu-item-icon activities-bg">
                    <v-icon size="18" color="var(--deep-purple)">mdi-pencil-outline</v-icon>
                  </div>
                  <div>
                    <div class="menu-item-title">Edit User</div>
                    <div class="menu-item-subtitle">Update user details</div>
                  </div>
                </div>
                <v-icon size="18" color="var(--gray)">mdi-chevron-right</v-icon>
              </div>

              <!-- DEACTIVATE -->
              <div
                v-if="item.status == 1"
                class="premium-menu-item"
                @click="deactivateDialog(item)"
              >
                <div class="menu-item-left">
                  <div class="menu-item-icon view-bg">
                    <v-icon size="18" color="#f59e0b">mdi-cancel</v-icon>
                  </div>
                  <div>
                    <div class="menu-item-title">Deactivate User</div>
                    <div class="menu-item-subtitle">Mark as inactive</div>
                  </div>
                </div>
                <v-icon size="18" color="var(--gray)">mdi-chevron-right</v-icon>
              </div>

              <!-- ACTIVATE -->
              <div v-else class="premium-menu-item" @click="activateDialog(item)">
                <div class="menu-item-left">
                  <div class="menu-item-icon activities-bg">
                    <v-icon size="18" color="#22c55e">mdi-check-circle-outline</v-icon>
                  </div>
                  <div>
                    <div class="menu-item-title">Activate User</div>
                    <div class="menu-item-subtitle">Mark as active</div>
                  </div>
                </div>
                <v-icon size="18" color="var(--gray)">mdi-chevron-right</v-icon>
              </div>

              <!-- DELETE -->
              <div class="premium-menu-item" @click="deleteDialog(item)">
                <div class="menu-item-left">
                  <div class="menu-item-icon view-bg">
                    <v-icon size="18" color="var(--accent-red)">mdi-delete-outline</v-icon>
                  </div>
                  <div>
                    <div class="menu-item-title">Delete User</div>
                    <div class="menu-item-subtitle">Remove permanently</div>
                  </div>
                </div>
                <v-icon size="18" color="var(--gray)">mdi-chevron-right</v-icon>
              </div>
            </div>
          </v-card>
        </v-menu>
      </template>
    </DataTable>

    <!-- DEACTIVATE DIALOG -->
    <v-dialog v-model="deactivateConfirm" max-width="540" transition="dialog-bottom-transition">
      <v-card class="premium-dialog" elevation="0" rounded="xl">
        <div class="dialog-header" style="background: linear-gradient(135deg, #ef4444, #dc2626, #991b1b);">
          <div class="d-flex align-center justify-center">
            <div class="dialog-icon">
              <v-icon size="46" color="white">mdi-account-lock-outline</v-icon>
            </div>
          </div>
        </div>

        <div class="dialog-body text-center">
          <h2 class="dialog-title mb-2">Confirm Deactivation</h2>
          <p class="dialog-subtitle mb-6">
            This user will immediately lose access to the system and all assigned permissions.
          </p>

          <div class="premium-user-card mb-6">
            <div class="d-flex align-center">
              <div class="premium-avatar danger-avatar">
                {{ UserToActivate?.first_name?.charAt(0)?.toUpperCase() }}
              </div>
              <div class="ml-4 flex-grow-1 text-left">
                <div class="premium-user-name">
                  {{ UserToActivate?.first_name }} {{ UserToActivate?.last_name }}
                </div>
                <div class="premium-user-email">{{ UserToActivate?.email }}</div>
              </div>
              <div class="status-chip danger-chip">
                <v-icon size="14" class="mr-1">mdi-alert-circle</v-icon>
                Disable
              </div>
            </div>
          </div>

          <div class="premium-warning-box mb-6">
            <v-icon color="#f59e0b" size="20" class="mr-2">mdi-alert-outline</v-icon>
            <span>The user account will become inactive immediately.</span>
          </div>

          <div class="d-flex justify-center">
            <v-btn
              variant="outlined"
              rounded="xl"
              height="48"
              class="outline-btn mr-3"
              @click="deactivateConfirm = false"
            >
              Cancel
            </v-btn>
            <v-btn
              rounded="xl"
              height="48"
              elevation="0"
              class="danger-btn"
              :loading="loadingStatus"
              @click="toggleUserStatus"
            >
              <v-icon start>mdi-account-off-outline</v-icon>
              Deactivate
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <!-- ACTIVATE DIALOG -->
    <v-dialog v-model="activateConfirm" max-width="540" transition="dialog-bottom-transition">
      <v-card class="premium-dialog" elevation="0" rounded="xl">
        <div class="dialog-header" style="background: linear-gradient(135deg, #16a34a, #22c55e, #15803d);">
          <div class="d-flex align-center justify-center">
            <div class="dialog-icon">
              <v-icon size="46" color="white">mdi-check-decagram-outline</v-icon>
            </div>
          </div>
        </div>

        <div class="dialog-body text-center">
          <h2 class="dialog-title mb-2">Confirm Activation</h2>
          <p class="dialog-subtitle mb-6">
            This user will regain access to the system and all assigned permissions immediately.
          </p>

          <div class="premium-user-card mb-6">
            <div class="d-flex align-center">
              <div class="premium-avatar success-avatar">
                {{ UserToActivate?.first_name?.charAt(0)?.toUpperCase() }}
              </div>
              <div class="ml-4 flex-grow-1 text-left">
                <div class="premium-user-name">
                  {{ UserToActivate?.first_name }} {{ UserToActivate?.last_name }}
                </div>
                <div class="premium-user-email">{{ UserToActivate?.email }}</div>
              </div>
              <div class="status-chip success-chip">
                <v-icon size="14" class="mr-1">mdi-check-circle</v-icon>
                Enable
              </div>
            </div>
          </div>

          <div class="premium-success-box mb-6">
            <v-icon color="var(--green)" size="20" class="mr-2">mdi-shield-check-outline</v-icon>
            <span>The user account will become active immediately.</span>
          </div>

          <div class="d-flex justify-center">
            <v-btn
              variant="outlined"
              rounded="xl"
              height="48"
              class="outline-btn mr-3"
              @click="activateConfirm = false"
            >
              Cancel
            </v-btn>
            <v-btn
              rounded="xl"
              height="48"
              elevation="0"
              class="success-btn"
              :loading="loadingStatus"
              @click="toggleUserStatus"
            >
              <v-icon start>mdi-check-circle-outline</v-icon>
              Activate
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <!-- DELETE -->
    <DeleteDialog
      v-model="confirmDialogVisible"
      title="Delete User"
      :item-name="itemToDelete.full_name"
      :item-description="itemToDelete.email"
      @confirm="deleteItem"
    />
  </v-container>
</template>

<script>
import axios from "axios";
import DataTable from "../../SharedComponents/dataTable.vue";
import DeleteDialog from "../../SharedComponents/DeleteDialog.vue";
import PageBreadcrumb from "@/components/NIDC/SharedComponents/PageBreadcrumb.vue";
import PaginatedDropdown from "@/components/NIDC/SharedComponents/paginatedDropdown.vue";
import swtalert from "@/mixins/swtalert";

export default {
  components: {
    DataTable,
    DeleteDialog,
    PageBreadcrumb,
    PaginatedDropdown,
  },

  mixins: [swtalert],

  data() {
    return {
      dialog: false,
      confirmDialogVisible: false,
      deactivateConfirm: false,
      activateConfirm: false,
      UserToActivate: {},
      loadingStatus: false,

      user: {
        id: null,
        first_name: "",
        middle_name: null,
        last_name: "",
        email: "",
        section_id: null,
        phone: "",
        password: "",
        signature: null,
      },

      roles: [],
      selectedRoles: [],
      itemToDelete: {},

      headers: [
        { title: "Name", value: "full_name" },
        { title: "Email", value: "email" },
        { title: "Phone", value: "phone" },
        { title: "Department", value: "section.name" },
        { title: "Status", value: "status" },
        { title: "Actions", value: "actions" },
      ],
    };
  },

  mounted() {
    this.fetchRoles();
  },

  methods: {
    refreshTable() {
      this.$refs.userTable.fetchData();
    },

    async fetchRoles() {
      try {
        const res = await axios.get("/roles");
        const raw = res.data.data;
        this.roles = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
      } catch (error) {
        console.error("Roles fetch error:", error);
        this.roles = [];
      }
    },

    editItem(item) {
      this.user = { ...item };
      this.selectedRoles = item.roles ? item.roles.map((r) => r.id) : [];
      this.dialog = true;
    },

    closeDialog() {
      this.dialog = false;
      this.user = {
        id: null,
        first_name: "",
        middle_name: null,
        last_name: "",
        email: "",
        phone: "",
        section_id: null,
        password: "",
        signature: null,
      };
      this.selectedRoles = [];
    },

    async saveItem() {
      const formData = new FormData();

      formData.append("first_name", this.user.first_name || "");
      formData.append("middle_name", this.user.middle_name || "");
      formData.append("last_name", this.user.last_name || "");
      formData.append("email", this.user.email || "");
      formData.append("phone", this.user.phone || "");
      formData.append("section_id", this.user.section_id || "");

      this.selectedRoles.forEach((roleId, index) => {
        formData.append(`roles[${index}]`, roleId);
      });

      if (this.user.signature) {
        const file = Array.isArray(this.user.signature) ? this.user.signature[0] : this.user.signature;
        formData.append("signature", file);
      }

      try {
        let response;

        if (this.user.id) {
          formData.append("_method", "PUT");
          response = await axios.post(`/users/${this.user.id}`, formData);
        } else {
          response = await axios.post("/users", formData);
        }

        this.showAlert(response.data.message, "success");
        this.refreshTable();
        this.closeDialog();
      } catch (error) {
        const message = error.response?.data?.message || "Something went wrong";
        this.showAlert(message, "error");
      }
    },

    deleteDialog(item) {
      this.itemToDelete = item;
      this.confirmDialogVisible = true;
    },

    async toggleUserStatus() {
      this.loadingStatus = true;
      try {
        const response = await axios.patch(`/users/${this.UserToActivate.id}/toggle-status`);
        this.UserToActivate.status = response.data.data.status;

        this.activateConfirm = false;
        this.deactivateConfirm = false;
        this.showAlert(response.data.message, "success");
        this.refreshTable();
      } catch (error) {
        this.activateConfirm = false;
        this.deactivateConfirm = false;
        this.showAlert(error.response?.data?.message || "Failed to update user status", "error");
      } finally {
        this.loadingStatus = false;
      }
    },

    activateDialog(item) {
      this.UserToActivate = item;
      this.activateConfirm = true;
    },

    deactivateDialog(item) {
      this.UserToActivate = item;
      this.deactivateConfirm = true;
    },

    deleteItem() {
      axios
        .delete(`/users/${this.itemToDelete.id}`)
        .then((response) => {
          this.showAlert(response.data.message || "Deleted successfully", "success");
          this.confirmDialogVisible = false;
          this.refreshTable();
        })
        .catch((error) => {
          this.showAlert(error.response?.data?.message || "Delete failed", "error");
        });
    },
  },
};
</script>

<style scoped>
.form-section-title {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
}

.section-line {
  width: 42px;
  height: 4px;
  border-radius: 999px;
  background: linear-gradient(to right, var(--brand), var(--brand-dark));
}

/* Brand-colored role chips */
.premium-role-chip {
  background: linear-gradient(135deg, var(--brand), var(--brand-dark)) !important;
  color: var(--white) !important;
  font-weight: 600;
}

.premium-role-item {
  border-radius: 14px;
  margin: 6px 8px;
  transition: all 0.2s ease;
}

.premium-role-item:hover {
  background: color-mix(in srgb, var(--brand) 10%, transparent);
  transform: translateX(3px);
}

.role-avatar {
  background: linear-gradient(135deg, var(--brand), var(--brand-dark));
  box-shadow: 0 6px 16px color-mix(in srgb, var(--brand) 25%, transparent);
}

.role-title {
  font-weight: 600;
  font-size: 14px;
}

.role-subtitle {
  font-size: 12px;
  color: var(--text-secondary);
}

/* Status dialog helpers */
.premium-user-card {
  padding: 20px;
  border-radius: 28px;
  background: var(--surface);
  border: 1px solid var(--border);
}

.premium-avatar {
  width: 68px;
  height: 68px;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  font-size: 24px;
  font-weight: 800;
}

.success-avatar {
  background: linear-gradient(135deg, #22c55e, #15803d);
}

.danger-avatar {
  background: linear-gradient(135deg, #ef4444, #b91c1c);
}

.premium-user-name {
  font-size: 18px;
  font-weight: 800;
  color: var(--text);
}

.premium-user-email {
  margin-top: 4px;
  font-size: 13px;
  color: var(--text-secondary);
}

.status-chip {
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
}

.success-chip {
  background: rgba(34, 197, 94, 0.12);
  color: #15803d;
}

.danger-chip {
  background: rgba(239, 68, 68, 0.12);
  color: #dc2626;
}

.premium-warning-box,
.premium-success-box {
  padding: 16px 18px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
}

.premium-warning-box {
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.15);
  color: #92400e;
}

.premium-success-box {
  background: rgba(34, 197, 94, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.15);
  color: #166534;
}

.success-btn {
  background: linear-gradient(135deg, #22c55e, #15803d) !important;
  color: var(--white) !important;
  font-weight: 700;
  text-transform: none;
}

.danger-btn {
  background: linear-gradient(135deg, #ef4444, #b91c1c) !important;
  color: var(--white) !important;
  font-weight: 700;
  text-transform: none;
}
</style>