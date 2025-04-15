import { api } from "./axiosInstance";

export const addProductToCart = async (data) => {
  console.log(data);
  try {
    const res = await api.post(
      "https://ecommerce.zerobytetools.com/api/cart/add-to-cart",
      data
    );
    console.log(res);
    return res
  } catch (error) {
    return error.response.data
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
    console.log(res);
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
    throw new Error(error);
  }
};

export const deleteFromCart = async ({ productId, cartId, quantity }) => {
  console.log("Product:", productId);

  try {
    const res = await api.post("/cart/update-cart", {
      productId: productId,
      cartId: cartId,
      quantity: quantity,
    });
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};
export const fetchCart = async (id) => {
  try {
    const res = await api.get(
      `https://ecommerce.zerobytetools.com/api/cart/${id}`
    );
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
    console.log(res);
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

      // if (error.status === 401) {
      //   // console.log("Unauthorized");
      //   return { code: 401, message: "Please Login first" };
      // }

      // console.error(
      //   "Order creation failed:",
      //   error.response?.data || error.message
      // );

      // throw new Error(
      //   error.response?.data?.message || "Failed to create order"
      // );
    }
    console.error("Unexpected error:", error);
    throw new Error("An unexpected error occurred");
  }
};
