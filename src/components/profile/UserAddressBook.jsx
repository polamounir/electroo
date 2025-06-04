import React, { useState, useEffect } from "react";

import {
  FaHome,
  FaPlus,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUser,
} from "react-icons/fa";
import { toast } from "sonner";
import { api } from "../../api/axiosInstance";

export default function UserAddressBook() {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    phoneNumber: "",
    governorate: "",
  });

  const fetchAddresses = async () => {
    try {
      const { data } = await api.get("/addresses");
      setAddresses(data.data || []);
      console.log("Fetched addresses:", data.data);
    } catch (error) {
      toast.error("فشل في تحميل العناوين");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
    console.log("Fetching addresses...");
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/addresses", formData);
      toast.success("تم إضافة العنوان بنجاح");
      setFormData({ name: "", phoneNumber: "", address: "" });
      setShowForm(false);
      fetchAddresses();
    } catch (error) {
      toast.error("فشل في إضافة العنوان");
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
    <div className="p-6 bg-white rounded-xl shadow-md space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FaHome className="text-teal-600" />
          العناوين
        </h2>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition text-sm"
        >
          <FaPlus />
          إضافة عنوان
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAddAddress}
          className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الاسم الأول
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الاسم الأخير
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الشارع
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                المدينة
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رقم الهاتف
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                المحافظة
              </label>
              <select
                name="governorate"
                value={formData.governorate}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">أختر المحافظة</option>
                {governorates.map((gov) => (
                  <option key={gov.name} value={gov.name}>
                    {gov.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-end">
            <button
              type="submit"
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
            >
              إضافة             </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="text-center py-10 text-gray-500">جاري التحميل...</div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          لا توجد عناوين محفوظة
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 shadow rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <FaUser className="text-gray-500" />
                <span className="font-medium">
                  {addr.firstName} {addr.lastName}
                </span>
              </div>
              {/* <div className="flex items-center gap-2 text-gray-700 mb-2">
                <FaphoneNumberAlt className="text-gray-500" />
                <span>{addr.phoneNumber}</span>
              </div> */}
              <div className="flex items-start gap-2 text-gray-700">
                <FaMapMarkerAlt className="mt-1 text-gray-500" />
                <span>{addr.governorate} , {addr.city} , {addr.street}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
