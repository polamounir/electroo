import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axiosInstance";
import { FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Categories() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const response = await api.get("categories?Page=1&Limit=50");
        if (
          !response.data ||
          !response.data.data ||
          !response.data.data.items
        ) {
          throw new Error("Invalid data structure received");
        }

        return response.data.data.items;
      } catch (error) {
        throw new Error(`Failed to fetch categories: ${error.message}`);
      }
    },
  });

  return (
    <div className="container mx-auto px-4 py-8 min-h-svh pt-25 pb-20">
      <h1 className="text-3xl font-bold mb-8 text-teal-500 border-b-2 border-teal-500 pb-2">
        تصنيفات المنتجات
      </h1>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <FaSpinner className="animate-spin text-teal-500 text-4xl mb-4" />
          <p className="text-gray-600">جاري تحميل التصنيفات...</p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-12 bg-red-50 rounded-lg">
          <FaExclamationTriangle className="text-red-500 text-4xl mb-4" />
          <p className="text-red-600 font-medium">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : Array.isArray(data) && data.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {data.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col h-full"
            >
              <div className="bg-gray-100 flex items-center justify-center aspect-square">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full "
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x200?text=No+Image";
                  }}
                />
              </div>
              <div className=" flex flex-col flex-grow justify-between text-xs md:text-l">
                <h3 className="font-semibold text-gray-800 mb-4 text-center line-clamp-2 p-2">
                  {category.name}
                </h3>
                <Link
                  to={`/categories/${category.id}`}
                  className="w-full py-2 flex items-center justify-center bg-teal-500 text-white rounded hover:bg-teal-600 transition"
                >
                  عرض المنتجات
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-500">لا توجد تصنيفات متاحة</p>
        </div>
      )}
    </div>
  );
}
