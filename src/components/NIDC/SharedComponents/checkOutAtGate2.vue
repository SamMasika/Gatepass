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
          <v-icon size="34" color="white">{{ icon }}</v-icon>
        </div>

        <div class="gd-header-text">
          <div class="gd-title">{{ title }}</div>
          <div class="gd-subtitle">{{ subtitle }}</div>

          <div v-if="gatePassNumber" class="gd-pass-badge">
            {{ gatePassNumber }}
          </div>
        </div>

        <div class="gd-status">
          {{ status }}
        </div>
      </div>

      <!-- BODY -->
      <div class="gd-body">

        <!-- SECURITY NOTICE -->
        <div class="gd-notice mb-5">
          <v-icon size="20" color="#f59e0b">
            mdi-shield-alert-outline
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
              ? 'Please provide a reason for holding the exit...'
              : 'Add a reason or comment for this decision...'"
            variant="outlined"
            rows="3"
            auto-grow
            :error="showError"
            :error-messages="showError ? 'Remarks are required when holding exit' : ''"
            class="gd-textarea"
            @input="showError = false"
          />
        </div>

      </div>

      <!-- FOOTER -->
      <div class="gd-footer">

        <!-- REJECT / HOLD -->
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
          <v-icon end>mdi-gate-arrow-right</v-icon>
        </v-btn>

      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "checkOutAtGate2",

  props: {
    modelValue: Boolean,

    title: {
      type: String,
      default: "Gate 2 Exit Authorization"
    },
    subtitle: {
      type: String,
      default: "Final security verification before visitor departure"
    },
    status: {
      type: String,
      default: "Departure Review"
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
      default: "Visitor Exit"
    },
    timeRange: {
      type: String,
      default: "-"
    },
    notice: {
      type: String,
      default: "Please confirm that all security clearance requirements have been completed and the visitor is authorized to leave through Gate 2. The departure time and authorization details will be recorded automatically in the security movement register."
    },
    icon: {
      type: String,
      default: "mdi-gate-arrow-right"
    },
    gradient: {
      type: String,
      default: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
    },
    confirmText: {
      type: String,
      default: "Authorize Exit"
    },
    cancelText: {
      type: String,
      default: "Cancel"
    },
    rejectText: {
      type: String,
      default: "Hold Exit"
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