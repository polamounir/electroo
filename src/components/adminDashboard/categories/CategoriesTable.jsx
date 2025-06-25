import { useQuery } from "@tanstack/react-query";
import { FaRegEdit } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../../api/axiosInstance";
import { Link } from "react-router-dom";

export default function CategoriesTable() {
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", image: "" });
  const [page, setPage] = useState(1);
  const limit = 20;

  const fetchCategories = async () => {
    const res = await api.get(`/categories?page=${page}&limit=${limit}`);
    return {
      items: res.data.data.items,
      totalItems: res.data.data.totalItems,
    };
  };

  const {
    data: { items: categories = [], totalItems } = {},
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["categories", page],
    queryFn: fetchCategories,
  });

  console.log(totalItems);
  const confirmDelete = (id) => setDeleteConfirm(id);
  const cancelDelete = () => setDeleteConfirm(null);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      setDeleteConfirm(null);
      refetch();
      toast.success("تم حذف الفئة بنجاح");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("فشل الحذف. حاول مرة أخرى.");
    }
  };

  const startEditing = (category) => {
    setEditingCategoryId(category.id);
    setEditForm({ name: category.name, image: category.image });
  };

  const cancelEdit = () => {
    setEditingCategoryId(null);
    setEditForm({ name: "", image: "" });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (id) => {
    try {
      await api.put(`/categories/${id}`, {
        id,
        name: editForm.name,
      });
      toast.success("تم تعديل الفئة بنجاح");
      setEditingCategoryId(null);
      refetch();
    } catch (err) {
      console.error("Edit failed:", err);
      toast.error("فشل التعديل. حاول مرة أخرى.");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(totalItems / limit)) {
      setPage(newPage);
    }
  };

  if (isLoading) return <div className="text-center py-10">...جار التحميل</div>;
  if (isError)
    return (
      <div className="text-center text-red-600 py-10">خطأ في تحميل الفئات</div>
    );

  return (
    <div>
      {/* Header */}
      <div className="w-full flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">كل الفئات</h2>
        <Link
          to="/admin/categories/add"
          className="bg-black text-white text-md px-5 py-1 rounded-lg"
        >
          إضافة
        </Link>
      </div>

      {/* Categories List */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div
              key={category.id}
              className="border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col items-center text-center hover:shadow-md transition relative overflow-hidden"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-24 h-24 object-contain mb-3"
              />

              {editingCategoryId === category.id ? (
                <div className="w-full">
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className="w-full border rounded p-1 mb-2"
                  />

                  <div className="flex gap-2 justify-center mt-2">
                    <button
                      onClick={() => handleSave(category.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      حفظ
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-medium mb-2">{category.name}</h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => startEditing(category)}
                      className="text-teal-600 hover:text-teal-800"
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      onClick={() => confirmDelete(category.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <GoTrash />
                    </button>
                  </div>
                </>
              )}

              {deleteConfirm === category.id && (
                <div className="mt-2 text-sm text-red-600 absolute bg-white bottom-0 py-10 start-0 end-0">
                  <p>هل أنت متأكد من الحذف؟</p>
                  <div className="flex gap-2 mt-1 justify-center">
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-white bg-red-600 px-3 py-1 rounded"
                    >
                      نعم
                    </button>
                    <button
                      onClick={cancelDelete}
                      className="text-gray-600 border px-3 py-1 rounded"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-6 col-span-full">
            لا توجد فئات
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalItems / limit > limit * limit && (
        <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div></div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    page === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">السابق</span>
                  السابق
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  {page} من {Math.ceil(totalItems / limit)}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= Math.ceil(totalItems / limit)}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    page >= Math.ceil(totalItems / limit)
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">التالي</span>
                  التالي
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
