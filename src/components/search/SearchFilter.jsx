import React, { useEffect, useState } from "react";
import { FaChevronUp, FaTh, FaList } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  getfilterSearchResults,
  clearSearchResults,
  setIsSearchSidebarOpen,
  setSearchParams,
} from "../../app/slices/searchSlice";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/axiosInstance";
import { IoClose } from "react-icons/io5";

export default function SearchFilter() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const MIN = 1;
  const MAX = 10000;
  const percentage = (val) => ((val - MIN) / (MAX - MIN)) * 100;

  const {
    limit,
    SearchQuery,
    MinimumPrice,
    MaximumPrice,
    HasDiscount,
    SortBy,
    OptionGroupName,
    OptionValue,
    isSearchSidebarOpen,
    CategoryId,
  } = useSelector((state) => state.search);

  const [rangeValues, setRangeValues] = useState([MIN, MAX]);
  const [showDiscounts, setShowDiscounts] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({
    filter: false,
    sortBy: true,
    viewMode: true,
    optionsGroup: true,
    categories: true,
  });

  const [sortOption, setSortOption] = useState("price-low-high");
  const [optionGroup, setOptionGroup] = useState(OptionGroupName || "");
  const [selectedOptionsValue, setSelectedOptionsValue] = useState(
    OptionValue || ""
  );
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState(SearchQuery || "");
  const [selectedCategory, setSelectedCategory] = useState(CategoryId || "");

  const handleRangeChange = (type, value) => {
    const val = parseInt(value) || 0;
    if (type === "min") {
      setRangeValues([Math.min(val, rangeValues[1]), rangeValues[1]]);
    } else {
      setRangeValues([rangeValues[0], Math.max(val, rangeValues[0])]);
    }
  };

  useEffect(() => {
    setRangeValues([MinimumPrice || MIN, MaximumPrice || MAX]);
    setShowDiscounts(HasDiscount|| false);
    setSortOption(SortBy || "price-low-high");
    setViewMode(viewMode);
  }, [MinimumPrice, MaximumPrice, HasDiscount, SortBy, viewMode]);

  const handleSearchEnter = (e) => {
    if (e.key === "Enter" || e.code === "Enter" || e.keyCode === 13) {
      updateSearchParams();
    }
  };

  const updateSearchParams = () => {
    dispatch(clearSearchResults());
    const MinimumPrice = rangeValues[0];
    const MaximumPrice = rangeValues[1];
    const HasDiscount = showDiscounts;
    const SortBy = sortOption;
    const ViewMode = viewMode;
    const OptionGroupName = optionGroup;
    const OptionValue = selectedOptionsValue;
    const CategoryId = selectedCategory;
    // dispatch(
    //   setSearchParams({
    //     SearchQuery: search,
    //     MinimumPrice,
    //     MaximumPrice,
    //     HasDiscount,
    //     SortBy,
    //     ViewMode,
    //     OptionGroupName,
    //     OptionValue,
    //     CategoryId,
    //   })
    // );
    // dispatch(
    //   getfilterSearchResults({
    //     SearchQuery: search,
    //     MinimumPrice,
    //     MaximumPrice,
    //     HasDiscount,
    //     SortBy,
    //     ViewMode,
    //     OptionGroupName,
    //     OptionValue,
    //     CategoryId,
    //   })
    // );

    // const searhLink = `/search?SearchQuery=${search}&CategoryId=${CategoryId}&MinimumPrice=${MinimumPrice}&MaximumPrice=${MaximumPrice}&HasDiscount=${HasDiscount}&SortBy=${SortBy}&Limit=${limit}&OptionGroupName=${optionGroup}&OptionValue=${selectedOptionsValue}`;
    const searhLink = `/search?${search !== "" ? `SearchQuery=${search}& `:""}${
      CategoryId !== "" ? `CategoryId=${CategoryId}&` : ""
    }MinimumPrice=${MinimumPrice}&MaximumPrice=${MaximumPrice}&HasDiscount=${HasDiscount}&SortBy=${SortBy}&Limit=${limit}`;
    navigate(searhLink);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const { data: productOptions } = useQuery({
    queryKey: ["searchProducts", "options"],
    queryFn: () => api.get("/product-options"),
  });

  const { data: categories } = useQuery({
    queryKey: ["searchCategories"],
    queryFn: () => api.get("/categories?Page=1&Limit=100"),
  });

  const resetSearchParams = () => {
    dispatch(setSearchParams({}));
    dispatch(getfilterSearchResults({}));
    navigate("/search");
  };

  return (
    <div
      className={`bg-white fixed lg:static0 w-xs z-[1000] lg:z-[200] lg:overflow-y-auto lg:h-svh  pt-10 lg:pt-20 flex flex-col p-6 lg:px-2 rounded-lg top-0 lg:right-0 duration-500  text-gray-100  h-[100svh] overflow-y-auto scrolling shadow-xl ${
        isSearchSidebarOpen ? "-right-0" : "-right-full"
      }`}
      dir="rtl"
    >
      <div className="lg:hidden text-3xl absolute top-4 end-4">
        <button
          onClick={() => {
            dispatch(setIsSearchSidebarOpen());
          }}
          className="text-teal-400 hover:text-teal-800 transition-colors"
        >
          <IoClose />
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-teal-800 bg-clip-text  bg-gradient-to-r from-teal-400 to-cyan-500">
        بحث متقدم
      </h2>

      {/* Search Input */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن منتج..."
            className="w-full border-2 border-gray-300 rounded-lg p-3 pe-12 text-right  focus:outline-none  text-black focus:ring-teal-500 focus:border-transparent transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchEnter}
          />
          <div className="absolute left-3 top-3 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-6  rounded-xl p-4 ">
        <div
          className="flex justify-between items-center py-3 cursor-pointer"
          onClick={() =>
            setCollapsedSections((prev) => ({ ...prev, filter: !prev.filter }))
          }
        >
          <h3 className="font-bold text-lg text-teal-800 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                clipRule="evenodd"
              />
            </svg>
            الفلتر
          </h3>
          <FaChevronUp
            className={`text-teal-800 transition-transform duration-300 ${
              collapsedSections.filter ? "rotate-180" : ""
            }`}
          />
        </div>

        {!collapsedSections.filter && (
          <div className="py-3 space-y-6">
            {/* Discounts */}
            <div className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
              <span className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-teal-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 5.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 10l1.293-1.293zm4 0a1 1 0 010 1.414L13.586 10l-1.293 1.293a1 1 0 01-1.414-1.414l3-3a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                التوفيرات
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showDiscounts}
                  onChange={() => setShowDiscounts(!showDiscounts)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
              </label>
            </div>

            {/* Sort By Category */}
            <div className="mb-4 bg-gray-750 rounded-lg overflow-hidden">
              <div
                className="flex justify-between items-center py-3 px-3 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() =>
                  setCollapsedSections((prev) => ({
                    ...prev,
                    categories: !prev.categories,
                  }))
                }
              >
                <h3 className="font-bold text-teal-800 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  الفئات
                </h3>
                <FaChevronUp
                  className={`text-teal-800 transition-transform duration-300 ${
                    collapsedSections.categories ? "rotate-180" : ""
                  }`}
                />
              </div>
              {!collapsedSections.categories && (
                <div className="py-3 px-3 space-y-2  overflow-y-auto">
                  {categories?.data.data.items.map((opt, index) => {
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-200 hover:text-white rounded-lg transition-colors"
                      >
                        <label className="relative flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="categoriesSelection"
                            className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-gray-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-gray-500 before:opacity-0 before:transition-opacity checked:border-teal-500 checked:bg-white checked:before:bg-teal-500 hover:before:opacity-10"
                            value={opt.id}
                            checked={selectedCategory === opt.id}
                            onChange={() => {
                              if (selectedCategory === opt.id) {
                                setSelectedCategory("");
                              } else {
                                setSelectedCategory(opt.id);
                              }
                            }}
                          />
                          <span className="absolute text-red-500 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3.5 w-3.5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              stroke="currentColor"
                              strokeWidth="1"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </span>
                        </label>
                        <span className="">{opt.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Price Range Slider */}
            <div className="bg-gray-750 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4 text-teal-800 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                    clipRule="evenodd"
                  />
                </svg>
                نطاق السعر
              </h2>
              <div className="relative h-8 mt-6">
                <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-1.5 bg-gray-600 rounded-full" />
                <div
                  className="absolute top-1/2 transform -translate-y-1/2 h-1.5 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full"
                  style={{
                    right: `${percentage(rangeValues[0])}%`,
                    width: `${
                      percentage(rangeValues[1]) - percentage(rangeValues[0])
                    }%`,
                  }}
                />
                {/* Min Slider */}
                <input
                  type="range"
                  min={MIN}
                  max={MAX}
                  value={rangeValues[0]}
                  onChange={(e) => handleRangeChange("min", e.target.value)}
                  className="absolute z-10 w-full pointer-events-none appearance-none h-1.5 bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-teal-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-teal-400/30 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110"
                />
                {/* Max Slider */}
                <input
                  type="range"
                  min={MIN}
                  max={MAX}
                  value={rangeValues[1]}
                  onChange={(e) => handleRangeChange("max", e.target.value)}
                  className="absolute w-full pointer-events-none appearance-none h-1.5 bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-cyan-500/30 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110"
                />
              </div>

              <div className="flex justify-between text-sm text-gray-300 mt-4">
                <span className="bg-gray-700 px-3 py-1 rounded-full">
                  {rangeValues[0]} ج م
                </span>
                <span className="bg-gray-700 px-3 py-1 rounded-full">
                  {rangeValues[1]} ج م
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Options Group Section */}
      {/* <div className="mb-6  rounded-xl p-4 ">
        <div
          className="flex justify-between items-center py-3 cursor-pointer"
          onClick={() =>
            setCollapsedSections((prev) => ({
              ...prev,
              optionsGroup: !prev.optionsGroup,
            }))
          }
        >
          <h3 className="font-bold text-lg text-teal-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            خيارات المنتج
          </h3>
          <FaChevronUp
            className={`text-teal-800 transition-transform duration-300 ${
              collapsedSections.optionsGroup ? "rotate-180" : ""
            }`}
          />
        </div>
        {!collapsedSections.optionsGroup && (
          <div className="py-3  overflow-y-auto">
            {productOptions?.data.data.map((option, idx) => (
              <div
                // className="p-3 rounded-lg"
                key={idx}
                // onClick={() => setOptionGroup(option.optionGroup)}
              >
                <span
                  className={`text-lg font-medium ${
                    optionGroup === option.optionGroup
                      ? "text-gray-800"
                      : "text-teal-400"
                  }`}
                >
                  {option.optionGroup}
                </span>
                <div className="flex flex-col gap-2 mt-3">
                  {option.values.map(
                    (opt, index) =>
                      opt.trim() !== "" && (
                        <div 
                          key={index} 
                          className="flex items-center gap-3 p-2 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                        >
                          <label className="relative flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="optionGroup"
                              className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-gray-400 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-gray-500 before:opacity-0 before:transition-opacity checked:border-teal-500 checked:bg-white checked:before:bg-teal-500 hover:before:opacity-10"
                              value={opt}
                              checked={selectedOptionsValue === opt}
                              onChange={(e) => {
                                if (selectedOptionsValue === opt) {
                                  setSelectedOptionsValue("");
                                  setOptionGroup("");
                                } else {
                                  setSelectedOptionsValue(e.target.value);
                                  setOptionGroup(option.optionGroup);
                                }
                              }}
                            />
                            <span className="absolute text-red-500 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                              </svg>
                            </span>
                          </label>
                          <span className="">{opt}</span>
                        </div>
                      )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div> */}

      {/* Apply Button */}
      <div className="mt-4 flex flex-col gap-2">
        <button
          onClick={updateSearchParams}
          className="w-full py-3 px-6 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-teal-500/30 hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-50"
        >
          تطبيق الفلتر
        </button>
        <button
          onClick={resetSearchParams}
          className="py-3 px-6 text-teal-500 self-end"
        >
          اعادة البحث
        </button>
      </div>
    </div>
  );
}
