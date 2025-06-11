import { useMemo, useCallback, useState, useEffect } from "react";
import { FaRegEdit, FaSearch, FaPlus } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/axiosInstance";
import { toast } from "sonner";
import { TbReload } from "react-icons/tb";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import debounce from "lodash.debounce";

// Constants
const USER_TYPES = [
  { type: "Admin", label: "مشرفين" },
  { type: "User", label: "مستخدمين" },
  { type: "Supplier", label: "تجار" },
];
const PAGE_SIZE = 10;

// Sub-components
const UserTypeButton = ({ type, label, activeType, onClick }) => (
  <button
    onClick={() => onClick(type)}
    className={`${
      activeType === type ? "bg-black text-white" : "bg-gray-200"
    } px-3 py-1 rounded-lg transition-colors duration-200`}
  >
    {label}
  </button>
);

const UserStatusBadge = ({ isActive }) => (
  <span
    className={`${
      isActive ? "bg-teal-600" : "bg-red-400"
    } px-3 py-1 rounded-lg text-white`}
  >
    {isActive ? "نشط" : "موقوف"}
  </span>
);

const DeleteConfirmationModal = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/20 z-40 flex items-center justify-center">
    <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 text-right">
      <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">
        تأكيد حذف المستخدم
      </h3>
      <p className="text-gray-600 mb-6">
        هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onConfirm}
          className="flex-1 font-medium py-2 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white"
        >
          تأكيد الحذف
        </button>
        <button
          onClick={onCancel}
          className="flex-1 border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-lg"
        >
          إلغاء
        </button>
      </div>
    </div>
  </div>
);

const UserRow = ({
  user,
  isDeleteConfirm,
  onEdit,
  onDelete,
  onReactivate,
  onConfirmDelete,
  onCancelDelete,
}) => {
  return (
    <div className="grid grid-cols-12 border-t border-gray-200 py-3 px-4 items-center hover:bg-gray-50 transition-colors">
      <div className="col-span-4 truncate">{user.fullName || "—"}</div>
      <div className="col-span-4 truncate">{user.email || "—"}</div>
      <div className="col-span-2 flex justify-center">
        <UserStatusBadge isActive={user.isActive} />
      </div>
      <div className="col-span-2 flex justify-center gap-3">
        <button
          className="text-teal-600 hover:text-teal-800 transition-colors"
          onClick={() => onEdit(user.id)}
          aria-label="Edit user"
        >
          <FaRegEdit size={18} />
        </button>
        {!user.isActive ? (
          <button
            className="text-green-600 hover:text-green-800 transition-colors"
            onClick={() => onReactivate(user.id)}
            aria-label="Reactivate user"
          >
            <TbReload size={18} />
          </button>
        ) : (
          <button
            className="text-red-600 hover:text-red-800 transition-colors"
            onClick={() => onConfirmDelete(user.id)}
            aria-label="Delete user"
          >
            <GoTrash size={18} />
          </button>
        )}
      </div>
      {isDeleteConfirm && (
        <DeleteConfirmationModal
          onConfirm={() => onDelete(user.id)}
          onCancel={onCancelDelete}
        />
      )}
    </div>
  );
};

const PaginationControls = ({
  totalItems,
  currentPage,
  onPageChange,
  isLoading,
}) => {
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center mt-5">
      {/* <div className="text-sm text-gray-600">
        عرض {(currentPage - 1) * PAGE_SIZE + 1}-
        {Math.min(currentPage * PAGE_SIZE, totalItems)} من {totalItems}
      </div> */}
      <div className="flex gap-2 justify-between w-full">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrev || isLoading}
          className="px-3 py-1 border rounded-lg disabled:opacity-50"
        >
          السابق
        </button>
        {/* <span className="px-3 py-1 bg-gray-100 rounded-lg">{currentPage}</span> */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext || isLoading}
          className="px-3 py-1 border rounded-lg disabled:opacity-50"
        >
          التالي
        </button>
      </div>
    </div>
  );
};

const UsersTable = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [userType, setUserType] = useState("Admin");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");


  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); 
    }, 5000);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const getSearchUsers = ()=> {
    setDebouncedSearchQuery(searchQuery);
    setCurrentPage(1); 
  }


  const {
    data: usersData,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["users", userType, currentPage, debouncedSearchQuery],
    queryFn: async () => {
      const params = {
        UsersType: userType,
        page: currentPage,
        limit: PAGE_SIZE,
      };
      if (debouncedSearchQuery) {
        params.SearchQuery = debouncedSearchQuery;
      }

      const { data } = await api.get("/users", { params });
      return data.data;
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });

  const users = usersData?.items || [];
  const totalItems = usersData?.totalItems || 0;


  const toggleUserStatus = useMutation({
    mutationFn: ({ userId, activate }) =>
      api.put(`/users/${userId}/${activate ? "reactivate" : "deactivate"}`),
    onSuccess: (response, { userId, activate }) => {
      toast.success(
        response.data.message ||
          `User ${activate ? "reactivated" : "deactivated"}`
      );
      queryClient.invalidateQueries(["users"]);
      setDeleteConfirmId(null);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.detail || "حدث خطأ ما, حاول مرة اخرى";
      toast.error(errorMessage);
    },
  });


  const handleUserTypeChange = (type) => {
    setUserType(type);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const handleAddUser = () => navigate("/admin/users/add");
  const handleEditUser = (userId) => navigate(`/admin/users/edit/${userId}`);

  const handleDeleteUser = (userId) => {
    toggleUserStatus.mutate({ userId, activate: false });
  };

  const handleReactivateUser = (userId) => {
    toggleUserStatus.mutate({ userId, activate: true });
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  // Loading and error states
  if (isLoading && !usersData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">جاري التحميل ...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-xl text-red-600 mb-4">حدث خطأ غير متوقع</div>
        <button
          className="bg-teal-500 text-white px-4 py-2 rounded-lg"
          onClick={() => queryClient.refetchQueries(["users"])}
        >
          إعادة تحميل
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Search Section */}
      <div className="border border-teal-600 rounded-2xl overflow-hidden">
        <div className="bg-teal-600 p-3 text-center text-white">
          <h2 className="text-lg font-medium">بحث عن مستخدم</h2>
        </div>
        <div className="p-4">
          <div className="relative rounded-lg overflow-hidden border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent">
            <input
              type="text"
              placeholder="ابحث باسم المستخدم أو البريد الإلكتروني"
              className="w-full px-4 py-2 pr-10 "
              value={searchQuery}
              onChange={handleSearchChange}
              disabled={isFetching}
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
            <button
              className="bg-teal-500 text-white absolute end-0 top-0 h-full px-5 "
              onClick={getSearchUsers}
            >
              بحث
            </button>
          </div>
        </div>
      </div>

      {/* Users Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-gray-200">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-xl font-semibold mb-5">إدارة المستخدمين</h2>
            <div className="flex gap-2 mt-2">
              {USER_TYPES.map(({ type, label }) => (
                <UserTypeButton
                  key={type}
                  type={type}
                  label={label}
                  activeType={userType}
                  onClick={handleUserTypeChange}
                />
              ))}
            </div>
          </div>
          <button
            className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors"
            onClick={handleAddUser}
          >
            <FaPlus /> أضافة مشرف
          </button>
        </div>

        {/* Table */}
        {users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            لا يوجد مستخدمين متطابقين مع معايير البحث
            {!debouncedSearchQuery && (
              <button
                className="mt-4 block mx-auto bg-teal-500 text-white px-4 py-2 rounded-lg"
                onClick={handleAddUser}
              >
                أضافة مستخدم جديد
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-12 py-3 bg-gray-50 px-4 font-medium text-gray-600">
              <div className="col-span-4">الاسم</div>
              <div className="col-span-4">البريد الإلكتروني</div>
              <div className="col-span-2 text-center">الحالة</div>
              <div className="col-span-2 text-center">الإجراءات</div>
            </div>
            <div className="divide-y divide-gray-200">
              {users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  isDeleteConfirm={deleteConfirmId === user.id}
                  onEdit={handleEditUser}
                  onDelete={handleDeleteUser}
                  onReactivate={handleReactivateUser}
                  onConfirmDelete={setDeleteConfirmId}
                  onCancelDelete={() => setDeleteConfirmId(null)}
                />
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200">
          <PaginationControls
            totalItems={totalItems}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            isLoading={isFetching}
          />
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
