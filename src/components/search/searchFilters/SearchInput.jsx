import React from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "../../../app/slices/searchSlice";

const SearchInput = () => {
  const dispatch = useDispatch();
  const SearchQuery = useSelector((state) => state.search.SearchQuery);

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // Trigger search if needed
    }
  };

  return (
    <div className="mb-6">
      <div className="relative">
        <input
          type="text"
          placeholder="ابحث عن منتج..."
          className="w-full border-2 border-gray-300 rounded-lg p-3 pe-12 text-right focus:outline-none text-black focus:ring-teal-500 focus:border-transparent transition-all"
          value={SearchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
        />
        <div className="absolute left-3 top-3 text-gray-400">
          <FaSearch className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
