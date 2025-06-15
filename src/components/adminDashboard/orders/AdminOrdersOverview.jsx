import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { TbReload } from "react-icons/tb";
import StatusBadge from "../../ui/StatusBadge";
import LoadingSpinner from "../../ui/LoadingSpinner";

const STATUS_LABELS = {
  Pending: "قيد الانتظار",
  Confirmed: "تم التأكيد",
  Shipped: "تم الشحن",
  Delivered: "تم التسليم",
  Cancelled: "تم الإلغاء",
  Completed: "مكتمل",
};

const ORDER_STATUSES = ["Pending", "Cancelled", "Completed"];

export default function OrdersOverview() {
  const [orderId, setOrderId] = useState("");
  const [sortByStatus, setSortByStatus] = useState("Pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(2);
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["orders", sortByStatus, currentPage],
    queryFn: async () => {
      const res = await api.get(
        `/admin/orders?Page=${currentPage}&Limit=${limit}&Status=${sortByStatus}`
      );
      return res.data.data;
    },
    refetchOnWindowFocus: false,
  });

  // Navigation handlers
  const navigateToOrder = () => navigate(`/admin/orders/${orderId.trim()}`);
  const navigateToOrderPage = (id) => navigate(`/admin/orders/${id}`);
  const handleStatusChange = (status) => {
    setSortByStatus(status);
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = data ? Math.ceil(data.totalItems / limit) : 0;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (isError) {
    return (
      <div className="text-center p-6">
        <span className="text-2xl font-semibold flex justify-center items-center gap-2">
          خطأ في جلب البيانات
        </span>
        <div className="flex justify-center items-center gap-2 mt-3">
          <TbReload className="text-xl" />
          <span>لا يمكن تحميل البيانات</span>
        </div>
        <button
          onClick={refetch}
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md mt-4 transition-colors"
        >
          حاول مرة أخرى
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Order Search */}
      <div className="border border-teal-600 rounded-2xl overflow-hidden">
        <div className="bg-teal-600 p-2 text-center">
          <h2 className="text-white">ادخل رقم الطلب</h2>
        </div>
        <div className="p-4">
          <div className="flex relative overflow-hidden rounded-lg border border-gray-300">
            <input
              type="text"
              placeholder="رقم الطلب"
              className="px-4 py-2 w-full pe-20"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && navigateToOrder()}
            />
            <button
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 absolute end-0 top-0 bottom-0 text-white transition-colors"
              onClick={navigateToOrder}
            >
              بحث
            </button>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">الطلبات</h2>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2">
          {ORDER_STATUSES.map((status) => (
            <button
              key={status}
              className={`px-4 py-1 rounded-lg border transition-colors ${
                sortByStatus === status
                  ? "bg-black text-white"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => handleStatusChange(status)}
            >
              {STATUS_LABELS[status]}
            </button>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <div className="grid grid-cols-12 gap-4 bg-gray-200 px-4 py-2 font-semibold border border-gray-300 rounded-t-lg">
            <div className="col-span-5">رقم الطلب</div>
            <div className="col-span-3 text-center">اسم المستخدم</div>
            <div className="col-span-2 text-center">تاريخ الطلب</div>
            <div className="col-span-2 text-center">حالة الطلب</div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <LoadingSpinner text="جاري جلب البيانات..." />
            </div>
          ) : data?.items?.length > 0 ? (
            data.items.map((order) => (
              <OrderTableRow
                key={order.orderId}
                order={order}
                onClick={() => navigateToOrderPage(order.orderId)}
              />
            ))
          ) : (
            <div className="text-center py-5 text-gray-500 font-semibold text-xl border border-gray-300 rounded-b-lg">
              لا يوجد طلبات
            </div>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <LoadingSpinner text="جاري جلب البيانات..." />
            </div>
          ) : data?.items?.length > 0 ? (
            data.items.map((order) => (
              <OrderCard
                key={order.orderId}
                order={order}
                onClick={() => navigateToOrderPage(order.orderId)}
              />
            ))
          ) : (
            <div className="text-center py-5 text-gray-500 font-semibold text-xl">
              لا يوجد طلبات
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            getPageNumbers={getPageNumbers}
            handlePageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}

// Desktop Table Row Component
function OrderTableRow({ order, onClick }) {
  return (
    <div
      className={`grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-200 items-center hover:bg-gray-50 cursor-pointer transition-colors`}
      onClick={onClick}
    >
      <div className="col-span-5 font-medium">{order.orderId}</div>
      <div className="col-span-3 text-center text-gray-600 truncate">
        {order.buyerEmail}
      </div>
      <div className="col-span-2 text-center text-gray-600">
        {new Date(order.orderDate).toLocaleDateString("ar-EG")}
      </div>
      <div className="col-span-2 text-center">
        <StatusBadge status={order.status} />
      </div>
    </div>
  );
}

// Mobile Card Component
function OrderCard({ order, onClick }) {
  return (
    <div
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md cursor-pointer transition-shadow"
      onClick={onClick}
    >
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-lg">#{order.orderId}</h3>
          <StatusBadge status={order.status} />
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span className="text-gray-500">البريد الإلكتروني:</span>
            <span className="truncate max-w-[150px]">{order.buyerEmail}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">تاريخ الطلب:</span>
            <span>{new Date(order.orderDate).toLocaleDateString("ar-EG")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Pagination Controls Component
function PaginationControls({
  currentPage,
  totalPages,
  getPageNumbers,
  handlePageChange,
}) {
  return (
    <div className="flex justify-center items-center gap-2 my-5">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 transition-colors"
      >
        &lsaquo;
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-3 py-1 border rounded transition-colors ${
            currentPage === page ? "bg-black text-white" : "hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 transition-colors"
      >
        &rsaquo;
      </button>
    </div>
  );
}
