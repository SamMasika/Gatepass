<template>
<v-container fluid>

    <!-- =========================================
        BREADCRUMB
    ========================================== -->
    <PageBreadcrumb title="Sections" />

    <!-- =========================================
        TOP ACTIONS
    ========================================== -->
    <v-row justify="end">

        <v-col cols="12" md="auto" class="d-flex justify-end">

            <!-- =========================================
                PREMIUM SECTION DIALOG
            ========================================== -->
            <v-dialog v-model="dialog" max-width="760" persistent transition="dialog-bottom-transition">

                <!-- ACTIVATOR -->
                <template #activator="{ props }">

                    <v-btn class="button-color my-5" prepend-icon="mdi-folder-plus-outline" rounded="xl" elevation="0" height="50" v-bind="props">
                        Add Section
                    </v-btn>

                </template>

                <!-- DIALOG -->
                <v-card class="premium-dialog overflow-hidden" rounded="xl" elevation="0">

                    <!-- HEADER -->
                    <div class="dialog-header">

                        <div class="header-glow"></div>

                        <div class="d-flex align-center justify-space-between flex-wrap position-relative">

                            <!-- LEFT -->
                            <div class="d-flex align-center">

                                <!-- ICON -->
                                <div class="dialog-icon">

                                    <v-icon size="34" color="white">
                                        {{
                                            section.id
                                                ? 'mdi-folder-edit-outline'
                                                : 'mdi-folder-plus-outline'
                                        }}
                                    </v-icon>

                                </div>

                                <!-- TEXT -->
                                <div class="ml-5">

                                    <div class="dialog-title">

                                        {{
                                            section.id
                                                ? 'Edit Section'
                                                : 'Create Section'
                                        }}

                                    </div>

                                    <div class="dialog-subtitle">
                                        Manage system departments and sections professionally
                                    </div>

                                </div>

                            </div>

                            <!-- BADGE -->
                            <div class="dialog-badge mt-4 mt-md-0">

                                <v-icon size="18" class="mr-2">
                                    mdi-shield-check-outline
                                </v-icon>

                                Secure Configuration

                            </div>

                        </div>

                    </div>

                    <!-- BODY -->
                    <div class="dialog-body">

                        <v-form>

                            <!-- TITLE -->
                            <div class="form-title mb-6">

                                <div class="line"></div>

                                <span>
                                    Section Information
                                </span>

                            </div>

                            <!-- FORM -->
                            <v-row>

                                <v-col cols="12">

                                    <div class="premium-input-group">

                                        <label class="premium-label">
                                            Section Name
                                        </label>

                                        <v-text-field v-model="section.name" placeholder="Enter section name" variant="solo-filled" flat rounded="xl" hide-details prepend-inner-icon="mdi-folder-outline" class="premium-input" />

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
                                section.id
                                    ? 'Update Section'
                                    : 'Save Section'
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
    <DataTable ref="sectionTable" :api-url="'sections'" :headers="headers" title="Section Management" subtitle="Manage all organization sections and departments">

        <!-- ACTIONS -->
        <template #actions="{ item }">

            <!-- =========================================
                PREMIUM ACTION MENU
            ========================================== -->
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
                                Manage this section
                            </div>

                        </div>

                    </div>

                    <!-- DIVIDER -->
                    <div class="menu-divider"></div>

                    <!-- ITEMS -->
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
                                        Edit Section
                                    </div>

                                    <div class="menu-item-subtitle">
                                        Update section details
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
                                        Delete Section
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

    <!-- =========================================
        DELETE DIALOG
    ========================================== -->
    <DeleteDialog v-model="confirmDialogVisible" title="Delete Section" subtitle="This action will permanently remove this section from the system." :item-name="itemToDelete.name" item-description="Organization Section" button-text="Delete Section" @confirm="deleteItem" />

</v-container>
</template>

<script>
import axios from 'axios'

import swtalert from '@/mixins/swtalert'
import DataTable from '../../SharedComponents/dataTable.vue'
import DeleteDialog from '../../SharedComponents/DeleteDialog.vue'
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

            section: {
                id: null,
                name: ''
            },

            headers: [{
                    title: 'Section Name',
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

        /* =========================================
            CLOSE DIALOG
        ========================================== */
        closeDialog() {

            this.dialog = false

            this.section = {
                id: null,
                name: ''
            }

        },

        /* =========================================
            REFRESH TABLE
        ========================================== */
        refreshTable() {

            this.$refs.sectionTable.fetchData()

        },

        /* =========================================
            SAVE ITEM
        ========================================== */
        saveItem() {

            const request =
                this.section.id ?
                axios.put(`/sections/${this.section.id}`, this.section) :
                axios.post('/sections', this.section)

            request
                .then((res) => {

                    this.showAlert(
                        res.data.message,
                        'success'
                    )

                    this.closeDialog()

                    this.refreshTable()

                })
                .catch((err) => {

                    const msg =
                        err ?.response ?.data ?.message ||
                        'Error occurred'

                    this.showAlert(msg, 'error')

                })

        },

        /* =========================================
            EDIT ITEM
        ========================================== */
        editItem(item) {

            this.section = {
                ...item
            }

            this.dialog = true

        },

        /* =========================================
            DELETE DIALOG
        ========================================== */
        deleteDialog(item) {

            this.itemToDelete = item

            this.confirmDialogVisible = true

        },

        /* =========================================
            DELETE ITEM
        ========================================== */
        deleteItem() {

            axios.delete(`/sections/${this.itemToDelete.id}`)
                .then((response) => {

                    const message =
                        response ?.data ?.message ||
                        'Deleted successfully'

                    this.confirmDialogVisible = false

                    this.showAlert(message, 'success')

                    this.refreshTable()

                })
                .catch((error) => {

                    const msg =
                        error ?.response ?.data ?.message ||
                        'Delete failed'

                    this.showAlert(msg, 'error')

                })

        }

    }

}
</script>
