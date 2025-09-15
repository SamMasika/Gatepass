import store from "@/store";
import axios from "axios";
import router from "@/router";

const SESSION_TIMEOUT = 120 * 60 * 1000; // 120 mins
const IDLE_TIMEOUT = 7200 * 60 * 1000; // 10 mins

let logoutTimer;
let idleTimer;

// Subscribe to token changes
store.subscribe((mutation) => {
  if (mutation.type === "auth/SET_TOKEN") {
    const token = mutation.payload?.token;

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      startSessionTimeout();
    } else {
      delete axios.defaults.headers.common["Authorization"];
      clearTimers();
    }
  }
});

// Intercept 401 responses and force logout
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      logout();
    }
    return Promise.reject(error);
  }
);

function startSessionTimeout() {
  logoutTimer = setTimeout(() => {
    logout();
  }, SESSION_TIMEOUT);
}

function clearSessionTimeout() {
  clearTimeout(logoutTimer);
}

function startIdleTimeout() {
  idleTimer = setTimeout(() => {
    logout();
  }, IDLE_TIMEOUT);
}

function clearIdleTimeout() {
  clearTimeout(idleTimer);
}

function resetIdleTimeout() {
  clearIdleTimeout();
  startIdleTimeout();
}

function clearTimers() {
  clearSessionTimeout();
  clearIdleTimeout();
}

async function logout() {
  await store.dispatch("auth/logout"); // ✅ Call Vuex logout
  clearTimers();
  router.push("/"); // Redirect to homepage/login
}

// Reset idle timer on activity
function resetIdleTimeoutOnActivity() {
  ["mousemove", "mousedown", "keydown", "touchstart", "scroll"].forEach((event) => {
    document.addEventListener(event, resetIdleTimeout, { passive: true });
  });
}

startSessionTimeout();
resetIdleTimeoutOnActivity();
