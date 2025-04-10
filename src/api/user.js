import { api } from "./axiosInstance";

export const registerNewUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const confirmAccount = async (userData) => {
  const response = await api.post("/auth/confirm-email", userData);
  return response.data;
};

export const loginUserFn = async (userData) => {
  const response = await api.post("/auth/login", userData);
  return response.data;
}; 


export const getUserDataFn = async () => {
  const response = await api.get("/auth/me");
  return response.data;
}; 
