import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { closeAddressModel } from "../../app/slices/addAddressModelSlice";
import { addAddress } from "../../api/user";

export default function AddAddressModel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    governorate: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "الاسم الأول مطلوب";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "الاسم الأخير مطلوب";
    }

    if (!formData.street.trim()) {
      errors.street = "اسم الشارع مطلوب";
    }

    if (!formData.city.trim()) {
      errors.city = "اسم المدينة مطلوب";
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "رقم الهاتف مطلوب";
    } else if (!/^01[0-2,5]{1}[0-9]{8}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = "رقم الهاتف غير صالح";
    }

    if (!formData.governorate) {
      errors.governorate = "يجب اختيار المحافظة";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      toast.error(firstError);
      return;
    }

    setLoading(true);
    try {
      const res = await addAddress(formData);

      if (res?.status === 401) {
        toast.error("يجب عليك تسجيل الدخول");
        navigate("/login");
        dispatch(closeAddressModel());
      } else if (res?.status === 200) {
        toast.success("تم إضافة العنوان بنجاح");
        dispatch(closeAddressModel());
        window.location.reload();
      } else {
        toast.error("تحقق من البيانات المدخلة");
      }
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ أثناء إضافة العنوان");
    } finally {
      setLoading(false);
    }
  };

  const governorates = [
    { name: "Alexandria", title: "الإسكندرية" },
    { name: "Aswan", title: "أسوان" },
    { name: "Asyut", title: "أسيوط" },
    { name: "Beheira", title: "البحيرة" },
    { name: "BeniSuef", title: "بني سويف" },
    { name: "Cairo", title: "القاهرة" },
    { name: "Dakahlia", title: "الدقهلية" },
    { name: "Damietta", title: "دمياط" },
    { name: "Fayoum", title: "الفيوم" },
    { name: "Gharbia", title: "الغربية" },
    { name: "Giza", title: "الجيزة" },
    { name: "Ismailia", title: "الإسماعيلية" },
    { name: "KafrElSheikh", title: "كفر الشيخ" },
    { name: "Luxor", title: "الأقصر" },
    { name: "Matrouh", title: "مطروح" },
    { name: "Minya", title: "المنيا" },
    { name: "Monufia", title: "المنوفية" },
    { name: "NewValley", title: "الوادي الجديد" },
    { name: "NorthSinai", title: "شمال سيناء" },
    { name: "PortSaid", title: "بورسعيد" },
    { name: "Qalyubia", title: "القليوبية" },
    { name: "Qena", title: "قنا" },
    { name: "RedSea", title: "البحر الأحمر" },
    { name: "Sharqia", title: "الشرقية" },
    { name: "Sohag", title: "سوهاج" },
    { name: "SouthSinai", title: "جنوب سيناء" },
    { name: "Suez", title: "السويس" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4 overflow-y-auto">
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <button
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 transition-colors"
          onClick={() => dispatch(closeAddressModel())}
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            إضافة عنوان جديد
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  الاسم الأول
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  dir="rtl"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  الاسم الأخير
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  dir="rtl"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="street"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                الشارع
              </label>
              <input
                type="text"
                id="street"
                name="street"
                required
                value={formData.street}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                dir="rtl"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  المدينة
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  dir="rtl"
                />
              </div>

              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  رقم الهاتف
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500 " dir="ltr">+20</span>
                  </div>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full pl-12 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="1XXXXXXXXX"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="governorate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                المحافظة
              </label>
              <select
                name="governorate"
                id="governorate"
                value={formData.governorate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                dir="rtl"
              >
                <option value="" disabled>
                  اختر المحافظة
                </option>
                {governorates.map((gov) => (
                  <option key={gov.name} value={gov.name}>
                    {gov.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
                  loading
                    ? "bg-teal-400 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-700"
                } flex items-center justify-center`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    جاري الإضافة...
                  </>
                ) : (
                  "إضافة العنوان"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
