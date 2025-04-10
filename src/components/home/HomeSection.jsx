import React from "react";
import Slider from "react-slick";
import ProductCard from "../ui/ProductCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

export default function DailyDeals({ title }) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
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
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div>
      <div className="py-20 text-center text-3xl md:text-5xl font-semibold">
        <h2>{title}</h2>
      </div>

      <div className="w-full bg-gray-200 py-20">
        <div className="w-full lg:w-[85%] m-auto shadow-none">
          {/* {products.length > 0 ? (
            <Slider
              {...settings}
              aria-label="Daily Deals Carousel"
              className="shadow-none"
            >
              {products.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </Slider>
            ) : (
              <p className="text-center text-gray-500 text-lg">
              No deals available right now.
              </p>
              )} */}
          <div className="slider-container">
            <Slider
              {...settings}
              aria-label="Daily Deals Carousel"
              className="shadow-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((product, index) => (
                <div key={index} className="px-1 sm:px-5 slide-item">
                  <ProductCard key={index} product={product} />
                </div>
              ))}
            </Slider>
          </div>
        </div>
        <div className="flex justify-center mt-5 show-more-box">
          <Link
            to=""
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
