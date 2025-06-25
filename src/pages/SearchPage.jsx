import React, { useEffect, useState } from "react";
import SearchFilters from "../components/searchPage/SearchFilters";
import { useDispatch, useSelector } from "react-redux";
import SearchedProducts from "../components/searchPage/SearchedProducts";
import { useLocation } from "react-router-dom";
import SearchInput from "../components/searchPage/SearchInput";
import {
  setSearchQuery,
  setSelectedCategoryId,
  setHasDiscount,
  setPriceRange,
  fetchSearchingProducts,
} from "../app/slices/searchingSlice";

export default function SearchPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [initialLoad, setInitialLoad] = useState(true);

  // Get current search state from Redux
  const {
    searchQuery,
    selectedCategoryId,
    minimumPrice,
    maximumPrice,
    hasDiscount,
  } = useSelector((state) => state.searching);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    // Always update Redux state from URL parameters
    dispatch(setSearchQuery(params.get("SearchQuery") || ""));
    dispatch(setSelectedCategoryId(params.get("CategoryId") || null));
    dispatch(setHasDiscount(params.get("HasDiscount") === "true"));
    dispatch(
      setPriceRange({
        min: params.has("MinimumPrice")
          ? Number(params.get("MinimumPrice"))
          : 0,
        max: params.has("MaximumPrice")
          ? Number(params.get("MaximumPrice"))
          : 25000,
      })
    );

    // Then fetch products
    dispatch(fetchSearchingProducts());
  }, [dispatch, location.search]); // Re-run when URL changes

  return (
    <div className="min-h-screen pt-30 px-4 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">بحث المنتجات</h1>
      </div>
      <div>
        <div>
          <div>
            <SearchInput term={searchQuery} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Mobile dropdown version */}
            <div className="lg:hidden pr-3">
              <details className="dropdown mb-4">
                <summary className="btn btn-primary w-full">
                  فلاتر البحث
                </summary>
                <div className="p-4 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-full">
                  <SearchFilters mobileView />
                </div>
              </details>
            </div>

            {/* Desktop regular version */}
            <div className="hidden lg:block lg:col-span-3">
              <div>
                <SearchFilters />
              </div>
            </div>

            <div className="lg:col-span-9">
              <SearchedProducts />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
