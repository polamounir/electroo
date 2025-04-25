import axios from "axios";
import { api } from "./axiosInstance";

export const uploadProduct = async (productData) => {
  console.log(productData.productOptions);

  const formData = new FormData();

  formData.append("brand", productData.brand);
  formData.append("categoryId", productData.categoryId);
  formData.append("description", productData.description);
  formData.append("discountPercentage", productData.discountPercentage);
  formData.append("price", productData.price);
  formData.append("sku", productData.sku);
  formData.append("stock", productData.stock);
  formData.append("tags", productData.tags);
  formData.append("title", productData.title);

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

  formData.forEach((value, key) => {
    console.log(`${key}:`, value);
  });

  // const options = {
  //   url: "/products",
  //   data: formData,
  // };

  try {
    const { data } = await api.post("/products", formData);
    console.log(data);
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
