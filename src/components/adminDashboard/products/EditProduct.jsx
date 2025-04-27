import React, { useState, useEffect } from "react";
import { getProductById } from "../../../api/product"; // Assuming you have an updateProduct API function
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
import { api } from "../../../api/axiosInstance";

export default function EditProduct() {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
  });
  const { data: categories } = useQuery({
    queryKey: ["addcategories"],
    queryFn: async () => {
      const options = {
        method: "GET",
        url: "https://ecommerce.markomedhat.com/api/categories?Page=1&Limit=20",
      };

      try {
        const { data } = await axios.request(options);
        return data.data.items || [];
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch categories");
      }
    },
  });

  //   console.log(data);

  //   console.log(categories);
  const [product, setProduct] = useState({
    title: "",
    price: 0,
    discountPercentage: 0,
    stock: 0,
    sku: "",
    tags: "",
    brand: "",
    description: "",
    categoryId: "",
    category: "",
  });

  const [category, setCategory] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const setingCategoryId = (name) => {
    setCategory(name);
    console.log(name);
    let c = categories.filter((cat) => {
      return cat.name == name;
    });
    // console.log(c);
    setCategoryId(c[0].id);
  };

  useEffect(() => {
    if (data) {
      setProduct({
        title: data.title || "",
        price: data.price || 0,
        discountPercentage: data.discountPercentage || 0,
        stock: data.stocks || 0,
        sku: data.sku || "",
        tags: data.tags || "",
        brand: data.brand || "",
        description: data.description || "",
        categoryId: "",
        category: data.category || "",
      });
      setingCategoryId(data.category);
      //   setCategoryId(data.categoryId);
      //   console.log(categoryId);
    }
  }, [data]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(product);
    try {
      const response = await api.put(`/products/${id}`, product);
      console.log("Product updated successfully:", response.data);
      // You might want to redirect or show a success message
    } catch (error) {
      console.error("Error", error);
    }
  };

  if (isLoading)
    return <div className="text-center text-teal-500">Loading...</div>;
  if (isError)
    return (
      <div className="text-center text-red-500">
        Error loading product data.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-teal-500 mb-6">
        تعديل بيانات المنتج
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="flex flex-col">
            <label htmlFor="title" className="text-lg text-gray-700">
              الاسم
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={product.title}
              onChange={handleChange}
              className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <div className="flex flex-col">
              <label htmlFor="price" className="text-lg text-gray-700">
                السعر
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={product.price}
                onChange={handleChange}
                className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="description" className="text-lg text-gray-700">
            الوصف
          </label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
            className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            rows="4"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="stock" className="text-lg text-gray-700">
            المخزن
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="discountPercentage" className="text-lg text-gray-700">
            نسبة الخصم
          </label>
          <input
            type="number"
            id="discountPercentage"
            name="discountPercentage"
            value={product.discountPercentage}
            onChange={handleChange}
            className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="sku" className="text-lg text-gray-700">
            SKU
          </label>
          <input
            type="text"
            id="sku"
            name="sku"
            value={product.sku}
            onChange={handleChange}
            className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="tags" className="text-lg text-gray-700">
            العلامات
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={product.tags}
            onChange={handleChange}
            className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="brand" className="text-lg text-gray-700">
            العلامة التجارية
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={product.brand}
            onChange={handleChange}
            className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex flex-col">
          <select
            name="categoryId"
            onChange={handleChange}
            value={categoryId}
            className="w-full border outline-none border-gray-300 rounded-md shadow p-3"
            required
          >
            <option value="">أختار فئة المنتج </option>
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            ) : (
              <option disabled>No categories available.</option>
            )}
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
        >
          تعديل
        </button>
      </form>
    </div>
  );
}
