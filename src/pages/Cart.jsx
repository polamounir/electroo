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
    <div className="min-h-[75dvh] px-2 md:p-10 lg:p-15">
      <div className="grid grid-cols-1 md:grid-cols-7 lg:grid-cols-10 gap-5">
        <div className=" col-span-1 md:col-span-4 lg:col-span-7">
          {cartItems.length === 0 ? <EmptyCart /> : <CartProductContainer />}
        </div>

        <div className=" col-span-1 md:col-span-3 lg:col-span-3">
          <CartDetails />
        </div>
      </div>
    </div>
  );
};
export default Cart;
