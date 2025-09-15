<template>
<v-container class="py-12" fluid>
    <app-bar></app-bar>

    <!-- Breadcrumbs -->
    <nav class="custom-breadcrumbs mb-6">
        <span class="breadcrumb-item" @click="$router.push('/dashboard')">
            Dashboard
        </span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active">All Packages</span>
    </nav>

    <!-- Header & Add Button -->
    <div class="d-flex justify-space-between align-center mb-8">
        <h3 class="page-title">All Packages</h3>
        <v-btn dark rounded large class="text-none button-color" @click="goToAddPackage" flat="">
            <v-icon left>mdi-plus</v-icon>
            Add New Package
        </v-btn>
    </div>

    <!-- Data Table -->
    <v-card>
        <v-card-text>
            <v-data-table :headers="headers" :items="packages" :items-per-page="10" class="elevation-0" density="comfortable" :loading="loading" loading-text="Loading packages..." rounded="lg">
                <!-- Image -->
                <template v-slot:[`item.image`]="{ item }">
                    <v-avatar size="60" class="elevation-1">
                        <v-img v-if="item.image" :src="getImageUrl(item.image)" alt="Package Image" width="60" height="60" cover />
                        <v-icon v-else size="40" color="grey">mdi-package-variant</v-icon>
                    </v-avatar>
                </template>

                <!-- Min Price -->
                <template v-slot:[`item.min_price`]="{ item }">
                    {{ formatPrice(item.min_price) }}
                </template>

                <!-- Max Price -->
                <template v-slot:[`item.max_price`]="{ item }">
                    {{ formatPrice(item.max_price) }}
                </template>

                <!-- Status -->
                <template v-slot:[`item.status`]="{ item }">
                    <v-chip :color="getStatusColor(item.status)" variant="tonal" size="small">
                        {{ formatStatus(item.status) }}
                    </v-chip>
                </template>

                <!-- Includes -->
                <template v-slot:[`item.includes`]="{ item }">
                    <ul class="includes-list">
                        <li v-for="(inc, idx) in item.includes" :key="idx">
                            <v-icon small color="green" class="mr-1">
                                mdi-check-circle
                            </v-icon>
                            {{ inc }}
                        </li>
                    </ul>
                </template>

                <!-- Actions -->
                <template v-slot:[`item.actions`]="{ item }">
                    <v-menu transition="scale-transition" offset-y min-width="300" close-on-content-click>
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" icon rounded class="circle-btn" flat>
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>

                        <v-card class="elevation-4 rounded-lg">
                            <v-list dense nav>
                                <!-- Edit -->
                                <v-list-item @click="openEditDialog(item)" class="action-item">
                                    <v-list-item-icon>
                                        <v-icon small>mdi-pencil</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>Edit</v-list-item-title>
                                </v-list-item>

                                <!-- Publish/Unpublish -->
                                <v-list-item @click="openConfirmDialog(item)" class="action-item">
                                    <v-list-item-icon>
                                        <v-icon small>
                                            {{ item.status === "published"
                          ? "mdi-cancel"
                          : "mdi-check-circle" }}
                                        </v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>
                                        {{ item.status === "published"
                        ? "Unpublish"
                        : "Publish" }}
                                    </v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-card>
                    </v-menu>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>

    <!-- Edit Dialog -->
    <v-dialog v-model="editDialog" max-width="800px">
        <v-card elevation="8" rounded="lg">
            <v-card-title class="font-weight-bold px-6 py-4">
                Edit Package
            </v-card-title>

            <v-card-text class="px-6 py-4">
                <v-container fluid>
                    <v-row dense>
                        <!-- Package Name -->
                        <v-col cols="12">
                            <v-text-field v-model="editForm.name" label="Package Name" variant="outlined" density="comfortable" />
                        </v-col>

                        <!-- Type (read-only) -->
                        <v-col cols="12">
                            <v-text-field v-model="editForm.type" label="Package Type" variant="outlined" density="comfortable" readonly />
                        </v-col>

                        <!-- Minimum Price -->
                        <v-col cols="6">
                            <v-text-field v-model="editForm.min_price" label="Minimum Price (TZS)" type="number" variant="outlined" density="comfortable" />
                        </v-col>

                        <!-- Maximum Price -->
                        <v-col cols="6">
                            <v-text-field v-model="editForm.max_price" label="Maximum Price (TZS)" type="number" variant="outlined" density="comfortable" />
                        </v-col>

                        <!-- Pieces -->
                        <v-col cols="6" v-if="editForm.type === 'Suit'">
                            <v-select v-model="editForm.pieces" :items="['Two-piece', 'Three-piece']" label="Pieces" variant="outlined" density="comfortable" />
                        </v-col>

                        <!-- Category -->
                        <v-col cols="6" v-if="['Suit', 'Jacket', 'Trousers'].includes(editForm.type)">
                            <v-select v-model="editForm.category" :items="['Essential', 'Premium']" label="Category" variant="outlined" density="comfortable" />
                        </v-col>

                        <!-- Includes -->
                        <v-col cols="12">
                            <v-textarea v-model="editForm.includesText" label="Includes (comma separated)" variant="outlined" density="comfortable" rows="3" />
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="px-6 py-4 justify-end">
                <v-btn text class="text-none" rounded @click="editDialog = false">
                    Cancel
                </v-btn>
                <v-btn class="button-color text-none" dark rounded @click="saveEdit" :loading="editLoading">
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- Confirm Publish/Unpublish Dialog -->
    <v-dialog v-model="confirmDialog" max-width="420px" persistent>
        <v-card class="rounded-lg elevation-6">
            <v-card-title class="font-weight-bold px-6 py-4" style="border-bottom: 1px solid #eee">
                Confirmation
            </v-card-title>
            <v-card-text class="px-6 py-6 text-center">
                <v-icon size="60" :color="
              selectedItem?.status === 'published' ? 'error' : 'success'
            " class="mb-4">
                    {{ selectedItem?.status === "published"
              ? "mdi-cancel"
              : "mdi-check-circle" }}
                </v-icon>
                <p class="text-lg font-weight-medium">
                    Are you sure you want to
                    <strong :class="
                selectedItem?.status === 'published'
                  ? 'text-error'
                  : 'text-success'
              ">
                        {{ selectedItem?.status === "published"
                ? "Unpublish"
                : "Publish" }}
                    </strong>
                    this package?
                </p>
            </v-card-text>
            <v-card-actions class="px-6 py-4">
                <v-spacer></v-spacer>
                <v-btn variant="outlined" color="grey" rounded="xl" @click="confirmDialog = false">
                    Cancel
                </v-btn>
                <v-btn :color="selectedItem?.status === 'published' ? 'error' : 'success'" rounded="xl" @click="confirmPublish">
                    Yes, Confirm
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <Footer></Footer>
</v-container>
</template>

<script>
import swtalert from "@/mixins/swtalert";
import axios from "axios";

export default {
    mixins: [swtalert],
    data() {
        return {
            packages: [],
            loading: false,
            editDialog: false,
            confirmDialog: false,
            editLoading: false,
            selectedItem: null,
            editForm: {
                id: null,
                name: "",
                type: "",
                min_price: null,
                max_price: null,
                pieces: "",
                category: "",
                includesText: "",
            },
            headers: [{
                    title: "Image",
                    value: "image",
                    sortable: false
                },
                {
                    title: "Name",
                    value: "name"
                },
                {
                    title: "Type",
                    value: "type"
                },
                {
                    title: "Min Price (TZS)",
                    value: "min_price"
                },
                {
                    title: "Max Price (TZS)",
                    value: "max_price"
                },
                {
                    title: "Includes",
                    value: "includes",
                    sortable: false
                },
                {
                    title: "Pieces",
                    value: "pieces"
                },
                {
                    title: "Category",
                    value: "category"
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
        goToAddPackage() {
            this.$router.push("/pricing/add-package");
        },
        getImageUrl(imageName) {
            return this.$getImageUrl(imageName);
        },
        formatPrice(value) {
            if (!value && value !== 0) return "-";
            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "TZS",
                minimumFractionDigits: 0,
            }).format(value);
        },
        openEditDialog(item) {
            this.editForm = {
                id: item.id,
                name: item.name,
                type: item.type,
                pieces: item.pieces,
                category: item.category,
                min_price: item.min_price,
                max_price: item.max_price,
                includesText: item.includes.join(", "),
            };
            this.editDialog = true;
        },
        getStatusColor(status) {
            if (!status) return "grey";
            switch (status.toLowerCase()) {
                case "published":
                    return "green";
                case "pending":
                    return "orange";
                case "rejected":
                    return "red";
                default:
                    return "grey";
            }
        },
        formatStatus(status) {
            return status ?
                status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() :
                "";
        },
        async saveEdit() {
            this.editLoading = true;
            try {
                const response = await axios.put(`/packages/${this.editForm.id}`, {
                    name: this.editForm.name,
                    type: this.editForm.type,
                    min_price: this.editForm.min_price,
                    max_price: this.editForm.max_price,
                    pieces: this.editForm.pieces,
                    category: this.editForm.category,
                    includes: this.editForm.includesText
                        .split(",")
                        .map((i) => i.trim()),
                });

                // Update local list
                const index = this.packages.findIndex(
                    (pkg) => pkg.id === this.editForm.id
                );
                if (index !== -1) {
                    this.packages[index] = {
                        ...this.packages[index],
                        ...response.data.data,
                    };
                }

                // Success alert
                this.showAlert(response.data.message, "success");

                this.editDialog = false;
            } catch (err) {
                console.error("Error updating package:", err);
                this.showAlert(
                    err.response.data.message || "Failed to update package",
                    "error"
                );
            } finally {
                this.editLoading = false;
            }
        },
        openConfirmDialog(item) {
            this.selectedItem = item;
            this.confirmDialog = true;
        },
        confirmPublish() {
            if (!this.selectedItem) return;
            axios
                .post(
                    `/packages/${this.selectedItem.id}/toggle-status`, {}, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        },
                    }
                )
                .then((res) => {
                    this.selectedItem.status = res.data.status;
                    this.showAlert(res.data.message, "success");
                })
                .catch((err) => {
                    this.showAlert(
                        err.response.data.message || "Failed to update status",
                        "error"
                    );
                })
                .finally(() => {
                    this.confirmDialog = false;
                });
        },
    },
    async created() {
        this.loading = true;
        try {
            const response = await axios.get("/packages");
            this.packages = response.data.data.map((pkg) => ({
                ...pkg,
                includes: pkg.includes || [],
            }));
        } catch (err) {
            console.error("Error fetching packages:", err);
        } finally {
            this.loading = false;
        }
    },
};
</script>

<style scoped>
.page-title {
    color: #020b2c;
    font-weight: 600;
    font-size: 1.5rem;
}


.includes-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.includes-list li {
    display: flex;
    align-items: center;
    font-size: 0.875rem;
}

.includes-list li .v-icon {
    margin-right: 4px;
}

.circle-btn {
    border-radius: 50%;
    padding: 4px;
    min-width: 36px;
    min-height: 36px;
}
</style>
