import React, { useState, useRef } from "react";

export default function SpinningWheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState("");
  const [segments, setSegments] = useState([
    "Option 1 text text text text texttexttext textv v v v text",
    "Option 2 text text text text texttexttext textv v v v text",
    "Option 3 text text text text texttexttext textv v v v text",
    "Option 4 text text text text texttexttext textv v v v text",
    "Option 5 text text text text texttexttext textv v v v text",
    "Option 6 text text text text texttexttext textv v v v text",
    "Option 7 text text text text texttexttext textv v v v text",
    "Option 8 text text text text texttexttext textv v v v text",
  ]);
  const [newSegment, setNewSegment] = useState("");
  const wheelRef = useRef(null);
  const [tooltip, setTooltip] = useState({ show: false, text: "", x: 0, y: 0 });

  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
  ];

  const spin = () => {
    if (isSpinning || segments.length === 0) return;

    setIsSpinning(true);
    setResult("");
    setTooltip({ ...tooltip, show: false }); // Hide tooltip during spin

    const spins = Math.random() * 3 + 3;
    const finalAngle = Math.random() * 360;
    const totalRotation = rotation + spins * 360 + finalAngle;

    setRotation(totalRotation);

    const segmentAngle = 360 / segments.length;
    const normalizedAngle = (360 - (totalRotation % 360)) % 360;
    const winningIndex = Math.floor(normalizedAngle / segmentAngle);

    setTimeout(() => {
      setIsSpinning(false);
      setResult(segments[winningIndex]);
    }, 3000);
  };

  const handleMouseEnter = (segment) => {
    if (isSpinning) return;
    setTooltip({
      show: true,
      text: segment,
    });
  };

  const handleMouseMove = (e) => {
    if (tooltip.show && !isSpinning) {
      setTooltip((prev) => ({
        ...prev,
        x: e.clientX,
        y: e.clientY,
      }));
    }
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, show: false }));
  };

  const segmentAngle = 360 / segments.length;

  return (
    <div
      className="min-h-[90svh] bg-gradient-to-br from-teal-400 via-teal-600 to-teal-900 flex flex-col items-center justify-center p-4"
      onMouseMove={handleMouseMove}
    >
      {/* Tooltip */}
      {tooltip.show && (
        <div
          className="fixed z-50 px-3 py-2 bg-gray-900 text-white text-sm rounded-md pointer-events-none shadow-lg max-w-xs break-words"
          style={{
            left: `${tooltip.x + 15}px`,
            top: `${tooltip.y + 15}px`,
            transform: "translateX(-50%)", // Center horizontally
          }}
        >
          {tooltip.text}
        </div>
      )}

      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
        <h1 className="text-4xl font-bold text-white text-center mb-8 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text">
          عجلة الحظ
        </h1>

        {/* Wheel Container */}
        <div className="relative flex flex-col items-center mb-8">
          {/* Pointer */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
            <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-b-[30px] border-l-transparent border-r-transparent border-b-red-500 drop-shadow-lg"></div>
          </div>

          {/* Wheel */}
          <div className="relative">
            <svg
              ref={wheelRef}
              width="320"
              height="320"
              className="drop-shadow-2xl transition-transform duration-[3000ms] ease-out"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {/* Outer ring */}
              <circle
                cx="160"
                cy="160"
                r="155"
                fill="none"
                stroke="#FFD700"
                strokeWidth="10"
              />

              {/* Segments */}
              {segments.map((segment, index) => {
                const startAngle = index * segmentAngle - 90;
                const endAngle = (index + 1) * segmentAngle - 90;
                const largeArcFlag = segmentAngle > 180 ? 1 : 0;

                const x1 = 160 + 145 * Math.cos((startAngle * Math.PI) / 180);
                const y1 = 160 + 145 * Math.sin((startAngle * Math.PI) / 180);
                const x2 = 160 + 145 * Math.cos((endAngle * Math.PI) / 180);
                const y2 = 160 + 145 * Math.sin((endAngle * Math.PI) / 180);

                const textAngle = startAngle + segmentAngle / 2;
                const textX = 160 + 100 * Math.cos((textAngle * Math.PI) / 180);
                const textY = 160 + 100 * Math.sin((textAngle * Math.PI) / 180);

                return (
                  <g
                    key={index}
                    onMouseEnter={() => handleMouseEnter(segment)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <path
                      d={`M 160 160 L ${x1} ${y1} A 145 145 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                      fill={colors[index % colors.length]}
                      stroke="white"
                      strokeWidth="2"
                      className={`transition-all duration-200 ${
                        isSpinning ? "" : "cursor-pointer hover:brightness-110"
                      }`}
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                      className="pointer-events-none select-none drop-shadow-sm"
                    >
                      {segment.length > 10
                        ? segment.substring(0, 10) + "..."
                        : segment}
                    </text>
                  </g>
                );
              })}

              {/* Center circle */}
              <circle
                cx="160"
                cy="160"
                r="25"
                fill="#FFD700"
                stroke="white"
                strokeWidth="3"
              />
              <circle cx="160" cy="160" r="15" fill="white" />
            </svg>
          </div>

          {/* Spin Button */}
          <button
            onClick={spin}
            disabled={isSpinning || segments.length === 0}
            className={`mt-6 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform ${
              isSpinning || segments.length === 0
                ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-yellow-400 to-pink-500 text-white hover:from-yellow-500 hover:to-pink-600 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            }`}
          >
            {isSpinning ? "انتظر ..." : "لف الان"}
          </button>
        </div>

        {/* Result */}
        {result && !isSpinning && (
          <div className="text-center mb-6">
            <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-full text-xl font-bold animate-pulse">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

{
  /* Segment Management */
}
{
  /* <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4">
            Manage Options
          </h3>

        
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newSegment}
              onChange={(e) => setNewSegment(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addSegment()}
              placeholder="Add new option..."
              maxLength={20}
              className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              onClick={addSegment}
              disabled={!newSegment.trim() || segments.length >= 12}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              ➕ Add
            </button>
          </div>

       
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {segments.map((segment, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white/10 rounded-lg px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  ></div>
                  <span className="text-white">{segment}</span>
                </div>
                <button
                  onClick={() => removeSegment(index)}
                  disabled={segments.length <= 2}
                  className="text-red-400 hover:text-red-300 disabled:text-gray-500 disabled:cursor-not-allowed text-sm"
                >
                  ❌ Remove
                </button>
              </div>
            ))}
          </div>

          <div className="text-sm text-white/60 mt-2">
            {segments.length}/12 options • Minimum 2 required
          </div>
        </div> */
}
