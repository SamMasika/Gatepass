<template>
  <v-dialog
    :model-value="modelValue"
    max-width="550"
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
          {{ status?.toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) }}
        </div>
      </div>

      <!-- BODY -->
      <div class="gd-body">

        <!-- NOTICE -->
        <div class="gd-notice mb-5">
          <v-icon size="18" color="#f59e0b" class="mr-2">
            mdi-information-outline
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
              ? 'Please provide a reason for rejection...' 
              : 'Add a reason or comment for this decision...'"
            variant="outlined"
            rows="3"
            auto-grow
            :error="showError"
            :error-messages="showError ? 'Remarks are required when rejecting' : ''"
            class="gd-textarea"
            @input="showError = false"
          />
        </div>

      </div>

      <!-- FOOTER -->
      <div class="gd-footer">

        <!-- REJECT -->
        <v-btn
          v-if="rejectText"
          variant="text"
          class="gd-reject"
          @click="handleReject"
          flat
        >
          {{ rejectText }}
        </v-btn>

        <v-spacer />

        <!-- CLOSE -->
        <v-btn
          variant="text"
          class="gd-cancel mx-2"
          @click="$emit('update:modelValue', false)"
          flat
        >
          {{ cancelText }}
        </v-btn>

        <!-- APPROVE -->
        <v-btn
          class="gd-confirm"
          :loading="loading"
          @click="handleConfirm"
          flat
        >
          {{ confirmText }}
          <v-icon end size="18">mdi-arrow-right</v-icon>
        </v-btn>

      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "GateApprovalDialog",

  props: {
    modelValue: Boolean,

    title: {
      type: String,
      default: "Gate Approval"
    },
    subtitle: {
      type: String,
      default: "Verify and approve visitor access"
    },

    status: {
      type: String,
      default: "Gate Review"
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
      default: "Visit"
    },
    timeRange: {
      type: String,
      default: "-"
    },

    notice: {
      type: String,
      default: "This decision will be recorded in the security log system."
    },

    icon: {
      type: String,
      default: "mdi-shield-check-outline"
    },

    gradient: {
      type: String,
      default: "linear-gradient(135deg, #3b82f6, #1d4ed8)"
    },

    confirmText: {
      type: String,
      default: "Approve"
    },
    cancelText: {
      type: String,
      default: "Close"
    },
    rejectText: {
      type: String,
      default: "Reject"
    },

    loading: {
      type: Boolean,
      default: false
    },

    // New prop: force remarks required on reject
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

      // Validate remarks only on reject
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
  color: var(--text);
  margin-bottom: 8px;
}

.gd-remarks-label .optional {
  font-weight: 400;
  color: var(--text-muted);
  font-size: 12px;
}

.gd-remarks-label .required {
  color: var(--red);
  margin-left: 2px;
}

.gd-textarea :deep(.v-field) {
  border-radius: 12px !important;
  background: var(--input-bg);
}

.gd-textarea :deep(.v-field--focused) {
  background: var(--white);
}
</style>