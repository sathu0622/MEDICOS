// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:4000", // adjust to your backend
//   withCredentials: true, // send cookies automatically
// });

// // Response interceptor: auto-refresh on 401
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // If token expired (401) and we haven't retried yet
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // Try refreshing
//         await api.post("/UserOperations/refresh");
//         // Retry original request
//         return api(originalRequest);
//       } catch (err) {
//         console.error("Refresh token expired or invalid", err);
//         window.location.href = "/login"; // redirect to login
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;
// src/services/api.js

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000", // adjust to your backend
  withCredentials: true, // send cookies automatically
});

let csrfToken = null;

export async function initCsrf() {
  try {
    const resp = await api.get("/csrf-token");

    csrfToken = resp.data.csrfToken;

    // Attach token as default header
    api.defaults.headers.common["X-CSRF-Token"] = csrfToken;

    console.log("✅ CSRF token initialized:", csrfToken);

    // Debugging: check if cookie came along
    const cookies = document.cookie;
    if (cookies.includes("_csrf")) {
      console.log("✅ _csrf cookie is set in browser:", cookies);
    } else {
      console.warn("⚠️ _csrf cookie NOT found in document.cookie. Check CORS/withCredentials.");
    }
  } catch (err) {
    console.error("❌ Failed to fetch CSRF token:", err);
  }
}

// Interceptor: attach token automatically
api.interceptors.request.use(
  (config) => {
    if (
      csrfToken &&
      ["post", "put", "delete", "patch"].includes(config.method)
    ) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Response interceptor: auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh access token
        await api.post("/UserOperations/refresh");
        // Retry original request
        return api(originalRequest);
      } catch (err) {
        console.error("Refresh token expired or invalid", err);
        window.location.href = "/login"; // redirect to login
      }
    }

    // Handle invalid CSRF token
    if (error.response?.status === 403 && error.response?.data?.message === "Invalid CSRF token") {
      console.warn("Invalid CSRF token, re-initializing...");
      await initCsrf();
      // retry original request with new token
      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default api;
