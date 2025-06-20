import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getConversation, startConversation } from "../../api/conversation";

// Initial state
const initialState = {
  activeChat: null,
  isMenuOpen: false,
  isSpinModelOpen: false,
  supplierId: null,
  productId: null,
  supplierName: null,
  productName: null,
  loading: false,
  chat: null,
  error: null,
  conversationId: null,
  allChats: [],
  filterdChats: [],
  activeConversation: null,
};

// Async thunk
export const startConversationThunk = createAsyncThunk(
  "chat/startConversation",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setChatInfo(data));
      const response = await startConversation(data);
      // console.log(response        , "xxxxxxxxxxxxxxxxxxxx");
      if (response.status === 401) {
        dispatch(closeChat());
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

export const getChatThunk = createAsyncThunk(
  "chat/getChat",
  async (id, { rejectWithValue }) => {
    // console.log(id, "idxxxxxxxxxxxxxxxxxxx");
    try {
      const response = await getConversation(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { detail: "Something" });
    }
  }
);
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
    openSpinModel: (state) => {
      state.isSpinModelOpen = true;
      state.activeChat = null;
      state.isMenuOpen = false;
    },
    closeSpinModel: (state) => {
      state.isSpinModelOpen = false;
      state.activeChat = null;
      state.isMenuOpen = false;
    },
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
      if (state.isMenuOpen) {
        state.activeChat = null;
      }
    },
    openChatingPopup: (state, action) => {
      // console.log("action");
      state.activeChat = "popup";
      state.isMenuOpen = true;
      // console.log(action.payload, "action.payload.chat");
      state.supplierName = action.payload.fullName;
      state.conversationId = action.payload.id;
    },
    setConversationId: (state, action) => {
      if (state.conversationId === action.payload) {
        state.conversationId = null;
        state.activeConversation = null;
      } else {
        state.conversationId = action.payload;

        const chat = state.allChats.filter(
          (chat) => chat.id === state.conversationId
        );
        state.activeConversation = chat[0];
      }
    },
    setAllChats: (state, action) => {
      state.allChats = action.payload;
      console.log(state.allChats, "state.allChats");
    },
    updateLastMessage: (state, action) => {
      const chatIndex = state.filterdChats.findIndex(
        (chat) => chat.id === state.conversationId
      );
      if (chatIndex !== -1) {
        state.filterdChats[chatIndex].lastMessage = action.payload;
        state.filterdChats[chatIndex].lastMessageTime =
          new Date().toISOString();
      }
      console.log(state.filterdChats, "state.allChats");
    },
    setFilterdChats: (state, action) => {
      state.filterdChats = action.payload;
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
        // console.log(state.conversationId, "state.conversationId");
        // console.log(state.supplierName, "state.supplierName");
        // console.log(state.activeChat, "state.activeChat");
        // console.log(state.isMenuOpen, "state.isMenuOpen");
      })
      .addCase(startConversationThunk.rejected, (state, action) => {
        state.loading = false;
        if (action.payload?.status === 401) {
          state.error = action.payload;
        }
      })
      .addCase(getChatThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getChatThunk.fulfilled, (state, action) => {
        state.loading = false;
        // console.log(action.payload, "action.payload");
        state.chat = action.payload;
      })
      .addCase(getChatThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
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
  openChatingPopup,
  setConversationId,
  setAllChats,
  setFilterdChats,
  updateLastMessage,
  openSpinModel,
  closeSpinModel,
} = chatSlice.actions;

// Selectors
export const selectActiveChat = (state) => state.chat.activeChat;
export const selectIsMenuOpen = (state) => state.chat.isMenuOpen;
export const selectChatLoading = (state) => state.chat.loading;

// Reducer
export default chatSlice.reducer;
