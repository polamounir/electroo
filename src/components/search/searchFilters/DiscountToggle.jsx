import React from "react";
import { FaTags } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setHasDiscount } from "../../../app/slices/searchSlice";


const DiscountToggle = () => {
  const dispatch = useDispatch();
  const HasDiscount = useSelector((state) => state.search.HasDiscount);

  const handleToggle = () => {
    dispatch(setHasDiscount(!HasDiscount));
  };

  return (
    <div className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
      <span className="flex items-center gap-2">
        <FaTags className="h-5 w-5 text-teal-500" />
        التوفيرات
      </span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={HasDiscount}
          onChange={handleToggle}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
      </label>
    </div>
  );
};

export default DiscountToggle;
