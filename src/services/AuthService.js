import axios from "axios";
import TokenStorageService from "./TokenStorageService";

const API_URL = import.meta.env.VITE_API_BASE_URL;

class AuthService {
  static async refreshToken() {
    try {
      const refreshToken = TokenStorageService.getRefreshToken();

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await axios.post(
        `${API_URL}auth/refresh-token`,
        { refreshToken },
        { withCredentials: true }
      );

      const {
        accessToken,
        refreshToken: newRefreshToken,
        email,
      } = response.data.data;

      TokenStorageService.setAccessToken(accessToken);
      TokenStorageService.setRefreshToken(newRefreshToken);
      TokenStorageService.setEmail(email);

      return accessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      TokenStorageService.clearTokens();
      throw error;
    }
  }

  static async getAccessToken() {
    // If we have a valid token, return it
    if (
      TokenStorageService.HasAccessToken() &&
      !TokenStorageService.IsTokenExpired()
    ) {
      return TokenStorageService.getAccessToken();
    }

    // If we have a refresh token, try to get a new access token
    if (TokenStorageService.HasRefreshToken()) {
      return await this.refreshToken();
    }

    // No valid tokens available
    return null;
  }
}

export default AuthService;
