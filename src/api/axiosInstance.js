// import Cookies from "js-cookie";
// import axios from "axios";
// const API_URL = import.meta.env.VITE_API_BASE_URL;

// export const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
// });

// api.interceptors.request.use(
//   (config) => {
//     const accessToken = Cookies.get("accessToken");
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );


import Cookies from "js-cookie";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// We'll create a function that will be called after store is initialized
export const setupAxiosInterceptors = (store) => {
  // Response interceptor to handle token refresh
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If error is 401 and we haven't tried refreshing yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Get refresh token from cookies
          const refreshToken = Cookies.get("refreshToken");

          if (!refreshToken) {
            // No refresh token available, logout user
            store.dispatch({ type: "auth/logOut" });
            return Promise.reject(error);
          }

          // Call refresh token endpoint
          const response = await axios.post(
            `${API_URL}/auth/refresh-token`,
            { refreshToken },
            { withCredentials: true }
          );

          // Get new tokens from response
          const { accessToken, refreshToken: newRefreshToken } = response.data;

          // Save tokens to cookies
          Cookies.set("accessToken", accessToken, {
            secure: true,
            sameSite: "strict",
          });
          Cookies.set("refreshToken", newRefreshToken, {
            secure: true,
            sameSite: "strict",
          });

          // Update redux state
          store.dispatch({
            type: "auth/setCredentials",
            payload: { accessToken, refreshToken: newRefreshToken },
          });

          // Update authorization header and retry original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // If refresh fails, logout user
          store.dispatch({ type: "auth/logOut" });
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

// Helper functions for auth operations
export const authService = {
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    const { accessToken, refreshToken, user } = response.data;

    // Save tokens to cookies
    Cookies.set("accessToken", accessToken, {
      secure: true,
      sameSite: "strict",
    });
    Cookies.set("refreshToken", refreshToken, {
      secure: true,
      sameSite: "strict",
    });

    return { accessToken, refreshToken, user };
  },

  // logout: () => {
  //   Cookies.remove("accessToken");
  //   Cookies.remove("refreshToken");

  //   // Optionally call logout API endpoint
  //   // return api
  //   //   .post("/auth/logout")
  //   //   .catch((err) => console.error("Logout error:", err));
  // },

  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
};