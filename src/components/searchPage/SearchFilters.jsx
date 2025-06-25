import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PriceFilter from "./PriceFilter";
import CategoryFilter from "./CategoryFilter";
import ToggleSwitch from "./DiscountFilter";
import {
  clearFilters,
  fetchSearchingProducts,
} from "../../app/slices/searchingSlice";

export default function SearchFilters() {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const {
    searchQuery,
    selectedCategoryId,
    hasDiscount,
    minimumPrice,
    maximumPrice,
  } = useSelector((state) => state.searching);

  const handleApplyFilters = async () => {
    // Create search params based on current state
    const searchParams = new URLSearchParams();
    if (searchQuery) searchParams.append("SearchQuery", searchQuery);
    if (selectedCategoryId)
      searchParams.append("CategoryId", selectedCategoryId);
    if (hasDiscount) searchParams.append("HasDiscount", "true");
    if (minimumPrice > 0) searchParams.append("MinimumPrice", minimumPrice);
    if (maximumPrice < 25000) searchParams.append("MaximumPrice", maximumPrice);

    // Dispatch the fetch action and wait for it to complete
    await dispatch(fetchSearchingProducts()).unwrap();

    // Navigate to the search URL with all current filters
    navigate(`/searching?${searchParams.toString()}`);
  };

  const handleResetFilters = async () => {
    await dispatch(clearFilters());
    await dispatch(fetchSearchingProducts()).unwrap();

    // Navigate to the search URL with all current filters
    navigate(`/searching?${searchParams.toString()}`);
  };

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
      <div className="flex flex-col gap-5">
        <ToggleSwitch />
        <CategoryFilter />
        <PriceFilter />

        <div className="flex items-center justify-end gap-2">
          <button
            className="px-3 py-2 bg-teal-500 rounded-lg text-white"
            onClick={handleApplyFilters}
          >
            تطبيق
          </button>
          <button
            className="px-3 py-2 bg-gray-500 rounded-lg text-white"
            onClick={handleResetFilters}
          >
            الغاء
          </button>
        </div>
      </div>
    </div>
  );
}
