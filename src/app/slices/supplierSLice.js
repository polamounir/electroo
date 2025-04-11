import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { registerNewSupplier } from "../../api/user";
const initialState = {
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
    nationalId: "",
  },
  progress: 0,
  isLoading: false,
  isError: false,
  isSuccess: false,
};

export const registerSupplier = createAsyncThunk(
  "supplier/registerSupplier",
  async (userData) => {
    try {
      const response = await registerNewSupplier(userData);
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
      const { fullName, email, password, phoneNumber } = action.payload;
      //   console.log(fullName, email, password, phoneNumber);
      state.supplierRegisterationData.fullName = fullName;
      state.supplierRegisterationData.email = email;
      state.supplierRegisterationData.password = password;
      state.supplierRegisterationData.phoneNumber = phoneNumber;
      //   console.log(state.supplierRegisterationData);
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerSupplier.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerSupplier.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
      })
      .addCase(registerSupplier.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
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
} = supplierSlice.actions;
export default supplierSlice.reducer;
