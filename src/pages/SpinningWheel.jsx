import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

const SpinningWheel = ({
  options = [
    {
      option: "Option 1 text  text  text  text ",
      color: "#FF6B6B",
      textColor: "#FFFFFF",
    },
    {
      option: "Option 2 text  text  text  text ",
      color: "#4ECDC4",
      textColor: "#FFFFFF",
    },
    {
      option: "Option 3 text  text  text  text ",
      color: "#45B7D1",
      textColor: "#FFFFFF",
    },
    {
      option: "Option 4 text  text  text  text ",
      color: "#96CEB4",
      textColor: "#1B1B1B",
    },
    {
      option: "Option 5 text  text  text  text ",
      color: "#FFEAA7",
      textColor: "#1B1B1B",
    },
    {
      option: "Option 6 text  text  text  text ",
      color: "#DDA0DD",
      textColor: "#1B1B1B",
    },
    {
      option: "Option 7 text  text  text  text ",
      color: "#98D8C8",
      textColor: "#1B1B1B",
    },
    {
      option: "Option 8 text  text  text  text ",
      color: "#F7DC6F",
      textColor: "#1B1B1B",
    },
  ],
  title = "عجلة الحظ",
  spinButtonText = "لف الان",
  waitingText = "انتظر ...",
}) => {
  const [width, setWidth] = useState(250);
  const [height, setHeight] = useState(250);
  useEffect(() => {
    const updateDimensions = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      setWidth(Math.min(400, screenWidth * 0.6));
      setHeight(Math.min(200, screenHeight * 0.6));

      if (screenWidth > 400) {
        setHeight(Math.min(250, screenHeight * 0.6));
      }
      if (screenWidth > 600) {
        setHeight(Math.min(400, screenHeight * 0.6));
      }
    };

    updateDimensions();

    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState("");
  const [segments, setSegments] = useState(options.slice(0, 10));
  const [newSegment, setNewSegment] = useState("");
  const [newColor, setNewColor] = useState("#FF6B6B");
  const wheelRef = useRef(null);
  const [tooltip, setTooltip] = useState({ show: false, text: "", x: 0, y: 0 });
  const [showResult, setShowResult] = useState(false);

  const spin = () => {
    if (isSpinning || segments.length === 0) return;

    setIsSpinning(true);
    setResult("");
    setTooltip({ ...tooltip, show: false });

    const spins = Math.random() * 3 + 3;
    const finalAngle = Math.random() * 360;
    const totalRotation = rotation + spins * 360 + finalAngle;

    setRotation(totalRotation);

    const segmentAngle = 360 / segments.length;
    const normalizedAngle = (360 - (totalRotation % 360)) % 360;
    const winningIndex = Math.floor(normalizedAngle / segmentAngle);

    setTimeout(() => {
      setIsSpinning(false);
      setResult(segments[winningIndex].option);
      setShowResult(true);
    }, 3000);
  };

  const handleMouseEnter = (segment, e) => {
    if (isSpinning) return;

    const rect = e.target.getBoundingClientRect();
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

  //   const addSegment = () => {
  //     if (newSegment.trim() && segments.length < 10) {
  //       setSegments([
  //         ...segments,
  //         { option: newSegment.trim(), color: newColor },
  //       ]);
  //       setNewSegment("");
  //       setNewColor("#FF6B6B");
  //     }
  //   };

  //   const removeSegment = (index) => {
  //     setSegments(segments.filter((_, i) => i !== index));
  //   };

  const segmentAngle = 360 / (segments.length || 1);
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 10;

  return (
    <div
      className="min-h-[90svh] flex flex-col items-center justify-center p-4 relative overflow-hidden"
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

      <div className="bg-white/10 backdrop-blur-lg rounded-3xl py-5 shadow-2xl border border-white/20 w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-black text-center mb-8">
          {title}
        </h1>

        {/* Wheel Container */}
        <div className="relative flex flex-col items-center mb-8 justify-between ">
          {/* Pointer */}

          {/* Wheel */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
            <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[30px] border-l-transparent border-r-transparent border-t-red-500 drop-shadow-lg"></div>
          </div>
          <div className="relative" style={{ width: `${width}px` }}>
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
                    tabIndex="0"
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
                      fontSize={radius / 15}
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
            disabled={isSpinning || segments.length === 0}
            className={`mt-6 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform ${
              isSpinning || segments.length === 0
                ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-yellow-400 to-pink-500 text-white hover:from-yellow-500 hover:to-pink-600 active:scale-95 shadow-lg hover:shadow-xl"
            }`}
            aria-label="Spin the wheel"
          >
            {isSpinning ? waitingText : spinButtonText}
          </button>
        </div>
      </div>

      {/* Result Modal */}
      {showResult && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 modal-bg bg-black/50"
          onClick={(e) =>
            e.target.classList.contains("modal-bg") && setShowResult(false)
          }
        >
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-white/20 relative max-w-md w-full mx-4">
            <button
              onClick={() => setShowResult(false)}
              className="absolute top-3 left-3 text-teal-500 hover:text-teal-700 transition text-2xl"
              aria-label="Close"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">النتيجة</h2>
            <div className="text-center bg-teal-100 text-teal-800 px-6 py-4 rounded-full text-xl font-bold mb-4">
              {result}
            </div>
            <button
              onClick={() => setShowResult(false)}
              className="w-full py-3 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition flex justify-center items-center"
            >
              اغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// SpinningWheel.propTypes = {
//   width: PropTypes.number,
//   height: PropTypes.number,
//   options: PropTypes.arrayOf(
//     PropTypes.shape({
//       option: PropTypes.string.isRequired,
//       color: PropTypes.string.isRequired,
//       textColor: PropTypes.string,
//     })
//   ),
//   title: PropTypes.string,
//   spinButtonText: PropTypes.string,
//   waitingText: PropTypes.string,

// };

export default SpinningWheel;

{
  /* Segment Management */
}
//    <div className="mt-6">
//      <div className="flex gap-2 mb-4">
//        <input
//          type="text"
//          value={newSegment}
//          onChange={(e) => setNewSegment(e.target.value)}
//          placeholder="Add new option"
//          className="flex-1 px-4 py-2 rounded-lg border border-gray-300"
//          disabled={segments.length >= 10}
//          onKeyPress={(e) => e.key === "Enter" && addSegment()}
//        />
//        <input
//          type="color"
//          value={newColor}
//          onChange={(e) => setNewColor(e.target.value)}
//          className="w-12 h-12 cursor-pointer"
//          disabled={segments.length >= 10}
//        />
//        <button
//          onClick={addSegment}
//          disabled={!newSegment.trim() || segments.length >= 10}
//          className="px-4 py-2 bg-green-500 text-white rounded-lg disabled:bg-gray-400"
//        >
//          Add
//        </button>
//      </div>
//      <div className="flex flex-wrap gap-2">
//        {segments.map((segment, index) => (
//          <div
//            key={index}
//            className="flex items-center bg-gray-100 rounded-full px-3 py-1"
//            style={{ backgroundColor: `${segment.color}20` }}
//          >
//            <span className="mr-2">{segment.option}</span>
//            <button
//              onClick={() => removeSegment(index)}
//              className="text-red-500 hover:text-red-700"
//              aria-label={`Remove ${segment.option}`}
//            >
//              ×
//            </button>
//          </div>
//        ))}
//      </div>
//    </div>;
