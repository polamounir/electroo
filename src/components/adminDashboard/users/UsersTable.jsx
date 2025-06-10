import { useMemo, useCallback, useState, memo } from "react";
import { FaRegEdit } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/axiosInstance";
import { toast } from "sonner";
import { TbReload } from "react-icons/tb";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const UserTypeButton = memo(({ type, label, activeType, onClick }) => (
  <button
    onClick={() => onClick(type)}
    className={`${
      activeType === type ? "bg-black text-white" : "bg-gray-200"
    } px-2 py-1 rounded-lg items-center justify-center`}
  >
    {label}
  </button>
));

const UserRow = memo(
  ({
    user,
    deleteConfirm,
    onEdit,
    onDelete,
    onReactivate,
    onConfirmDelete,
    onCancelDelete,
  }) => {
    return (
      <div className="grid grid-cols-12 border-t border-gray-200 py-4 px-4 items-center hover:bg-gray-50">
        <div className="col-span-4 truncate">{user.fullName || "—"}</div>
        <div className="col-span-4 truncate">{user.email || "—"}</div>
        <div className="col-span-2 flex justify-center">
          <span
            className={`${
              user.isActive ? "bg-teal-600 px-4" : "bg-red-400 "
            } px-2 py-1 rounded-lg text-full text-white`}
          >
            {user.isActive ? "نشط" : "موقوف"}
          </span>
        </div>

        <div className="col-span-2 flex justify-center gap-3">
          <button
            className="text-teal-600 text-xl hover:text-teal-800"
            onClick={() => onEdit(user.id)}
            title="Edit user"
          >
            <FaRegEdit />
          </button>
          {!user.isActive ? (
            <button
              className="text-green-600 text-xl hover:text-green-800"
              onClick={() => onReactivate(user.id)}
              title="Reactivate user"
            >
              <TbReload />
            </button>
          ) : (
            <div>
              {deleteConfirm === user.id ? (
                <DeleteConfirmationModal
                  onConfirm={() => onDelete(user.id)}
                  onCancel={onCancelDelete}
                />
              ) : (
                <button
                  className="text-red-600 text-xl hover:text-red-800"
                  onClick={() => onConfirmDelete(user.id)}
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
  },
  (prevProps, nextProps) => {
    return (
      prevProps.user.id === nextProps.user.id &&
      prevProps.user.isActive === nextProps.user.isActive &&
      prevProps.deleteConfirm === nextProps.deleteConfirm
    );
  }
);

const DeleteConfirmationModal = memo(({ onConfirm, onCancel }) => (
  <div
    className="fixed inset-0 bg-black/20 bg-opacity-50 z-40 flex items-center justify-center"
    onClick={onCancel}
  >
    <div
      className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 z-50 text-right"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">
        تأكيد حذف المستخدم
      </h3>

      <p className="text-gray-600 mb-6">
        هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onConfirm}
          className="flex-1 font-medium py-3 px-6 rounded-lg shadow-sm bg-red-500 hover:bg-red-600 active:bg-red-700 text-white"
        >
          تأكيد الحذف
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition font-medium py-3 px-6 rounded-lg shadow-sm"
        >
          إلغاء
        </button>
      </div>
    </div>
  </div>
));

const PaginationControls = memo(({ totalItems, page, onNext, onPrev }) => {
  const showNext = totalItems > page * 10;
  const showPrev = page > 1;

  if (!showNext && !showPrev) return null;

  return (
    <div className="flex justify-end gap-5 mt-5">
      <button
        onClick={onNext}
        disabled={!showNext}
        className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 disabled:bg-teal-300 disabled:cursor-not-allowed"
      >
        التالي
      </button>

      <button
        onClick={onPrev}
        disabled={!showPrev}
        className="bg-black hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 disabled:bg-gray-700 disabled:cursor-not-allowed"
      >
        السابق
      </button>
    </div>
  );
});

export default function UsersTable() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [userType, setUserType] = useState("Admin");

  // Fetch users with React Query
  const {
    data: usersData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["users", userType, page],
    queryFn: async () => {
      const { data } = await api.get(
        `/users?UsersType=${userType}&page=${page}&limit=10`
      );
      return data.data;
    },
    staleTime: 5 * 60 * 1000, 
    cacheTime: 10 * 60 * 1000, 
    keepPreviousData: true,
  });


  const users = useMemo(() => usersData?.items || [], [usersData?.items]);
  const totalItems = useMemo(
    () => usersData?.totalItems || 0,
    [usersData?.totalItems]
  );


  const deactivateUserMutation = useMutation({
    mutationFn: (userId) => api.put(`/users/${userId}/deactivate`),
    onSuccess: (response, userId) => {
      toast.success(response.data.message || "User Deactivated");
      queryClient.setQueryData(["users", userType, page], (old) => ({
        ...old,
        items: old.items.map((user) =>
          user.id === userId ? { ...user, isActive: false } : user
        ),
      }));
      setDeleteConfirm(null);
    },
    onError: (error) => {
      console.error("Error deleting", error);
      if (error.response) {
        toast.error(error.response.data.detail || "Error deleting");
      } else {
        toast.error("حدث خطأ ما, حاول مرة اخرى");
      }
    },
  });

  const reactivateUserMutation = useMutation({
    mutationFn: (userId) => api.put(`/users/${userId}/reactivate`),
    onSuccess: (response, userId) => {
      toast.success(response.data.message || "User reactivated");
      queryClient.setQueryData(["users", userType, page], (old) => ({
        ...old,
        items: old.items.map((user) =>
          user.id === userId ? { ...user, isActive: true } : user
        ),
      }));
    },
    onError: (error) => {
      console.error("Error reactivating", error);
      if (error.response) {
        toast.error(error.response.data.detail || "Error reactivating");
      } else {
        toast.error("حدث خطأ ما, حاول مرة اخرى");
      }
    },
  });

  // Memoized handlers
  const handleUserTypeChange = useCallback((type) => {
    setUserType(type);
    setPage(1);
  }, []);

  const handleAddNavigation = useCallback(() => {
    navigate("/admin/users/add");
  }, [navigate]);

  const handleEditNavigation = useCallback(
    (userId) => {
      navigate(`/admin/users/edit/${userId}`);
    },
    [navigate]
  );

  const confirmDelete = useCallback((userId) => {
    setDeleteConfirm(userId);
  }, []);

  const cancelDelete = useCallback(() => {
    setDeleteConfirm(null);
  }, []);

  const handleDelete = useCallback(
    (userId) => {
      deactivateUserMutation.mutate(userId);
    },
    [deactivateUserMutation]
  );

  const handleReactivate = useCallback(
    (userId) => {
      reactivateUserMutation.mutate(userId);
    },
    [reactivateUserMutation]
  );

  const handleNextPage = useCallback(() => setPage((p) => p + 1), []);
  const handlePrevPage = useCallback(
    () => setPage((p) => Math.max(1, p - 1)),
    []
  );

  if (isLoading && !usersData) {
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
          onClick={refetch}
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
            <UserTypeButton
              type="Admin"
              label="مشرفين"
              activeType={userType}
              onClick={handleUserTypeChange}
            />
            <UserTypeButton
              type="User"
              label="مستخدمين"
              activeType={userType}
              onClick={handleUserTypeChange}
            />
            <UserTypeButton
              type="Supplier"
              label="تجار"
              activeType={userType}
              onClick={handleUserTypeChange}
            />
          </div>
        </div>
        <button
          className="bg-black px-5 py-2 text-white rounded-lg"
          onClick={handleAddNavigation}
        >
          أضافة مشرف
        </button>
      </div>

      {users.length === 0 ? (
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

          <div className="rounded-b-lg">
            {users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                deleteConfirm={deleteConfirm}
                onEdit={handleEditNavigation}
                onDelete={handleDelete}
                onReactivate={handleReactivate}
                onConfirmDelete={confirmDelete}
                onCancelDelete={cancelDelete}
              />
            ))}
          </div>
        </div>
      )}

      {users.length > 0 && (
        <PaginationControls
          totalItems={totalItems}
          page={page}
          onNext={handleNextPage}
          onPrev={handlePrevPage}
        />
      )}
    </div>
  );
}
