import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeChat: null, // null, 'bot', or 'popup'
  isMenuOpen: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    openChatBot: (state) => {
      state.activeChat = "bot";
      state.isMenuOpen = false;
    },
    openChatPopup: (state) => {
      state.activeChat = "popup";
      state.isMenuOpen = false;
    },
    closeChat: (state) => {
      state.activeChat = null;
    },
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
      if (state.isMenuOpen) {
        state.activeChat = null;
      }
    },
  },
});

export const { openChatBot, openChatPopup, closeChat, toggleMenu } =
  chatSlice.actions;

// Selectors
export const selectActiveChat = (state) => state.chat.activeChat;
export const selectIsMenuOpen = (state) => state.chat.isMenuOpen;

export default chatSlice.reducer;
