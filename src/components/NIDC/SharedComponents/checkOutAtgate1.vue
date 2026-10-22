<template>
  <v-dialog
    :model-value="modelValue"
    max-width="620"
    transition="dialog-bottom-transition"
    @update:modelValue="$emit('update:modelValue', $event)"
  >
    <v-card class="premium-gate-dialog" rounded="xl" elevation="0">

      <!-- HEADER -->
      <div class="gd-header" :style="{ background: gradient }">
        <div class="gd-icon-ring">
          <v-icon size="34" color="white">
            mdi-exit-run
          </v-icon>
        </div>

        <div class="gd-header-text">
          <div class="gd-title">
            Gate 1 Final Exit
          </div>

          <div class="gd-subtitle">
            Complete departure from premises
          </div>

          <div v-if="gatePassNumber" class="gd-pass-badge">
            {{ gatePassNumber }}
          </div>
        </div>

        <div class="gd-status">
          Final Checkout
        </div>
      </div>

      <!-- BODY -->
      <div class="gd-body">

        <!-- SECURITY NOTICE -->
        <div class="gd-notice mb-5">
          <v-icon size="20" color="#f59e0b">
            mdi-shield-check-outline
          </v-icon>

          <div class="gd-notice-text">
            <slot name="notice">
              {{ notice }}
            </slot>
          </div>
        </div>

        <!-- REMARKS TEXTAREA -->
        <div class="gd-remarks">
          <label class="gd-remarks-label">
            Remarks
            <span v-if="requireRemarks" class="required">*</span>
            <span v-else class="optional">(Optional)</span>
          </label>

          <v-textarea
            v-model="remarks"
            :placeholder="requireRemarks
              ? 'Please provide a reason for denying the exit...'
              : 'Add a reason or comment for this decision...'"
            variant="outlined"
            rows="3"
            auto-grow
            :error="showError"
            :error-messages="showError ? 'Remarks are required when denying exit' : ''"
            class="gd-textarea"
            @input="showError = false"
          />
        </div>

      </div>

      <!-- FOOTER -->
      <div class="gd-footer">

        <!-- REJECT / DENY -->
        <v-btn
          v-if="rejectText"
          variant="text"
          class="gd-reject"
          @click="handleReject"
          flat
        >
          <v-icon start>mdi-stop-circle-outline</v-icon>
          {{ rejectText }}
        </v-btn>

        <v-spacer />

        <!-- CANCEL -->
        <v-btn
          variant="text"
          class="gd-cancel"
          @click="$emit('update:modelValue', false)"
          flat
        >
          {{ cancelText }}
        </v-btn>

        <!-- CONFIRM -->
        <v-btn
          class="gd-confirm"
          :loading="loading"
          @click="handleConfirm"
          flat
        >
          {{ confirmText }}
          <v-icon end>mdi-exit-to-app</v-icon>
        </v-btn>

      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "CheckOutAtGate1",

  props: {
    modelValue: Boolean,

    title: {
      type: String,
      default: "Gate 1 Final Exit"
    },
    subtitle: {
      type: String,
      default: "Final authorization for complete departure"
    },
    status: {
      type: String,
      default: "Final Checkout"
    },
    gatePassNumber: {
      type: String,
      default: ""
    },
    visitorName: {
      type: String,
      default: ""
    },
    visitorPhone: {
      type: String,
      default: ""
    },
    visitorInitial: {
      type: String,
      default: "V"
    },
    purpose: {
      type: String,
      default: "Final Exit"
    },
    timeRange: {
      type: String,
      default: "-"
    },
    notice: {
      type: String,
      default: "Please confirm that the visitor has completed all required procedures and is authorized for final exit through Gate 1. This action will permanently close the visitor's access record and mark them as fully exited from the premises."
    },
    icon: {
      type: String,
      default: "mdi-exit-to-app"
    },
    gradient: {
      type: String,
      default: "linear-gradient(135deg, #111827 0%, #1f2937 100%)"
    },
    confirmText: {
      type: String,
      default: "Confirm Final Exit"
    },
    cancelText: {
      type: String,
      default: "Cancel"
    },
    rejectText: {
      type: String,
      default: "Deny Exit"
    },
    loading: {
      type: Boolean,
      default: false
    },
    requireRemarksOnReject: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      remarks: "",
      showError: false,
      isRejecting: false
    };
  },

  computed: {
    requireRemarks() {
      return this.requireRemarksOnReject && this.isRejecting;
    }
  },

  watch: {
    modelValue(val) {
      if (!val) {
        this.remarks = "";
        this.showError = false;
        this.isRejecting = false;
      }
    }
  },

  methods: {
    handleConfirm() {
      this.isRejecting = false;
      this.$emit("confirm", this.remarks.trim());
    },

    handleReject() {
      this.isRejecting = true;

      if (this.requireRemarksOnReject && !this.remarks.trim()) {
        this.showError = true;
        return;
      }

      this.$emit("reject", this.remarks.trim());
    }
  }
};
</script>

<style scoped>
/* Add these styles */

.gd-remarks {
  margin-top: 8px;
}

.gd-remarks-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.gd-remarks-label .optional {
  font-weight: 400;
  color: #9ca3af;
  font-size: 12px;
}

.gd-remarks-label .required {
  color: #ef4444;
  margin-left: 2px;
}

.gd-textarea :deep(.v-field) {
  border-radius: 12px !important;
  background: #f9fafb;
}

.gd-textarea :deep(.v-field--focused) {
  background: #ffffff;
}
</style>