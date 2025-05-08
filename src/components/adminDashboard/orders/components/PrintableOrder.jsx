import React, { forwardRef } from "react";

export const PrintableOrder = forwardRef(({ order, itemStatus }, ref) => {
  return (
    <div ref={ref} className="w-full max-w-3xl bg-white p-8 print-section">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2" style={{ color: "#0f766e" }}>
          فاتورة طلب #{order.orderId}
        </h1>
        <p style={{ color: "#4b5563" }}>
          تاريخ الطلب: {new Date(order.orderDate).toLocaleString("ar-EG")}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              flex: 1,
              border: "1px solid #e5e7eb",
              borderRadius: "4px",
              padding: "16px",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "8px",
                paddingBottom: "8px",
                borderBottom: "1px solid #e5e7eb",
                color: "#1f2937",
              }}
            >
              معلومات الطلب
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <p>
                <span style={{ fontWeight: "bold" }}>رقم الطلب:</span>{" "}
                {order.orderId}
              </p>
              <p>
                <span style={{ fontWeight: "bold" }}>الحالة:</span>{" "}
                {itemStatus.find((i) => i.Value === order.status)?.Name}
              </p>
              <p>
                <span style={{ fontWeight: "bold" }}>حالة الدفع:</span>{" "}
                {order.paymentStatus === "Paid" ? "تم الدفع" : "لم يتم الدفع"}
              </p>
              <p>
                <span style={{ fontWeight: "bold" }}>طريقة الدفع:</span>{" "}
                {order.paymentMethod === "Cash"
                  ? "الدفع عند الاستلام"
                  : order.paymentMethod}
              </p>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              border: "1px solid #e5e7eb",
              borderRadius: "4px",
              padding: "16px",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "8px",
                paddingBottom: "8px",
                borderBottom: "1px solid #e5e7eb",
                color: "#1f2937",
              }}
            >
              عنوان الشحن
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
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
      </div>

      <div style={{ marginBottom: "24px" }}>
        <h2
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "16px",
            paddingBottom: "8px",
            borderBottom: "1px solid #e5e7eb",
            color: "#1f2937",
          }}
        >
          المنتجات
        </h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f3f4f6" }}>
              <th
                style={{
                  border: "1px solid #e5e7eb",
                  padding: "8px",
                  textAlign: "right",
                }}
              >
                المنتج
              </th>
              <th
                style={{
                  border: "1px solid #e5e7eb",
                  padding: "8px",
                  textAlign: "right",
                }}
              >
                السعر
              </th>
              <th
                style={{
                  border: "1px solid #e5e7eb",
                  padding: "8px",
                  textAlign: "right",
                }}
              >
                الكمية
              </th>
              <th
                style={{
                  border: "1px solid #e5e7eb",
                  padding: "8px",
                  textAlign: "right",
                }}
              >
                التاجر
              </th>
              <th
                style={{
                  border: "1px solid #e5e7eb",
                  padding: "8px",
                  textAlign: "right",
                }}
              >
                الحالة
              </th>
              <th
                style={{
                  border: "1px solid #e5e7eb",
                  padding: "8px",
                  textAlign: "right",
                }}
              >
                الإجمالي
              </th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems?.map((item) => (
              <tr key={item.orderItemId}>
                <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
                  {item.productName}
                </td>
                <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
                  {item.price.toFixed(2)} ج.م
                </td>
                <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
                  {item.quantity}
                </td>
                <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
                  {item.supplierName}
                </td>
                <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
                  {itemStatus.find((i) => i.Value === item.status)?.Name}
                </td>
                <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
                  {(item.price * item.quantity).toFixed(2)} ج.م
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div
          style={{
            width: "250px",
            border: "1px solid #e5e7eb",
            borderRadius: "4px",
            padding: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "500",
              marginBottom: "8px",
            }}
          >
            <span>المجموع الفرعي:</span>
            <span>{order.subTotal.toFixed(2)} ج.م</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "500",
              marginBottom: "8px",
            }}
          >
            <span>سعر الشحن:</span>
            <span>{order.shippingPrice.toFixed(2)} ج.م</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "700",
              fontSize: "18px",
              paddingTop: "8px",
              borderTop: "1px solid #e5e7eb",
              marginTop: "8px",
            }}
          >
            <span>الإجمالي:</span>
            <span>{(order.subTotal + order.shippingPrice).toFixed(2)} ج.م</span>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "40px",
          textAlign: "center",
          color: "#6b7280",
          fontSize: "14px",
        }}
      >
        <p>تم إنشاء هذه الفاتورة بتاريخ {new Date().toLocaleString("ar-EG")}</p>
      </div>
    </div>
  );
});
