import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/axiosInstance";

// Initial/default state
const initialState = {
  page: 1,
  limit: 20,
  viewMode: "grid",
  SearchQuery: "",
  MinimumPrice: 0,
  MaximumPrice: 10000,
  HasDiscount: false,
  SortBy: "price-low-high",
  OptionGroupName: null,
  OptionValue: null,
  CategoryId: null,
  searchResults: [],
  isLoading: false,
  error: null,
  isSearchSidebarOpen: false,
  Cursor: null,
  HasMore: true,

};

export const getSearchResults = createAsyncThunk(
  "search/getSearchResults",
  async (params, { rejectWithValue, getState }) => {
    const state = getState();
    const { Cursor, HasMore } = state.search;

    const {
      SearchQuery,
      MinimumPrice = 0,
      MaximumPrice = 10000,
      HasDiscount = false,
      limit = 20,
      OptionGroupName,
      OptionValue,
      CategoryId,
    } = params;

    try {
      const response = await api.get("/products", {
        params: {
          SearchQuery: SearchQuery|| "",
          Limit: limit || 10,
          MinimumPrice: MinimumPrice || 0,
          MaximumPrice: MaximumPrice|| 10000,
          HasDiscount: HasDiscount || false,
          OptionGroupName: OptionGroupName|| null,
          OptionValue: OptionValue|| null,
          CategoryId: CategoryId || null,
          Cursor: Cursor,
        },
      });

      return {
        items: response.data?.data?.items,
        cursor: response.data?.data?.cursor,
        hasMore: response.data?.data?.hasMore,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

export const getfilterSearchResults = createAsyncThunk(
  "search/getfilterSearchResults",
  async (params, { rejectWithValue, getState , dispatch }) => {
    const state = getState();
    const { Cursor, HasMore } = state.search;

    const {
      SearchQuery,
      MinimumPrice = 0,
      MaximumPrice = 10000,
      HasDiscount = false,
      limit = 10,
      OptionGroupName,
      OptionValue,
      CategoryId,
    } = params;

    try {
      const response = await api.get("/products", {
        params: {
          SearchQuery: SearchQuery || "",
          Limit: limit || 20,
          MinimumPrice: MinimumPrice || 0,
          MaximumPrice: MaximumPrice || 10000,
          HasDiscount: HasDiscount || false,
          OptionGroupName: OptionGroupName || null,
          OptionValue: OptionValue || null,
          CategoryId: CategoryId || null,
          Cursor: Cursor,
        },
      });

      return {
        items: response.data?.data?.items,
        cursor: response.data?.data?.cursor,
        hasMore: response.data?.data?.hasMore,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);



// Slice
const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchParams: (state, action) => {
      const {
        SearchQuery,
        MinimumPrice,
        MaximumPrice,
        HasDiscount,
        limit,
        viewMode,
        optionGroup,
        selectedOptionsValue,
        CategoryId,
        SortBy,
      } = action.payload;
      state.searchResults = [];
      state.Cursor = null;
      state.HasMore = true;

      if (SearchQuery !== undefined) state.SearchQuery = SearchQuery;
      if (MinimumPrice !== undefined) state.MinimumPrice = MinimumPrice;
      if (MaximumPrice !== undefined) state.MaximumPrice = MaximumPrice;
      if (HasDiscount !== undefined) state.HasDiscount = HasDiscount;
      if (optionGroup !== undefined) state.OptionGroupName = optionGroup;
      if (selectedOptionsValue !== undefined)
        state.OptionValue = selectedOptionsValue;

      if (limit !== undefined) state.limit = limit;
      if (SortBy !== undefined) state.SortBy = SortBy;
      if (viewMode !== undefined) state.viewMode = viewMode;
      if (CategoryId !== undefined) state.CategoryId = CategoryId;

      state.isSearchSidebarOpen = false;
    },
    setIsSearchSidebarOpen: (state) => {
      state.isSearchSidebarOpen = !state.isSearchSidebarOpen;
    },
    appendSearchResults: (state, action) => {
      const { cursor, hasMore, items } = action.payload;
      state.searchResults = [...state.searchResults, ...items];
      state.Cursor = cursor;
      state.HasMore = hasMore;
    },
    clearSearchResults: (state) => {
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
        const { items, cursor, hasMore } = action.payload;
        state.searchResults = [...state.searchResults, ...items];
        state.Cursor = cursor;
        state.HasMore = hasMore;
        state.error = null;
      })
      .addCase(getSearchResults.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getfilterSearchResults.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getfilterSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        // console.log("getfilterSearchResults fulfilled with items: xxxxxxxxxxxxxxxxxxxx", action.payload.items);
        const { items, cursor, hasMore } = action.payload;
        state.searchResults = items;
        state.Cursor = cursor;
        state.HasMore = hasMore;
        state.error = null;
      })
      .addCase(getfilterSearchResults.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSearchParams,
  setIsSearchSidebarOpen,
  appendSearchResults,
  clearSearchResults,
} = searchSlice.actions;
export default searchSlice.reducer;
