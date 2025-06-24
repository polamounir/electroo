import React, { useState } from "react";
import { FaChevronUp, FaFilter } from "react-icons/fa";
import DiscountToggle from "./DiscountToggle";
import CategoriesFilter from "./CategoriesFilter";
import PriceRangeSlider from "./PriceRangeSlider";
import SortByFilter from "./SortByFilter";
import SearchInput from "./SearchInput";

const FilterSection = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="mb-6 rounded-xl p-4">
      <div
        className="flex justify-between items-center py-3 cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        <h3 className="font-bold text-lg text-teal-800 flex items-center gap-2">
          <FaFilter className="h-5 w-5" />
          الفلتر
        </h3>
        <FaChevronUp
          className={`text-teal-800 transition-transform duration-300 ${
            collapsed ? "rotate-180" : ""
          }`}
        />
      </div>

      {!collapsed && (
        <div className="py-3 space-y-6">
          <SearchInput />
          <DiscountToggle />
          <PriceRangeSlider />
          <CategoriesFilter />
          {/* <SortByFilter /> */}
        </div>
      )}
    </div>
  );
};

export default FilterSection;
