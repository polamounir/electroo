import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { TbReload } from "react-icons/tb";

export default function OrdersOverview() {
  const [orderId, setOrderId] = useState("");
  const [sortByStatus, setSortByStatus] = useState("Pending");
  const navigate = useNavigate();

  const navigateToProduct = () => {
    navigate(`/admin/orders/${orderId.trim()}`);
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["orders", sortByStatus],
    queryFn: async () => {
      const res = await api.get(
        `/admin/orders?Page=1&Limit=50&Status=${sortByStatus}`
      );
      return res.data.data.items;
    },
  });

  const orders = data || [];

  const itemStatus = [
    {
      Value: "Pending",
      Name: "قيد الانتظار",
      optios: [
        // { Value: "Pending", Name: "قيد الانتظار" },
        { Value: "Confirmed", Name: "تم التاكيد" },
        { Value: "Shipped", Name: "تم الشحن" },
        { Value: "Delivered", Name: "تم التوصيل " },
        { Value: "Cancelled", Name: "تم الالغاء" },
      ],
    },
    {
      Value: "Confirmed",
      Name: "تم التاكيد",
    },
    {
      Value: "Shipped",
      Name: "تم الشحن",
    },
    {
      Value: "Delivered",
      Name: "تم التوصيل ",
    },
    {
      Value: "Cancelled",
      Name: "تم الالغاء",
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

  return (
    <div>
      <h2>ادخل رقم الطلب</h2>
      <div className="flex gap-5 text-lg font-semibold items-center mt-5 relative overflow-hidden rounded-lg border border-gray-300">
        <input
          type="text"
          placeholder="رقم الطلب"
          name="orderId"
          className="px-4 py-4 w-full pe-20"
          onChange={(e) => setOrderId(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 absolute end-0 top-0 bottom-0 text-white duration-300"
          onClick={navigateToProduct}
        >
          بحث
        </button>
      </div>

      <h2 className="text-2xl font-semibold mt-10">الطلبات</h2>
      <div className="flex flex-wrap items-center gap-3 mt-2">
        {["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"].map(
          (status) => (
            <button
              key={status}
              className={`px-5 py-1 rounded-lg border border-gray-300 ${
                sortByStatus === status ? "bg-black text-white" : ""
              }`}
              onClick={() => setSortByStatus(status)}
            >
              {status}
            </button>
          )
        )}
      </div>

      <div className="mt-5">
        {/* Header row */}
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

        {!isLoading && orders.length === 0 && (
          <div className="text-teal-500 text-center text-xl font-semibold pt-10">
            لا يوجد طلبات
          </div>
        )}

        {/* Data rows */}
        {!isLoading &&
          orders.map((order, index) => (
            <div
              key={order.orderId}
              className={`grid grid-cols-11 gap-4 px-4 py-3 border-b border-gray-200 items-center ${
                index % 2 === 0 ? "" : "bg-gray-100"
              } hover:bg-black/20 duration-300
              `}
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
                {getStatusBadge(order.status)}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
