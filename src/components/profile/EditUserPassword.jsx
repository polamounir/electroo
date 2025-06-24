import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../api/axiosInstance";
import Cookies from "js-cookie";

const EditUserPassword = ({ onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("جميع الحقول مطلوبة");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      toast.error(
        "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل، وتشمل حرفًا كبيرًا وصغيرًا، رقمًا، وحرفًا خاصًا"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("كلمة المرور غير متطابقة");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("كلمة المرور الجديدة يجب أن تكون مختلفة عن الحالية");
      return;
    }

    try {
      const { data } = await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      console.log(data);
      toast.success(data?.message || "تم تغيير كلمة المرور بنجاح");

      localStorage.setItem("accessToken", data?.data?.accessToken);
      localStorage.setItem("refreshToken", data?.data?.refreshToken);
      Cookies.set("accessToken", data?.data?.accessToken);
      Cookies.set("refreshToken", data?.data?.refreshToken);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء تغيير كلمة المرور");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Modal Header */}
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            تعديل كلمة المرور الشخصية
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-4xl"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="mb-4">
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              كلمة المرور الحالية
            </label>
            <input
              type="text"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="أدخل كلمة مرور الحالية"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              كلمة المرور الجديدة
            </label>
            <input
              type="newPassword"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="أدخل كلمة مرور جديدة"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              تأكيد كلمة المرور
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="أعد إدخال كلمة المرور"
              required
            />
          </div>

          {/* Modal Footer */}
          <div className="border-t pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              حفظ التغييرات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserPassword;
