import { useLocation } from "react-router-dom";
import SearchProductsContainer from "../components/search/SearchProductsContainer";
import SearchFilter from "../components/search/SearchFilter";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { LuTextSearch } from "react-icons/lu";
import {
  getSearchResults,
  setIsSearchSidebarOpen,
  setSearchParams,
  clearSearchResults, // Import the new action
} from "../app/slices/searchSlice";
import NoProducts from "../components/search/NoProducts";

function Search() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const { searchResults, isLoading, error, HasMore } = useSelector(
    (state) => state.search
  );

  const searchQuery = params.get("SearchQuery") || null;
  const categoryId = params.get("CategoryId") || null;
  const minimumPrice = Number(params.get("MinimumPrice")) || 0;
  const maximumPrice = Number(params.get("MaximumPrice")) || 10000;
  const hasDiscount = params.get("HasDiscount") === "true";
  const sortBy = params.get("SortBy") || "price-low-high";
  const limit = parseInt(params.get("Limit"), 10) || 20;
  const optionGroupName = params.get("OptionGroupName") || null;
  const optionValue = params.get("OptionValue") || null;

  useEffect(() => {
 

    // Make new search request
    dispatch(
      getSearchResults({
        SearchQuery: searchQuery,
        Limit: limit,
        MinimumPrice: minimumPrice,
        MaximumPrice: maximumPrice,
        HasDiscount: hasDiscount,
        SortBy: sortBy,
        CategoryId: categoryId,
        OptionGroupName: optionGroupName,
        OptionValue: optionValue,
        isLoadMore: false, 
      })
    );

    // Update search params in state
    dispatch(
      setSearchParams({
        SearchQuery: searchQuery,
        Limit: limit,
        MinimumPrice: minimumPrice,
        MaximumPrice: maximumPrice,
        HasDiscount: hasDiscount,
        SortBy: sortBy,
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

  const getMore = () => {
    dispatch(
      getSearchResults({
        SearchQuery: searchQuery,
        Limit: limit,
        MinimumPrice: minimumPrice,
        MaximumPrice: maximumPrice,
        HasDiscount: hasDiscount,
        SortBy: sortBy,
        CategoryId: categoryId,
        OptionGroupName: optionGroupName,
        OptionValue: optionValue,
        isLoadMore: true, 
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" mx-auto px-4 py-8">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex justify-center items-center">
            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent border-solid rounded-full animate-spin"></div>
          </div>
        )}

        {/* No Results Message */}
        {!isLoading && searchResults?.length === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
            <div className="col-span-1 lg:col-span-3 xl:col-span-2 ">
              <SearchFilter />
            </div>
            <div className="col-span-1 lg:col-span-7 xl:col-span-8">
              <NoProducts />
            </div>
          </div>
        )}

        {/* Product Results */}
        {searchResults?.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
            <div className="col-span-1 lg:col-span-3 xl:col-span-2 min-w-40">
              <SearchFilter />
            </div>
            <div className="col-span-1 lg:col-span-7 xl:col-span-8 flex flex-col justify-between lg:px-10">
              <SearchProductsContainer products={searchResults} />
              <div className="flex justify-end">
                <button
                  onClick={getMore}
                  disabled={!HasMore || isLoading}
                  className="bg-teal-500 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading
                    ? "جاري التحميل..."
                    : HasMore
                    ? "تحميل المزيد"
                    : "لا يوجد نتائج أكثر"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
