<template>
<v-container fluid>

    <PageBreadcrumb title="Staff" />

    <!-- Add Staff Button -->
    <v-row justify="end">
        <v-col cols="12" md="auto" class="d-flex justify-end">
            <!-- =========================================
    PREMIUM STAFF DIALOG
========================================= -->
            <v-dialog v-model="dialog" max-width="980" persistent transition="dialog-bottom-transition">

                <!-- ACTIVATOR -->
                <template #activator="{ props }">

                    <v-btn class="button-color my-5" prepend-icon="mdi-account-plus-outline" rounded="xl" elevation="0" height="50" v-bind="props">
                        Add Staff
                    </v-btn>

                </template>

                <!-- DIALOG CARD -->
                <v-card class="premium-dialog overflow-hidden" rounded="xl" elevation="0">

                    <!-- HEADER -->
                    <div class="dialog-header">

                        <!-- GLOW -->
                        <div class="header-glow"></div>

                        <div class="d-flex align-center justify-space-between flex-wrap position-relative">

                            <!-- LEFT -->
                            <div class="d-flex align-center">

                                <div class="dialog-icon">

                                    <v-icon size="34" color="white">
                                        {{ staff.id ? 'mdi-account-edit-outline' : 'mdi-account-plus-outline' }}
                                    </v-icon>

                                </div>

                                <div class="ml-5">

                                    <div class="dialog-title">
                                        {{ staff.id ? 'Edit Staff Member' : 'Create Staff Member' }}
                                    </div>

                                    <div class="dialog-subtitle">
                                        Manage employee profile, department and contact information
                                    </div>

                                </div>

                            </div>

                            <!-- RIGHT BADGE -->
                            <div class="dialog-badge mt-4 mt-md-0">

                                <v-icon size="18" class="mr-2">
                                    mdi-shield-check-outline
                                </v-icon>

                                Secure Staff Record

                            </div>

                        </div>

                    </div>

                    <!-- BODY -->
                    <div class="dialog-body">

                        <v-form>

                            <!-- SECTION TITLE -->
                            <div class="form-section-title mb-6">

                                <div class="section-line"></div>

                                <span>
                                    Staff Information
                                </span>

                            </div>

                            <!-- FORM -->
                            <v-row>

                                <!-- FIRST NAME -->
                                <v-col cols="12" md="4">

                                    <div class="premium-input-group">

                                        <label class="premium-label">
                                            First Name
                                        </label>

                                        <v-text-field v-model="staff.firstname" placeholder="Enter first name" variant="solo-filled" flat rounded="xl" hide-details class="premium-input" />

                                    </div>

                                </v-col>

                                <!-- MIDDLE NAME -->
                                <v-col cols="12" md="4">

                                    <div class="premium-input-group">

                                        <label class="premium-label">
                                            Middle Name
                                        </label>

                                        <v-text-field v-model="staff.middlename" placeholder="Enter middle name" variant="solo-filled" flat rounded="xl" hide-details class="premium-input" />

                                    </div>

                                </v-col>

                                <!-- LAST NAME -->
                                <v-col cols="12" md="4">

                                    <div class="premium-input-group">

                                        <label class="premium-label">
                                            Last Name
                                        </label>

                                        <v-text-field v-model="staff.lastname" placeholder="Enter last name" variant="solo-filled" flat rounded="xl" hide-details class="premium-input" />

                                    </div>

                                </v-col>

                                <!-- SECTION -->
                                <v-col cols="12" md="6">

                                    <div class="premium-input-group">

                                        <label class="premium-label">
                                            Department / Section
                                        </label>

                                        <div class="premium-dropdown-wrapper">

                                            <PaginatedDropdown api-endpoint="/sections" label="" placeholder="Select department" item-title="name" v-model="staff.section_id" />

                                        </div>

                                    </div>

                                </v-col>

                                <!-- POSITION -->
                                <v-col cols="12" md="6">

                                    <div class="premium-input-group">

                                        <label class="premium-label">
                                            Position
                                        </label>

                                        <v-text-field v-model="staff.position" placeholder="Enter position" variant="solo-filled" flat rounded="xl" hide-details class="premium-input" />

                                    </div>

                                </v-col>

                                <!-- EMAIL -->
                                <v-col cols="12" md="6">

                                    <div class="premium-input-group">

                                        <label class="premium-label">
                                            Email Address
                                        </label>

                                        <v-text-field v-model="staff.email" placeholder="Enter email address" variant="solo-filled" flat rounded="xl" hide-details prepend-inner-icon="mdi-email-outline" class="premium-input" />

                                    </div>

                                </v-col>

                                <!-- PHONE -->
                                <v-col cols="12" md="6">

                                    <div class="premium-input-group">

                                        <label class="premium-label">
                                            Phone Number
                                        </label>

                                        <v-text-field v-model="staff.phone" placeholder="Enter phone number" variant="solo-filled" flat rounded="xl" hide-details prepend-inner-icon="mdi-phone-outline" class="premium-input" />

                                    </div>

                                </v-col>

                            </v-row>

                        </v-form>

                    </div>

                    <!-- FOOTER -->
                    <div class="dialog-footer">

                        <v-btn variant="outlined" rounded="xl" height="48" class="px-8 cancel-dialog-btn" @click="closeDialog">
                            Cancel
                        </v-btn>

                        <v-btn rounded="xl" height="48" class="px-8 button-color ml-3" elevation="0" @click="saveItem">

                            <v-icon start size="18">
                                mdi-content-save-outline
                            </v-icon>

                            {{ staff.id ? 'Update Staff' : 'Save Staff' }}

                        </v-btn>

                    </div>

                </v-card>

            </v-dialog>

        </v-col>
    </v-row>

    <!-- Data Table -->
    <DataTable ref="staffTable" :api-url="'staff'" :headers="headers" title="Staff Management" subtitle="Manage all staff members and their departments">

        <template #actions="{ item }">
            <!-- =====================================================
    PREMIUM ACTION MENU
====================================================== -->
            <v-menu location="bottom end" transition="scale-transition" offset="12">

                <!-- ACTIVATOR -->
                <template #activator="{ props }">

                    <v-btn v-bind="props" icon size="42" elevation="0" class="premium-action-btn">

                        <v-icon size="20">
                            mdi-dots-horizontal
                        </v-icon>

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

                            <div class="menu-title">
                                Quick Actions
                            </div>

                            <div class="menu-subtitle">
                                Manage this record
                            </div>

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

                                    <div class="menu-item-title">
                                        Edit Staff
                                    </div>

                                    <div class="menu-item-subtitle">
                                        Update staff details
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
                                        Delete Staff
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

    <!-- ===============================
    PREMIUM DELETE DIALOG
================================ -->
    <DeleteDialog v-model="confirmDialogVisible" title="Delete Staff Member" subtitle="This action will permanently remove this staff member from the system." :item-name="`${itemToDelete.firstname} ${itemToDelete.lastname}`" :item-description="itemToDelete.position" button-text="Delete Staff" @confirm="deleteItem" />
</v-container>
</template>

<script>
import DataTable from '../../SharedComponents/dataTable.vue'
import PaginatedDropdown from '@/components/NIDC/SharedComponents/paginatedDropdown.vue'
import PageBreadcrumb from '@/components/NIDC/SharedComponents/PageBreadcrumb.vue'
import swtalert from '@/mixins/swtalert'

import axios from 'axios'
import DeleteDialog from '../../SharedComponents/DeleteDialog.vue'

export default {

    components: {
        DataTable,
        PaginatedDropdown,
        PageBreadcrumb,
        DeleteDialog
    },

    mixins: [swtalert],

    data() {
        return {

            dialog: false,

            confirmDialogVisible: false,

            itemToDelete: {},

            staff: {
                id: null,
                firstname: '',
                middlename: '',
                lastname: '',
                section_id: null,
                email: '',
                phone: '',
                position: ''
            },

            headers: [{
                    title: 'First Name',
                    value: 'firstname'
                },
                {
                    title: 'Middle Name',
                    value: 'middlename'
                },
                {
                    title: 'Last Name',
                    value: 'lastname'
                },
                {
                    title: 'Department',
                    value: 'section.name'
                },
                {
                    title: 'Email',
                    value: 'email'
                },
                {
                    title: 'Phone',
                    value: 'phone'
                },
                {
                    title: 'Position',
                    value: 'position'
                },
                {
                    title: 'Actions',
                    value: 'actions'
                }
            ]

        }
    },

    methods: {

        closeDialog() {

            this.dialog = false

            this.staff = {
                id: null,
                firstname: '',
                middlename: '',
                lastname: '',
                section_id: null,
                email: '',
                phone: '',
                position: ''
            }

        },

        refreshTable() {
            this.$refs.staffTable.fetchData()
        },

        saveItem() {

            const request = this.staff.id ?
                axios.put(`/staff/${this.staff.id}`, this.staff) :
                axios.post('/staff', this.staff)

            request
                .then((res) => {

                    this.showAlert(res.data.message, 'success')

                    this.closeDialog()

                    this.refreshTable()

                })
                .catch((err) => {

                    const msg =
                        err.response.data.message ||
                        'Error occurred'

                    this.showAlert(msg, 'error')

                })

        },

        editItem(item) {

            this.staff = {
                ...item
            }

            this.dialog = true

        },

     

        deleteItem() {

            axios.delete(`/staff/${this.itemToDelete.id}`)
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

}
</script>
