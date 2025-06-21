import React, { useEffect, useState } from "react";
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
import BidModel from "../components/product/BidModel";
import BidTableModel from "../components/product/BidTableModel";
import { motion } from "framer-motion";
import { FaStar, FaRegStar, FaQuoteLeft, FaEdit, FaUser } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import WishlistButton from "../components/ui/WishlistButton";

export default function Product() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { activeChat, isMenuOpen } = useSelector((state) => state.chat);
  const [stockStatus, setStockStatus] = useState(null);
  // const { cartItems } = useSelector((state) => state.cart);

  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
  });
  // console.log(data, "data");

  const [mainImage, setMainImage] = useState(null);

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
  useEffect(() => {
    const stockStatusVars = [
      {
        name: "متبقي اقل من 10 قطع",
        value: "LowStock",
      },
      {
        name: "متوفر",
        value: "InStock",
      },
      {
        name: "غير موفر",
        value: "OutStock",
      },
    ];
    const state = stockStatusVars.filter((s) => s.value === data?.stockStatus);

    setStockStatus(state[0]);
  }, [id, data]);

  const reviewVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  if (!data) return <LoadingPage />;
  return (
    <div className="mx-auto px-4 xl:px-50 py-20 flex justify-center items-center flex-col min-h-[75svh]">
      <AddProductReviewModel />
      {activeChat === "popup" && isMenuOpen && <ChatPopup />}
      <div className="w-full p-6 md:p-8 rounded-xl ">
        <div className="flex flex-col md:flex-row-reverse gap-10  ">
          {/* Image Gallery */}
          <div className="flex-1 relative">
            <div className="absolute end-5 top-5 z-10">
              <WishlistButton product={data} />
            </div>
            <div className=" rounded-lg overflow-hidden relative flex justify-center items-center p-5 border border-teal-500 shadow-md">
              <img
                key={mainImage || data.images[0]?.url}
                src={mainImage || data.images[0]?.url || placeholderImage}
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
              <p className="text-teal-600 mt-2">التقييم: {data.rate} ⭐</p>
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

            {/* Stock Status*/}
            {stockStatus && (
              <div className="flex">
                <p
                  className={`
                  ${stockStatus.value == "InStock" && "bg-teal-600"} 
                  ${stockStatus.value == "LowStock" && "bg-red-500"} ${
                    stockStatus.value == "OutStock" && "bg-red-500"
                  }
                  text-sm text-white font-semibold px-5 py-1 rounded-full`}
                >
                  {stockStatus.name}
                </p>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              className="mt-6 w-full md:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg shadow-md duration-300 transition"
              onClick={() => {
                addToCart(data.id);
              }}
            >
              🛒 أضف إلى السلة
            </button>

            {/* Bids */}
            <div>{data?.isAuction && <BidModel product={data} />}</div>
            <div>
              {/* {data?.isAuction && <BidTableModel data={data.productBids} />} */}
            </div>
          </div>
          {/* Reviews */}
        </div>
      </div>
      {/* ------------------------------------------------------- */}
      <div className="w-full">
        <div className="mt-12">
          {/* Modern header with decorative elements */}
          <div className="flex items-center mb-8 gap-3">
            <div className="h-1 w-8 bg-teal-500 rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-800">
              تقييمات المستخدمين
            </h2>
            <div className="h-1 flex-1 bg-gradient-to-r from-teal-100 to-transparent"></div>
          </div>

          {data.productReviews && data.productReviews.length > 0 ? (
            <div className="space-y-6 max-h-[33rem] overflow-y-auto pr-3 custom-scrollbar px-10">
              {data.productReviews.map((review, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: idx * 0.08,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ y: -3 }}
                  className="relative bg-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row gap-6 transition-all duration-300 hover:shadow-lg border border-gray-100 group"
                >
                  {/* Decorative accent */}
                  <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-teal-400 to-teal-600 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Avatar with user icon */}
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-xl flex-shrink-0">
                      {review.fullName ? (
                        review.fullName.charAt(0)
                      ) : (
                        <FaUser className="text-teal-500" />
                      )}
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <p className="text-xl font-bold text-gray-800">
                        {review.fullName || "مستخدم"}
                      </p>

                      {/* Interactive star rating */}
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) =>
                          i < review.stars ? (
                            <FaStar key={i} className="text-yellow-400" />
                          ) : (
                            <FaRegStar key={i} className="text-gray-300" />
                          )
                        )}
                        <span className="text-sm text-gray-500 mr-1">
                          ({review.stars}.0)
                        </span>
                      </div>
                    </div>

                    {/* Review text with quote icon */}
                    <div className="relative mt-3">
                      <FaQuoteLeft className="absolute -right-4 -top-2 text-2xl text-gray-200" />
                      <p className="text-gray-600 leading-relaxed text-lg pr-4">
                        {review.reviewText}
                      </p>
                    </div>

                    {/* Review date */}
                    {review.date && (
                      <p className="text-sm text-gray-400 mt-3">
                        {new Date(review.date).toLocaleDateString("ar-EG")}
                      </p>
                    )}
                  </div>

                  {/* Image with hover effect */}
                  {review.reviewImage && (
                    <motion.div
                      className="w-full md:w-25 h-25 flex-shrink-0 overflow-hidden rounded-xl relative"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={review.reviewImage}
                        alt="مراجعة المستخدم"
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FaQuoteLeft className="text-4xl text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg mb-6">
                لا توجد تقييمات حتى الآن.
              </p>
            </motion.div>
          )}

          {data.canReview && (
            <motion.div
              className="text-center mt-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <button
                onClick={() => dispatch(openProductReviewModal(data.id))}
                className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full hover:shadow-lg transition-all duration-300 font-medium flex items-center gap-2 mx-auto shadow-md hover:shadow-teal-200"
              >
                <FaEdit className="text-lg" />
                <span>إضافة تقييم</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
