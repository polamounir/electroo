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
};

export const getSearchResults = createAsyncThunk(
  "search/getSearchResults",
  async (params, { rejectWithValue }) => {
    // console.log("params", params);
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
    console.log("params", params);
    try {
      const response = await api.get("/products", {
        params: {
          SearchQuery: SearchQuery,

          Limit: limit,
          MinimumPrice: MinimumPrice,
          MaximumPrice: MaximumPrice,
          HasDiscount: HasDiscount,
          OptionGroupName: OptionGroupName,
          OptionValue: OptionValue,
          CategoryId: CategoryId,
        },
      });

      const items = response.data?.data?.items;
      //   console.log("Fetched Products:", items);
      return items;
    } catch (error) {
      console.error("API Error:", error);
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
        // sort,
        viewMode,
        optionGroup,
        selectedOptionsValue,
      } = action.payload;
      if (SearchQuery !== undefined) state.SearchQuery = SearchQuery;
      if (MinimumPrice !== undefined) state.MinimumPrice = MinimumPrice;
      if (MaximumPrice !== undefined) state.MaximumPrice = MaximumPrice;
      if (HasDiscount !== undefined) state.HasDiscount = HasDiscount;
      if (optionGroup !== undefined) state.OptionGroupName = optionGroup;
      if (selectedOptionsValue !== undefined)
        state.OptionValue = selectedOptionsValue;

      if (limit !== undefined) state.limit = limit;
      //   if (sort !== undefined) state.sort = sort;
      if (viewMode !== undefined) state.viewMode = viewMode;
      if (action.payload.CategoryId !== undefined)
        state.CategoryId = action.payload.CategoryId;

      state.isSearchSidebarOpen = false;
    },
    setIsSearchSidebarOpen: (state) => {
      state.isSearchSidebarOpen = !state.isSearchSidebarOpen;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSearchResults.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isSearchSidebarOpen = false;
      })
      .addCase(getSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
        state.isSearchSidebarOpen = false;
      })
      .addCase(getSearchResults.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isSearchSidebarOpen = false;
      });
  },
});

export const { setSearchParams, setIsSearchSidebarOpen } = searchSlice.actions;
export default searchSlice.reducer;
