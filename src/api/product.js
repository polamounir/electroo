// import { toast } from "sonner";
import { api } from "./axiosInstance";

// --------------------------------
//  Product API Logic
// --------------------------------

export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  // console.log(res.data);
  return res.data.data;
};

export const fetchSearchProducts = async (query) => {
  try {
    const response = await api.get("/products", {
      params: {
        SearchQuery: query,
        Page: 1,
        Limit: 20,
      },
    });

    const items = response.data?.data?.items;
    // console.log("Fetched Products:", items);
    return items;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch products"
    );
  }
};

export const getSupplierProducts = async (cursor, SupplierId) => {
  const res = await api.get(`/products/`, {
    params: {
      Limit: 20,
      cursor,
      SupplierId,
    },
  });
  // console.log("Category Products:", res.data);
  return res.data.data;
};
export const getCategoryProducts = async (cursor, CategoryId) => {
  const res = await api.get(`/products/`, {
    params: {
      Limit: 20,
      cursor,
      CategoryId,
    },
  });
  // console.log("Category Products:", res.data);
  return res.data.data;
};

// --------------------------------
//  Cart API Logic
// --------------------------------

export const addProductToCart = async (data) => {
  // console.log(data);
  try {
    const res = await api.post("/cart/add-to-cart", data);

    // console.log(res)
    return res;
  } catch (error) {
    // console.log(error)
    return error;
  }
};

export const changeProductQuantity = async ({
  productId,
  cartId,
  quantity,
}) => {
  console.log("Product:", productId);
  try {
    const res = await api.post("/cart/update-cart", {
      productId: productId,
      cartId: cartId,
      quantity: quantity,
    });
    // console.log(res);
    return {
      code: res.status,
      message: res.data.message,
    };
  } catch (error) {
    if (error) {
      return {
        code: error.response?.data.status,
        message: error.response?.data.detail,
      };
    }
    throw new Error("An unexpected error occurred");
  }
};
export const decreaseProductQuantity = async ({
  productId,
  cartId,
  quantity,
}) => {
  // console.log("Product:", productId);
  try {
    const res = await api.post("/cart/update-cart", {
      productId: productId,
      cartId: cartId,
      quantity: quantity,
    });
    // console.log(res);
    return {
      code: res.status,
      message: res.data.message,
    };
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteFromCart = async ({ productId, cartId, quantity }) => {
  // console.log("Product:", productId);
  // console.log("Cart:", cartId);
  // console.log("Quantity:", quantity);

  try {
    const res = await api.post("/cart/update-cart", {
      productId: productId,
      cartId: cartId,
      quantity: quantity,
    });
    // console.log(res);
    return res;
  } catch (error) {
    // console.log(error);
    return error.response.data;
  }
};
export const fetchCart = async (id) => {
  try {
    const res = await api.get(`/cart/${id}`);
    // console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getShippingAddress = async () => {
  try {
    const { data } = await api.get(`/addresses`);
    console.log(data);

    return data.data;
  } catch (error) {
    if (error) {
      return {
        code: error.response?.data.status,
        message: error.response?.data.detail,
      };
    }
    throw new Error("An unexpected error occurred");
  }
};

export const fetchDeliveryMethods = async () => {
  try {
    const { data } = await api.get(`/dms`);

    // console.log(data);

    // return data.data.deliveryMethods;
    return data.data;
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
    return null;
  }
};
export const validateCoupon = async (couponData) => {
  //   console.log(couponData);
  try {
    const { data } = await api.post("/coupons/validate", couponData, {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
    });
    console.log(data);
    return data;
  } catch (error) {
    if (error) {
      // console.log(error);
      return {
        code: error.response?.data.status,
        message: error.response?.data.detail,
      };
    }

    console.error("Coupon validation failed:", error);
    throw new Error("Failed to validate coupon");
  }
};

export const createOrder = async (data) => {
  try {
    const res = await api.post(`/orders/create-order`, data);
    // console.log(res);
    return {
      code: res.status,
      message: res.data.message,
      paymentLink: res.data.data.paymentUrl,
    };
  } catch (error) {
    if (error) {
      console.log(error.response);
      return {
        code: error.status,
        message: error.response?.data.detail,
      };
    }
    console.error("Unexpected error:", error);
    throw new Error("An unexpected error occurred");
  }
};
