import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/axiosInstance";

const initialState = {
  searchResults: [],
  isLoading: false,
  error: null,
  isSearchSidebarOpen: false,
  HasMore: true,
  Cursor: null,
  SearchQuery: "",
  MinimumPrice: 0,
  MaximumPrice: 10000,
  HasDiscount: false,
  SortBy: "price-low-high",
  CategoryId: null,
  limit: 20,
};

export const getSearchResults = createAsyncThunk(
  "search/getSearchResults",
  async (
    {
      SearchQuery,
      MinimumPrice,
      MaximumPrice,
      HasDiscount,
      SortBy,
      CategoryId,
      isLoadMore,
    },
    { getState, rejectWithValue }
  ) => {
    try {
      const { Cursor } = getState().search;
      const params = {
        SearchQuery,
        MinimumPrice,
        MaximumPrice,
        HasDiscount,
        SortBy,
        CategoryId,
        Limit: 20,
        Cursor: isLoadMore ? Cursor : null,
      };

      const response = await api.get("/products", { params });
      return {
        items: response.data.items || [],
        cursor: response.data.cursor,
        hasMore: response.data.hasMore,
        isLoadMore,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Search failed");
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    // Individual action creators for each parameter
    setSearchQuery: (state, action) => {
      state.SearchQuery = action.payload;
    },
    setMinimumPrice: (state, action) => {
      console.log(action.payload);
      state.MinimumPrice = action.payload;
    },
    setMaximumPrice: (state, action) => {
      state.MaximumPrice = action.payload;
    },
    setHasDiscount: (state, action) => {
      state.HasDiscount = action.payload;
    },
    setCategoryId: (state, action) => {
      state.CategoryId = action.payload;
    },
    setSortBy: (state, action) => {
      state.SortBy = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
    setIsSearchSidebarOpen: (state, action) => {
      state.isSearchSidebarOpen = action.payload ?? !state.isSearchSidebarOpen;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    // Optional: Reset all filters action
    resetAllFilters: (state) => {
      state.SearchQuery = "";
      state.MinimumPrice = 0;
      state.MaximumPrice = 10000;
      state.HasDiscount = false;
      state.SortBy = "price-low-high";
      state.CategoryId = null;
      state.limit = 20;
      state.searchResults = [];
      state.Cursor = null;
      state.HasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSearchResults.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Cursor = action.payload.cursor;
        state.HasMore = action.payload.hasMore;

        if (action.payload.isLoadMore) {
          state.searchResults = [
            ...state.searchResults,
            ...action.payload.items,
          ];
        } else {
          state.searchResults = action.payload.items;
        }
      })
      .addCase(getSearchResults.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export all individual actions
export const {
  setSearchQuery,
  setMinimumPrice,
  setMaximumPrice,
  setHasDiscount,
  setCategoryId,
  setSortBy,
  setLimit,
  setIsSearchSidebarOpen,
  clearSearchResults,
  resetAllFilters,
} = searchSlice.actions;

export default searchSlice.reducer;
