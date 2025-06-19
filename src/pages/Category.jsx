import { useParams } from "react-router-dom";
import { getCategoryProducts } from "../api/product";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import ProductCard from "../components/ui/ProductCard";
import { FaSpinner, FaExclamationTriangle } from "react-icons/fa";

export default function Category() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [cursor, setCursor] = useState(null);

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["category", id, cursor],
    queryFn: () => getCategoryProducts(cursor, id),
    keepPreviousData: true,
  });

  useEffect(() => {
    if (data) {
      if (cursor === null) {
        // First load
        setProducts(data.items);
      } else {
        // Subsequent loads (pagination)
        setProducts((prev) => [...prev, ...data.items]);
      }
      setHasMoreItems(data.hasMore);
    }
  }, [data, cursor]);

  const handleLoadMore = () => {
    if (data?.cursor) {
      setCursor(data.cursor);
    }
  };

  if (isLoading && !products.length) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-svh flex flex-col items-center justify-center">
        <FaSpinner className="animate-spin text-teal-500 text-4xl mb-4" />
        <p className="text-gray-600">جاري تحميل المنتجات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-svh pt-20 pb-15">
        <div className="flex flex-col items-center justify-center py-12 bg-red-50 rounded-lg">
          <FaExclamationTriangle className="text-red-500 text-4xl mb-4" />
          <p className="text-red-600 font-medium">
            {error.message || "فشل تحميل المنتجات"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-svh pt-25 pb-20">
      <h1 className="text-3xl font-bold mb-8 text-teal-500 border-b-2 border-teal-500 pb-2">
        {products[0]?.category || "المنتجات"}
      </h1>

      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.map((product) => (
              <div key={product.id} className="h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {hasMoreItems && (
            <div className="flex justify-center mt-10 ">
              <button
                onClick={handleLoadMore}
                disabled={isFetching}
                className="px-6 py-3 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isFetching ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    جاري التحميل...
                  </>
                ) : (
                  "عرض المزيد"
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-500">لا توجد منتجات متاحة في هذا التصنيف</p>
        </div>
      )}
    </div>
  );
}
