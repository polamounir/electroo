import React from "react";
import { useDispatch } from "react-redux";
import {
  clearSearchResults,
  getfilterSearchResults,
} from "../../app/slices/searchSlice";
import { useNavigate } from "react-router-dom";

const ApplyButtons = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleApply = async () => {
    await dispatch(clearSearchResults());
    await dispatch(getfilterSearchResults({}));
    // Update URL based on current filters
    const searchParams = new URLSearchParams();
    // Add all current filter params to URL
    navigate(`/search?${searchParams.toString()}`);
  };

  const handleReset = () => {
    dispatch(clearSearchResults());
    // Dispatch reset actions for all filters
    navigate("/search");
  };

  return (
    <div className="mt-4 flex flex-col gap-2">
      <button
        onClick={handleApply}
        className="w-full py-3 px-6 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-teal-500/30 hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 transform hover:-translate-y-0.5"
      >
        تطبيق الفلتر
      </button>
      <button
        onClick={handleReset}
        className="py-3 px-6 text-teal-500 self-end"
      >
        اعادة البحث
      </button>
    </div>
  );
};

export default ApplyButtons;
