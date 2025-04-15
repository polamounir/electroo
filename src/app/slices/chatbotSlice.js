import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

const initialState = {
  sessionId: uuid(),
};

const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,
  reducers: {
    generateNewSessionId: (state) => {
      state.sessionId = uuid();
    },
  },
});

export const { generateNewSessionId } = chatbotSlice.actions;

// Selector
export const selectChatbotSessionId = (state) => state.chatbot.sessionId;

export default chatbotSlice.reducer;
