import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../api/product";
import { useQuery } from "@tanstack/react-query";
import placeholderImage from "../assets/images/product_placeholder.webp";
import { useDispatch, useSelector } from "react-redux";
import { startConversationThunk } from "../app/slices/chatSlice";
import ChatPopup from "../components/ui/ChatPopup";
import { openProductReviewModal } from "../app/slices/prouctReviewSlice";
import AddProductReviewModel from "../components/product/AddProductReviewModel";
import LoadingPage from "./LoadingPage";
import { toast } from "sonner";
import { addProductToCartAsync } from "../app/slices/cartSlice";

export default function Product() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { activeChat, isMenuOpen } = useSelector((state) => state.chat);
  // const { cartItems } = useSelector((state) => state.cart);

  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
  });
  // console.log(data, "data");

  const [mainImage, setMainImage] = useState(null);

  if (!data) return <LoadingPage />;

  const handleImageClick = (img) => {
    setMainImage(img);
  };

  const handleImageError = (e) => {
    e.target.src = placeholderImage;
  };

  const handleChatStart = async () => {
    try {
      const response = dispatch(
        startConversationThunk({
          supplierId: data.supplierId,
          productId: data.id,
          productName: data.title,
        })
      );
      // console.log(response.payload);
      if (response?.payload?.status === 401) {
        toast.error(response?.payload?.detail);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = (id) => {
    dispatch(addProductToCartAsync(id));
  };

  console.log(data);
  return (
    <div className="mx-auto px-4 xl:px-50 py-20 flex justify-center items-center flex-col min-h-[75svh]">
      <AddProductReviewModel />
      {activeChat === "popup" && isMenuOpen && <ChatPopup />}
      <div className="w-full p-6 md:p-8 rounded-xl ">
        <div className="flex flex-col md:flex-row-reverse gap-10  ">
          {/* Image Gallery */}
          <div className="flex-1">
            <div className=" rounded-lg overflow-hidden relative flex justify-center items-center p-5 border border-teal-500 shadow-md">
              <img
                key={mainImage || data.images[0].url}
                src={mainImage || data.images[0].url || placeholderImage}
                onError={handleImageError}
                alt={data.title}
                className="w-full  max-h-[400px] object-contain transition-all duration-500 ease-in-out opacity-0 animate-fadeIn"
              />
            </div>

            <div className="flex gap-3 mt-4 overflow-x-auto scrollbar-thin scrollbar-thumb-teal-500 scrollbar-track-gray-200 py-3 px-3">
              {data.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url || placeholderImage}
                  onError={handleImageError}
                  alt={`thumb-${idx}`}
                  onClick={() => handleImageClick(img.url)}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 hover:scale-110 ${
                    img.url === mainImage
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
              {data.discountPercentage > 0 && (
                <span className="text-gray-800">
                  {" "}
                  {data.discountedPrice} ج.م
                </span>
              )}
              <span
                className={` ${
                  data.discountPercentage > 0 && "text-gray-400 line-through"
                }`}
              >
                {data.price}ج.م
              </span>
              {data.discountPercentage > 0 && (
                <span className="bg-teal-100 text-teal-700 text-sm px-2 py-1 rounded-full">
                  وفر {data.discountPercentage}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed">{data.description}</p>

            {/* Product Info */}
            <div className="space-y-1 text-sm">
              {/* <p>
              <span className="font-semibold text-teal-600">المخزون:</span>{" "}
              {data.stock}
            </p> */}
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
              <p>
                <span className="font-semibold text-teal-600">يباع من :</span>{" "}
                {data.storeName}
              </p>
              <p>
                {/* <button
                onClick={handleChatStart}
                className="font-semibold text-teal-600 italic underline"
                >
                تحدث مع البائع
                </button> */}
                <Link
                  // to={`/chat`}
                  onClick={handleChatStart}
                  className="font-semibold text-teal-600 italic underline"
                >
                  تحدث مع البائع
                </Link>
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
            {/* Add to Cart Button */}

            <button
              className="mt-6 w-full md:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg shadow-md transition"
              onClick={() => {
                addToCart(data.id);
                toast.success("تمت إضافة المنتج إلى السلة بنجاح");
              }}
            >
              🛒 أضف إلى السلة
            </button>
          </div>
          {/* Reviews */}
        </div>
      </div>
      <div className="w-full ">
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-teal-600 mb-2">
            التقييمات
          </h2>

          {data.productReviews && data.productReviews.length > 0 ? (
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-teal-400 scrollbar-track-gray-200">
              {data.productReviews.map((review, idx) => (
                <div
                  key={idx}
                  className="border border-teal-300 p-4 rounded-lg bg-white shadow-sm"
                >
                  <p className="italic text-gray-700">{review.fullName}</p>
                  <p className="italic text-gray-700">"{review.reviewText}"</p>
                  <p className="text-teal-600 mt-2">
                    التقييم: {review.stars} ⭐
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">لا توجد تقييمات حتى الآن</p>
          )}

          <button
            onClick={() => dispatch(openProductReviewModal(data.id))}
            className="mt-4 px-4 py-1 bg-teal-600 text-white rounded-full hover:bg-teal-500 transition duration-200"
          >
            إضافة تقييم
          </button>
        </div>
      </div>
    </div>
  );
}
