import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isChatMenuOpen: false,
  isChatPopupOpen: false,
};
const userChatsSlice = createSlice({
  name: "userChats",
  initialState,
  reducers: {
    openUserChatsMenu: (state) => {
      state.isChatMenuOpen = true;
    },
    closeUserChatsMenu: (state) => {
      state.isChatMenuOpen = false;
    },
    toggleUserChatsMenu: (state) => {
      state.isChatMenuOpen = !state.isChatMenuOpen;
    },
    openDropdownChatPopup: (state) => {
      state.isChatPopupOpen = true;
    },
    closeDropdownChatPopup: (state) => {
      state.isChatPopupOpen = false;
    },
  },
});
export const {
  openUserChatsMenu,
  closeUserChatsMenu,
  toggleUserChatsMenu,
  openDropdownChatPopup,
  closeDropdownChatPopup,
} = userChatsSlice.actions;
export default userChatsSlice.reducer;
