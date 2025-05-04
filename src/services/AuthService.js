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
      console.log(API_URL);

      const response = await axios.post(
        `${API_URL}auth/refresh-token`,
        { refreshToken },
        { withCredentials: true }
      );

      console.log(response)
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
      // TokenStorageService.clearTokens();
      throw error;
    }
  }

  static async getAccessToken() {
    if (
      TokenStorageService.HasAccessToken() &&
      !TokenStorageService.IsTokenExpired()
    ) {
      return TokenStorageService.getAccessToken();
    }

    if (TokenStorageService.HasRefreshToken()) {
      return await this.refreshToken();
    }
    return null;
  }
}

export default AuthService;
