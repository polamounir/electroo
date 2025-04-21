import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import supplierReducer from "./slices/supplierSLice";
import cartReducer from "./slices/cartSlice";
import addAddressModelReducer from "./slices/addAddressModelSlice";
import popupReducer from "./slices/popupSlice";
import chatbotReducer from "./slices/chatbotSlice";
import chatReducer from "./slices/chatSlice";
import { setupAxiosInterceptors } from "../api/axiosInstance";

const store = configureStore({
  reducer: {
    auth: authReducer,
    supplier: supplierReducer,
    cart: cartReducer,
    addressModel: addAddressModelReducer,
    popup: popupReducer,
    chatbot: chatbotReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["your-non-serializable-action-type"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["meta.arg", "payload.timestamp"],
        // Ignore these paths in the state
        ignoredPaths: ["items.dates"],
      },
    }),
});

// Setup axios interceptors with store
setupAxiosInterceptors(store);

export default store;
