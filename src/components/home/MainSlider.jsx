import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../assets/styles/home.css";
import { IoSearch } from "react-icons/io5";
import { RiMenuSearchLine } from "react-icons/ri";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
  getSearchResults,
  setSearchParams,
} from "../../app/slices/searchSlice";

export default function MainSlider() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const user = useSelector((state) => state.auth.user);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 10000,
    arrows: false,
  };

  const slides = [
    {
      className: "bg-[url('/seedream-image.jpeg')] bg-img-bottom",
      // "https://i.imghippo.com/files/UHC8864xgs.jpeg"
    },
    {
      className: "bg-[url('https://i.postimg.cc/v8WjP74v/slide2.webp')]",
    },

    {
      className:
        "bg-[url('https://img.freepik.com/premium-photo/circuit-board-with-variety-electronic-components-including-chips-resistors-capacitors-connectors-arranged-symmetrical-pattern_319816-8530.jpg?w=1380')]",
    },
    {
      className:
        "bg-[url('https://img.freepik.com/premium-photo/abstract-flat-lay-composition-with-various-electronic-components-microchips-circuits-dark-background_319816-4768.jpg?w=1380')]",
    },
  ];

  useEffect(() => {
    const clonedSlides = document.querySelectorAll(".slick-slide");
    clonedSlides.forEach((slide) => {
      slide.setAttribute("aria-hidden", "true");
      slide
        .querySelectorAll("a, button, input, select, textarea")
        .forEach((el) => {
          el.setAttribute("tabindex", "-1");
        });
    });
  }, []);

  const handleSearch = () => {
    dispatch(setSearchParams({ SearchQuery: search }));
    dispatch(
      getSearchResults({
        SearchQuery: search,
        Page: 1,
        Limit: 10,
        MinimumPrice: 0,
        MaximumPrice: 10000,
        HasDiscount: false,
        SortBy: "price-low-high",
        ViewMode: "grid",
      })
    );
    navigate(`/searching?SearchQuery=${search}`);
  };

  const handleSearchInput = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchEnter = (e) => {
    if (e.key === "Enter" || e.code === "Enter" || e.keyCode === 13) {
      handleSearch();
    }
  };

  return (
    <main className="bg-slate-200 w-full overflow-hidden">
      <div className="mx-auto w-full">
        <Slider {...settings}>
          {slides.map((slide) => (
            <div
              key={slide.title}
              className={`flex justify-center items-center min-h-[550px] lg:h-[75svh] text-white shadow-lg bg-cover bg-right ${slide.className} `}
            >
              <div className="main-slider-content relative w-full min-h-[550px] lg:h-[75svh]  bg-black/50">
                {/* <div className={`main-slider-text ${slide.textPostion} w-[80%] lg:w-[500px] mx-auto  static lg:absolute`}>
                                    <div className="mt-20 lg:mt-0 flex flex-col items-center text-center lg:items-start lg:text-start gap-5 ">
                                        <h2 className="text-3xl lg:text-5xl">{slide.title}</h2>
                                        <p> {slide.desc}</p>
                                        <button className="" aria-label="view more button"><Link to="" className="px-10 py-3 font-semibold rounded duration-500">View Details</Link></button>
                                    </div>
                                </div> */}
                <div
                  className="p-5 md:p-15 py-15 flex flex-col gap-5 lg:gap-20"
                  dir="rtl"
                >
                  <div className="self-center pt-20">
                    <div className="w-xs sm:w-sm md:w-md relative">
                      <input
                        type="text"
                        placeholder="بحث ..."
                        className="bg-[var(--color-light-gray)] px-5 pe-20 py-2 rounded-full border border-gray-300 text-black  focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] w-full "
                        value={search}
                        onChange={handleSearchInput}
                        onKeyDown={handleSearchEnter}
                      />
                      <button
                        onClick={handleSearch}
                        className="absolute top-0 bottom-0 end-0 w-15 text-3xl flex justify-center items-center"
                      >
                        <div className="search-icon-container rounded-full flex justify-center items-center relative text-gray-500">
                          <div
                            className={`absolute text-3xl flex justify-center items-center search-icon ${
                              search ? "" : "active"
                            }`}
                          >
                            <IoSearch />
                          </div>
                          <div
                            className={`absolute text-3xl flex justify-center items-center search-icon text-teal-600 ${
                              search ? "active" : ""
                            }`}
                          >
                            <RiMenuSearchLine />
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                  <div className="w-full h-full flex justify-center flex-col gap-10 lg:gap-20 md:max-w-lg lg:ps-20 lg:ms-60  ">
                    <div className="text-center md:text-start">
                      <h1 className="ar-font-s text-xl md:text-4xl text-white welcome-header">
                        مرحباً بكم في متجرنا
                      </h1>
                      <div className="flex flex-col gap-2 items-center lg:items-start text-white text-lg font-semibold mt-5 welcome-message-text">
                        <p className="welcome-message-line1">
                          نحن مستعدون لتقديم لكم افضل المنتجات الالكترونية
                        </p>
                        <p className="welcome-message-line2">
                          بأرخص الاسعار مع توفير قطع غيار موثوقة و مضمونة
                        </p>
                        <p className="welcome-message-line3">
                          و خدمة الشحن المجاني
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-5 justify-center md:justify-start welcome-buttons-box">
                      <Link
                        to=""
                        className="bg-black px-7 py-2 rounded-lg md:text-lg  text-white font-semibold"
                      >
                        ابدأ التسوق
                      </Link>
                      {!user && (
                        <Link
                          to="/login"
                          className="bg-white px-7 py-2 rounded-lg md:text-lg text-[var(--color-primary)] font-semibold"
                        >
                          تسجيل الدخول
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </main>
  );
}
