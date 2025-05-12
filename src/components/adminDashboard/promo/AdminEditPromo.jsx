import { useEffect, useState } from "react";
import { api } from "../../../api/axiosInstance";
import { toast } from "sonner";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function AdminEditPromo() {
  const { id } = useParams();
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountPercentage: 1,
    maximumDiscountValue: 1,
    expirationDate: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchPromo();
  }, []);

  const fetchPromo = async () => {
    try {
      const { data } = await api.get(`/coupons/${id}`);
      setFormData(data.data);
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ ما عند تحميل البيانات");
    } finally {
      setIsFetching(false);
    }
  };

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
      const { data } = await api.put(`/coupons/${id}`, formData); 
      if (data.status === "Successful") {
        toast.success(data.message || "تم تحديث الكود بنجاح");
      navigate("/admin/promos");

      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.detail || "حدث خطأ ما");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <p className="text-center mt-10 text-gray-500">جاري تحميل البيانات...</p>
    );
  }

  return (
    <div
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg"
      dir="rtl"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">تعديل كود الخصم</h2>
        <Link
          to="/admin/promos"
          className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-md text-sm"
        >
          الرجوع
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
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
            value={
              formData.expirationDate
                ? formData.expirationDate.split("T")[0]
                : ""
            }
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
          {isLoading ? "جاري الحفظ..." : "حفظ التعديلات"}
        </button>
      </form>
    </div>
  );
}
