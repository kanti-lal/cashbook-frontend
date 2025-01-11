import axios from "axios";
import { apiBaseUrl } from "../utils/const";

const BASE_URL = apiBaseUrl || "http://localhost:3000/api";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to include the auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear auth data if unauthorized or forbidden
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
