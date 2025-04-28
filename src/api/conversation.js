import { api } from "./axiosInstance";

export const startConversation = async (data) => {
  try {
    const response = await api.post("/conversations/start", data);
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

export const getConversation = async (id) => {
  try {
    const response = await api.get(`/conversation/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};
