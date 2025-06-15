import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { closeSpinModel } from "../../app/slices/chatSlice";
import { useDispatch } from "react-redux";

const SpinningWheelModel = ({
  options = [
    {
      option: "خصم 10% على طلبك القادم!",
      color: "#FF6B6B",
      textColor: "#FFFFFF",
    },
    {
      option: "كابل شحن مجاني مع كل طلب!",
      color: "#4ECDC4",
      textColor: "#FFFFFF",
    },
    {
      option: "شحن مجاني لأي طلب اليوم!",
      color: "#45B7D1",
      textColor: "#FFFFFF",
    },
    {
      option: "خصم 15% على قطع التبديل!",
      color: "#96CEB4",
      textColor: "#1B1B1B",
    },
    {
      option: "هدية مفاجأة في طلبك القادم!",
      color: "#FFEAA7",
      textColor: "#1B1B1B",
    },
    {
      option: "احصل على خصم 20 جنيه!",
      color: "#DDA0DD",
      textColor: "#1B1B1B",
    },
    {
      option: "خصم 5% على جميع المنتجات!",
      color: "#98D8C8",
      textColor: "#1B1B1B",
    },
    {
      option: "لا توجد جائزة – حظاً أوفر!",
      color: "#F7DC6F",
      textColor: "#1B1B1B",
    },
  ],
  title = "عجلة الحظ",
  spinButtonText = "لف الان",
  waitingText = "انتظر ...",
  isOpended=false,
}) => {
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(200);

  useEffect(() => {
    const updateDimensions = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // Calculate dimensions based on screen size
      let newWidth = Math.min(400, screenWidth * 0.6);
      let newHeight = Math.min(200, screenHeight * 0.6);

      if (screenWidth > 400) {
        newHeight = Math.min(250, screenHeight * 0.6);
      }
      if (screenWidth > 600) {
        newHeight = Math.min(400, screenHeight * 0.6);
      }

      // Ensure wheel is square for proper circular appearance
      const size = Math.min(newWidth, newHeight);
      setWidth(size);
      setHeight(size);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const dispatch = useDispatch();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState("");
  const [segments] = useState(options.slice(0, 10)); 
  const [hasSpun, setHasSpun] = useState(false); 
  const wheelRef = useRef(null);
  const [tooltip, setTooltip] = useState({ show: false, text: "", x: 0, y: 0 });
  const [showResult, setShowResult] = useState(false);

  const spin = () => {
    if (isSpinning || segments.length === 0 || hasSpun) return;

    setIsSpinning(true);
    setHasSpun(true); 
    setResult("");
    setShowResult(false);
    setTooltip({ ...tooltip, show: false });

    
    const spins = Math.random() * 4 + 4; 
    const finalAngle = Math.random() * 360;
    const totalRotation = rotation + spins * 360 + finalAngle;

    setRotation(totalRotation);

    const segmentAngle = 360 / segments.length;

    setTimeout(() => {

      const finalAngleNormalized = totalRotation % 360;
      const pointerAngle = (360 - finalAngleNormalized) % 360;
      const segmentIndex =
        Math.floor(pointerAngle / segmentAngle) % segments.length;

      setIsSpinning(false);
      setResult(segments[segmentIndex].option);
      setShowResult(true);
    }, 3000);
  };

  const handleMouseEnter = (segment, e) => {
    if (isSpinning) return;

    const rect = wheelRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    setTooltip({
      show: true,
      text: segment,
      x: centerX,
      y: centerY,
    });
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, show: false }));
  };

  const segmentAngle = 360 / (segments.length || 1);
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 10;

  const handleCloseModal = () => {
    dispatch(closeSpinModel());
    setShowResult(false);
  };

  const handleResetResult = () => {
    setShowResult(false);
    setResult("");

  };

  return (
    <div
      className={`h-screen ${
        isOpended ? "flex" : "hidden"
      }  flex-col items-center justify-center p-4 fixed top-0 w-full overflow-hidden z-[1000] bg-black/30`}
      onMouseMove={(e) =>
        tooltip.show &&
        setTooltip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }))
      }
    >
      {/* Tooltip */}
      {tooltip.show && (
        <div
          className="fixed z-50 px-3 py-2 bg-gray-900 text-white text-sm rounded-md pointer-events-none shadow-lg max-w-xs break-words"
          style={{
            left: `${Math.min(tooltip.x + 15, window.innerWidth - 200)}px`,
            top: `${Math.min(tooltip.y + 15, window.innerHeight - 100)}px`,
          }}
        >
          {tooltip.text}
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-lg rounded-3xl py-5 shadow-2xl border border-white/20 w-full max-w-2xl">
        <button
          onClick={handleCloseModal}
          className="absolute top-3 left-3 text-black font-bold hover:text-teal-700 transition text-2xl"
          aria-label="Close"
        >
          ✕
        </button>
        <h1 className="text-4xl font-bold text-black text-center mb-8">
          {title}
        </h1>

        {/* Wheel Container */}
        <div className="relative flex flex-col items-center mb-8 justify-center">
          {/* Pointer */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
            <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[30px] border-l-transparent border-r-transparent border-t-red-500 drop-shadow-lg"></div>
          </div>

          {/* Wheel */}
          <div
            className="relative"
            style={{ width: `${width}px`, height: `${height}px` }}
          >
            <svg
              ref={wheelRef}
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-full drop-shadow-2xl transition-transform duration-[3000ms] ease-out"
              style={{ transform: `rotate(${rotation}deg)` }}
              aria-label="Spinning wheel"
            >
              {/* Outer ring */}
              <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke="#03C0C1"
                strokeWidth="10"
              />

              {/* Segments */}
              {segments.map((segment, index) => {
                const startAngle = index * segmentAngle - 90;
                const endAngle = (index + 1) * segmentAngle - 90;
                const largeArcFlag = segmentAngle > 180 ? 1 : 0;

                const x1 =
                  centerX + radius * Math.cos((startAngle * Math.PI) / 180);
                const y1 =
                  centerY + radius * Math.sin((startAngle * Math.PI) / 180);
                const x2 =
                  centerX + radius * Math.cos((endAngle * Math.PI) / 180);
                const y2 =
                  centerY + radius * Math.sin((endAngle * Math.PI) / 180);

                const textAngle = startAngle + segmentAngle / 2;
                const textX =
                  centerX +
                  radius * 0.7 * Math.cos((textAngle * Math.PI) / 180);
                const textY =
                  centerY +
                  radius * 0.7 * Math.sin((textAngle * Math.PI) / 180);

                return (
                  <g
                    key={index}
                    onMouseEnter={(e) => handleMouseEnter(segment.option, e)}
                    onMouseLeave={handleMouseLeave}
                    aria-label={`Segment: ${segment.option}`}
                
                  >
                    <path
                      d={`M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                      fill={segment.color}
                      stroke="white"
                      strokeWidth="2"
                      className={`transition-all duration-200 ${
                        isSpinning ? "" : "cursor-pointer hover:brightness-110"
                      }`}
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill={segment.textColor || "white"}
                      fontSize={Math.max(8, radius / 15)}
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                      className="pointer-events-none select-none drop-shadow-sm"
                    >
                      {segment.option.length > 12
                        ? segment.option.substring(0, 10) + "..."
                        : segment.option}
                    </text>
                  </g>
                );
              })}

              {/* Center circle */}
              <circle
                cx={centerX}
                cy={centerY}
                r={radius / 6}
                fill="#FFD700"
                stroke="white"
                strokeWidth="3"
              />
              <circle cx={centerX} cy={centerY} r={radius / 10} fill="white" />
            </svg>
          </div>

          {/* Spin Button */}
          <button
            onClick={spin}
            disabled={isSpinning || segments.length === 0 || hasSpun}
            className={`mt-6 px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 transform ${
              isSpinning || segments.length === 0 || hasSpun
                ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                : "bg-teal-600 text-white hover:bg-teal-700 active:scale-95 shadow-lg hover:shadow-xl"
            }`}
            aria-label="Spin the wheel"
          >
            {isSpinning
              ? waitingText
              : hasSpun
              ? "تم الانتهاء"
              : spinButtonText}
          </button>
        </div>
      </div>

      {/* Result Modal */}
      {showResult && result && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 modal-bg bg-black/50"
          onClick={(e) =>
            e.target.classList.contains("modal-bg") && handleResetResult()
          }
        >
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-white/20 relative max-w-md w-full mx-4">
            <button
              onClick={handleResetResult}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition text-2xl"
              aria-label="Close result"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">النتيجة</h2>
            <div className="text-center bg-teal-100 text-teal-800 px-6 py-4 rounded-lg text-lg font-bold mb-6">
              {result}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCloseModal}
                className="w-full py-3 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition"
              >
                اغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

SpinningWheelModel.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      option: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      textColor: PropTypes.string,
    })
  ),
  title: PropTypes.string,
  spinButtonText: PropTypes.string,
  waitingText: PropTypes.string,
};

export default SpinningWheelModel;
