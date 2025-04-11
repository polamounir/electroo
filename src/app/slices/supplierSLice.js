import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  supplierRegisterationData: {
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    businessName: "",
    storeName: "",
    texNumber: "",
    nationalId: [],
  },
  progress: 0,
  isLoading: false,
  isError: false,
  isSuccess: false,
};
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

    setSupplierBasicData: (state, action) => {
      const { fullName, email, password, phoneNumber } = action.payload;
      console.log(fullName, email, password, phoneNumber);
      state.supplierRegisterationData.fullName = fullName;
      state.supplierRegisterationData.email = email;
      state.supplierRegisterationData.password = password;
      state.supplierRegisterationData.phoneNumber = phoneNumber;
      console.log(state.supplierRegisterationData);
    },
    setSupplierBusinessData: (state, action) => {
      state.supplierRegisterationData = action.payload;
    },
    setSupplierNationalIdData: (state, action) => {
      state.supplierRegisterationData = action.payload;
    },
  },
});

export const {
  supplierRegisterationData,
  updatesupplierRegisterationProgress,
  setSupplierBasicData,
  setSupplierBusinessData,
  setSupplierNationalIdData,
} = supplierSlice.actions;
export default supplierSlice.reducer;
