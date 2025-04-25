import Cookies from "js-cookie";

class TokenStorageService {
  static TOKEN_KEY = "accessToken";
  static REFRESH_TOKEN_KEY = "refreshToken";
  static EMAIL_KEY = "email";

  static getAccessToken() {
    return Cookies.get(this.TOKEN_KEY);
  }

  static setAccessToken(token) {
    Cookies.set(this.TOKEN_KEY, token);
  }

  static getRefreshToken() {
    return Cookies.get(this.REFRESH_TOKEN_KEY);
  }

  static setRefreshToken(token) {
    Cookies.set(this.REFRESH_TOKEN_KEY, token);
  }

  static getEmail() {
    return Cookies.get(this.EMAIL_KEY);
  }

  static setEmail(email) {
    Cookies.set(this.EMAIL_KEY, email);
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
      return Date.now() >= expirationTime;
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return true; 
    }
  }

  static clearTokens() {
    Cookies.remove(this.TOKEN_KEY);
    Cookies.remove(this.REFRESH_TOKEN_KEY);
    Cookies.remove(this.EMAIL_KEY);
  }
}

export default TokenStorageService;
