import { useState } from "react";
import { api } from "../../../api/axiosInstance";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function AdminAddNewPromo() {
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountPercentage: 1,
    maximumDiscountValue: 1,
    expirationDate: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "discountPercentage" || name === "maximumDiscountValue"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await api.post("/coupons", formData);
      if (data.status === "Successful") {
        toast.success(data.message);
        setFormData({
          code: "",
          description: "",
          discountPercentage: 1,
          maximumDiscountValue: 1,
          expirationDate: "",
        });
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        toast.error(error.response.data.detail);
      } else {
        toast.error("حدث خطأ ما, حاول مرة اخرى");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">اضافة كود خصم جديد</h2>
        <Link
          to="/admin/promos"
          className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-md text-sm"
        >
          الرجوع
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div>
            <label htmlFor="code" className="block text-sm font-semibold mb-1">
              كود الخصم
            </label>
            <input
              type="text"
              id="code"
              name="code"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              onChange={handleChange}
              value={formData.code}
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold mb-1"
            >
              الوصف
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              onChange={handleChange}
              value={formData.description}
              required
            />
          </div>

          <div>
            <label
              htmlFor="discountPercentage"
              className="block text-sm font-semibold mb-1"
            >
              نسبة الخصم (%)
            </label>
            <input
              type="number"
              id="discountPercentage"
              name="discountPercentage"
              min="1"
              max="100"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              onChange={handleChange}
              value={formData.discountPercentage}
              required
            />
          </div>

          <div>
            <label
              htmlFor="maximumDiscountValue"
              className="block text-sm font-semibold mb-1"
            >
              أقصى قيمة للخصم
            </label>
            <input
              type="number"
              id="maximumDiscountValue"
              name="maximumDiscountValue"
              min="1"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              onChange={handleChange}
              value={formData.maximumDiscountValue}
              required
            />
          </div>

          <div>
            <label
              htmlFor="expirationDate"
              className="block text-sm font-semibold mb-1"
            >
              تاريخ الانتهاء
            </label>
            <input
              type="date"
              id="expirationDate"
              name="expirationDate"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              onChange={handleChange}
              value={formData.expirationDate}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white py-2 rounded-md text-md font-semibold justify-center ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700"
            }`}
          >
            {isLoading ? "جاري الإضافة..." : "إضافة كود جديد"}
          </button>
        </div>
      </form>
    </div>
  );
}
