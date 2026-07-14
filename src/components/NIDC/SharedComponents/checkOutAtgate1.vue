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
            <div class="gd-notice">

                <v-icon size="20" color="#f59e0b">
                    mdi-shield-check-outline
                </v-icon>

                <div class="gd-notice-text">
                    <slot name="notice">
                        {{ notice }}
                    </slot>
                </div>

            </div>

        </div>

        <!-- FOOTER -->
        <div class="gd-footer">

            <v-btn
                v-if="rejectText"
                variant="text"
                class="gd-reject"
                @click="$emit('reject')"
                flat
            >
                <v-icon start>
                    mdi-stop-circle-outline
                </v-icon>

                {{ rejectText }}
            </v-btn>

            <v-spacer />

            <v-btn
                variant="text"
                class="gd-cancel"
                @click="$emit('update:modelValue', false)"
                flat
            >
                {{ cancelText }}
            </v-btn>

            <v-btn
                class="gd-confirm"
                :loading="loading"
                @click="$emit('confirm')"
                flat
            >
                {{ confirmText }}

                <v-icon end>
                    mdi-exit-to-app
                </v-icon>
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
        }
    }
};
</script>