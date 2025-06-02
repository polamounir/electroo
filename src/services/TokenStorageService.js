import Cookies from "js-cookie";

class TokenStorageService {
  static TOKEN_KEY = "accessToken";
  static REFRESH_TOKEN_KEY = "refreshToken";
  static EMAIL_KEY = "email";

  static getAccessToken() {
    Cookies.get("accessToken");
    localStorage.getItem("accessToken");
    if (Cookies.get("accessToken")) {
      return Cookies.get("accessToken");
    }
    if (localStorage.getItem("accessToken")) {
      return localStorage.getItem("accessToken");
    }
    return;
  }

  static setAccessToken(token) {
    Cookies.set("accessToken", token);
    localStorage.setItem("accessToken", token);
  }

  static getRefreshToken() {
    Cookies.get("refreshToken");
    localStorage.getItem("refreshToken");
    if (Cookies.get("refreshToken")) {
      return Cookies.get("refreshToken");
    }
    if (localStorage.getItem("refreshToken")) {
      return localStorage.getItem("refreshToken");
    }
    return;
  }

  static setRefreshToken(token) {
    Cookies.set("refreshToken", token);
    localStorage.setItem("refreshToken", token);
  }

  static getEmail() {
    Cookies.get("email");
    localStorage.getItem("email");
    if (Cookies.get("email")) {
      return Cookies.get("email");
    }

    if (localStorage.getItem("email")) {
      return localStorage.getItem("email");
    }
    return;
  }

  static setEmail(email) {
    Cookies.set("email", email);
    localStorage.setItem("email", email);
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
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("email");
  }
}

export default TokenStorageService;
