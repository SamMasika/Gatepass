<template>
<v-container fluid>
    <v-card class="elevation-2">
        <v-toolbar class="tolbar">
            <span class="mx-5">Permissions for <strong>{{ selectedRole.name }}</strong></span>
            <v-spacer></v-spacer>
            <v-btn rounded="xl" @click="toggleCheckAll">{{ checkAll ? 'Uncheck All' : 'Check All' }}</v-btn>
        </v-toolbar>

        <v-card-subtitle class="my-5">
            <v-spacer></v-spacer>
            <v-text-field v-model="search" label="Search Permissions" clearable rounded="xl" density="compact" prepend-inner-icon="mdi-magnify" flat variant="solo-filled" hide-details single-line class="search-field"></v-text-field>
        </v-card-subtitle>

        <v-divider></v-divider>

        <v-card-text>
            <v-row dense class="pa-0">
                <v-col v-for="permission in paginatedPermissions" :key="permission.id" cols="12" sm="6" md="3" class="pa-0">
                    <v-checkbox v-model="assignedPermissions" :value="permission.id" :label="permission.label" color="primary" class="tight-checkbox"></v-checkbox>
                </v-col>
            </v-row>

            <!-- Pagination Controls -->
            <v-pagination v-if="filteredPermissions.length > itemsPerPage" v-model="page" rounded="circle" :length="totalPages" class="mt-4"></v-pagination>
        </v-card-text>
    </v-card>
</v-container>
</template>

  
  
<script>
export default {
    data() {
        return {
            selectedRole: {
                name: "Admin",
            },
            assignedPermissions: [1, 3, 5, 7],
            permissions: Array.from({
                length: 100
            }, (_, i) => ({
                id: i + 1,
                label: `Permission ${i + 1}`,
            })),
            search: "",
            page: 1,
            itemsPerPage: 24,
            checkAll: false,
        };
    },
    computed: {
        filteredPermissions() {
            return this.permissions.filter((permission) =>
                permission.label.toLowerCase().includes(this.search.toLowerCase())
            );
        },
        totalPages() {
            return Math.ceil(this.filteredPermissions.length / this.itemsPerPage);
        },
        paginatedPermissions() {
            const start = (this.page - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredPermissions.slice(start, end);
        },
    },
    methods: {
        toggleCheckAll() {
            if (this.checkAll) {
                this.assignedPermissions = [];
            } else {
                this.assignedPermissions = this.permissions.map((permission) => permission.id);
            }
            this.checkAll = !this.checkAll;
        },
    },
    watch: {
        search() {
            this.page = 1;
        },
        assignedPermissions(newVal) {
            this.checkAll = newVal.length === this.permissions.length;
        },
    },
};
</script>
  
  
<style scoped>
.v-card-title {
    background-color: #f5f5f5;
    color: #424242;
}

.v-btn-toggle .v-btn {
    color: #ffffff;
}

.tight-checkbox {
    margin-bottom: 0px !important;
    /* Minimizes bottom space */
    padding-bottom: 0px !important;
    line-height: 1.2;
    /* Adjusts spacing within checkbox */
}
</style>
