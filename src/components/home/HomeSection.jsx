import React from "react";
import Slider from "react-slick";
import ProductCard from "../ui/ProductCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import ProductCardSkeleton from "../ui/ProductCardSkeleton";

export default function HomeSection({ title, products, loading, error, more }) {
  // console.log(products);
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    // centerPadding: "50px",
    // centerMode: true,

    lazyLoad: "ondemand",
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    accessibility: true,
    arrows: false,
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
          // initialSlide: 2,
        },
      },

      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          // initialSlide: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          // initialSlide: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          // initialSlide: 2,
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

  return (
    <div>
      <div className="py-15 text-center text-3xl md:text-5xl ">
        <h2 className="title text-2xl lg:text-4xl">{title}</h2>
      </div>

      <div className="w-full bg-[#fafafa] py-15">
        <div className="w-full lg:w-[85%] m-auto shadow-none">
          <div className="slider-container">
            {products?.data?.items.length === 0 && (
              <div className="text-center text-2xl py-10">لا توجد منتجات</div>
            )}
            {loading && (
              <Slider
                {...settings}
                aria-label={"products placeholder slider"}
                className="shadow-none"
              >
                {[1, 2, 3, 4, 5].map((product, index) => (
                  <div key={index} className="px-1 sm:px-5 slide-item">
                    <ProductCardSkeleton />
                  </div>
                ))}
              </Slider>
            )}

            {error && (
              <div className="text-center text-2xl py-10">
                حدث خطأ ما, حاول مرة اخرى
              </div>
            )}

            <Slider
              {...settings}
              aria-label={title || "products slider"}
              className="shadow-none"
            >
              {products?.data?.items.map((product, index) => (
                <div key={index} className="px-1 slide-item">
                  <ProductCard key={index} product={product} />
                </div>
              ))}
            </Slider>
          </div>
        </div>
        <div className="flex justify-center mt-5 show-more-box">
          <Link
            to={`${more}`}
            className="bg-white px-20 py-2 rounded-full border border-gray-400 "
          >
            المزيد
            <span>
              <IoArrowBack />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
