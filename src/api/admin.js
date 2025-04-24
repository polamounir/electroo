import axios from "axios";

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

  productData.productOptions.forEach((option , index) => {
    formData.append(
      `productOptions[${index}].optionGroupName`,
      option.optionGroupName
    );
    
    formData.append(
      `productOptions[${index}].optionName`,
      option.optionName
    );
    formData.append(
      `productOptions[${index}].optionPrice`,
      option.optionPrice
    );

  });

  productData.images.forEach((image, index) => {
    formData.append(`images[${index}]`, image);
  });

  formData.forEach((value, key) => {
    console.log(`${key}:`, value);
  });

  const options = {
    method: "POST",
    url: "https://ecommerce.zerobytetools.com/api/products",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxNDk1ZmRjNS1jY2Q2LTQ3MzUtNDRiNC0wOGRkNzkzNjg0NWQiLCJGdWxsTmFtZSI6Itio2KjYqNioIiwiZW1haWwiOiJka3l2MGNlZzk2QGtubWNhZGliYXYuY29tIiwiVXNlclR5cGUiOiJTdXBwbGllciIsIlN1cHBsaWVySWQiOiI2YmUyMGFmZi0zZmJiLTRiNjItYWZkOC0yNDljNzhlNTdhZmUiLCJuYmYiOjE3NDQ0NzQxODQsImV4cCI6MTgwOTI3NDE4NCwiaWF0IjoxNzQ0NDc0MTg0fQ.xMq6MryPQvxxKJra_pPfg5TElYEs1SlkySCam6a8gGo",
    },
    data: formData,
  };

  try {
    const { data } = await axios.request(options);
    console.log(data);
    return data
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
