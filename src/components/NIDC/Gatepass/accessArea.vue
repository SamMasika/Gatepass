<template>
<v-container fluid class="px-6 py-4">


    <!-- =======================================
     BREADCRUMB
======================================== -->
    <PageBreadcrumb title="Access Areas" />

    <!-- =======================================
     TOP ACTION
======================================== -->
    <v-row justify="end" class="mb-5">

        <v-col cols="12" md="auto" class="d-flex justify-end">

            <v-dialog v-model="dialog" max-width="850" persistent transition="dialog-bottom-transition">

                <!-- ACTIVATOR -->
                <template #activator="{ props }">

                    <v-btn v-bind="props" class="button-color" rounded="xl" height="50" elevation="0" prepend-icon="mdi-shield-plus-outline">
                        Add Access Area
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
                                        {{
                                        accessArea.id
                                            ? 'mdi-shield-edit-outline'
                                            : 'mdi-shield-plus-outline'
                                    }}
                                    </v-icon>

                                </div>

                                <div class="ml-5">

                                    <div class="dialog-title">

                                        {{
                                        accessArea.id
                                            ? 'Edit Access Area'
                                            : 'Create Access Area'
                                    }}

                                    </div>

                                    <div class="dialog-subtitle">
                                        Configure secured zones available
                                        for visitor authorization.
                                    </div>

                                </div>

                            </div>

                            <v-chip color="white" variant="flat" class="font-weight-medium">
                                Security Configuration
                            </v-chip>

                        </div>

                    </div>

                    <!-- BODY -->
                    <div class="dialog-body">

                        <v-row>

                            <v-col cols="12" md="6">

                                <div class="premium-input-group">

                                    <label class="premium-label">
                                        Access Area Name
                                    </label>

                                    <v-text-field v-model="accessArea.name" variant="solo-filled" rounded="xl" flat hide-details prepend-inner-icon="mdi-map-marker-radius-outline" placeholder="Server Room" />

                                </div>

                            </v-col>

                            <v-col cols="12" md="6">

                                <div class="premium-input-group">

                                    <label class="premium-label">
                                        Area Code
                                    </label>

                                    <v-text-field v-model="accessArea.code" variant="solo-filled" rounded="xl" flat hide-details prepend-inner-icon="mdi-barcode" placeholder="SR-001" />

                                </div>

                            </v-col>

                            <v-col cols="12">

                                <div class="premium-input-group">

                                    <label class="premium-label">
                                        Description
                                    </label>

                                    <v-textarea v-model="accessArea.description" rows="3" variant="solo-filled" rounded="xl" flat hide-details placeholder="Describe the purpose and restrictions of this area..." />

                                </div>

                            </v-col>


                        </v-row>

                    </div>

                    <!-- FOOTER -->
                    <div class="dialog-footer">

                        <v-btn variant="outlined" rounded="xl" height="48" @click="closeDialog">
                            Cancel
                        </v-btn>

                        <v-btn class="button-color ml-3" rounded="xl" height="48" elevation="0" @click="saveItem">

                            <v-icon start>
                                mdi-content-save-outline
                            </v-icon>

                            {{
                            accessArea.id
                                ? 'Update Access Area'
                                : 'Save Access Area'
                        }}

                        </v-btn>

                    </div>

                </v-card>

            </v-dialog>

        </v-col>

    </v-row>

    <!-- =======================================
     TABLE
======================================== -->

    <DataTable ref="accessAreaTable" :api-url="'/access-areas'" :headers="headers" title="Access Area Management" subtitle="Manage secured locations and authorization zones within the National Internet Data Center">

        <template #actions="{ item }">

            <v-menu location="bottom end">

                <template #activator="{ props }">

                    <v-btn icon size="40" elevation="0" class="premium-action-btn" v-bind="props">
                        <v-icon>
                            mdi-dots-horizontal
                        </v-icon>
                    </v-btn>

                </template>

                <v-card rounded="xl" elevation="0" min-width="220">

                    <v-list>

                        <v-list-item prepend-icon="mdi-pencil-outline" title="Edit Area" @click="editItem(item)" />

                        <v-divider />

                        <v-list-item prepend-icon="mdi-delete-outline" title="Delete Area" @click="deleteDialog(item)" />

                    </v-list>

                </v-card>

            </v-menu>

        </template>

    </DataTable>

    <!-- DELETE -->
    <DeleteDialog v-model="confirmDialogVisible" title="Delete Access Area" subtitle="This action will permanently remove the selected access area." :item-name="itemToDelete.name" item-description="Access Area" button-text="Delete" @confirm="deleteItem" />
    

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

            accessArea: {
                id: null,
                name: '',
                code: '',
                description: '',
                level: ''
            },

            headers: [{
                    title: 'Area Name',
                    value: 'name'
                },
                {
                    title: 'Area Code',
                    value: 'code'
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

            this.accessArea = {
                id: null,
                name: '',
                code: '',
                description: '',
            }

        },

        refreshTable() {
            this.$refs.accessAreaTable.fetchData()
        },

        saveItem() {

            const request = this.accessArea.id ?
                axios.put(`/access-areas/${this.accessArea.id}`, this.accessArea) :
                axios.post('/access-areas', this.accessArea)

            request
                .then(res => {

                    this.showAlert(
                        res.data.message,
                        'success'
                    )

                    this.closeDialog()
                    this.refreshTable()

                })
                .catch(err => {

                    this.showAlert(
                        err.response ?.data ?.message ||
                        'Operation failed',
                        'error'
                    )

                })

        },

        editItem(item) {

            this.accessArea = {
                ...item
            }

            this.dialog = true

        },

        deleteDialog(item) {

            this.itemToDelete = item
            this.confirmDialogVisible = true

        },

        deleteItem() {

            axios.delete(
                    `/access-areas/${this.itemToDelete.id}`
                )
                .then(res => {

                    this.showAlert(
                        res.data.message,
                        'success'
                    )

                    this.confirmDialogVisible = false
                    this.refreshTable()

                })

        }

    }

}
</script>
