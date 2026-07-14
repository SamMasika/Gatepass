<template>
<v-dialog :model-value="modelValue" max-width="520" persistent @update:modelValue="$emit('update:modelValue', $event)">

    <v-card class="premium-delete-dialog overflow-hidden" rounded="xl" elevation="0">

        <!-- TOP -->
        <div class="delete-top-gradient">

            <div class="delete-icon-wrapper">

                <v-icon size="42" color="white">
                    {{ icon }}
                </v-icon>

            </div>

        </div>

        <!-- CONTENT -->
        <div class="px-8 pb-8">

            <!-- TITLE -->
            <div class="text-center mt-6">

                <h2 class="delete-title">
                    {{ title }}
                </h2>

                <p class="delete-subtitle">
                    {{ subtitle }}
                </p>

            </div>

            <!-- ITEM CARD -->
            <div class="delete-user-card mt-7">

                <div class="d-flex align-center">

                    <!-- AVATAR -->
                    <div class="delete-avatar">

                        {{
                            itemName
                                ? itemName.charAt(0).toUpperCase()
                                : 'I'
                        }}

                    </div>

                    <!-- INFO -->
                    <div class="ml-4">

                        <div class="delete-user-name">
                            {{ itemName }}
                        </div>

                        <div class="delete-user-position">
                            {{ itemDescription }}
                        </div>

                    </div>

                </div>

            </div>

            <!-- WARNING -->
            <div class="delete-warning-box mt-6">

                <v-icon color="#ff9800" size="20" class="mr-2">
                    mdi-alert-outline
                </v-icon>

                <span>
                    This action cannot be undone.
                </span>

            </div>

            <!-- ACTIONS -->
            <div class="d-flex justify-center mt-8">

                <v-btn variant="outlined" rounded="xl" height="46" class="px-8 mr-3 cancel-btn" @click="$emit('update:modelValue', false)">
                    Cancel
                </v-btn>

                <v-btn rounded="xl" height="46" class="px-8 delete-btn" elevation="0" @click="$emit('confirm')">

                    <v-icon start size="18">
                        mdi-delete-outline
                    </v-icon>

                    {{ buttonText }}

                </v-btn>

            </div>

        </div>

    </v-card>

</v-dialog>
</template>

<script>
export default {

    name: "DeleteDialog",

    props: {

        modelValue: {
            type: Boolean,
            default: false
        },

        title: {
            type: String,
            default: "Delete Item"
        },

        subtitle: {
            type: String,
            default: "This action will permanently remove this item."
        },

        itemName: {
            type: String,
            default: ""
        },

        itemDescription: {
            type: String,
            default: ""
        },

        buttonText: {
            type: String,
            default: "Delete"
        },

        icon: {
            type: String,
            default: "mdi-trash-can-outline"
        }

    }

}
</script>

<style scoped>
/* =========================================
    DIALOG
========================================= */

.premium-delete-dialog {
    background: white;
    border-radius: 32px !important;
    overflow: hidden;
    box-shadow:
        0 25px 60px rgba(15, 23, 42, 0.15);
}

/* =========================================
    TOP
========================================= */

.delete-top-gradient {
    height: 120px;
    background:
        linear-gradient(135deg,
            #ef4444,
            #dc2626,
            #b91c1c);

    position: relative;

    display: flex;
    align-items: center;
    justify-content: center;
}

/* ICON */
.delete-icon-wrapper {
    width: 90px;
    height: 90px;

    border-radius: 30px;

    background:
        rgba(255, 255, 255, 0.15);

    backdrop-filter: blur(10px);

    display: flex;
    align-items: center;
    justify-content: center;

    border:
        1px solid rgba(255, 255, 255, 0.2);

    box-shadow:
        0 10px 30px rgba(0, 0, 0, 0.15);
}

/* =========================================
    TITLE
========================================= */

.delete-title {
    font-size: 28px;
    font-weight: 800;

    color: #0f172a;

    margin-bottom: 10px;
}

.delete-subtitle {
    font-size: 15px;

    color: #64748b;

    line-height: 1.7;
}

/* =========================================
    ITEM CARD
========================================= */

.delete-user-card {
    padding: 18px;

    border-radius: 24px;

    background:
        linear-gradient(to bottom right,
            #f8fafc,
            #ffffff);

    border: 1px solid #e2e8f0;
}

/* AVATAR */
.delete-avatar {
    width: 60px;
    height: 60px;

    border-radius: 20px;

    background:
        linear-gradient(135deg,
            #ef4444,
            #dc2626);

    color: white;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 22px;
    font-weight: 800;

    box-shadow:
        0 10px 20px rgba(239, 68, 68, 0.25);
}

/* NAME */
.delete-user-name {
    font-size: 17px;
    font-weight: 700;

    color: #0f172a;
}

/* DESC */
.delete-user-position {
    margin-top: 4px;

    font-size: 13px;

    color: #64748b;
}

/* =========================================
    WARNING
========================================= */

.delete-warning-box {
    padding: 14px 16px;

    border-radius: 18px;

    background:
        rgba(255, 152, 0, 0.08);

    border:
        1px solid rgba(255, 152, 0, 0.15);

    display: flex;
    align-items: center;

    font-size: 14px;
    font-weight: 600;

    color: #92400e;
}

/* =========================================
    BUTTONS
========================================= */

.cancel-btn {
    border: 1px solid #cbd5e1 !important;

    color: #334155 !important;

    text-transform: none !important;

    font-weight: 700 !important;
}

.delete-btn {
    text-transform: none !important;

    font-weight: 700 !important;

    color: white !important;

    background:
        linear-gradient(135deg,
            #ef4444,
            #dc2626) !important;

    box-shadow:
        0 10px 25px rgba(239, 68, 68, 0.25);
}
</style>
