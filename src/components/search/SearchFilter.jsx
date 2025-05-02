import React, { useEffect, useState } from "react";
import { FaChevronUp, FaTh, FaList } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  getSearchResults,
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
  } = useSelector((state) => state.search);

  const [rangeValues, setRangeValues] = useState([MIN, MAX]);
  const [showDiscounts, setShowDiscounts] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({
    filter: false,
    sortBy: false,
    viewMode: false,
    optionsGroup: false,
  });

  const [sortOption, setSortOption] = useState("price-low-high");
  const [optionGroup, setOptionGroup] = useState("");
  const [selectedOptionsValue, setSelectedOptionsValue] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState(SearchQuery || "");

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
    setShowDiscounts(HasDiscount);
    setSortOption(SortBy || "price-low-high");
    setViewMode(viewMode);
  }, [MinimumPrice, MaximumPrice, HasDiscount, SortBy, viewMode]);

  const handleSearchEnter = (e) => {
    if (e.key === "Enter" || e.code === "Enter" || e.keyCode === 13) {
      updateSearchParams();
    }
  };

  const updateSearchParams = () => {
    const MinimumPrice = rangeValues[0];
    const MaximumPrice = rangeValues[1];
    const HasDiscount = showDiscounts;
    const SortBy = sortOption;
    const ViewMode = viewMode;
    dispatch(
      setSearchParams({
        SearchQuery: search,
        MinimumPrice,
        MaximumPrice,
        HasDiscount,
        SortBy,
        ViewMode,
        optionGroup,
        selectedOptionsValue,
      })
    );
    dispatch(
      getSearchResults({
        SearchQuery: search,
        MinimumPrice,
        MaximumPrice,
        HasDiscount,
        SortBy,
        ViewMode,
        optionGroup,
        selectedOptionsValue,
      })
    );

    const searhLink = `/search?SearchQuery=${search}&MinimumPrice=${MinimumPrice}&MaximumPrice=${MaximumPrice}&HasDiscount=${HasDiscount}&SortBy=${SortBy}&ViewMode=${ViewMode}&Limit=${limit}?OptionGroupName=${optionGroup}&OptionValue=${selectedOptionsValue}`;
    navigate(searhLink);
  };
  const { data: productOptions } = useQuery({
    queryKey: ["searchProducts", "options"],
    queryFn: () => api.get("/product-options"),
  });
  console.log(productOptions?.data.data);
  return (
    <div
      className={`fixed lg:static w-xs z-[1000] lg:w-full pt-10 lg:pt-4  flex flex-col p-4 rounded  top-0 duration-500 bg-white lg:bg-transparent  h-[100svh] lg:h-auto overflow-y-auto scrolling ${
        isSearchSidebarOpen ? "-right-0" : "-right-full"
      }`}
      dir="rtl"
    >
      <div className="lg:hidden text-3xl absolute top-4 end-4">
        <button
          onClick={() => {
            dispatch(setIsSearchSidebarOpen());
          }}
        >
          <IoClose />
        </button>
      </div>

      <h2>بحث</h2>
      {/* Filter Section */}
      <div className="mb-4">
        <div>
          <input
            type="text"
            placeholder="ابحث عن منتج"
            className="w-full border border-gray-300 rounded p-2 text-right"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchEnter}
          />
        </div>
      </div>
      {/* Filter Section */}
      <div className="mb-4">
        <div
          className="flex justify-between items-center py-2 cursor-pointer border-b border-gray-200"
          onClick={() =>
            setCollapsedSections((prev) => ({ ...prev, filter: !prev.filter }))
          }
        >
          <h3 className="font-bold text-lg">فلتر</h3>
          <FaChevronUp
            className={`text-gray-600 transition-transform duration-200 ${
              collapsedSections.filter ? "rotate-180" : ""
            }`}
          />
        </div>

        {!collapsedSections.filter && (
          <div className="py-3 space-y-6">
            {/* Discounts */}
            <div className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-800">التوفيرات</span>
              <input
                type="checkbox"
                checked={showDiscounts}
                onChange={() => setShowDiscounts(!showDiscounts)}
                className="w-5 h-5 accent-teal-500"
              />
            </div>

            {/* Price Range Inputs */}
            {/* <div className="flex justify-between gap-4">
              <input
                type="number"
                min={MIN}
                max={rangeValues[1]}
                value={MinimumPrice || rangeValues[0]}
                onChange={(e) => handleRangeChange("min", e.target.value)}
                className="w-full border border-gray-300 rounded p-2 text-right"
              />
              <input
                type="number"
                min={rangeValues[0]}
                max={MAX}
                value={MaximumPrice || rangeValues[1]}
                onChange={(e) => handleRangeChange("max", e.target.value)}
                className="w-full border border-gray-300 rounded p-2 text-right"
              />
            </div> */}

            {/* Dual Range Slider */}
            <div>
              <h2>السعر</h2>
              <div className="relative h-6 mt-4">
                <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-2 bg-gray-200 rounded" />
                <div
                  className="absolute top-1/2 transform -translate-y-1/2 h-2 bg-teal-500 rounded"
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
                  className="absolute z-10 w-full pointer-events-none appearance-none h-2 bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-teal-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:z-10"
                />
                {/* Max Slider */}
                <input
                  type="range"
                  min={MIN}
                  max={MAX}
                  value={rangeValues[1]}
                  onChange={(e) => handleRangeChange("max", e.target.value)}
                  className="absolute w-full pointer-events-none appearance-none h-2 bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-teal-500 [&::-webkit-slider-thumb]:rounded-full"
                />
              </div>
            </div>

            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>{rangeValues[0]}</span>
              <span>{rangeValues[1]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Sort By OPtion */}
      <div className="mb-4">
        <div
          className="flex justify-between items-center py-2 cursor-pointer border-b border-gray-200"
          onClick={() =>
            setCollapsedSections((prev) => ({
              ...prev,
              optionsGroup: !prev.optionsGroup,
            }))
          }
        >
          <h3 className="font-bold text-lg">ترتيب حسب</h3>
          <FaChevronUp
            className={`text-gray-600 transition-transform duration-200 ${
              collapsedSections.optionsGroup ? "rotate-180" : ""
            }`}
          />
        </div>
        {!collapsedSections.optionsGroup && (
          <div className="py-3 space-y-2">
            {productOptions?.data.data.map((option) => (
              <div
                className=""
                onClick={() => setOptionGroup(option.optionGroup)}
              >
                <span
                  className={`text-gray-800 ${
                    sortOption === "price-low-high"
                      ? "font-bold text-teal-500"
                      : ""
                  }`}
                >
                  {option.optionGroup}
                </span>
                <div className="flex flex-col gap-2 mt-2">
                  {option.values.map(
                    (opt, index) =>
                      opt.trim() !== "" && (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="optionGroup"
                            className="w-5 h-5 accent-teal-500"
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
                          <span className="text-gray-800">{opt}</span>
                        </div>
                      )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price Sort By Section */}
      <div className="mb-4">
        <div
          className="flex justify-between items-center py-2 cursor-pointer border-b border-gray-200"
          onClick={() =>
            setCollapsedSections((prev) => ({ ...prev, sortBy: !prev.sortBy }))
          }
        >
          <h3 className="font-bold text-lg">ترتيب حسب السعر</h3>
          <FaChevronUp
            className={`text-gray-600 transition-transform duration-200 ${
              collapsedSections.sortBy ? "rotate-180" : ""
            }`}
          />
        </div>
        {!collapsedSections.sortBy && (
          <div className="py-3 space-y-2">
            <div
              className="cursor-pointer"
              onClick={() => setSortOption("price-low-high")}
            >
              <span
                className={`text-gray-800 ${
                  sortOption === "price-low-high"
                    ? "font-bold text-teal-500"
                    : ""
                }`}
              >
                السعر من الأقل للأعلى
              </span>
            </div>
            <div
              className="cursor-pointer"
              onClick={() => setSortOption("price-high-low")}
            >
              <span
                className={`text-gray-800 ${
                  sortOption === "price-high-low"
                    ? "font-bold text-teal-500"
                    : ""
                }`}
              >
                السعر من الأعلى للأدنى
              </span>
            </div>
            <div
              className="cursor-pointer"
              onClick={() => setSortOption("best-selling")}
            >
              <span
                className={`text-gray-800 ${
                  sortOption === "best-selling" ? "font-bold text-teal-500" : ""
                }`}
              >
                الأكثر مبيعاً
              </span>
            </div>
          </div>
        )}
      </div>

      {/* View Mode Section */}
      <div className="mb-4">
        <div
          className="flex justify-between items-center py-2 cursor-pointer border-b border-gray-200"
          onClick={() =>
            setCollapsedSections((prev) => ({
              ...prev,
              viewMode: !prev.viewMode,
            }))
          }
        >
          <h3 className="font-bold text-lg">طريقة العرض</h3>
          <FaChevronUp
            className={`text-gray-600 transition-transform duration-200 ${
              collapsedSections.viewMode ? "rotate-180" : ""
            }`}
          />
        </div>
        {!collapsedSections.viewMode && (
          <div className="py-3 space-y-2">
            <div
              className="flex items-center cursor-pointer gap-5 justify-between"
              onClick={() => setViewMode("grid")}
            >
              <span
                className={`text-gray-800 ${
                  viewMode === "grid" ? "font-bold text-teal-500" : ""
                }`}
              >
                عرض الشبكة
              </span>
              <FaTh className="mr-2" />
            </div>
            <div
              className="flex items-center cursor-pointer gap-5 justify-between"
              onClick={() => setViewMode("list")}
            >
              <span
                className={`text-gray-800 ${
                  viewMode === "list" ? "font-bold text-teal-500" : ""
                }`}
              >
                عرض القائمة
              </span>
              <FaList className="mr-2" />
            </div>
          </div>
        )}

        <div>
          <button
            onClick={updateSearchParams}
            className="bg-teal-500 text-white px-4 py-2 rounded-md w-full justify-center"
          >
            تطبيق الفلتر
          </button>
        </div>
      </div>
    </div>
  );
}
