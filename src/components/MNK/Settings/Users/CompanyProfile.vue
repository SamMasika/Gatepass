<template>
  <v-container fluid>
    <div class="my-5" v-if="user?.company?.isComplete===false || user?.loginCount===1 ">
      <v-alert type="warning" prominent border>
        ⚠️ You must update your company and store details first in order to access other items in the system.
      </v-alert>
    </div>
<nav class="custom-breadcrumbs">
			<span class="breadcrumb-item" @click="$router.push('/dashboard')">Dashboard</span>
			<span class="breadcrumb-separator">/</span>
			<span class="breadcrumb-item active">Company Profile</span>
	</nav>
    <v-card  class="pa-5 rounded-lg animate__animated animate__fadeIn">
      <!-- Header Section -->
      <v-sheet class="header-section pa-5 rounded-lg text-center">
        <h1 class="font-weight-bold text-white">🏢 Company Profile</h1>
        <p class="text-grey-lighten-3">Manage and view company details easily 📊</p>
      </v-sheet>

      <v-divider class="my-4"></v-divider>

      <!-- Company Info -->
      <v-row align="center" justify="center">
        <v-col cols="12" md="3" class="text-center">
          <v-avatar size="140" class="elevation-5">
            <v-img 
                v-if="user?.company?.image" 
                :src="getImageUrl(user.company.image)" 
                alt="Company Logo" 
                class="rounded-circle" 
                cover 
                aspect-ratio="1"
            />
            <div v-else class="text-center text-white" style="font-size: 50px;">🏢</div>
          </v-avatar>
        </v-col>

        <v-col cols="12" md="9">
          <v-row align="center" no-gutters>
            <v-col cols="auto">
              <h2 class="font-weight-bold text-blue-darken-2 mx-2">🏙️{{ user?.company?.companyName }} </h2>
              <p class="text-grey-darken-1">{{ user?.company?.companyId }} 🆔</p>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="auto">
              <v-btn color="primary" class="text-white font-weight-bold rounded-xl shadow-2xl" @click="openEditDialog" elevation="0">
                ✏️ Edit
              </v-btn>
            </v-col>
          </v-row>
          
         <v-list density="compact">
    <v-list-item v-for="(info, index) in companyDetails" :key="index" class="list-hover">
      <v-list-item-title :style="{ marginRight: '25px' }">
    {{ info.icon }} {{ info.value }}
</v-list-item-title>

    </v-list-item>

    <v-list-item>
        <v-list-item-title>
            <v-chip  :color="user?.company?.status ? 'green' : 'red'" size="small">
                {{ user?.company?.status ? 'Active ✅' : 'Inactive ❌' }}
            </v-chip>
        </v-list-item-title>
    </v-list-item>
</v-list>

        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>

      <!-- Stores List in Expansion Panel -->
      <h3 v-if="user?.company?.stores.length > 0" class="font-weight-bold mb-3 text-blue-darken-2">
        🏬 Store(s) ({{ user?.company?.stores.length }})
      </h3>
      <v-expansion-panels v-if="user?.company?.stores.length > 0">
        <v-expansion-panel v-for="store in user?.company?.stores" :key="store.id">
          <v-expansion-panel-title>
            <span class="font-weight-bold">{{ store.store_name }}</span>
            <v-btn icon density="compact" @click="openStoreEditDialog(store)" class="ml-4" color="primary" elevation="5">
            <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <p class=" text-grey-darken-1">📍 Location: {{ store.location }}</p>
            <p class=" text-grey-darken-1">👤 Managed by: {{ store.created_by }}</p>
            <p class=" text-grey-darken-1">🗓️ Opening Hours: {{ store.opening_hours }}</p>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <!-- No Stores Message -->
      <p v-else class="text-center text-grey-darken-2">🚫 No stores for this company.</p>
    </v-card>

    <!-- Edit Company Dialog -->
    <v-dialog v-model="editDialog" max-width="900">
      <v-card>
        <v-card-title class="font-weight-bold text-center">
          <v-icon>mdi-pencil</v-icon> Edit Company Details
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editCompany.companyName" label="Company Name 🏙️" required variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editCompany.companyEmail" label="Email 📧" variant="outlined" />
              </v-col>
            </v-row>

            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editCompany.companyPhone" label="Phone 📱" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editCompany.address" label="Postal Address 🏠" variant="outlined" />
              </v-col>
            </v-row>

            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editCompany.companyCity" label="City 🌆" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-autocomplete :items="countries" label="Company Country 🌍" variant="outlined" class="rounded-lg" v-model="editCompany.companyCountry" />
              </v-col>
            </v-row>

            <v-row dense>
              <v-col cols="12">
                <v-file-input label="Company Image 📸" v-model="editCompany.image" accept="image/*" variant="outlined" />
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-card-actions class="pa-4">
              <v-spacer></v-spacer>
              <v-btn text="Close " class="text-none" variant="tonal" @click="editDialog = false" rounded="xl"></v-btn>
              <v-btn type="submit" text="Update 🛠️" class="text-none button-color" variant="flat" @click="updateCompany" rounded="xl"></v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Edit Store Dialog -->
    <v-dialog v-model="storeEditDialog" max-width="900px">
      <v-card>
        <v-card-title class="font-weight-bold text-center">
          <v-icon>mdi-pencil</v-icon> Edit Store Details
        </v-card-title>
        <v-card-text class="pa-5">
          <v-text-field v-model="editStore.store_name" label="Store Name 🏬" variant="outlined" />
          <v-text-field v-model="editStore.location" label="Location 📍" variant="outlined" />
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="grey" class="text-none" rounded="xl" text @click="storeEditDialog = false">Cancel ❌</v-btn>
          <v-btn class="button-color text-none" rounded="xl" @click="saveStoreChanges">Update 🔄</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>


<script>
import axios from "axios";
import alert from "@/mixins/swtalert";
import {
    mapGetters,
} from 'vuex';

export default {
	mixins:[alert],
    data() {
        return {
            editDialog: false,
            storeEditDialog: false,
            company: {},
            editCompany: {},
            editStore: {},
        };
    },
    computed: {
        companyDetails() {
    return [
        {
            icon: '📧',
            value: this.user?.company?.companyEmail
        },
        {
            icon: '📠',
            value: this.user?.company?.companyPhone
        },
        {
            icon: '📍',
            value: `${this.user?.company?.address}, ${this.user?.company?.companyCity}, ${this.user?.company?.companyCountry}`
        },
        {
            icon: '🏢',
            value: `${this.user?.company?.store_counts} Store(s)`
        }
    ];
},
        ...mapGetters({
            authenticated: 'auth/authenticated',
            user: 'auth/user',
        }),
        statusClass() {
            return this.user.company.status === 'ACTIVE' ? 'text-green-darken-2' : 'text-red-darken-2';
        }
    },
    methods: {
        moveTanzaniaToTop() {
            const tanzaniaIndex = this.countries.findIndex(country => country === 'Tanzania, the United Republic of');
            if (tanzaniaIndex !== -1) {
                const tanzania = this.countries.splice(tanzaniaIndex, 1)[0];
                this.countries.unshift(tanzania);
            }
        },
        openEditDialog() {
            this.editCompany = {
                ...this.user ?.company
            };
            this.editDialog = true;
        },
        saveChanges() {
            this.company = {
                ...this.editCompany
            };
            this.editDialog = false;
        },
        updateCompany() {
            const formData = new FormData();
            formData.append('id', this.editCompany.id);
            formData.append('name', this.editCompany.companyName);
            formData.append('email', this.editCompany.companyEmail);
            formData.append('phone', this.editCompany.companyPhone);
            formData.append('city', this.editCompany.companyCity);
            formData.append('country', this.editCompany.companyCountry);

            // Check if the image is a File before appending
            if (this.editCompany.image instanceof File) {
                formData.append('image', this.editCompany.image);
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                }
            };

            // Making the API request
            axios.post(`/company-update`, formData, config)
                .then(response => {
                    this.showAlert(response.data.message, 'success');
                    this.EditDialog = false; // Close the dialog after success
                    this.$emit('companyUpdated', response.data.company); // Emit the updated company data to parent component
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000); // Adding a small delay before reload to allow alert display
                })
                .catch(error => {
                    const errorMessage = error.response ?.data ?.message || 'An error occurred';
                    this.showAlert(errorMessage, 'error');
                });
        },
        openStoreEditDialog(store) {
            this.editStore = {
                ...store
            };
            this.storeEditDialog = true;
        },
      saveStoreChanges() {
    const formData = new FormData();
    formData.append('id', this.editStore.id);
    formData.append('store_name', this.editStore.store_name);
    formData.append('location', this.editStore.location);

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        }
    };

    axios.post(`/store-update`, formData, config)
        .then(response => {
            this.showAlert(response.data.message, 'success');

            this.storeEditDialog = false; // Close the dialog

            // Ensure response contains the expected structure
            if (response.data.company?.stores) {
                const updatedStore = response.data.company.stores.find(store => store.id === this.editStore.id);
                if (updatedStore) {
                    this.$emit('storeUpdated', updatedStore); // Emit only the updated store
                }
            }

            setTimeout(() => {
                window.location.reload(); // Ensure this doesn't block execution
            }, 1000);
        })
        .catch(error => {
            console.error("Update Store Error:", error); // Debugging

            // Improved error handling
            const errorMessage = error.response && error.response.data && error.response.data.message 
                ? error.response.data.message 
                : 'An error occurred';
            this.showAlert(errorMessage, 'error');
        });
},

        getImageUrl(imageName) {
            return this.$getImageUrl(imageName);
        },

        // saveStoreChanges() {
        //     const index = this.company.stores.findIndex(store => store.id === this.editStore.id);
        //     if (index !== -1) {
        //         this.company.stores[index] = {
        //             ...this.editStore
        //         };
        //     }
        //     this.storeEditDialog = false;
        // },
     
    },
    mounted() {
        // this.isLoading = true;
        // Simulating an asynchronous operation that takes some time
        // Replace this with your actual page loading logic
        setTimeout(() => {
            // After the page has finished loading, set isLoading to false
            this.isLoading = false;
        }, 2000); // Adjust the timeout value as needed

        fetch('https://api.first.org/data/v1/countries?limit=250&pretty=true')
            .then(response => response.json())
            .then(data => {
                // Extract country names from the response
                this.countries = Object.values(data.data).map(countryData => countryData.country);
                // Ensure "Tanzania, the United Republic of" appears first in the list
                this.moveTanzaniaToTop();
            })
            .catch(error => {
                console.error('Error fetching countries data:', error);
            });
    },
};
</script>

<style scoped>
/* Header Section Styling */
.header-section {
    background: linear-gradient(135deg, #9dc5ec, #0D47A1);
    color: white;
    border-radius: 12px;
}

/* List and Icons */
.v-list-item-title {
    display: flex;
    align-items: center;
}

.v-icon {
    vertical-align: middle;
}

/* Status Badge */
.status-badge {
    font-weight: bold;
    padding: 4px 10px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease-in-out;
}

.status-badge.text-green-darken-2 {
    background-color: rgba(76, 175, 80, 0.2);
}

.status-badge.text-red-darken-2 {
    background-color: rgba(244, 67, 54, 0.2);
}

/* List Hover Effects */
.list-hover:hover {
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 5px;
}

/* Expansion Panel */
.v-expansion-panel-title {
    font-size: 1.1rem;
    font-weight: bold;
}

/* Button Enhancements */
.v-btn {
    transition: all 0.3s ease;
}

.v-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
</style>
