import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { toast } from "sonner";


const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemToCancel,
  orderId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 mx-4">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          تأكيد إلغاء الطلب
        </h3>
        <p className="text-gray-600 mb-6">
          هل أنت متأكد من رغبتك في إلغاء هذا المنتج من الطلب؟
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="grow justify-center items-center px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg duration-300"
          >
            تراجع
          </button>
          <button
            onClick={() => {
              onConfirm(itemToCancel, orderId);
              onClose();
            }}
            className="grow justify-center items-center px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg duration-300"
          >
            تأكيد
          </button>
        </div>
      </div>
    </div>
  );
};

const fetchUserOrders = async () => {
  try {
    const { data } = await api.get("/orders", {
      params: {
        page: 1,
        limit: 20,
      },
    });
    return data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "فشل في تحميل الطلبات");
  }
};

export default function UserOrders() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToCancel, setItemToCancel] = useState(null);
  const [orderIdToCancel, setOrderIdToCancel] = useState(null);
  const [orderItemsStatuses, setOrderItemsStatuses] = useState([]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["userOrders"],
    queryFn: fetchUserOrders,
    staleTime: 5 * 60 * 1000,
  });

  const allOrders = data?.items || [];
  const totalOrders = data?.totalItems || 0;

  const setItemsStatus = () => {
    const newOrderItemsStatuses = allOrders.map((order) => {
      const orderItemsStatus = order.orderItems.map((item) => {
        return { id: item.orderItemId, status: item.status };
      });
      return { orderId: order.orderId, orderItemsStatus: orderItemsStatus };
    });
    setOrderItemsStatuses(newOrderItemsStatuses);
  };

  useEffect(() => {
    if (allOrders.length > 0) {
      setItemsStatus();
    }
  }, [data]);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      console.error("Date formatting error:", e);
      return dateString;
    }
  };

  const handleCancelRequest = (orderItemId, orderId) => {
    setItemToCancel(orderItemId);
    setOrderIdToCancel(orderId);
    setIsModalOpen(true);
  };

  const updateItemsStatus = (orderItemId, orderId) => {
    const updatedOrderItemsStatuses = orderItemsStatuses.map((order) => {
      if (order.orderId === orderId) {
        const updatedOrderItemsStatus = order.orderItemsStatus.map((item) => {
          if (item.id === orderItemId) {
            return { ...item, status: "Cancelled" };
          }
          return item;
        });
        return { ...order, orderItemsStatus: updatedOrderItemsStatus };
      }
      return order;
    });
    setOrderItemsStatuses(updatedOrderItemsStatuses);
  };

  const handleConfirmCancel = async (orderItemId, orderId) => {
    try {
      const { data } = await api.post(`/orders/cancel-item/${orderItemId}`);
      if (data.status === "Successful") {
        updateItemsStatus(orderItemId, orderId);
        toast.success(data.message);
      }
    } catch (e) {
      console.error("Cancel order item error:", e);
      toast.error("حدث خطأ أثناء إلغاء الطلب");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 bg-white rounded-xl">
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-teal-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الطلبات...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 md:p-8 bg-white rounded-xl">
        <div className="py-10 text-center">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg inline-block">
            <p className="font-semibold">حدث خطأ أثناء تحميل الطلبات</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
          <button
            onClick={() => refetch()}
            className="mt-4 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  // Helper function to find status for an order item
  const getOrderItemStatus = (orderId, orderItemId) => {
    const orderMatch = orderItemsStatuses.find(
      (order) => order.orderId === orderId
    );
    if (!orderMatch) return null;

    const itemMatch = orderMatch.orderItemsStatus.find(
      (item) => item.id === orderItemId
    );
    return itemMatch ? itemMatch.status : null;
  };

  // Helper function to check if an item is pending
  const isItemPending = (orderId, orderItemId) => {
    const status = getOrderItemStatus(orderId, orderItemId);
    return status === "Pending";
  };

  return (
    <div className="p-6 md:p-8 bg-white rounded-xl space-y-6">
      {/* Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmCancel}
        itemToCancel={itemToCancel}
        orderId={orderIdToCancel}
      />

      {/* Header */}
      <div>
        <div className="border-b pb-4 flex items-center justify-between gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaBox className="text-teal-600" />
            طلباتي
          </h2>
          <div>
            <Link className="px-3 py-1 md:px-5 md:py-1.5 text-sm md:text-base bg-teal-600 hover:bg-teal-700 text-white rounded-lg duration-300 flex items-center gap-2">
              الكل
              <span>{`(${totalOrders})`}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {allOrders.length === 0 ? (
        <div className="py-16 text-center">
          <div className="text-5xl md:text-6xl mb-4">🛒</div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">
            لا توجد طلبات حتى الآن
          </h3>
          <p className="text-gray-500 mb-6">
            ابدأ التسوق الآن واستمتع بتجربة شراء مميزة
          </p>
          <Link
            to="/search?SearchQuery=&Limit=20"
            className="bg-teal-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:bg-teal-700 transition text-sm md:text-base"
          >
            تصفح المنتجات
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {allOrders.map((order) => (
            <div
              key={order.orderId}
              className="md:border border-gray-200 rounded-lg sm:p-4 md:p-6 sm:shadow-md hover:shadow-lg transition duration-300 bg-white"
            >
              {/* Order header */}
              <div className="flex flex-wrap justify-between items-center gap-3 mb-4 pb-3 border-b">
                <div className="flex items-center gap-1 md:gap-2 text-gray-700 text-sm md:text-base">
                  <FaHashtag className="text-teal-600" />
                  <span className="font-semibold">رقم الطلب:</span>
                  <span>{order.orderId}</span>
                </div>
              </div>

              {/* Order info */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-4 text-xs md:text-sm">
                <div className="flex items-center gap-1 md:gap-2 text-gray-700">
                  <FaCalendarAlt className="text-teal-600" />
                  <span className="font-semibold ml-1">التاريخ:</span>
                  <span>{formatDate(order.orderDate)}</span>
                </div>

                <div className="flex items-center gap-1 md:gap-2 text-gray-700">
                  <FaCreditCard className="text-teal-600" />
                  <span className="font-semibold ml-1">طريقة الدفع:</span>
                  <span>{order.paymentMethod}</span>
                </div>

                <div className="flex items-center gap-1 md:gap-2 text-gray-700">
                  <FaMoneyBillWave className="text-teal-600" />
                  <span className="font-semibold ml-1">العدد:</span>
                  <span className="font-bold">{order.orderItems.length}</span>
                </div>
                <div className="flex items-center gap-1 md:gap-2 text-gray-700">
                  <FaMoneyBillWave className="text-teal-600" />
                  <span className="font-semibold ml-1">المبلغ:</span>
                  <span className="font-bold">
                    {order.subTotal.toFixed(2)} ج.م
                  </span>
                </div>
              </div>

              {/* Shipping address */}
              {order.shippingAddress && (
                <div className="mt-2 mb-3 text-xs md:text-sm text-gray-600 flex items-start gap-1 md:gap-2">
                  <FaTruck className="mt-1 text-gray-500" />
                  <div>
                    <span className="font-semibold">عنوان الشحن: </span>
                    {order.shippingAddress}
                  </div>
                </div>
              )}

              {/* Order items */}
              <div className="flex flex-col gap-3 md:gap-5">
                {order.orderItems?.map((item) => (
                  <div
                    key={item.orderItemId}
                    className="w-full max-w-full p-3 md:p-4 rounded-md sm:shadow-sm bg-white relative overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-center">
                      {/* Product Image */}
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-16 h-16 md:w-20 md:h-20 object-cover rounded"
                      />

                      {/* Product Info */}
                      <div className="w-full flex flex-col items-start ">
                        <h2 className=" font-semibold text-xs md:text-sm ">
                          {item.productName}
                        </h2>

                        <div className="flex items-center justify-center sm:justify-between mt-2 gap-2 w-full ">
                          <div className="flex gap-2">
                            <Link
                              to={`/product/${item.productId}`}
                              className="text-white bg-teal-600 hover:bg-teal-700 px-3 py-1 md:px-4 md:py-1 text-xs md:text-sm rounded-md flex items-center gap-1 duration-300"
                            >
                              <span className="">تفاصيل</span>
                              <HiOutlineViewfinderCircle size={16} />
                            </Link>

                            {isItemPending(order.orderId, item.orderItemId) && (
                              <button
                                onClick={() =>
                                  handleCancelRequest(
                                    item.orderItemId,
                                    order.orderId
                                  )
                                }
                                className="bg-rose-50 hover:bg-rose-100 border border-red-500 text-red-500 px-3 py-1 md:px-4 md:py-1 text-xs md:text-sm rounded-md flex items-center gap-1 duration-300"
                              >
                                <span>الغاء</span>
                                <FcCancel size={16} />
                              </button>
                            )}
                          </div>

                          <div className="absolute sm:static top-2 end-0">
                            <StatusBadge
                              status={
                                getOrderItemStatus(
                                  order.orderId,
                                  item.orderItemId
                                ) || item.status
                              }
                              size="md"
                            />
                          </div>
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
                  className="text-teal-600 hover:text-teal-700 hover:underline text-xs md:text-sm font-medium"
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
