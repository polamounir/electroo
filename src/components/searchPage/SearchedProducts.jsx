import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import NewProductCard from "../ui/NewProductCard";
import { fetchMoreSearchingProducts } from "../../app/slices/searchingSlice";
import ProductCardSkeleton from "../ui/ProductCardSkeleton";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import WishlistButton from "../ui/WishlistButton";
import { BsCartPlus } from "react-icons/bs";
import { addProductToCartAsync } from "../../app/slices/cartSlice";
import imagePlaceholder from "../../assets/images/product_placeholder.webp";

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
      {/* خصم */}
      {discountPercentage > 0 && (
        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded z-10">
          -{discountPercentage}%
        </div>
      )}

      {/* المفضلة */}
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

      {/* صورة المنتج */}
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

      {/* معلومات المنتج */}
      <div className="flex-1 text-xs relative">
        <h3 className="font-semibold truncate text-gray-800 mb-1 sm:max-w-[80%]">
          {title}
        </h3>

        {/* السعر */}
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

        {/* المورد */}
        <p className="text-gray-500 text-xs mb-2">{supplierName}</p>

        {/* زر الإضافة للسلة */}
        <div
          className={`flex justify-end ${
            isRowView ? "sm:absolute sm:bottom-4 sm:right-4" : ""
          }`}
        >
          <button
            onClick={handleAddToCart}
            className="text-teal-600 hover:text-white hover:bg-teal-600 border-2 border-teal-500 transition-all duration-200 rounded-full p-2 text-lg"
            aria-label="أضف إلى السلة"
          >
            <BsCartPlus />
          </button>
        </div>
      </div>
    </Link>
  );
}
export default function SearchedProducts() {
  const [ref, inView] = useInView();
  const dispatch = useDispatch();
  const { products, loading, error, hasMore } = useSelector(
    (state) => state.searching
  );
  useEffect(() => {
    if (inView && hasMore && !loading && products.length > 0) {
      dispatch(fetchMoreSearchingProducts());
    }
  }, [inView, hasMore, loading, dispatch, products.length]);

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    scrollToTop();
  }, [products]);

  // حالة التحميل
  if (loading && products.length === 0) {
    return (
      <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm min-h-full">
        <div className="flex justify-center flex-wrap gap-2 md:gap-5">
          {[...Array(6)].map((_, index) => (
            <ProductCardSkeleton key={index} type="product-card" />
          ))}
        </div>
      </div>
    );
  }

  // حالة الخطأ
  if (error) {
    return (
      <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm min-h-full">
        <div className="text-center text-red-500 py-10">
          حدث خطأ في تحميل المنتجات: {error}
        </div>
      </div>
    );
  }

  // حالة عدم وجود منتجات
  if (products.length === 0 && !loading) {
    return (
      <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm min-h-full">
        <div className="text-center text-gray-500 py-10">
          لم يتم العثور على منتجات. حاول استخدام معايير بحث مختلفة.
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm min-h-full">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}

        <div ref={ref}></div>
      </div>

      {/* مؤشر التحميل */}
      {loading && products.length > 0 && (
        <div className="flex justify-center mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        </div>
      )}
    </div>
  );
}
