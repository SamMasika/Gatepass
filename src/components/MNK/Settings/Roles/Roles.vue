<template>
<v-container fluid>
	<nav class="custom-breadcrumbs">
			<span class="breadcrumb-item" @click="$router.push('/dashboard')">Dashboard</span>
			<span class="breadcrumb-separator">/</span>
			<span class="breadcrumb-item active">Roles</span>
	</nav>
    <v-row justify="end">
        <v-col cols="12" md="auto" class="d-flex justify-end">
            <v-dialog v-model="dialog" max-width="900">
                <template v-slot:activator="{ props: activatorProps }">
                    <v-btn class="text-none font-weight-regular button-color my-5" prepend-icon="mdi-plus" text="Add Role" variant="flat" v-bind="activatorProps" rounded="xl"></v-btn>
                </template>
                <v-card prepend-icon="mdi-plus" title="Add Role">
                    <v-form>
                        <v-card-text>
                            <v-row dense>
                                <v-col cols="12">
                                    <v-text-field label="Name*" v-model="role.name" required variant="outlined" density="compact"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn text="Close" class="text-none" variant="tonal" @click="dialog = false" rounded="xl"></v-btn>
                            <v-btn type="submit" text="Save" class="text-none button-color" variant="flat" @click="addRole" rounded="xl"></v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card>
            </v-dialog>
        </v-col>
    </v-row>
    <v-card flat>
        <v-toolbar>
            <v-icon icon="mdi-account-group" class="mx-5 " size="40"></v-icon> &nbsp;
            Roles & Permissions
            <v-spacer></v-spacer>

        </v-toolbar>
        <v-row justify="end" class="mt-2">
            <v-col cols="12" md="4" class="d-flex justify-end">
                <v-text-field v-model="search" label="Search" rounded="xl" density="compact" prepend-inner-icon="mdi-magnify" flat variant="solo-filled" hide-details single-line class="search-field" :style="{ maxWidth: '300px' }"></v-text-field>
            </v-col>
        </v-row>
        <v-card-text>
            <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items="roles" :items-length="totalItems" :loading="loading" item-value="id" :page="currentPage" @update:options="handlePageChange">
            <!-- Actions slot for custom menu with 3 dots -->
            <template v-slot:[`item.actions`]="{ item }">
                <v-menu transition="slide-x-transition">
                    <template v-slot:activator="{ props }">
                        <v-icon v-bind="props">
                            mdi-dots-vertical
                        </v-icon>
                    </template>
                    <!-- List for actions -->
                    <v-list>
                        <v-list-item @click="editRole(item)">
                            <template v-slot:prepend>
                                <v-icon>mdi-pencil</v-icon> <!-- Edit Icon -->
                            </template>
                            <v-list-item-title class="font-weight-bold">Edit</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="deleteDialog(item)">
                            <template v-slot:prepend>
                                <v-icon>mdi-delete</v-icon> <!-- Delete Icon -->
                            </template>
                            <v-list-item-title class="font-weight-bold">Delete</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>

            <template v-slot:[`item.status`]="{ item }">

                <v-chip :color="item.status ? 'green' : 'red'" :text="item.status ? 'Active' : 'Inactive'" class="text-mixedcase" size="small"></v-chip>

            </template>
           </v-data-table-server>
        </v-card-text>
    </v-card>
    <v-dialog v-model="roleEditDialog" persistent max-width="1000px">
        <v-card>
            <v-toolbar class="text-h5 font-weight-bold">
                <v-spacer></v-spacer>
                <v-icon left class="mr-2">mdi-pencil</v-icon>
                Edit Role Details
                <v-spacer></v-spacer>
            </v-toolbar>

            <v-divider></v-divider>

            <v-card-text>
                <v-form @submit.prevent="updateRole">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="roleEdit.name" label="Role Name" color="blue-lighten-1" class="rounded-lg" variant="outlined">
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-autocomplete v-model="selectedPermission[roleEdit.id]" :items="filteredPermissions" item-title="name" item-value="id" class="rounded-lg custom-autocomplete" color="blue-lighten-1" label="Select Permissions" variant="outlined" multiple>
                                <template v-slot:chip="{ props, item }">
                                    <v-chip v-bind="props" color="blue-lighten-1" closable @click="props.select" @click:close="remove(item)">
                                        {{ item.raw.name }}
                                    </v-chip>
                                </template>
                            </v-autocomplete>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <!-- Dialog Actions -->
            <v-card-actions class="d-flex r">
                <v-btn text class="text-none" variant="tonal" @click="roleEditDialog = false" rounded="xl">
                    Close
                </v-btn>
                <v-btn type="submit" text class="text-none button-color" variant="contained" @click="updateRole" rounded="xl">
                    Update
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="confirmDialogVisible" max-width="450">
        <v-card class="rounded-lg elevation-16" style="background-color: #f9f9f9;">
            <!-- Title Section -->
            <v-card-title class="font-weight-bold white--text text-center py-2" style=" font-size: 20px;">
                <v-icon size="90" color="red" class="mr-3">mdi-delete</v-icon>
                Confirm Deletion
            </v-card-title>

            <!-- Content Section -->
            <v-card-text class="text-center py-1" style=" font-size: 16px; line-height: 1.6;">

                <div class="font-weight-medium  text-center mb-4">
                    Are you sure you want to delete <b>"{{ RoleToDelete.name }} </b>?
                </div>
                <div class="font-italic" style="color: #777;">
                    This action cannot be undone.
                </div>
            </v-card-text>

            <!-- Divider -->
            <v-divider></v-divider>

            <!-- Action Buttons -->
            <v-card-actions class="justify-center py-4">
                <v-btn text class="mr-3" variant="outlined" @click="confirmDialogVisible = false" rounded="xl" color="grey lighten-2" style=" font-weight: 500;">
                    Cancel
                </v-btn>
                <v-btn text variant="tonal" @click="deleteRole" rounded="xl" color="red" style=" font-weight: 600;">
                    <v-icon left>mdi-delete</v-icon> Delete
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</v-container>
</template>

<script>
import axios from "axios";
import singledatatable from "@/mixins/singledatatable";
import alert from "@/mixins/swtalert";
export default {
	mixins:[singledatatable,alert],
    data() {
        return {
            search: "",
            roles: [],
            dialog: false,
            roleEditDialog: false,
            roleEdit: {},
            RoleToDelete: {},
            Roledialog: false,
            dialogDelete: false,
            confirmDialogVisible: false,
            permission: [],
            selectedPermission: {},
            searchPermission: "",
            isLoading: false,
            role: {},
            headers: [{
                    title: "Name",
                    value: "name",
                    sortable: false,
                },
                {
                    title: "Actions",
                    value: "actions",
                    sortable: false,
                },
            ],
        };
    },
    watch: {
        'user.confirm_password'(newValue) {
            this.passwordErrorMessages = [];
            if (newValue !== this.user.password) {
                this.passwordErrorMessages.push('Passwords do not match');
            }
        },
    },
    computed: {
        filteredPermissions() {
            if (!this.searchPermission) {
                return this.permission;
            }
            const keyword = this.searchPermission.toLowerCase();
            return this.permission.filter((permission) =>
                permission.name.toLowerCase().includes(keyword)
            );
        },
        likesAllPermission() {
            return this.selectedPermission.length === this.permission.length
        },
        likesSomePermission() {
            return this.selectedPermission.length > 0 && !this.likesAllPermission
        },
        icon() {
            if (this.likesAllPermission) return 'mdi-close-box'
            if (this.likesSomePermission) return 'mdi-minus-box'
            return 'mdi-checkbox-blank-outline'
        },

        permissionsToUpdate() {
            // Find the permissions that were removed (unchecked)
            const removedPermissions = this.roleEdit.permission.filter(permission => !this.selectedPermission.includes(permission));
            // Find the permissions that were added (checked)
            const addedPermissions = this.selectedPermission.filter(permission => !this.roleEdit.permission.includes(permission));
            return {
                removed: removedPermissions,
                added: addedPermissions,
            };
        },
    },
    methods: {
        remove(item) {
            const roleId = this.roleEdit.id;
            const index = this.selectedPermission[roleId].indexOf(item.id);
            if (index >= 0) {
                this.selectedPermission[roleId].splice(index, 1);
            }
        },

        hasPermission(permission, roleId) {
            if (this.selectedPermission[roleId]) {
                return this.selectedPermission[roleId].includes(permission);
            }
            return false;
        },

        customFilter(value, search, item) {
            if (!search) return true;
            const keyword = search.toLowerCase();
            return item.name.toLowerCase().includes(keyword);
        },
        toggle(roleId) {
            this.$nextTick(() => {
                const rolePermissions = this.selectedPermission[roleId] || [];

                if (rolePermissions.length === this.permission.length) {
                    // Clear all permissions for the role
                    this.selectedPermission[roleId] = [];
                } else {
                    // Ensure this.$refs.permissionDropdown exists before accessing it
                    if (this.$refs.permissionDropdown && this.$refs.permissionDropdown[roleId]) {
                        const selectedPermissions = this.$refs.permissionDropdown[roleId].internalValue || [];

                        this.selectedPermission[roleId] = this.permission
                            .filter(permission => selectedPermissions.includes(permission.id))
                            .map(permission => permission.id);
                    }
                }
            });
        },

        async fetchData() {
            this.isLoading = true;
            try {
                // Fetch Users & Roles simultaneously
                const roleParams = {
                    page: this.currentPage,
                    per_page: this.itemsPerPage === -1 ? this.totalItems : this.itemsPerPage,
                    search: this.search,
                };

                const roleResponse = await axios.get('/role-list', {
                    params: roleParams
                });
                const responseData = roleResponse.data.data || {};
                this.roles = Array.isArray(roleResponse.data.data.data) ? roleResponse.data.data.data : [];
                this.totalItems = responseData.meta ?.total || 0;
                this.totalPages = responseData.meta ?.last_page || 1;

                this.roles.forEach(role => {
                    const selectedPermissions = Array.isArray(role.permissions) ?
                        role.permissions.map(permission => permission.id) : [];

                    this.selectedPermission = {
                        ...this.selectedPermission,
                        [role.id]: selectedPermissions
                    };
                });

                const permissionResponse = await axios.get('/permission-list');
                this.permission = Array.isArray(permissionResponse.data.data) ?
                    permissionResponse.data.data.map(permission => ({
                        id: permission.id,
                        name: permission.name,
                    })) : [];

                const userResponse = await axios.get('/user-list');
                this.users = Array.isArray(userResponse.data.data) ? userResponse.data.data : [];

                console.log(this.selectedPermission);
                console.log(this.users);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setTimeout(() => {
                    this.isLoading = false;
                }, 1000);
            }
        },
        addRole() {
            axios.post('/role-store', this.role)
                .then(response => {
                    this.showAlert(response.data.message, 'success');
                    this.dialog = false; // Close the dialog after success
                    setTimeout(() => {
                        window.location.reload(); // Reload the window after success
                    }, 500); // Delay the reload slightly to allow the success message to be shown
                })
                .catch(error => this.showAlert(error.response.data.message, 'error'));

        },

        //Updaterole
        editRole(item) {
            this.roleEdit = item
            this.roleEditDialog = true
        },
     updateRole() {
    const { id, name } = this.roleEdit;
    const selectedPermissions = this.selectedPermission[id] || [];
    this.loading = true;

    axios
        .post('/role-update', {
            id,
            name,
            permissions: selectedPermissions
        })
        .then((response) => {
            if (response.data && response.data.message) {
                this.showAlert(response.data.message, 'success');
                this.roleEditDialog = false;
                this.fetchData(); // Optional: refresh data
                setTimeout(() => {
                    window.location.reload(); // Reload after a short delay
                }, 1000); // You can adjust the delay as needed
            } else {
                console.error('No message found in the response data');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            this.showAlert('API call failed! ' + error.message, 'error');
            this.roleEditDialog = false;
        });
},

        deleteRole() {
            axios.delete(`/role-delete/${this.RoleToDelete.id}`)
                .then(response => {
                    // Remove the item from the data arraythis.dialogRole = true
                    const index = this.roles.indexOf(this.RoleToDelete);
                    if (index > -1) {
                        this.roles.splice(index, 1);
                    }
                    this.confirmDialogVisible = false;
                    this.showAlert(response.data.message, 'success');

                    setTimeout(() => {
                        window.location.reload(); // Reload the window after success
                    }, 500); // Delay the reload slightly to allow the success message to be shown
                })
                .catch(error => this.showAlert(error.response.data.message, 'error'));
        },

        deleteDialog(item) {
            this.RoleToDelete = item;
            this.confirmDialogVisible = true;
        },
      
    },

    mounted() {
        this.fetchData();
    },
};
</script>

<style>
.header {
    padding: 16px 24px;
    border-bottom: 1px solid #e0e0e0;
}

.title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
}

.add-button {
    border-radius: 24px;
}

.search-field {
    flex-grow: 1;
    max-width: 300px;
    margin-right: 10px;
}

.v-card {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}

.v-data-table {
    margin-top: 16px;
}

.datatable-header {
    background-color: #1976d2 !important;
    color: white !important;
}

.text-color {
    color: #A82228;
}

.toolbar {
    background-color: #A82228;
    color: white;
}
</style>
