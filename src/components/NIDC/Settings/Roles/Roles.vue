<template>
<v-container fluid class="roles-page">

    <!-- =====================================================
        BREADCRUMB
    ====================================================== -->
    <PageBreadcrumb title="Roles & Permissions" />
    <!-- =====================================================
        TOP ACTION
    ====================================================== -->
    <v-row justify="end" class="mb-4">
        <v-col cols="12" md="auto">

            <v-dialog v-model="dialog" max-width="980" persistent transition="dialog-bottom-transition">

                <!-- ACTIVATOR -->
                <template #activator="{ props }">
                    <v-btn class="button-color my-5" prepend-icon="mdi-shield-account-outline" rounded="xl" elevation="0" height="50" v-bind="props">
                        Add Role
                    </v-btn>
                </template>

                <!-- =====================================================
                    DIALOG CARD
                ====================================================== -->
                <v-card class="premium-dialog overflow-hidden" rounded="xl" elevation="0">

                    <!-- =====================================================
                        HEADER
                    ====================================================== -->
                    <div class="dialog-header">

                        <div class="header-glow"></div>

                        <div class="d-flex align-center justify-space-between flex-wrap position-relative">

                            <!-- LEFT -->
                            <div class="d-flex align-center">

                                <div class="dialog-icon">
                                    <v-icon size="34" color="white">
                                        {{
                                            role.id
                                                ? "mdi-shield-edit-outline"
                                                : "mdi-shield-plus-outline"
                                        }}
                                    </v-icon>
                                </div>

                                <div class="ml-5">

                                    <div class="dialog-title">
                                        {{
                                            role.id
                                                ? "Edit Role"
                                                : "Create Role"
                                        }}
                                    </div>

                                    <div class="dialog-subtitle">
                                        Manage role permissions and access control
                                    </div>

                                </div>

                            </div>

                            <!-- RIGHT -->
                            <div class="dialog-badge mt-4 mt-md-0">

                                <v-icon size="18" class="mr-2">
                                    mdi-lock-check-outline
                                </v-icon>

                                Secure Permission Access

                            </div>

                        </div>

                    </div>

                    <!-- =====================================================
                        BODY
                    ====================================================== -->
                    <div class="dialog-body">

                        <v-form ref="form">

                            <!-- SECTION -->
                            <div class="form-section-title mb-6">

                                <div class="section-line"></div>

                                <span>
                                    Role Information
                                </span>

                            </div>

                            <v-row>

                                <!-- ROLE NAME -->
                                <v-col cols="12">

                                    <div class="premium-input-group">

                                        <label class="premium-label">
                                            Role Name
                                        </label>

                                        <v-text-field v-model="role.name" placeholder="Enter role name" variant="solo-filled" flat rounded="xl" hide-details prepend-inner-icon="mdi-shield-outline" class="premium-input" />

                                    </div>

                                </v-col>

                                <!-- PERMISSIONS -->
                                <v-col cols="12">

                                    <div class="premium-input-group">

                                        <label class="premium-label">
                                            Assign Permissions
                                        </label>

                                        <v-autocomplete v-model="selectedPermissions" :items="permissions" item-title="name" item-value="id" multiple chips closable-chips variant="solo-filled" flat hide-details class="premium-input" prepend-inner-icon="mdi-lock-outline" placeholder="Select permissions">

                                            <!-- ITEM -->
                                            <template #item="{ props, item }">

                                                <v-list-item v-bind="props" class="premium-role-item">

                                                    <template #prepend>

                                                        <v-avatar size="36" class="role-avatar">
                                                            <v-icon size="18" color="white">
                                                                mdi-key-outline
                                                            </v-icon>
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

                                            <!-- CHIP -->
                                            <template #chip="{ props, item }">

                                                <v-chip v-bind="props" class="premium-role-chip" color="blue-darken-2" variant="flat" closable>

                                                    <v-icon start size="14">
                                                        mdi-lock-check-outline
                                                    </v-icon>

                                                    {{ item.raw.name }}

                                                </v-chip>

                                            </template>

                                        </v-autocomplete>

                                    </div>

                                </v-col>

                            </v-row>

                        </v-form>

                    </div>

                    <!-- =====================================================
                        FOOTER
                    ====================================================== -->
                    <div class="dialog-footer">

                        <!-- CANCEL -->
                        <v-btn variant="outlined" rounded="xl" height="48" class="px-8 cancel-dialog-btn" @click="closeDialog">
                            CANCEL
                        </v-btn>

                        <!-- SAVE -->
                        <v-btn rounded="xl" height="48" class="px-8 button-color ml-3" elevation="0" @click="saveRole">

                            <v-icon start size="18">
                                mdi-content-save-outline
                            </v-icon>

                            {{
                                role.id
                                    ? "Update Role"
                                    : "Save Role"
                            }}

                        </v-btn>

                    </div>

                </v-card>

            </v-dialog>

        </v-col>
    </v-row>

    <!-- =====================================================
        TABLE
    ====================================================== -->
    <DataTable ref="roleTable" api-url="roles" :headers="headers" title="Roles Management" subtitle="Manage system roles & permissions">

        <!-- =====================================================
            PERMISSIONS SLOT
        ====================================================== -->
        <template v-slot:permissions="{ item }">

            <div class="d-flex flex-wrap ga-2">

                <v-chip v-for="permission in item.permissions" :key="permission.id" size="small" color="blue-grey-lighten-5" class="font-weight-medium">
                    {{ permission.name }}
                </v-chip>

            </div>

        </template>

        <!-- =====================================================
            ACTIONS SLOT
        ====================================================== -->
        <template #actions="{ item }">

            <v-menu location="bottom end" transition="scale-transition" offset="12">

                <!-- ACTIVATOR -->
                <template #activator="{ props }">

                    <v-btn v-bind="props" icon size="42" elevation="0" class="premium-action-btn">
                        <v-icon size="20">
                            mdi-dots-horizontal
                        </v-icon>
                    </v-btn>

                </template>

                <!-- MENU -->
                <v-card class="premium-menu-card" rounded="xl" elevation="0" min-width="220">

                    <!-- TOP -->
                    <div class="menu-top">

                        <div class="menu-top-icon">
                            <v-icon size="18" color="white">
                                mdi-lightning-bolt-outline
                            </v-icon>
                        </div>

                        <div>

                            <div class="menu-title">
                                Quick Actions
                            </div>

                            <div class="menu-subtitle">
                                Manage this role
                            </div>

                        </div>

                    </div>

                    <!-- DIVIDER -->
                    <div class="menu-divider"></div>

                    <!-- ITEMS -->
                    <div class="menu-items">

                        <!-- EDIT -->
                        <div class="premium-menu-item" @click="editRole(item)">

                            <div class="menu-item-left">

                                <div class="menu-item-icon edit-bg">

                                    <v-icon size="18" color="#2563eb">
                                        mdi-pencil-outline
                                    </v-icon>

                                </div>

                                <div>

                                    <div class="menu-item-title">
                                        Edit Role
                                    </div>

                                    <div class="menu-item-subtitle">
                                        Update role permissions
                                    </div>

                                </div>

                            </div>

                            <v-icon size="18" color="#94a3b8">
                                mdi-chevron-right
                            </v-icon>

                        </div>

                        <!-- DELETE -->
                        <div class="premium-menu-item delete-item" @click="deleteDialog(item)">

                            <div class="menu-item-left">

                                <div class="menu-item-icon delete-bg">

                                    <v-icon size="18" color="#ef4444">
                                        mdi-delete-outline
                                    </v-icon>

                                </div>

                                <div>

                                    <div class="menu-item-title">
                                        Delete Role
                                    </div>

                                    <div class="menu-item-subtitle">
                                        Remove permanently
                                    </div>

                                </div>

                            </div>

                            <v-icon size="18" color="#94a3b8">
                                mdi-chevron-right
                            </v-icon>

                        </div>

                    </div>

                </v-card>

            </v-menu>

        </template>

    </DataTable>

    <!-- =====================================================
        DELETE DIALOG
    ====================================================== -->
    <DeleteDialog v-model="confirmDialogVisible" title="Delete Role" :item-name="itemToDelete.name" @confirm="deleteRole" />

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

            headers: [{
                    title: "Role Name",
                    value: "name",
                },
              
                {
                    title: "Actions",
                    value: "actions",
                    sortable: false,
                },
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

                if (raw.data && Array.isArray(raw.data)) {
                    this.permissions = raw.data;
                } else if (Array.isArray(raw)) {
                    this.permissions = raw;
                } else {
                    this.permissions = [];
                }

            } catch (error) {

                console.error("Permissions fetch error:", error);

                this.permissions = [];

            }

        },

        editRole(item) {

            this.role = {
                ...item
            };

            this.selectedPermissions =
                item.permissions ?
                item.permissions.map(permission => permission.id) : [];

            this.dialog = true;

        },

        closeDialog() {

            this.dialog = false;

            this.role = {
                id: null,
                name: "",
            };

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

                    this.showAlert(
                        "Role updated successfully",
                        "success"
                    );

                } else {

                    await axios.post("/roles", payload);

                    this.showAlert(
                        "Role created successfully",
                        "success"
                    );

                }

                this.dialog = false;

                this.$refs.roleTable.fetchData();

                this.closeDialog();

            } catch (error) {

                console.error(error);

                const message =
                    error.response.data.message ||
                    "Something went wrong";

                this.showAlert(message, "error");

            }

        },

        deleteDialog(item) {

            this.itemToDelete = item;

            this.confirmDialogVisible = true;

        },

        deleteRole() {

            axios.delete(`/role-delete/${this.itemToDelete.id}`)
                .then((response) => {

                    const message =
                        response.data.message ||
                        "Deleted successfully";

                    this.confirmDialogVisible = false;

                    this.showAlert(message, "success");

                    this.$refs.roleTable.fetchData();

                })
                .catch((error) => {

                    const msg =
                        error.response.data.message ||
                        "Delete failed";

                    this.showAlert(msg, "error");

                });

        },

    },

};
</script>

<style scoped>
/* =====================================================
   PREMIUM DIALOG
===================================================== */
.premium-dialog {
    border-radius: 30px;
    background: #ffffff;
    box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
}

/* =====================================================
   HEADER
===================================================== */
.dialog-header {
    position: relative;
    overflow: hidden;
    padding: 32px;
    background: linear-gradient(135deg, #0f172a, #1e293b);
}

.header-glow {
    position: absolute;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    top: -120px;
    right: -80px;
}

.dialog-icon {
    width: 72px;
    height: 72px;
    border-radius: 24px;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 12px 30px rgba(37, 99, 235, 0.35);
}

.dialog-title {
    font-size: 28px;
    font-weight: 700;
    color: white;
}

.dialog-subtitle {
    margin-top: 4px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
}

.dialog-badge {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.12);
    color: white;
    padding: 10px 18px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 600;
    backdrop-filter: blur(10px);
}

/* =====================================================
   BODY
===================================================== */
.dialog-body {
    padding: 36px;
}

.form-section-title {
    display: flex;
    align-items: center;
    gap: 14px;
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
}

.section-line {
    width: 42px;
    height: 4px;
    border-radius: 999px;
    background: linear-gradient(to right, #2563eb, #60a5fa);
}

/* =====================================================
   INPUTS
===================================================== */
.premium-input-group {
    margin-bottom: 16px;
}

.premium-label {
    display: block;
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 600;
    color: #334155;
}

.premium-input :deep(.v-field) {
    border-radius: 20px !important;
    background: #f8fafc !important;
    box-shadow: none !important;
    transition: all 0.25s ease;
}

.premium-input :deep(.v-field:hover) {
    background: #f1f5f9 !important;
}

.premium-input :deep(.v-field--focused) {
    background: white !important;
    border: 1px solid #2563eb;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08) !important;
}

/* =====================================================
   FOOTER
===================================================== */
.dialog-footer {
    display: flex;
    justify-content: flex-end;
    padding: 24px 36px;
    border-top: 1px solid #e2e8f0;
    background: #fafafa;
}

.cancel-dialog-btn {
    border: 1px solid #dbe2ea;
}

/* =====================================================
   TABLE ACTION BUTTON
===================================================== */
.premium-action-btn {
    background: #f8fafc;
    transition: all 0.2s ease;
}

.premium-action-btn:hover {
    transform: translateY(-1px);
    background: #eff6ff;
}

/* =====================================================
   MENU CARD
===================================================== */
.premium-menu-card {
    border: 1px solid #e2e8f0;
    overflow: hidden;
}

/* =====================================================
   MENU TOP
===================================================== */
.menu-top {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px;
}

.menu-top-icon {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    display: flex;
    align-items: center;
    justify-content: center;
}

.menu-title {
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
}

.menu-subtitle {
    font-size: 13px;
    color: #64748b;
}

/* =====================================================
   MENU ITEMS
===================================================== */
.menu-divider {
    height: 1px;
    background: #e2e8f0;
}

.menu-items {
    padding: 10px;
}

.premium-menu-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.premium-menu-item:hover {
    background: #f8fafc;
}

.menu-item-left {
    display: flex;
    align-items: center;
    gap: 14px;
}

.menu-item-icon {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.edit-bg {
    background: rgba(37, 99, 235, 0.12);
}

.delete-bg {
    background: rgba(239, 68, 68, 0.12);
}

.menu-item-title {
    font-size: 14px;
    font-weight: 600;
    color: #0f172a;
}

.menu-item-subtitle {
    font-size: 12px;
    color: #64748b;
}

/* =====================================================
   PERMISSION ITEM
===================================================== */
.premium-role-item {
    border-radius: 14px;
    margin: 6px 8px;
    transition: all 0.2s ease;
}

.premium-role-item:hover {
    background: rgba(37, 99, 235, 0.08);
    transform: translateX(3px);
}

.role-avatar {
    background: linear-gradient(135deg, #2563eb, #1e40af);
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.25);
}

.role-title {
    font-weight: 600;
    font-size: 14px;
    color: #0f172a;
}

.role-subtitle {
    font-size: 12px;
    color: #64748b;
}

.premium-role-chip {
    font-weight: 600;
}

/* =====================================================
   RESPONSIVE
===================================================== */
@media (max-width: 768px) {

    .dialog-header {
        padding: 24px;
    }

    .dialog-body {
        padding: 24px;
    }

    .dialog-footer {
        padding: 20px 24px;
        flex-direction: column;
    }

    .dialog-footer .v-btn {
        width: 100%;
    }

}
</style>
