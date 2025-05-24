import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import imagePlaceholder from "../../assets/images/product_placeholder.webp";
import { BsCartPlus } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { addProductToCartAsync } from "../../app/slices/cartSlice";

function ProductCard({ product, isRowView }) {
  const dispatch = useDispatch();

  const addToCart = (id) => {

    dispatch(addProductToCartAsync(id));
  };


  return (
    <Link
      to={`/product/${product.id}`}
      className={`p-4 rounded hover:shadow-sm duration-300 transition-all bg-white ${
        isRowView ? "flex flex-col sm:flex-row gap-4" : ""
      }`}
    >
      <img
        src={product.images?.[0] || imagePlaceholder}
        alt={product.title || "Product image"}
        className={`rounded-xl object-contain  ${
          isRowView ? "w-full sm:w-48 h-48 me-2" : "w-full aspect-square"
        }`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = imagePlaceholder;
        }}
      />
      <div className="flex-1 text-xs ">
        <h3 className="font-semibold truncate">{product.title}</h3>
        {/* <p className="text-gray-600 text-sm mb-2">{product.description}</p> */}
        {product.discountPercentage > 0 ? (
          <div className="flex items-center gap-2 my-1">
            <p className="text-teal-600 font-bold ">
              {product.discountedPrice} ج.م
            </p>
            <p className="text-red-700 font-bold line-through">
              {product.price} ج.م
            </p>
          </div>
        ) : (
          <p className="text-teal-600 font-bold ">{product.price} ج.م</p>
        )}
        {/* <p className="text-teal-600 font-bold"> {product.price} ج.م</p> */}
        <p className="text-gray-600">{product.supplierName}</p>
        <div className="flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              addToCart(product.id);
            }}
            className="text-teal-500 text-lg border-2 border-teal-500 rounded-full p-2"
          >
            <BsCartPlus />
          </button>
        </div>
      </div>
    </Link>
  );
}

export default function SearchProductsContainer({ products }) {
  const [isRowView, setIsRowView] = useState(false);

  const toggleView = () => {
    setIsRowView(!isRowView);
  };

  return (
    <div className="px-4 py-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleView}
          className="px-3 py-1 border rounded text-sm text-gray-700 hover:bg-gray-100"
        >
          تغيير العرض {isRowView ? "صورة" : "قائمة"}
        </button>
      </div>
      
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
            No products found.
          </div>
        )}
      </div>
    </div>
  );
}
