import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaRegEdit } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import placeholderImage from "../../../assets/images/product_placeholder.webp"
import { toast } from "sonner";

export default function ProductsTable() {
  const navigate = useNavigate();
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchProducts = async ({ pageParam = null }) => {
    const res = await axios.get(
      `https://ecommerce.markomedhat.com/api/products?Limit=20&Cursor=${pageParam}`
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

  const handleAddNavigation = () => navigate("/admin/products/add");

  if (isLoading) return <div className="text-center py-10">...جار التحميل</div>;
  if (isError)
    return (
      <div className="text-center text-red-600 py-10">
        خطأ في تحميل المنتجات
      </div>
    );

  const allProducts = data.pages.flatMap((page) => page.data.items);

  return (
    <div>
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
        <div className="col-span-6">اسم المنتج</div>
        <div className="col-span-2">الفئة</div>
        <div className="col-span-2">السعر</div>
        <div className="col-span-1">المخزون</div>
        <div className="col-span-1">المبيعات</div>
        {/* <div className="col-span-2 text-center">الأوامر</div> */}
      </div>

      {/* Product Rows */}
      <div className="flex flex-col mt-4">
        {allProducts.length > 0 ? (
          <>
            {allProducts.map((product) => (
              <div
                key={product.id}
                className="grid grid-cols-12 border-t border-gray-300 py-4 gap-5 px-4 text-sm text-gray-800 items-center hover:bg-gray-50"
              >
                <div className="col-span-6 flex items-center gap-5">
                  <div>
                    <img
                      src={product.images[0] || placeholderImage }
                      alt=""
                      width={30}
                    />
                  </div>
                  <div className="col-span-6 truncate">{product.title}</div>
                </div>
                <div className="col-span-2">{product.category || "—"}</div>
                <div className="col-span-2">{product.price} ج.م</div>
                <div className="col-span-1">{product.stock || "—"}</div>
                <div className="col-span-1">{product.sales || "—"}</div>
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
    </div>
  );
}
