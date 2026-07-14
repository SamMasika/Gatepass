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
    name: "Gate1SubmissionDialog",

    props: {
        modelValue: Boolean,

        title: {
            type: String,
            default: "Submit to Gate 1"
        },

        subtitle: {
            type: String,
            default: "Send request for initial security review"
        },

        status: {
            type: String,
            default: "Gate 1 Review"
        },

        gatePassNumber: {
            type: String,
            default: ""
        },

        visitorInitial: {
            type: String,
            default: "G"
        },

        metaText: {
            type: String,
            default: "Ready for submission"
        },

        notice: {
            type: String,
            default: "This request will be reviewed by Gate 1 security before escalation to Gate 2."
        },

        icon: {
            type: String,
            default: "mdi-shield"
        },

        gradient: {
            type: String,
            default: "linear-gradient(135deg, #2563eb, #1d4ed8)"
        },

        confirmText: {
            type: String,
            default: "Submit to Gate 1"
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
