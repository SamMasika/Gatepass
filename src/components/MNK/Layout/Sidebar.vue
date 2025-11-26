<template>
<div class="sidebar-container">
    <!-- Logo -->
    <div class="logo-container">
        <v-img alt="Stailika Logo" src="@/assets/logo.png" transition="scale-transition" max-width="130" />
    </div>

    <v-list nav dense shaped>
        <!-- Dashboard -->
        <v-list-item class="sidebar-item" :class="{ 'active-item': isActiveRoute('/dashboard') }" title="Dashboard" prepend-icon="mdi-home" @click="navigate('/dashboard')" />
        <v-list-item class="sidebar-item" :class="{ 'active-item': isActiveRoute('/team') }" title="Team" prepend-icon="mdi-account-group" @click="navigate('/team')" />
        <v-list-item class="sidebar-item" :class="{ 'active-item': isActiveRoute('/comments') }" title="Comments / Feedback" prepend-icon="mdi-message-text" @click="navigate('/comments')" />
        <v-list-item class="sidebar-item" :class="{ 'active-item': isActiveRoute('/gallery') }" title="Gallery" prepend-icon="mdi-image-multiple" @click="navigate('/gallery')" />

        <!-- Website Configuration -->
        <v-list-group prepend-icon="mdi-web" append-icon="mdi-menu-right" no-action>
            <template #activator="{ props }">
                <v-list-item v-bind="props" class="sidebar-item" :class="{ 'active-item': isConfigRouteActive }" title="Configurations" />
            </template>

            <!-- Configuration sections -->
            <v-list-item v-for="(item, i) in configItems" :key="i" class="sidebar-subitem" :class="{ 'active-subitem': isActiveRoute(item.route, true) }" :title="item.title" :prepend-icon="item.icon" @click="navigate(item.route)" />
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
                    title: "Change Password",
                    icon: "mdi-lock",
                    route: "/change-password",
                },
            ],
        };
    },
    computed: {
        isConfigRouteActive() {
            return this.configItems.some((item) =>
                this.isActiveRoute(item.route, true)
            );
        },
    },
    methods: {
        navigate(route) {
            this.$router.push(route);
            this.$emit("select-section", route);
        },
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
/* Sidebar container */
.sidebar-container {

    min-height: 100vh;
    padding-top: 20px;
 
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);

}

/* Logo */
.logo-container {
    display: flex;
    justify-content: center;
    margin-bottom: 35px;
}

/* Main Items */
.sidebar-item {
    color: #0c0c0c;
    font-weight: 600;
    cursor: pointer;
    border-radius: 10px;
    margin: 6px 10px;
    padding: 10px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
}

.sidebar-item:hover {
    background: linear-gradient(90deg, #06923e, #b87c4c);
    color: #ffffff;
    box-shadow: 0 3px 8px rgba(6, 146, 62, 0.25);
    transform: translateX(3px);
}

.active-item {
    background: linear-gradient(90deg, #06923e, #b87c4c);
    color: #ffffff !important;
    font-weight: 700;
    box-shadow: 0 4px 12px rgba(6, 146, 62, 0.3);
}

/* Sub Items */
.sidebar-subitem {
    color: #444444;
    padding-left: 50px;
    font-weight: 500;
    cursor: pointer;
    border-radius: 8px;
    margin: 4px 14px;
    padding: 8px;
    transition: all 0.3s ease;
}

.sidebar-subitem:hover {
    background: linear-gradient(90deg, #06923e, #b87c4c);
    color: #ffffff;
    box-shadow: 0 3px 8px rgba(6, 146, 62, 0.25);
}

.active-subitem {
    background: linear-gradient(90deg, #06923e, #b87c4c);
    color: #ffffff !important;
    font-weight: 600;
    box-shadow: 0 3px 8px rgba(184, 124, 76, 0.3);
}
</style>
