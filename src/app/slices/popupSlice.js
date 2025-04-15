import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  type: null, // can be 'success', 'error', 'info', etc.
  message: "",
  duration: 3000, // default duration in milliseconds
};

const popupSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    showPopup: (state, action) => {
      state.isOpen = true;
      state.type = action.payload.type;
      state.message = action.payload.message;
      state.duration = action.payload.duration || 3000;
    },
    hidePopup: (state) => {
      state.isOpen = false;
      state.type = null;
      state.message = "";
    },
  },
});

export const { showPopup, hidePopup } = popupSlice.actions;

// Selectors
export const selectPopupState = (state) => state.popup.isOpen;
export const selectPopupType = (state) => state.popup.type;
export const selectPopupMessage = (state) => state.popup.message;
export const selectPopupDuration = (state) => state.popup.duration;

export default popupSlice.reducer;
