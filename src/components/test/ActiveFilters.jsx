import React from "react";
import { FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSearchTerm,
  selectSelectedCategory,
  selectHasDiscount,
  selectPriceRange,
  selectHasActiveFilters,
  selectCategories,
  setSearchTerm,
  setSelectedCategory,
  setHasDiscount,
  setPriceRange,
} from "../../app/slices/productsSearchSlice";

export default function ActiveFilters() {
    const dispatch = useDispatch();
    const searchTerm = useSelector(selectSearchTerm);
    const selectedCategory = useSelector(selectSelectedCategory);
    const hasDiscount = useSelector(selectHasDiscount);
    const priceRange = useSelector(selectPriceRange);
    const hasActiveFilters = useSelector(selectHasActiveFilters);
    const categories = useSelector(selectCategories);

    if (!hasActiveFilters) return null;

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {searchTerm && (
          <span
            className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-800 
                                   text-sm rounded-full"
          >
            البحث: "{searchTerm}"
            <button onClick={() => dispatch(setSearchTerm(""))}>
              <FiX className="h-3 w-3" />
            </button>
          </span>
        )}
        {selectedCategory && (
          <span
            className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-800 
                                   text-sm rounded-full"
          >
            الفئة:{" "}
            {
              categories?.find((cat) => cat.id === Number(selectedCategory))
                ?.name
            }
            <button onClick={() => dispatch(setSelectedCategory(""))}>
              <FiX className="h-3 w-3" />
            </button>
          </span>
        )}
        {hasDiscount && (
          <span
            className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-800 
                                   text-sm rounded-full"
          >
            عليها خصم
            <button onClick={() => dispatch(setHasDiscount(false))}>
              <FiX className="h-3 w-3" />
            </button>
          </span>
        )}
        {(priceRange.min > 0 || priceRange.max < 25000) && (
          <span
            className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-800 
                                   text-sm rounded-full"
          >
            {priceRange.min} ج.م - {priceRange.max} ج.م
            <button
              onClick={() => dispatch(setPriceRange({ min: 0, max: 25000 }))}
            >
              <FiX className="h-3 w-3" />
            </button>
          </span>
        )}
      </div>
    </div>
  );
}
