import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../../api/axiosInstance";
import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PrintedInVoice from "./components/PrintedInVoice";

export default function AdminOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [orderItemsStatus, setOrderItemsStatus] = useState([]);
  console.log(orderItemsStatus, "orderItemsStatus");
  const [isLoading, setIsLoading] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
  const orderRef = useRef();
  const printableRef = useRef();

  useEffect(() => {
    getOrder();
  }, []);

  const getOrder = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/orders/${id}/details`);
      const orderData = response.data.data;
      console.log(orderData);
      setOrder(orderData);

      setOrderItemsStatus(
        orderData.orderItems.map((item) => {
          const currentStatusConfig = itemStatus.find(
            (s) => s.Value === item.status
          );
          const firstAvailableStatus =
            currentStatusConfig?.optios[0]?.Value || item.status;

          return {
            id: item.orderItemId,
            currentStatus: item.status,
            status: firstAvailableStatus,
          };
        })
      );
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("فشل في تحميل الطلبات");
    } finally {
      setIsLoading(false);
    }
  };

  const updateItemStatus = async (itemId) => {
    const itemUpdateData = orderItemsStatus.find((i) => i.id === itemId);
    console.log(orderItemsStatus, itemUpdateData);

    if (itemUpdateData.status === itemUpdateData.currentStatus) {
      toast.error("يرجى اختيار حالة جديدة");
      return;
    }

    try {
      await api.put(`/orders/order-items/${itemId}/status`, {
        status: itemUpdateData.status,
      });

      const updatedOrderItems = order.orderItems.map((item) =>
        item.orderItemId === itemId
          ? { ...item, status: itemUpdateData.status }
          : item
      );

      setOrder({ ...order, orderItems: updatedOrderItems });

      setOrderItemsStatus((prevStatus) =>
        prevStatus.map((item) =>
          item.id === itemId
            ? {
                ...item,
                currentStatus: itemUpdateData.status,
                status:
                  itemStatus.find((s) => s.Value === itemUpdateData.status)
                    ?.optios[0]?.Value || itemUpdateData.status,
              }
            : item
        )
      );

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
        { Value: "Shipped", Name: "تم الشحن" },
        { Value: "Delivered", Name: "تم التوصيل " },
        { Value: "Cancelled", Name: "تم الالغاء" },
      ],
    },
    {
      Value: "Shipped",
      Name: "تم الشحن",
      optios: [
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

  const getStatusBadge = (status) => {
    const statusName =
      itemStatus.find((s) => s.Value === status)?.Name || status;

    let bgColor = "#fef3c7";
    let textColor = "#d97706";

    switch (status) {
      case "Pending":
        bgColor = "#fef3c7";
        textColor = "#d97706";
        break;
      case "Confirmed":
        bgColor = "#dbeafe";
        textColor = "#2563eb";
        break;
      case "Shipped":
        bgColor = "#f3e8ff";
        textColor = "#9333ea";
        break;
      case "Delivered":
        bgColor = "#d1fae5";
        textColor = "#059669";
        break;
      case "Cancelled":
        bgColor = "#fee2e2";
        textColor = "#dc2626";
        break;
      default:
        bgColor = "#f3f4f6";
        textColor = "#1d1c1c";
    }

    return (
      <span
        className="px-3 py-1 rounded-full text-xs font-semibold"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        {statusName}
      </span>
    );
  };

  const handleDownloadPdf = async () => {
    if (!order) return;

    setIsPrinting(true);
    toast.info("جارِ إنشاء ملف PDF...");

    try {
      const element = printableRef.current;

      const clone = element.cloneNode(true);
      const container = document.createElement("div");
      container.appendChild(clone);
      document.body.appendChild(container);

      const allElements = container.querySelectorAll("*");
      allElements.forEach((el) => {
        const computedStyle = window.getComputedStyle(el);
        const bgColor = computedStyle.backgroundColor;
        const color = computedStyle.color;

        if (bgColor && bgColor.startsWith("rgb")) {
          el.style.backgroundColor = bgColor;
        } else {
          el.style.backgroundColor = "transparent";
        }

        if (color && color.startsWith("rgb")) {
          el.style.color = color;
        } else {
          el.style.color = "#000000";
        }
      });

      const printStyle = document.createElement("style");
      printStyle.innerHTML = `
        * { 
          font-family: "Arial", sans-serif !important;
          color-scheme: light only !important;
        }
        .print-section { padding: 20px; }
        img { max-width: 100%; height: auto; }
      `;
      clone.appendChild(printStyle);

      const scale = 2;

      const canvas = await html2canvas(clone, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
        removeContainer: true,
      });

      document.body.removeChild(container);

      const imgWidth = 210;

      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      pdf.addImage(
        canvas.toDataURL("image/jpeg", 1.0),
        "JPEG",
        0,
        position,
        imgWidth,
        imgHeight
      );
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(
          canvas.toDataURL("image/jpeg", 1.0),
          "JPEG",
          0,
          position,
          imgWidth,
          imgHeight
        );
        heightLeft -= pageHeight;
      }

      const filename = `Order-${order.orderId}-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      pdf.save(filename);
      toast.success("تم تحميل الفاتورة بنجاح");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("حدث خطأ أثناء إنشاء ملف PDF");
    } finally {
      setIsPrinting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            جارٍ تحميل تفاصيل الطلب...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-10 text-gray-600 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
        <p className="text-lg font-medium">لا توجد بيانات للطلب</p>
        <button
          onClick={() => window.history.back()}
          className="mt-4 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-500 transition duration-200"
        >
          رجوع
        </button>
      </div>
    );
  }

  return (
    <div className="">
      <div className="">
        {/* view */}
        <div className="mb-6">
          <div className="flex flex-col justify-between">
            <h1 className="text-2xl font-bold text-teal-700">
              تفاصيل الطلب #{order.orderId}
            </h1>
            <div className="self-end flex gap-3">
              <button
                onClick={handleDownloadPdf}
                disabled={isPrinting}
                className={`flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-500 transition duration-200 ${
                  isPrinting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isPrinting ? (
                  <>
                    <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                    <span>جارٍ الإنشاء...</span>
                  </>
                ) : (
                  <>
                    <span>تحميل الفاتورة</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div
            className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-100"
            ref={orderRef}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Info */}
              <div className="col-span-2">
                <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">
                  معلومات الطلب
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      رقم الطلب:
                    </span>
                    <span className="font-semibold">{order.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      تاريخ الطلب:
                    </span>
                    <span>
                      {new Date(order.orderDate).toLocaleString("ar-EG")}
                    </span>
                  </div>
                  {/* <div className="flex justify-between">
                    <span className="font-medium text-gray-600">الحالة:</span>
                    {getStatusBadge(order.status)}
                  </div> */}
                  {order.paymentMethod === "Online" && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        حالة الدفع:
                      </span>
                      <span
                        className={
                          order.paymentStatus === "Paid"
                            ? "text-green-600 font-medium"
                            : "text-amber-600 font-medium"
                        }
                      >
                        {order.paymentStatus === "Paid"
                          ? "تم الدفع"
                          : "لم يتم الدفع"}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      طريقة الدفع:
                    </span>
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

              {/* Shipping Address */}
              <div className="col-span-1">
                <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">
                  عنوان الشحن
                </h2>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="text-lg font-medium">
                    {order.shippingAddress?.firstName}{" "}
                    {order.shippingAddress?.lastName}
                  </div>
                  <div className="text-gray-700 mt-2">
                    <p>{order.shippingAddress?.street}</p>
                    <p>
                      {order.shippingAddress?.city}،{" "}
                      {order.shippingAddress?.governorate}
                    </p>
                    {order.shippingAddress?.phone && (
                      <p className="mt-2">
                        <span className="font-medium">رقم الهاتف:</span>{" "}
                        {order.shippingAddress?.phone}
                      </p>
                    )}
                    {order.shippingAddress?.notes && (
                      <p className="mt-2">
                        <span className="font-medium">ملاحظات:</span>{" "}
                        {order.shippingAddress?.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-teal-700 mb-4 pb-2 border-b">
                المنتجات ({order.orderItems?.length})
              </h2>
              <div className="space-y-4">
                {order.orderItems?.map((item) => {
                  const itemStatusData = orderItemsStatus.find(
                    (i) => i.id === item.orderItemId
                  );
                  const currentStatusConfig = itemStatus.find(
                    (s) => s.Value === item.status
                  );

                  return (
                    <div
                      key={item.orderItemId}
                      className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="w-24 h-24 flex-shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-full h-full object-cover rounded-md"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/100?text=No+Image";
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-teal-700 font-bold text-lg">
                          {item.productName}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">السعر:</span>{" "}
                            {item.price.toFixed(2)} ج.م
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">الحالة الحالية:</span>{" "}
                            {getStatusBadge(item.status)}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">الكمية:</span>{" "}
                            {item.quantity}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">المورّد:</span>{" "}
                            {item.supplierName}
                          </p>
                        </div>
                        <div>
                          {!["Delivered", "Cancelled"].includes(
                            item.status
                          ) && (
                            <div className="flex flex-col md:flex-row md:items-center gap-3 mt-4">
                              <p className="font-medium">تحديث الحالة إلى:</p>
                              <div className="flex items-center flex-1 gap-3">
                                <select
                                  value={itemStatusData?.status || ""}
                                  className="block flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-700 bg-white transition"
                                  onChange={(e) => {
                                    const index = orderItemsStatus.findIndex(
                                      (i) => i.id === item.orderItemId
                                    );
                                    const updatedStatuses = [
                                      ...orderItemsStatus,
                                    ];
                                    updatedStatuses[index].status =
                                      e.target.value;
                                    setOrderItemsStatus(updatedStatuses);
                                  }}
                                >
                                  {currentStatusConfig?.optios.map((opt) => (
                                    <option key={opt.Value} value={opt.Value}>
                                      {opt.Name}
                                    </option>
                                  ))}
                                </select>

                                <button
                                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded-lg text-white transition shadow-sm"
                                  onClick={() =>
                                    updateItemStatus(item.orderItemId)
                                  }
                                >
                                  حفظ
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end mt-8">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
            >
              <span>رجوع</span>
            </button>
          </div>
        </div>
      </div>

      {/* -----------------PDF-------------  */}
      <div className="hidden">
        <div ref={printableRef} className="w-full">
          <PrintedInVoice order={order} itemStatus={itemStatus} />
        </div>
      </div>
    </div>
  );
}
