import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import imagePlaceholder from "../../assets/images/product_placeholder.webp";
import { BsCartPlus } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { addProductToCartAsync } from "../../app/slices/cartSlice";
import WishlistButton from "../ui/WishlistButton";

function ProductCard({ product, isRowView = false }) {
  const dispatch = useDispatch();

  const {
    id,
    title,
    images,
    price,
    discountedPrice,
    discountPercentage,
    supplierName,
  } = product;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addProductToCartAsync(id));
  };

  return (
    <Link
      to={`/product/${id}`}
      className={`group bg-white relative overflow-hidden rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-200 ${
        isRowView ? "flex flex-col sm:flex-row gap-4 p-4" : "p-4"
      }`}
    >
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded z-10">
          -{discountPercentage}%
        </div>
      )}

      {/* Wishlist */}
      <div className="absolute top-3 left-3 z-10">
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <WishlistButton product={product} />
        </div>
      </div>

      {/* Product Image */}
      <div
        className={`bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center ${
          isRowView ? "w-full sm:w-48 h-48" : "w-full aspect-square"
        }`}
      >
        <img
          src={images?.[0] || imagePlaceholder}
          alt={title}
          loading="lazy"
          className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = imagePlaceholder;
          }}
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 text-xs relative">
        <h3 className="font-semibold truncate text-gray-800 mb-1 sm:max-w-[80%]">
          {title}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 my-1">
          {discountPercentage > 0 ? (
            <>
              <p className="text-teal-600 font-bold">{discountedPrice} ج.م</p>
              <p className="text-red-500 font-semibold line-through">
                {price} ج.م
              </p>
            </>
          ) : (
            <p className="text-teal-600 font-bold">{price} ج.م</p>
          )}
        </div>

        {/* Supplier */}
        <p className="text-gray-500 text-xs mb-2">{supplierName}</p>

        {/* Add to Cart Button */}
        <div
          className={`flex justify-end ${
            isRowView ? "sm:absolute sm:bottom-4 sm:right-4" : ""
          }`}
        >
          <button
            onClick={handleAddToCart}
            className="text-teal-600 hover:text-white hover:bg-teal-600 border-2 border-teal-500 transition-all duration-200 rounded-full p-2 text-lg"
            aria-label="Add to cart"
          >
            <BsCartPlus />
          </button>
        </div>
      </div>
    </Link>
  );
}

export function SearchProductsContainer({ products, isRowView }) {
  // console.log("SearchProductsContainer rendered with products: 000000000000", products);
  // const [isRowView, setIsRowView] = useState(false);

  // const toggleView = () => {
  //   setIsRowView(!isRowView);
  // };

  return (
    <div className="px-4 py-6">
      {/* <div className="flex justify-end mb-4">
        <button
          onClick={toggleView}
          className="px-3 py-1 border border-gray-200 rounded text-sm text-teal-700 hover:bg-gray-100"
        >
          تغيير العرض {isRowView ? "صورة" : "قائمة"}
        </button>
      </div> */}

      <div
        className={`gap-4 ${
          isRowView
            ? "flex flex-col"
            : "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        }`}
      >
        {products.length > 0 ? (
          products.map((product, index) => (
            <ProductCard
              key={`${product.id}_${index}`}
              product={product}
              isRowView={isRowView}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            <p className="text-lg">لا توجد نتائج للبحث</p>
            <p className="mt-2">
              حاول تعديل معايير البحث أو البحث بكلمات مختلفة.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(SearchProductsContainer);
