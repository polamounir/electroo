import { useState, useEffect, useCallback } from "react";
import { FaRegEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/axiosInstance";
import { toast } from "sonner";
import { TbReload, TbDiscountOff } from "react-icons/tb";

export default function PromoTable() {
  const navigate = useNavigate();

  const [promos, setPromos] = useState({ items: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPromos = useCallback(async (query = "") => {
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = query
        ? `/coupons?Page=1&Limit=10&SearchQuery=${query}`
        : `/coupons?Page=1&Limit=10`;

      const response = await api.get(endpoint);
      setPromos(response.data.data);
    } catch (err) {
      console.error("Error fetching Promos:", err);
      setError(err);
      toast.error("فشل تحميل أكواد الخصم");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromos();
  }, [fetchPromos]);

  const handleAddNavigation = () => navigate("/admin/promos/add");
  const handleEditNavigation = (codeId) =>
    navigate(`/admin/promos/edit/${codeId}`);

  const updatePromoStatus = (codeId, isActive) => {
    setPromos((prev) => ({
      ...prev,
      items: prev.items.map((promo) =>
        promo.id === codeId ? { ...promo, isActive } : promo
      ),
    }));
  };

  const handleDelete = async (codeId) => {
    try {
      const response = await api.put(`/coupons/${codeId}/deactivate`);
      if (response.data.status === "Successful") {
        toast.success(response.data.message || "تم إلغاء تفعيل الكود");
        updatePromoStatus(codeId, false);
      } else {
        toast.error("فشل إلغاء تفعيل الكود");
      }
    } catch (err) {
      console.error("Error deleting", err);
      toast.error(err.response?.data?.detail || "حدث خطأ ما, حاول مرة اخرى");
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleReactivate = async (codeId) => {
    try {
      const response = await api.put(`/coupons/${codeId}/reactivate`);
      if (response.data.status === "Successful") {
        toast.success(response.data.message || "تم إعادة تفعيل الكود");
        updatePromoStatus(codeId, true);
      } else {
        toast.error("فشل إعادة تفعيل الكود");
      }
    } catch (err) {
      console.error("Error reactivating", err);
      toast.error(err.response?.data?.detail || "حدث خطأ ما, حاول مرة اخرى");
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      fetchPromos(searchQuery);
    }
  };

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
          onClick={() => fetchPromos()}
        >
          إعادة تحميل
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="flex gap-5 text-lg font-semibold items-center mt-5 relative overflow-hidden rounded-lg border border-gray-300 mb-5">
        <input
          type="text"
          placeholder="بحث ..."
          className="px-4 py-2 w-full pe-20"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
        <button
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 absolute end-0 top-0 bottom-0 text-white duration-300"
          onClick={handleSearch}
        >
          بحث
        </button>
      </div>

      {/* Header */}
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">أكواد الخصم</h2>
        <button
          className="bg-black px-5 py-2 text-white rounded-lg hover:bg-gray-800 transition-colors"
          onClick={handleAddNavigation}
        >
          أضافة كود
        </button>
      </div>

      {/* Empty State */}
      {promos.items?.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-500">لا يوجد أكواد خصم</p>
          <button
            className="mt-4 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
            onClick={handleAddNavigation}
          >
            أضافة كود جديد
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden sm:block">
            <div className="flex flex-col mt-4 overflow-x-auto">
              <div className="grid grid-cols-12 py-3 bg-gray-100 rounded-t-lg px-4 font-medium">
                <div className="col-span-4">الكود</div>
                <div className="col-span-2">الخصم</div>
                <div className="col-span-2 text-center">الصلاحية</div>
                <div className="col-span-2 text-center">الحالة</div>
                <div className="col-span-2 text-center">العمليات</div>
              </div>

              <div className="rounded-b-lg">
                {promos.items.map((code) => (
                  <PromoTableRow
                    key={code.id}
                    code={code}
                    deleteConfirm={deleteConfirm}
                    setDeleteConfirm={setDeleteConfirm}
                    handleEditNavigation={handleEditNavigation}
                    handleReactivate={handleReactivate}
                    handleDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-4 mt-4">
            {promos.items.map((code) => (
              <PromoCard
                key={code.id}
                code={code}
                deleteConfirm={deleteConfirm}
                setDeleteConfirm={setDeleteConfirm}
                handleEditNavigation={handleEditNavigation}
                handleReactivate={handleReactivate}
                handleDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <DeleteConfirmationModal
          onCancel={() => setDeleteConfirm(null)}
          onConfirm={() => handleDelete(deleteConfirm)}
        />
      )}
    </div>
  );
}

// Desktop Table Row Component
function PromoTableRow({
  code,
  deleteConfirm,
  setDeleteConfirm,
  handleEditNavigation,
  handleReactivate,
}) {
  return (
    <div className="grid grid-cols-12 border-t border-gray-200 py-4 px-4 items-center hover:bg-gray-50">
      <div className="col-span-4 truncate font-medium">{code.code || "—"}</div>
      <div className="col-span-2 truncate">
        {code.discountPercentage || "—"}%
      </div>

      <div className="col-span-2 flex justify-center">
        <StatusBadge
          active={code.isValid}
          trueText="صالح"
          falseText="غير صالح"
        />
      </div>

      <div className="col-span-2 flex justify-center">
        <StatusBadge active={code.isActive} trueText="نشط" falseText="موقوف" />
      </div>

      <div className="col-span-2 flex justify-center gap-3">
        <button
          className="text-teal-600 text-xl hover:text-teal-800 transition-colors"
          onClick={() => handleEditNavigation(code.id)}
          title="تعديل الكود"
        >
          <FaRegEdit />
        </button>

        {!code.isActive ? (
          <button
            className="text-green-600 text-xl hover:text-green-800 transition-colors"
            onClick={() => handleReactivate(code.id)}
            title="إعادة تفعيل الكود"
          >
            <TbReload />
          </button>
        ) : (
          <button
            className="text-red-600 text-xl hover:text-red-800 transition-colors"
            onClick={() => setDeleteConfirm(code.id)}
            title="إلغاء تفعيل الكود"
          >
            <TbDiscountOff />
          </button>
        )}
      </div>
    </div>
  );
}

// Mobile Card Component
function PromoCard({
  code,
  deleteConfirm,
  setDeleteConfirm,
  handleEditNavigation,
  handleReactivate,
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg">{code.code || "—"}</h3>
            <p className="text-gray-600">
              {code.discountPercentage || "—"}% خصم
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <StatusBadge
              active={code.isValid}
              trueText="صالح"
              falseText="غير صالح"
              small
            />
            <StatusBadge
              active={code.isActive}
              trueText="نشط"
              falseText="موقوف"
              small
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            className="text-teal-600 hover:text-teal-800 transition-colors p-2"
            onClick={() => handleEditNavigation(code.id)}
            title="تعديل الكود"
          >
            <FaRegEdit size={18} />
          </button>

          {!code.isActive ? (
            <button
              className="text-green-600 hover:text-green-800 transition-colors p-2"
              onClick={() => handleReactivate(code.id)}
              title="إعادة تفعيل الكود"
            >
              <TbReload size={18} />
            </button>
          ) : (
            <button
              className="text-red-600 hover:text-red-800 transition-colors p-2"
              onClick={() => setDeleteConfirm(code.id)}
              title="إلغاء تفعيل الكود"
            >
              <TbDiscountOff size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Shared Status Badge Component
function StatusBadge({ active, trueText, falseText, small = false }) {
  const baseClasses = "px-2 py-1 rounded-lg text-white";
  const sizeClass = small ? "text-xs" : "text-sm";
  const colorClass = active ? "bg-teal-600" : "bg-red-400";

  return (
    <span className={`${baseClasses} ${colorClass} ${sizeClass}`}>
      {active ? trueText : falseText}
    </span>
  );
}

// Delete Confirmation Modal Component
function DeleteConfirmationModal({ onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 z-40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 z-50 text-right">
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">
          تأكيد إلغاء الكود
        </h3>

        <p className="text-gray-600 mb-6">هل أنت متأكد من إلغاء هذا الكود؟</p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 font-medium py-3 px-6 rounded-lg shadow-sm bg-red-500 hover:bg-red-600 active:bg-red-700 text-white transition-colors"
          >
            تأكيد الإلغاء
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors font-medium py-3 px-6 rounded-lg shadow-sm"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
