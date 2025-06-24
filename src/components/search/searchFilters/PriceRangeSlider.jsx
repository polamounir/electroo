import React, { useEffect, useState } from "react";
import { FaDollarSign } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  setMaximumPrice,
  setMinimumPrice,
} from "../../../app/slices/searchSlice";
import { MIN, MAX } from "../../../utils/constants"; 
import { percentage } from "../../../utils/constants";

export default function PriceRangeSlider() {
  const dispatch = useDispatch();
  const { MinimumPrice, MaximumPrice } = useSelector((state) => state.search);
  const [rangeValues, setRangeValues] = useState([
    MinimumPrice || MIN,
    MaximumPrice || MAX,
  ]);

  // Sync local state with Redux state
  useEffect(() => {
    setRangeValues([MinimumPrice || MIN, MaximumPrice || MAX]);
  }, [MinimumPrice, MaximumPrice]);

  const handleRangeChange = (type, value) => {
    const val = parseInt(value) || 0;
    let newValues;

    if (type === "min") {
      newValues = [Math.min(val, rangeValues[1]), rangeValues[1]];
      dispatch(setMinimumPrice(newValues[0]));
    } else {
      newValues = [rangeValues[0], Math.max(val, rangeValues[0])];
      dispatch(setMaximumPrice(newValues[1]));
    }

    setRangeValues(newValues);
  };

  return (
    <div className="bg-gray-750 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4 text-teal-800 flex items-center gap-2">
        <FaDollarSign className="h-5 w-5" />
        نطاق السعر
      </h2>
      <div className="relative h-8 mt-6">
        <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-1.5 bg-gray-600 rounded-full" />
        <div
          className="absolute top-1/2 transform -translate-y-1/2 h-1.5 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full"
          style={{
            right: `${percentage(rangeValues[0], MIN, MAX)}%`,
            width: `${
              percentage(rangeValues[1], MIN, MAX) -
              percentage(rangeValues[0], MIN, MAX)
            }%`,
          }}
        />
        {/* Min Slider */}
        <input
          type="range"
          min={MIN}
          max={MAX}
          value={rangeValues[0]}
          onChange={(e) => handleRangeChange("min", e.target.value)}
          className="absolute z-10 w-full pointer-events-none appearance-none h-1.5 bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-teal-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-teal-400/30 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110"
        />
        {/* Max Slider */}
        <input
          type="range"
          min={MIN}
          max={MAX}
          value={rangeValues[1]}
          onChange={(e) => handleRangeChange("max", e.target.value)}
          className="absolute w-full pointer-events-none appearance-none h-1.5 bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-cyan-500/30 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110"
        />
      </div>

      <div className="flex justify-between text-sm text-gray-300 mt-4">
        <span className="bg-gray-700 px-3 py-1 rounded-full">
          {rangeValues[0]} ج م
        </span>
        <span className="bg-gray-700 px-3 py-1 rounded-full">
          {rangeValues[1]} ج م
        </span>
      </div>
    </div>
  );
}
