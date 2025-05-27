import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaRegEdit } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

export default function CategoriesTable() {
  const navigate = useNavigate();
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchCategories = async () => {
    const res = await axios.get(
      `https://ecommerce.markomedhat.com/api/categories?Page=1&Limit=50`
    );
    return res.data.data.items;
  };

  const {
    data: categories = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const handleAddNavigation = () => navigate("/admin/categories/add");
  const handleEditNavigation = (id) => navigate(`/admin/categories/edit/${id}`);
  const confirmDelete = (id) => setDeleteConfirm(id);
  const cancelDelete = () => setDeleteConfirm(null);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://ecommerce.markomedhat.com/api/categories/${id}`);
      setDeleteConfirm(null);
      refetch();
      toast.success("تم حذف الفئة بنجاح");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("فشل الحذف. حاول مرة أخرى.");
    }
  };

  if (isLoading) return <div className="text-center py-10">...جار التحميل</div>;
  if (isError)
    return <div className="text-center text-red-600 py-10">خطأ في تحميل الفئات</div>;

  return (
    <div>
      {/* Header */}
      <div className="w-full flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">كل الفئات</h2>
        <button
          className="bg-black text-white text-md px-5 py-1 rounded-lg"
          onClick={handleAddNavigation}
        >
          إضافة
        </button>
      </div>

      {/* Categories List */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
              <h3 className="text-lg font-medium mb-2">{category.name}</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => handleEditNavigation(category.id)}
                  className="text-blue-600 hover:text-blue-800"
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
    </div>
  );
}
