import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/axiosInstance";

const initialState = {
  searchQuery: "",
  selectedCategoryId: null,
  hasDiscount: false,
  minimumPrice: 0,
  maximumPrice: 25000,
  products: [],
  cursor: null,
  hasMore: false,
  loading: false,
  error: null,
  categories: [],
  categoriesLoading: false,
  categoriesError: null,
  searchLink: null,
};

export const fetchSearchingProducts = createAsyncThunk(
  "searching/fetchSearchingProducts",
  async (_, { getState }) => {
    const state = getState().searching;
    const params = {
      SearchQuery: state.searchQuery || undefined,
      MinimumPrice: state.minimumPrice || undefined,
      MaximumPrice: state.maximumPrice || undefined,
      HasDiscount: state.hasDiscount || undefined,
      CategoryId: state.selectedCategoryId || undefined,
      Cursor: state.cursor || undefined,
      Limit: 20,
    };
    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key]
    );

    const { data } = await api.get("/products", { params });
    return data;
  }
);

export const fetchMoreSearchingProducts = createAsyncThunk(
  "searching/fetchMoreSearchingProducts",
  async (_, { getState }) => {
    const state = getState().searching;
    if (!state.cursor)
      return { data: { items: [], cursor: null, hasMore: false } };
    const params = {
      SearchQuery: state.searchQuery || undefined,
      MinimumPrice: state.minimumPrice || undefined,
      MaximumPrice: state.maximumPrice || undefined,
      HasDiscount: state.hasDiscount || undefined,
      CategoryId: state.selectedCategoryId || undefined,
      Cursor: state.cursor || undefined,
      Limit: 20,
    };

    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key]
    );

    const { data } = await api.get("/products", { params });
    return data;
  }
);

const searchingSlice = createSlice({
  name: "searching",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategoryId: (state, action) => {
      state.selectedCategoryId = action.payload;
    },
    setHasDiscount: (state, action) => {
      state.hasDiscount = action.payload;
    },
    setPriceRange: (state, action) => {
      state.minimumPrice = action.payload.min;
      state.maximumPrice = action.payload.max;
    },
    clearFilters: (state) => {
      state.searchQuery = "";
      state.selectedCategoryId = null;
      state.hasDiscount = false;
      state.minimumPrice = 0;
      state.maximumPrice = 25000;
      state.cursor = null;
      state.products = [];
      state.searchLink = null;
    },
    setSearchLink: (state, action) => {
      state.searchLink = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initial products fetch
      .addCase(fetchSearchingProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchingProducts.fulfilled, (state, action) => {
        state.loading = false;
        const newProducts = action.payload.data?.items || [];
        state.products = newProducts;
        state.cursor = action.payload.data?.cursor;
        state.hasMore = action.payload.data?.hasMore || false;
        // Generate search link from current state
        const searchParams = new URLSearchParams();
        if (state.searchQuery)
          searchParams.append("SearchQuery", state.searchQuery);
        if (state.selectedCategoryId)
          searchParams.append("CategoryId", state.selectedCategoryId);
        if (state.hasDiscount) searchParams.append("HasDiscount", "true");
        if (state.minimumPrice > 0)
          searchParams.append("MinimumPrice", state.minimumPrice);
        if (state.maximumPrice < 25000)
          searchParams.append("MaximumPrice", state.maximumPrice);
        state.searchLink = searchParams.toString();
      })
      .addCase(fetchSearchingProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch more products
      .addCase(fetchMoreSearchingProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoreSearchingProducts.fulfilled, (state, action) => {
        state.loading = false;
        const newProducts = action.payload.data?.items || [];
        state.products = [...state.products, ...newProducts];
        state.cursor = action.payload.data?.cursor;
        state.hasMore = action.payload.data?.hasMore || false;
      })
      .addCase(fetchMoreSearchingProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setSearchQuery,
  setSelectedCategoryId,
  setHasDiscount,
  setPriceRange,
  clearFilters,
  setSearchLink,
} = searchingSlice.actions;

export default searchingSlice.reducer;
