<template>
<v-container fluid>
    <!-- Header -->
    <v-row>
        <v-col>
            <h2 class="page-title">Products</h2>
            <p class="page-subtitle">Manage all products</p>
        </v-col>
    </v-row>

    <v-card>
        <v-card-title>
            <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                label="Search Products"
                single-line
                hide-details
                variant="outlined"
                density="compact"
                class="search-field mt-4"
            />
            <v-spacer></v-spacer>
            <v-btn color="success" @click="openDialog()">Add Product</v-btn>
        </v-card-title>

        <v-card-text>
            <v-data-table :headers="headers" :items="products" :search="search">
                <template v-slot:[`item.category`]="{ item }">
                    {{ item.category.name }}
                </template>
                <template v-slot:[`item.status`]="{ item }">
                    <v-chip :color="getStatusColor(item.status)" variant="tonal" size="small">
                        {{ formatStatus(item.status) }}
                    </v-chip>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-menu>
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" icon rounded class="circle-btn" flat>
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-card>
                            <v-list dense nav>
                                <v-list-item @click="openViewDialog(item)">
                                    <v-list-item-icon><v-icon small>mdi-eye</v-icon></v-list-item-icon>
                                    <v-list-item-title>View</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="openConfirmDialog(item)">
                                    <v-list-item-icon>
                                        <v-icon small>
                                            {{ item.status==='published'?'mdi-cancel':'mdi-check-circle' }}
                                        </v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>
                                        {{ item.status==='published'?'Unpublish':'Publish' }}
                                    </v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-card>
                    </v-menu>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>

    <!-- Dialogs similar to categories for view and confirm publish -->
</v-container>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            search:'',
            products:[],
            headers:[
                {title:'Name', value:'name'},
                {title:'Category', value:'category'},
                {title:'Price', value:'price'},
                {title:'Status', value:'status'},
                {title:'Actions', value:'actions', sortable:false}
            ],
            viewDialog:false,
            confirmDialog:false,
            selectedItem:null
        }
    },
    methods:{
        fetchProducts(){
            axios.get('/api/products').then(res=>{
                this.products=res.data.data;
            });
        },
        openViewDialog(item){ this.selectedItem=item; this.viewDialog=true; },
        openConfirmDialog(item){ this.selectedItem=item; this.confirmDialog=true; },
        confirmPublish(){
            axios.post(`/api/products/${this.selectedItem.id}/toggle-status`).then(res=>{
                this.selectedItem.status=res.data.status;
            }).finally(()=>{ this.confirmDialog=false; });
        },
        getStatusColor(status){ return status==='published'?'green':status==='pending'?'orange':'grey'; },
        formatStatus(status){ return status.charAt(0).toUpperCase()+status.slice(1); }
    },
    mounted(){ this.fetchProducts(); }
}
</script>
