import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000", // adjust to your backend
  withCredentials: true, // send cookies automatically
});

// Response interceptor: auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired (401) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try refreshing
        await api.post("/UserOperations/refresh");
        // Retry original request
        return api(originalRequest);
      } catch (err) {
        console.error("Refresh token expired or invalid", err);
        window.location.href = "/login"; // redirect to login
      }
    }

    return Promise.reject(error);
  }
);

export default api;
