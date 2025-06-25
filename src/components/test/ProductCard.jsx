import React from "react";
import { FiShoppingCart, FiHeart } from "react-icons/fi";

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="relative">
        <img
          src={product.imageUrl || "/placeholder-product.jpg"}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.hasDiscount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {product.discountPercentage}% خصم
          </span>
        )}
        <button className="absolute top-2 right-2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors">
          <FiHeart className="h-4 w-4 text-gray-600" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <div>
            {product.hasDiscount ? (
              <div className="flex items-center gap-2">
                <span className="font-bold text-teal-600">
                  {product.discountedPrice} ج.م
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {product.originalPrice} ج.م
                </span>
              </div>
            ) : (
              <span className="font-bold text-teal-600">
                {product.price} ج.م
              </span>
            )}
          </div>
          <button className="bg-teal-100 text-teal-600 p-2 rounded-full hover:bg-teal-200 transition-colors">
            <FiShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
