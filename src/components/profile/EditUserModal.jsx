import { useState } from "react";
import EditUserPassword from "./EditUserPassword";
import { api } from "../../api/axiosInstance";
import { toast } from "sonner";

const EditUserModal = ({ userData, onClose }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: userData.fullName || "",
    phoneNumber: userData.phoneNumber || "",
    email: userData.email || "",
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

    const { fullName, phoneNumber } = formData;

    if (!fullName || fullName.trim().length < 3) {
      toast.error("الاسم الكامل يجب أن يحتوي على 3 أحرف على الأقل");
      return;
    }

    const phoneRegex = /^[0-9]{11,11}$/;
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      toast.error("رقم الهاتف غير صالح. يجب أن يحتوي على 11 رقمًا");
      return;
    }

    try {
      const { data } = await api.put("auth/change-details", {
        fullname: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
      });
      toast.success("تم تحديث البيانات بنجاح");
      onClose();
    } catch (error) {
      console.error(error.response.data.detail);
      toast.error(error.response.data.detail || "حدث خطأ أثناء تحديث البيانات");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
      {showPasswordModal && (
        <EditUserPassword onClose={() => setShowPasswordModal(false)} />
      )}

      {!showPasswordModal && (
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          {/* Modal Header */}
          <div className="border-b px-6 py-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              تعديل البيانات الشخصية
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
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                الاسم الكامل
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                رقم الهاتف
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                البريد الإلكتروني
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                لا يمكن تعديل البريد الإلكتروني
              </p>
            </div>

            <div className="mb-4">
              <button
                className=" italic underline hover:text-teal-500 duration-300"
                onClick={() => {
                  setShowPasswordModal(true);
                }}
              >
                تغيير كلمة المرور ؟
              </button>
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
      )}
    </div>
  );
};

export default EditUserModal;
