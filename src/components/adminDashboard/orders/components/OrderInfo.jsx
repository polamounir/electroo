import React from "react";

const OrderInfo = ({ order, getStatusBadge }) => {
  return (
    <div className="col-span-2">
      <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">
        معلومات الطلب
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">رقم الطلب:</span>
          <span className="font-semibold">{order.orderId}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">تاريخ الطلب:</span>
          <span>{new Date(order.orderDate).toLocaleString("ar-EG")}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">الحالة:</span>
          {getStatusBadge(order.status)}
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">حالة الدفع:</span>
          <span
            className={
              order.paymentStatus === "Paid"
                ? "text-green-600 font-medium"
                : "text-amber-600 font-medium"
            }
          >
            {order.paymentStatus === "Paid" ? "تم الدفع" : "لم يتم الدفع"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">طريقة الدفع:</span>
          <span>
            {order.paymentMethod === "Cash"
              ? "الدفع عند الاستلام"
              : order.paymentMethod}
          </span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t">
        <div className="flex justify-between font-medium">
          <span className="text-gray-600">المجموع الفرعي:</span>
          <span>{order.subTotal.toFixed(2)} ج.م</span>
        </div>
        <div className="flex justify-between font-medium mt-2">
          <span className="text-gray-600">سعر الشحن:</span>
          <span>{order.shippingPrice.toFixed(2)} ج.م</span>
        </div>
        <div className="flex justify-between text-lg font-bold mt-3 pt-3 border-t">
          <span>الإجمالي:</span>
          <span className="text-teal-700">
            {(order.subTotal + order.shippingPrice).toFixed(2)} ج.م
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderInfo;
