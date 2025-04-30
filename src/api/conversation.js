import { api } from "./axiosInstance";

export const startConversation = async (data) => {
  try {
    console.log(data, "data");
    const response = await api.post("/conversations/start", data);
    console.log(response);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

export const getConversation = async (id) => {
  try {
    const response = await api.get(`/conversations/${id}/messages?Page=1&Limit=100`);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};
