import React from "react";
import { motion } from "framer-motion";
import { BsCartPlus } from "react-icons/bs";
import { IoArrowBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import NewProductCard from "../ui/NewProductCard";

export default function NewHomeSection({
  title,
  products,
  loading,
  error,
  more,
}) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const titleVariants = {
    hidden: {
      opacity: 0,
      y: -50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const productGridVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const productCardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.7,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const showMoreVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        delay: 0.3,
      },
    },
  };

  const errorVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      {/* Title Section */}
      <motion.div
        className="py-15 text-center text-3xl md:text-5xl"
        variants={titleVariants}
      >
        <motion.h2
          className="title text-2xl lg:text-4xl"
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.2 },
          }}
        >
          {title}
        </motion.h2>
      </motion.div>

      {/* Main Content Section */}
      <motion.div
        className="w-full bg-[#fafafa] py-15"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="w-full lg:w-[100%] m-auto shadow-none">
          <div className="slider-container">
            {/* No Products Message */}
            {products === 0 && (
              <motion.div
                className="text-center text-2xl py-10"
                variants={errorVariants}
              >
                لا توجد منتجات
              </motion.div>
            )}

            {/* Products Grid */}
            {!loading && (
              <motion.div
                aria-label={"products placeholder slider"}
                className="flex justify-center flex-wrap items-start gap-4 p-2 lg:px-20 mt-10"
                variants={productGridVariants}
              >
                {products?.data?.items &&
                  products.data.items.length > 0 &&
                  products.data.items.map((product, index) => (
                    <motion.div
                      key={index}
                      variants={productCardVariants}
                      whileHover={{
                        y: -10,
                        scale: 1.02,
                        transition: { duration: 0.3 },
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <NewProductCard product={product} />
                    </motion.div>
                  ))}
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                className="text-center text-2xl py-10"
                variants={errorVariants}
              >
                حدث خطأ ما, حاول مرة اخرى
              </motion.div>
            )}
          </div>
        </div>

        {/* Show More Button */}
        <motion.div
          className="flex justify-center mt-5 show-more-box"
          variants={showMoreVariants}
        >
          <Link
            to={`${more}`}
            className="bg-white px-20 py-2 rounded-full border border-gray-400"
          >
            <motion.div
              className="flex items-center gap-2"
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              المزيد
              <motion.span
                whileHover={{ x: -5 }}
                transition={{ duration: 0.2 }}
              >
                <IoArrowBack />
              </motion.span>
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
