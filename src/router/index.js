import { createRouter, createWebHashHistory } from "vue-router";
import store from "@/store";

/* =========================
   IMPORT PAGES
========================= */
import Login from "@/components/NIDC/Auth/Login.vue";
import Master from "@/components/NIDC/Layout/Master.vue";
import Dashboard from "@/components/NIDC/Layout/Dashboard.vue";
import Changepassword from "@/components/NIDC/Settings/Changepassword.vue";
import Profile from "@/components/NIDC/Layout/Profile.vue";
import Users from "@/components/NIDC/Settings/Users/Users.vue";
import Roles from "@/components/NIDC/Settings/Roles/Roles.vue";
import Logs from "@/components/NIDC/Settings/Logs/Logs.vue";
import Gatepass from "@/components/NIDC/Gatepass/Passes.vue";
import CreateGatePass from "@/components/NIDC/Gatepass/Create.vue";
import Company from "@/components/NIDC/Settings/Company/Company.vue";
import Section from "@/components/NIDC/Settings/Staff/Section.vue";
import Staff from "@/components/NIDC/Settings/Staff/Staff.vue";

import VisitPurpose from "@/components/NIDC/Gatepass/visitPurpose.vue";
import AccessArea from "@/components/NIDC/Gatepass/accessArea.vue";
import SecurityDashboard from "@/components/NIDC/Layout/SecurityDashboard.vue";
import StaffDashboard from "@/components/NIDC/Layout/StaffDashboard.vue";
import ActivePasses from "@/components/NIDC/Gatepass/activePasses.vue";
import Archive from "@/components/NIDC/Gatepass/Archive.vue";
import GatepassRecords from "@/components/NIDC/Gatepass/GatepassRecords.vue";

/* =========================
   HELPERS (IMPORTANT FIX)
========================= */

/**
 * Use SAME permission logic as sidebar (Vuex getter)
 */
function hasPermission(permission) {
  return store.getters["auth/hasPermission"](permission);
}

/**
 * Landing route based on permissions
 */
function getLandingRoute() {
  const routes = [
    { permission: "DASHBOARD_ACCESS", route: "dashboard" },
    // { permission: "GATEPASS_ACCESS", route: "gate-pass" },
    { permission: "SECURITY_DASHBOARD", route: "security-dashboard" },
    { permission: "STAFF_DASHBOARD", route: "staff-dashboard" },
    { permission: "GATEPASS_CREATE", route: "create-pass" },
    { permission: "STAFF_ACCESS", route: "staff" },
    { permission: "USER_ACCESS", route: "users" },
    { permission: "ROLE_ACCESS", route: "roles" },
    { permission: "COMPANY_ACCESS", route: "companies" },
    { permission: "SECTION_ACCESS", route: "sections" },
    { permission: "LOG_ACCESS", route: "logs" },
    { permission: "VISIT_PURPOSE_ACCESS", route: "visit-purposes" },
    { permission: "AREA_ACCESS", route: "access-areas" },
  ];

  for (const r of routes) {
    if (hasPermission(r.permission)) {
      return r.route;
    }
  }

  // IMPORTANT: must always be public-safe route
  return "profile"; // or "dashboard" ONLY if dashboard is always accessible
}

/* =========================
   ROUTES
========================= */

const routes = [
  {
    path: "/",
    name: "login",
    component: Login,
    meta: { guest: true },
  },

  {
    path: "/",
    component: Master,
    meta: { requiresAuth: true },

    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: Dashboard,
        meta: { permission: "DASHBOARD_ACCESS" },
      },

      {
        path: "change-password",
        name: "change-password",
        component: Changepassword,
      },

      {
        path: "profile",
        name: "profile",
        component: Profile,
      },

      {
        path: "security-dashboard",
        name: "security-dashboard",
        component: SecurityDashboard,
        meta: { permission: "SECURITY_DASHBOARD" },
      },
      {
        path: "staff-dashboard",
        name: "staff-dashboard",
        component: StaffDashboard,
        meta: { permission: "STAFF_DASHBOARD" },
      },

      {
        path: "users",
        name: "users",
        component: Users,
        meta: { permission: "USER_ACCESS" },
      },

      {
        path: "roles",
        name: "roles",
        component: Roles,
        meta: { permission: "ROLE_ACCESS" },
      },

      {
        path: "companies",
        name: "companies",
        component: Company,
        meta: { permission: "COMPANY_ACCESS" },
      },

      {
        path: "sections",
        name: "sections",
        component: Section,
        meta: { permission: "SECTION_ACCESS" },
      },

      {
        path: "staff",
        name: "staff",
        component: Staff,
        meta: { permission: "STAFF_ACCESS" },
      },

      {
        path: "gate-pass",
        name: "gate-pass",
        component: Gatepass,
        meta: { permission: "GATEPASS_ACCESS" },
      },
      {
        path: "active-passes",
        name: "active-passes",
        component: ActivePasses,
        meta: { permission: "GATEPASS_ACCESS" },
      },
      {
        path: "gate-pass/:id/activities",           // ← NEW
        name: "gatepass-activities",
        component: GatepassRecords,
        meta: { permission: "GATEPASS_ACCESS" },
      },
      {
        path: "create-pass",
        name: "create-pass",
        component: CreateGatePass,
        meta: { permission: "GATEPASS_CREATE" },
      },

      {
        path: "visit-purposes",
        name: "visit-purposes",
        component: VisitPurpose,
        meta: { permission: "VISIT_PURPOSE_ACCESS" },
      },
      {
        path: "archive",
        name: "archive",
        component: Archive,
        meta: { permission: "GATEPASS_ACCESS" },
      },

      {
        path: "access-areas",
        name: "access-areas",
        component: AccessArea,
        meta: { permission: "AREA_ACCESS" },
      },

      {
        path: "logs",
        name: "logs",
        component: Logs,
        meta: { permission: "LOG_ACCESS" },
      },
    ],
  },
];

/* =========================
   ROUTER
========================= */

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

/* =========================
   GLOBAL GUARD (FIXED)
========================= */

router.beforeEach((to, from, next) => {
  const authenticated = store.getters["auth/authenticated"];

  // prevent infinite redirect loop
  if (from.name === to.name) {
    return next();
  }

  if (to.meta.guest && authenticated) {
    const landing = getLandingRoute();
    if (to.name !== landing) {
      return next({ name: landing });
    }
    return next();
  }

  if (to.meta.requiresAuth && !authenticated) {
    if (to.name !== "login") {
      return next({ name: "login" });
    }
    return next();
  }

  if (to.meta.permission) {
    if (!hasPermission(to.meta.permission)) {
      const landing = getLandingRoute();
      if (to.name !== landing) {
        return next({ name: landing });
      }
      return next();
    }
  }

  next();
});
export default router;