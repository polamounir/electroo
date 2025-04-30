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
    <div className="w-full relative flex justify-between gap-5 items-center border border-gray-300 shadow p-2 rounded-lg mx-auto">
      <button
        onClick={() => deleteProduct(item.id)}
        className="absolute top-2 start-2 text-gray-500 hover:text-red-500 duration-300"
      >
        <FaTrash />
      </button>
      <div className="min-w-25 sm:w-100 h-32 mx-auto sm:mx-0">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-contain rounded-lg"
        />
      </div>

      <div className="grow grid grid-cols-1 lg:grid-cols-2 gap-2">
        <div className="font-semibold text-gray-800 truncate">{item.title}</div>

        <div className="flex flex-col gap-2 lg:flex-row justify-between">
          <div className="text-gray-700">{item.price} ج.م</div>
          <div className="text-gray-700 font-medium">
            {item.quantity * item.price} ج.م
          </div>

          <div className="flex items-end">
            <button
              className="flex justify-center items-center bg-red-600 text-white w-7 h-7 px-2 py-1 rounded-md"
              onClick={decrementQuantity}
            >
              -
            </button>
            <input
              type="number"
              value={item.quantity}
              onChange={changeQuantity}
              className="w-10 text-center no-arrows"
              min="1"
            />
            <button
              className="flex justify-center items-center bg-teal-500 text-white w-7 h-7 px-2 py-1 rounded-md"
              onClick={() => addToCart(item.id)}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
