import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

import {
  createOrder,
  getShippingAddress,
  validateCoupon,
} from "../api/product";
import { fetchCartAsync, resetCart } from "../app/slices/cartSlice";
import { openAddressModel } from "../app/slices/addAddressModelSlice";
import AddAddressModel from "../components/ui/AddAddressModel";

// -------------------------
export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    data: addresses = [],
    isLoading: addressesLoading,
    error: addressesError,
  } = useQuery({
    queryKey: ["userAddresses"],
    queryFn: getShippingAddress,
  });

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
  });
  const [confirmedCoupon, setConfirmedCoupon] = useState("");

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

  const handlePaymentMethodChange = (event) => {
    setOrderDetail((prev) => ({
      ...prev,
      paymentMethod: event.target.value,
    }));
  };

  const handleCouponChange = (event) => {
    setCouponDetails({
      discountValue: 0,
      newDiscountedPrice: 0,
    });
    setOrderCoupon(event.target.value);
  };

  const validateOrderCoupon = async () => {
    const res = await validateCoupon({
      totalPrice: subTotal,
      code: orderCoupon,
    });

    if (res.status == "Successful") {
      setCouponDetails(res.data);
      setConfirmedCoupon(orderCoupon);
      toast.success("تم اضافة كوبون الخصم بنجاح");
    } else if (res.code === 401) {
      toast.error("يرجي تسجيل الدخول اولا");
      navigate("/login");
    } else if (res.code === 404) {
      toast.error("هذا الكوبون غير صالح");
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
      couponCode: confirmedCoupon,
    };
    return updatedOrder;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedOrder = await reformOrder();

    console.log(updatedOrder);

    if (updatedOrder.address === "" || !updatedOrder.address) {
      return toast.error("برجاء اضافة عنوان");
    }
    try {
      const res = await createOrder(updatedOrder);

      console.log(res);

      if (res.code === 200) {
        toast.success("جاي تنفيذ الطلب");
        if (res.paymentLink !== "") {
          setTimeout(() => {
            window.location.href = res.paymentLink;
          }, 2000);
          return;
        } else {
          navigate("/checkout-success");
          dispatch(resetCart());
        }
      }
      if (res.code === 401) {
        toast.error("يرجي تسجيل الدخول اولا ");
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

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const sectionVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.6,
      },
    },
  };

  const cardVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, x: -20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const summaryVariants = {
    initial: { opacity: 0, x: 30 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: 0.3,
      },
    },
  };

  console.log(orderDetail);
  return (
    <motion.div
      className="min-h-[75dvh] pb-50 pt-20"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <AnimatePresence>
        {isModelOpen && (
          <div className={`${!isModelOpen && "animate-fadeOut"}`}>
            <AddAddressModel />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {cartItems?.length === 0 && (
          <motion.div
            key="empty-cart"
            className="flex flex-col gap-5 justify-center items-center h-[60dvh] pb-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              transition: { duration: 0.3 },
            }}
          >
            <motion.h2
              className="font-bold text-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 0.2 },
              }}
            >
              عربة التسوق فارغة
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 0.4 },
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/"
                className="px-5 py-2 font-bold bg-teal-500 text-white rounded-md"
              >
                ابدأ
              </Link>
            </motion.div>
          </motion.div>
        )}

        {cartItems?.length > 0 && (
          <motion.div
            key="checkout-content"
            className="p-2 pt-5 md:p-10 xl:px-40 flex flex-col gap-5"
            variants={sectionVariants}
          >
            <motion.h2 className="font-bold text-xl" variants={sectionVariants}>
              تفاصيل الطلب
            </motion.h2>

            <motion.div
              className="grid grid-cols-1 lg:grid-cols-6 gap-10 items-start"
              variants={sectionVariants}
            >
              <motion.div
                className="lg:col-span-4 flex flex-col gap-5 text-xs md:text-sm lg:text-md"
                variants={sectionVariants}
              >
                {/* Address Section */}
                <motion.div
                  className="border border-gray-300 rounded-2xl"
                  variants={cardVariants}
                  whileHover={{
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    transition: { duration: 0.3 },
                  }}
                >
                  <div className="p-5 flex justify-between items-center">
                    <h2 className="font-semibold text-lg">عنوان التوصيل</h2>
                    <motion.button
                      className="px-3 py-1 font-bold"
                      onClick={openAddAddressModal}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      إضافة
                    </motion.button>
                  </div>
                  <hr className="border-gray-300" />
                  <div className="text-md p-5 flex flex-col gap-2">
                    <AnimatePresence mode="wait">
                      {addressesLoading && (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <h2>جاري تحميل العناوين</h2>
                        </motion.div>
                      )}
                      {addressesError && (
                        <motion.div
                          key="error"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <h2>حدث خطأ اثناء تحميل العناوين</h2>
                        </motion.div>
                      )}
                      {addresses && addresses.length > 0 && (
                        <motion.div
                          key="addresses"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {addresses.map((option, index) => (
                            <motion.label
                              key={index}
                              className="p-3 flex w-full items-center rounded-lg border border-gray-200 cursor-pointer hover:bg-slate-200 has-[:checked]:border-teal-500 has-[:checked]:text-teal-900 has-[:checked]:bg-teal-50 has-[:checked]:font-bold"
                              variants={itemVariants}
                              initial="initial"
                              animate="animate"
                              transition={{ delay: index * 0.1 }}
                              whileHover={{
                                scale: 1.02,
                                transition: { duration: 0.2 },
                              }}
                            >
                              <div className="relative z-10">
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
                                  (addresses?.length >= 1 && index === 0) ||
                                  orderDetail?.address === option.id
                                }
                                onChange={handleAddressChange}
                              />
                            </motion.label>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Products Section */}
                <motion.div
                  className="border border-gray-300 rounded-2xl"
                  variants={cardVariants}
                  whileHover={{
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    transition: { duration: 0.3 },
                  }}
                >
                  <div className="p-5 flex justify-between items-center">
                    <h2 className="font-semibold text-lg">المنتاجات</h2>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link to="/cart" className="px-3 py-1 font-bold">
                        تعديل
                      </Link>
                    </motion.div>
                  </div>
                  <hr className="border-gray-300" />
                  <div className="text-md p-5 flex flex-col gap-3">
                    {cartItems?.map((item, index) => (
                      <motion.div
                        key={item.id}
                        className="flex items-center gap-5"
                        variants={itemVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: index * 0.1 }}
                        whileHover={{
                          x: 5,
                          transition: { duration: 0.2 },
                        }}
                      >
                        <div className="flex justify-center bg-red self-center min-w-15 max-w-15 md:min-w-20 md:max-w-20 h-20">
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="object-contain"
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
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Payment Methods Section */}
                <motion.div
                  className="border border-gray-300 rounded-2xl"
                  variants={cardVariants}
                  whileHover={{
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    transition: { duration: 0.3 },
                  }}
                >
                  <div className="p-5 flex justify-between items-center">
                    <h2 className="font-semibold text-lg">طرق الدفع</h2>
                  </div>
                  <hr className="border-gray-300" />
                  <div className="text-md p-5 text-black flex flex-col gap-3">
                    {paymentMethods?.map((option, index) => (
                      <motion.label
                        key={option.id}
                        className="p-3 flex justify- w-full items-center rounded-lg border border-transparent cursor-pointer hover:bg-slate-200 has-[:checked]:border-teal-500 has-[:checked]:text-teal-900 has-[:checked]:bg-teal-50 has-[:checked]:font-bold"
                        variants={itemVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: index * 0.1 }}
                        whileHover={{
                          scale: 1.02,
                          transition: { duration: 0.2 },
                        }}
                      >
                        <div className="relative z-10 inline-flex items-center flex-col justify-center gap-2 w-full">
                          <p className="inset-0 w-full text-start">
                            {option.name === "Online" && "دفع اونلاين"}
                          </p>
                          <p className="inset-0 w-full text-start">
                            {option.name === "Cash" && "الدفع عند الاسلام"}
                          </p>
                        </div>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={option.name}
                          className="hidden"
                          checked={orderDetail.paymentMethod === option.name}
                          onChange={handlePaymentMethodChange}
                        />
                      </motion.label>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
              {/* ----------------------------------------------------- */}
              {/* Order Summary */}
              <motion.div
                className="lg:col-span-2 p-10 flex flex-col gap-5 border border-gray-300 rounded-2xl"
                variants={summaryVariants}
                whileHover={{
                  boxShadow: "0 15px 35px -5px rgba(0, 0, 0, 0.1)",
                  transition: { duration: 0.3 },
                }}
              >
                <h2 className="font-bold text-lg">ملخص الطلب</h2>
                <div>
                  <div className="flex flex-col gap-1">
                    <motion.div
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <h2 className="text-gray-400">عدد القطع</h2>
                      <h2 className="">{cartItems?.length}</h2>
                    </motion.div>
                    <motion.div
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h2 className="text-gray-400">المجموع الفرعى</h2>
                      <h2 className="">{subTotal - shippingPrice} ج.م</h2>
                    </motion.div>
                    <AnimatePresence>
                      {couponDetails.discountValue > 0 && (
                        <motion.div
                          className="flex items-center justify-between"
                          initial={{ opacity: 0, x: 20, height: 0 }}
                          animate={{
                            opacity: 1,
                            x: 0,
                            height: "auto",
                            transition: {
                              type: "spring",
                              stiffness: 100,
                              damping: 15,
                            },
                          }}
                          exit={{
                            opacity: 0,
                            x: -20,
                            height: 0,
                            transition: { duration: 0.3 },
                          }}
                        >
                          <h2 className="text-gray-400">خصم الكوبون</h2>
                          <h2 className="text-red-500">
                            {couponDetails.discountValue} ج.م
                          </h2>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <hr className="border-gray-300 my-2" />
                  <motion.div
                    className="font-bold flex items-center justify-between"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      transition: { delay: 0.3 },
                    }}
                  >
                    <h2 className="">الاجمالي</h2>
                    <h2 className="">
                      {couponDetails.newDiscountedPrice > 0
                        ? couponDetails.newDiscountedPrice
                        : subTotal}{" "}
                      ج.م
                    </h2>
                  </motion.div>
                </div>
                <motion.div
                  className="flex justify-between gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.4 },
                  }}
                >
                  <input
                    type="text"
                    className="flex-1 px-5 py-2 rounded-full border border-gray-300 outline-none max-w-[70%] sm:max-w-[100%] text-sm focus:border-teal-500 duration-300 w-full"
                    placeholder="🔖🏷️ اضف كوبون"
                    onChange={handleCouponChange}
                  />
                  <motion.button
                    className="block bg-black text-white px-5 py-2 rounded-full"
                    onClick={validateOrderCoupon}
                    whileHover={{
                      scale: 1.01,
                      backgroundColor: "#374151",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    تطبيق
                  </motion.button>
                </motion.div>
                <motion.button
                  className="text-center justify-center font-semibold px-5 py-2 text-white bg-teal-500 hover:bg-teal-600 rounded-full duration-300"
                  onClick={handleSubmit}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.5 },
                  }}
                  whileHover={{
                    scale: 1.01,
                    backgroundColor: "#0d9488",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  تاكيد الطلب
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
