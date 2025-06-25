import { useDispatch, useSelector } from "react-redux";
import { FiSearch } from "react-icons/fi";
import { useState, useEffect, useCallback } from "react";
import {
  fetchSearchingProducts,
  setSearchQuery,
} from "../../app/slices/searchingSlice";
import { debounce } from "lodash";

export default function SearchInput({ term }) {
  const dispatch = useDispatch();
  const searchQuery = useSelector((state) => state.searching.searchQuery);
  const [searchTerm, setSearchTerm] = useState(searchQuery || term);

  // Memoize the debounced search function
  const debouncedSearch = useCallback(
    debounce((term) => {
      dispatch(setSearchQuery(term));
      dispatch(fetchSearchingProducts());
    }, 500),
    [dispatch]
  );

  // Sync local state with Redux when it changes externally
  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  const handleSearchQuery = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div className="relative mb-6">
      <div className="absolute end-0 top-1/2 -translate-y-1/2 pl-4 flex items-center pointer-events-none z-10">
        <FiSearch className="h-5 w-5 text-gray-800" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchQuery}
        placeholder="ابحث عن منتجات، ماركات، فئات..."
        className="w-full pe-12 ps-4 py-3 text-lg border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md bg-white/80 backdrop-blur-sm"
      />
    </div>
  );
}
