import React from "react";
import { FiPercent, FiTag, FiDollarSign } from "react-icons/fi";
import PriceRangeFilter from "./PriceRangeFilter";
import { useDispatch, useSelector } from "react-redux";
import {
  setHasDiscount,
  setSelectedCategory,
  clearFilters,
  selectHasDiscount,
  selectSelectedCategory,
  selectCategories,
  selectHasActiveFilters,
} from "../../app/slices/productsSearchSlice";

export default function FilterPanel({ isFilterOpen, hasActiveFilters }) {
  const dispatch = useDispatch();
  const hasDiscount = useSelector(selectHasDiscount);
  const selectedCategory = useSelector(selectSelectedCategory);
  const categories = useSelector(selectCategories);

  return (
    <div
      className={`lg:col-span-1 space-y-6 ${
        isFilterOpen ? "block" : "hidden lg:block"
      }`}
    >
      <div
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 
                        hover:shadow-md transition-all duration-200"
      >
        {/* Filter title */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">الفلاتر</h3>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              hasActiveFilters
                ? "bg-teal-100 text-teal-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {hasActiveFilters ? "نشط" : "غير مفعل"}
          </span>
        </div>

        {/* Discount option */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FiPercent className="h-4 w-4 text-gray-600" />
            <h4 className="font-medium text-gray-900">العروض الخاصة</h4>
          </div>
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
              عناصر عليها خصم
            </span>
            <button
              type="button"
              onClick={() => dispatch(setHasDiscount(!hasDiscount))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full 
                           transition-all duration-200 focus:outline-none focus:ring-2 
                           focus:ring-offset-2 focus:ring-teal-500 shadow-sm
                           ${
                             hasDiscount
                               ? "bg-gradient-to-r from-teal-500 to-teal-600 shadow-teal-200"
                               : "bg-gray-200 hover:bg-gray-300"
                           }`}
              aria-pressed={hasDiscount}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white 
                             transition-transform duration-200 shadow-sm
                             ${
                               hasDiscount ? "translate-x-6" : "translate-x-0.5"
                             }`}
              />
            </button>
          </label>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FiTag className="h-4 w-4 text-gray-600" />
            <h4 className="font-medium text-gray-900">الفئة</h4>
          </div>
          <div className="space-y-3">
            <label className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="category"
                value=""
                checked={selectedCategory === ""}
                onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
                className="w-4 h-4 text-teal-500 border-gray-300 focus:ring-teal-500"
              />
              <span className="ml-3 text-gray-700 group-hover:text-gray-900 transition-colors">
                جميع الفئات
              </span>
            </label>
            {categories?.map((category) => (
              <label
                key={category.id}
                className="flex items-center cursor-pointer group"
              >
                <input
                  type="radio"
                  name="category"
                  value={category.id}
                  checked={selectedCategory === String(category.id)}
                  onChange={(e) =>
                    dispatch(setSelectedCategory(e.target.value))
                  }
                  className="w-4 h-4 text-teal-500 border-gray-300 focus:ring-teal-500"
                />
                <span className="ml-3 text-gray-700 group-hover:text-gray-900 transition-colors">
                  {category.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price range */}
        <PriceRangeFilter />

        {/* Search and clear buttons */}
        <div className="flex gap-3 my-5">
          <button
            className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 
                             rounded-xl font-medium hover:from-teal-600 hover:to-teal-700 
                             transition-all duration-200 shadow-lg hover:shadow-xl
                             transform hover:scale-[1.02] active:scale-[0.98]"
          >
            بحث المنتجات
          </button>
          {hasActiveFilters && (
            <button
              onClick={() => dispatch(clearFilters())}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium 
                         hover:bg-gray-200 transition-all duration-200 border border-gray-200
                         hover:border-gray-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              مسح الكل
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
