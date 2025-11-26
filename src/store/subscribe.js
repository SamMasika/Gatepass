import store from "@/store";
import axios from "axios";
import router from "@/router";

let logoutTimer;
let idleTimer;
let interceptorId = null;
let isLoggingOut = false;
let isLoggedIn = false; // ✅ track true/false login state

// --- Vuex Token Watcher ---
store.subscribe((mutation) => {
  if (mutation.type === "auth/SET_TOKEN") {
    const token = mutation.payload?.token;
    const expiresIn = mutation.payload?.expires_in;

    if (token) {
      isLoggedIn = true;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      startSessionTimeout(expiresIn);
      attachInterceptor();
    } else {
      clearTimers();
      detachInterceptor();
      delete axios.defaults.headers.common["Authorization"];
      isLoggedIn = false;
    }
  }
});

// --- Axios 401 Interceptor ---
function attachInterceptor() {
  if (interceptorId !== null) return;
  interceptorId = axios.interceptors.response.use(
    (res) => res,
    (err) => {
      if (
        err.response &&
        err.response.status === 401 &&
        !isLoggingOut &&
        isLoggedIn // ✅ only if actually logged in
      ) {
        logout("401 Unauthorized");
      }
      return Promise.reject(err);
    }
  );
}

function detachInterceptor() {
  if (interceptorId !== null) {
    axios.interceptors.response.eject(interceptorId);
    interceptorId = null;
  }
}

// --- Session Timeout ---
function startSessionTimeout(expiresIn) {
  clearTimeout(logoutTimer);
  const timeout = (expiresIn || 86400) * 1000;
  logoutTimer = setTimeout(() => logout("Token Expired"), timeout);
}

// --- Idle Timeout ---
const IDLE_TIMEOUT = 10 * 60 * 1000; // 2 mins

function startIdleTimeout() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => logout("Idle Timeout"), IDLE_TIMEOUT);
}

function resetIdleTimeout() {
  clearTimeout(idleTimer);
  if (isLoggedIn) startIdleTimeout(); // ✅ only if logged in
}

function clearTimers() {
  clearTimeout(logoutTimer);
  clearTimeout(idleTimer);
}

// --- Logout (Single Entry Point) ---
async function logout(reason = "Manual Logout") {
  if (isLoggingOut) return;
  isLoggingOut = true;
  console.log("🔴 Logging out:", reason);

  clearTimers();
  detachInterceptor();
  delete axios.defaults.headers.common["Authorization"];
  removeIdleListeners();

  try {
    await store.dispatch("auth/logout");
  } catch (e) {
    console.warn("Logout dispatch error:", e);
  } finally {
    isLoggedIn = false;
    isLoggingOut = false;
    if (router.currentRoute.path !== "/") {
      router.push("/");
    }
  }
}

// --- Activity Listeners ---
function resetIdleTimeoutOnActivity() {
  ["mousemove", "mousedown", "keydown", "touchstart", "scroll"].forEach((event) =>
    document.addEventListener(event, resetIdleTimeout, { passive: true })
  );
}

function removeIdleListeners() {
  ["mousemove", "mousedown", "keydown", "touchstart", "scroll"].forEach((event) =>
    document.removeEventListener(event, resetIdleTimeout)
  );
}

resetIdleTimeoutOnActivity();
