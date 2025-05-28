import { useState, useRef } from "react";
import { FaPlusCircle, FaTimes, FaImage } from "react-icons/fa";
import { api } from "../../../api/axiosInstance";
import { toast } from "sonner";

export default function AddNewCategories() {
  const [categoryName, setCategoryName] = useState("");
  const [catrgoryImage, setCategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const validExtensions = ["image/png", "image/jpg", "image/jpeg"];

  const validateImage = (file) => {
    if (!validExtensions.includes(file.type)) {
      toast.error("يُسمح فقط بصور PNG أو JPG أو JPEG");
      return false;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("يجب أن يكون حجم الصورة أقل من 2 ميغابايت");
      return false;
    }

    return true;
  };

  const handleImageChange = (file) => {
    if (!file) return;
    if (!validateImage(file)) return;

    setError("");
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setCategoryImage(file);
  };

  const onFileInputChange = (e) => {
    const file = e.target.files[0];
    handleImageChange(file);
    setCategoryImage(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageChange(file);
    setCategoryImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      toast.error("اسم التصنيف مطلوب");
      setIsSubmitting(false);
      return;
    }

    if (!imagePreview) {
      toast.error("يرجى اختيار صورة للتصنيف");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", categoryName);
    formData.append("image", catrgoryImage);

    try {
      const { data } = await api.post("/categories", formData);

      if (data.status === "Successful") {
        resetForm();
        setError("");
        setIsSubmitting(false);
        toast.success("تم إضافة التصنيف بنجاح");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء إضافة التصنيف. يرجى المحاولة مرة أخرى.");
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCategoryName("");
    setImagePreview(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mx-auto p-6 bg-white rounded-lg" dir="rtl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        إضافة تصنيف جديد
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="categoryName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            اسم التصنيف
          </label>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="أدخل اسم التصنيف"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            صورة التصنيف
          </label>

          {!imagePreview ? (
            <div
              className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition
                ${
                  isDragging
                    ? "border-teal-500 bg-teal-50"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              onClick={() => fileInputRef.current.click()}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={onFileInputChange}
                accept=".png,.jpg,.jpeg"
                className="hidden"
              />
              <FaImage className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                {isDragging
                  ? "أسقط الصورة هنا"
                  : "اسحب وأفلت صورة أو انقر لاختيار صورة"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, JPEG فقط – بحد أقصى 2MB
              </p>
            </div>
          ) : (
            <div className="relative">
              <img
                src={imagePreview}
                alt="معاينة الصورة"
                className="w-full h-48 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 left-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              >
                <FaTimes className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        <div className="flex justify-between space-x-reverse space-x-3">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            disabled={isSubmitting}
          >
            إعادة تعيين
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "جاري الإضافة..."
            ) : (
              <>
                <FaPlusCircle className="ml-2" />
                إضافة التصنيف
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
