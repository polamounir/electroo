const StatusBadge = ({ status }) => {
  const statusMap = {
    Pending: { text: "قيد الانتظار", bg: "#fef3c7", color: "#d97706" },
    Confirmed: { text: "تم التاكيد", bg: "#dbeafe", color: "#2563eb" },
    Shipped: { text: "تم الشحن", bg: "#f3e8ff", color: "#9333ea" },
    Delivered: { text: "تم التوصيل", bg: "#d1fae5", color: "#059669" },
    Cancelled: { text: "تم الالغاء", bg: "#fee2e2", color: "#dc2626" },
  };

  const {
    text = status,
    bg = "#f3f4f6",
    color = "#374151",
  } = statusMap[status] || {};

  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: bg, color }}
    >
      {text}
    </span>
  );
};

export default StatusBadge;
