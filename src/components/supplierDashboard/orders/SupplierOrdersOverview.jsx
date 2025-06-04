import React, { useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../../api/axiosInstance";

import {
  FiPackage,
  FiUser,
  FiMail,
  FiMapPin,
  FiCalendar,
} from "react-icons/fi";

const fetchOrders = async ({ pageParam = 1 }) => {
  const res = await api.get(`/suppliers/order-items?Page=${pageParam}&Limit=6`);
  return res.data.data;
};

export default function SupplierOrdersOverview() {

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["supplierOrders"],
    queryFn: fetchOrders,
    getNextPageParam: (lastPage, pages) => {
      const nextPage = pages.length + 1;
      return lastPage.items.length < lastPage.totalItems ? nextPage : undefined;
    },
  });

  const observerRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [fetchNextPage, hasNextPage]);
  // -------------------------------------------------
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64 p-8">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-xl font-semibold text-center text-teal-600">
            جاري جلب البيانات ...
          </div>
        </div>
      </div>
    );
  }
  // -------------------------------------------------

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 p-8">
        <div className="text-2xl font-semibold text-red-500 mb-2">
          خطأء في جلب البيانات
        </div>
        <p className="text-gray-500 mb-6 text-center">
          لم نتمكن من الوصول إلى البيانات، يرجى المحاولة مرة أخرى
        </p>
        <button
          onClick={refetch}
          className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-md transition-colors font-medium"
        >
          حاول مرة اخرى
        </button>
      </div>
    );
  }
  // -------------------------------------------------

  console.log(data);
  const orders = data?.pages.flatMap((page) => page.items) || [];

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">الطلبات</h2>
        <div className="bg-teal-50 text-teal-700 px-4 py-1 rounded-full text-sm font-medium">
          {data.pages[0].totalItems || 0} طلب
        </div>
      </div>

      {orders.length === 0 && (
        <div className="text-center mt-5 p-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <div className="text-gray-400 text-5xl mb-4">📦</div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            لا توجد طلبات
          </h3>
          <p className="text-gray-500">ستظهر الطلبات الجديدة هنا عند وصولها</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-6">
        {orders.map((order, index) => (
          <div
            key={`${order.orderItemId}_${index}`}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md duration-300"
          >
            <div className="relative">
              <span
                className={`absolute top-4 left-4 py-1 px-3 rounded-full text-xs font-medium ${getStatusBadgeClass(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>

            {/*Head*/}
            <div className="p-4 flex items-start space-x-4 space-x-reverse border-b border-gray-100">
              <div className="relative h-16 w-16 flex-shrink-0">
                <img
                  src={order.imageUrl || "/api/placeholder/64/64"}
                  alt={order.productName}
                  className="h-full w-full object-cover rounded-md shadow-sm"
                />
              </div>
              <div className="flex-1 min-w-0 ms-5">
                <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 text-start">
                  {order.productName}
                </h3>
                <div className="flex items-center text-sm text-gray-500 ">
                  <FiCalendar className="ml-1" size={14} />
                  <span>
                    {new Date(order.orderDate).toLocaleDateString("ar-EG")}
                  </span>
                </div>
              </div>
            </div>

            {/*details*/}
            <div className="p-4 space-y-3">
              {/* <div className="flex items-center text-sm">
                <div className="w-8">
                  <FiUser className="text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="text-gray-500 mb-0.5">المشتري</div>
                  <div className="font-medium text-gray-900">
                    {order.buyerName}
                  </div>
                </div>
              </div> */}

              {/* <div className="flex items-center text-sm">
                <div className="w-8">
                  <FiMail className="text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="text-gray-500 mb-0.5">البريد الإلكتروني</div>
                  <div className="font-medium text-gray-900 truncate" dir="ltr">
                    {order.buyerEmail}
                  </div>
                </div>
              </div>

              <div className="flex items-center text-sm">
                <div className="w-8">
                  <FiMapPin className="text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="text-gray-500 mb-0.5">العنوان</div>
                  <div className="font-medium text-gray-900 line-clamp-2">
                    {order.shippingAddress}
                  </div>
                </div>
              </div> */}

              <div className="flex items-center text-sm mt-4">
                <div className="w-8">
                  <FiPackage className="text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="text-gray-500 mb-0.5">تفاصيل الطلب</div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-600">الكمية:</span>
                    <span className="font-medium">{order.quantity}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-600">السعر:</span>
                    <span className="font-medium" dir="ltr">
                      {order.price.toFixed(2)} ج.م
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-600">الإجمالي:</span>
                    <span className="font-bold text-teal-600" dir="ltr">
                      {(order.price * order.quantity).toFixed(2)} ج.م
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="px-4 py-3 bg-gray-50 flex justify-end gap-2 border-t border-gray-100">
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm">
                <FaRegEdit size={14} />
                <span>تعديل</span>
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-white border border-red-200 text-red-500 hover:bg-red-50 transition-colors text-sm">
                <GoTrash size={14} />
                <span>حذف</span>
              </button>
            </div> */}
          </div>
        ))}
      </div>

      {/* Empty space for infinite scroll trigger */}
      <div ref={observerRef} className="h-10 mt-6"></div>

      {isFetchingNextPage && (
        <div className="text-center py-4 flex justify-center items-center space-x-2 space-x-reverse">
          <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-teal-600 font-medium">
            جاري تحميل المزيد...
          </span>
        </div>
      )}
    </div>
  );
}
