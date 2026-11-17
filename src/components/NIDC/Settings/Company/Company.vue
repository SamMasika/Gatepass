<template>
  <v-container fluid class="px-6 py-4">
    <!-- BREADCRUMB -->
    <PageBreadcrumb title="Companies / Visitor Sources" />

    <!-- TOP ACTION -->
    <v-row justify="end" class="mb-5">
      <v-col cols="12" md="auto" class="d-flex justify-end">
        <v-dialog v-model="dialog" max-width="850" persistent transition="dialog-bottom-transition">
          <!-- ACTIVATOR -->
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              class="primary-btn"
              rounded="xl"
              height="50"
              elevation="0"
              prepend-icon="mdi-domain"
            >
              Add Company / Source
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
                      {{ company.id ? 'mdi-domain' : 'mdi-domain-plus' }}
                    </v-icon>
                  </div>

                  <div class="ml-5">
                    <div class="dialog-title">
                      {{ company.id ? 'Edit Company / Source' : 'Create Company / Visitor Source' }}
                    </div>
                    <div class="dialog-subtitle">
                      Manage visitor origin companies or organizations
                    </div>
                  </div>
                </div>

                <v-chip color="white" variant="flat" class="font-weight-medium">
                  Visitor Tracking
                </v-chip>
              </div>
            </div>

            <!-- BODY -->
            <div class="dialog-body">
              <v-row>
                <!-- NAME -->
                <v-col cols="12">
                  <div class="premium-input-group">
                    <label class="premium-label">Company / Visitor Source Name</label>
                    <v-text-field
                      v-model="company.name"
                      placeholder="e.g. NIDC, Ministry, Private Company, NGO"
                      variant="solo-filled"
                      rounded="xl"
                      flat
                      hide-details
                      prepend-inner-icon="mdi-domain"
                    />
                  </div>
                </v-col>

                <!-- EMAIL -->
                <v-col cols="12" md="6">
                  <div class="premium-input-group">
                    <label class="premium-label">Email</label>
                    <v-text-field
                      v-model="company.email"
                      placeholder="Enter email"
                      variant="solo-filled"
                      rounded="xl"
                      flat
                      hide-details
                      prepend-inner-icon="mdi-email-outline"
                    />
                  </div>
                </v-col>

                <!-- PHONE -->
                <v-col cols="12" md="6">
                  <div class="premium-input-group">
                    <label class="premium-label">Phone</label>
                    <v-text-field
                      v-model="company.phone"
                      placeholder="Enter phone number"
                      variant="solo-filled"
                      rounded="xl"
                      flat
                      hide-details
                      prepend-inner-icon="mdi-phone-outline"
                    />
                  </div>
                </v-col>

                <!-- ADDRESS -->
                <v-col cols="12">
                  <div class="premium-input-group">
                    <label class="premium-label">Address / Location</label>
                    <v-textarea
                      v-model="company.address"
                      placeholder="Enter company address or visitor origin location"
                      variant="solo-filled"
                      rounded="xl"
                      rows="3"
                      flat
                      hide-details
                      prepend-inner-icon="mdi-map-marker-outline"
                    />
                  </div>
                </v-col>
              </v-row>
            </div>

            <!-- FOOTER -->
            <div class="dialog-footer">
              <v-btn
                variant="outlined"
                rounded="xl"
                height="48"
                class="outline-btn"
                @click="closeDialog"
              >
                Cancel
              </v-btn>

              <v-btn
                class="primary-btn ml-3"
                rounded="xl"
                height="48"
                elevation="0"
                @click="saveCompany"
              >
                <v-icon start>mdi-content-save-outline</v-icon>
                {{ company.id ? 'Update Company' : 'Save Company' }}
              </v-btn>
            </div>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>

    <!-- TABLE -->
    <DataTable
      ref="companyTable"
      :api-url="'/companies'"
      :headers="headers"
      title="Companies / Visitor Sources"
      subtitle="Manage where visitors come from (companies, organizations, institutions)"
    >
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
                <v-icon size="18" color="white">mdi-domain</v-icon>
              </div>
              <div>
                <div class="menu-title">Quick Actions</div>
                <div class="menu-subtitle">Manage company</div>
              </div>
            </div>

            <div class="menu-divider"></div>

            <div class="menu-items">
              <!-- EDIT -->
              <div class="premium-menu-item" @click="editCompany(item)">
                <div class="menu-item-left">
                  <div class="menu-item-icon activities-bg">
                    <v-icon size="18" color="var(--deep-purple)">mdi-pencil-outline</v-icon>
                  </div>
                  <div>
                    <div class="menu-item-title">Edit</div>
                    <div class="menu-item-subtitle">Update details</div>
                  </div>
                </div>
                <v-icon size="18" color="var(--gray)">mdi-chevron-right</v-icon>
              </div>

              <!-- DELETE -->
              <div class="premium-menu-item" @click="deleteDialog(item)">
                <div class="menu-item-left">
                  <div class="menu-item-icon view-bg">
                    <v-icon size="18" color="var(--accent-red)">mdi-delete-outline</v-icon>
                  </div>
                  <div>
                    <div class="menu-item-title">Delete</div>
                    <div class="menu-item-subtitle">Remove permanently</div>
                  </div>
                </div>
                <v-icon size="18" color="var(--gray)">mdi-chevron-right</v-icon>
              </div>
            </div>
          </v-card>
        </v-menu>
      </template>
    </DataTable>

    <!-- DELETE -->
    <DeleteDialog
      v-model="confirmDialogVisible"
      title="Delete Company"
      subtitle="This action will permanently remove this company from the system."
      :item-name="itemToDelete.name"
      item-description="Organization Section"
      button-text="Delete Company"
      @confirm="deleteItem"
    />
  </v-container>
</template>

<script>
import axios from 'axios'
import swtalert from '@/mixins/swtalert'

import DataTable from '@/components/NIDC/SharedComponents/dataTable.vue'
import PageBreadcrumb from '@/components/NIDC/SharedComponents/PageBreadcrumb.vue'
import DeleteDialog from '@/components/NIDC/SharedComponents/DeleteDialog.vue'

export default {
  components: {
    DataTable,
    PageBreadcrumb,
    DeleteDialog
  },

  mixins: [swtalert],

  data() {
    return {
      dialog: false,
      confirmDialogVisible: false,
      itemToDelete: {},
      company: {
        id: null,
        name: '',
        email: '',
        phone: '',
        address: ''
      },
      headers: [
        { title: 'Name', value: 'name' },
        { title: 'Email', value: 'email' },
        { title: 'Phone', value: 'phone' },
        { title: 'Address', value: 'address' },
        { title: 'Actions', value: 'actions' }
      ]
    }
  },

  methods: {
    closeDialog() {
      this.dialog = false
      this.company = {
        id: null,
        name: '',
        email: '',
        phone: '',
        address: ''
      }
    },

    refreshTable() {
      this.$refs.companyTable.fetchData()
    },

    saveCompany() {
      const request = this.company.id
        ? axios.put(`/companies/${this.company.id}`, this.company)
        : axios.post('/companies', this.company)

      request
        .then(res => {
          this.showAlert(res.data.message, 'success')
          this.closeDialog()
          this.refreshTable()
        })
        .catch(err => {
          this.showAlert(
            err.response?.data?.message || 'Operation failed',
            'error'
          )
        })
    },

    editCompany(item) {
      this.company = { ...item }
      this.dialog = true
    },

    deleteDialog(item) {
      this.itemToDelete = item
      this.confirmDialogVisible = true
    },

    deleteItem() {
      axios
        .delete(`/companies/${this.itemToDelete.id}`)
        .then(res => {
          this.showAlert(res.data.message || 'Deleted successfully', 'success')
          this.confirmDialogVisible = false
          this.refreshTable()
        })
        .catch(err => {
          this.showAlert(
            err.response?.data?.message || 'Delete failed',
            'error'
          )
        })
    }
  }
}
</script>

