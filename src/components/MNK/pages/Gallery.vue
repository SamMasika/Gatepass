<template>
<v-container fluid>
    <!-- Breadcrumbs -->
    <nav class="custom-breadcrumbs mb-6">
        <span class="breadcrumb-item" @click="$router.push('/dashboard')">Dashboard</span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active">Gallery</span>
    </nav>

    <!-- Header -->
    <v-row class="align-center mb-4">
        <v-col>
            <h2 class="page-title">Gallery</h2>
            <p class="page-subtitle">Manage and view all gallery contents</p>
        </v-col>
        <v-col class="text-right">
            <v-btn color="#2e7d32" dark rounded @click="openAddDialog" class="text-none elevation-0">
                <v-icon left>mdi-plus</v-icon>
                Add Image
            </v-btn>
        </v-col>
    </v-row>

    <!-- Gallery Table -->
    <v-card class="rounded-lg">
        <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Search gallery..." single-line hide-details variant="outlined" density="compact" class="search-field" />
        </v-card-title>

        <v-card-text>
            <v-data-table :headers="tableHeaders" :items="galleryItems" :search="search" dense :loading="loading" loading-text="Loading gallery...">
                <!-- Image Preview -->
                <template v-slot:[`item.image`]="{ item }">
                    <v-avatar size="80">
                        <v-img :src="getImageUrl(item.image)" cover />
                    </v-avatar>
                </template>
                <!-- Status -->
                <template v-slot:[`item.status`]="{ item }">
                    <v-chip :color="getStatusColor(item.status)" variant="tonal" size="small">
                        {{ formatStatus(item.status) }}
                    </v-chip>
                </template>
                <!-- Actions -->
                <template v-slot:[`item.actions`]="{ item }">
                    <v-menu transition="scale-transition" offset-y min-width="220" close-on-content-click>
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" icon rounded flat>
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-card class="elevation-4 rounded-lg">
                            <v-list dense nav>
                                <v-list-item @click="openViewDialog(item)" class="action-item">
                                    <v-list-item-icon>
                                        <v-icon small>mdi-eye</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>View</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="openEditDialog(item)" class="action-item">
                                    <v-list-item-icon>
                                        <v-icon small>mdi-pencil</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>Edit</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="openPublishDialog(item)" class="action-item">
                                    <v-list-item-icon>
                                        <v-icon small>
                                            {{ item.status === 'published' ? 'mdi-cancel' : 'mdi-check-circle' }}
                                        </v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>
                                        {{ item.status === 'published' ? 'Unpublish' : 'Publish' }}
                                    </v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="deleteDialog(item)" class="action-item">
                                    <v-list-item-icon>
                                        <v-icon small>mdi-delete</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>Delete</v-list-item-title>
                                </v-list-item>

                            </v-list>
                        </v-card>
                    </v-menu>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>

    <!-- View Dialog -->
    <v-dialog v-model="viewDialog" max-width="700px">
        <v-card>
            <v-img :src="getImageUrl(selectedItem.image)" height="400px" cover></v-img>
            <v-card-text>
                <h3>{{ selectedItem.title }}</h3>
                <p>{{ selectedItem.description }}</p>
                <p><strong>Date:</strong> {{ selectedItem.date }}</p>
                <p><strong>Status:</strong>
                    <v-chip :color="getStatusColor(selectedItem.status)" variant="tonal" size="small">
                        {{ formatStatus(selectedItem.status) }}
                    </v-chip>
                </p>
            </v-card-text>
            <v-card-actions class="justify-end">
                <v-btn color="green" rounded @click="viewDialog = false">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="addEditDialog" max-width="900px">
        <v-card>
            <v-card-title>{{ isEditing ? 'Edit Gallery Image' : 'Add Gallery Image' }}</v-card-title>
            <v-divider></v-divider>

            <v-card-text>
                <v-form @submit.prevent="submitItem">
                    <v-text-field v-model="currentItem.title" label="Title" density="comfortable" variant="outlined" required />
                    <v-textarea v-model="currentItem.description" label="Description" rows="3" density="comfortable" variant="outlined" />
                    <v-text-field v-model="currentItem.date" type="date" label="Date" density="comfortable" variant="outlined" />
                    <v-file-input v-model="currentItem.image" label="Image" accept="image/*" prepend-icon="mdi-camera" show-size variant="outlined" density="comfortable" />
                </v-form>
            </v-card-text>

            <v-card-actions class="justify-end">
                <v-btn text rounded @click="closeAddEditDialog">Cancel</v-btn>
                <v-btn color="#2e7d32" rounded @click="submitItem">{{ isEditing ? 'Update' : 'Add' }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- Publish/Unpublish Dialog -->
    <v-dialog v-model="publishDialog" max-width="420px">
        <v-card class="rounded-xl elevation-6">
            <v-card-title class="text-green">{{ publishAction }} Confirmation</v-card-title>
            <v-card-text class="text-center">
                <v-icon size="60" color="green">mdi-flag</v-icon>
                <p>Are you sure you want to {{ publishAction.toLowerCase() }} <strong>{{ itemToPublish.title }}</strong>?</p>
            </v-card-text>
            <v-card-actions class="justify-end">
                <v-btn text @click="publishDialog = false">Cancel</v-btn>
                <v-btn color="green" @click="confirmPublish">{{ publishAction }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- Delete Dialog -->
    <v-dialog v-model="confirmDeleteDialog" max-width="420px">
        <v-card class="rounded-xl elevation-6">
            <v-card-title class="text-error">Delete Confirmation</v-card-title>
            <v-card-text class="text-center">
                <v-icon size="60" color="error">mdi-delete-alert</v-icon>
                <p>Are you sure you want to delete <strong>{{ itemToDelete.title }}</strong>?</p>
            </v-card-text>
            <v-card-actions class="justify-end">
                <v-btn text @click="confirmDeleteDialog = false">Cancel</v-btn>
                <v-btn color="error" @click="deleteItem">Yes, Delete</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</v-container>
</template>

<script>
import axios from "axios";
import swtalert from "@/mixins/swtalert";
import getColorImage from "@/mixins/getColorImage";

export default {
    mixins: [swtalert, getColorImage],
    data() {
        return {
            search: "",
            loading: false,
            viewDialog: false,
            addEditDialog: false,
            publishDialog: false,
            confirmDeleteDialog: false,
            galleryItems: [],
            currentItem: {},
            selectedItem: {},
            itemToDelete: {},
            itemToPublish: {},
            isEditing: false,
            publishAction: "Publish",
            tableHeaders: [{
                    title: "Image",
                    value: "image"
                },
                {
                    title: "Title",
                    value: "title"
                },

                {
                    title: "Status",
                    value: "status"
                },
                {
                    title: "Actions",
                    value: "actions",
                    sortable: false
                },
            ],
        };
    },
    methods: {
        getImageUrl(imagePath) {
            return this.$getImageUrl(imagePath);
        },
        openViewDialog(item) {
            this.selectedItem = item;
            this.viewDialog = true;
        },
        openAddDialog() {
            this.isEditing = false;
            this.currentItem = {};
            this.addEditDialog = true;
        },
        openEditDialog(item) {
            this.isEditing = true;
            this.currentItem = {
                ...item,
                image: null
            };
            this.addEditDialog = true;
        },
        closeAddEditDialog() {
            this.addEditDialog = false;
            this.currentItem = {};
        },
        openPublishDialog(item) {
            this.itemToPublish = item;
            this.publishAction = item.status === "published" ? "Unpublish" : "Publish";
            this.publishDialog = true;
        },
        confirmPublish() {
            if (!this.itemToPublish) return;

            axios.post(`/gallery/${this.itemToPublish.id}/toggle`, {}, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                })
                .then((response) => {
                    this.itemToPublish.status = response.data.status;
                    this.showAlert(response.data.message, "success");
                })
                .catch((error) => {
                    this.showAlert(error.response.data.message || "Failed to update status", "error");
                })
                .finally(() => {
                    this.publishDialog = false;
                });
        },
        fetchItems() {
            this.loading = true;
            axios
                .get("/gallery")
                .then((res) => (this.galleryItems = res.data))
                .finally(() => (this.loading = false));
        },
        submitItem() {
            this.loading = true;
            const formData = new FormData();
            formData.append("title", this.currentItem.title);
            formData.append("description", this.currentItem.description);
            formData.append("date", this.currentItem.date);
            if (this.currentItem.image) formData.append("image", this.currentItem.image);

            let request;
            if (this.isEditing) {
                request = axios.post(`/gallery/${this.currentItem.id}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`
                    },
                });
            } else {
                request = axios.post("/gallery", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`
                    },
                });
            }

            request
                .then((res) => {
                    this.showAlert(res.data.message, "success");
                    this.closeAddEditDialog();
                    this.fetchItems();
                })
                .catch((err) => {
                    if (err.response && err.response.data.errors) {
                        const messages = Object.values(err.response.data.errors).flat().join("\n");
                        this.showAlert(messages, "error");
                    } else {
                        this.showAlert(err.response.data.message || "Operation failed", "error");
                    }
                })
                .finally(() => (this.loading = false));
        },
        deleteDialog(item) {
            this.itemToDelete = item;
            this.confirmDeleteDialog = true;
        },
        deleteItem() {
            axios
                .delete(`/gallery/${this.itemToDelete.id}`)
                .then((res) => {
                    this.showAlert(res.data.message, "success");
                    this.galleryItems = this.galleryItems.filter((i) => i.id !== this.itemToDelete.id);
                    this.confirmDeleteDialog = false;
                })
                .catch(() => this.showAlert("Failed to delete item", "error"));
        },
    },
    mounted() {
        this.fetchItems();
    },
};
</script>

<style scoped>
.page-title {
    font-weight: bold;
    font-size: 1.6rem;
}

.page-subtitle {
    color: #555;
}

.search-field {
    max-width: 300px;
}
</style>
