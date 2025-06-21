import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import CartProduct from "./CartProduct";

export default function CartProductContainer() {
  const { cartItems } = useSelector((state) => state.cart.cart);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // 100ms between each child animation
        delayChildren: 0.1, // Small delay before starting
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div>
      <motion.div
        className="flex flex-col gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {cartItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              layout
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              // whileTap={{ scale: 0.98 }}
            >
              <CartProduct item={item} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
