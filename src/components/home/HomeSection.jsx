import React, { useRef } from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import ProductCard from "../ui/ProductCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import {
  IoArrowBack,
  IoArrowForward,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";
import ProductCardSkeleton from "../ui/ProductCardSkeleton";

export default function HomeSection({
  title,
  products = [],
  loading,
  error,
  more,
}) {
  const sliderRef = useRef(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
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
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const sliderContainerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
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
        duration: 0.6,
        ease: "easeOut",
        delay: 0.4,
      },
    },
  };

  const errorVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const arrowVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: 0.6,
      },
    },
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    lazyLoad: "ondemand",
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    accessibility: true,
    arrows: false, // Keep this false since we're using custom arrows
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
          infinite: true,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  const goToPrevious = () => {
    sliderRef.current?.slickPrev();
  };

  const goToNext = () => {
    sliderRef.current?.slickNext();
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
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="w-full lg:w-[85%] m-auto shadow-none relative">
          {/* Custom Arrow Buttons */}
          {!loading && !error && products.length > 0 && (
            <>
              {/* Previous Arrow */}
              <motion.button
                className="absolute left-1 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors duration-200 border border-gray-200"
                onClick={goToPrevious}
                variants={arrowVariants}
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                }}
                whileTap={{ scale: 0.9 }}
                aria-label="Previous products"
              >
                <IoChevronBack className="text-xl text-gray-600" />
              </motion.button>

              {/* Next Arrow */}
              <motion.button
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors duration-200 border border-gray-200"
                onClick={goToNext}
                variants={arrowVariants}
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                }}
                whileTap={{ scale: 0.9 }}
                aria-label="Next products"
              >
                <IoChevronForward className="text-xl text-gray-600" />
              </motion.button>
            </>
          )}

          <motion.div
            className="slider-container"
            variants={sliderContainerVariants}
          >
            {/* No Products Message */}
            {products?.data?.items.length === 0 && (
              <motion.div
                className="text-center text-2xl py-10"
                variants={errorVariants}
              >
                لا توجد منتجات
              </motion.div>
            )}

            {/* Loading Skeleton Slider */}
            {loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Slider
                  {...settings}
                  aria-label={"products placeholder slider"}
                  className="shadow-none"
                >
                  {[1, 2, 3, 4, 5].map((product, index) => (
                    <motion.div
                      key={index}
                      className="px-1 sm:px-5 slide-item"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.1,
                        ease: "easeOut",
                      }}
                    >
                      <ProductCardSkeleton />
                    </motion.div>
                  ))}
                </Slider>
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

            {/* Products Slider */}
            {!loading && !error && products.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Slider
                  ref={sliderRef}
                  {...settings}
                  aria-label={title || "products slider"}
                  className="shadow-none"
                >
                  {products.map((product, index) => (
                    <motion.div
                      key={index}
                      className="px-1 slide-item"
                      whileHover={{
                        scale: 1.02,
                        y: -5,
                        transition: { duration: 0.3 },
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ProductCard key={index} product={product} />
                    </motion.div>
                  ))}
                </Slider>
              </motion.div>
            )}
          </motion.div>
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
                whileHover={{
                  x: -5,
                  transition: { duration: 0.2 },
                }}
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
