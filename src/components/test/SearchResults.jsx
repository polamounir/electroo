import React, { useCallback, useEffect } from "react";
import ActiveFilters from "./ActiveFilters";
import NewProductCard from "../ui/NewProductCard";
import { useSelector, useDispatch } from "react-redux";
import {
  selectProducts,
  selectLoading,
  selectError,
  selectHasMore,
  fetchMoreProducts,
  selectHasActiveFilters,
} from "../../app/slices/productsSearchSlice";

export default function SearchResults() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.productsSearch);
  const isLoading = useSelector(selectLoading);
  const isError = useSelector(selectError);
  const hasMore = useSelector(selectHasMore);
  const hasActiveFilters = useSelector(selectHasActiveFilters);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      dispatch(fetchMoreProducts());
    }
  }, [hasMore, isLoading, dispatch]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight =
        document.documentElement.clientHeight || window.innerHeight;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

      if (isNearBottom && hasMore && !isLoading) {
        handleLoadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoading, handleLoadMore]);

  console.log(products);
  return (
    <div className="lg:col-span-3">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">نتائج البحث</h3>
          <div className="text-sm text-gray-500">
            عرض النتائج حسب الفلاتر المحددة
          </div>
        </div>

        <ActiveFilters />

        {isLoading && !products.length && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto mb-4" />
            <p className="text-gray-600">جاري تحميل المنتجات...</p>
          </div>
        )}

        {isError && (
          <div className="text-center py-12 text-red-500">
            <p className="text-lg mb-2">حدث خطأ أثناء جلب البيانات</p>
            <p className="text-sm">الرجاء المحاولة مرة أخرى</p>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {products.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-5 justify-center">
                  {products.map((product) => (
                    <NewProductCard key={product.id} product={product} />
                  ))}
                </div>

                {isLoading && hasMore && (
                  <div className="mt-6 text-center">
                    <div className="animate-pulse text-teal-600">
                      جاري تحميل المزيد...
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-lg mb-2">لا توجد منتجات مطابقة للبحث</p>
                <p className="text-sm">
                  {hasActiveFilters
                    ? "جرب تعديل الفلاتر للحصول على نتائج أكثر"
                    : "ابدأ بالبحث عن المنتجات"}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
