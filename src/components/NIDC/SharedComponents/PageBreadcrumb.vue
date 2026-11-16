<template>
  <div class="premium-breadcrumb">
    <div class="breadcrumb-items">
      <!-- DASHBOARD -->
      <div class="breadcrumb-link" @click="$router.push('/dashboard')">
        <v-icon size="15" class="breadcrumb-icon">mdi-view-dashboard-outline</v-icon>
        Dashboard
      </div>

      <!-- PARENT PAGE -->
      <template v-if="parent">
        <v-icon size="16" class="breadcrumb-separator">mdi-chevron-right</v-icon>
        <div
          class="breadcrumb-link"
          @click="parentRoute && $router.push(parentRoute)"
        >
          {{ parent }}
        </div>
      </template>

      <!-- CURRENT PAGE -->
      <template v-if="title">
        <v-icon size="16" class="breadcrumb-separator">mdi-chevron-right</v-icon>
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
};
</script>

<style scoped>
.premium-breadcrumb {
  margin-bottom: 20px;
}

.breadcrumb-items {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
}

.breadcrumb-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.breadcrumb-link:hover {
  color: var(--brand);
  background: var(--surface-alt);
  transform: translateX(1px);
}

.breadcrumb-icon {
  opacity: 0.85;
}

.breadcrumb-separator {
  margin: 0 6px;
  color: var(--text-muted);
  opacity: 0.6;
}

.breadcrumb-current {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.1px;
  padding: 4px 8px;
  background: var(--surface-alt);
  border-radius: 8px;
}

/* Dark theme fine-tuning */
[data-theme="dark"] .breadcrumb-link:hover {
  background: var(--surface-alt);
}

[data-theme="dark"] .breadcrumb-current {
  background: var(--surface-alt);
}
</style>