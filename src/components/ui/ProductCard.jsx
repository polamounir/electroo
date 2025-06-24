import { BsCartPlus } from "react-icons/bs";
import { GoStarFill } from "react-icons/go";
import { useDispatch } from "react-redux";
import { addProductToCartAsync } from "../../app/slices/cartSlice";
import { Link } from "react-router-dom";
import placeholderImage from "../../assets/images/product_placeholder.webp";
import WishlistButton from "./WishlistButton";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { title, images, discountPercentage, discountedPrice, price, id } =
    product;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addProductToCartAsync(id));
  };
  if (!product) return null;
  return (
    <div
      className="relative group bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden transition duration-200"
      dir="rtl"
    >
      {discountPercentage > 0 && (
        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded z-10">
          -{discountPercentage}%
        </div>
      )}

      <div className="absolute top-3 left-3 z-10">
        <WishlistButton product={product} />
      </div>

      <Link to={`/product/${id}`} className="block">
        <div className=" flex justify-center items-center h-56 overflow-hidden">
          <img
            src={images?.[0] || placeholderImage}
            alt={title}
            loading="lazy"
            className="object-contain h-full transition-transform duration-300"
          />
        </div>

        <div className="p-4 text-left">
          <h3 className="text-gray-800 font-semibold text-sm truncate mb-1">
            {title}
          </h3>

          <div className="flex items-center text-yellow-400 text-sm mb-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <GoStarFill key={i} />
              ))}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm ${
                  discountPercentage > 0
                    ? "line-through text-red-500"
                    : "text-gray-800 font-bold"
                }`}
              >
                {price} جنيه
              </p>
              {discountPercentage > 0 && (
                <p className="text-gray-800 font-bold text-sm">
                  {discountedPrice} جنيه
                </p>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className="text-teal-600 hover:text-white hover:bg-teal-600 border-2 border-teal-500 transition-colors duration-200 rounded-full p-2 text-lg"
              aria-label="Add to cart"
            >
              <BsCartPlus />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
