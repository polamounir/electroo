import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";
import {
  addProductToCart,
  changeProductQuantity,
  decreaseProductQuantity,
  deleteFromCart,
  fetchCart,
} from "../../api/product";
import { toast } from "sonner";

// -----------------------
export const fetchCartAsync = createAsyncThunk(
  "cart/fetchCartAsync",
  async (_, { dispatch, rejectWithValue }) => {
    let cartId = localStorage.getItem("cartId");

    if (!cartId) {
      dispatch(cartInit());
      cartId = localStorage.getItem("cartId");
    }
    try {
      const res = await fetchCart(cartId);
      // console.log(res.data.cart);
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addProductToCartAsync = createAsyncThunk(
  "cart/addProductToCartAsync",
  async (productId, { dispatch, rejectWithValue }) => {
    let cartId = localStorage.getItem("cartId");

    if (!cartId) {
      dispatch(cartInit());
      cartId = localStorage.getItem("cartId");
    }

    try {
      const res = await addProductToCart({
        productId,
        cartId: cartId,
      });

      console.log(res);
      if (res.status === 200) {
        toast.success("تمت اضافة المنتج بنجاح");
        dispatch(fetchCartAsync());
      }
      if (res.detail.includes("max")) {
        toast.error(" تم الوصول الحد الاقصي");
      }

      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// -------------------------
export const changeProductQuantityAsync = createAsyncThunk(
  "cart/changeProductQuantityAsync",
  async ({ productId, quantity }, { dispatch, rejectWithValue }) => {
    try {
      const res = await changeProductQuantity({
        productId,
        cartId: localStorage.getItem("cartId"),
        quantity: quantity,
      });

      // console.log(res.message);
      if (res.message.includes("max")) {
        toast.error("تم الوصول الحد الاقصي");
      } else {
        dispatch(fetchCartAsync());
        toast.success("تم تعديل الكمية");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const decreaseProductQuantityAsync = createAsyncThunk(
  "cart/decreaseProductQuantityAsync",
  async ({ productId, quantity }, { dispatch, rejectWithValue }) => {
    try {
      const res = await decreaseProductQuantity({
        productId,
        cartId: localStorage.getItem("cartId"),
        quantity: quantity,
      });
      if (res.code == 200) {
        dispatch(fetchCartAsync());
        toast.success(" تم تقليل الكمية");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const deleteProductAsync = createAsyncThunk(
  "cart/deleteProductAsync",
  async ({ productId }, { dispatch, rejectWithValue }) => {
    try {
      const res = await deleteFromCart({
        productId,
        cartId: localStorage.getItem("cartId"),
        quantity: 0,
      });
      console.log(res);
      dispatch(fetchCartAsync());
      toast.success("تم الحذف");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  cart: {
    cartItems: [],
    clientSecret: "",
    deliveryMethodId: "",
    id: "",
    paymentIntnetId: "",
    shippingPrice: 0,
    subTotal: 0,
  },
  status: "idle",
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    cartInit: (state) => {
      const storedCartId = localStorage.getItem("cartId");
      if (!storedCartId) {
        const newCartId = uuid();
        localStorage.setItem("cartId", newCartId);
        state.cart.id = newCartId;
      } else {
        state.cart.id = storedCartId;
      }
    },
    setShippingPrice: (state, action) => {
      state.cart.shippingPrice = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addProductToCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProductToCartAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addProductToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add product to cart";
      })
      .addCase(fetchCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        // console.log(action.payload.data);
        state.cart = action.payload.data.cart;
      })
      .addCase(fetchCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch cart";
      })
      .addCase(changeProductQuantityAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeProductQuantityAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changeProductQuantityAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to change product quantity";
      });
  },
});

export const { cartInit, setShippingPrice } = cartSlice.actions;
export default cartSlice.reducer;
