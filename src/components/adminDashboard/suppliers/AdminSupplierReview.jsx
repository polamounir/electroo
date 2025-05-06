import React, { useEffect, useState } from "react";
import { api } from "../../../api/axiosInstance";
import { useParams } from "react-router-dom";

export default function AdminSupplierReview() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [supplier, setSupplier] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [toast, setToast] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const getSupplierData = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/suppliers/${id}`);
      setSupplier(data.data);
      setActiveImage(data.data.nationalIdFront);
      setIsLoading(false);
      setIsError(false);
      console.log(data);
    } catch (error) {
      console.error("Error fetching supplier:", error);
      setIsError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSupplierData();
  }, [id]);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleVerify = () => {
    // Show confirmation modal with "verify" action
    setConfirmAction("verify");
    setShowConfirmModal(true);
  };

  const handleReject = () => {
    // Show confirmation modal with "reject" action
    setConfirmAction("reject");
    setShowConfirmModal(true);
  };

  const confirmVerify = () => {
    // Close modal
    setShowConfirmModal(false);
    // Execute verification logic
    showToast("تم قبول المورد بنجاح", "success");
  };

  const confirmReject = () => {
    // Close modal
    setShowConfirmModal(false);
    // Execute rejection logic
    showToast("تم رفض المورد", "error");
  };

  const closeModal = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-teal-500 border-teal-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError || !supplier) {
    return (
      <div className="bg-red-50 p-6 rounded-lg text-center">
        <div className="text-red-500 text-xl font-bold mb-2">حدث خطأ</div>
        <p className="text-red-700">
          فشل تحميل بيانات المورد. الرجاء المحاولة مرة أخرى.
        </p>
        <button
          onClick={getSupplierData}
          className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200 transition"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  const DocumentThumbnail = ({ src, alt, isActive, onClick }) => (
    <div
      onClick={() => onClick(src)}
      className={`cursor-pointer transition-all duration-300 ${
        isActive
          ? "ring-2 ring-teal-500 shadow-lg scale-105"
          : "opacity-70 hover:opacity-100"
      }`}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-24 object-cover rounded-lg"
      />
    </div>
  );

  // Confirmation Modal Component
  const ConfirmationModal = () => (
    <>
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 bg-opacity-50 z-40 flex items-center justify-center"
        onClick={closeModal}
      >
        {/* Modal Content */}
        <div
          className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 z-50 text-right"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">
            {confirmAction === "verify"
              ? "تأكيد قبول المورد"
              : "تأكيد رفض المورد"}
          </h3>

          <p className="text-gray-600 mb-6">
            {confirmAction === "verify"
              ? "هل أنت متأكد من قبول هذا المورد؟ سيتم إشعاره وتفعيل حسابه."
              : "هل أنت متأكد من رفض هذا المورد؟ سيتم إشعاره وإلغاء طلبه."}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={
                confirmAction === "verify" ? confirmVerify : confirmReject
              }
              className={`flex-1 font-medium py-3 px-6 rounded-lg shadow-sm ${
                confirmAction === "verify"
                  ? "bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white"
                  : "bg-red-500 hover:bg-red-600 active:bg-red-700 text-white"
              }`}
            >
              تأكيد
            </button>
            <button
              onClick={closeModal}
              className="flex-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition font-medium py-3 px-6 rounded-lg shadow-sm"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-2xl">
      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <span className="mr-2">{toast.type === "success" ? "✓" : "✕"}</span>
          <p>{toast.message}</p>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && <ConfirmationModal />}

      {/* Header with status badge */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-gray-100">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
          مراجعة بيانات المورد
          <span className="text-sm md:text-base font-normal text-gray-400 mt-1">
            #{supplier.id}
          </span>
        </h2>
        <div
          className={`mt-2 md:mt-0 px-4 py-1.5 rounded-full text-sm font-medium ${
            supplier.isVerified
              ? "bg-green-100 text-green-800"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {supplier.isVerified ? "✓ تم التحقق" : "⟳ في انتظار المراجعة"}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left column: Main image and thumbnails */}
        <div className="order-2 md:order-1">
          <div className="bg-gray-50 rounded-xl p-1 mb-4 shadow-sm">
            <img
              src={activeImage}
              alt="وثيقة المورد"
              className="w-full h-80 object-contain rounded-lg"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <DocumentThumbnail
              src={supplier.nationalIdFront}
              alt="الوجه الأمامي للبطاقة"
              isActive={activeImage === supplier.nationalIdFront}
              onClick={setActiveImage}
            />
            <DocumentThumbnail
              src={supplier.nationalIdBack}
              alt="الوجه الخلفي للبطاقة"
              isActive={activeImage === supplier.nationalIdBack}
              onClick={setActiveImage}
            />
            <DocumentThumbnail
              src={supplier.taxCard}
              alt="البطاقة الضريبية"
              isActive={activeImage === supplier.taxCard}
              onClick={setActiveImage}
            />
          </div>
        </div>

        {/* Right column: Supplier details */}
        <div className="order-1 md:order-2 bg-gray-50 rounded-xl p-6 text-right">
          <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3">
            معلومات المورد
          </h3>

          <div className="space-y-5">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-xs text-gray-500 mb-1">الاسم التجاري</p>
              <p className="text-lg font-medium text-gray-800">
                {supplier.businessName}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-xs text-gray-500 mb-1">اسم المتجر</p>
              <p className="text-lg font-medium text-gray-800">
                {supplier.storeName}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500 mb-1">الرقم الضريبي</p>
                <p className="text-base font-medium text-gray-800 font-mono">
                  {supplier.taxNumber}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500 mb-1">
                  رقم البطاقة القومية
                </p>
                <p className="text-base font-medium text-gray-800 font-mono">
                  {supplier.nationalIdNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleVerify}
              className="flex-1 bg-teal-500 hover:bg-teal-600 active:bg-teal-700 transition text-white font-medium py-3 px-6 rounded-lg shadow-sm"
            >
              قبول الطلب
            </button>
            <button
              onClick={handleReject}
              className="flex-1 bg-white border border-red-200 text-red-500 hover:bg-red-50 active:bg-red-100 transition font-medium py-3 px-6 rounded-lg shadow-sm"
            >
              رفض الطلب
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
