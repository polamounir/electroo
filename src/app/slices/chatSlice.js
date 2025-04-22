import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeChat: null,
  isMenuOpen: false,
  supplierId: null,
  productId: null,
  productName: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatInfo: (state, action) => {
      state.supplierId = action.payload.supplierId;
      state.productId = action.payload.productId;
      state.productName = action.payload.productName;
      state.isMenuOpen = true;
      state.activeChat = "popup";
    },
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

export const {setChatInfo, openChatBot, openChatPopup, closeChat, toggleMenu } =
  chatSlice.actions;

// Selectors
export const selectActiveChat = (state) => state.chat.activeChat;
export const selectIsMenuOpen = (state) => state.chat.isMenuOpen;

export default chatSlice.reducer;
