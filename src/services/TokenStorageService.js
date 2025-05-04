import Cookies from "js-cookie";

class TokenStorageService {
  static TOKEN_KEY = "accessToken";
  static REFRESH_TOKEN_KEY = "refreshToken";
  static EMAIL_KEY = "email";

  static getAccessToken() {
    return Cookies.get("accessToken");
  }

  static setAccessToken(token) {
    Cookies.set("accessToken", token);
  }

  static getRefreshToken() {
    return Cookies.get("refreshToken");
  }

  static setRefreshToken(token) {
    Cookies.set("refreshToken", token);
  }

  static getEmail() {
    return Cookies.get("email");
  }

  static setEmail(email) {
    Cookies.set("email", email);
  }

  static HasAccessToken() {
    return !!this.getAccessToken();
  }

  static HasRefreshToken() {
    return !!this.getRefreshToken();
  }

  static IsTokenExpired() {
    const token = this.getAccessToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expirationTime = payload.exp * 1000;
      // console.log(payload);
      // console.log(expirationTime);
      return Date.now() >= expirationTime;
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return true;
    }
  }

  static clearTokens() {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("email");
  }
}

export default TokenStorageService;
