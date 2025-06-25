import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/axiosInstance";


const initialState = {
  searchTerm: "",
  selectedCategory: "",
  hasDiscount: false,
  priceRange: { min: 0, max: 25000 },
  products: [],
  cursor: null,
  hasMore: false,
  loading: false,
  error: null,
  categories: [],
  categoriesLoading: false,
  categoriesError: null,
};

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  "productsSearch/fetchProducts",
  async (_, { getState }) => {
    const state = getState().productsSearch;
    const params = {
      SearchQuery: state.searchTerm || undefined,
      MinimumPrice: state.priceRange.min > 0 ? state.priceRange.min : undefined,
      MaximumPrice:
        state.priceRange.max < 25000 ? state.priceRange.max : undefined,
      HasDiscount: state.hasDiscount || undefined,
      CategoryId: state.selectedCategory || undefined,
      Cursor: state.cursor || undefined,
      Limit: 10,
    };

    // Remove undefined values
    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key]
    );

    const { data } = await api.get("/products", { params });
    console.log(data);
    return data;
  }
);

// Async thunk for fetching more products (for infinite scroll)
export const fetchMoreProducts = createAsyncThunk(
  "productsSearch/fetchMoreProducts",
  async (_, { getState }) => {
    const state = getState().productsSearch;
    if (!state.cursor)
      return { data: { items: [], cursor: null, hasMore: false } };

    const params = {
      SearchQuery: state.searchTerm || undefined,
      MinimumPrice: state.priceRange.min > 0 ? state.priceRange.min : undefined,
      MaximumPrice:
        state.priceRange.max < 25000 ? state.priceRange.max : undefined,
      HasDiscount: state.hasDiscount || undefined,
      CategoryId: state.selectedCategory || undefined,
      Cursor: state.cursor,
      Limit: 10,
    };

    // Remove undefined values
    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key]
    );

    const { data } = await api.get("/products", { params });
    console.log(data);
    return data;
  }
);

// Async thunk for fetching categories
export const fetchCategories = createAsyncThunk(
  "productsSearch/fetchCategories",
  async () => {
    const response = await api.get("/categories?Page=1&Limit=100");
    return response.data.data?.items || [];
  }
);

export const productsSearchSlice = createSlice({
  name: "productsSearch",
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.cursor = null;
      state.products = [];
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.cursor = null;
      state.products = [];
    },
    setHasDiscount: (state, action) => {
      state.hasDiscount = action.payload;
      state.cursor = null;
      state.products = [];
    },
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
      state.cursor = null;
      state.products = [];
    },
    clearFilters: (state) => {
      state.searchTerm = "";
      state.selectedCategory = "";
      state.hasDiscount = false;
      state.priceRange = { min: 0, max: 25000 };
      state.cursor = null;
      state.products = [];
    },
    resetProducts: (state) => {
      state.products = [];
      state.cursor = null;
      state.hasMore = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initial products fetch
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        const newProducts = action.payload.data?.items || [];
        state.products = newProducts;
        state.cursor = action.payload.data?.cursor;
        state.hasMore = action.payload.data?.hasMore || false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch more products
      .addCase(fetchMoreProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoreProducts.fulfilled, (state, action) => {
        state.loading = false;
        const newProducts = action.payload.data?.items || [];
        state.products = [...state.products, ...newProducts];
        state.cursor = action.payload.data?.cursor;
        state.hasMore = action.payload.data?.hasMore || false;
      })
      .addCase(fetchMoreProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Categories
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.error.message;
      });
  },
});

export const {
  setSearchTerm,
  setSelectedCategory,
  setHasDiscount,
  setPriceRange,
  clearFilters,
  resetProducts,
} = productsSearchSlice.actions;

// Selectors
export const selectSearchTerm = (state) => state.productsSearch.searchTerm;
export const selectSelectedCategory = (state) =>
  state.productsSearch.selectedCategory;
export const selectHasDiscount = (state) => state.productsSearch.hasDiscount;
export const selectPriceRange = (state) => state.productsSearch.priceRange;
export const selectProducts = (state) => state.productsSearch.products;
export const selectLoading = (state) => state.productsSearch.loading;
export const selectError = (state) => state.productsSearch.error;
export const selectCursor = (state) => state.productsSearch.cursor;
export const selectHasMore = (state) => state.productsSearch.hasMore;
export const selectCategories = (state) => state.productsSearch.categories;
export const selectCategoriesLoading = (state) =>
  state.productsSearch.categoriesLoading;
export const selectCategoriesError = (state) =>
  state.productsSearch.categoriesError;

export const selectHasActiveFilters = (state) => {
  const { searchTerm, selectedCategory, hasDiscount, priceRange } =
    state.productsSearch;
  return (
    searchTerm ||
    selectedCategory ||
    hasDiscount ||
    priceRange.min > 0 ||
    priceRange.max < 25000
  );
};

export default productsSearchSlice.reducer;
