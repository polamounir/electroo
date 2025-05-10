import React from "react";
import { useDispatch } from "react-redux";
import {
  addProductToCartAsync,
  changeProductQuantityAsync,
  decreaseProductQuantityAsync,
  deleteProductAsync,
} from "../../app/slices/cartSlice";
import { FaTrash } from "react-icons/fa";

export default function CartProduct({ item }) {
  const dispatch = useDispatch();

  const addToCart = (id) => {
    dispatch(addProductToCartAsync(id));
  };

  const changeQuantity = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      dispatch(
        changeProductQuantityAsync({
          productId: item.id,
          quantity: newQuantity,
        })
      );
    }
  };

  const decrementQuantity = () => {
    dispatch(
      decreaseProductQuantityAsync({
        productId: item.id,
        quantity: item.quantity - 1,
      })
    );
  };

  const deleteProduct = (id) => {
    dispatch(deleteProductAsync(id));
  };

  return (
    <div className="w-full flex justify-between gap-5 items-center border border-gray-300 p-2 rounded-2xl mx-auto shadow-md">
      <div className="min-w-25 sm:max-w-50 sm:min-w-50 h-32 mx-auto sm:mx-0">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-contain rounded-lg"
        />
      </div>

      <div className=" grow grid grid-cols-1 lg:grid-cols-11 xl:grid-cols-12 gap-5 xl:gap-10 text-sm">
        <div className="lg:col-span-11 xl:col-span-7 font-semibold text-gray-800 truncate">
          {item.title}
        </div>

        <div className="lg:col-span-11 xl:col-span-5 flex flex-col gap-2 lg:flex-row justify-between xl:pe-5 items-start lg:items-center">
          <div className="text-gray-700">
            <span className="lg:hidden">السعر : </span>
            {item.price} ج.م
          </div>
          <div className="flex items-end rounded-full overflow-hidden border border-gray-400">
            <button
              className="flex justify-center items-center border-e border-gray-400 w-7 h-7 px-2 py-1"
              onClick={() => addToCart(item.id)}
            >
              +
            </button>

            <input
              type="number"
              value={item.quantity}
              onChange={changeQuantity}
              className="w-10 text-center no-arrows"
              min="1"
            />
            <button
              className="flex justify-center items-center border-s border-gray-400 w-7 h-7 px-2 py-1"
              onClick={decrementQuantity}
            >
              -
            </button>
          </div>
          <div className="text-gray-700 font-medium">
            <span className="lg:hidden">الاجمالي : </span>
            {item.quantity * item.price} ج.م
          </div>
          <div>
            <button
              onClick={() => deleteProduct(item.id)}
              className="text-gray-500 hover:text-red-500 duration-300"
            >
              <FaTrash />
            </button>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
