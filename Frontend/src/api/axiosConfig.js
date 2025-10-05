import axios from "axios";
import { auth } from "../Firebase/fireBase";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add authentication token to requests
api.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        // Force refresh to get a fresh token (true parameter)
        const token = await user.getIdToken(true);
        config.headers.Authorization = `Bearer ${token}`;
        console.log(
          "🔑 Token added to request:",
          token.substring(0, 20) + "..."
        );
      } else {
        console.warn("⚠️ No user found when trying to add token");
      }
    } catch (error) {
      console.error("❌ Error getting token:", error);
    }
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      console.error("🚫 403 Forbidden - Token issue:", error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;
