import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import supplierReducer from "./slices/supplierSLice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    supplier: supplierReducer,
  },
   middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,  
    }),
});

export default store;
