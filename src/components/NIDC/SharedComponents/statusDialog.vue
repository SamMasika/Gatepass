<template>
<v-dialog :model-value="modelValue" max-width="520" transition="dialog-bottom-transition" @update:modelValue="$emit('update:modelValue', $event)">

    <v-card class="premium-status-dialog" rounded="xl" elevation="0">

        <!-- HEADER -->
        <div class="sd-header" :style="{ background: gradient }">

            <div class="sd-icon-ring">
                <v-icon size="34" color="white">
                    {{ icon }}
                </v-icon>
            </div>

            <div class="sd-header-text">
                <div class="sd-title">
                    {{ title }}
                </div>

                <div class="sd-subtitle">
                    {{ subtitle }}
                </div>
            </div>

            <div class="sd-status">
                {{ status }}
            </div>

        </div>

        <!-- BODY -->
        <div class="sd-body">

            <!-- MAIN ITEM -->
            <div class="sd-item-card">

                <div class="sd-avatar">
                    {{ itemInitial }}
                </div>

                <div class="sd-item-info">
                    <div class="sd-item-name">
                        {{ itemName }}
                    </div>

                    <div class="sd-item-desc">
                        {{ itemDescription }}
                    </div>
                </div>

            </div>

            <!-- DETAILS SLOT -->
            <div v-if="$slots.details" class="sd-details">
                <slot name="details" />
            </div>

            <!-- NOTICE -->
            <div class="sd-notice">
                <v-icon size="18" :color="noticeColor" class="mr-2">
                    mdi-information-outline
                </v-icon>

                <div>
                    {{ notice }}
                </div>
            </div>

        </div>

        <!-- FOOTER -->
        <div class="sd-footer">

            <v-btn v-if="rejectText" variant="text" class="sd-reject" @click="$emit('reject')">
                {{ rejectText }}
            </v-btn>

            <v-spacer />

            <v-btn variant="outlined" class="sd-cancel" @click="$emit('update:modelValue', false)">
                {{ cancelText }}
            </v-btn>

            <v-btn class="sd-confirm" :loading="loading" @click="$emit('confirm')">
                {{ confirmText }}
                <v-icon end size="18">mdi-arrow-right</v-icon>
            </v-btn>

        </div>

    </v-card>

</v-dialog>
</template>

<script>
export default {
    name: "StatusUpdateDialog",

    props: {
        modelValue: Boolean,

        title: {
            type: String,
            default: "Update Status"
        },
        subtitle: {
            type: String,
            default: "Confirm status change"
        },

        status: {
            type: String,
            default: "Pending"
        },

        itemName: {
            type: String,
            default: ""
        },
        itemDescription: {
            type: String,
            default: ""
        },

        itemInitial: {
            type: String,
            default: "I"
        },

        icon: {
            type: String,
            default: "mdi-update"
        },

        gradient: {
            type: String,
            default: "linear-gradient(135deg, #3b82f6, #2563eb)"
        },

        notice: {
            type: String,
            default: "This action will be recorded in the system logs."
        },

        noticeColor: {
            type: String,
            default: "#3b82f6"
        },

        confirmText: {
            type: String,
            default: "Confirm"
        },
        cancelText: {
            type: String,
            default: "Cancel"
        },
        rejectText: {
            type: String,
            default: ""
        },

        loading: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<style scoped>
.premium-status-dialog {
    border-radius: 20px !important;
    overflow: hidden;
}

/* HEADER */
.sd-header {
    display: flex;
    align-items: center;
    gap: 12px;

    padding: 16px 18px;

    color: #fff;
}

.sd-icon-ring {
    width: 42px;
    height: 42px;
    border-radius: 12px;

    background: rgba(255, 255, 255, 0.15);

    display: flex;
    align-items: center;
    justify-content: center;
}

.sd-title {
    font-size: 15px;
    font-weight: 700;
}

.sd-subtitle {
    font-size: 12px;
    opacity: 0.85;
}

.sd-status {
    margin-left: auto;

    font-size: 11px;
    padding: 4px 8px;

    background: rgba(255, 255, 255, 0.2);
    border-radius: 999px;
}

/* BODY */
.sd-body {
    padding: 16px;
}

/* ITEM */
.sd-item-card {
    display: flex;
    align-items: center;
    gap: 12px;

    padding: 12px;

    border-radius: 12px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
}

.sd-avatar {
    width: 42px;
    height: 42px;
    border-radius: 12px;

    background: linear-gradient(135deg, #3b82f6, #2563eb);

    color: white;

    display: flex;
    align-items: center;
    justify-content: center;

    font-weight: 700;
}

/* TEXT */
.sd-item-name {
    font-size: 14px;
    font-weight: 700;
    color: #0f172a;
}

.sd-item-desc {
    font-size: 12px;
    color: #64748b;
}

/* NOTICE */
.sd-notice {
    display: flex;
    gap: 8px;

    margin-top: 12px;
    padding: 10px;

    border-radius: 10px;

    background: rgba(59, 130, 246, 0.06);
    border: 1px solid rgba(59, 130, 246, 0.15);

    font-size: 12px;
    color: #334155;
}

/* FOOTER */
.sd-footer {
    display: flex;
    align-items: center;

    padding: 12px 16px;

    border-top: 1px solid #e2e8f0;
}

.sd-cancel {
    font-size: 12px;
}

.sd-reject {
    font-size: 12px;
    color: #ef4444 !important;
}

.sd-confirm {
    font-size: 12px;
    border-radius: 10px;

    background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
    color: white !important;

    padding: 6px 14px;
}
</style>
