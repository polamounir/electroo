import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { uploadProduct } from "../../../api/admin";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function AddNewProduct() {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    discountPercentage: "",
    stock: "",
    sku: "",
    tags: [],
    brand: "",
    description: "",
    categoryId: uuidv4(),
    images: [],
    productOptions: [{ name: "", value: "" }],
  });

  const { data: categories } = useQuery({
    queryKey: ["addcategories"],
    queryFn: async () => {
      const options = {
        method: "GET",
        url: "https://ecommerce.zerobytetools.com/api/categories?Page=1&Limit=20",
      };

      try {
        const { data } = await axios.request(options);
        // console.log(data);
        return data.data.items || [];
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch categories");
      }
    },
  });

  const [imagesPreview, setImagesPreview] = useState([]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const { files } = e.target;
    const fileArray = Array.from(files).map(
      (file) =>
        // URL.createObjectURL(file)
        file
    );
    const previewArray = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setImagesPreview(previewArray);
    setFormData((prev) => ({
      ...prev,
      images: fileArray,
    }));
  };

  const handleTagsChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      tagsInput: value,
    }));
  };

  const handleTagAdd = (e) => {
    const tag = formData.tagsInput;
    if ((e.key === "Enter" || e.key === ",") && tag) {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag.trim()],
        tagsInput: "",
      }));
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleProductOptionChange = (index, key, value) => {
    const updated = [...formData.productOptions];
    updated[index][key] = value;
    setFormData((prev) => ({ ...prev, productOptions: updated }));
  };

  const addProductOption = () => {
    setFormData((prev) => ({
      ...prev,
      productOptions: [...prev.productOptions, { name: "", value: "" }],
    }));
  };

  const removeProductOption = (index) => {
    const updated = [...formData.productOptions];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, productOptions: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      tags: formData.tags,
    };
    try {
      const res = await uploadProduct(finalData);
      console.log(res);
    } catch (error) {
      console.log(error);
    }

    console.log("Submitted Data:", finalData);
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h2 className="text-2xl font-semibold mb-6">اضافة منتج جديد</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="اسم المنتج"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md shadow p-2"
        />
        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="سعر المنتح"
          value={formData.price}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md shadow p-2"
        />
        <input
          name="discountPercentage"
          type="number"
          placeholder="خصم % "
          value={formData.discountPercentage}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md shadow p-2"
          required
        />
        <input
          name="stock"
          type="number"
          placeholder="الكمية"
          value={formData.stock}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md shadow p-2"
          required
        />
        <input
          name="sku"
          placeholder="SKU"
          value={formData.sku}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md shadow p-2"
          required
        />
        <input
          name="tagsInput"
          placeholder="اضف كلمات تعبر عن المنتح ( اضغط Enter )"
          value={formData.tagsInput || ""}
          onChange={handleTagsChange}
          onKeyDown={handleTagAdd}
          className="w-full border border-gray-300 rounded-md shadow p-2"
        />

        <div className="flex flex-wrap gap-2 mt-2">
          {formData.tags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center bg-teal-500/20 text-black rounded-full px-3 py-1"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleTagRemove(tag)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <input
          name="brand"
          placeholder="الماركة"
          value={formData.brand}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md shadow p-2"
          required
        />
        <textarea
          name="description"
          placeholder="وصف المنتج"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full border border-gray-300 rounded-md shadow p-2"
          required
        />

        <select
          name="categoryId"
          onChange={handleChange}
          value={formData.categoryId}
          className="w-full border outline-none border-gray-300 rounded-md shadow p-3"
          required
        >
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

        <div className="border border-gray-300 rounded-md shadow p-3">
          <label className="block mb-2 font-medium">صور للمنتج :</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full"
            required
          />
          <div className="flex gap-3 mt-4 flex-wrap">
            {imagesPreview.map((src, i) => (
              <div key={i} className="relative">
                <img
                  src={src}
                  alt={`preview-${i}`}
                  className="w-20 h-20 object-cover border border-gray-300 rounded-md shadow"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      images: prev.images.filter((_, idx) => idx !== i),
                    }))
                  }
                  className="absolute top-0 right-0 text-red-500 text-xl"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Product Options */}
        <div>
          <h4 className="text-lg font-semibold mt-6 mb-2">خصائص المنتج</h4>
          {formData.productOptions.map((option, index) => (
            <div key={index} className="flex flex-col border-b py-2 lg:border-0 lg:flex-row gap-4 mb-2">
              <input
                placeholder="اسم الخاصية"
                value={option.name}
                onChange={(e) =>
                  handleProductOptionChange(index, "name", e.target.value)
                }
                className="flex-1 border border-gray-300 rounded-md shadow p-2"
              />
              <input
                placeholder="تفاصيل الخاصية"
                value={option.value}
                onChange={(e) =>
                  handleProductOptionChange(index, "value", e.target.value)
                }
                className="flex-1 border border-gray-300 rounded-md shadow p-2"
              />
              <button
                type="button"
                onClick={() => removeProductOption(index)}
                className="text-red-500 hover:underline ml-2"
              >
                حذف
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addProductOption}
            className="mt-2 text-teal-600 hover:underline"
          >
            + اضافة خاصية
          </button>
        </div>

        <button
          type="submit"
          className="mt-6 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
        >
          إضافة المنتج
        </button>
      </form>
    </div>
  );
}
