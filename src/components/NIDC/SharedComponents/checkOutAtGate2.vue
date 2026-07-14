<template>
<v-dialog :model-value="modelValue" max-width="620" transition="dialog-bottom-transition" @update:modelValue="$emit('update:modelValue', $event)">
    <v-card class="premium-gate-dialog" rounded="xl" elevation="0">
        <!-- HEADER -->
        <div class="gd-header" :style="{ background: gradient }">
            <div class="gd-icon-ring">
                <v-icon size="34" color="white">
                    {{ icon }}
                </v-icon>
            </div>

        
            <div class="gd-header-text">
                <div class="gd-title">
                    {{ title }}
                </div>

                <div class="gd-subtitle">
                    {{ subtitle }}
                </div>

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
            <div class="gd-notice">
                <v-icon size="20" color="#f59e0b">
                    mdi-shield-alert-outline
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

            <v-btn v-if="rejectText" variant="text" class="gd-reject" @click="$emit('reject')" flat>
                <v-icon start>
                    mdi-stop-circle-outline
                </v-icon>

                {{ rejectText }}
            </v-btn>

            <v-spacer />

            <v-btn variant="text" class="gd-cancel" @click="$emit('update:modelValue', false)" flat>
                {{ cancelText }}
            </v-btn>

            <v-btn class="gd-confirm" :loading="loading" @click="$emit('confirm')" flat>
                {{ confirmText }}

                <v-icon end>
                    mdi-gate-arrow-right
                </v-icon>
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
        }
    }
};
</script>
