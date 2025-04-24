import { useState } from "react";

import { uploadProduct } from "../../../api/admin";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import AddCategoryModel from "../../ui/AddCategoryModel";
import { useDispatch } from "react-redux";
import { openCategoryModel } from "../../../app/slices/addCategoryModel";

export default function AddNewProduct() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    discountPercentage: "",
    stock: "",
    sku: "",
    tags: [],
    brand: "",
    description: "",
    categoryId: "",
    images: [],
    productOptions: [{ optionGroupName: "", optionName: "", optionPrice: 1 }],
  });

  const [imagesPreview, setImagesPreview] = useState([]);

  const { data: categories } = useQuery({
    queryKey: ["addcategories"],
    queryFn: async () => {
      const options = {
        method: "GET",
        url: "https://ecommerce.zerobytetools.com/api/categories?Page=1&Limit=20",
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

  console.log(categories);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files || e.dataTransfer.files);
    const updatedImages = [...formData.images, ...newFiles].slice(0, 5);
    const updatedPreviews = [
      ...imagesPreview,
      ...newFiles.map((file) => URL.createObjectURL(file)),
    ].slice(0, 5);

    setImagesPreview(updatedPreviews);
    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
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
    if (
      (e.key === "Enter" ||
        e.key === "," ||
        e.key == " " ||
        e.code == "Space" ||
        e.keyCode == 32 ||
        e.keyCode == 9 ||
        e.code == "Tab") &&
      tag
    ) {
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
      productOptions: [
        ...prev.productOptions,
        { optionGroupName: "", optionName: "", optionPrice: 1 },
      ],
    }));
  };

  const removeProductOption = (index) => {
    const updated = [...formData.productOptions];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, productOptions: updated }));
  };
  const formValidation = (data) => {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      tags: formData.tags.join(","),
    };

    if (finalData.images.length === 0) {
      return toast.error("يجب اضافة صورة واحدة ع الاقل");
    }
    try {
      const res = await uploadProduct(finalData);
      console.log(res);
      if (res.data.isSuccess) {
        toast.success("تم إضافة المنتج");
        setFormData({
          title: "",
          price: "",
          discountPercentage: "",
          stock: "",
          sku: "",
          tags: [],
          brand: "",
          description: "",
          categoryId: "",
          images: [],
          productOptions: [
            { optionGroupName: "", optionName: "", optionPrice: 1 },
          ],
        });
        setImagesPreview([]);
      } else {
        toast.error("تحقق من بيانات المنتج و حاول مجددا");
      }
    } catch (error) {
      console.log(error);
      toast.error("فشل اضافة المنتج");
    }

    console.log("Submitted Data:", finalData);
  };

  const handleOpenCategoryModel = () => {
    dispatch(openCategoryModel());
  };
  return (
    <div className="p-0">
      <AddCategoryModel />
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
          min={1}
          placeholder="سعر المنتح"
          value={formData.price}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md shadow p-2"
        />
        <input
          name="discountPercentage"
          type="number"
          min={0}
          placeholder="خصم % "
          value={formData.discountPercentage}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md shadow p-2"
          required
        />
        <input
          name="stock"
          type="number"
          min={1}
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

        <div>
          <select
            name="categoryId"
            onChange={handleChange}
            value={formData.categoryId}
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
          <button
            type="button"
            onClick={handleOpenCategoryModel}
            className="text-teal-600 hover:underline"
          >
            أضف فئة جديدة
          </button>
        </div>
        <div
          className="border border-gray-300 rounded-md shadow p-3"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleImageChange(e);
          }}
        >
          <label className="block mb-2 font-medium">صور للمنتج :</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            disabled={formData.images.length >= 5}
            className="block w-full"
          />
          <p className="text-sm text-gray-500 mt-1">
            أو قم بسحب وإفلات الصور هنا (بحد أقصى 5 صور)
          </p>
          {formData.images.length >= 5 && (
            <p className="text-red-500 text-sm mt-1">
              لا يمكنك رفع أكثر من 5 صور.
            </p>
          )}

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
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      images: prev.images.filter((_, idx) => idx !== i),
                    }));
                    setImagesPreview((prev) =>
                      prev.filter((_, idx) => idx !== i)
                    );
                  }}
                  className="absolute top-0 right-0 text-red-500 text-xl"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mt-6 mb-2">خصائص المنتج</h4>
          {formData.productOptions.map((option, index) => (
            <div
              key={index}
              className="flex flex-col border-b py-2 lg:border-0 lg:flex-row gap-4 mb-2"
            >
              <input
                placeholder="اسم المجموعة"
                value={option.optionGroupName}
                onChange={(e) =>
                  handleProductOptionChange(
                    index,
                    "optionGroupName",
                    e.target.value
                  )
                }
                className="flex-1 border border-gray-300 rounded-md shadow p-2"
              />
              <input
                placeholder="اسم الخاصية"
                value={option.optionName}
                onChange={(e) =>
                  handleProductOptionChange(index, "optionName", e.target.value)
                }
                className="flex-1 border border-gray-300 rounded-md shadow p-2"
              />
              <input
                type="number"
                placeholder="قيمة الخاصية"
                value={option.optionPrice}
                onChange={(e) =>
                  handleProductOptionChange(
                    index,
                    "optionPrice",
                    e.target.value
                  )
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
