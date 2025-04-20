import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSearchProducts } from "../api/product";
import SearchProductsContainer from "../components/search/SearchProductsContainer";

function Search() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchQuery = params.get("SearchQuery") || "";

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["searchResults", searchQuery],
    queryFn: () => fetchSearchProducts(searchQuery),
    enabled: !!searchQuery,
  });

  // Safely check the error message
  const errorMessage = isError && error ? error.message : "حدث خطأ غير معروف.";

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {" "}
      {/* Set direction to RTL */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-right">
          نتائج البحث لـ: <span className="text-teal-600">{searchQuery}</span>
        </h1>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex justify-center items-center">
            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent border-solid rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error Message */}
        {isError && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 text-right">
            <p>خطأ: {errorMessage}</p>
          </div>
        )}

        {/* No Results Message */}
        {!isLoading && data?.length === 0 && (
          <div className="text-center text-gray-500 py-6">
            <p>لم يتم العثور على نتائج.</p>
          </div>
        )}

        {/* Product Results */}
        {data?.length > 0 && <SearchProductsContainer products={data} />}
      </div>
    </div>
  );
}

export default Search;
