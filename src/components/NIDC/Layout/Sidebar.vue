<template>
  <div class="gp-sidebar">

    <!-- LOGO -->
    <div class="logo-wrapper">
      <v-img src="@/assets/nidc.png" max-width="140" />
    </div>

    <!-- NAVIGATION -->
    <v-list
      nav
      density="comfortable"
      v-model:opened="openedGroups"
    >

      <template v-for="(group, i) in filteredSidebar" :key="i">

        <!-- SINGLE ITEM -->
        <v-list-item
          v-if="!group.children"
          :to="group.to"
          :active="isActive(group.to)"
          active-class="gp-active"
          router
        >
          <template #prepend>
            <v-icon>{{ group.icon }}</v-icon>
          </template>
          <v-list-item-title>{{ group.title }}</v-list-item-title>
        </v-list-item>

        <!-- GROUP -->
        <v-list-group v-else :value="group.title">

          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              :class="{ 'gp-active': isGroupActive(group) }"
            >
              <template #prepend>
                <v-icon>{{ group.icon }}</v-icon>
              </template>
              <v-list-item-title>{{ group.title }}</v-list-item-title>
            </v-list-item>
          </template>

          <v-list-item
            v-for="(child, j) in group.children"
            :key="j"
            :to="child.to"
            :active="isActive(child.to)"
            active-class="gp-active"
            router
          >
            <template #prepend>
              <v-icon size="18">{{ child.icon }}</v-icon>
            </template>
            <v-list-item-title>{{ child.title }}</v-list-item-title>
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

                // DASHBOARD
                {
                    title: "Dashboard",
                    icon: "mdi-view-dashboard-outline",
                    children: [{
                            title: "Dashboard",
                            icon: "mdi-view-dashboard",
                            to: "/dashboard",
                            permission: "DASHBOARD_ACCESS"
                        },
                        {
                            title: "Security Dashboard",
                            icon: "mdi-shield-account",
                            to: "/security-dashboard",
                            permission: "SECURITY_DASHBOARD"
                        },
                        {
                            title: "Staff Dashboard",
                            icon: "mdi-account-group",
                            to: "/staff-dashboard",
                            permission: "STAFF_DASHBOARD"
                        }
                    ]
                },
                // GATE PASS MANAGEMENT
                {
                    title: "Gate Pass",
                    icon: "mdi-card-account-details-outline",
                    children: [{
                            title: "Create Pass",
                            icon: "mdi-plus-circle-outline",
                            to: "/create-pass",
                            permission: "GATEPASS_CREATE"
                        },
                        {
                            title: "Today's Active Passes",
                            icon: "mdi-file-document-outline",
                            to: "/active-passes",
                            permission: "GATEPASS_ACCESS"
                        },
                        {
                            title: "All Passes",
                            icon: "mdi-file-document-outline",
                            to: "/gate-pass",
							permission: "GATEPASS_ACCESS",
							match:"/gate-pass"
                        },
                    ]
                },

                // REPORTS
                {

                    title: "Reports",
                    icon: "mdi-chart-box-outline",
                    children: [{
                            title: "Gate Pass Reports",
                            icon: "mdi-file-chart",
                            to: "/reports/gate-pass",
                            permission: "REPORTS_ACCESS"
                        },
                        {
                            title: "Visitor Reports",
                            icon: "mdi-chart-bar",
                            to: "/reports/visitors",
                            permission: "REPORTS_ACCESS"
                        }
                    ]
                },

                // SYSTEM
                {
                    title: "System Configuration",
                    icon: "mdi-cog-outline",
                    children: [{
                            title: "Users",
                            icon: "mdi-account-cog-outline",
                            to: "/users",
                            permission: "USER_ACCESS"
                        },
                        {
                            title: "Roles & Permissions",
                            icon: "mdi-shield-account-outline",
                            to: "/roles",
                            permission: "ROLE_ACCESS"
                        },
                        {
                            title: "Departments/Sections",
                            icon: "mdi-folder-plus",
                            to: "/sections",
                            permission: "SECTION_ACCESS"
                        },
                        {
                            title: "Companies",
                            icon: "mdi-domain",
                            to: "/companies",
                            permission: "COMPANY_ACCESS"
                        },
                        {
                            title: "Purpose of Visit",
                            icon: "mdi-badge-account-outline",
                            to: "/visit-purposes",
                            permission: "VISIT_PURPOSE_ACCESS"
                        },
                        {
                            title: "Access Area",
                            icon: "mdi-badge-account-outline",
                            to: "/access-areas",
                            permission: "AREA_ACCESS"
                        }

                    ]
                }
            ]
        };
    },

    computed: {
    filteredSidebar() {
      if (this.$hasRole("admin")) {
        return this.sidebarItems;
      }

      return this.sidebarItems
        .map(group => {
          if (!group.children) {
            if (!group.permission) return group;
            return this.$hasPermission(group.permission) ? group : null;
          }

          const children = group.children.filter(child => {
            if (!child.permission) return true;
            return this.$hasPermission(child.permission);
          });

          if (!children.length) return null;

          return {
            ...group,
            children
          };
        })
        .filter(Boolean);
    }
  },

 watch: {
    "$route.path": {
      immediate: true,
      handler() {
        this.openActiveGroup();
      }
    }
  },

  methods: {
    // Exact or nested match for a single item
    isActive(path) {
      if (!path) return false;
      const current = this.$route.path;

      if (current === path) return true;
      if (current.startsWith(path + "/")) return true;

      return false;
    },

    // Parent group is active if any of its children is active
    isGroupActive(group) {
      if (!group.children) return false;
      return group.children.some(child => this.isActive(child.to));
    },

    openActiveGroup() {
      const activeGroup = this.filteredSidebar.find(group => {
        if (!group.children) return false;
        return group.children.some(child => this.isActive(child.to));
      });

      if (activeGroup) {
        this.openedGroups = [activeGroup.title];
      }
    }
  }
};
</script>

<style scoped>
.gp-sidebar {
  min-height: 100vh;
  padding: 20px 0;
  background: #ffffff;
}

.logo-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.v-list-item {
  margin: 6px 12px;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.25s ease;
}

.v-list-item:hover {
  background: linear-gradient(135deg, #1b867c, #003B73, #0f172a);
  color: white !important;
}

/* Active style for both parent and child */
.gp-active {
  background: linear-gradient(135deg, #1b867c, #003B73, #0f172a) !important;
  color: white !important;
}

.gp-active .v-icon {
  color: white !important;
}

.v-list-group__items .v-list-item {
  margin-left: 28px;
  font-size: 14px;
}
</style>