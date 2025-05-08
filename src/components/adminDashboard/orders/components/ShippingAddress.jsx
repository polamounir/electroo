import React from "react";

const ShippingAddress = ({ address }) => {
  if (!address) return null;

  return (
    <div className="col-span-1">
      <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">
        عنوان الشحن
      </h2>
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
        <div className="text-lg font-medium">
          {address.firstName} {address.lastName}
        </div>
        <div className="text-gray-700 mt-2">
          <p>{address.street}</p>
          <p>
            {address.city}، {address.governorate}
          </p>
          {address.phone && (
            <p className="mt-2">
              <span className="font-medium">رقم الهاتف:</span> {address.phone}
            </p>
          )}
          {address.notes && (
            <p className="mt-2">
              <span className="font-medium">ملاحظات:</span> {address.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShippingAddress;
