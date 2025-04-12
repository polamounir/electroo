import { useState } from "react";

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "اسم المنتج",
      brand: "تفاصيل المنتج",
      price: 45.54,
      quantity: 1,
    },
  ]);
  // increase qyantity
  const increaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };
  //decrease quantity
  const decreaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };
  //delete product
  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };
  //delete cart
  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = 0;
  const total = subtotal + shipping;
  return (
    <>
      {/* mainContent */}
      <div
        className="min-h-screen bg-gray-100 flex  flex-col items-center"
        dir="rtl"
      >
        <h2 className="text-xl font-semibold my-4 flex justify-end">
          عربة التسوق
        </h2>
        <div className="main-content flex flex-col md:flex-row w-full max-w-6xl mt-8 px-4 gap-6 relative">
          <div className="bg-white rounded-lg shadow-md p-6 flex-1">
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center">عربة التسوق فارغه</p>
            ) : (
              <>
                <div className=" hidden md:grid md:grid-cols-4 gap-4 p-3 text-gray-600 font-bold  bg-fuchsia-50 rounded-md">
                  <div className="mr-10">المنتج</div>
                  <div className="mr-10">السعر</div>
                  <div className="mr-10">الكميه</div>
                  <div className="mr-10">الاجمالي</div>
                </div>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="grid md:grid-cols-4 grid-cols-2 justify-between gap-20 items-center py-4 border-b relative shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row  items-center space-x-4 space-x-reverse">
                      <img
                        src="150×150.png"
                        alt=""
                        className="object-contain md:w-20 md:h-20 w-25 h-25"
                      />
                      <div className="flex flex-col my-auto mr-2">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.brand}</p>
                      </div>
                    </div>
                    <div className="font-semibold mr-5">${item.price}</div>
                    <div className="flex justify-between  border rounded p-1 w-33 mr-3">
                      <span
                        className="border-l px-2 cursor-pointer"
                        onClick={() => decreaseQuantity(item.id)}
                      >
                        -
                      </span>
                      <span>{item.quantity}</span>
                      <span
                        className="border-r px-2 cursor-pointer"
                        onClick={() => increaseQuantity(item.id)}
                      >
                        +
                      </span>
                    </div>
                    <div className="font-semibold">
                      ${item.price * item.quantity}
                    </div>
                    <button onClick={() => removeItem(item.id)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-x-icon lucide-x absolute left-0 top-0 cursor-pointer"
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <div className="flex lg:flex-row flex-col justify-between items-center mt-6">
                  <div className="flex lg:flex-row flex-col items-center space-x-2 space-x-reverse">
                    <input
                      type="text"
                      placeholder="كود الخصم"
                      className="border rounded-lg px-3 py-1 focus:outline-none focus:ring-2-teal-500 ml-1"
                    />
                    <button className="bg-teal-500 text-white px-4 py-1 rounded-lg hover:bg-teal-600 lg:my-0 my-3 ">
                      تطبيق الخصم
                    </button>
                  </div>
                  <button
                    className="text-gray-600 hover:text-red-500"
                    onClick={() => clearCart()}
                  >
                    مسح عربة التسوق
                  </button>
                </div>
              </>
            )}
          </div>
          {/* order summary */}
          <div className="bg-fuchsia-50 rounded-lg shadow-md p-6 w-full md:w-80 max-h-96 ">
            <h2 className="text-xl font-bold mb-4">ملخص الطلب</h2>
            <div className="flex flex-col border-b pb-3">
              <span>طريقة الدفع:</span>
              <div className="flex space-x-2 space-x-reverse mr-8 mt-2">
                <label className="flex items-center">
                  <input type="radio" name="Payment" className="ml-1" />
                  <span>PayPal</span>
                </label>
              </div>
            </div>
            <div className="flex justify-between pt-3">
              <span>المجموع الفرعي</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>الشحن</span>
              <span>${shipping}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg  ">
              <span>الاجمالي</span>
              <span>${total}</span>
            </div>
            <button className="w-full bg-teal-500 text-white py-2 rounded-lg mt-4 hover:bg-teal-600">
              إتمام الشراء
            </button>
            <button className="w-full border border-teal-500 text-teal-500 py-2 rounded-lg mt-2 hover:bg-teal-50 ">
              متابعة التسوق
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Cart;
