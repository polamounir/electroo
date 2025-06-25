import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import { closeSpinModel } from "../../app/slices/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/axiosInstance";

const SpinningWheelModel = ({
  title = "عجلة الحظ",
  spinButtonText = "لف الان",
  waitingText = "انتظر ...",
  //  isSpinModelOpen = false, // Fixed typo
}) => {
  const [dimensions, setDimensions] = useState({ width: 300, height: 300 });
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState("");
  const [hasSpun, setHasSpun] = useState(false);
  const [tooltip, setTooltip] = useState({ show: false, text: "", x: 0, y: 0 });
  const [showResult, setShowResult] = useState(false);
  const [isWaitingForServer, setIsWaitingForServer] = useState(false);
  const [serverResult, setServerResult] = useState(null);
  const [animationId, setAnimationId] = useState(null);
  const { isSpinModelOpen } = useSelector((state) => state.chat);
  const wheelRef = useRef(null);
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  // Enhanced color palette with better contrast
  const colorPalette = useMemo(
    () => [
      { color: "#FF6B6B", textColor: "#FFFFFF" },
      { color: "#4ECDC4", textColor: "#FFFFFF" },
      { color: "#45B7D1", textColor: "#FFFFFF" },
      { color: "#96CEB4", textColor: "#2C3E50" },
      { color: "#FFEAA7", textColor: "#2C3E50" },
      { color: "#DDA0DD", textColor: "#2C3E50" },
      { color: "#98D8C8", textColor: "#2C3E50" },
      { color: "#F7DC6F", textColor: "#2C3E50" },
      { color: "#FF9FF3", textColor: "#2C3E50" },
      { color: "#54A0FF", textColor: "#FFFFFF" },
      { color: "#5F27CD", textColor: "#FFFFFF" },
      { color: "#00D2D3", textColor: "#FFFFFF" },
    ],
    []
  );

  // Fetch wheel options with better error handling
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["wheel-options-user"],
    queryFn: async () => {
      if (user.role !== "User") return;
      try {
        const { data } = await api.get("/wheel/rewards");
        return data.data?.rewards || [];
      } catch (error) {
        console.error("Failed to fetch wheel options:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const fetchedOptions = data || [];

  const segments = useMemo(() => {
    if (fetchedOptions.length === 0) return [];

    return fetchedOptions.slice(0, 12).map((reward, index) => ({
      option: reward,
      color: colorPalette[index % colorPalette.length].color,
      textColor: colorPalette[index % colorPalette.length].textColor,
    }));
  }, [fetchedOptions, colorPalette]);

  // Responsive dimensions with better calculations
  const updateDimensions = useCallback(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Calculate optimal size based on screen dimensions
    const maxSize = Math.min(
      Math.min(screenWidth * 0.8, 450),
      Math.min(screenHeight * 0.6, 450)
    );

    const size = Math.max(250, maxSize); // Minimum size of 250px

    setDimensions({ width: size, height: size });
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  // Enhanced spin API call with better error handling
  const callSpinAPI = useCallback(async () => {
    try {
      setIsWaitingForServer(true);
      const response = await api.post("/wheel/spin");

      if (response.data?.data) {
        const { reward, value, success } = response.data.data;
        setServerResult({ reward, value, success });
        return { reward, value, success };
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error calling spin API:", error);

      // Fallback to random selection
      const randomIndex = Math.floor(Math.random() * segments.length);
      const fallbackResult = {
        reward: segments[randomIndex]?.option || "جائزة افتراضية",
        value:
          error.response?.data?.detail || "حدث خطأ، تم اختيار جائزة عشوائية",
        success: false,
      };

      setServerResult(fallbackResult);
      return fallbackResult;
    } finally {
      setIsWaitingForServer(false);
    }
  }, [segments]);

  // Find target segment index with better matching
  const getServerResultIndex = useCallback(() => {
    if (!serverResult?.reward || segments.length === 0) return 0;

    // Exact match
    const exactMatch = segments.findIndex(
      (segment) => segment.option === serverResult.reward
    );
    if (exactMatch !== -1) return exactMatch;

    // Partial match (case insensitive)
    const partialMatch = segments.findIndex((segment) => {
      const segmentText = segment.option?.toLowerCase() || "";
      const resultText = serverResult.reward?.toLowerCase() || "";
      return (
        segmentText.includes(resultText) || resultText.includes(segmentText)
      );
    });
    if (partialMatch !== -1) return partialMatch;

    // Random fallback
    return Math.floor(Math.random() * segments.length);
  }, [serverResult, segments]);

  // Enhanced rotation calculation
  const calculateRotationForSegment = useCallback(
    (segmentIndex) => {
      if (segments.length === 0) return 0;

      const segmentAngle = 360 / segments.length;
      const segmentCenter = segmentIndex * segmentAngle + segmentAngle / 2;

      // More random spins (4-8 full rotations)
      const spins = Math.random() * 4 + 4;
      const targetAngle = 360 - segmentCenter;

      return rotation + spins * 360 + targetAngle;
    },
    [segments.length, rotation]
  );

  // Enhanced spin function with animation
  const spin = useCallback(async () => {
    if (isSpinning || segments.length === 0 || hasSpun || isWaitingForServer) {
      return;
    }

    // Reset states
    setIsSpinning(true);
    setHasSpun(true);
    setResult("");
    setShowResult(false);
    setServerResult(null);
    setTooltip((prev) => ({ ...prev, show: false }));

    try {
      // Call API and get result
      const apiResult = await callSpinAPI();

      // Calculate target rotation
      const targetSegmentIndex =
        segments.findIndex((segment) => segment.option === apiResult.reward) ||
        0;

      const totalRotation = calculateRotationForSegment(targetSegmentIndex);

      // Animate rotation
      setRotation(totalRotation);

      // Show result after animation
      const timeoutId = setTimeout(() => {
        setIsSpinning(false);
        setResult(apiResult.reward);
        setShowResult(true);
      }, 3500); // Slightly longer for better UX

      setAnimationId(timeoutId);
    } catch (error) {
      console.error("Spin failed:", error);
      setIsSpinning(false);
      setHasSpun(false);
    }
  }, [
    isSpinning,
    segments,
    hasSpun,
    isWaitingForServer,
    callSpinAPI,
    calculateRotationForSegment,
  ]);

  // Enhanced tooltip handlers
  const handleMouseEnter = useCallback(
    (segment, e) => {
      if (isSpinning) return;

      const rect = wheelRef.current?.getBoundingClientRect();
      if (!rect) return;

      setTooltip({
        show: true,
        text: segment,
        x: e.clientX,
        y: e.clientY,
      });
    },
    [isSpinning]
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip((prev) => ({ ...prev, show: false }));
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (tooltip.show) {
        setTooltip((prev) => ({
          ...prev,
          x: e.clientX,
          y: e.clientY,
        }));
      }
    },
    [tooltip.show]
  );

  // Modal handlers
  const handleCloseModal = useCallback(() => {
    if (animationId) {
      clearTimeout(animationId);
    }
    dispatch(closeSpinModel());
    setShowResult(false);
  }, [dispatch, animationId]);

  const handleResetResult = useCallback(() => {
    setShowResult(false);
    setResult("");
    setHasSpun(false);
    setServerResult(null);
    setRotation(0);
  }, []);

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        spin();
      } else if (e.key === "Escape") {
        handleCloseModal();
      }
    };

    if (isSpinModelOpen) {
      document.addEventListener("keydown", handleKeyPress);
      return () => document.removeEventListener("keydown", handleKeyPress);
    }
  }, [isSpinModelOpen, spin, handleCloseModal]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationId) {
        clearTimeout(animationId);
      }
    };
  }, [animationId]);

  // Calculate wheel properties
  const { width, height } = dimensions;
  const segmentAngle = segments.length > 0 ? 360 / segments.length : 0;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 15;

  // Loading state
  if (isLoading) {
    return (
      <div
        className={`h-screen ${
          isSpinModelOpen ? "flex" : "hidden"
        } items-center justify-center fixed top-0 w-full z-[1000] bg-black/30`}
      >
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">جاري تحميل العجلة...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={`h-screen ${
          isSpinModelOpen ? "flex" : "hidden"
        } items-center justify-center fixed top-0 w-full z-[1000] bg-black/30`}
      >
        <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">
            خطأ في التحميل
          </h2>
          <p className="text-gray-600 mb-4">فشل في تحميل خيارات العجلة</p>
          <div className="flex gap-3">
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              إعادة المحاولة
            </button>
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-screen ${
        isSpinModelOpen ? "flex" : "hidden"
      } flex-col items-center justify-center p-4 fixed top-0 w-full overflow-hidden z-[1000] bg-black/40 backdrop-blur-sm`}
      onMouseMove={handleMouseMove}
      role="dialog"
      aria-modal="true"
      aria-labelledby="wheel-title"
    >
      {/* Enhanced Tooltip */}
      {tooltip.show && (
        <div
          className="fixed z-50 px-3 py-2 bg-gray-900/90 text-white text-sm rounded-lg pointer-events-none shadow-xl max-w-xs break-words backdrop-blur-sm border border-gray-700"
          style={{
            left: `${Math.min(tooltip.x + 15, window.innerWidth - 200)}px`,
            top: `${Math.max(tooltip.y - 50, 10)}px`,
          }}
          role="tooltip"
        >
          {tooltip.text}
        </div>
      )}

      <div className="bg-white/90 backdrop-blur-xl rounded-3xl py-6 px-4 shadow-2xl border border-white/30 w-full max-w-2xl">
        <button
          onClick={handleCloseModal}
          className="absolute top-4 left-4 text-gray-600 hover:text-red-600 transition-colors text-2xl z-10 p-1 rounded-full hover:bg-gray-100"
          aria-label="إغلاق النافذة"
        >
          ✕
        </button>

        <h1
          id="wheel-title"
          className="text-4xl font-bold text-gray-800 text-center mb-8"
        >
          {title}
        </h1>

        {/* Enhanced Wheel Container */}
        <div className="relative flex flex-col items-center mb-8 justify-center">
          {/* Enhanced Pointer */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
            <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[40px] border-l-transparent border-r-transparent border-t-red-500 drop-shadow-xl"></div>
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[15px] border-r-[15px] border-t-[30px] border-l-transparent border-r-transparent border-t-red-400"></div>
          </div>

          {/* Enhanced Wheel */}
          <div
            className="relative"
            style={{ width: `${width}px`, height: `${height}px` }}
          >
            <svg
              ref={wheelRef}
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-full drop-shadow-2xl transition-transform duration-[3500ms] ease-out"
              style={{
                transform: `rotate(${rotation}deg)`,
                filter: isSpinning ? "blur(0.5px)" : "none",
              }}
              aria-label="عجلة الحظ"
            >
              {/* Enhanced Outer Ring */}
              <circle
                cx={centerX}
                cy={centerY}
                r={radius + 5}
                fill="none"
                stroke="#03C0C1"
                strokeWidth="3"
              />
              <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke="#FFD700"
                strokeWidth="6"
              />

              {/* Enhanced Segments */}
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
                const textRadius = radius * 0.75;
                const textX =
                  centerX + textRadius * Math.cos((textAngle * Math.PI) / 180);
                const textY =
                  centerY + textRadius * Math.sin((textAngle * Math.PI) / 180);

                return (
                  <g
                    key={`${segment.option}-${index}`}
                    onMouseEnter={(e) => handleMouseEnter(segment.option, e)}
                    onMouseLeave={handleMouseLeave}
                    aria-label={`خيار: ${segment.option}`}
                  >
                    <path
                      d={`M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                      fill={segment.color}
                      stroke="white"
                      strokeWidth="2"
                      className={`transition-all duration-200 ${
                        isSpinning
                          ? ""
                          : "cursor-pointer hover:brightness-110 hover:drop-shadow-lg"
                      }`}
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill={segment.textColor}
                      fontSize={Math.max(10, radius / 18)}
                      fontWeight="600"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                      className="pointer-events-none select-none drop-shadow-sm"
                      style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}
                    >
                      {segment.option?.length > 15
                        ? segment.option.substring(0, 12) + "..."
                        : segment.option}
                    </text>
                  </g>
                );
              })}

              {/* Enhanced Center */}
              <circle
                cx={centerX}
                cy={centerY}
                r={radius / 5}
                fill="url(#centerGradient)"
                stroke="white"
                strokeWidth="4"
              />
              <circle
                cx={centerX}
                cy={centerY}
                r={radius / 8}
                fill="white"
                className="drop-shadow-lg"
              />

              {/* Gradient Definition */}
              <defs>
                <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#FFA500" />
                </radialGradient>
              </defs>
            </svg>
          </div>

          {/* Enhanced Spin Button */}
          <button
            onClick={spin}
            disabled={
              isSpinning ||
              segments.length === 0 ||
              hasSpun ||
              isWaitingForServer
            }
            className={`mt-8 px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 transform shadow-xl ${
              isSpinning ||
              segments.length === 0 ||
              hasSpun ||
              isWaitingForServer
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700 active:scale-95 hover:shadow-2xl hover:-translate-y-1"
            }`}
            aria-label="تدوير العجلة"
          >
            {isWaitingForServer
              ? " انتظار النتيجة..."
              : isSpinning
              ? ` ${waitingText}`
              : hasSpun
              ? " تم الانتهاء"
              : ` ${spinButtonText}`}
          </button>
        </div>
      </div>

      {/* Enhanced Result Modal */}
      {showResult && result && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm modal-bg"
          onClick={(e) =>
            e.target.classList.contains("modal-bg") && handleResetResult()
          }
        >
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-white/20 relative max-w-md w-full mx-4 transform">
            <button
              onClick={handleResetResult}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition text-2xl p-1 rounded-full hover:bg-gray-100"
              aria-label="إغلاق النتيجة"
            >
              ✕
            </button>

            <div className="text-center">
              <div className="text-6xl mb-4">
                {/* {serverResult?.success ? "🎉" : "😔"} */}
              </div>

              {/* <h2 className="text-3xl font-bold mb-6 text-gray-800">
                {serverResult?.success ? "مبروك!" : "للأسف"}
              </h2> */}

              <div
                className={`px-6 py-4 rounded-xl text-lg font-bold mb-6 ${
                  serverResult?.success
                    ? "bg-green-100 text-green-800 border-2 border-green-300"
                    : "bg-red-100 text-red-800 border-2 border-red-300"
                }`}
              >
                {serverResult?.success ? result : "لم تحصل على جائزة هذه المرة"}
              </div>

              {serverResult?.value && (
                <div className="text-center text-sm text-gray-600 mb-6 p-3 bg-gray-50 rounded-lg">
                  {serverResult.value}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleResetResult}
                  className="flex-1 justify-center py-3 bg-teal-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 transition font-semibold"
                >
                  لعب مرة أخرى
                </button>
                <button
                  onClick={handleCloseModal}
                  className="flex-1 justify-center py-3 bg-red-500 text-white rounded-full hover:from-teal-600 hover:to-cyan-600 transition font-semibold"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

SpinningWheelModel.propTypes = {
  title: PropTypes.string,
  spinButtonText: PropTypes.string,
  waitingText: PropTypes.string,
  //  isSpinModelOpen: PropTypes.bool, // Fixed typo in prop name
};

export default SpinningWheelModel;
