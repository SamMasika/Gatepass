<template>
<v-container fluid>

    <!-- =========================================
        BREADCRUMB
    ========================================== -->
    <PageBreadcrumb title="Visit Purpose" />

    <!-- =========================================
        TOP ACTIONS
    ========================================== -->
    <v-row justify="end">
        <v-col cols="12" md="auto" class="d-flex justify-end">

            <!-- =========================================
                PREMIUM VISIT PURPOSE DIALOG
            ========================================== -->
            <v-dialog v-model="dialog" max-width="760" persistent transition="dialog-bottom-transition">

                <!-- ACTIVATOR -->
                <template #activator="{ props }">

                    <v-btn class="button-color my-5" prepend-icon="mdi-briefcase-plus-outline" rounded="xl" elevation="0" height="50" v-bind="props">
                        Add Visit Purpose
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
                                            visitPurpose.id
                                                ? 'mdi-briefcase-edit-outline'
                                                : 'mdi-briefcase-plus-outline'
                                        }}
                                    </v-icon>

                                </div>

                                <div class="ml-5">

                                    <div class="dialog-title">
                                        {{
                                            visitPurpose.id
                                                ? 'Edit Visit Purpose'
                                                : 'Create Visit Purpose'
                                        }}
                                    </div>

                                    <div class="dialog-subtitle">
                                        Manage visitor purposes for gate pass system
                                    </div>

                                </div>

                            </div>

                            <div class="dialog-badge mt-4 mt-md-0">
                                <v-icon size="18" class="mr-2">
                                    mdi-shield-check-outline
                                </v-icon>
                                Secure Entry Setup
                            </div>

                        </div>

                    </div>

                    <!-- BODY -->
                    <div class="dialog-body">

                        <v-form>

                          
                            <v-row>

                                <v-col cols="12">

                                    <div class="premium-input-group">

                                        <label class="premium-label">
                                            Purpose Name
                                        </label>

                                        <v-text-field v-model="visitPurpose.name" placeholder="e.g. Meeting, Delivery, Interview" variant="solo-filled" flat rounded="xl" hide-details prepend-inner-icon="mdi-text-box-outline" class="premium-input" />

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

                            {{
                                visitPurpose.id
                                    ? 'Update Purpose'
                                    : 'Save Purpose'
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
    <DataTable ref="purposeTable" :api-url="'/visit-purposes'" :headers="headers" title="Visit Purpose Management" subtitle="Manage all visitor purposes for gate entry">

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
                            <div class="menu-subtitle">Manage this purpose</div>
                        </div>

                    </div>

                    <div class="menu-divider"></div>

                    <div class="menu-items">

                        <!-- EDIT -->
                        <div class="premium-menu-item" @click="editItem(item)">

                            <div class="menu-item-left">

                                <div class="menu-item-icon edit-bg">
                                    <v-icon size="18" color="#2563eb">mdi-pencil-outline</v-icon>
                                </div>

                                <div>
                                    <div class="menu-item-title">Edit</div>
                                    <div class="menu-item-subtitle">Update purpose</div>
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
        DELETE DIALOG (REUSABLE)
    ========================================== -->
    <DeleteDialog v-model="confirmDialogVisible" title="Delete Visit Purpose" subtitle="This action will permanently remove this visit purpose." :item-name="itemToDelete.name" item-description="Gate Pass Purpose" button-text="Delete" @confirm="deleteItem" />

</v-container>
</template>

<script>
import axios from 'axios'
import swtalert from '@/mixins/swtalert'

import DataTable from '../SharedComponents/dataTable.vue'
import DeleteDialog from '../SharedComponents/DeleteDialog.vue'
import PageBreadcrumb from '@/components/NIDC/SharedComponents/PageBreadcrumb.vue'

export default {

    components: {
        DataTable,
        DeleteDialog,
        PageBreadcrumb
    },

    mixins: [swtalert],

    data() {
        return {

            dialog: false,
            confirmDialogVisible: false,

            itemToDelete: {},

            visitPurpose: {
                id: null,
                name: ''
            },

            headers: [{
                    title: 'Purpose Name',
                    value: 'name'
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
            this.visitPurpose = {
                id: null,
                name: ''
            }
        },

        refreshTable() {
            this.$refs.purposeTable.fetchData()
        },

        saveItem() {

            const request = this.visitPurpose.id ?
                axios.put(`/visit-purposes/${this.visitPurpose.id}`, this.visitPurpose) :
                axios.post('/visit-purposes', this.visitPurpose)

            request
                .then(res => {
                    this.showAlert(res.data.message, 'success')
                    this.closeDialog()
                    this.refreshTable()
                })
                .catch(err => {
                    this.closeDialog()
                    this.showAlert(err.response.data.message || 'Error occurred', 'error')
                })

        },

        editItem(item) {
            this.visitPurpose = {
                ...item
            }
            this.dialog = true
        },

        deleteDialog(item) {
            this.itemToDelete = item
            this.confirmDialogVisible = true
        },

        deleteItem() {

            axios.delete(`/visit-purposes/${this.itemToDelete.id}`)
                .then(res => {
                    this.showAlert(res.data.message, 'success')
                    this.confirmDialogVisible = false
                    this.refreshTable()
                })
                .catch(err => {
                    this.confirmDialogVisible = false
                    this.showAlert(err.response.data.message || 'Delete failed', 'error')
                })

        }

    }

}
</script>
