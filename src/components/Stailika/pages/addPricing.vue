<template>
  <v-container class="py-10" fluid>
    <v-row justify="center">
      <v-col cols="12" md="10">

        <!-- Breadcrumbs -->
        <nav class="custom-breadcrumbs mb-6">
          <span class="breadcrumb-item" @click="$router.push('/dashboard')">Dashboard</span>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-item" @click="$router.push('/pricing')">Pricing</span>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-item active">Create Package</span>
        </nav>

        <!-- Card -->
        <v-card class="pa-6 elevation-0">
          <!-- Title -->
          <v-card-title class="font-weight-bold my-4 ">
            Create New Package
          </v-card-title>

          <v-card-text>
            <!-- Package Type -->
            <v-select
              v-model="selectedPackage"
              :items="packagesList"
              label="Select Package Type"
              variant="outlined"
              density="comfortable"
              clearable
              class="mb-4"
            ></v-select>

            <div v-if="selectedPackage">
              <!-- Package Name -->
              <v-text-field
                v-model="packageForm.name"
                label="Package Name"
                variant="outlined"
                class="mb-4"
              ></v-text-field>

              <!-- Pieces & Category -->
              <v-row class="mb-4" dense>
                <v-col cols="12" sm="6" v-if="selectedPackage === 'Suit'">
                  <v-select
                    v-model="packageForm.pieces"
                    :items="['Two-piece', 'Three-piece']"
                    label="Suit Pieces"
                    variant="outlined"
                    density="comfortable"
                  ></v-select>
                </v-col>

                <v-col cols="12" sm="6" v-if="['Suit', 'Jacket', 'Trousers'].includes(selectedPackage)">
                  <v-select
                    v-model="packageForm.category"
                    :items="['Essential', 'Premium']"
                    label="Category"
                    variant="outlined"
                    density="comfortable"
                  ></v-select>
                </v-col>
              </v-row>

              <!-- Image Upload -->
              <v-file-input
                v-model="packageForm.image"
                label="Upload Package Image"
                accept="image/*"
                variant="outlined"
                prepend-icon="mdi-camera"
                class="mb-4"
                @change="onFileChange"
              ></v-file-input>

              <v-img
                v-if="imagePreview"
                :src="imagePreview"
                aspect-ratio="1.7"
                class="my-4 elevation-2"
              ></v-img>

              <!-- Prices -->
              <v-row dense>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="packageForm.minPrice"
                    label="Minimum Price (TZS)"
                    type="number"
                    prepend-icon="mdi-currency-tz"
                    variant="outlined"
                    density="comfortable"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="packageForm.maxPrice"
                    label="Maximum Price (TZS)"
                    type="number"
                    prepend-icon="mdi-currency-tz"
                    variant="outlined"
                    density="comfortable"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- Includes -->
              <v-card outlined class="pa-4 mt-4 elevation-0">
                <v-card-title class="font-weight-bold d-flex align-center justify-space-between">
                  Includes
                  <v-btn icon small color="green" @click="addInclude">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </v-card-title>

                <v-list dense>
                  <v-list-item
                    v-for="(item, index) in packageForm.includes"
                    :key="index"
                  >
                    <div class="d-flex align-center w-100">
                      <v-text-field
                        v-model="packageForm.includes[index]"
                        placeholder="Include item"
                        density="comfortable"
                        variant="outlined"
                        class="flex-grow-1"
                        style="margin: 0;"
                      ></v-text-field>

                      <v-btn
                        icon
                        color="red"
                        @click="removeInclude(index)"
                        style="flex-shrink: 0; margin-left: 8px; display: flex; align-items: center;"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </div>
                  </v-list-item>
                </v-list>
              </v-card>

              <!-- Actions -->
              <v-card-actions class="mt-6">
                <v-spacer></v-spacer>
                <v-btn
                  class="button-color"
                  rounded
                  large
                  @click="savePackage"
                  elevation="5"
                  :loading="loading"
                >
                  <v-icon left>mdi-content-save</v-icon>
                  Save Package
                </v-btn>
              </v-card-actions>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import swtalert from "@/mixins/swtalert";
import axios from "axios";

export default {
  mixins: [swtalert],
  data() {
    return {
      packagesList: ["Suit", "Jacket", "Overcoat", "Shirt", "Trousers"],
      selectedPackage: null,
      packageForm: {
        name: "",
        type: "",
        minPrice: "",
        maxPrice: "",
        includes: [],
        pieces: null,
        category: null,
        image: null,
      },
      imagePreview: null,
      loading: false,
    };
  },
  methods: {
    onFileChange(file) {
      if (file) {
        this.packageForm.image = file;
        const reader = new FileReader();
        reader.onload = (e) => (this.imagePreview = e.target.result);
        reader.readAsDataURL(file);
      } else {
        this.packageForm.image = null;
        this.imagePreview = null;
      }
    },
    addInclude() {
      this.packageForm.includes.push("");
    },
    removeInclude(index) {
      this.packageForm.includes.splice(index, 1);
    },
    savePackage() {
      this.loading = true;
      const formData = new FormData();
      formData.append("name", this.packageForm.name);
      formData.append("type", this.selectedPackage);
      formData.append("minPrice", this.packageForm.minPrice);
      formData.append("maxPrice", this.packageForm.maxPrice);
      formData.append("includes", JSON.stringify(this.packageForm.includes));

      if (["Suit", "Jacket", "Trousers"].includes(this.selectedPackage)) {
        if (this.selectedPackage === "Suit")
          formData.append("pieces", this.packageForm.pieces);
        formData.append("category", this.packageForm.category);
      }

      if (this.packageForm.image) formData.append("image", this.packageForm.image);

      axios
        .post("/packages", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((res) => {
          this.showAlert(res.data.message || "Package created successfully", "success");
          this.resetForm();
          this.$router.push({ name: "pricing" });
        })
        .catch((err) => {
          this.showAlert(err.response?.data?.message || "Error creating package", "error");
        })
        .finally(() => (this.loading = false));
    },
    resetForm() {
      this.packageForm = {
        name: "",
        type: "",
        minPrice: "",
        maxPrice: "",
        includes: [],
        pieces: null,
        category: null,
        image: null,
      };
      this.selectedPackage = null;
      this.imagePreview = null;
    },
  },
};
</script>

<style scoped>
.v-card-title {
  border-bottom: 1px solid #e0e0e0;
}


</style>
