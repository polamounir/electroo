import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    supplierRegisterationData:{},
    progress: 0,
    isLoading: false,
    isError: false,
    isSuccess: false,
}
const supplierSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {
    supplierRegisterationData: (state, action) => {
      state.supplierRegisterationData = action.payload;
    },
    updatesupplierRegisterationProgress: (state, action) => {
      state.progress = action.payload;
    },
  },
});

export const { supplierRegisterationData, updatesupplierRegisterationProgress } =
  supplierSlice.actions;
export default supplierSlice.reducer
