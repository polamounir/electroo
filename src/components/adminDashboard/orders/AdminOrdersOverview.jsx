import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { TbReload } from "react-icons/tb";
import StatusBadge from "../../ui/StatusBadge";

export default function OrdersOverview() {
  const [orderId, setOrderId] = useState("");
  const [sortByStatus, setSortByStatus] = useState("Pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(2); // You can make this configurable if needed
  const navigate = useNavigate();

  const navigateToOrder = () => {
    navigate(`/admin/orders/${orderId.trim()}`);
  };

  const navigateToOrderPage = (id) => {
    navigate(`/admin/orders/${id}`);
  };

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

  const totalPages = data ? Math.ceil(data.totalItems / limit) : 0;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isError) {
    return (
      <div>
        <span className="text-2xl font-semibold text-center flex justify-center items-center gap-2">
          خطأء في جلب البيانات
        </span>
        <div className="flex justify-center items-center gap-2 mt-5">
          <TbReload className="text-2xl" />
          <span>لا يمكنك تحميل البيانات</span>
        </div>
        <button
          onClick={refetch}
          className="bg-teal-500 text-white px-4 py-2 rounded-md mt-5"
        >
          حاول مرة اخرى
        </button>
      </div>
    );
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Number of visible page buttons

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust if we're at the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div>
      <div className="border border-teal-600 rounded-2xl overflow-hidden">
        <div className="bg-teal-600 p-2 text-center">
          <h2 className="text-white">ادخل رقم الطلب</h2>
        </div>
        <div className="p-5">
          <div className="flex gap-5 text-lg font-semibold items-center mt-5 relative overflow-hidden rounded-lg border border-gray-300">
            <input
              type="text"
              placeholder="رقم الطلب"
              name="orderId"
              className="px-4 py-2 w-full pe-20"
              onChange={(e) => setOrderId(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 absolute end-0 top-0 bottom-0 text-white duration-300"
              onClick={navigateToOrder}
            >
              بحث
            </button>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-10">الطلبات</h2>
      <div className="flex flex-wrap items-center gap-3 mt-2">
        {["Pending", "Cancelled", "Completed"].map((value) => (
          <button
            key={value}
            className={`px-5 py-1 rounded-lg border border-gray-300 ${
              sortByStatus === value ? "bg-black text-white" : ""
            }`}
            onClick={() => {
              setSortByStatus(value);
              setCurrentPage(1); // Reset to first page when changing status
            }}
          >
            {
              {
                Pending: "قيد الانتظار",
                Confirmed: "تم التأكيد",
                Shipped: "تم الشحن",
                Delivered: "تم التسليم",
                Cancelled: "تم الإلغاء",
                Completed: "تم ",
              }[value]
            }
          </button>
        ))}
      </div>

      <div className="mt-5">
        <div className="grid grid-cols-11 gap-4 bg-gray-200 px-4 py-2 font-semibold border border-gray-300 rounded-t-lg">
          <div className="col-span-5">رقم الطلب</div>
          <div className="col-span-2 text-center">اسم المستخدم</div>
          <div className="col-span-2 text-center">تاريخ الطلب</div>
          <div className="col-span-2 text-center">حالة الطلب</div>
        </div>

        {isLoading && (
          <div className="text-teal-500 text-center text-2xl font-semibold pt-10">
            جاري جلب البيانات ...
          </div>
        )}

        {!isLoading &&
          data?.items?.map((order, index) => (
            <div
              key={`${order.orderId}_${index}`}
              className={`cursor-pointer grid grid-cols-11 gap-4 px-4 py-3 border-b border-gray-200 items-center ${
                index % 2 === 0 ? "" : "bg-gray-100"
              } hover:bg-black/20 duration-300`}
              onClick={() => navigateToOrderPage(order.orderId)}
            >
              <div className="col-span-5">{order.orderId}</div>
              <div className="col-span-2 text-center">{order.buyerEmail}</div>
              <div className="col-span-2 text-center">
                {new Date(order.orderDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="col-span-2 text-center">
                <StatusBadge status={order.status} />
              </div>
            </div>
          ))}

        {!isLoading && data?.items?.length === 0 && (
          <div className="text-center py-5 text-gray-500 font-semibold text-xl">
            لا يوجد طلبات
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 my-5">
            {/* <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              &laquo;
            </button> */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              &lsaquo;
            </button>

            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 border rounded ${
                  currentPage === page ? "bg-black text-white" : ""
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              &rsaquo;
            </button>
            {/* <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              &raquo;
            </button> */}
          </div>
        )}
      </div>
    </div>
  );
}
