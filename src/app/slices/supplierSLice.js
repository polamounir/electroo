import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { registerNewSupplier } from "../../api/user";
// import {  } from "../../api/user";
const initialState = {
  loggedInSupplier: null,
  supplierRegisterationData: {
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    businessName: "",
    storeName: "",
    taxNumber: "",
    nationalIdFront: null,
    nationalIdBack: null,
    taxCard: null,
    governorate: "",
    nationalId: "",
  },
  progress: 0,
  isLoading: false,
  isError: false,
  isSuccess: false,
};

const saveUserData = (userId, userName) => {
  localStorage.setItem("userId", userId);
  localStorage.setItem("email", userName);
};
export const registerSupplier = createAsyncThunk(
  "auth/registerUser",
  async (userData) => {
    try {
      const response = await registerNewSupplier(userData);
      const { userId, userName } = response.data.data;
      saveUserData(userId, userName);
      return response;
    } catch (error) {
      return error.response.data;
    }
  }
);

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
      const { fullName, email, password, phoneNumber, governorate } =
        action.payload;
      console.log(fullName, email, password, phoneNumber, governorate);
      state.supplierRegisterationData.fullName = fullName;
      state.supplierRegisterationData.email = email;
      state.supplierRegisterationData.password = password;
      state.supplierRegisterationData.phoneNumber = phoneNumber;
      state.supplierRegisterationData.governorate = governorate;
      console.log(state.supplierRegisterationData);
    },
    setSupplierBusinessData: (state, action) => {
      const { businessName, storeName, taxNumber, nationalId } = action.payload;
      //   console.log({ businessName, storeName, texNumber , nationalId});
      state.supplierRegisterationData.businessName = businessName;
      state.supplierRegisterationData.storeName = storeName;
      state.supplierRegisterationData.taxNumber = taxNumber;
      state.supplierRegisterationData.nationalId = nationalId;

      // state.supplierRegisterationData = action.payload;
      //   console.log(state.supplierRegisterationData);
    },
    setSuppllierIdFront: (state, action) => {
      //   const file = action.payload;
      //   console.log(file);

      state.supplierRegisterationData.nationalIdFront = action.payload;

      //   console.log(state.supplierRegisterationData);
    },
    setSupplierIdBack: (state, action) => {
      //   const file = action.payload;
      //   console.log(file);

      state.supplierRegisterationData.nationalIdBack = action.payload;
      //   console.log(state.supplierRegisterationData);
    },
    setSupplierTexCard: (state, action) => {
      state.supplierRegisterationData.taxCard = action.payload;
      //   console.log(state.supplierRegisterationData);
    },

    setLogedInSupplier: (state, action) => {
      state.loggedInSupplier = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerSupplier.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerSupplier.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerSupplier.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  supplierRegisterationData,
  updatesupplierRegisterationProgress,
  setSupplierBasicData,
  setSupplierBusinessData,
  setSuppllierIdFront,
  setSupplierIdBack,
  setSupplierTexCard,
  setLogedInSupplier,
} = supplierSlice.actions;
export default supplierSlice.reducer;
