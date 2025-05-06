import { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/axiosInstance";
import { toast } from "sonner";
import { TbReload } from "react-icons/tb";
export default function UsersTable() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [displayedUsers, setDisplayedUsers] = useState([]);

  const [userType, setUserType] = useState("Admin");

  useEffect(() => {
    fetchUsers();
  }, [userType]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/users?UsersType=${userType}`);
      // console.log(response.data.data);
      setUsers(response.data.data);
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
    setDisplayedUsers(users);
  }, [users]);
  const handleAddNavigation = () => {
    navigate("/admin/users/add");
  };

  const handleEditNavigation = (userId) => {
    navigate(`/admin/users/edit/${userId}`);
  };

  const confirmDelete = (userId) => {
    setDeleteConfirm(userId);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const changeUserStatus = (userId, state) => {
    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
      const updatedUsers = [...displayedUsers];
      updatedUsers[userIndex].isActive = state;
      setDisplayedUsers(updatedUsers);
    }
  };
  const handleDelete = async (userId) => {
    try {
      const response = await api.put(`/users/${userId}/deactivate`);

      if (response.data.status === "Successful") {
        toast.success(response.data.message || "User Deactivated");
        changeUserStatus(userId, false);
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting", error);
      if (error.response) {
        toast.error(error.response.data.detail || "err deleting");
      } else {
        toast.error("حدث خطأ ما, حاول مرة اخرى");
      }
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleReactivate = async (userId) => {
    try {
      const response = await api.put(`/users/${userId}/reactivate`);

      if (response.data.status === "Successful") {
        toast.success(response.data.message || "User reactivated");
        changeUserStatus(userId, true);
      } else {
        toast.error("Failed to reactivate user");
      }
    } catch (error) {
      console.error("Error reactivating", error);
      if (error.response) {
        toast.error(error.response.data.detail || "err reactivating");
      } else {
        toast.error("حدث خطأ ما, حاول مرة اخرى");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">جاري التحميل ...</div>
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
          <h2 className="text-2xl font-semibold">كل المستخدمين</h2>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => setUserType("Admin")}
              className={`${
                userType === "Admin" ? "bg-black text-white" : "bg-gary-200"
              } px-2 py-1 rounded-lg items-center justify-center `}
            >
              مشرفين
            </button>
            <button
              onClick={() => setUserType("User")}
              className={`${
                userType === "User" ? "bg-black text-white" : "bg-gary-200"
              } px-2 py-1 rounded-lg items-center justify-center `}
            >
              مستخدمين
            </button>
            <button
              onClick={() => setUserType("Supplier")}
              className={`${
                userType === "Supplier" ? "bg-black text-white" : "bg-gary-200"
              } px-2 py-1 rounded-lg items-center justify-center `}
            >
            تجار
            </button>
          </div>
        </div>
        <button
          className="bg-black px-5 py-2 text-white rounded-lg"
          onClick={handleAddNavigation}
        >
          أضافة مشرف
        </button>
      </div>

      {displayedUsers && displayedUsers?.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-500">لا يوجد مستخدمين</p>
          <button
            className="mt-4 bg-teal-500 text-white px-4 py-2 rounded-lg"
            onClick={handleAddNavigation}
          >
            أضافة مشرف جديد
          </button>
        </div>
      ) : (
        <div className="flex flex-col mt-4 overflow-x-auto">
          <div className="grid grid-cols-12 py-3 bg-gray-100 rounded-t-lg px-4 font-medium">
            <div className="col-span-4">الاسم</div>
            <div className="col-span-4">البريد الالكتروني</div>
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
                    <div className="col-span-4 truncate">
                      {user.fullName || "—"}
                    </div>
                    <div className="col-span-4 truncate">
                      {user.email || "—"}
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <span
                        className={`${
                          user.isActive ? "bg-teal-600 px-4" : "bg-red-400 "
                        } px-2 py-1 rounded-lg text-full text-white `}
                      >
                        {user.isActive ? "نشط" : "موقوف"}
                      </span>
                    </div>

                    <div className="col-span-2 flex justify-center gap-3 ">
                      <button
                        className="text-teal-600 text-xl hover:text-teal-800"
                        onClick={() => handleEditNavigation(user.id)}
                        title="Edit user"
                      >
                        <FaRegEdit />
                      </button>
                      {!user.isActive ? (
                        <button
                          className="text-green-600 text-xl hover:text-green-800"
                          onClick={() => handleReactivate(user.id)}
                          title="Reactivate user"
                        >
                          <TbReload />
                        </button>
                      ) : (
                        <div>
                          {deleteConfirm === user.id ? (
                            <div
                              className="fixed inset-0 bg-black/20 bg-opacity-50 z-40 flex items-center justify-center"
                              onClick={cancelDelete}
                            >
                              <div
                                className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 z-50 text-right"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">
                                  تأكيد حذف المستخدم
                                </h3>

                                <p className="text-gray-600 mb-6">
                                  هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن
                                  التراجع عن هذا الإجراء.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-3">
                                  <button
                                    onClick={() => handleDelete(user.id)}
                                    className="flex-1 font-medium py-3 px-6 rounded-lg shadow-sm bg-red-500 hover:bg-red-600 active:bg-red-700 text-white"
                                  >
                                    تأكيد الحذف
                                  </button>
                                  <button
                                    onClick={cancelDelete}
                                    className="flex-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition font-medium py-3 px-6 rounded-lg shadow-sm"
                                  >
                                    إلغاء
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <button
                              className="text-red-600 text-xl hover:text-red-800"
                              onClick={() => confirmDelete(user.id)}
                              title="Delete user"
                            >
                              <GoTrash />
                            </button>
                          )}
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
