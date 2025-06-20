import { api } from "./axiosInstance";

export const uploadProduct = async (productData) => {
  // console.log(productData.productOptions);
  // console.log(productData);


  const formData = new FormData();

  formData.append("brand", productData.brand);
  formData.append("categoryId", productData.categoryId);
  formData.append("description", productData.description);
  formData.append("discountPercentage", productData.discountPercentage);
  formData.append("price", productData.price);
  formData.append("sku", productData.sku);
  formData.append("stock", productData.stock);
  // formData.append("tags", productData.tags);
  formData.append("title", productData.title);
  formData.append("isAuction", productData.isAuction);
  formData.append("minimumBidPrice", productData.minimumBidPrice);
  formData.append("auctionExpirationDate", productData.auctionExpirationDate);


  productData.productOptions.forEach((option, index) => {
    formData.append(
      `productOptions[${index}].optionGroupName`,
      option.optionGroupName
    );

    formData.append(`productOptions[${index}].optionName`, option.optionName);
    formData.append(`productOptions[${index}].optionPrice`, option.optionPrice);
  });

  productData.images.forEach((image, index) => {
    formData.append(`images[${index}]`, image);
  });
  productData.tags.forEach((tags, index) => {
    formData.append(`tags[${index}]`, tags);
  });

  formData.forEach((value, key) => {
    // console.log(`${key}:`, value);
  });

  // const options = {
  //   url: "/products",
  //   data: formData,
  // };

  try {
    const { data } = await api.post("/products", formData);
    // console.log(data);
    return data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
    } else if (error.request) {
      console.error("Error request:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
  }
};

// ------------------------------------------
export const deleteUser = async (userId) => {
  try {
    const { data } = await api.delete(`/users/${userId}`);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getOrderData = async (orderId) => {
  const response = await api.get(`/orders/${orderId}/details`);
  return response.data.data;
};
export const updateOrderItemStatus = async (itemId, status) => {
  return await api.put(`/orders/order-items/${itemId}/status`, {
    status: status,
  });
};
