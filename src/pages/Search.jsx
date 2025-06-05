import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import SearchProductsContainer from "../components/search/SearchProductsContainer";
import SearchFilter from "../components/search/SearchFilter";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { LuTextSearch } from "react-icons/lu";
import { HiMenuAlt2 } from "react-icons/hi";
import {
  getSearchResults,
  setIsSearchSidebarOpen,
  setSearchParams,
  clearSearchResults,
} from "../app/slices/searchSlice";
import NoProducts from "../components/search/NoProducts";

function Search() {
  const dispatch = useDispatch();
  const location = useLocation();
  const observerRef = useRef();
  const params = new URLSearchParams(location.search);
  const { searchResults, isLoading, error, HasMore, isSearchSidebarOpen } =
    useSelector((state) => state.search);

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

  useEffect(() => {
    if (searchResults?.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && HasMore && !isLoading) {
            getMore();
          }
        },
        { threshold: 1.0 }
      );
      observer.observe(observerRef.current);
      return () => observer.disconnect();
    }
  }, [searchResults, HasMore, isLoading, getMore]);

  const toggleSidebar = () => {
    dispatch(setIsSearchSidebarOpen(!isSearchSidebarOpen));
  };

  const [isRowView, setIsRowView] = useState(false);

  const toggleView = () => {
    setIsRowView(!isRowView);
  };
  return (
    <div className="min-h-[92.5svh] bg-gray-50">
      <div className=" mx-auto px-4 py-8">
        <div className="flex justify-end items-center w-full px-5 lg:px-10">
          <button
            onClick={toggleView}
            className="px-3 py-1 border border-gray-200 rounded text-sm text-teal-700 hover:bg-gray-100"
          >
            تغيير العرض {isRowView ? "صورة" : "قائمة"}
          </button>
          <div className=" lg:hidden">
            <button
              onClick={toggleSidebar}
              className="px-3 py-1 hover:bg-gray-100 "
            >
              <span className="flex items-center justify-center text-teal-500 text-2xl ">
                <HiMenuAlt2 />
              </span>
            </button>
          </div>
        </div>
        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex justify-center items-center">
            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent border-solid rounded-full animate-spin"></div>
          </div>
        )}

        {/* {!isLoading && searchResults?.length === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
            <div className="col-span-1 lg:col-span-3 xl:col-span-2 ">
              <SearchFilter />
            </div>
            <div className="col-span-1 lg:col-span-7 xl:col-span-8">
              <NoProducts />
            </div>
          </div>
        )} */}

        {searchResults?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
            <div className="col-span-1 lg:col-span-3 xl:col-span-2 min-w-40">
              <SearchFilter />
            </div>
            <div className="col-span-1 lg:col-span-7 xl:col-span-8 flex flex-col justify-between lg:px-10 min-h-[80svh]">
              <SearchProductsContainer
                products={searchResults}
                isRowView={isRowView}
              />
              <div className="flex justify-center items-center mt-4 py-10">
                {/* <button
                  onClick={getMore}
                  disabled={!HasMore || isLoading}
                  className="bg-teal-500 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading
                    ? "جاري التحميل..."
                    : HasMore
                    ? "تحميل المزيد"
                    : "لا يوجد نتائج أكثر"}
                </button> */}
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent border-solid rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    {!HasMore && !isLoading && (
                      <span className="text-gray-500">لا توجد نتائج أكثر</span>
                    )}
                  </div>
                )}
              </div>
              <div ref={observerRef} className="h-10 w-full"></div>
            </div>
          </div>
        ) : (
          !isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
              <div className="col-span-1 lg:col-span-3 xl:col-span-2 min-w-40">
                <SearchFilter />
              </div>
              <div className="col-span-1 lg:col-span-7 xl:col-span-8 flex flex-col justify-between lg:px-10 min-h-[80svh]">
                <NoProducts />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Search;
