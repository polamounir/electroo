import { BsCartPlus } from "react-icons/bs";
import { GoStarFill } from "react-icons/go";
import { useDispatch } from "react-redux";
import { addProductToCartAsync } from "../../app/slices/cartSlice";
import { Link } from "react-router-dom";
export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { title, images, discountPercentage, discountedPrice, price, id } =
    product;

  const addToCart = (id) => {
    console.log(id);
    dispatch(addProductToCartAsync(id));
  };

  return (
    <div>
      <div to={`/product/${id}`}>
        <div className="relative bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center">
          {discountPercentage > 0 && (
            <div className="absolute top-4 end-4 bg-red-500 text-white text-sm px-2 py-1 rounded">
              {discountPercentage} %
            </div>
          )}

          <div className="flex justify-center items-center min-h-60">
            <div className="w-full h-full overflow-hidden rounded-lg flex justify-center ">
              <img
                src={images[0]}
                alt={title}
                className="h-full aspect-square"
                width={100}
                height={100}
              />
            </div>
          </div>

          <div className="text-gray-700 text-sm mb-2 truncate">
            {/* ساعات رجالية الأعمال ساعة معصم فاخرة حزام من الجلد.... */}
            {title}
          </div>
          <div className="text-yellow-400 mb-2 flex ">
            <GoStarFill />
            <GoStarFill />
            <GoStarFill />
            <GoStarFill />
            <GoStarFill />
          </div>
          <div className="flex justify-between gap-3 ">
            <div>
              {/* <div className="text-gray-500 line-through text-sm">EGP 95.00</div> */}
              <div
                className={`text-gray-800 text-lg font-bold ${
                  discountPercentage > 0 && "line-through text-red-500"
                }`}
              >
                {" "}
                {price} جنيه
              </div>
              {discountPercentage > 0 && (
                <div className={`text-gray-800 text-lg font-bold `}>
                  {discountedPrice} جنيه
                </div>
              )}
            </div>
            <div className="flex ">
              <button
                onClick={() => {
                  addToCart(id);
                }}
                className="mt-4  text-teal-500 text-2xl border-2 border-teal-500 rounded-full p-2"
              >
                <BsCartPlus />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
