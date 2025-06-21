import React, { useEffect, useState } from "react";
import ProductCard from "../components/ui/ProductCard";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);

  const getWishlistItems = () => {
    try {
      return JSON.parse(localStorage.getItem("wishlist")) || [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    const items = getWishlistItems();
    setWishlistItems(items);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 min-h-svh pt-25 pb-20">
      <h1 className="text-3xl font-bold mb-8 text-teal-500 border-b-2 border-teal-500 pb-2">
        تصنيفات المنتجات
      </h1>
      {wishlistItems.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          لا توجد منتجات في قائمة المفضلة.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
