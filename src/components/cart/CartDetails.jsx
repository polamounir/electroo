import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function CartDetails() {
  const { cart } = useSelector((state) => state.cart);
  console.log(cart);
  return (
    <div className="lg:col-span-2 p-5 flex flex-col gap-5 border border-gray-300 rounded-2xl">
      <h2 className="font-bold text-lg">تفاصيل الطلب </h2>
      <div>
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-400">عدد القطع</h2>
            <h2 className="">
           
              {cart.cartItems?.length}
            </h2>
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-gray-400">المجموع الفرعى</h2>
            <h2 className="">
           
              {cart.subTotal} ج.م
            </h2>
          </div>

      
        </div>
        <hr className="border-gray-300 my-2" />
  
      </div>

      <Link
        to="/checkout"
        className="text-center font-semibold px-5 py-2 text-white bg-teal-500 hover:bg-teal-600 rounded-full duration-300 "
      >
        Checkout
      </Link>
    </div>
  );
}
