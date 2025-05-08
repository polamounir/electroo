import React from "react";

const OrderItems = ({
  orderItems,
  orderItemsStatus,
  setOrderItemsStatus,
  updateItemStatus,
  itemStatus,
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-teal-700 mb-4 pb-2 border-b">
        المنتجات ({orderItems?.length})
      </h2>
      <div className="space-y-4">
        {orderItems?.map((item) => (
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">السعر:</span>{" "}
                  {item.price.toFixed(2)} ج.م
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">الكمية:</span> {item.quantity}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">المورّد:</span>{" "}
                  {item.supplierName}
                </p>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-3 mt-4">
                <p className="font-medium">الحالة:</p>
                <div className="flex items-center flex-1 gap-3">
                  <select
                    value={
                      orderItemsStatus.find((i) => i.id === item.orderItemId)
                        ?.status
                    }
                    className="block flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-700 bg-white transition"
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
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded-lg text-white transition shadow-sm"
                    onClick={() => updateItemStatus(item.orderItemId)}
                  >
                    حفظ
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItems;
