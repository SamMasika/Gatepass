import axios from "axios";

const defaultUser = {
  id: null,
  first_name: "",
  middle_name: null,
  last_name: "",
  email: "",
  phone: "",
  current_gate:null,
  roles: []
};

export default {
  namespaced: true,

  state: {
    access_token: localStorage.getItem("access_token") || null,
    expires_in: localStorage.getItem("expires_in") || null,
    user: defaultUser
  },

  getters: {
    authenticated: (state) => {
      return !!state.access_token && !!state.user?.id;
    },

    user: (state) => state.user,

    hasRole: (state) => (roleName) => {
      return (state.user.roles || []).some(
        role => role.name === roleName
      );
    },

    hasPermission: (state) => (permissionName) => {
      const roles = state.user.roles || [];

      for (const role of roles) {
        const permissions = role.permissions || [];

        if (permissions.some(p => p.name === permissionName)) {
          return true;
        }
      }

      return false;
    }
  },

  mutations: {
    SET_TOKEN(state, { token, expires_in }) {
      state.access_token = token;
      state.expires_in = expires_in;

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } else {
        delete axios.defaults.headers.common["Authorization"];
      }
    },

    SET_USER(state, user) {
      //  force full reactivity reset
      state.user = JSON.parse(JSON.stringify(user));
    }
  },

  actions: {
    // =========================
    // LOGIN
    // =========================
    async login({ commit, dispatch }, credentials) {
      try {
        const response = await axios.post("/login", credentials);

        if (response.data.status === "success") {
          const { token, expires_in, user } = response.data.data;

          commit("SET_TOKEN", { token, expires_in });
          commit("SET_USER", user);
          

          localStorage.setItem("access_token", token);
          localStorage.setItem("expires_in", expires_in);

          // ⚡ IMPORTANT: always sync from backend (prevents stale permissions)
          await dispatch("attempt", token);

          return {
            status: "success",
            message: response.data.message,
            code: response.data.code
          };
        }

        return {
          status: "error",
          message: response.data.message || "Login failed"
        };
      } catch (error) {
        return {
          status: "error",
          message: error.response?.data?.message || "Login request failed"
        };
      }
    },

    // =========================
    // AUTH RESTORE (KEY FIX )
    // =========================
    async attempt({ commit }, access_token) {
      try {
        if (access_token) {
          commit("SET_TOKEN", {
            token: access_token,
            expires_in: localStorage.getItem("expires_in")
          });
        }

        if (!access_token) return;

        const response = await axios.get("/me");

        const user = response.data.data;

        commit("SET_USER", user);

      } catch (error) {
        console.error("Auth attempt failed:", error);

        commit("SET_TOKEN", { token: null, expires_in: null });
        commit("SET_USER", defaultUser);

        localStorage.removeItem("access_token");
        localStorage.removeItem("expires_in");
      }
    },

    // =========================
    // LOGOUT
    // =========================
    async logout({ commit }) {
      try {
        await axios.get("/logout");
      } catch (e) {
        console.warn("Logout request failed but continuing");
      }

      commit("SET_TOKEN", { token: null, expires_in: null });
      commit("SET_USER", defaultUser);

      localStorage.removeItem("access_token");
      localStorage.removeItem("expires_in");
      localStorage.removeItem("user");

      delete axios.defaults.headers.common["Authorization"];
    },

    // =========================
    // FORCE REFRESH USER
    // =========================
    async refreshAuth({ dispatch, state }) {
      if (!state.access_token) return;

      await dispatch("attempt", state.access_token);
    }
  }
};