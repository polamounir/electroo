import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { api } from "../../api/axiosInstance";
import {
  FaMoneyBillWave,
  FaCalendarAlt,
  FaCreditCard,
  FaHashtag,
  FaBox,
  FaTruck,
} from "react-icons/fa";
import StatusBadge from "../ui/StatusBadge";
import { Link } from "react-router-dom";


const fetchUserOrders = async ({ pageParam = 1 }) => {
  try {
    const { data } = await api.get(`/orders`, {
      params: {
        page: pageParam,
        limit: 10,
      },
    });
    return data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "فشل في تحميل الطلبات");
  }
};

export default function UserOrders() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["userOrders"],
    queryFn: fetchUserOrders,
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined,

    retry: 1,
    staleTime: 5 * 60 * 1000, 
  });

  const allOrders = data?.pages.flatMap((page) => page.items) || [];

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px", 
  });

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Format date for Arabic locale
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      console.log(e);
      return dateString;
    }
  };

  return (
    <div className="p-6 md:p-8 bg-white rounded-xl space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 flex items-center gap-2">
        <FaBox className="text-teal-600" />
        طلباتي
      </h2>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-teal-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الطلبات...</p>
        </div>
      ) : isError ? (
        <div className="py-10 text-center">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg inline-block">
            <p className="font-semibold">حدث خطأ أثناء تحميل الطلبات</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
          <button
            onClick={() => fetchNextPage()}
            className="mt-4 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : allOrders.length === 0 ? (
        <div className="py-16 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            لا توجد طلبات حتى الآن
          </h3>
          <p className="text-gray-500 mb-6">
            ابدأ التسوق الآن واستمتع بتجربة شراء مميزة
          </p>
          <Link
            to="/products"
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition"
          >
            تصفح المنتجات
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {allOrders.map((order) => (
            <div
              key={order.orderId}
              className="border border-gray-200 rounded-lg p-5 md:p-6 shadow-sm hover:shadow-md transition duration-300 bg-white"
            >
              <div className="flex flex-wrap justify-between items-center gap-4 mb-4 pb-3 border-b">
                <div className="flex items-center gap-2 text-gray-700">
                  <FaHashtag className="text-teal-600" />
                  <span className="font-semibold">رقم الطلب:</span>
                  <span>{order.orderId}</span>
                </div>

                <StatusBadge status={order.status} size="lg" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <FaCalendarAlt className="text-teal-600" />
                  <span className="font-semibold ml-1">التاريخ:</span>
                  <span>{formatDate(order.orderDate)}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <FaCreditCard className="text-teal-600" />
                  <span className="font-semibold ml-1">طريقة الدفع:</span>
                  <span>{order.paymentMethod}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <FaMoneyBillWave className="text-teal-600" />
                  <span className="font-semibold ml-1">المبلغ:</span>
                  <span className="font-bold">
                    {order.subTotal.toFixed(2)} ج.م
                  </span>
                </div>
              </div>

              {order.shippingAddress && (
                <div className="mt-3 text-sm text-gray-600 flex items-start gap-2">
                  <FaTruck className="mt-1 text-gray-500" />
                  <div>
                    <span className="font-semibold">عنوان الشحن: </span>
                    {order.shippingAddress}
                  </div>
                </div>
              )}

              {/* View Order Details Button */}
              <div className="mt-4 flex justify-end">
                <Link
                  to={`/orders/${order.orderId}`}
                  className="text-teal-600 hover:text-teal-700 hover:underline text-sm font-medium"
                >
                  عرض تفاصيل الطلب
                </Link>
              </div>
            </div>
          ))}

          {/* Intersection Observer Target */}
          <div ref={ref} className="h-10" />

          {isFetchingNextPage && (
            <div className="text-center py-4">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-teal-600 rounded-full animate-spin mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">جاري تحميل المزيد...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
