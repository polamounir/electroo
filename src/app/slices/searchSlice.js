import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/axiosInstance";

// Initial/default state
const initialState = {
  page: 1,
  limit: 10,
  viewMode: "grid",
  SearchQuery: "",
  MinimumPrice: 0,
  MaximumPrice: 0,
  HasDiscount: false,
  SortBy: "price-low-high",
  searchResults: [],
  isLoading: false,
  error: null,
};

export const getSearchResults = createAsyncThunk(
  "search/getSearchResults",
  async (params, { rejectWithValue }) => {
    const {
      SearchQuery,
      MinimumPrice = 0,
      MaximumPrice = 100000,
      HasDiscount = false,
      page = 1,
      limit = 20,
    } = params;
    try {
      const response = await api.get(
        "https://ecommerce.zerobytetools.com/api/products",
        {
          params: {
            SearchQuery: SearchQuery,
            Page: page,
            Limit: limit,
            MinimumPrice: MinimumPrice,
            MaximumPrice: MaximumPrice,
            HasDiscount: HasDiscount,
          },
        }
      );

      const items = response.data?.data?.items;
      console.log("Fetched Products:", items);
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
        page,
        limit,
        // sort,
        viewMode,
      } = action.payload;
      if (SearchQuery !== undefined) state.SearchQuery = SearchQuery;
      if (MinimumPrice !== undefined) state.MinimumPrice = MinimumPrice;
      if (MaximumPrice !== undefined) state.MaximumPrice = MaximumPrice;
      if (HasDiscount !== undefined) state.HasDiscount = HasDiscount;
      if (page !== undefined) state.page = page;
      if (limit !== undefined) state.limit = limit;
      //   if (sort !== undefined) state.sort = sort;
      if (viewMode !== undefined) state.viewMode = viewMode;
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
        state.searchResults = action.payload;
      })
      .addCase(getSearchResults.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchParams } = searchSlice.actions;
export default searchSlice.reducer;
