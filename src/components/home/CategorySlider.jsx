import { useQuery } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { api } from "../../api/axiosInstance";
import Slider from "react-slick";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function CategorySlider() {
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories?Page=1&Limit=20");
      return res.data;
    },
  });
  //   console.log(data);
  const categories = data?.data?.items;

  const settings = {
    dots: false,
    // infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    centerPadding: "0px",
    centerMode: true,
    // lazyLoad: "ondemand",
    autoplay: true,
    autoplaySpeed: 200000,
    pauseOnHover: true,
    accessibility: true,
    arrows: false,
    focusOnSelect: false,
    focusOnChange: true,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        },
      },

      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
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

  const goToNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const goToPrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const [categoryName, setCategoryName] = useState("");
  const [categoryIndex, setCategoryIndex] = useState(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState(true);

  const handleTooltipVisible = (index, name) => {
    setCategoryName(name);
    setCategoryIndex(index);
    setIsTooltipVisible(true);
    // console.log(name, index);
  };
  const handleResetTooltip = () => {
    setIsTooltipVisible(false);
    setCategoryName("");
    setCategoryIndex(null);
    // console.log("reset");
  };
  const handleCategoryClick = (id) => {
    // console.log(id);
    navigate(`/categories/${id}`);
  };

  const demoCategories = [
    { id: 1, name: "Category 1", image: "https://via.placeholder.com/150" },
    { id: 2, name: "Category 2", image: "https://via.placeholder.com/150" },
    { id: 3, name: "Category 3", image: "https://via.placeholder.com/150" },
    { id: 4, name: "Category 4", image: "https://via.placeholder.com/150" },
    { id: 5, name: "Category 5", image: "https://via.placeholder.com/150" },
    { id: 6, name: "Category 6", image: "https://via.placeholder.com/150" },
    { id: 7, name: "Category 7", image: "https://via.placeholder.com/150" },
    { id: 8, name: "Category 8", image: "https://via.placeholder.com/150" },
    { id: 9, name: "Category 9", image: "https://via.placeholder.com/150" },
    { id: 10, name: "Category 10", image: "https://via.placeholder.com/150" },
  ];

  return (
    <div className="category-slider-container py-5">
      <h1 className="text-3xl lg:text-4xl text-center title mt-10">الفئات</h1>
      <div className="w-full lg:w-[90%] m-auto ">
        <Slider ref={sliderRef} {...settings} className=" pt-5 max-h-[350px]">
          {categories &&
            categories?.length > 0 &&
            categories?.map((category, index) => (
              <div
                key={category.id}
                className="px-15 sm:px-10 lg:px-0 xl:px-10 pt-10 md:pt-15 "
                role="button"
                aria-label={`View ${category.name} category`}
              >
                <div
                  // mx => out space
                  className="inner-slider-container category  relative"
                  onMouseEnter={() =>
                    handleTooltipVisible(index, category.name)
                  }
                  onMouseLeave={handleResetTooltip}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div
                    className={`tooltip absolute z-10 -top-5 left-2/3 -translate-x-1/2 bg-gray-300 rounded-tl-full rounded-tr-full rounded-br-full  p-2 px-5 text-black shadow-lg shadow-teal-100 ${
                      isTooltipVisible && categoryIndex === index
                        ? "visible"
                        : "hidden"
                    }`}
                    aria-hidden={!(isTooltipVisible && categoryIndex === index)}
                  >
                    <h2 className="text-xs font-bold text-nowrap">
                      {categoryName}
                    </h2>
                  </div>
                  <div className="slide-content flex justify-center items-center flex-col">
                    <div className="md:w-[80%] ">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          {(isLoading || !categories) &&
            demoCategories.map((category, index) => (
              <div
                key={category.id}
                className="p-10 pt-20"
                role="button"
                aria-label={`View ${category.name} category`}
              >
                <div
                  className="inner-slider-container p-10 mx-10 sm:mx-0 relative"
                  onMouseEnter={() =>
                    handleTooltipVisible(index, category.name)
                  }
                  onMouseLeave={handleResetTooltip}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div
                    className={`tooltip absolute z-10 -top-1 left-2/3 -translate-x-1/2 bg-gray-300 rounded-tl-full rounded-tr-full rounded-br-full  p-2 px-5 text-black ${
                      isTooltipVisible && categoryIndex === index
                        ? "visible"
                        : "hidden"
                    }`}
                    aria-hidden={!(isTooltipVisible && categoryIndex === index)}
                  >
                    <h2 className="text-xs font-bold text-nowrap">
                      {category.name}
                    </h2>
                  </div>
                  <div className="flex justify-center items-center flex-col">
                    <div className="w-[80%] mt-5 h-[50px]"></div>
                  </div>
                </div>
              </div>
            ))}
        </Slider>

        <div className="flex justify-center items-center gap-4 mt-5">
          <button
            onClick={goToPrev}
            className="text-2xl p-2 hover:bg-gray-100 rounded-full border border-gray-300"
            aria-label="Previous categories"
          >
            <IoArrowForward />
          </button>
          <button
            onClick={goToNext}
            className="text-2xl p-2 hover:bg-gray-100 rounded-full border border-gray-300"
            aria-label="Next categories"
          >
            <IoArrowBack />
          </button>
        </div>
      </div>
    </div>
  );
}
