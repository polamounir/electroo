import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../../api/axiosInstance";

// Constants
const SUPPLIERS_STATUS = {
  Pending: "قيد المراجعة",
  Verified: "تم التحقق",
  Rejected: "تم الرفض",
  Banned: "محظور",
};

const STATUS_COLORS = {
  Verified: "bg-teal-600",
  Rejected: "bg-red-400",
  Pending: "bg-yellow-600",
  Banned: "bg-black",
};

const PAGE_SIZE = 100;

export default function AdminSuppliersTable() {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSuppliers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(`/suppliers?page=1&limit=${PAGE_SIZE}`);
      setSuppliers(response.data.data.items);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setError(err);
      toast.error("فشل تحميل بيانات التجار");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl flex items-center gap-3">
          جاري التحميل ...
          <svg
            className="animate-spin h-6 w-6 text-teal-600"
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
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-xl text-red-600 mb-4">حدث خطأ غير متوقع</div>
        <button
          className="bg-teal-500 text-white px-4 py-2 rounded-lg"
          onClick={fetchSuppliers}
        >
          إعادة تحميل
        </button>
      </div>
    );
  }

  if (suppliers.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg">
        <p className="text-lg text-gray-500">لا يوجد تجار</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">كل التجار</h2>
      </div>

      {/* Desktop Table (hidden on mobile) */}
      <div className="hidden sm:block">
        <div className="flex flex-col mt-4 overflow-x-auto">
          <div className="grid grid-cols-12 py-3 bg-gray-100 rounded-t-lg px-4 font-medium">
            <div className="col-span-3">الاسم</div>
            <div className="col-span-3">الاسم التجاري</div>
            <div className="col-span-2">اسم المتجر</div>
            <div className="col-span-2 text-center">الحالة</div>
            <div className="col-span-2 text-center">الإجراءات</div>
          </div>

          <div className="flex flex-col rounded-b-lg">
            {suppliers.map((supplier) => (
              <SupplierRow key={supplier.id} supplier={supplier} />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Cards (shown on mobile) */}
      <div className="sm:hidden space-y-4 mt-4">
        {suppliers.map((supplier) => (
          <SupplierCard key={supplier.id} supplier={supplier} />
        ))}
      </div>
    </div>
  );
}

// Desktop Table Row Component
function SupplierRow({ supplier }) {
  const statusText = SUPPLIERS_STATUS[supplier.verificationStatus] || "—";
  const statusColor =
    STATUS_COLORS[supplier.verificationStatus] || "bg-gray-400";

  return (
    <div className="grid grid-cols-12 border-t border-gray-200 py-4 px-4 items-center hover:bg-gray-50">
      <div className="col-span-3 truncate">{supplier.fullName || "—"}</div>
      <div className="col-span-3 truncate">{supplier.businessName || "—"}</div>
      <div className="col-span-2 truncate">{supplier.storeName || "—"}</div>

      <div className="col-span-2 flex justify-center">
        <span
          className={`${statusColor} px-2 py-1 rounded-lg text-white text-xs text-nowrap`}
        >
          {statusText}
        </span>
      </div>

      <div className="col-span-2 flex justify-center">
        <SupplierActionButton supplier={supplier} />
      </div>
    </div>
  );
}

// Mobile Card Component
function SupplierCard({ supplier }) {
  const statusText = SUPPLIERS_STATUS[supplier.verificationStatus] || "—";
  const statusColor =
    STATUS_COLORS[supplier.verificationStatus] || "bg-gray-400";

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-lg">{supplier.fullName || "—"}</h3>
          <span
            className={`${statusColor} px-2 py-1 rounded-lg text-white text-xs`}
          >
            {statusText}
          </span>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span className="text-gray-500">الاسم التجاري:</span>
            <span>{supplier.businessName || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">اسم المتجر:</span>
            <span>{supplier.storeName || "—"}</span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <SupplierActionButton supplier={supplier} />
        </div>
      </div>
    </div>
  );
}

// Shared Action Button Component
function SupplierActionButton({ supplier }) {
  const isPending = supplier.verificationStatus === "Pending";
  const buttonClass = isPending
    ? "bg-black hover:bg-gray-800 text-white"
    : "bg-gray-400 hover:bg-gray-500 text-white";
  const buttonText = isPending ? "مراجعة" : "تفاصيل";

  return (
    <Link
      to={`/admin/suppliers/${supplier.supplierId}`}
      className={`${buttonClass} px-3 py-1.5 rounded-xl text-sm transition-colors`}
    >
      {buttonText}
    </Link>
  );
}
