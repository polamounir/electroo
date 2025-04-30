import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { startConversation } from "../../api/conversation";

const initialState = {
  isOpen: false,
  supplierName: "",
  conversationId: "",
  productId: "",
  loading: false,
  error: null,
  messages: [],
};

export const startConversationThunk = createAsyncThunk(
  "chat/startConversation",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      //   dispatch(setChatInfo(data));
      const response = await startConversation(data);
      console.log(response);
      if (response.status === 401) {
        dispatch(closeChatPopup());
        return rejectWithValue({
          detail: "يجب عليك تسجيل الدخول للبدء بالمحادثة",
          status: 401,
        });
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { detail: "Something" });
    }
  }
);



const chatPopupSlice = createSlice({
  name: "chatPopup",
  initialState,
  reducers: {
    openOldChatPopup: (state, action) => {
      state.isOpen = true;

      state.conversationId = action.payload.conversationId;
      state.supplierName = action.payload.fullName;
    },
    closeChatPopup: (state) => {
      state.isOpen = false;
    },
    toggleChatPopup: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startConversationThunk.pending, (state) => {
        state.loading = true;
        state.error = null;

      })
      .addCase(startConversationThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.conversationId = action.payload.conversationId;
      })
      .addCase(startConversationThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { openOldChatPopup, closeChatPopup, toggleChatPopup } =
  chatPopupSlice.actions;

export default chatPopupSlice.reducer;
