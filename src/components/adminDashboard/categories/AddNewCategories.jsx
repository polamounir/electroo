import { useState } from "react";
import { MdImage } from "react-icons/md"; // React Icon for image placeholder
import { api } from "../../../api/axiosInstance";
import { toast } from "sonner";

export default function AddNewCategories() {
  const [categoryName, setCategoryName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim() || !image) {
      toast.warn("يرجى ملء جميع الحقول.");
      return;
    }

    const formData = new FormData();
    formData.append("name", categoryName);
    formData.append("image", image);

    try {
      const { data } = await api.post("/categories", formData);
      if (data?.data?.isSuccess) {
        toast.success("تم إضافة الفئة");
        setCategoryName("");
        setImage(null);
        setPreview(null);
      } else {
        toast.error("فشل إضافة الفئة");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("حدث خطأ أثناء إضافة الفئة");
    }
  };

  return (
    <div className="mx-auto p-6 bg-white" dir="rtl">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center ">
          إضافة تصنيف جديد
        </h2>
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition px-5"
        >
          إضافة
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 mb-1">اسم التصنيف</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="أدخل اسم التصنيف"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">صورة التصنيف</label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition text-sm">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              تحميل صورة
            </label>

            {preview ? (
              <img
                src={preview}
                alt="معاينة الصورة"
                className="w-16 h-16 object-cover rounded-lg border"
              />
            ) : (
              <div className="w-16 h-16 flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg border">
                <MdImage className="w-6 h-6" />
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
