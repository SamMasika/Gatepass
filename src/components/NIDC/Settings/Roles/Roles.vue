<template>
  <v-container fluid class="px-6 py-4">
    <!-- BREADCRUMB -->
    <PageBreadcrumb title="Roles & Permissions" />

    <!-- TOP ACTION -->
    <v-row justify="end" class="mb-5">
      <v-col cols="12" md="auto" class="d-flex justify-end">
        <v-dialog v-model="dialog" max-width="980" persistent transition="dialog-bottom-transition">
          <!-- ACTIVATOR -->
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              class="primary-btn"
              rounded="xl"
              height="50"
              elevation="0"
              prepend-icon="mdi-shield-account-outline"
            >
              Add Role
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
                      {{ role.id ? 'mdi-shield-edit-outline' : 'mdi-shield-plus-outline' }}
                    </v-icon>
                  </div>

                  <div class="ml-5">
                    <div class="dialog-title">
                      {{ role.id ? 'Edit Role' : 'Create Role' }}
                    </div>
                    <div class="dialog-subtitle">
                      Manage role permissions and access control
                    </div>
                  </div>
                </div>

                <v-chip color="white" variant="flat" class="font-weight-medium">
                  Secure Permission Access
                </v-chip>
              </div>
            </div>

            <!-- BODY -->
            <div class="dialog-body">
              <v-form ref="form">
                <div class="form-section-title mb-6">
                  <div class="section-line"></div>
                  <span>Role Information</span>
                </div>

                <v-row>
                  <!-- ROLE NAME -->
                  <v-col cols="12">
                    <div class="premium-input-group">
                      <label class="premium-label">Role Name</label>
                      <v-text-field
                        v-model="role.name"
                        placeholder="Enter role name"
                        variant="solo-filled"
                        flat
                        rounded="xl"
                        hide-details
                        prepend-inner-icon="mdi-shield-outline"
                      />
                    </div>
                  </v-col>

                  <!-- PERMISSIONS -->
                  <v-col cols="12">
                    <div class="premium-input-group">
                      <label class="premium-label">Assign Permissions</label>
                      <v-autocomplete
                        v-model="selectedPermissions"
                        :items="permissions"
                        item-title="name"
                        item-value="id"
                        multiple
                        chips
                        closable-chips
                        variant="solo-filled"
                        flat
                        hide-details
                        prepend-inner-icon="mdi-lock-outline"
                        placeholder="Select permissions"
                      >
                        <template #item="{ props, item }">
                          <v-list-item v-bind="props" class="premium-role-item">
                            <template #prepend>
                              <v-avatar size="36" class="role-avatar">
                                <v-icon size="18" color="white">mdi-key-outline</v-icon>
                              </v-avatar>
                            </template>
                            <v-list-item-title class="role-title">
                              {{ item.raw.name }}
                            </v-list-item-title>
                            <v-list-item-subtitle class="role-subtitle">
                              System access permission
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
                            <v-icon start size="14">mdi-lock-check-outline</v-icon>
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
                @click="saveRole"
              >
                <v-icon start>mdi-content-save-outline</v-icon>
                {{ role.id ? 'Update Role' : 'Save Role' }}
              </v-btn>
            </div>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>

    <!-- TABLE -->
    <DataTable
      ref="roleTable"
      api-url="roles"
      :headers="headers"
      title="Roles Management"
      subtitle="Manage system roles & permissions"
    >
      <template #permissions="{ item }">
        <div class="d-flex flex-wrap ga-2">
          <v-chip
            v-for="permission in item.permissions"
            :key="permission.id"
            size="small"
            class="permission-chip"
          >
            {{ permission.name }}
          </v-chip>
        </div>
      </template>

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
                <v-icon size="18" color="white">mdi-shield-outline</v-icon>
              </div>
              <div>
                <div class="menu-title">Quick Actions</div>
                <div class="menu-subtitle">Manage this role</div>
              </div>
            </div>

            <div class="menu-divider"></div>

            <div class="menu-items">
              <div class="premium-menu-item" @click="editRole(item)">
                <div class="menu-item-left">
                  <div class="menu-item-icon activities-bg">
                    <v-icon size="18" color="var(--deep-purple)">mdi-pencil-outline</v-icon>
                  </div>
                  <div>
                    <div class="menu-item-title">Edit Role</div>
                    <div class="menu-item-subtitle">Update role permissions</div>
                  </div>
                </div>
                <v-icon size="18" color="var(--gray)">mdi-chevron-right</v-icon>
              </div>

              <div class="premium-menu-item" @click="deleteDialog(item)">
                <div class="menu-item-left">
                  <div class="menu-item-icon view-bg">
                    <v-icon size="18" color="var(--accent-red)">mdi-delete-outline</v-icon>
                  </div>
                  <div>
                    <div class="menu-item-title">Delete Role</div>
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

    <!-- DELETE -->
    <DeleteDialog
      v-model="confirmDialogVisible"
      title="Delete Role"
      :item-name="itemToDelete.name"
      @confirm="deleteRole"
    />
  </v-container>
</template>

<script>
import axios from "axios";
import DataTable from "../../SharedComponents/dataTable.vue";
import DeleteDialog from "../../SharedComponents/DeleteDialog.vue";
import PageBreadcrumb from "@/components/NIDC/SharedComponents/PageBreadcrumb.vue";
import swtalert from "@/mixins/swtalert";

export default {
  components: {
    DataTable,
    DeleteDialog,
    PageBreadcrumb,
  },

  mixins: [swtalert],

  data() {
    return {
      dialog: false,
      confirmDialogVisible: false,
      role: {
        id: null,
        name: "",
      },
      permissions: [],
      selectedPermissions: [],
      itemToDelete: {},
      headers: [
        { title: "Role Name", value: "name" },
        // { title: "Permissions", value: "permissions", sortable: false },
        { title: "Actions", value: "actions", sortable: false },
      ],
    };
  },

  mounted() {
    this.fetchPermissions();
  },

  methods: {
    async fetchPermissions() {
      try {
        const res = await axios.get("/permissions");
        const raw = res.data.data;
        this.permissions = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
      } catch (error) {
        console.error("Permissions fetch error:", error);
        this.permissions = [];
      }
    },

    editRole(item) {
      this.role = { ...item };
      this.selectedPermissions = item.permissions ? item.permissions.map((p) => p.id) : [];
      this.dialog = true;
    },

    closeDialog() {
      this.dialog = false;
      this.role = { id: null, name: "" };
      this.selectedPermissions = [];
    },

    async saveRole() {
      try {
        const payload = {
          name: this.role.name,
          permissions: this.selectedPermissions,
        };

        if (this.role.id) {
          payload.id = this.role.id;
          await axios.put("/roles", payload);
          this.showAlert("Role updated successfully", "success");
        } else {
          await axios.post("/roles", payload);
          this.showAlert("Role created successfully", "success");
        }

        this.$refs.roleTable.fetchData();
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

    deleteRole() {
      axios
        .delete(`/role-delete/${this.itemToDelete.id}`)
        .then((response) => {
          this.showAlert(response.data.message || "Deleted successfully", "success");
          this.confirmDialogVisible = false;
          this.$refs.roleTable.fetchData();
        })
        .catch((error) => {
          this.showAlert(error.response?.data?.message || "Delete failed", "error");
        });
    },
  },
};
</script>

<style scoped>
/* Page-specific styles only */
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

/* Selected permission chips (brand colors) */
.premium-role-chip {
  background: linear-gradient(135deg, var(--brand), var(--brand-dark)) !important;
  color: var(--white) !important;
  font-weight: 600;
}

/* Table permission chips */
.permission-chip {
  background: color-mix(in srgb, var(--brand) 12%, white) !important;
  color: var(--brand-dark) !important;
  font-weight: 600;
}

/* Autocomplete item styling */
.premium-role-item {
  border-radius: 14px;
  margin: 6px 8px;
  transition: all 0.2s ease;
}

.premium-role-item:hover {
  background: rgba(var(--brand-rgb, 37, 99, 235), 0.08);
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
</style>