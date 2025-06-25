import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPriceRange } from "../../app/slices/searchingSlice";
import { FiDollarSign } from "react-icons/fi";
import { Range, getTrackBackground } from "react-range";
const MIN = 0;
const MAX = 25000;

export default function PriceFilter() {
    const dispatch = useDispatch();
    const { minimumPrice, maximumPrice } = useSelector(
      (state) => state.searching
    );
    const [values, setValues] = useState([minimumPrice, maximumPrice]);

    // Sync local state with Redux state
    useEffect(() => {
      setValues([minimumPrice, maximumPrice]);
    }, [minimumPrice, maximumPrice]);

    // Debounce the Redux updates to prevent excessive dispatches
    useEffect(() => {
      const timer = setTimeout(() => {
        if (values[0] !== minimumPrice || values[1] !== maximumPrice) {
          dispatch(setPriceRange({ min: values[0], max: values[1] }));
        }
      }, 300);

      return () => clearTimeout(timer);
    }, [values, dispatch]);

    const handleChange = (newValues) => {
      setValues(newValues);
    };

    const handleInputChange = (index, newValue) => {
      const newValues = [...values];
      newValue = Math.max(MIN, Math.min(MAX, newValue));

      if (index === 0) {
        newValue = Math.min(newValue, values[1] - 1);
      } else {
        newValue = Math.max(newValue, values[0] + 1);
      }

      newValues[index] = newValue;
      setValues(newValues);
    };

  return (
    <div className="">
      {" "}
      <div className="mb-8" dir="rtl">
        <div className="flex items-center gap-2 mb-4">
          {/* <FiDollarSign className="h-4 w-4 text-gray-600" /> */}
          <h4 className="font-medium text-gray-900">نطاق السعر</h4>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <span>{values[0]} ج.م</span>
          <span>{values[1]} ج.م</span>
        </div>

        <div className="mb-6 px-3 py-2">
          <Range
            values={values}
            step={100}
            min={MIN}
            max={MAX}
            onChange={handleChange}
            rtl={true}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: "8px",
                  width: "100%",
                  background: getTrackBackground({
                    values,
                    colors: ["#ccc", "#14b8a6", "#ccc"],
                    min: MIN,
                    max: MAX,
                    rtl: true,
                  }),
                  borderRadius: "9999px",
                }}
                className="relative"
              >
                {children}
              </div>
            )}
            renderThumb={({ props, isDragged }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  outline: "none",
                }}
                className={`w-5 h-5 rounded-full bg-white border-2 border-teal-500 shadow-md hover:scale-110 transition-transform duration-150 cursor-grab active:cursor-grabbing ${
                  isDragged ? "scale-110" : ""
                }`}
              />
            )}
          />
        </div>

        {/* Price inputs */}
        {/* <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              الحد الأدنى للسعر
            </label>
            <input
              type="number"
              min={MIN}
              max={values[1] - 1}
              value={values[0]}
              onChange={(e) =>
                handleChange([
                  Math.min(+e.target.value, values[1] - 1),
                  values[1],
                ])
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              الحد الأقصى للسعر
            </label>
            <input
              type="number"
              min={values[0] + 1}
              max={MAX}
              value={values[1]}
              onChange={(e) =>
                handleChange([
                  values[0],
                  Math.max(+e.target.value, values[0] + 1),
                ])
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div> */}
      </div>
    </div>
  );
}
