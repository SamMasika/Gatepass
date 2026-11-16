<template>
<v-container fluid class="px-6 py-4">
    <!-- BREADCRUMB -->
    <PageBreadcrumb title="Access Areas" />

    <!-- TOP ACTION -->
    <v-row justify="end" class="mb-5">
        <v-col cols="12" md="auto" class="d-flex justify-end">
            <v-dialog v-model="dialog" max-width="850" persistent transition="dialog-bottom-transition">
                <!-- ACTIVATOR -->
                <template #activator="{ props }">
                    <v-btn v-bind="props" class="primary-btn" rounded="xl" height="50" elevation="0" prepend-icon="mdi-shield-plus-outline">
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
                                        Configure secured zones available for visitor authorization.
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
                                    <label class="premium-label">Access Area Name</label>
                                    <v-text-field v-model="accessArea.name" variant="solo-filled" rounded="xl" flat hide-details prepend-inner-icon="mdi-map-marker-radius-outline" placeholder="Server Room" class=""/>
                                </div>
                            </v-col>

                            <v-col cols="12" md="6">
                                <div class="premium-input-group">
                                    <label class="premium-label">Area Code</label>
                                    <v-text-field v-model="accessArea.code" variant="solo-filled" rounded="xl" flat hide-details prepend-inner-icon="mdi-barcode" placeholder="SR-001" />
                                </div>
                            </v-col>

                            <v-col cols="12">
                                <div class="premium-input-group">
                                    <label class="premium-label">Description</label>
                                    <v-textarea v-model="accessArea.description" rows="3" variant="solo-filled" rounded="xl" flat hide-details placeholder="Describe the purpose and restrictions of this area..." />
                                </div>
                            </v-col>
                        </v-row>
                    </div>

                    <!-- FOOTER -->
                    <div class="dialog-footer">
                        <v-btn variant="outlined" rounded="xl" height="48" class="outline-btn" @click="closeDialog">
                            Cancel
                        </v-btn>

                        <v-btn class="primary-btn ml-3" rounded="xl" height="48" elevation="0" @click="saveItem">
                            <v-icon start>mdi-content-save-outline</v-icon>
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

    <!-- TABLE -->
    <DataTable ref="accessAreaTable" :api-url="'/access-areas'" :headers="headers" title="Access Area Management" subtitle="Manage secured locations and authorization zones within the National Internet Data Center">
        <template #actions="{ item }">
            <v-menu location="bottom end" transition="scale-transition" offset="12">
                <!-- ACTIVATOR -->
                <template #activator="{ props }">
                    <v-btn v-bind="props" icon size="42" elevation="0" class="premium-action-btn">
                        <v-icon size="20">mdi-dots-horizontal</v-icon>
                    </v-btn>
                </template>

                <!-- MENU CARD -->
                <v-card class="premium-menu-card" rounded="xl" elevation="0" min-width="240">
                    <!-- TOP -->
                    <div class="menu-top">
                        <div class="menu-top-icon">
                            <v-icon size="18" color="white">mdi-shield-outline</v-icon>
                        </div>
                        <div>
                            <div class="menu-title">Quick Actions</div>
                            <div class="menu-subtitle">Manage this access area</div>
                        </div>
                    </div>

                    <div class="menu-divider"></div>

                    <div class="menu-items">
                        <!-- EDIT -->
                        <div class="premium-menu-item" @click="editItem(item)">
                            <div class="menu-item-left">
                                <div class="menu-item-icon activities-bg">
                                    <v-icon size="18" color="#8B5CF6">mdi-pencil-outline</v-icon>
                                </div>
                                <div>
                                    <div class="menu-item-title">Edit Area</div>
                                    <div class="menu-item-subtitle">Update details</div>
                                </div>
                            </div>
                            <v-icon size="18" color="#94a3b8">mdi-chevron-right</v-icon>
                        </div>

                        <!-- DELETE -->
                        <div class="premium-menu-item" @click="deleteDialog(item)">
                            <div class="menu-item-left">
                                <div class="menu-item-icon view-bg">
                                    <v-icon size="18" color="#ef4444">mdi-delete-outline</v-icon>
                                </div>
                                <div>
                                    <div class="menu-item-title">Delete Area</div>
                                    <div class="menu-item-subtitle">Permanently remove</div>
                                </div>
                            </div>
                            <v-icon size="18" color="#94a3b8">mdi-chevron-right</v-icon>
                        </div>
                    </div>
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
                description: ''
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
                    this.showAlert(res.data.message, 'success')
                    this.closeDialog()
                    this.refreshTable()
                })
                .catch(err => {
                    this.showAlert(
                        err.response ?.data ?.message || 'Operation failed',
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
            axios
                .delete(`/access-areas/${this.itemToDelete.id}`)
                .then(res => {
                    this.showAlert(res.data.message, 'success')
                    this.confirmDialogVisible = false
                    this.refreshTable()
                })
        }
    }
}
</script>

<style scoped>
/* Premium Dialog */
.premium-dialog {
    background: var(--surface);
    border: 1px solid var(--border);
    overflow: hidden;
    box-shadow: var(--shadow-lg);
}

.dialog-header {
    padding: 28px 32px;
    background: linear-gradient(135deg, var(--brand), var(--brand-dark), #0f172a);
    color: white;
}

.dialog-icon {
    width: 64px;
    height: 64px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(8px);
}

.dialog-title {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.3px;
}

.dialog-subtitle {
    font-size: 13.5px;
    opacity: 0.85;
    margin-top: 4px;
    max-width: 420px;
}

.dialog-body {
    padding: 32px;
    background: var(--surface);
}

.dialog-footer {
    padding: 20px 32px;
    background: var(--surface-alt);
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: flex-end;
}

/* Input Groups */
.premium-input-group {
    margin-bottom: 8px;
}

.premium-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: 8px;
    letter-spacing: 0.2px;
}

/* Buttons */
.primary-btn {
    background: linear-gradient(135deg, var(--brand), var(--brand-dark)) !important;
    color: white !important;
    font-weight: 600;
    text-transform: none;
    letter-spacing: 0.3px;
    box-shadow: 0 6px 16px rgba(27, 134, 124, 0.25);
}

.primary-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 22px rgba(27, 134, 124, 0.35);
}

.outline-btn {
    border: 1px solid var(--border) !important;
    color: var(--text) !important;
    font-weight: 600;
    text-transform: none;
}

.outline-btn:hover {
    border-color: var(--brand) !important;
    color: var(--brand) !important;
}
</style>
