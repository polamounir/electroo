import { useParams } from "react-router-dom";
import { getCategoryProducts } from "../api/product";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import ProductCard from "../components/ui/ProductCard";

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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-2 py-10 pb-20">
      <div>
        <div>
          <h1>اسم الفئة</h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        {hasMoreItems && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleLoadMore}
              className="bg-teal-500 text-white px-4 py-2 rounded-md"
            >
              {isLoading ? "جاري التحميل..." : "المزيد"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
