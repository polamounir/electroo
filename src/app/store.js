import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import supplierReducer from "./slices/supplierSLice";
import cartReducer from "./slices/cartSlice";
import addAddressModelReducer from "./slices/addAddressModelSlice";
import popupReducer from "./slices/popupSlice";
import chatbotReducer from "./slices/chatbotSlice";
import chatReducer from "./slices/chatSlice";
import addCategoryModelReducer from "./slices/addCategoryModel"
import searchReducer from "./slices/searchSlice"
import productReviewReducer from "./slices/prouctReviewSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    supplier: supplierReducer,
    cart: cartReducer,
    addressModel: addAddressModelReducer,
    popup: popupReducer,
    chatbot: chatbotReducer,
    chat: chatReducer,
    categoryModel : addCategoryModelReducer,
    search: searchReducer,
    productReview: productReviewReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
