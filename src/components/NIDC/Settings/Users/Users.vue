<template>
<v-container fluid class="users-page">

    <!-- BREADCRUMB -->
    <PageBreadcrumb title="Users" />

    <!-- TOP ACTION -->
    <v-row justify="end" class="mb-4">
        <v-col cols="12" md="auto">

            <v-dialog v-model="dialog" max-width="980" persistent transition="dialog-bottom-transition"  scrollable>
                <!-- ACTIVATOR -->
                <template #activator="{ props }">
                    <v-btn class="button-color my-5" prepend-icon="mdi-account-plus-outline" rounded="xl" elevation="0" height="50" v-bind="props">
                        Add User
                    </v-btn>
                </template>

                <!-- DIALOG CARD -->
                <v-card class="premium-dialog " rounded="xl" elevation="0">

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
                                user.id
                                    ? "mdi-account-edit-outline"
                                    : "mdi-account-plus-outline"
                            }}
                                    </v-icon>
                                </div>

                                <div class="ml-5">
                                    <div class="dialog-title">
                                        {{ user.id ? "Edit User" : "Create User" }}
                                    </div>

                                    <div class="dialog-subtitle">
                                        Manage user account information and access
                                    </div>
                                </div>
                            </div>

                            <!-- RIGHT -->
                            <div class="dialog-badge mt-4 mt-md-0">
                                <v-icon size="18" class="mr-2">
                                    mdi-shield-account-outline
                                </v-icon>

                                Secure User Profile
                            </div>

                        </div>
                    </div>

                    <!-- =====================================================
        BODY
        ====================================================== -->
                    <div class="dialog-body">
                        <v-form ref="form">

                            <!-- SECTION TITLE -->
                            <div class="form-section-title mb-6">
                                <div class="section-line"></div>
                                <span> User Information </span>
                            </div>

                            <v-row>

                                <!-- FIRST NAME -->
                                <v-col cols="12" md="4">
                                    <div class="premium-input-group">
                                        <label class="premium-label">
                                            First Name <span class="text-red">*</span>
                                        </label>

                                        <v-text-field v-model="user.first_name" placeholder="Enter first name" variant="solo-filled" flat rounded="xl" hide-details prepend-inner-icon="mdi-account-outline" class="premium-input" />
                                    </div>
                                </v-col>

                                <!-- MIDDLE NAME -->
                                <v-col cols="12" md="4">
                                    <div class="premium-input-group">
                                        <label class="premium-label">
                                            Middle Name
                                        </label>

                                        <v-text-field v-model="user.middle_name" placeholder="Enter middle name" variant="solo-filled" flat rounded="xl" hide-details prepend-inner-icon="mdi-account-outline" class="premium-input" />
                                    </div>
                                </v-col>

                                <!-- LAST NAME -->
                                <v-col cols="12" md="4">
                                    <div class="premium-input-group">
                                        <label class="premium-label">
                                            Last Name <span class="text-red">*</span>
                                        </label>

                                        <v-text-field v-model="user.last_name" placeholder="Enter last name" variant="solo-filled" flat rounded="xl" hide-details prepend-inner-icon="mdi-account-outline" class="premium-input" />
                                    </div>
                                </v-col>

                                <!-- EMAIL -->
                                <v-col cols="12" md="6">
                                    <div class="premium-input-group">
                                        <label class="premium-label">
                                            Email Address <span class="text-red">*</span>
                                        </label>

                                        <v-text-field v-model="user.email" placeholder="Enter email address" variant="solo-filled" flat rounded="xl" hide-details prepend-inner-icon="mdi-email-outline" class="premium-input" />
                                    </div>
                                </v-col>

                                <!-- PHONE -->
                                <v-col cols="12" md="6">
                                    <div class="premium-input-group">
                                        <label class="premium-label">
                                            Phone Number <span class="text-red">*</span>
                                        </label>

                                        <v-text-field v-model="user.phone" placeholder="Enter phone number" variant="solo-filled" flat rounded="xl" hide-details prepend-inner-icon="mdi-phone-outline" class="premium-input" />
                                    </div>
                                </v-col>

                               
                               
                                <v-col cols="12">
                                    <div class="premium-input-group">
                                        <label class="premium-label"> Roles </label>
                                        <v-autocomplete v-model="selectedRoles" :items="Array.isArray(roles) ? roles : []" item-title="name" item-value="id" multiple chips closable-chips variant="solo-filled" flat hide-details class="premium-input" placeholder="Select roles for this user">
                                            <template v-slot:item="{ props, item }">
                                                <v-list-item v-bind="props" class="premium-role-item">
                                                    <!-- ICON -->
                                                    <template #prepend>
                                                        <v-avatar size="36" class="role-avatar">
                                                            <v-icon size="18" color="white">
                                                                mdi-shield-account
                                                            </v-icon>
                                                        </v-avatar>
                                                    </template>
                                                    <!-- CONTENT -->
                                                    <v-list-item-title class="role-title">
                                                        {{ item.raw.name }}
                                                    </v-list-item-title>
                                                    <v-list-item-subtitle class="role-subtitle">
                                                        System role & permissions access
                                                    </v-list-item-subtitle>

                                                </v-list-item>
                                            </template>
                                            <template v-slot:chip="{ props, item }">
                                                <v-chip v-bind="props" class="premium-role-chip" color="blue-darken-2" variant="flat" closable>
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

                    <!-- =====================================================
        FOOTER
        ====================================================== -->
                    <div class="dialog-footer">

                        <v-btn variant="outlined" rounded="xl" height="48" class="px-8 cancel-dialog-btn" @click="closeDialog">
                            CANCEL
                        </v-btn>

                        <v-btn rounded="xl" height="48" class="px-8 button-color ml-3" elevation="0" @click="saveItem">
                            <v-icon start size="18">mdi-content-save-outline</v-icon>

                            {{ user.id ? "Update User" : "Save User" }}
                        </v-btn>

                    </div>

                </v-card>
            </v-dialog>
        </v-col>
    </v-row>

    <!-- TABLE -->
    <DataTable ref="userTable" api-url="users" :headers="headers" title="User Management" subtitle="Manage system users">

        <!-- =====================================================
            ACTIONS SLOT
        ====================================================== -->
        <template #actions="{ item }">
            <!-- =====================================================
    PREMIUM ACTION MENU
====================================================== -->
            <v-menu location="bottom end" transition="scale-transition" offset="12">
                <!-- ACTIVATOR -->
                <template #activator="{ props }">
                    <v-btn v-bind="props" icon size="42" elevation="0" class="premium-action-btn">
                        <v-icon size="20"> mdi-dots-horizontal </v-icon>
                    </v-btn>
                </template>

                <!-- MENU CARD -->
                <v-card class="premium-menu-card" rounded="xl" elevation="0" min-width="220">
                    <!-- TOP -->
                    <div class="menu-top">
                        <div class="menu-top-icon">
                            <v-icon size="18" color="white">
                                mdi-lightning-bolt-outline
                            </v-icon>
                        </div>

                        <div>
                            <div class="menu-title">Quick Actions</div>

                            <div class="menu-subtitle">Manage this record</div>
                        </div>
                    </div>

                    <!-- DIVIDER -->
                    <div class="menu-divider"></div>

                    <!-- MENU ITEMS -->
                    <div class="menu-items">
                        <!-- EDIT -->
                        <div class="premium-menu-item" @click="editItem(item)">
                            <div class="menu-item-left">
                                <div class="menu-item-icon edit-bg">
                                    <v-icon size="18" color="#2563eb">
                                        mdi-pencil-outline
                                    </v-icon>
                                </div>

                                <div>
                                    <div class="menu-item-title">Edit User</div>

                                    <div class="menu-item-subtitle">Update user details</div>
                                </div>
                            </div>

                            <v-icon size="18" color="#94a3b8"> mdi-chevron-right </v-icon>
                        </div>
                        <!-- STATUS ACTION -->
                        <div v-if="item.status == 1" class="premium-menu-item delete-item" @click="deactivateDialog(item)">
                            <div class="menu-item-left">
                                <div class="menu-item-icon delete-bg">
                                    <!-- DEACTIVATE -->
                                    <v-icon size="18" color="#f59e0b"> mdi-cancel </v-icon>
                                </div>

                                <div>
                                    <div class="menu-item-title">Deactivate User</div>

                                    <div class="menu-item-subtitle">Mark as inactive</div>
                                </div>
                            </div>

                            <v-icon size="18" color="#94a3b8"> mdi-chevron-right </v-icon>
                        </div>

                        <!-- ACTIVATE -->
                        <div v-else class="premium-menu-item" @click="activateDialog(item)">
                            <div class="menu-item-left">
                                <div class="menu-item-icon edit-bg">
                                    <!-- ACTIVATE -->
                                    <v-icon size="18" color="#22c55e">
                                        mdi-check-circle-outline
                                    </v-icon>
                                </div>

                                <div>
                                    <div class="menu-item-title">Activate User</div>

                                    <div class="menu-item-subtitle">Mark as active</div>
                                </div>
                            </div>

                            <v-icon size="18" color="#94a3b8"> mdi-chevron-right </v-icon>
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
                                    <div class="menu-item-title">Delete User</div>

                                    <div class="menu-item-subtitle">Remove permanently</div>
                                </div>
                            </div>

                            <v-icon size="18" color="#94a3b8"> mdi-chevron-right </v-icon>
                        </div>
                    </div>
                </v-card>
            </v-menu>
        </template>

    </DataTable>
    <!-- =========================================================
    DEACTIVATE USER DIALOG
========================================================= -->
    <v-dialog v-model="deactivateConfirm" max-width="540" transition="dialog-bottom-transition">

        <v-card class="premium-dialog deactivate-dialog" elevation="0" rounded="xl">

            <!-- TOP -->
            <div class="dialog-top deactivate-top">
                <!-- GLOW -->
                <div class="dialog-glow"></div>
                <!-- ICON -->
                <div class="dialog-icon danger-icon">
                    <v-icon size="46" color="white">
                        mdi-account-lock-outline
                    </v-icon>
                </div>
            </div>
            <!-- CONTENT -->
            <div class="px-8 pb-8">

                <!-- TITLE -->
                <div class="text-center mt-7">

                    <h2 class="dialog-title">
                        Confirm Deactivation
                    </h2>

                    <p class="dialog-subtitle">

                        This user will immediately lose
                        access to the system and all
                        assigned permissions.

                    </p>

                </div>

                <!-- USER CARD -->
                <div class="premium-user-card mt-8">

                    <div class="d-flex align-center">

                        <!-- AVATAR -->
                        <div class="premium-avatar danger-avatar">

                            {{
                            UserToActivate?.name
                                ?.charAt(0)
                                ?.toUpperCase()
                        }}

                        </div>

                        <!-- USER INFO -->
                        <div class="ml-4 flex-grow-1">

                            <div class="premium-user-name">
                                {{ UserToActivate?.name }}
                            </div>

                            <div class="premium-user-email">
                                {{ UserToActivate?.email }}
                            </div>

                        </div>

                        <!-- STATUS -->
                        <div class="status-chip danger-chip">

                            <v-icon size="14" class="mr-1">
                                mdi-alert-circle
                            </v-icon>

                            Disable

                        </div>

                    </div>

                </div>

                <!-- WARNING -->
                <div class="premium-warning-box mt-6">

                    <v-icon color="#f59e0b" size="20" class="mr-2">
                        mdi-alert-outline
                    </v-icon>

                    <span>
                        The user account will become inactive immediately.
                    </span>

                </div>

                <!-- ACTIONS -->
                <div class="d-flex justify-center mt-8">

                    <!-- CANCEL -->
                    <v-btn variant="outlined" rounded="xl" height="48" class="px-8 mr-3 cancel-btn" @click="deactivateConfirm = false">
                        Cancel
                    </v-btn>

                    <!-- CONFIRM -->
                    <v-btn rounded="xl" height="48" elevation="0" class="px-8 danger-btn" :loading="loadingStatus" @click="toggleUserStatus">

                        <v-icon start size="18">
                            mdi-account-off-outline
                        </v-icon>

                        Deactivate

                    </v-btn>

                </div>

            </div>

        </v-card>

    </v-dialog>

    <!-- =========================================================
    ACTIVATE USER DIALOG
========================================================= -->
    <v-dialog v-model="activateConfirm" max-width="540" transition="dialog-bottom-transition">

        <v-card class="premium-dialog activate-dialog" elevation="0" rounded="xl">

            <!-- TOP -->
            <div class="dialog-top activate-top">

                <!-- GLOW -->
                <div class="dialog-glow"></div>

                <!-- ICON -->
                <div class="dialog-icon success-icon">

                    <v-icon size="46" color="white">
                        mdi-check-decagram-outline
                    </v-icon>

                </div>

            </div>

            <!-- CONTENT -->
            <div class="px-8 pb-8">

                <!-- TITLE -->
                <div class="text-center mt-7">

                    <h2 class="dialog-title">
                        Confirm Activation
                    </h2>

                    <p class="dialog-subtitle">

                        This user will regain access
                        to the system and all assigned
                        permissions immediately.

                    </p>

                </div>

                <!-- USER CARD -->
                <div class="premium-user-card mt-8">

                    <div class="d-flex align-center">

                        <!-- AVATAR -->
                        <div class="premium-avatar success-avatar">

                            {{
                            UserToActivate?.name
                                ?.charAt(0)
                                ?.toUpperCase()
                        }}

                        </div>

                        <!-- USER INFO -->
                        <div class="ml-4 flex-grow-1">

                            <div class="premium-user-name">
                                {{ UserToActivate?.name }}
                            </div>

                            <div class="premium-user-email">
                                {{ UserToActivate?.email }}
                            </div>

                        </div>

                        <!-- STATUS -->
                        <div class="status-chip success-chip">

                            <v-icon size="14" class="mr-1">
                                mdi-check-circle
                            </v-icon>

                            Enable

                        </div>

                    </div>

                </div>

                <!-- SUCCESS INFO -->
                <div class="premium-success-box mt-6">

                    <v-icon color="#16a34a" size="20" class="mr-2">
                        mdi-shield-check-outline
                    </v-icon>

                    <span>
                        The user account will become active immediately.
                    </span>

                </div>

                <!-- ACTIONS -->
                <div class="d-flex justify-center mt-8">

                    <!-- CANCEL -->
                    <v-btn variant="outlined" rounded="xl" height="48" class="px-8 mr-3 cancel-btn" @click="activateConfirm = false">
                        Cancel
                    </v-btn>

                    <!-- CONFIRM -->
                    <v-btn rounded="xl" height="48" elevation="0" class="px-8 success-btn" :loading="loadingStatus" @click="toggleUserStatus">

                        <v-icon start size="18">
                            mdi-check-circle-outline
                        </v-icon>

                        Activate

                    </v-btn>

                </div>

            </div>

        </v-card>

    </v-dialog>
    <!-- DELETE -->
    <DeleteDialog v-model="confirmDialogVisible" title="Delete User" :item-name="itemToDelete.full_name" :item-description="itemToDelete.email" @confirm="deleteItem" />
    <!-- <StatusDialog v-model="statusDialogVisible" :item-name="itemToUpdate.first_name" :action="statusAction" @confirm="updateStatus" /> -->

</v-container>
</template>

<script>
import axios from "axios";
import DataTable from "../../SharedComponents/dataTable.vue";
import DeleteDialog from "../../SharedComponents/DeleteDialog.vue";
// import statusDialog from "../../SharedComponents/statusDialog.vue";
import PageBreadcrumb from "@/components/NIDC/SharedComponents/PageBreadcrumb.vue";
import swtalert from "@/mixins/swtalert";

export default {
    components: {
        DataTable,
        DeleteDialog,
        // statusDialog,
        PageBreadcrumb
    },
    mixins: [swtalert],

    data() {
        return {
            dialog: false,
            confirmDialogVisible: false,
            statusDialogVisible: false,
            deactivateConfirm: false,
            activateConfirm: false,
            UserToActivate: {},
            statusAction: "",

            user: {
                id: null,
				first_name: "",
				middle_name: null,
                last_name: "",
                email: "",
                phone: "",
                password: "",
                signature: null,
                roles: [],
            },
            roles: [],
            selectedRoles: [],
            itemToDelete: {},
            headers: [{
                    title: "Name",
                    value: "full_name"
                },
                {
                    title: "Email",
                    value: "email"
                },
                {
                    title: "Phone",
                    value: "phone"
                },
                {
                    title: "Status",
                    value: "status"
                },
                {
                    title: "Actions",
                    value: "actions"
                },
            ],
        };
    },

    mounted() {
        this.fetchRoles();
    },

    methods: {

        refreshTable() {
            this.$refs.userTable.fetchData()
        },
        async fetchRoles() {
            try {
                const res = await axios.get("/roles");

                const raw = res.data.data;

                // HANDLE PAGINATED RESPONSE
                if (raw.data && Array.isArray(raw.data)) {
                    this.roles = raw.data;
                }
                // HANDLE NON-PAGINATED RESPONSE
                else if (Array.isArray(raw)) {
                    this.roles = raw;
                } else {
                    this.roles = [];
                }

            } catch (error) {
                console.error("Roles fetch error:", error);
                this.roles = [];
            }
        },

        editItem(item) {
            this.user = {
                ...item
            };

            // IMPORTANT: map roles -> ids
            this.selectedRoles = item.roles ?
                item.roles.map(r => r.id) : [];

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
                password: "",
                signature: null,
                roles: [],
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


    if (!this.user.id) {

        formData.append(
            "password",
            this.user.password || ""
        );

        formData.append(
            "password_confirmation",
            this.user.password_confirmation || ""
        );
    }


    this.selectedRoles.forEach((roleId, index) => {

        formData.append(
            `roles[${index}]`,
            roleId
        );

    });


    if (this.user.signature) {

        const file = Array.isArray(this.user.signature)
            ? this.user.signature[0]
            : this.user.signature;

        formData.append(
            "signature",
            file
        );
    }


    try {

        let response;

        if (this.user.id) {

            formData.append("_method", "PUT");

            response = await axios.post(
                `/users/${this.user.id}`,
                formData
            );


        } else {

            response = await axios.post(
                "/users",
                formData
            );

        }


        // BACKEND MESSAGE
        this.showAlert(
            response.data.message,
            "success"
        );


        this.dialog = false;

        this.refreshTable();

        this.closeDialog();


    } catch (error) {


        console.error(error);


        const message =
            error.response?.data?.message ||
            "Something went wrong";


        // BACKEND ERROR MESSAGE
        this.showAlert(
            message,
            "error"
        );

    }

},
        deleteDialog(item) {
            this.itemToDelete = item;
            this.confirmDialogVisible = true;
        },
        async toggleUserStatus() {

            try {

                const response = await axios.patch(
                    `/users/${this.UserToActivate.id}/toggle-status`
                );

                /*
                |--------------------------------------------------------------------------
                | UPDATE SELECTED USER (PRIMARY SOURCE)
                |--------------------------------------------------------------------------
                */

                this.UserToActivate.status = response.data.data.status;

                /*
                |--------------------------------------------------------------------------
                | SYNC WITH LIST IF EXISTS
                |--------------------------------------------------------------------------
                */

                if (Array.isArray(this.users)) {

                    const index = this.users.findIndex(
                        user => user.id === this.UserToActivate.id
                    );

                    if (index !== -1) {
                        this.users[index].status = this.UserToActivate.status;
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | CLOSE DIALOGS
                |--------------------------------------------------------------------------
                */

                this.activateConfirm = false;
                this.deactivateConfirm = false;

                /*
                |--------------------------------------------------------------------------
                | SUCCESS MESSAGE
                |--------------------------------------------------------------------------
                */

                this.showAlert(response.data.message, "success");
                this.refreshTable()

            } catch (error) {

                this.activateConfirm = false;
                this.deactivateConfirm = false;

                this.showAlert(
                    error.response.data.message ||
                    "Failed to update user status",
                    "error"
                );

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

            axios.delete(`/users/${this.itemToDelete.id}`)
                .then((response) => {
                    const message =
                        response.data.message ||
                        'Deleted successfully'

                    this.confirmDialogVisible = false

                    this.showAlert(message, 'success')

                    this.refreshTable()

                })
                .catch((error) => {

                    const msg =
                        error.response.data.message ||
                        'Delete failed'

                    this.showAlert(msg, 'error')

                })

        }

    }
};
</script>

<style scoped>
/* =========================
   DROPDOWN ITEM CARD STYLE
========================== */
.premium-role-item {
    border-radius: 14px;
    margin: 6px 8px;
    transition: all 0.2s ease;
}

/* hover effect like modern apps */
.premium-role-item:hover {
    background: rgba(37, 99, 235, 0.08);
    transform: translateX(3px);
}

/* avatar styling */
.role-avatar {
    background: linear-gradient(135deg, #2563eb, #1e40af);
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.25);
}

/* title */
.role-title {
    font-weight: 600;
    font-size: 14px;
    color: #0f172a;
}

/* dropdown menu spacing */
.v-overlay .v-list {
    padding: 8px;
}

/* =========================================================
    DIALOG
========================================================= */

.premium-dialog {

    overflow: hidden;

    border-radius: 34px !important;

    background: white;

    box-shadow:
        0 30px 80px rgba(15, 23, 42, 0.15);
}

/* =========================================================
    TOP
========================================================= */

.dialog-top {

    height: 150px;

    position: relative;

    display: flex;
    align-items: center;
    justify-content: center;

    overflow: hidden;
}

/* ACTIVATE */
.activate-top {

    background:
        linear-gradient(135deg,
            #16a34a,
            #22c55e,
            #15803d);
}

/* DEACTIVATE */
.deactivate-top {

    background:
        linear-gradient(135deg,
            #ef4444,
            #dc2626,
            #991b1b);
}

/* GLOW */
.dialog-glow {

    position: absolute;

    width: 280px;
    height: 280px;

    border-radius: 50%;

    background:
        rgba(255, 255, 255, 0.08);

    top: -100px;
    right: -60px;
}

/* ICON */
.dialog-icon {

    width: 100px;
    height: 100px;

    border-radius: 30px;

    backdrop-filter: blur(10px);

    border:
        1px solid rgba(255, 255, 255, 0.2);

    display: flex;
    align-items: center;
    justify-content: center;

    z-index: 2;

    box-shadow:
        0 15px 40px rgba(0, 0, 0, 0.18);
}

/* SUCCESS */
.success-icon {

    background:
        rgba(255, 255, 255, 0.15);
}

/* DANGER */
.danger-icon {

    background:
        rgba(255, 255, 255, 0.15);
}

/* =========================================================
    TITLE
========================================================= */

.dialog-title {

    font-size: 30px;

    font-weight: 800;

    color: #0f172a;

    margin-bottom: 12px;
}

.dialog-subtitle {

    font-size: 15px;

    line-height: 1.8;

    color: #64748b;

    max-width: 400px;

    margin: auto;
}

/* =========================================================
    USER CARD
========================================================= */

.premium-user-card {

    padding: 20px;

    border-radius: 28px;

    background:
        linear-gradient(to bottom right,
            #ffffff,
            #f8fafc);

    border: 1px solid #e2e8f0;
}

/* AVATAR */
.premium-avatar {

    width: 68px;
    height: 68px;

    border-radius: 22px;

    display: flex;
    align-items: center;
    justify-content: center;

    color: white;

    font-size: 24px;
    font-weight: 800;
}

/* SUCCESS */
.success-avatar {

    background:
        linear-gradient(135deg,
            #22c55e,
            #15803d);

    box-shadow:
        0 12px 25px rgba(34, 197, 94, 0.25);
}

/* DANGER */
.danger-avatar {

    background:
        linear-gradient(135deg,
            #ef4444,
            #b91c1c);

    box-shadow:
        0 12px 25px rgba(239, 68, 68, 0.25);
}

/* USER INFO */
.premium-user-name {

    font-size: 18px;

    font-weight: 800;

    color: #0f172a;
}

.premium-user-email {

    margin-top: 4px;

    font-size: 13px;

    color: #64748b;
}

/* =========================================================
    STATUS CHIP
========================================================= */

.status-chip {

    padding: 8px 14px;

    border-radius: 999px;

    font-size: 12px;
    font-weight: 700;

    display: flex;
    align-items: center;
}

/* SUCCESS */
.success-chip {

    background:
        rgba(34, 197, 94, 0.12);

    color: #15803d;
}

/* DANGER */
.danger-chip {

    background:
        rgba(239, 68, 68, 0.12);

    color: #dc2626;
}

/* =========================================================
    ALERT BOXES
========================================================= */

.premium-warning-box,
.premium-success-box {

    padding: 16px 18px;

    border-radius: 20px;

    display: flex;
    align-items: center;

    font-size: 14px;
    font-weight: 600;
}

/* WARNING */
.premium-warning-box {

    background:
        rgba(245, 158, 11, 0.08);

    border:
        1px solid rgba(245, 158, 11, 0.15);

    color: #92400e;
}

/* SUCCESS */
.premium-success-box {

    background:
        rgba(34, 197, 94, 0.08);

    border:
        1px solid rgba(34, 197, 94, 0.15);

    color: #166534;
}

/* =========================================================
    BUTTONS
========================================================= */

.cancel-btn {

    text-transform: none !important;

    font-weight: 700 !important;

    border: 1px solid #cbd5e1 !important;

    color: #334155 !important;
}

/* SUCCESS BUTTON */
.success-btn {

    text-transform: none !important;

    font-weight: 700 !important;

    color: white !important;

    background:
        linear-gradient(135deg,
            #22c55e,
            #15803d) !important;

    box-shadow:
        0 12px 28px rgba(34, 197, 94, 0.28);
}

/* DANGER BUTTON */
.danger-btn {

    text-transform: none !important;

    font-weight: 700 !important;

    color: white !important;

    background:
        linear-gradient(135deg,
            #ef4444,
            #b91c1c) !important;

    box-shadow:
        0 12px 28px rgba(239, 68, 68, 0.28);
}
/* =========================================================
   PREMIUM DIALOG SCROLL FIX
========================================================= */

.premium-dialog {
    max-height: 90vh;
    display: flex;
    flex-direction: column;
}


/* HEADER FIXED */
.dialog-header {
    flex-shrink: 0;
}


/* BODY SCROLL AREA */
.dialog-body {

    flex: 1;

    overflow-y: auto;

    max-height: calc(90vh - 230px);

    padding: 28px;

}


/* FOOTER FIXED */
.dialog-footer {

    flex-shrink: 0;

    background: white;

    padding: 20px 28px;

    border-top: 1px solid #e2e8f0;

}


/* BEAUTIFUL SCROLLBAR */
.dialog-body::-webkit-scrollbar {
    width: 8px;
}


.dialog-body::-webkit-scrollbar-track {

    background: #f1f5f9;

    border-radius: 20px;

}


.dialog-body::-webkit-scrollbar-thumb {

    background: #cbd5e1;

    border-radius: 20px;

}


.dialog-body::-webkit-scrollbar-thumb:hover {

    background: #94a3b8;

}
</style>
