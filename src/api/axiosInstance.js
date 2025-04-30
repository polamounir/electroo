import Cookies from "js-cookie";
import axios from "axios";
import TokenStorageService from "../services/TokenStorageService";
import AuthService from "../services/AuthService";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// add the access token to the request
api.interceptors.request.use(
  (config) => {
    const accessToken = TokenStorageService.getAccessToken();
    if (accessToken) {
      // console.log("accessToken", accessToken);
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// refresh token
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await AuthService.getAccessToken();

        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("refresh errorrrrr", refreshError);
      }
    }

    return Promise.reject(error);
  }
);


api.interceptors.request.use(
  async (request) => {

    if (
      !TokenStorageService.HasAccessToken() ||
      (TokenStorageService.HasAccessToken() &&
        TokenStorageService.IsTokenExpired() &&
        TokenStorageService.HasRefreshToken())
    ) {
      try {
        const newAccessToken = await AuthService.getAccessToken();
        if (newAccessToken) {
          request.headers.Authorization = `Bearer ${newAccessToken}`;
        }
      } catch (error) {
        console.error("refresh errorrrrr", error);
      }
    } else if (
      TokenStorageService.HasAccessToken() &&
      !TokenStorageService.IsTokenExpired()
    ) {
      request.headers.Authorization = `Bearer ${TokenStorageService.getAccessToken()}`;
    }
    // console.log(request)

    return request;
  },
  (error) => Promise.reject(error)
);
