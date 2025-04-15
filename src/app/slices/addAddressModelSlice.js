import { createSlice } from "@reduxjs/toolkit";

const addAddressModelSlice = createSlice({
  name: "addAddressModel",
  initialState: {
    isOpen: false,
    id: "",
  },
  reducers: {
    openAddressModel: (state) => {
      state.isOpen = true;
    },
    closeAddressModel: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openAddressModel, closeAddressModel } =
  addAddressModelSlice.actions;

export default addAddressModelSlice.reducer;
