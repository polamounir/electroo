import Cookies from "js-cookie";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add request interceptor to include access token
api.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const Token = Cookies.get("refreshToken");

        // Send refreshToken in the request body
        const response = await axios.post(
          `${API_URL}auth/refresh-token`,
          { refreshToken: Token },
          {
            withCredentials: true,
          }
        );

        const { accessToken, refreshToken, email } = response.data.data;
        console.log("hhhhhhhhhhhhhhhhhhhhhhhh",response.data.data)

        // Store new tokens in cookies
        Cookies.set("accessToken", accessToken);
        Cookies.set("refreshToken", refreshToken);
        Cookies.set("email", email);


        // Update the original request with new access token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
