<template>
  <div class="sidebar-container">
    <!-- Logo -->
    <div class="logo-container">
      <v-img
        alt="Stailika Logo"
        src="@/assets/stailika.png"
        transition="scale-transition"
        max-width="130"
      />
    </div>

    <v-list nav dense shaped>
      <!-- Dashboard -->
      <v-list-item
        class="sidebar-item"
        :class="{ 'active-item': isActiveRoute('/dashboard') }"
        title="Dashboard"
        prepend-icon="mdi-home"
        @click="navigate('/dashboard')"
      />
      <v-list-item
        class="sidebar-item"
        :class="{ 'active-item': isActiveRoute('/appointments') }"
        title="Booked Appointments"
        prepend-icon="mdi-calendar-check"
        @click="navigate('/appointments')"
      />
      <v-list-item
        class="sidebar-item"
        :class="{ 'active-item': isActiveRoute('/comments') }"
        title="Comments/Feedback"
        prepend-icon="mdi-message-text"
        @click="navigate('/comments')"
      />

      <!-- Website Configuration -->
      <v-list-group prepend-icon="mdi-web" append-icon="mdi-menu-right" no-action>
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            class="sidebar-item"
            :class="{ 'active-item': isConfigRouteActive }"
            title="Configurations"
          />
        </template>

        <!-- Configuration sections -->
        <v-list-item
          v-for="(item, i) in configItems"
          :key="i"
          class="sidebar-subitem"
          :class="{ 'active-subitem': isActiveRoute(item.route, true) }"
          :title="item.title"
          :prepend-icon="item.icon"
          @click="navigate(item.route)"
        />
      </v-list-group>
    </v-list>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  data() {
    return {
      configItems: [
        
        {
          title: "Contact Details",
          icon: "mdi-phone-classic",
          route: "/contact-us",
        },
        {
          title: "Pricing / Packages",
          icon: "mdi-cash-multiple",
          route: "/pricing",
        },
      ],
    };
  },
  computed: {
    isConfigRouteActive() {
      // Check if any config item is active
      return this.configItems.some((item) => this.isActiveRoute(item.route, true));
    },
  },
  methods: {
    navigate(route) {
      this.$router.push(route);
      this.$emit("select-section", route);
    },
    /**
     * Check if route is active.
     * @param {string} route - The route path to check
     * @param {boolean} includeChildren - If true, child routes also considered active
     */
    isActiveRoute(route, includeChildren = false) {
      if (includeChildren) {
        return this.$route.path.startsWith(route);
      }
      return this.$route.path === route;
    },
  },
};
</script>

<style scoped>
.sidebar-container {
  background: #020B2C;
  min-height: 100vh;
  color: #ffffff;
  padding-top: 20px;
  font-family: 'Roboto', sans-serif;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.sidebar-item {
  color: #ffffff;
  transition: all 0.3s;
  font-weight: 500;
  cursor: pointer;
}

.sidebar-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.active-item {
  background-color: #ffffff;
  color: #020B2C !important;
  font-weight: 600;
}

.sidebar-subitem {
  color: #ffffff;
  padding-left: 40px;
  transition: all 0.3s;
  font-weight: 400;
  cursor: pointer;
}

.sidebar-subitem:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.active-subitem {
  background-color: #ffffff;
  color: #020B2C !important;
  font-weight: 500;
}
</style>
