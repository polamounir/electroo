import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "sonner";
import UserOrders from "../components/profile/UserOrders";

import Cookies from "js-cookie";
import Loader from "../components/ui/Loader";

const userRoles = [
  { role: "User", label: "مستخدم" },
  { role: "Admin", label: "مدير" },
  { role: "Supplier", label: "مورد" },
];

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (!token) {
      if (!user) {
        toast.error("يجب عليك تسجيل الدخول");
        navigate("/login");
        return;
      }
    }
  }, [user]);

  const getInitials = () => {
    if (!user?.fullName) return "مج";

    const nameParts = user.fullName.trim().split(" ");
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0) || "م";
    }

    return `${nameParts[0].charAt(0) || "م"}${
      nameParts[nameParts.length - 1].charAt(0) || "ج"
    }`;
  };

  // Return early if no user to prevent errors
  if (!user) return (
    <div className=" flex items-center justify-center">
      <Loader />
    </div>
  );

  return (
    <div className="min-h-[85svh] bg-gray-50 py-10 px-4 sm:px-8 md:px-16 lg:px-24 font-sans text-right">
      <div className=" lg:w-[70%] m-auto min-h-[85svh]">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">حسابي</h1>

          {(user?.role === "Admin" || user?.role === "Supplier") && (
            <Link
              to={user.role === "Admin" ? "/admin" : "/supplier"}
              className="bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700 transition"
            >
              لوحة التحكم
            </Link>
          )}
        </header>

        {/* Profile Card */}
        <section className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 md:p-8 mb-8 space-y-6">
          {/* Avatar + Edit */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div
                className="w-24 h-24 lg:w-28 lg:h-28 rounded-full bg-teal-50 text-4xl font-bold flex items-center justify-center text-teal-700 shadow-sm"
                aria-label="صورة الملف الشخصي"
              >
                {getInitials()}
              </div>
              <div className="text-center md:text-right">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {user.fullName}
                </h2>
                <p className="text-gray-500">{user.email}</p>
                {user.role && (
                  <span className="inline-block mt-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {userRoles.find((role) => role.role === user.role)?.label}
                  </span>
                )}
              </div>
            </div>

            <Link to="/edit-profile" className="w-full lg:w-auto">
              <button className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 transition w-full lg:w-auto">
                تعديل البيانات
              </button>
            </Link>
          </div>

          {/* Personal Info */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
              البيانات الشخصية
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-gray-600 text-sm">الاسم الكامل</label>
                <div className="text-lg font-semibold text-gray-700 mt-1">
                  {user.fullName || "—"}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-gray-600 text-sm">
                  البريد الإلكتروني
                </label>
                <div className="text-lg font-semibold text-gray-700 mt-1 break-words">
                  {user.email || "—"}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-gray-600 text-sm">رقم الهاتف</label>
                <div className="text-lg font-semibold text-gray-700 mt-1 direction-ltr">
                  {user.phoneNumber || "—"}
                </div>
              </div>
              {user.address && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-gray-600 text-sm">العنوان</label>
                  <div className="text-lg font-semibold text-gray-700 mt-1">
                    {user.address}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Logout */}
          <div className="flex justify-center md:justify-end pt-6">
            <Link
              to="/logout"
              className="bg-black text-white w-full md:w-48 text-center py-3 rounded-full font-semibold hover:bg-gray-800 transition"
            >
              تسجيل الخروج
            </Link>
          </div>
        </section>

        {/* Orders */}
        {user?.role === "User" && (
          <section className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
            <UserOrders />
          </section>
        )}
      </div>
    </div>
  );
}
