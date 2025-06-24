import React, { useState } from "react";
import { FaChevronUp, FaTh } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { setCategoryId } from "../../../app/slices/searchSlice";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../api/axiosInstance";

const CategoriesFilter = () => {
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(true);
  const CategoryId = useSelector((state) => state.search.CategoryId);

  const { data: categories } = useQuery({
    queryKey: ["searchCategories"],
    queryFn: () => api.get("/categories?Page=1&Limit=100"),
  });

  const handleCategoryChange = (id) => {
    dispatch(setCategoryId(id === CategoryId ? null : id));
  };

  return (
    <div className="mb-4 bg-gray-750 rounded-lg overflow-hidden">
      <div
        className="flex justify-between items-center py-3 px-3 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setCollapsed(!collapsed)}
      >
        <h3 className="font-bold text-teal-800 flex items-center gap-2">
          <FaTh className="h-5 w-5" />
          الفئات
        </h3>
        <FaChevronUp
          className={`text-teal-800 transition-transform duration-300 ${
            collapsed ? "rotate-180" : ""
          }`}
        />
      </div>
      {!collapsed && (
        <div className="py-3 px-3 space-y-2 overflow-y-auto max-h-60">
          {categories?.data.data.items.map((category) => (
            <div
              key={category.id}
              className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <label className="relative flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-gray-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-gray-500 before:opacity-0 before:transition-opacity checked:border-teal-500 checked:bg-white checked:before:bg-teal-500 hover:before:opacity-10"
                  checked={CategoryId === category.id}
                  onChange={() => handleCategoryChange(category.id)}
                />
                <span className="absolute text-red-500 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                  <FaCheck className="h-3.5 w-3.5" />
                </span>
              </label>
              <span>{category.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesFilter;
