<template>
<div class="gp-sidebar">
    <!-- LOGO -->
    <div class="logo-wrapper">
        <v-img src="@/assets/nidc.png" max-width="140" class="logo-img" />
    </div>

    <!-- NAVIGATION -->
    <v-list nav density="comfortable" v-model:opened="openedGroups" class="sidebar-list">
        <template v-for="(group, i) in filteredSidebar" :key="i">
            <!-- SINGLE ITEM -->
            <v-list-item
                v-if="!group.children"
                :to="group.to"
                :active="isItemActive(group)"
                active-class="gp-active"
                router
                class="sidebar-item"
            >
                <template #prepend>
                    <v-icon class="item-icon">{{ group.icon }}</v-icon>
                </template>
                <v-list-item-title class="item-title">{{ group.title }}</v-list-item-title>
            </v-list-item>

            <!-- GROUP -->
            <v-list-group v-else :value="group.title" class="sidebar-group">
                <template #activator="{ props }">
                    <v-list-item
                        v-bind="props"
                        :class="{ 'gp-active': isGroupActive(group) }"
                        class="sidebar-item group-activator"
                    >
                        <template #prepend>
                            <v-icon class="item-icon">{{ group.icon }}</v-icon>
                        </template>
                        <v-list-item-title class="item-title">{{ group.title }}</v-list-item-title>
                    </v-list-item>
                </template>

                <v-list-item
                    v-for="(child, j) in group.children"
                    :key="j"
                    :to="child.to"
                    :active="isItemActive(child)"
                    active-class="gp-active"
                    router
                    class="sidebar-item child-item"
                >
                    <template #prepend>
                        <v-icon size="18" class="item-icon">{{ child.icon }}</v-icon>
                    </template>
                    <v-list-item-title class="item-title">{{ child.title }}</v-list-item-title>
                </v-list-item>
            </v-list-group>
        </template>
    </v-list>
</div>
</template>

<script>
export default {
    name: "GatePassSidebar",

    data() {
        return {
            openedGroups: [],
            sidebarItems: [
                {
                    title: "Dashboard",
                    icon: "mdi-view-dashboard-outline",
                    to: "/dashboard",
                    // No permission → visible to everyone
                    match: [
                        "/dashboard",
                        "/security-dashboard",
                        "/staff-dashboard",
                    ],
                },
                {
                    title: "Gate Pass",
                    icon: "mdi-card-account-details-outline",
                    children: [
                        {
                            title: "Create Pass",
                            icon: "mdi-plus-circle-outline",
                            to: "/create-pass",
                            permission: "GATEPASS_CREATE",
                        },
                        {
                            title: "Today's Active Passes",
                            icon: "mdi-file-document-outline",
                            to: "/active-passes",
                            permission: "GATEPASS_ACCESS",
                        },
                        {
                            title: "All Passes",
                            icon: "mdi-file-document-outline",
                            to: "/gate-pass",
                            permission: "GATEPASS_ACCESS",
                            match: "/gate-pass",
                        },
                    ],
                },
                {
                    title: "Reports",
                    icon: "mdi-chart-box-outline",
                    children: [
                        {
                            title: "Gate Pass Reports",
                            icon: "mdi-file-chart",
                            to: "/reports/gate-pass",
                            permission: "REPORTS_ACCESS",
                        },
                        {
                            title: "Visitor Reports",
                            icon: "mdi-chart-bar",
                            to: "/reports/visitors",
                            permission: "REPORTS_ACCESS",
                        },
                    ],
                },
                {
                    title: "System Configuration",
                    icon: "mdi-cog-outline",
                    children: [
                        {
                            title: "Users",
                            icon: "mdi-account-cog-outline",
                            to: "/users",
                            permission: "USER_ACCESS",
                        },
                        {
                            title: "Roles & Permissions",
                            icon: "mdi-shield-account-outline",
                            to: "/roles",
                            permission: "ROLE_ACCESS",
                        },
                        {
                            title: "Departments/Sections",
                            icon: "mdi-folder-plus",
                            to: "/sections",
                            permission: "SECTION_ACCESS",
                        },
                        {
                            title: "Companies",
                            icon: "mdi-domain",
                            to: "/companies",
                            permission: "COMPANY_ACCESS",
                        },
                        {
                            title: "Purpose of Visit",
                            icon: "mdi-badge-account-outline",
                            to: "/visit-purposes",
                            permission: "VISIT_PURPOSE_ACCESS",
                        },
                        {
                            title: "Access Area",
                            icon: "mdi-badge-account-outline",
                            to: "/access-areas",
                            permission: "AREA_ACCESS",
                        },
                    ],
                },
            ],
        };
    },

    computed: {
        filteredSidebar() {
            if (this.$hasRole("admin")) {
                return this.sidebarItems;
            }

            return this.sidebarItems
                .map((group) => {
                    // Dashboard is always visible
                    if (group.title === "Dashboard") {
                        return group;
                    }

                    if (!group.children) {
                        if (!group.permission) return group;
                        return this.$hasPermission(group.permission) ? group : null;
                    }

                    const children = group.children.filter((child) => {
                        if (!child.permission) return true;
                        return this.$hasPermission(child.permission);
                    });

                    if (!children.length) return null;

                    return {
                        ...group,
                        children,
                    };
                })
                .filter(Boolean);
        },
    },

    watch: {
        "$route.path": {
            immediate: true,
            handler() {
                this.openActiveGroup();
            },
        },
    },

    methods: {
        isItemActive(item) {
            if (!item) return false;
            const current = this.$route.path;

            // Exact or nested under `to`
            if (item.to && (current === item.to || current.startsWith(item.to + "/"))) {
                return true;
            }

            // Array match (Dashboard)
            if (Array.isArray(item.match)) {
                return item.match.some(
                    (path) => current === path || current.startsWith(path + "/")
                );
            }

            // String match
            if (typeof item.match === "string") {
                return current === item.match || current.startsWith(item.match + "/");
            }

            return false;
        },

        isGroupActive(group) {
            if (!group.children) return false;
            return group.children.some((child) => this.isItemActive(child));
        },

        openActiveGroup() {
            const activeGroup = this.filteredSidebar.find((group) => {
                if (!group.children) return false;
                return group.children.some((child) => this.isItemActive(child));
            });

            if (activeGroup) {
                this.openedGroups = [activeGroup.title];
            }
        },
    },
};
</script>

<style scoped>
.gp-sidebar {
    min-height: 100vh;
    padding: 20px 0 32px;
    background: var(--surface);
    border-right: 1px solid var(--border-light);
}

.logo-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 28px;
    padding: 0 16px;
}

.logo-img {
    filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.06));
}

.sidebar-list {
    padding: 0 8px;
}

.sidebar-item {
    margin: 4px 8px;
    border-radius: 12px !important;
    font-weight: 500;
    transition: all 0.2s ease;
    color: var(--text-secondary);
}

.sidebar-item:hover {
    background: var(--surface-alt) !important;
    color: var(--text) !important;
}

.sidebar-item.gp-active,
.sidebar-item.gp-active:hover {
    background: linear-gradient(135deg, var(--brand), var(--brand-dark)) !important;
    color: white !important;
}

.sidebar-item.gp-active .item-icon,
.sidebar-item.gp-active .v-icon {
    color: white !important;
}

.item-icon {
    color: var(--text-muted);
    transition: color 0.2s ease;
}

.sidebar-item:hover .item-icon {
    color: var(--text);
}

.item-title {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.1px;
}

.child-item {
    margin-left: 20px !important;
    font-size: 13.5px;
}

.child-item .item-title {
    font-weight: 500;
}

.group-activator {
    font-weight: 600;
}

/* Dark theme adjustments */
[data-theme="dark"] .gp-sidebar {
    background: var(--surface);
    border-right-color: var(--border);
}

[data-theme="dark"] .sidebar-item.gp-active {
    background: linear-gradient(135deg, var(--brand), var(--brand-dark)) !important;
}
</style>