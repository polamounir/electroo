import { api } from "./axiosInstance";

export const startConversation = async (data) => {
  const response = await api.post("/conversations/start", data);
  // console.log(response.data.data);
  return response.data;
};

export const getConversation = async (id) => {
  const response = await api.get(`/conversation/${id}`);
  return response.data;
};
