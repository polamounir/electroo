import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { closeCartMenu, deleteProductAsync } from "../../app/slices/cartSlice";

export default function CartDropdownMenu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, subTotal } = useSelector((state) => state.cart.cart);

  const closeCartDropmenu = () => {
    dispatch(closeCartMenu());
    navigate("/cart");
  };

  
    const deleteProduct = (id) => {
      dispatch(deleteProductAsync(id));
    };

  return (
    <div className="absolute end-0 top-full w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-4">
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
        <h3 className="font-medium text-gray-900">عربيتك</h3>
        <span className="text-sm text-gray-500">
          {cartItems?.length} {cartItems.length === 1 ? "منتج" : "منتجات"}
        </span>
      </div>

      {cartItems.length > 0 ? (
        <>
          <div className="max-h-60 overflow-y-auto scrolling pe-2">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex mb-3 pb-3 border-b border-gray-50 last:border-0"
              >
                <Link
                  to={`/product/${item.id}`}
                  className="flex w-full hover:bg-gray-50 rounded p-1 transition"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-14 h-14 object-contain mr-3 rounded border border-gray-100"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-900">
                        {item.title}
                      </span>
                      <span className="text-sm font-medium">
                        ج.م
                        {(
                          (item.discountedPrice || item.price) * item.quantity
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {item.discountedPrice ? (
                        <>
                          <span className="text-xs line-through text-gray-400">
                            ج.م{item.price.toFixed(2)}
                          </span>
                          <span className="text-xs bg-green-100 text-green-600 px-1 rounded">
                            خصم {item.discountPercentage}%
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-gray-500">
                          ج.م{item.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-400">
                        الكمية: {item.quantity}
                      </span>
                      <button
                        className="text-xs text-red-500 hover:text-red-700"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          deleteProduct(item.id)
                        }}
                      >
                        إزالة
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex justify-between mb-3 text-black">
              <span className="font-medium">الإجمالي:</span>
              <span className="font-medium">ج.م {subTotal}</span>
            </div>
            <button
              onClick={closeCartDropmenu}
              className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-md transition-colors flex justify-center"
            >
              عرض الكل
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-5 text-gray-500">
          العربية فاضية دلوقتي
        </div>
      )}
    </div>
  );
}
