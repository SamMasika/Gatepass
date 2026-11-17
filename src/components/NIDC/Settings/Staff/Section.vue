<template>
  <v-container fluid class="px-6 py-4">
    <!-- BREADCRUMB -->
    <PageBreadcrumb title="Sections" />

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
              prepend-icon="mdi-folder-plus-outline"
            >
              Add Section
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
                      {{ section.id ? 'mdi-folder-edit-outline' : 'mdi-folder-plus-outline' }}
                    </v-icon>
                  </div>

                  <div class="ml-5">
                    <div class="dialog-title">
                      {{ section.id ? 'Edit Section' : 'Create Section' }}
                    </div>
                    <div class="dialog-subtitle">
                      Manage system departments and sections professionally
                    </div>
                  </div>
                </div>

                <v-chip color="white" variant="flat" class="font-weight-medium">
                  Secure Configuration
                </v-chip>
              </div>
            </div>

            <!-- BODY -->
            <div class="dialog-body">
              <v-row>
                <v-col cols="12">
                  <div class="premium-input-group">
                    <label class="premium-label">Section Name</label>
                    <v-text-field
                      v-model="section.name"
                      placeholder="Enter section name"
                      variant="solo-filled"
                      rounded="xl"
                      flat
                      hide-details
                      prepend-inner-icon="mdi-folder-outline"
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
                @click="saveItem"
              >
                <v-icon start>mdi-content-save-outline</v-icon>
                {{ section.id ? 'Update Section' : 'Save Section' }}
              </v-btn>
            </div>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>

    <!-- TABLE -->
    <DataTable
      ref="sectionTable"
      :api-url="'/sections'"
      :headers="headers"
      title="Section Management"
      subtitle="Manage all organization sections and departments"
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
                <v-icon size="18" color="white">mdi-folder-outline</v-icon>
              </div>
              <div>
                <div class="menu-title">Quick Actions</div>
                <div class="menu-subtitle">Manage this section</div>
              </div>
            </div>

            <div class="menu-divider"></div>

            <div class="menu-items">
              <!-- EDIT -->
              <div class="premium-menu-item" @click="editItem(item)">
                <div class="menu-item-left">
                  <div class="menu-item-icon activities-bg">
                    <v-icon size="18" color="var(--deep-purple)">mdi-pencil-outline</v-icon>
                  </div>
                  <div>
                    <div class="menu-item-title">Edit Section</div>
                    <div class="menu-item-subtitle">Update section details</div>
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
                    <div class="menu-item-title">Delete Section</div>
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
      title="Delete Section"
      subtitle="This action will permanently remove this section from the system."
      :item-name="itemToDelete.name"
      item-description="Organization Section"
      button-text="Delete Section"
      @confirm="deleteItem"
    />
  </v-container>
</template>

<script>
import axios from 'axios'
import swtalert from '@/mixins/swtalert'
import DataTable from '../../SharedComponents/dataTable.vue'
import DeleteDialog from '../../SharedComponents/DeleteDialog.vue'
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
      section: {
        id: null,
        name: ''
      },
      headers: [
        { title: 'Section Name', value: 'name' },
        { title: 'Actions', value: 'actions' }
      ]
    }
  },

  methods: {
    closeDialog() {
      this.dialog = false
      this.section = {
        id: null,
        name: ''
      }
    },

    refreshTable() {
      this.$refs.sectionTable.fetchData()
    },

    saveItem() {
      const request = this.section.id
        ? axios.put(`/sections/${this.section.id}`, this.section)
        : axios.post('/sections', this.section)

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

    editItem(item) {
      this.section = { ...item }
      this.dialog = true
    },

    deleteDialog(item) {
      this.itemToDelete = item
      this.confirmDialogVisible = true
    },

    deleteItem() {
      axios
        .delete(`/sections/${this.itemToDelete.id}`)
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

