import React from "react";

export const itemStatus = [
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

export const getStatusBadge = (status) => {
  const statusName = itemStatus.find((s) => s.Value === status)?.Name || status;

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
