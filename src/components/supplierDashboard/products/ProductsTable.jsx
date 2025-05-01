import { useEffect, useState } from "react";
import axios from "axios";
import { FaRegEdit } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/axiosInstance";

export default function ProductsTable() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = async (cursor = null) => {
    try {
      const { data } = await api.get(
        `/supplier-products?Limit=5${cursor ? `&cursor=${cursor}` : ""}`
      );
      setProducts((prev) => [...prev, ...data.data.items]);

      setCursor(data.data.cursor);
      setHasMore(data.data.hasMore);
    } catch (err) {
      console.error("Fetching error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(); 
    console.log("Products fetched:", products);

  }, []);

  const handleFetchMore = () => {
    if (hasMore) {
      fetchProducts(cursor);
    }
  };

  const handleAddNavigation = () => navigate("/supplier/products/add");
  const handleEditNavigation = (id) =>
    navigate(`/supplier/products/edit/${id}`);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="">
      <div className="w-full flex justify-between">
        <h2 className="text-2xl font-semibold">كل المنتجات</h2>
        <button
          className="bg-black text-white text-md px-5 py-1 rounded-lg"
          onClick={handleAddNavigation}
        >
          أضافة
        </button>
      </div>

      <div className="flex flex-col mt-10">
        <div className="grid grid-cols-12 py-3 font-bold">
          <div className="col-span-4">اسم المنتج</div>
          <div className="col-span-2">الفئة</div>
          <div className="col-span-2">السعر</div>
          <div className="col-span-1">المخزون</div>
          <div className="col-span-1">المبيعات</div>
          <div className="col-span-2 text-center">الاوامر</div>
        </div>
        {products.map((product) => (
          <div
            key={product.id}
            className="grid grid-cols-12 border-t border-gray-300 py-5 gap-5"
          >
            <div className="col-span-4 truncate">{product.title}</div>
            <div className="col-span-2">{product.category || "__"}</div>
            <div className="col-span-2">{product.price} ج.م</div>
            <div className="col-span-1">{product.stock || "__"}</div>
            <div className="col-span-1">{product.sales || "__"}</div>
            <div className="col-span-2 flex justify-center gap-2">
              <button
                className="text-teal-600 text-2xl"
                onClick={() => handleEditNavigation(product.id)}
              >
                <FaRegEdit />
              </button>
              <button className="text-red-600 text-2xl">
                <GoTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-4">
          <button
            className="bg-teal-500 px-4 py-2 text-white rounded-2xl"
            onClick={handleFetchMore}
          >
            View more
          </button>
        </div>
      )}
    </div>
  );
}
