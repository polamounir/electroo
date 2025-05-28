import React from "react";
import { Link } from "react-router-dom";

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center px-4">
      <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-800">
        سلة التسوق الخاصة بك فارغة
      </h2>
      <p className="text-gray-500 mb-6">
        يبدو أنك لم تقم بإضافة أي منتجات إلى سلة التسوق بعد.
      </p>
      <Link
        to="/"
        className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600 transition duration-300"
      >
        متابعة التسوق
      </Link>
    </div>
  );
}
