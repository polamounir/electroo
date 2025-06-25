import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCategoryId } from "../../app/slices/searchingSlice";

export default function CategoryFilter() {
  const dispatch = useDispatch();
  const selectedCategoryId = useSelector(
    (state) => state.searching.selectedCategoryId
  );

  const {
    data: categoriesData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get("categories?Page=1&Limit=50");
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    select: (data) => {
      // Handle different possible response structures
      if (Array.isArray(data)) return data;
      if (data?.data?.items) return data.data.items;
      if (data?.items) return data.items;
      return [];
    },
  });

  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  const handleCategoryChange = (categoryId) => {
    dispatch(setSelectedCategoryId(categoryId));
  };

  if (isLoading) {
    return (
      <div className="p-4 animate-pulse">
        <div className="h-6 w-1/2 bg-gray-200 rounded mb-4"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 rounded mb-2"></div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg">
        خطأ في تحميل الفئات: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <svg
          className="w-5 h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <h4 className="font-semibold text-lg text-gray-800">الفئات</h4>
      </div>

      <div className="space-y-2">
        <ul className="space-y-2 overflow-y-auto">
          <li>
            <button
              onClick={() => handleCategoryChange("")}
              className={`w-full text-right px-4 py-3 rounded-lg transition-all duration-200 flex items-center ${
                !selectedCategoryId
                  ? "bg-teal-50 border border-teal-200"
                  : "hover:bg-gray-50 border border-gray-100"
              }`}
            >
              <div
                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  !selectedCategoryId
                    ? "border-teal-500 bg-teal-500"
                    : "border-gray-300"
                }`}
              >
                {!selectedCategoryId && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <span
                className={`mr-3 ${
                  !selectedCategoryId
                    ? "text-teal-700 font-medium"
                    : "text-gray-700"
                }`}
              >
                الكل
              </span>
            </button>
          </li>

          {categories.length > 0 ? (
            categories.map((category) => (
              <li key={category.id}>
                <button
                  onClick={() => handleCategoryChange(category.id)}
                  className={`w-full text-right px-4 py-3 rounded-lg transition-all duration-200 flex items-center ${
                    selectedCategoryId === category.id
                      ? "bg-teal-50 border border-teal-200"
                      : "hover:bg-gray-50 border border-gray-100"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedCategoryId === category.id
                        ? "border-teal-500 bg-teal-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedCategoryId === category.id && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span
                    className={`mr-3 ${
                      selectedCategoryId === category.id
                        ? "text-teal-700 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {category.name}
                  </span>
                </button>
              </li>
            ))
          ) : (
            <li className="p-4 text-gray-500 text-center">
              لا توجد فئات متاحة
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
