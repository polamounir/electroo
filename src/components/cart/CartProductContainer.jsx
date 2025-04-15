import { useSelector } from "react-redux";
import CartProduct from "./CartProduct";

export default function CartProductContainer() {
  const { cartItems } = useSelector((state) => state.cart.cart);
  return (
    <div>
      <div className="flex flex-col gap-3 ">
        {cartItems.map((item) => (
          <CartProduct key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
