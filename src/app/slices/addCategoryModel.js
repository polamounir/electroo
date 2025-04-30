import { createSlice } from "@reduxjs/toolkit";

const addCategoryModelSlice = createSlice({
  name: "addCategoryModel",
  initialState: {
    isOpen: false,
    
  },
  reducers: {
    openCategoryModel: (state) => {
      state.isOpen = true;
      
    },
    closeCategoryModel: (state) => {
      state.isOpen = false;

    },
  },
});

export const { openCategoryModel, closeCategoryModel } = addCategoryModelSlice.actions;

export default addCategoryModelSlice.reducer;
