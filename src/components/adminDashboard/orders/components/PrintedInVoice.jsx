import React from "react";

export default function PrintedInvoice({ order, itemStatus }) {
  return (
    <div className="w-full text-[#000000] p-8 print-section" dir="rtl">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-[#0f766e] mb-2">
          فاتورة طلب #{order.orderId}
        </h1>
        <p className="text-[#6b7280]">
          تاريخ الطلب: {new Date(order.orderDate).toLocaleString("ar-EG")}
        </p>
      </div>

      <div className="flex flex-col gap-6 mb-6">
        {/* Order Info */}
        <div className="border border-[#e5e7eb] rounded p-4">
          <h2 className="text-lg font-bold text-[#1f2937] border-b border-[#e5e7eb] pb-2 mb-2">
            معلومات الطلب
          </h2>
          <div className="flex flex-col gap-2 text-sm">
            <p>
              <span className="font-semibold">رقم الطلب:</span> {order.orderId}
            </p>
            <p>
              <span className="font-semibold">الحالة:</span>{" "}
              {itemStatus.find((i) => i.Value === order.status)?.Name}
            </p>
            <p>
              <span className="font-semibold">حالة الدفع:</span>{" "}
              {order.paymentStatus === "Paid" ? "تم الدفع" : "لم يتم الدفع"}
            </p>
            <p>
              <span className="font-semibold">طريقة الدفع:</span>{" "}
              {order.paymentMethod === "Cash"
                ? "الدفع عند الاستلام"
                : order.paymentMethod}
            </p>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="border border-[#e5e7eb] rounded p-4">
          <h2 className="text-lg font-bold text-[#1f2937] border-b border-[#e5e7eb] pb-2 mb-2">
            عنوان الشحن
          </h2>
          <div className="flex flex-col gap-1 text-sm">
            <p>
              {order.shippingAddress?.firstName}{" "}
              {order.shippingAddress?.lastName}
            </p>
            <p>{order.shippingAddress?.street}</p>
            <p>
              {order.shippingAddress?.city}،{" "}
              {order.shippingAddress?.governorate}
            </p>
            {order.shippingAddress?.phone && (
              <p>الهاتف: {order.shippingAddress?.phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Products Table */}
      {/* Products Grid */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[#1f2937] border-b border-[#e5e7eb] pb-2 mb-4">
          المنتجات
        </h2>

        <div className="grid grid-cols-12 gap-2 bg-[#f3f4f6] text-xs font-semibold border border-[#e5e7eb] px-4 py-2">
          <div className="text-right col-span-6">المنتج</div>
          <div className="text-right col-span-1">السعر</div>
          <div className="text-right col-span-1">الكمية</div>
          <div className="text-right col-span-2">التاجر</div>
          <div className="text-right col-span-1">الحالة</div>
          <div className="text-right col-span-1">الإجمالي</div>
        </div>

        {order.orderItems?.map((item) => (
          <div
            key={item.orderItemId}
            className="grid grid-cols-12 gap-2 border border-t-0 border-[#e5e7eb] px-4 py-2 text-xs hover:bg-[#f9fafb]"
          >
            <div className="col-span-6">{item.productName}</div>
            <div className="col-span-1">{item.price.toFixed(2)} ج.م</div>
            <div className="col-span-1">{item.quantity}</div>
            <div className="col-span-2">{item.supplierName}</div>
            <div className="col-span-1">
              {itemStatus.find((i) => i.Value === item.status)?.Name}
            </div>
            <div className="col-span-1">
              {(item.price * item.quantity).toFixed(2)} ج.م
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="flex justify-end">
        <div className="w-64 border border-[#e5e7eb] rounded p-4 text-sm">
          <div className="flex justify-between mb-2 font-medium">
            <span>المجموع الفرعي:</span>
            <span>{order.subTotal.toFixed(2)} ج.م</span>
          </div>
          <div className="flex justify-between mb-2 font-medium">
            <span>سعر الشحن:</span>
            <span>{order.shippingPrice.toFixed(2)} ج.م</span>
          </div>
          <div className="flex justify-between mt-3 pt-2 border-t border-[#e5e7eb] font-bold text-base">
            <span>الإجمالي:</span>
            <span>{(order.subTotal + order.shippingPrice).toFixed(2)} ج.م</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 text-center text-[#6b7280] text-sm">
        <p>تم إنشاء هذه الفاتورة بتاريخ {new Date().toLocaleString("ar-EG")}</p>
      </div>
    </div>
  );
}
