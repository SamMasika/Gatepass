<template>
<div class="premium-breadcrumb">

    <!-- ITEMS -->
    <div class="breadcrumb-items">

        <!-- DASHBOARD -->
        <div class="breadcrumb-link" @click="$router.push('/dashboard')">
            Dashboard
        </div>

        <!-- PARENT PAGE -->
        <template v-if="parent">

            <v-icon size="16" class="breadcrumb-separator">
                mdi-chevron-right
            </v-icon>
            <div class="breadcrumb-link" @click="parentRoute && $router.push(parentRoute)">
                {{ parent }}
            </div>

        </template>

        <!-- CURRENT PAGE -->
        <template v-if="title">
            <v-icon size="16" class="breadcrumb-separator">
                mdi-chevron-right
            </v-icon>

            <div class="breadcrumb-current">
                {{ title }}
            </div>

        </template>

    </div>

</div>
</template>

<script>
export default {

    name: "PageBreadcrumb",

    props: {

        title: {
            type: String,
            required: true
        },

        parent: {
            type: String,
            required: false
        },

        parentRoute: {
            type: String,
            required: false
        }

    }

}
</script>

<style scoped>
/* =========================================
    WRAPPER
========================================= */

.premium-breadcrumb {
    margin-bottom: 10px;
}

/* =========================================
    ITEMS
========================================= */

.breadcrumb-items {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}

/* =========================================
    LINK
========================================= */

.breadcrumb-link {
    display: flex;
    align-items: center;

    font-size: 14px;
    font-weight: 600;

    color: #64748b;

    cursor: pointer;

    transition: all 0.2s ease;
}

/* HOVER */
.breadcrumb-link:hover {
    color: #1b867c;

    transform: translateX(2px);
}

/* =========================================
    SEPARATOR
========================================= */

.breadcrumb-separator {
    margin-inline: 10px;

    color: #94a3b8;
}

/* =========================================
    CURRENT
========================================= */

.breadcrumb-current {
    font-size: 14px;
    font-weight: 800;

    color: #0f172a;

    letter-spacing: 0.2px;
}
</style>
