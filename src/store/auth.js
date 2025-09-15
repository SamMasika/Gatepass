import axios from "axios";

export default {
  namespaced: true,
  state: {
    access_token: null,
    expires_in: null,
    user: {
      id: null,
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      roles: []
    }
  },
  getters: {
    authenticated(state) {
      return !!state.access_token && !!state.user.id;
    },
    user(state) {
      return state.user;
    },
    hasRole: (state) => (role) => {
      return state.user.roles?.includes(role) || false;
    }
  },
  mutations: {
    SET_TOKEN(state, { token, expires_in }) {
      state.access_token = token;
      state.expires_in = expires_in;
    },
    SET_USER(state, user) {
      state.user = user;
    }
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await axios.post("/login", credentials);

        if (response.data.status === "success") {
          const { token, expires_in, user } = response.data.data;

          // Save in state
          commit("SET_TOKEN", { token, expires_in });
          commit("SET_USER", user);

          // Save in localStorage for persistence
          localStorage.setItem("access_token", token);
          localStorage.setItem("expires_in", expires_in);
          localStorage.setItem("user", JSON.stringify(user));

          return {
            status: "success",
            message: response.data.message,
            code: response.data.code
          };
        } else {
          return {
            status: "error",
            message: response.data.message || "Login failed"
          };
        }
      } catch (error) {
        return {
          status: "error",
          message: error.response?.data?.message || "Login request failed"
        };
      }
    },

    logout({ commit }) {
      return axios.get("/logout").finally(() => {
        // Clear Vuex state
        commit("SET_TOKEN", { token: null, expires_in: null });
        commit("SET_USER", {
          id: null,
          firstname: "",
          lastname: "",
          email: "",
          phone: "",
          roles: []
        });

        // Clear localStorage
        localStorage.removeItem("access_token");
        localStorage.removeItem("expires_in");
        localStorage.removeItem("user");

        // Clear axios headers
        delete axios.defaults.headers.common["Authorization"];
      });
    }

  }
};
