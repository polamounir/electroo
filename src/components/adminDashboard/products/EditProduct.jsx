import React, { useState, useEffect } from "react";
import { getProductById } from "../../../api/product"; // Assuming you have an updateProduct API function
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
import { api } from "../../../api/axiosInstance";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";

export default function EditProduct() {
  const { id } = useParams();
  // const { data, isLoading, isError } = useQuery({
  //   queryKey: ["product", id],
  //   queryFn: () => getProductById(id),
  // });
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const data = await getProductById(id);
        setData(data);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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

  console.log(data);

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
  const [productImages, setProductImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

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
      setProductImages(data.images);
      setPreviewImages(data.images);
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
    } catch (error) {
      console.error("Error", error);
    }
  };

  const handleDeleteImage = async (image) => {
    console.log(image);
    let newImages = productImages.filter((img) => {
      return img != image;
    });
    setProductImages(newImages);
    setPreviewImages((prev) => prev.filter((i) => i !== image));
    try {
      const imageId = image.split("/media/")[1].split(".")[0];
      const response = await api.delete(`/products/images/${imageId}`);
      console.log("Image deleted successfully:", response.data);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleAddImage = async (e) => {
    const files = e.target.files;
    console.log(files);
    if (!files) return;

    const filesArray = Array.from(files);
    if (previewImages.length + filesArray.length >= 5) {
      toast.error("لا يمكن اضافة اكثر من 5 صور");
      return;
    }
    const newPreviewUrls = filesArray.map((file) => URL.createObjectURL(file));
    console.log(newPreviewUrls);

    setPreviewImages((prev) => [...prev, ...newPreviewUrls]);

    const formData = new FormData();

    filesArray.forEach((file, index) => {
      formData.append(`images[${index}]`, file); // Upload ALL selected images
    });

    try {
      const response = await api.put(`/products/${id}/images`, formData, {});

      console.log("Image uploaded successfully:", response.data);
      toast.success("Image uploaded successfully");

      const newImageUrl = response.data.url;
      setProductImages((prevImages) => [...prevImages, newImageUrl]);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image");
    }
  };

  // *----------------------------------
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
        <div className="flex gap-5 flex-col md:flex-row">
          <div className="flex-1 flex flex-col">
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
          </div>
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
        <div className="flex gap-5 flex-col md:flex-row">
          <div className="flex-1 flex flex-col">
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

          <div className="flex-1 flex flex-col">
            <label
              htmlFor="discountPercentage"
              className="text-lg text-gray-700"
            >
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
        </div>

        <div className="flex gap-5 flex-col md:flex-row">
          <div className="flex-1 flex flex-col">
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
          <div className="flex-1 flex flex-col">
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

        {/* IMAGES */}
        <div className="flex flex-col">
          <label htmlFor="images" className="text-lg text-gray-700">
            الصور
          </label>
          <div className="flex gap-2 flex-wrap">
            {previewImages.map((image, index) => {
              console.log(image);
              return (
                <div className="relative" key={index}>
                  <img src={image} alt="product" className="w20 h-20" />
                  <button
                    className="absolute -top-2 -end-2 bg-red-500 text-white p-1 rounded-full"
                    onClick={() => handleDeleteImage(image)}
                  >
                    <FaTrash />
                  </button>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center mt-5">
            <input
              type="file"
              multiple
              className="justify-self-center py-2 px-5 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
              onChange={handleAddImage}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 ps-10 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
        >
          تعديل
        </button>
      </form>
    </div>
  );
}
