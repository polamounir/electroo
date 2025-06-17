import { useEffect } from "react";
import EmptyCart from "../components/cart/EmptyCart";
import CartProductContainer from "../components/cart/CartProductContainer";
import CartDetails from "../components/cart/CartDetails";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartAsync } from "../app/slices/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCartAsync());
  }, [dispatch]);
  const { cartItems } = useSelector((state) => state.cart.cart);
  return (
    <div className="min-h-[75dvh] py-15 px-2 md:p-10 lg:p-15 lg:w-[90%] mx-auto ">
      <div className="pb-20 pt-20">
        <h2 className="text-3xl font-bold title py-5 text-center bg-teal-600 text-white rounded-3xl mb-10 shadow-xl">
          السلــــــــة
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-7 xl:grid-cols-10 gap-5">
          <div className=" col-span-1 lg:col-span-4 xl:col-span-8">
            {cartItems.length === 0 ? <EmptyCart /> : <CartProductContainer />}
          </div>

          <div className=" col-span-1 lg:col-span-3 xl:col-span-2">
            <CartDetails />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Cart;
