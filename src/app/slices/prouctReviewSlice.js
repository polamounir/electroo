import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { api } from "../../api/axiosInstance";

const initialState = {
  isOpen: false,
  productId: null,
  stars: null,
  reviewText: "",
  image: null,
};

export const addProductReview = createAsyncThunk(
  "productReview/addProductReview",
  async (formData, { rejectWithValue, getState }) => {
    const { productId } = getState().productReview;
    formData.append("productId", productId);

    console.log(formData.get("image"));
    console.log(formData.get("stars"));
    console.log(formData.get("reviewText"));
    console.log(productId);
    try {
      const response = await api.post("/reviews", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const productReviewSlice = createSlice({
  name: "productReview",
  initialState,
  reducers: {
    openProductReviewModal: (state, action) => {
      state.isOpen = true;
      state.productId = action.payload;
    },
    closeProductReviewModal: (state) => {
      state.isOpen = false;
      state.productId = null;
      state.stars = null;
      state.reviewText = "";
      state.image = null;
    },
    setStars: (state, action) => {
      state.stars = action.payload.stars;
    },
    setReviewText: (state, action) => {
      state.reviewText = action.payload.reviewText;
    },
    setImage: (state, action) => {
      state.image = action.payload.image;
    },
    resetProductReview: (state) => {
      state.isOpen = false;
      state.productId = null;
      state.stars = null;
      state.reviewText = "";
      state.image = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addProductReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProductReview.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(addProductReview.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const {
  openProductReviewModal,
  closeProductReviewModal,
  setStars,
  setReviewText,
  setImage,
  resetProductReview,
} = productReviewSlice.actions;

export default productReviewSlice.reducer;
