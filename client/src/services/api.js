import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on authentication failure
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

// Dedicated Authentication API helper functions
export const authService = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("accessToken", response.data.token);
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } else {
        localStorage.setItem("user", JSON.stringify({ email }));
      }
    }
    return response.data;
  },

  signup: async (name, email, password) => {
    const response = await api.post("/auth/signup", { name, email, password });
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("accessToken", response.data.token);
      localStorage.setItem("user", JSON.stringify({ name, email }));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  },

  isAuthenticated: () => {
    return !!(localStorage.getItem("token") || localStorage.getItem("accessToken"));
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },
};

export default api;
