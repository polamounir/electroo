import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

const Slider = ({
  children,
  slidesToShow = 1,
  slidesToScroll = 1,
  autoplay = false,
  autoplaySpeed = 3000,
  infinite = false,
  arrows = true,
  dots = false,
  responsive = [],
  className = "",
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleSlides, setVisibleSlides] = useState(slidesToShow);
  const [scrollSlides, setScrollSlides] = useState(slidesToScroll);
  const [slideWidth, setSlideWidth] = useState(0);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  const totalSlides = React.Children.count(children);

  const handleResize = () => {
    if (!containerRef.current) return;

    const width = containerRef.current.offsetWidth;
    const matched = responsive
      .slice()
      .sort((a, b) => b.breakpoint - a.breakpoint)
      .find((bp) => width <= bp.breakpoint);

    const show = matched?.settings?.slidesToShow || slidesToShow;
    const scroll = matched?.settings?.slidesToScroll || slidesToScroll;

    setVisibleSlides(Math.min(show, totalSlides));
    setScrollSlides(scroll);
    setSlideWidth(width / show);

    // Clamp currentSlide if it exceeds bounds
    const maxIndex = Math.max(0, totalSlides - show);
    setCurrentSlide((prev) => Math.min(prev, maxIndex));
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [responsive, slidesToShow, slidesToScroll, totalSlides]);

  // Clear interval when dependencies change
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (autoplay && totalSlides > visibleSlides) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => {
          if (infinite) {
            return (prev + scrollSlides) % totalSlides;
          } else {
            const maxIndex = totalSlides - visibleSlides;
            return prev + scrollSlides > maxIndex ? 0 : prev + scrollSlides;
          }
        });
      }, autoplaySpeed);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    autoplay,
    autoplaySpeed,
    totalSlides,
    visibleSlides,
    scrollSlides,
    infinite,
  ]);

  const goToSlide = (index) => {
    const maxIndex = totalSlides - visibleSlides;

    if (infinite) {
      // Handle infinite loop
      if (index < 0) {
        index = maxIndex;
      } else if (index > maxIndex) {
        index = 0;
      }
    } else {
      index = Math.max(0, Math.min(index, maxIndex));
    }

    setCurrentSlide(index);
  };

  const goToNext = () => goToSlide(currentSlide + scrollSlides);
  const goToPrev = () => goToSlide(currentSlide - scrollSlides);

  const canGoNext = infinite || currentSlide < totalSlides - visibleSlides;
  const canGoPrev = infinite || currentSlide > 0;

  const trackStyle = {
    transform: `translateX(-${currentSlide * slideWidth}px)`,
    width: `${slideWidth * totalSlides}px`,
    transition: "transform 0.3s ease-in-out",
    willChange: "transform",
    backfaceVisibility: "hidden",
  };

  // Don't render if no children
  if (!children || totalSlides === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="overflow-hidden w-full">
        <div className="flex" style={trackStyle}>
          {React.Children.map(children, (child, index) => (
            <div
              key={index}
              style={{ width: `${slideWidth}px`, minWidth: `${slideWidth}px` }}
              className="flex-shrink-0"
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {arrows && totalSlides > visibleSlides && (
        <>
          <button
            onClick={goToPrev}
            disabled={!canGoPrev}
            className={`absolute top-1/2 left-2 transform -translate-y-1/2 rounded-full p-2 shadow z-10 transition-all
              ${
                canGoPrev
                  ? "bg-white bg-opacity-70 hover:bg-opacity-100 text-gray-700 hover:text-gray-900"
                  : "bg-gray-300 text-gray-400 cursor-not-allowed"
              }`}
            aria-label="Previous slide"
          >
            <svg width="20" height="20" stroke="currentColor" fill="none">
              <path
                d="M15 19l-7-7 7-7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={goToNext}
            disabled={!canGoNext}
            className={`absolute top-1/2 right-2 transform -translate-y-1/2 rounded-full p-2 shadow z-10 transition-all
              ${
                canGoNext
                  ? "bg-white bg-opacity-70 hover:bg-opacity-100 text-gray-700 hover:text-gray-900"
                  : "bg-gray-300 text-gray-400 cursor-not-allowed"
              }`}
            aria-label="Next slide"
          >
            <svg width="20" height="20" stroke="currentColor" fill="none">
              <path
                d="M9 5l7 7-7 7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </>
      )}

      {dots && totalSlides > visibleSlides && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({
            length: Math.ceil(totalSlides / scrollSlides),
          }).map((_, i) => {
            const slideIndex = i * scrollSlides;
            const isActive =
              slideIndex === currentSlide ||
              (slideIndex < currentSlide &&
                slideIndex + scrollSlides > currentSlide);

            return (
              <button
                key={i}
                onClick={() => goToSlide(slideIndex)}
                className={`w-3 h-3 rounded-full transition-all duration-200 hover:scale-110 ${
                  isActive ? "bg-blue-500" : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide group ${i + 1}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

Slider.propTypes = {
  children: PropTypes.node.isRequired,
  slidesToShow: PropTypes.number,
  slidesToScroll: PropTypes.number,
  autoplay: PropTypes.bool,
  autoplaySpeed: PropTypes.number,
  infinite: PropTypes.bool,
  arrows: PropTypes.bool,
  dots: PropTypes.bool,
  responsive: PropTypes.arrayOf(
    PropTypes.shape({
      breakpoint: PropTypes.number.isRequired,
      settings: PropTypes.shape({
        slidesToShow: PropTypes.number,
        slidesToScroll: PropTypes.number,
      }).isRequired,
    })
  ),
  className: PropTypes.string,
};

export default Slider;
