import { useLocation } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import { fetchSearchProducts } from "../api/product";
import SearchProductsContainer from "../components/search/SearchProductsContainer";
import SearchFilter from "../components/search/SearchFilter";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { LuTextSearch } from "react-icons/lu";
import {
  getSearchResults,
  setIsSearchSidebarOpen,
  setSearchParams,
} from "../app/slices/searchSlice";
function Search() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const { searchResults, isLoading, error } = useSelector(
    (state) => state.search
  );
  const searchQuery = params.get("SearchQuery") || null;
  const categoryId = params.get("CategoryId") || null;
  const minimumPrice = Number(params.get("MinimumPrice")) || 0;
  const maximumPrice = Number(params.get("MaximumPrice")) || 10000;
  const hasDiscount = params.get("HasDiscount") === "true";
  const sortBy = params.get("SortBy") || "price-low-high";
  // const viewMode = params.get("ViewMode") || "grid";

  const limit = parseInt(params.get("Limit"), 10) || 20;
  const optionGroupName = params.get("OptionGroupName") || null;
  const optionValue = params.get("OptionValue") || null;

  useEffect(() => {
    console.log(
      "search",
      searchQuery,
      categoryId,
      minimumPrice,
      maximumPrice,
      hasDiscount,
      sortBy,
      // viewMode,
      limit,
      optionGroupName,
      optionValue
    );
    dispatch(
      getSearchResults({
        SearchQuery: searchQuery,
        Limit: limit,
        MinimumPrice: minimumPrice,
        MaximumPrice: maximumPrice,
        HasDiscount: hasDiscount,
        SortBy: sortBy,
        // ViewMode: viewMode,
        CategoryId: categoryId,
        OptionGroupName: optionGroupName,
        OptionValue: optionValue,
      })
    );
    dispatch(
      setSearchParams({
        SearchQuery: searchQuery,
        Limit: limit,
        MinimumPrice: minimumPrice,
        MaximumPrice: maximumPrice,
        HasDiscount: hasDiscount,
        SortBy: sortBy,
        // ViewMode: viewMode,
        optionGroup: optionGroupName,
        selectedOptionsValue: optionValue,
        CategoryId: categoryId,
      })
    );
  }, [
    dispatch,
    searchQuery,
    categoryId,
    minimumPrice,
    maximumPrice,
    hasDiscount,
    sortBy,
    limit,
    optionGroupName,
    optionValue,
  ]);
  // console.log(searchResults);

  return (
    <div className="min-h-screen bg-gray-50">
      {" "}
      <div className=" mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="flex justify-between items-start mb-4 px-1 sm:px-5">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 mb-6 text-right">
            نتائج البحث لـ: <span className="text-teal-600">{searchQuery}</span>
          </h1>
          <div className="lg:hidden text-3xl  shadow">
            <button
              onClick={() => {
                dispatch(setIsSearchSidebarOpen());
              }}
            >
              <LuTextSearch />
            </button>
          </div>
        </div>
        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex justify-center items-center">
            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent border-solid rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 text-right">
            <p>خطأ: حدث خطأ غير معروف.</p>
          </div>
        )}

        {/* No Results Message */}
        {!isLoading && searchResults?.length === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
            <div className="col-span-1 lg:col-span-3 xl:col-span-2 border-e border-gray-300">
              <SearchFilter />
            </div>
            <div className="col-span-1 lg:col-span-7 xl:col-span-8">
              <p>لم يتم العثور على نتائج.</p>
            </div>
          </div>
        )}

        {/* Product Results */}
        {searchResults?.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
            <div className="col-span-1 lg:col-span-3 xl:col-span-2 border-e border-gray-300">
              <SearchFilter />
            </div>
            <div className="col-span-1 lg:col-span-7 xl:col-span-8">
              <SearchProductsContainer products={searchResults} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
