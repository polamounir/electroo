import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../api/product";
import { useQuery } from "@tanstack/react-query";
import placeholderImage from "../assets/images/product_placeholder.webp";

export default function Product() {
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
  });

  const [mainImage, setMainImage] = useState(null);

  if (!data)
    return (
      <div className="text-center text-teal-600 mt-10 font-medium">
        جاري التحميل...
      </div>
    );

  const handleImageClick = (img) => {
    setMainImage(img);
  };

  const handleImageError = (e) => {
    e.target.src = placeholderImage;
  };

  return (
    <div className="mx-auto px-4 md:px-50 py-20 flex justify-center items-center min-h-[75svh]">
      <div className="flex flex-col md:flex-row-reverse gap-10  p-6 md:p-8 rounded-xl w-full ">
        {/* Image Gallery */}
        <div className="flex-1">
          <div className="border border-teal-500 rounded-lg overflow-hidden relative">
            <img
              key={mainImage || data.images[0]}
              src={mainImage || data.images[0]||placeholderImage}
              onError={handleImageError}
              alt={data.title}
              className="w-full h-[300px] sm:h-[400px] object-cover transition-all duration-500 ease-in-out opacity-0 animate-fadeIn"
            />
          </div>

          <div className="flex gap-3 mt-4 overflow-x-auto scrollbar-thin scrollbar-thumb-teal-500 scrollbar-track-gray-200 py-3 px-3">
            {data.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                onError={handleImageError}
                alt={`thumb-${idx}`}
                onClick={() => handleImageClick(img)}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 hover:scale-110 ${
                  img === mainImage
                    ? "border-teal-500 ring-2 ring-offset-2 ring-teal-400"
                    : "border-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold text-teal-600">{data.title}</h1>

          {/* Price & Discount */}
          <div className="text-xl md:text-2xl font-semibold flex items-center gap-3 flex-wrap">
            <span className="text-gray-800">${data.discountedPrice}</span>
            <span className="text-gray-400 line-through">${data.price}</span>
            <span className="bg-teal-100 text-teal-700 text-sm px-2 py-1 rounded-full">
              وفر {data.discountPercentage}%
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed">{data.description}</p>

          {/* Product Info */}
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-semibold text-teal-600">المخزون:</span>{" "}
              {data.stock}
            </p>
            <p>
              <span className="font-semibold text-teal-600">الفئة:</span>{" "}
              {data.category}
            </p>
            <p>
              <span className="font-semibold text-teal-600">
                العلامة التجارية:
              </span>{" "}
              {data.brand}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-2">
            {data.tags.split(",").map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-teal-200 text-teal-800 text-sm rounded-full"
              >
                {tag.trim()}
              </span>
            ))}
          </div>

          {/* Reviews */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-teal-600 mb-2">
              التقييمات
            </h2>
            {data.isReviewed ? (
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-teal-400 scrollbar-track-gray-200">
                {data.productReviews.map((review, idx) => (
                  <div
                    key={idx}
                    className="border border-teal-300 p-4 rounded-lg bg-white shadow-sm"
                  >
                    <p className="italic text-gray-700">"{review.review}"</p>
                    <p className="text-teal-600 mt-2">
                      التقييم: {review.rating} ⭐
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">لا توجد تقييمات حتى الآن</p>
            )}
          </div>

          {/* Add to Cart Button */}
          <button className="mt-6 w-full md:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg shadow-md transition">
            🛒 أضف إلى السلة
          </button>
        </div>
      </div>
    </div>
  );
}
