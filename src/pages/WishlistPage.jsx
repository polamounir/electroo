import React, { useEffect, useState } from "react";
import ProductCard from "../components/ui/ProductCard";
import { motion, AnimatePresence } from "framer-motion";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);

  const loadWishlist = () => {
    const items = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlistItems(items);
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "wishlist") {
        loadWishlist();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const current = JSON.stringify(wishlistItems);
      const latest = localStorage.getItem("wishlist");

      if (latest && current !== latest) {
        loadWishlist();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [wishlistItems]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8 min-h-svh pt-25 pb-20"
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-3xl font-bold mb-8 text-teal-500 border-b-2 border-teal-500 pb-2"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        تصنيفات المنتجات
      </motion.h1>

      <AnimatePresence>
        {wishlistItems.length === 0 ? (
          <motion.div
            key="empty"
            className="text-center text-gray-500 py-20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            لا توجد منتجات في قائمة المفضلة.
          </motion.div>
        ) : (
          <motion.div
            key="list"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <AnimatePresence>
              {wishlistItems.map((product) => (
                <motion.div
                  key={product.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
