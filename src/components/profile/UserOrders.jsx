import React from "react";
import {  useQuery } from "@tanstack/react-query";
import { api } from "../../api/axiosInstance";
import {
  FaMoneyBillWave,
  FaCalendarAlt,
  FaCreditCard,
  FaHashtag,
  FaBox,
  FaTruck,
} from "react-icons/fa";
import { HiOutlineViewfinderCircle } from "react-icons/hi2";
import StatusBadge from "../ui/StatusBadge";
import { Link } from "react-router-dom";
import { FcCancel } from "react-icons/fc";

const fetchUserOrders = async () => {
  try {
    const { data } = await api.get("/orders", {
      params: {
        page: 1,
        limit: 20, // Or higher if you want all items
      },
    });
    return data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "فشل في تحميل الطلبات");
  }
};

export default function UserOrders() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["userOrders"],
    queryFn: fetchUserOrders,
    staleTime: 5 * 60 * 1000,
  });

  const allOrders = data?.items || [];

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

  const totalOrders = data?.totalItems || 0;

  const handleCancelOrderItem = async (id) => {
    try {
      const { data } = await api.post(`/orders/cancel-item/${id}`);
      console.log(data);
      refetch(); // Refresh the data after canceling
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="p-6 md:p-8 bg-white rounded-xl space-y-6">
      <div>
        <div className="border-b pb-4 flex items-center justify-between gap-2">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaBox className="text-teal-600" />
            طلباتي
          </h2>
          <div>
            <Link className="px-5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg duration-300 flex items-center gap-2">
              الكل
              <span>{`( ${totalOrders} )`}</span>
            </Link>
          </div>
        </div>
      </div>

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
            to="/search?SearchQuery=&Limit=20"
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition"
          >
            تصفح المنتجات
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {allOrders.map((order) => (
            <div
              key={order.orderId}
              className="md:border border-gray-200 rounded-lg sm:p-5 md:p-6 sm:shadow-md hover:shadow-lg transition duration-300 bg-white"
            >
              <div className="flex flex-wrap justify-between items-center gap-4 mb-4 pb-3 border-b">
                <div className="flex items-center gap-2 text-gray-700">
                  <FaHashtag className="text-teal-600" />
                  <span className="font-semibold">رقم الطلب:</span>
                  <span>{order.orderId}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4  gap-4 mb-4 text-xs">
                <div className="flex items-center gap- text-gray-700 ">
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
                  <span className="font-semibold ml-1">العدد:</span>
                  <span className="font-bold">{order.orderItems.length}</span>
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

              <div className="flex flex-col gap-5">
                {order.orderItems?.map((item) => (
                  <div
                    key={item.productId}
                    className="w-full max-w-full p-4 rounded-md sm:shadow-sm bg-white"
                  >
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                      {/* Product Image */}
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-20 h-20 object-cover rounded"
                      />

                      {/* Product Info */}
                      <div className="w-full">
                        {/* Product Name */}
                        <h2 className="truncate font-semibold w-[80%] text-xs md:text-md">
                          {item.productName}
                        </h2>

                        {/* Actions Row */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex gap-2">
                            <Link className="text-white bg-teal-600 hover:bg-teal-700 px-5 py-0.5 rounded-md flex items-center gap-2 duration-300">
                              <span>تفاصيل</span>
                              <span className="text-xl">
                                <HiOutlineViewfinderCircle />
                              </span>
                            </Link>

                            {item.status === "Pending" && (
                              <button
                                onClick={() =>
                                  handleCancelOrderItem(item.orderItemId)
                                }
                                className="bg-rose-50 hover:bg-rose-100 border border-red-500 text-red-500  px-5 py-0.5 shadow rounded-md flex items-center gap-2 duration-300"
                              >
                                <span>الغاء</span>
                                <span className="text-xl">
                                  <FcCancel />
                                </span>
                              </button>
                            )}
                          </div>

                          <StatusBadge status={item.status} size="lg" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

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


        </div>
      )}
    </div>
  );
}
