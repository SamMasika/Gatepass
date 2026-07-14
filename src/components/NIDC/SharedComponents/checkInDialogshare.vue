<template>
<v-dialog :model-value="modelValue" max-width="480" transition="dialog-bottom-transition" @update:modelValue="$emit('update:modelValue', $event)">

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

                <!-- PASS BADGE -->
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

            <!-- NOTICE -->
            <div class="gd-notice">

                <v-icon size="18" color="#10b981" class="mr-2">
                    mdi-check-circle-outline
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

            <!-- REJECT -->
            <v-btn v-if="rejectText" variant="text" class="gd-reject" @click="$emit('reject')">
                {{ rejectText }}
            </v-btn>

            <v-spacer />

            <!-- CLOSE -->
            <v-btn variant="text" class="gd-cancel mx-2" @click="$emit('update:modelValue', false)" flat>
                {{ cancelText }}
            </v-btn>

            <!-- CONFIRM CHECK-IN -->
            <v-btn class="gd-confirm" :loading="loading" @click="$emit('confirm')" flat	>
                {{ confirmText }}

                <v-icon end size="18">
                    mdi-arrow-right
                </v-icon>
            </v-btn>

        </div>

    </v-card>

</v-dialog>
</template>

<script>
export default {
    name: "Gate2StatusUpdateDialog",

    props: {
        modelValue: Boolean,

        title: {
            type: String,
            default: "Gate 2 Check-In"
        },

        subtitle: {
            type: String,
            default: "Finalize visitor entry at Gate 2 checkpoint"
        },

        status: {
            type: String,
            default: "Gate 2 Review"
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
            default: "Checking in confirms arrival and grants access to the premises under security supervision."
        },

        icon: {
            type: String,
            default: "mdi-check-circle-outline"
        },

        gradient: {
            type: String,
            default: "linear-gradient(135deg, #3b82f6, #1d4ed8)"
        },

        confirmText: {
            type: String,
            default: "Check In"
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
        }
    }
};
</script>
