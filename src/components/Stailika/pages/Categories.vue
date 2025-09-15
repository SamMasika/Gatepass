<template>
<v-container fluid>
    <!-- Header -->
    <v-row>
        <v-col>
            <h2 class="page-title">Categories</h2>
            <p class="page-subtitle">Manage all product categories</p>
        </v-col>
    </v-row>

    <v-card>
        <!-- Search and Add -->
        <v-card-title>
            <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Search Categories" single-line hide-details variant="outlined" density="compact" class="search-field mt-4" />
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-btn text rounded color="#020B2C" class="text-none" @click="openDialog">
                <v-icon left>mdi-plus</v-icon> Add Category
            </v-btn>
        </v-card-title>

        <!-- Table -->
        <v-card-text>
            <v-data-table :headers="headers" :items="categories" :search="search">
                <template v-slot:[`item.status`]="{ item }">
                    <v-chip :color="getStatusColor(item.status)" variant="tonal" size="small">
                        {{ formatStatus(item.status) }}
                    </v-chip>
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                    <v-menu transition="scale-transition" offset-y min-width="220" close-on-content-click>
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" icon rounded class="circle-btn text-none" color="#020B2C">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-card class="elevation-4 rounded-lg">
                            <v-list dense nav>
                                <v-list-item @click="openViewDialog(item)">
                                    <v-list-item-icon>
                                        <v-icon small>mdi-eye</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>View</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="openConfirmDialog(item)">
                                    <v-list-item-icon>
                                        <v-icon small>
                                            {{ item.status === 'published' ? 'mdi-cancel' : 'mdi-check-circle' }}
                                        </v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>
                                        {{ item.status === 'published' ? 'Unpublish' : 'Publish' }}
                                    </v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-card>
                    </v-menu>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>

    <!-- Add Category Dialog -->
    <v-dialog v-model="addDialog" max-width="800px">
        <v-card>
            <v-card-title>Add New Category</v-card-title>
            <v-card-text>
                <v-text-field v-model="newCategory.name" label="Category Name" density="comfortable" variant="outlined"></v-text-field>
                <v-text-field v-model="newCategory.slug" label="Category Name" density="comfortable" variant="outlined"></v-text-field>
                <!-- <v-select v-model="newCategory.status" :items="['published','pending']" label="Status"  density="comfortable" variant="outlined"></v-select> -->
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey" text @click="addDialog=false">Cancel</v-btn>
                <v-btn color="#020B2C" text @click="addCategory">Add</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- View Dialog -->
    <v-dialog v-model="viewDialog" max-width="520px">
        <v-card>
            <v-card-title>Category Details</v-card-title>
            <v-card-text v-if="selectedItem">
                <strong>Name:</strong> {{ selectedItem.name }} <br />
                <strong>Status:</strong>
                <v-chip :color="getStatusColor(selectedItem.status)">{{ formatStatus(selectedItem.status) }}</v-chip>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#020B2C" text @click="viewDialog=false">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- Confirm Publish/Unpublish Dialog -->
    <v-dialog v-model="confirmDialog" max-width="420px" persistent>
        <v-card>
            <v-card-title>Confirmation</v-card-title>
            <v-card-text class="text-center">
                Are you sure you want to
                <strong>{{ selectedItem?.status === 'published' ? 'Unpublish' : 'Publish' }}</strong> this category?
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey" text @click="confirmDialog=false">Cancel</v-btn>
                <v-btn :color="selectedItem?.status === 'published' ? 'error' : 'success'" text @click="confirmPublish">Yes</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</v-container>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            search: '',
            categories: [],
            headers: [{
                    title: 'Name',
                    value: 'name'
                },
                {
                    title: 'Status',
                    value: 'status'
                },
                {
                    title: 'Actions',
                    value: 'actions',
                    sortable: false
                }
            ],
            viewDialog: false,
            confirmDialog: false,
            addDialog: false,
            selectedItem: null,
            newCategory: {
                name: '',
                status: 'published'
            }
        }
    },
    methods: {
        fetchCategories() {
            axios.get('/categories').then(res => {
                this.categories = res.data.data;
            });
        },
        openDialog() {
            this.newCategory = {
                name: '',
                status: 'published'
            };
            this.addDialog = true;
        },
        addCategory() {
            axios.post('/categories', this.newCategory)
                .then(res => {
                    this.categories.push(res.data.data);
                    this.addDialog = false;
                })
                .catch(err => console.error(err));
        },
        openViewDialog(item) {
            this.selectedItem = item;
            this.viewDialog = true;
        },
        openConfirmDialog(item) {
            this.selectedItem = item;
            this.confirmDialog = true;
        },
        confirmPublish() {
            axios.post(`/categories/${this.selectedItem.id}/toggle-status`)
                .then(res => {
                    this.selectedItem.status = res.data.status;
                })
                .finally(() => {
                    this.confirmDialog = false;
                });
        },
        getStatusColor(status) {
            if (status === 'published') return 'green';
            if (status === 'pending') return 'orange';
            return 'grey';
        },
        formatStatus(status) {
            return status.charAt(0).toUpperCase() + status.slice(1);
        }
    },
    mounted() {
        this.fetchCategories();
    }
}
</script>

<style scoped>
.page-title {
    font-weight: bold;
    font-size: 1.6rem;
}

.page-subtitle {
    color: #555;
    margin-bottom: 1rem;
}

.search-field {
    max-width: 250px;
}

.circle-btn {
    border-radius: 50%;
    padding: 4px;
    min-width: 36px;
    min-height: 36px;
}

.text-none {
    text-transform: none;
}
</style>
