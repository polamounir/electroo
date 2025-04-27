import { useParams } from "react-router-dom";
import { getCategoryProducts } from "../api/product";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import ProductCard from "../components/ui/ProductCard";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";

export default function Category() {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["category", page],
    queryFn: () => getCategoryProducts(page),
  });

  useEffect(() => {
    if (data) {
      if (page === 1) {
        setProducts(data.items);
      } else {
        setProducts((prev) => [...prev, ...data.items]);
      }
      setTotalItems(data.totalItems);
    }
  }, [data, page]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const hasMoreItems = products.length < totalItems;

  if (isLoading && page === 1) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage error={error.message} />;
  }

  return (
    <div className="container mx-auto px-2 py-10 pb-20">
      <div>
        <div>
          <h1 className="title text-center text-3xl md:text-5xl py-10">اسم الفئة</h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        {hasMoreItems && (
          <div className="flex justify-center mt-10">
            <button
              onClick={handleLoadMore}
              className="bg-teal-500 text-white px-10  py-2 rounded-full text-lg font-semibold"
            >
              {isLoading ? "جاري التحميل..." : "المزيد"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
