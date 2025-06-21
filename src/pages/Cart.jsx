import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.4 },
    },
  };

  const titleVariants = {
    initial: { opacity: 0, scale: 0.8, y: -30 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      },
    },
  };

  const gridVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const columnVariants = {
    initial: { opacity: 0, x: -30 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
        duration: 0.6,
      },
    },
  };

  const sidebarVariants = {
    initial: { opacity: 0, x: 30 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
        duration: 0.6,
      },
    },
  };

  return (
    <motion.div
      className="min-h-[75dvh] py-15 px-2 md:p-10 lg:p-15 lg:w-[90%] mx-auto"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div className="pb-20 pt-20">
        <motion.h2
          className="text-3xl font-bold title py-5 text-center bg-teal-600 text-white rounded-3xl mb-10 shadow-xl"
          variants={titleVariants}
        >
          السلــــــــة
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-7 xl:grid-cols-10 gap-5"
          variants={gridVariants}
        >
          <motion.div
            className="col-span-1 lg:col-span-4 xl:col-span-8"
            variants={columnVariants}
          >
            <AnimatePresence mode="wait">
              {cartItems.length === 0 ? (
                <motion.div
                  key="empty-cart"
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
                  <EmptyCart />
                </motion.div>
              ) : (
                <motion.div
                  key="cart-products"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      stiffness: 100,
                      damping: 15,
                      delay: 0.1,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    y: -20,
                    transition: { duration: 0.3 },
                  }}
                >
                  <CartProductContainer />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            className="col-span-1 lg:col-span-3 xl:col-span-2"
            variants={sidebarVariants}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 0.4, duration: 0.6 },
              }}
            >
              <CartDetails />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Cart;
