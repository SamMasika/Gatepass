// sessionManager.js
import store from "@/store";
import axios from "axios";
import router from "@/router";

let logoutTimer = null;
let idleTimer = null;
let interceptorId = null;
let isLoggingOut = false;
let isLoggedIn = false;

// --- Constants ---
const IDLE_TIMEOUT = 10 * 60 * 1000; // 10 minutes
const REFRESH_THRESHOLD = 60; // seconds before expiry to refresh token

// --- Vuex Token Watcher ---
store.subscribe((mutation) => {
  if (mutation.type === "auth/SET_TOKEN") {
    const token = mutation.payload?.token;
    const expiresIn = Number(mutation.payload?.expires_in);
    const refreshToken = mutation.payload?.refresh_token;
    const refreshExpiresIn = Number(mutation.payload?.refresh_expires_in);

    if (token) {
      isLoggedIn = true;
      const loginTime = Date.now();
      localStorage.setItem("login_time", loginTime);
      localStorage.setItem("access_token", token);
      localStorage.setItem("expires_in", expiresIn);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("refresh_expires_in", refreshExpiresIn);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      attachInterceptor();
      scheduleTokenRefresh(expiresIn);
      resetIdleTimeout();
    } else {
      handleLogoutCleanup();
    }
  }
});

// --- Restore session on page reload ---
(function restoreSession() {
  const token = localStorage.getItem("access_token");
  const expiresIn = Number(localStorage.getItem("expires_in"));
  const loginTime = Number(localStorage.getItem("login_time"));
  const refreshToken = localStorage.getItem("refresh_token");

  if (token && expiresIn && loginTime && refreshToken) {
    const elapsed = (Date.now() - loginTime) / 1000; // seconds
    const remaining = expiresIn - elapsed;

    if (remaining <= 0) {
      refreshAccessToken(refreshToken);
    } else {
      isLoggedIn = true;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      attachInterceptor();
      scheduleTokenRefresh(remaining);
      resetIdleTimeout();
    }
  }
})();

// --- Axios 401 Interceptor ---
function attachInterceptor() {
  if (interceptorId !== null) return;

  interceptorId = axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (
        error.response?.status === 401 &&
        !isLoggingOut &&
        isLoggedIn
      ) {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          await refreshAccessToken(refreshToken);
          // Retry the failed request
          error.config.headers["Authorization"] = `Bearer ${localStorage.getItem("access_token")}`;
          return axios(error.config);
        } else {
          logout("401 Unauthorized");
        }
      }
      return Promise.reject(error);
    }
  );
}

function detachInterceptor() {
  if (interceptorId !== null) {
    axios.interceptors.response.eject(interceptorId);
    interceptorId = null;
  }
}

// --- Token Refresh ---
function scheduleTokenRefresh(expiresIn) {
  clearTimeout(logoutTimer);
  const refreshTime = (expiresIn - REFRESH_THRESHOLD) * 1000; // refresh 60s before expiry
  logoutTimer = setTimeout(async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      await refreshAccessToken(refreshToken);
    } else {
      logout("Token Expired");
    }
  }, refreshTime);
}

async function refreshAccessToken(refreshToken) {
  try {
    const response = await axios.post("/refresh-token", { refresh_token: refreshToken });
    if (response.data.status === "success") {
      const { token, expires_in } = response.data.data;
      store.commit("auth/SET_TOKEN", { token, expires_in });
      console.log("Access token refreshed");
    } else {
      logout("Refresh Token Failed");
    }
  } catch (err) {
    logout("Refresh Token Error");
  }
}

// --- Idle Timeout ---
function startIdleTimeout() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => logout("Idle Timeout"), IDLE_TIMEOUT);
}

function resetIdleTimeout() {
  if (!isLoggedIn) return;
  startIdleTimeout();
}

// --- Logout Cleanup ---
function handleLogoutCleanup() {
  clearTimeout(logoutTimer);
  clearTimeout(idleTimer);
  detachInterceptor();
  delete axios.defaults.headers.common["Authorization"];
  removeIdleListeners();
  localStorage.removeItem("access_token");
  localStorage.removeItem("expires_in");
  localStorage.removeItem("login_time");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("refresh_expires_in");
  isLoggedIn = false;
}

// --- Logout (single entry point) ---
async function logout(reason = "Manual Logout") {
  if (isLoggingOut) return;
  isLoggingOut = true;
  console.log("🔴 Logging out:", reason);

  handleLogoutCleanup();

  try {
    await store.dispatch("auth/logout");
  } catch (e) {
    console.warn("Logout dispatch error:", e);
  } finally {
    isLoggingOut = false;
    if (router.currentRoute.value.path !== "/") {
      router.push("/");
    }
  }
}

// --- Activity Listeners ---
function resetIdleTimeoutOnActivity() {
  const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
  events.forEach((event) =>
    document.addEventListener(event, resetIdleTimeout, { passive: true })
  );
}

function removeIdleListeners() {
  const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
  events.forEach((event) =>
    document.removeEventListener(event, resetIdleTimeout)
  );
}

// --- Initialize idle detection ---
resetIdleTimeoutOnActivity();