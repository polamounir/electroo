import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import { startConversation } from "../../api/conversation";


// Async thunk
export const startConversationThunk = createAsyncThunk(
  "chat/startConversation",
  async (data, { rejectWithValue , dispatch}) => {
    try {
      dispatch(setChatInfo(data));
      const response = await startConversation(data);
      console.log(response);
      if (response.status === 401) {
        dispatch(closeChat());
        return rejectWithValue(
           { detail: "يجب عليك تسجيل الدخول للبدء بالمحادثة" , status: 401 }
        );
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { detail: "Something" }
      );
    }
  }
);

// Initial state
const initialState = {
  activeChat: null,
  isMenuOpen: false,
  supplierId: null,
  productId: null,
  supplierName: null,
  productName: null,
  loading: false,
  error: null,
  conversationId: null,
};

// Slice
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatInfo: (state, action) => {
      state.supplierId = action.payload.supplierId;
      state.productId = action.payload.productId;
      state.productName = action.payload.productName;
      state.supplierName = action.payload.supplierName;
      // state.isMenuOpen = true;
      // state.activeChat = "popup";
    },
    openChatBot: (state) => {
      state.activeChat = "bot";
      state.isMenuOpen = false;
    },
    openChatPopup: (state) => {
      state.activeChat = "popup";
      state.isMenuOpen = false;
    },
    closeChat: (state) => {
      state.activeChat = null;
      state.isMenuOpen = false;
    },
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
      if (state.isMenuOpen) {
        state.activeChat = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startConversationThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(startConversationThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.activeChat = "popup";
        state.isMenuOpen = true;
        state.supplierName = action.payload.supplierName;
        state.conversationId = action.payload.conversationId;
      })
      .addCase(startConversationThunk.rejected, (state, action) => {
        state.loading = false;
        if (action.payload?.status === 401) {
          state.error = action.payload;
        }
      });
  },
});

// Actions
export const {
  setChatInfo,
  openChatBot,
  openChatPopup,
  closeChat,
  toggleMenu,
} = chatSlice.actions;

// Selectors
export const selectActiveChat = (state) => state.chat.activeChat;
export const selectIsMenuOpen = (state) => state.chat.isMenuOpen;
export const selectChatLoading = (state) => state.chat.loading;

// Reducer
export default chatSlice.reducer;
