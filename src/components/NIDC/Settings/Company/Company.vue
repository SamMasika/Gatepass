<template>
<v-container fluid>

    <!-- =========================================
        BREADCRUMB
    ========================================== -->
    <PageBreadcrumb title="Companies / Visitor Sources" />

    <!-- =========================================
        TOP ACTION
    ========================================== -->
    <v-row justify="end">
        <v-col cols="12" md="auto" class="d-flex justify-end">

            <!-- =========================================
                PREMIUM COMPANY DIALOG
            ========================================== -->
            <v-dialog v-model="dialog" max-width="760" persistent transition="dialog-bottom-transition">

                <!-- ACTIVATOR -->
                <template #activator="{ props }">

                    <v-btn class="button-color my-5" prepend-icon="mdi-domain" rounded="xl" elevation="0" height="50" v-bind="props">
                        Add Company / Source
                    </v-btn>

                </template>

                <!-- DIALOG -->
                <v-card class="premium-dialog overflow-hidden" rounded="xl" elevation="0">

                    <!-- HEADER -->
                    <div class="dialog-header">

                        <div class="header-glow"></div>

                        <div class="d-flex align-center justify-space-between flex-wrap position-relative">

                            <div class="d-flex align-center">

                                <div class="dialog-icon">

                                    <v-icon size="34" color="white">
                                        {{
                                            company.id
                                                ? 'mdi-domain'
                                                : 'mdi-domain'
                                        }}
                                    </v-icon>

                                </div>

                                <div class="ml-5">

                                    <div class="dialog-title">
                                        {{
                                            company.id
                                                ? 'Edit Company / Source'
                                                : 'Create Company / Visitor Source'
                                        }}
                                    </div>

                                    <div class="dialog-subtitle">
                                        Manage visitor origin companies or organizations
                                    </div>

                                </div>

                            </div>

                            <div class="dialog-badge mt-4 mt-md-0">

                                <v-icon size="18" class="mr-2">
                                    mdi-map-marker-radius-outline
                                </v-icon>

                                Visitor Tracking

                            </div>

                        </div>

                    </div>

                    <!-- BODY -->
                    <div class="dialog-body">

                        <v-form>

                            <v-row>

                                <!-- NAME -->
                                <v-col cols="12">

                                    <div class="premium-input-group">

                                        <label class="premium-label">
                                            Company / Visitor Source Name
                                        </label>

                                        <v-text-field v-model="company.name" placeholder="e.g. NIDC, Ministry, Private Company, NGO" variant="solo-filled" flat rounded="xl" hide-details prepend-inner-icon="mdi-domain" class="premium-input" />

                                    </div>

                                </v-col>

                                <!-- EMAIL -->
                                <v-col cols="12" md="6">

                                    <div class="premium-input-group">

                                        <label class="premium-label">
                                            Email
                                        </label>

                                        <v-text-field v-model="company.email" placeholder="Enter email" variant="solo-filled" flat rounded="xl" hide-details prepend-inner-icon="mdi-email-outline" class="premium-input" />

                                    </div>

                                </v-col>

                                <!-- PHONE -->
                                <v-col cols="12" md="6">

                                    <div class="premium-input-group">

                                        <label class="premium-label">
                                            Phone
                                        </label>

                                        <v-text-field v-model="company.phone" placeholder="Enter phone number" variant="solo-filled" flat rounded="xl" hide-details prepend-inner-icon="mdi-phone-outline" class="premium-input" />

                                    </div>

                                </v-col>

                                <!-- ADDRESS -->
                                <v-col cols="12">

                                    <div class="premium-input-group">

                                        <label class="premium-label">
                                            Address / Location
                                        </label>

                                        <v-textarea v-model="company.address" placeholder="Enter company address or visitor origin location" variant="solo-filled" flat rounded="xl" rows="3" hide-details prepend-inner-icon="mdi-map-marker-outline" class="premium-input" />

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

                        <v-btn rounded="xl" height="48" class="px-8 button-color ml-3" elevation="0" @click="saveCompany">

                            <v-icon start size="18">
                                mdi-content-save-outline
                            </v-icon>

                            {{
                                company.id
                                    ? 'Update Company'
                                    : 'Save Company'
                            }}

                        </v-btn>

                    </div>

                </v-card>

            </v-dialog>

        </v-col>
    </v-row>

    <!-- =========================================
        DATA TABLE
    ========================================== -->

    <DataTable ref="companyTable" :api-url="'companies'" :headers="headers" title="Companies / Visitor Sources" subtitle="Manage where visitors come from (companies, organizations, institutions)">

        <!-- ACTIONS -->
        <template #actions="{ item }">

            <v-menu location="bottom end" transition="scale-transition" offset="12">

                <template #activator="{ props }">

                    <v-btn v-bind="props" icon size="42" elevation="0" class="premium-action-btn">
                        <v-icon size="20">mdi-dots-horizontal</v-icon>
                    </v-btn>

                </template>

                <v-card class="premium-menu-card" rounded="xl" elevation="0" min-width="220">

                    <div class="menu-top">

                        <div class="menu-top-icon">
                            <v-icon size="18" color="white">
                                mdi-lightning-bolt-outline
                            </v-icon>
                        </div>

                        <div>
                            <div class="menu-title">Quick Actions</div>
                            <div class="menu-subtitle">Manage company</div>
                        </div>

                    </div>

                    <div class="menu-divider"></div>

                    <div class="menu-items">

                        <!-- EDIT -->
                        <div class="premium-menu-item" @click="editCompany(item)">

                            <div class="menu-item-left">

                                <div class="menu-item-icon edit-bg">
                                    <v-icon size="18" color="#2563eb">mdi-pencil-outline</v-icon>
                                </div>

                                <div>
                                    <div class="menu-item-title">Edit</div>
                                    <div class="menu-item-subtitle">Update details</div>
                                </div>

                            </div>

                            <v-icon size="18" color="#94a3b8">mdi-chevron-right</v-icon>

                        </div>

                        <!-- DELETE -->
                        <div class="premium-menu-item delete-item" @click="deleteDialog(item)">

                            <div class="menu-item-left">

                                <div class="menu-item-icon delete-bg">
                                    <v-icon size="18" color="#ef4444">mdi-delete-outline</v-icon>
                                </div>
                                <div>
                                    <div class="menu-item-title">Delete</div>
                                    <div class="menu-item-subtitle">Remove permanently</div>
                                </div>
                            </div>

                            <v-icon size="18" color="#94a3b8">mdi-chevron-right</v-icon>

                        </div>

                    </div>

                </v-card>

            </v-menu>

        </template>

    </DataTable>

    <!-- =========================================
        DELETE DIALOG
    ========================================== -->
    <DeleteDialog v-model="confirmDialogVisible" title="Delete Company" subtitle="This action will permanently remove this company from the system." :item-name="itemToDelete.name" item-description="Organization Section" button-text="Delete Company" @confirm="deleteItem" />

</v-container>
</template>

<script>
import axios from 'axios'
import swtalert from '@/mixins/swtalert'

import DataTable from '@/components/NIDC/SharedComponents/dataTable.vue'
import PageBreadcrumb from '@/components/NIDC/SharedComponents/PageBreadcrumb.vue'
import DeleteDialog from '@/components/NIDC/SharedComponents/DeleteDialog.vue'

export default {

    components: {
        DataTable,
        PageBreadcrumb,
        DeleteDialog

    },

    mixins: [swtalert],

    data() {

        return {

            dialog: false,
            confirmDialogVisible: false,

            itemToDelete: {},

            company: {
                id: null,
                name: '',
                email: '',
                phone: '',
                address: ''
            },

            headers: [{
                    title: 'Name',
                    value: 'name'
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
                    title: 'Address',
                    value: 'address'
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
            this.company = {
                id: null,
                name: '',
                email: '',
                phone: '',
                address: ''
            }
        },

        refreshTable() {
            this.$refs.companyTable.fetchData()
        },

        saveCompany() {

            const request = this.company.id ?
                axios.put(`/companies/${this.company.id}`, this.company) :
                axios.post('/companies', this.company)

            request
                .then(res => {
                    this.showAlert(res.data.message, 'success')
                    this.closeDialog()
                    this.refreshTable()
                })
                .catch(err => {
                    this.showAlert(err.response.data.message || 'Error occurred', 'error')
                })

        },

        editCompany(item) {
            this.company = {
                ...item
            }
            this.dialog = true
        },
        deleteDialog(item) {
            this.itemToDelete = item
            this.confirmDialogVisible = true
        },
        deleteItem() {

            axios.delete(`/companies/${this.itemToDelete.id}`)
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
