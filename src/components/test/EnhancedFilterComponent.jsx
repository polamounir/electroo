import React, { useEffect, useState } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import FilterPanel from "./FilterPanel";
import SearchResults from "./SearchResults";
import {
  fetchProducts,
  fetchCategories,
  setSearchTerm,
  selectSearchTerm,
  selectHasActiveFilters,
} from "../../app/slices/productsSearchSlice";

export default function EnhancedFilterComponent() {
  const dispatch = useDispatch();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localSearchInput, setLocalSearchInput] = useState("");
  const searchTerm = useSelector(selectSearchTerm);
  const hasActiveFilters = useSelector(selectHasActiveFilters);

  // Initialize categories and products
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  // Sync local input to Redux with debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(setSearchTerm(localSearchInput));
    }, 400);
    return () => clearTimeout(timeout);
  }, [localSearchInput, dispatch]);

  // Fetch products when filters change
  useEffect(() => {
    if (searchTerm === localSearchInput) {
      // Only fetch when debounced search term matches
      dispatch(fetchProducts());
    }
  }, [searchTerm, localSearchInput, dispatch]);

  return (
    <div className="w-full mx-auto p-6 bg-gradient-to-br from-slate-50 to-white min-h-screen pt-30 pb-20">
      {/* Main title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">بحث المنتجات</h1>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={localSearchInput}
          onChange={(e) => setLocalSearchInput(e.target.value)}
          placeholder="ابحث عن منتجات، ماركات، فئات..."
          className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-2xl 
                     focus:ring-2 focus:ring-teal-500 focus:border-transparent 
                     transition-all duration-200 shadow-sm hover:shadow-md
                     bg-white/80 backdrop-blur-sm"
        />
      </div>

      {/* Mobile filter button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 
                   rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
        >
          <FiFilter className="h-4 w-4" />
          <span>تصفية</span>
          {hasActiveFilters && (
            <span className="bg-teal-500 text-white text-xs px-2 py-1 rounded-full">
              نشط
            </span>
          )}
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Filter panel */}
        <FilterPanel
          isFilterOpen={isFilterOpen}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Results panel */}
        <SearchResults />
      </div>
    </div>
  );
}
