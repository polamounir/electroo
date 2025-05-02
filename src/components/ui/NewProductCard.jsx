import React from "react";
import { BsCartPlus } from "react-icons/bs";
import placeholderImg from "../../assets/images/product_placeholder.webp";

export default function NewProductCard({ product }) {
  return (
    <div
      key={product.id}
      className="w-[140px] sm:w-[200px] md:w-[250px] bg-white rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow duration-200 relative"
    >
      {/* Discount badge */}
      {product.discountPercentage > 0 && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
          خصم {product.discountPercentage}٪
        </div>
      )}

      {/* Image Container with fixed height */}
      <div className="h-40 w-full flex items-center justify-center rounded overflow-hidden">
        <img
          src={product.images[0] || placeholderImg}
          alt={product.title}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Title */}
      <h2 className="mt-2 text-sm sm:text-base font-semibold text-gray-800 truncate">
        {product.title}
      </h2>

      {/* Price */}
      <div className="mt-1 text-black font-bold text-sm sm:text-base">
        {product.discountedPrice.toFixed(2)} جنيه
      </div>

      {/* Add to cart button */}
      <div className="flex justify-end">
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            // addToCart(id);
          }}
          className="text-teal-500 text-sm md:text-2xl border-2 border-teal-500 rounded-full p-2"
        >
          <BsCartPlus />
        </button>
      </div>
    </div>
  );
}
