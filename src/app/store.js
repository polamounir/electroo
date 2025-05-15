import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import supplierReducer from "./slices/supplierSLice";
import cartReducer from "./slices/cartSlice";
import addAddressModelReducer from "./slices/addAddressModelSlice";
import popupReducer from "./slices/popupSlice";
import chatbotReducer from "./slices/chatbotSlice";
import chatReducer from "./slices/chatSlice";
import addCategoryModelReducer from "./slices/addCategoryModel";
import searchReducer from "./slices/searchSlice";
import productReviewReducer from "./slices/prouctReviewSlice";
import userSaplierChatReducer from "./slices/UserSaplierChat";
import userChatsReducer from "./slices/userChatsSlicce";
import dashboardReducer from "./slices/dashboardSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    supplier: supplierReducer,
    cart: cartReducer,
    addressModel: addAddressModelReducer,
    popup: popupReducer,
    chatbot: chatbotReducer,
    chat: chatReducer,
    categoryModel: addCategoryModelReducer,
    search: searchReducer,
    productReview: productReviewReducer,
    userSaplierChat: userSaplierChatReducer,
    userChatsMenu: userChatsReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
