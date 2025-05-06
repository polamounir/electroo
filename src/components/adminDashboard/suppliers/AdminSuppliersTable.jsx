import { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
import { Link } from "react-router-dom";
import { api } from "../../../api/axiosInstance";
import { toast } from "sonner";
import { TbReload } from "react-icons/tb";
export default function AdminSuppliersTable() {
  // const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/suppliers?page=1&limit=100`);
      console.log(response.data.data);
      setUsers(response.data.data.items);
      setIsLoading(false);
      setIsError(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setIsError(true);
      setIsLoading(false);
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  useEffect(() => {
    setDisplayedUsers(users);
  }, [users]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl flex items-center gap-3">
          جاري التحميل ...
          <svg
            className="animate-spin h-6 w-6 text-teal-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>
      </div>
    );
  }

  if (isError && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-xl text-red-600 mb-4">حدث خطا غير متوقع</div>
        <button
          className="bg-teal-500 text-white px-4 py-2 rounded-lg"
          onClick={fetchUsers}
        >
          إعادة تحميل
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold">كل التجار</h2>
        </div>
        {/* <button
          className="bg-black px-5 py-2 text-white rounded-lg"
          onClick={handleAddNavigation}
        >
          أضافة مشرف
        </button> */}
      </div>

      {displayedUsers && displayedUsers?.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-500">لا يوجد مستخدمين</p>
          {/* <button
            className="mt-4 bg-teal-500 text-white px-4 py-2 rounded-lg"
            onClick={handleAddNavigation}
          >
            أضافة مشرف جديد
          </button> */}
        </div>
      ) : (
        <div className="flex flex-col mt-4 overflow-x-auto">
          <div className="grid grid-cols-12 py-3 bg-gray-100 rounded-t-lg px-4 font-medium">
            <div className="col-span-3">الاسم</div>
            <div className="col-span-3"> الاسم التجاري</div>
            <div className="col-span-2"> اسم المتجر</div>
            <div className="col-span-2 text-center">الحالة</div>
            <div className="col-span-2 text-center">الاوامر</div>
          </div>

          <div className=" rounded-b-lg">
            {displayedUsers &&
              displayedUsers.length > 0 &&
              displayedUsers.map((user) => {
                // console.log(user);
                return (
                  <div
                    key={user.id}
                    className="grid grid-cols-12 border-t border-gray-200 py-4 px-4 items-center hover:bg-gray-50"
                  >
                    <div className="col-span-3 truncate">
                      {user.fullName || "—"}
                    </div>
                    <div className="col-span-3 truncate">
                      {user.businessName || "—"}
                    </div>
                    <div className="col-span-2 truncate">
                      {user.storeName || "—"}
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <span
                        className={`${
                          user.isVerified ? "bg-teal-600 px-4" : "bg-red-400 "
                        } px-2 py-1 rounded-lg text-full text-white text-xs`}
                      >
                        {user?.isVerified ? "تم التحقق" : "لم يتم التحقق"}
                      </span>
                    </div>

                    <div className="col-span-2 flex justify-center gap-3 ">
                      {!user?.isVerified ? (
                        <div>
                          <Link
                            to={`/admin/suppliers/${user.supplierId}`}
                            className="bg-black text-white px-2 py-1 rounded-xl"
                          >
                            {" "}
                            مراجعة
                          </Link>
                        </div>
                      ) : (
                        <div className="">
                          <Link
                            to={`/admin/suppliers/${user.supplierId}`}
                            className="bg-gray-400 text-white px-2 py-1 rounded-xl"
                          >
                            {" "}
                            مراجعة
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
