import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaRegEdit } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../../api/axiosInstance";

export default function ProductsTable() {
  const navigate = useNavigate();
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchedProuducts, setSearchedProuducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);

  const fetchProducts = async ({ pageParam = null }) => {
    const res = await api.get(
      `/supplier-products?Limit=20&Cursor=${pageParam}`
    );
    return res.data;
  };

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    getNextPageParam: (lastPage) =>
      lastPage?.data?.hasMore ? lastPage?.data?.cursor : undefined,
  });

  const fetchSearchProducts = async () => {
    // e.preventDefault();
    setSearchLoading(true);
    try {
      const response = await api.get(
        `/supplier-products?Limit=100&SearchQuery=${searchQuery}`
      );
      // console.log(response.data.data);
      setSearchedProuducts(response.data.data);
      setSearchLoading(false);
      setSearchError(false);
    } catch (error) {
      console.error("Error fetching Promos:", error);
      setSearchError(true);
      setSearchLoading(false);
      toast.error("Failed to load Promos");
    }
  };

  const handleAddNavigation = () => navigate("/supplier/products/add");
  const handleEditNavigation = (id) =>
    navigate(`/supplier/products/edit/${id}`);
  const confirmDelete = (id) => setDeleteConfirm(id);
  const cancelDelete = () => setDeleteConfirm(null);

  const handleDelete = async (id) => {
    try {
      await api.delete(
        `/products/${id}`
      );
      setDeleteConfirm(null);
      refetch();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("فشل الحذف. حاول مرة أخرى.");
    }
  };

  if (isLoading) return <div className="text-center py-10">...جار التحميل</div>;
  if (isError)
    return (
      <div className="text-center text-red-600 py-10">
        خطأ في تحميل المنتجات
      </div>
    );

  const allProducts = data.pages.flatMap((page) => page.data.items);
  console.log(searchedProuducts);
  return (
    <div>
      <div className="flex gap-5 text-lg font-semibold items-center mt-5 relative overflow-hidden rounded-full border border-gray-300 mb-5">
        <input
          type="text"
          placeholder="بحث  ..."
          name="orderId"
          className="px-4 py-2 w-full pe-20"
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.code === "Enter" || e.which === 13) {
              fetchSearchProducts();
            }
          }}
        />
        <button
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 absolute end-0 top-0 bottom-0 text-white duration-300"
          onClick={fetchSearchProducts}
        >
          بحث
        </button>
      </div>

      {/* Header */}
      <div className="w-full flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">كل المنتجات</h2>
        <button
          className="bg-black text-white text-md px-5 py-1 rounded-lg"
          onClick={handleAddNavigation}
        >
          أضافة
        </button>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 py-3 bg-gray-100 font-semibold text-sm rounded-md px-4 text-gray-700">
        <div className="col-span-4">اسم المنتج</div>
        <div className="col-span-2">الفئة</div>
        <div className="col-span-2">السعر</div>
        <div className="col-span-1">المخزون</div>
        <div className="col-span-1">المبيعات</div>
        <div className="col-span-2 text-center">الأوامر</div>
      </div>

      {/* Product Rows */}
      {searchedProuducts?.items?.length > 0 ? (
        <div className="flex flex-col mt-4">
          {searchedProuducts?.items?.map((product) => (
            <div
              key={product.id}
              className="grid grid-cols-12 border-t border-gray-300 py-4 gap-5 px-4 text-sm text-gray-800 items-center hover:bg-gray-50"
            >
              <div className="col-span-4 truncate">{product.title}</div>
              <div className="col-span-2">{product.category || "—"}</div>
              <div className="col-span-2">{product.price} ج.م</div>
              <div className="col-span-1">{product.stock || "—"}</div>
              <div className="col-span-1">{product.boughtCount || "—"}</div>
              <div className="col-span-2 flex justify-center gap-3">
                <button
                  title="تعديل"
                  className="text-teal-600 text-xl hover:text-teal-800"
                  onClick={() => handleEditNavigation(product.id)}
                >
                  <FaRegEdit />
                </button>
                <div>
                  {deleteConfirm === product.id ? (
                    <div
                      className="fixed inset-0 bg-black/20 bg-opacity-50 z-40 flex items-center justify-center p-4"
                      onClick={cancelDelete}
                    >
                      <div
                        className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 z-50 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">
                          تأكيد حذف المنتج
                        </h3>

                        <p className="text-gray-600 mb-6">
                          هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا
                          الإجراء.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => handleDelete(product.id)}
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
                      onClick={() => confirmDelete(product.id)}
                      title="حذف المنتج"
                    >
                      <GoTrash />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col mt-4">
          {allProducts.length > 0 ? (
            <>
              {allProducts.map((product) => (
                <div
                  key={product.id}
                  className="grid grid-cols-12 border-t border-gray-300 py-4 gap-5 px-4 text-sm text-gray-800 items-center hover:bg-gray-50"
                >
                  <div className="col-span-4 truncate">{product.title}</div>
                  <div className="col-span-2">{product.category || "—"}</div>
                  <div className="col-span-2">{product.price} ج.م</div>
                  <div className="col-span-1">{product.stock || "—"}</div>
                  <div className="col-span-1">{product.boughtCount || "—"}</div>
                  <div className="col-span-2 flex justify-center gap-3">
                    <button
                      title="تعديل"
                      className="text-teal-600 text-xl hover:text-teal-800"
                      onClick={() => handleEditNavigation(product.id)}
                    >
                      <FaRegEdit />
                    </button>
                    <div>
                      {deleteConfirm === product.id ? (
                        <div
                          className="fixed inset-0 bg-black/20 bg-opacity-50 z-40 flex items-center justify-center p-4"
                          onClick={cancelDelete}
                        >
                          <div
                            className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 z-50 text-right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">
                              تأكيد حذف المنتج
                            </h3>

                            <p className="text-gray-600 mb-6">
                              هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن
                              هذا الإجراء.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3">
                              <button
                                onClick={() => handleDelete(product.id)}
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
                          onClick={() => confirmDelete(product.id)}
                          title="حذف المنتج"
                        >
                          <GoTrash />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* View More Button */}
              {hasNextPage && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="px-5 py-2 bg-teal-600 hover:bg-teal-500 rounded-lg text-white"
                  >
                    {isFetchingNextPage ? "جار التحميل..." : "المزيد"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-500 py-6">لا توجد منتجات</div>
          )}
        </div>
      )}
    </div>
  );
}
