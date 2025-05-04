import Cookies from "js-cookie";
import axios from "axios";
import TokenStorageService from "../services/TokenStorageService";
import AuthService from "../services/AuthService";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Track if a token refresh is in progress
let isRefreshing = false;
let refreshSubscribers = [];

// Helper to process queued requests after token refresh
const processQueue = (error, token = null) => {
  refreshSubscribers.forEach((callback) => {
    if (error) {
      callback.reject(error);
    } else {
      callback.resolve(token);
    }
  });

  refreshSubscribers = [];
};

// Add a subscriber to the queue
const addSubscriber = (resolve, reject) => {
  refreshSubscribers.push({ resolve, reject });
};

// Add authorization token to requests
api.interceptors.request.use(
  (config) => {
    const accessToken = TokenStorageService.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token refresh on 401 responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If 401 error and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!TokenStorageService.HasRefreshToken()) {
        // No refresh token available
        TokenStorageService.clearTokens();
        return Promise.reject(error);
      }

      // If a refresh is already in progress, wait for it
      if (isRefreshing) {
        try {
          const token = await new Promise((resolve, reject) => {
            addSubscriber(resolve, reject);
          });
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      // Start the refresh process
      isRefreshing = true;

      try {
        const newAccessToken = await AuthService.refreshToken();
        isRefreshing = false;

        // Update the original request header
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Process all queued requests
        processQueue(null, newAccessToken);

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        TokenStorageService.clearTokens();
        console.error("Token refresh failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
