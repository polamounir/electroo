import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
// import { createOrder, fetchDeliveryMethods, getShippingAddress, validateCoupon } from "../api/products"
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
// import { openAddressModel } from "@/app/features/slices/addAddressModelSlice"
// import AddAddressModel from "@/components/checkout/AddAddressModel"
import {
  createOrder,
  //   fetchDeliveryMethods,
  getShippingAddress,
  validateCoupon,
} from "../api/product";
import { fetchCartAsync } from "../app/slices/cartSlice";
import { openAddressModel } from "../app/slices/addAddressModelSlice";
import AddAddressModel from "../components/ui/AddAddressModel";

// -------------------------
export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //   const { data: deliveryMethods } = useQuery({
  //     queryKey: ["DeliveryMethods"],
  //     queryFn: fetchDeliveryMethods,
  //   });
  //   console.log(deliveryMethods)
  const {
    data: addresses = [],
    isLoading: addressesLoading,
    error: addressesError,
  } = useQuery({
    queryKey: ["userAddresses"],
    queryFn: getShippingAddress,
  });
  // console.log(addresses)
  // -------------------------

  const [orderCoupon, setOrderCoupon] = useState("");
  const [couponDetails, setCouponDetails] = useState({
    discountValue: 0,
    newDiscountedPrice: 0,
  });
  const [orderDetail, setOrderDetail] = useState({
    cartId: "",
    couponCode: "",
    address: "",
    paymentMethod: "Online",
    // deliveryMethod: "9d9e0d7e-a9a8-4d2a-c907-08dd6f6fbed6",
  });

  useEffect(() => {
    dispatch(fetchCartAsync());
  }, [dispatch]);
  const {
    cartItems,
    subTotal,
    shippingPrice,
    // id: cartId,
  } = useSelector((state) => state.cart.cart);

  const handleAddressChange = (e) => {
    setOrderDetail({ ...orderDetail, address: e.target.value });
  };

  //   const handleDeliveryMethodChange = (event) => {
  //     setOrderDetail((prev) => ({
  //       ...prev,
  //       deliveryMethod: event.target.value,
  //     }));
  //   };
  const handlePaymentMethodChange = (event) => {
    setOrderDetail((prev) => ({
      ...prev,
      paymentMethod: event.target.value,
    }));
    // console.log(orderDetail)
  };

  const handleCouponChange = (event) => {
    setCouponDetails({
      discountValue: 0,
      newDiscountedPrice: 0,
    });
    setOrderCoupon(event.target.value);
    // console.log(orderCoupon)
  };

  const validateOrderCoupon = async () => {
    const res = await validateCoupon({
      totalPrice: subTotal,
      code: orderCoupon,
    });

    if (res.status == "Successful") {
      setCouponDetails(res.data);
      toast.success("Coupon applied successfully!");
    } else if (res.code === 401) {
      toast.error(res.message);
      navigate("/login");
    } else {
      toast.error(res.message);
    }
  };

  // ------------------------------------------
  const reformOrder = async () => {
    let address = orderDetail.address;
    if (address === "" && addresses?.length > 0) {
      address = addresses[0].id;
    }
    const updatedOrder = {
      ...orderDetail,
      cartId: localStorage.getItem("cartId"),
      address: address,
    };
    return updatedOrder;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedOrder = await reformOrder();

    try {
      const res = await createOrder(updatedOrder);

      console.log(res);
      if (res.code === 200) {
        toast.success("Order is being process/ed.");
        setTimeout(() => {
          window.location.href = res.paymentLink;
        }, 2000);
        return;
      }
      if (res.code === 401) {
        toast.error("Please login first!");
        navigate("/login");
      } else {
        // toast.error(res.message);
      }
    } catch (error) {
      console.error("Error during order creation:", error);
      // toast.error("An error occurred while creating the order.");
    }
  };

  const paymentMethods = [
    { id: "1", name: "Online", description: "Secure payment processing" },
    { id: "2", name: "Cash", description: "Secure payment processing" },
  ];

  // ------------------
  const isModelOpen = useSelector((state) => state.addressModel.isOpen);
  const openAddAddressModal = () => {
    dispatch(openAddressModel());
  };

  //   const handleShippingPrice = (e) => {
  //    dispatch(setShippingPrice(e));
  //   }
  return (
    <div className="min-h-[75dvh] pb-50">
      {isModelOpen && <AddAddressModel />}
      {cartItems?.length === 0 && (
        <div className="flex flex-col gap-5 justify-center items-center h-[60dvh] pb-20">
          <h2 className="font-bold text-3xl">Your Cart is Empty</h2>
          <Link
            to="/"
            className="px-5 py-2 font-bold bg-teal-500 text-white rounded-md"
          >
            Go to Shop
          </Link>
        </div>
      )}
      {cartItems?.length > 0 && (
        <div className="p-2 pt-5 md:p-10 xl:px-40 flex flex-col gap-5">
          <h2 className="font-bold text-xl">تفاصيل الطلب</h2>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start ">
            <div className="lg:col-span-3 flex flex-col gap-5 text-xs md:text-sm lg:text-md">
              <div className="border border-gray-300 rounded-2xl">
                <div className="p-5 flex justify-between items-center">
                  <h2 className="font-semibold text-lg">عنوان التوصيل</h2>
                  <button
                    className="px-3 py-1 font-bold "
                    onClick={openAddAddressModal}
                  >
                    إضافة
                  </button>
                </div>
                <hr className="border-gray-300" />
                <div className="text-md p-5 flex flex-col gap-2">
                  {addressesLoading && (
                    <div>
                      <h2>جاري تحميل العناوين</h2>{" "}
                    </div>
                  )}
                  {addressesError && (
                    <div>
                      <h2> حدث خطأ اثناء تحميل العناوين</h2>{" "}
                    </div>
                  )}
                  {addresses &&
                    addresses.length > 0 &&
                    addresses.map((option, index) => (
                      <label
                        key={index}
                        className=" p-3 flex  w-full items-center rounded-lg border border-gray-200 cursor-pointer hover:bg-slate-200 has-[:checked]:border-teal-500 has-[:checked]:text-teal-900 has-[:checked]:bg-teal-50 has-[:checked]:font-bold "
                      >
                        <div className="relative z-10 ">
                          <div className="flex flex-col gap-2 w-full">
                            <h2>
                              {option.firstName} {option.lastName}
                            </h2>
                            <div>
                              <h2>عنوان</h2>
                              <h2>{option.street}</h2>
                              <h2>{option.city}</h2>
                              <h2>{option.governorate}</h2>
                            </div>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="address"
                          value={option.id}
                          className="hidden"
                          checked={
                            (addresses.length === 1 && index === 0) ||
                            orderDetail.address === option.id
                          }
                          onChange={handleAddressChange}
                        />
                      </label>
                    ))}
                </div>
              </div>
              <div className="border border-gray-300 rounded-2xl">
                <div className="p-5 flex justify-between items-center">
                  <h2 className="font-semibold text-lg">المنتاجات</h2>
                  <Link to="/cart" className="px-3 py-1 font-bold ">
                    تعديل
                  </Link>
                </div>
                <hr className="border-gray-300" />
                <div className="text-md p-5 flex flex-col gap-3">
                  {cartItems?.map((item) => (
                    <div key={item.id} className="flex items-center gap-5 ">
                      <div className="flex justify-center bg-red self-center min-w-15 max-w-15 md:min-w-20 md:max-w-20 h-20">
                        <img
                          src={item.imageUrl}
                          alt=""
                          className=" object-contain"
                        />
                      </div>
                      <div className="grow">
                        <h2 className="">{item.title}</h2>
                        <h2 className="">{item.price} ج.م</h2>
                        <h2 className="font-semibold flex gap-1">
                          <span>{item.quantity}</span> x{" "}
                          <span>{item.price}</span>={" "}
                          <span>{item.quantity * item.price} ج.م</span>
                        </h2>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border border-gray-300 rounded-2xl">
                <div className="p-5 flex justify-between items-center">
                  <h2 className="font-semibold text-lg">طرق الدفع</h2>
                </div>
                <hr className="border-gray-300" />
                <div className="text-md p-5 text-black flex flex-col gap-3">
                  {paymentMethods?.map((option) => (
                    <label
                      key={option.id}
                      className=" p-3 flex justify- w-full items-center rounded-lg border border-transparent cursor-pointer hover:bg-slate-200 has-[:checked]:border-teal-500 has-[:checked]:text-teal-900 has-[:checked]:bg-teal-50 has-[:checked]:font-bold"
                    >
                      <div className="relative z-10 inline-flex items-center justify-center gap-2 w-full">
                        <p className=" inset-0 w-full ">{option.name}</p>
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={option.name}
                        className="hidden"
                        checked={orderDetail.paymentMethod === option.name}
                        onChange={handlePaymentMethodChange}
                      />
                    </label>
                  ))}
                </div>
              </div>
              {/* <div className="border border-gray-300 rounded-2xl">
                <div className="p-5 flex justify-between items-center">
                  <h2 className="font-semibold text-lg">طرق الشحن</h2>
                </div>
                <hr className="border-gray-300" />
                <div className="text-md p-5 text-black flex flex-col gap-3">
                  {deliveryMethods?.map((option) => (
                    <label
                      key={option.id}
                      className=" p-3 flex justify- w-full items-center rounded-lg border border-transparent cursor-pointer hover:bg-slate-200 has-[:checked]:border-teal-500 has-[:checked]:text-teal-900 has-[:checked]:bg-teal-50 has-[:checked]:font-bold"
                    >
                      <div className="relative z-10 inline-flex items-center justify-center gap-2 w-full">
                        <p className=" inset-0 w-full ">{option.name}</p>
                      </div>
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value={option.id}
                        className="hidden"
                        checked={orderDetail.deliveryMethod === option.id}
                        onChange={()=> {
                            handleDeliveryMethodChange
                            handleShippingPrice(option.price)}}
                      />
                    </label>
                  ))}
                </div>
              </div> */}
            </div>
            <div className="lg:col-span-2 p-10 flex flex-col gap-5 border border-gray-300 rounded-2xl">
              <h2 className="font-bold text-lg">ملخص الطلب </h2>
              <div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-gray-400">عدد القطع</h2>
                    <h2 className="">{cartItems?.length}</h2>
                  </div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-gray-400">المجموع الفرعى</h2>
                    <h2 className="">{subTotal - shippingPrice} ج.م</h2>
                  </div>
                  {/* <div className="flex items-center justify-between">
                    <h2 className="text-gray-400">رسوم التوصيل</h2>
                    <h2 className=""> 30 ج.م</h2>
                  </div> */}
                  {couponDetails.discountValue > 0 && (
                    <div className="flex items-center justify-between">
                      <h2 className="text-gray-400">Coupon Discount</h2>
                      <h2 className="text-red-500">
                        {" "}
                        {couponDetails.discountValue} ج.م
                      </h2>
                    </div>
                  )}
                </div>
                <hr className="border-gray-300 my-2" />
                <div className="font-bold flex items-center justify-between">
                  <h2 className="">الاجمالي</h2>
                  <h2 className="">
                    {couponDetails.newDiscountedPrice > 0
                      ? couponDetails.newDiscountedPrice
                      : subTotal}{" "}
                    ج.م
                  </h2>
                </div>
              </div>
              <div className="flex justify-between gap-3">
                <input
                  type="text"
                  className="flex-1 px-5 py-2 rounded-full border border-gray-300 outline-none max-w-[70%] sm:max-w-[100%] text-sm focus:border-teal-500 duration-300 w-full"
                  placeholder="🔖🏷️ اضف كوبون"
                  onChange={handleCouponChange}
                />
                <button
                  className="block bg-black text-white px-5 py-2 rounded-full"
                  onClick={validateOrderCoupon}
                >
                  تطبيق
                </button>
              </div>
              <button
                className="text-center font-semibold px-5 py-2 text-white bg-teal-500 hover:bg-teal-600 rounded-full duration-300"
                onClick={handleSubmit}
              >
                تاكيد الطلب
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
