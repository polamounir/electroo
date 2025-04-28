import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Forbidden = () => {
  const { role } = useSelector((state) => state.auth.user);

  const rolePaths = {
    Admin: "/admin",
    Supplier: "/supplier",
    User: "/",
  };

  const homePath = rolePaths[role];

  return (
    <div className="flex items-center justify-center min-h-[72dvh] bg-gray-50 px-4">
      <div className="text-center animate-fade-in">
        <h1 className="text-6xl font-bold text-teal-600 mb-4 animate-bounce">
          401
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-800">
          هذا الصفحة غير متاحة
        </h2>
        <p className="text-gray-600 mb-6">
          لا يوجد صلاحية للوصول إلى هذه الصفحة
        </p>

        {homePath && (
          <Link
            to={homePath}
            className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded transition duration-300 ease-in-out"
          >
            Go Home
          </Link>
        )}
      </div>
    </div>
  );
};

export default Forbidden;
