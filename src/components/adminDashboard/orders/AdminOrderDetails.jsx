import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../../api/axiosInstance";
import { useEffect, useState } from "react";

export default function AdminOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [orderItemsStatus, setOrderItemsStatus] = useState([]);

  useEffect(() => {
    getOrder();
  }, []);

  const getOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}/details`);
      const orderData = response.data.data;
      setOrder(orderData);
      setOrderItemsStatus(
        orderData.orderItems.map((item) => ({
          id: item.orderItemId,
          status: item.status,
        }))
      );
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("فشل في تحميل الطلبات");
    }
  };

const updateItemStatus = async (itemId) => {
  const itemUpdateData = orderItemsStatus.find((i) => i.id === itemId);

  try {
    await api.put(`/orders/order-items/${itemId}/status`, {
      status: itemUpdateData.status,
    });

    // Update the order's item status locally as well
    const updatedOrderItems = order.orderItems.map((item) =>
      item.orderItemId === itemId
        ? { ...item, status: itemUpdateData.status }
        : item
    );

    setOrder({ ...order, orderItems: updatedOrderItems });

    toast.success("تم تحديث الحالة بنجاح");
  } catch (error) {
    console.error(error);
    toast.error("فشل في تحديث الحالة");
  }
};


  const itemStatus = [
    {
      Value: "Pending",
      Name: "قيد الانتظار",
      optios: [
        { Value: "Pending", Name: "قيد الانتظار" },
        { Value: "Confirmed", Name: "تم التاكيد" },
        { Value: "Shipped", Name: "تم الشحن" },
        { Value: "Delivered", Name: "تم التوصيل " },
        { Value: "Cancelled", Name: "تم الالغاء" },
      ],
    },
    {
      Value: "Confirmed",
      Name: "تم التاكيد",
      optios: [
        { Value: "Confirmed", Name: "تم التاكيد" },
        { Value: "Shipped", Name: "تم الشحن" },
        { Value: "Delivered", Name: "تم التوصيل " },
        { Value: "Cancelled", Name: "تم الالغاء" },
      ],
    },
    {
      Value: "Shipped",
      Name: "تم الشحن",
      optios: [
        { Value: "Shipped", Name: "تم الشحن" },
        { Value: "Delivered", Name: "تم التوصيل " },
        { Value: "Cancelled", Name: "تم الالغاء" },
      ],
    },
    {
      Value: "Delivered",
      Name: "تم التوصيل ",
      optios: [{ Value: "Delivered", Name: "تم التوصيل " }],
    },
    {
      Value: "Cancelled",
      Name: "تم الالغاء",
      optios: [{ Value: "Cancelled", Name: "تم الالغاء" }],
    },
  ];

  if (!order) {
    return (
      <div className="text-center py-10 text-gray-600">
        جارٍ تحميل تفاصيل الطلب...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-teal-600 mb-6 border-b pb-2">
        تفاصيل الطلب
      </h1>

      {/* Order Info */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 border">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          معلومات الطلب
        </h2>
        <p>
          <span className="font-semibold">رقم الطلب:</span> {order.orderId}
        </p>
        <p>
          <span className="font-semibold">تاريخ الطلب:</span>{" "}
          {new Date(order.orderDate).toLocaleString()}
        </p>
        <p>
          <span className="font-semibold">الحالة:</span>{" "}
              <span className="text-red-600">
          {
          itemStatus
            .find((i) => i.Value === order.status)
            ?.Name
            }
        </span>
        </p>
        <p>
          <span className="font-semibold">حالة الدفع:</span>{" "}
          <span className="text-red-600">{order.paymentStatus}</span>
        </p>
        <p>
          <span className="font-semibold">طريقة الدفع:</span>{" "}
          {order.paymentMethod}
        </p>
        <p>
          <span className="font-semibold">المجموع الفرعي:</span>{" "}
          {order.subTotal.toFixed(2)} ج.م
        </p>
        <p>
          <span className="font-semibold">سعر الشحن:</span>{" "}
          {order.shippingPrice.toFixed(2)} ج.م
        </p>
      </div>

      {/* Shipping Address */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 border">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          عنوان الشحن
        </h2>
        <p>
          {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
        </p>
        <p>
          {order.shippingAddress?.street}, {order.shippingAddress?.city}
        </p>
        <p>{order.shippingAddress?.governorate}</p>
      </div>

      {/* Order Items */}
      <div>
        <h2 className="text-xl font-bold text-teal-600 mb-2">المنتجات</h2>
        <div className="space-y-4">
          {order.orderItems?.map((item) => (
            <div
              key={item.productId}
              className="flex items-center gap-4 p-4 bg-white border rounded-lg shadow-sm"
            >
              <img
                src={item.imageUrl}
                alt={item.productName}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="text-teal-600 font-bold text-lg">
                  {item.productName}
                </h3>
                <p className="text-sm text-gray-600">
                  السعر: {item.price.toFixed(2)} ج.م
                </p>
                <p className="text-sm text-gray-600">الكمية: {item.quantity}</p>
                <p className="text-sm text-gray-600">
                  المورّد: {item.supplierName}
                </p>
                <p
                  className={`text-sm font-medium mt-1 ${
                    item.status === "Cancelled"
                      ? "text-red-500"
                      : "text-teal-500"
                  }`}
                >
                  الحالة:
                </p>

                <div className="flex items-center gap-3 mt-2">
                  <select
                    defaultValue={item.status}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-700 bg-white transition"
                    onChange={(e) => {
                      const index = orderItemsStatus.findIndex(
                        (i) => i.id === item.orderItemId
                      );
                      const updatedStatuses = [...orderItemsStatus];
                      updatedStatuses[index].status = e.target.value;
                      setOrderItemsStatus(updatedStatuses);
                    }}
                  >
                    {itemStatus
                      .find((i) => i.Value === item.status)
                      ?.optios.map((opt) => (
                        <option key={opt.Value} value={opt.Value}>
                          {opt.Name}
                        </option>
                      ))}
                  </select>
                  <button
                    className="px-3 py-2 bg-teal-600 hover:bg-teal-500 rounded-lg text-white"
                    onClick={() => updateItemStatus(item.orderItemId)}
                  >
                    حفظ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
