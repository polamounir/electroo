import { api } from "./axiosInstance";

export const getUserData = async () => {
  try {
    const response = await api.get("/users/me");
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      switch (error.response.status) {
        case 401:
          throw new Error("Unauthorized: Please login again");
        case 403:
          throw new Error(
            "Forbidden: You do not have permission to access this resource"
          );
        case 404:
          throw new Error("User not found");
        case 500:
          throw new Error("Server error: Please try again later");
        default:
          throw new Error(
            error.response.data?.message ||
              "An error occurred while fetching user data"
          );
      }
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error("Network error: Please check your internet connection");
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error("Error setting up the request");
    }
  }
};
