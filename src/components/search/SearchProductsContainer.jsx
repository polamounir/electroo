import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import imagePlaceholder from "../../assets/images/product_placeholder.webp";
import { BsCartPlus } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { addProductToCartAsync } from "../../app/slices/cartSlice";

function ProductCard({ product, isRowView }) {
  const dispatch = useDispatch();

  const addToCart = (id) => {
    // console.log(id);
    dispatch(addProductToCartAsync(id));
  };

  // console.log(product);
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
          e.target.src = "/fallback.jpg";
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
  const [columns, setColumns] = useState(3);
  const [isRowView, setIsRowView] = useState(false);
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  // Update screen width on resize
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial value
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const maxCols = maxColumnsAllowed();
    if (columns > maxCols) {
      setColumns(maxCols);
    }

    if (screenWidth < 640) {
      setIsRowView(true);
    } else {
      setIsRowView(false);
    }
  }, [screenWidth, columns]);

  const maxColumnsAllowed = () => {
    if (screenWidth < 640) return 1;
    if (screenWidth < 768) return 2;
    if (screenWidth < 1024) return 3;
    return 5;
  };

  // const handleColumnChange = (num) => {
  //   setIsRowView(false);
  //   setColumns(num);
  // };

  // const gridColsClass = () => {
  //   if (isRowView) return "grid-cols-1";
  //   switch (columns) {
  //     case 1:
  //       return "grid-cols-1 sm:grid-cols-1";
  //     case 2:
  //       return "grid-cols-1 sm:grid-cols-2";
  //     case 3:
  //       return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
  //     case 4:
  //       return "grid-cols-1 sm:grid-cols-2 md:grid-cols-4";
  //     case 5:
  //       return "grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5";
  //     default:
  //       return "grid-cols-1";
  //   }
  // };

  return (
    <div className="px-4 py-6">
      {/* Layout Buttons */}
      {/* {screenWidth >= 640 && (
        <div className="flex flex-wrap gap-2 mb-6 items-center">
          {[1, 2, 3, 4, 5]
            .filter((num) => num <= maxColumnsAllowed()) // Now including 5 as a valid option
            .map((num) => (
              <button
                key={num}
                onClick={() => handleColumnChange(num)}
                className={`px-4 py-2 border rounded transition ${
                  columns === num && !isRowView
                    ? "bg-teal-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {num} Col{num > 1 ? "s" : ""}
              </button>
            ))}
          <button
            onClick={() => setIsRowView(true)}
            className={`px-4 py-2 border rounded transition ${
              isRowView
                ? "bg-teal-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Row View
          </button>
        </div>
      )} */}

      {/* Product Grid */}
      {/* <div className={`grid gap-4 ${gridColsClass()}`}> */}
      <div
        className={`grid gap-4  grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`}
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
