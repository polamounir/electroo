import React from "react";
import { Link } from "react-router-dom";

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center px-4">
      <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-800">
        Your Cart is Empty
      </h2>
      <p className="text-gray-500 mb-6">
        Looks like you haven’t added anything to your cart yet.
      </p>
      <Link
        to="/"
        className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600 transition duration-300"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
