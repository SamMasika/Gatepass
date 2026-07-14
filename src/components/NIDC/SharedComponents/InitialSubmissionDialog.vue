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

                <!-- OPTIONAL PASS BADGE -->
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

                <v-icon size="18" color="#2563eb" class="mr-2">
                    mdi-information-outline
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

            <v-btn variant="text" class="gd-cancel" @click="$emit('update:modelValue', false)" flat>
                {{ cancelText }}
            </v-btn>

            <v-spacer />

            <v-btn class="gd-confirm" :loading="loading" @click="$emit('confirm')" flat>
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
    name: "InitialSubmissionDialog",

    props: {
        modelValue: Boolean,

        title: {
            type: String,
            default: "Submit to Security"
        },

        subtitle: {
            type: String,
            default: "Send this gate pass for security review"
        },

        status: {
            type: String,
            default: "Pending"
        },

        gatePassNumber: {
            type: String,
            default: ""
        },

        notice: {
            type: String,
            default: "Once submitted, the Security Officer will review and approve the gate pass."
        },

        icon: {
            type: String,
            default: "mdi-shield-check-outline"
        },

        gradient: {
            type: String,
            default: "linear-gradient(135deg, #2563eb, #1d4ed8)"
        },

        confirmText: {
            type: String,
            default: "Submit to Security"
        },

        cancelText: {
            type: String,
            default: "Cancel"
        },

        loading: {
            type: Boolean,
            default: false
        }
    }
};
</script>
