import { useEffect, useState } from "react";

function ProductCard({ product, isRowView }) {
  return (
    <div
      className={`border p-4 rounded shadow-sm transition-all ${
        isRowView ? "flex flex-col sm:flex-row gap-4" : ""
      }`}
    >
      <img
        src={product.images?.[0] || "/fallback.jpg"}
        alt={product.title || "Product image"}
        className={`rounded-md object-cover ${
          isRowView ? "w-full sm:w-48 h-48" : "w-full h-48"
        }`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/fallback.jpg";
        }}
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{product.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
        <p className="text-blue-600 font-bold">${product.price}</p>
      </div>
    </div>
  );
}

export default function SearchProductsContainer({ products }) {
  const [columns, setColumns] = useState(3);
  const [isRowView, setIsRowView] = useState(false);
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  // Update screen width on resize
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial value
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Force row view on small screens and manage column state
  useEffect(() => {
    const maxCols = maxColumnsAllowed();
    if (columns > maxCols) {
      setColumns(maxCols); // Adjust columns on resize
    }

    // Toggle row view based on screen width
    if (screenWidth < 640) {
      setIsRowView(true);
    } else {
      setIsRowView(false); // Optionally preserve user choice
    }
  }, [screenWidth, columns]);

  // Determine which column buttons to show
  const maxColumnsAllowed = () => {
    if (screenWidth < 640) return 1;
    if (screenWidth < 768) return 2;
    if (screenWidth < 1024) return 3;
    return 5; // Allow up to 5 columns on large screens
  };

  const handleColumnChange = (num) => {
    setIsRowView(false);
    setColumns(num);
  };

  // Conditional class for grid columns based on user choice and screen width
  const gridColsClass = () => {
    if (isRowView) return "grid-cols-1";
    switch (columns) {
      case 1:
        return "grid-cols-1 sm:grid-cols-1";
      case 2:
        return "grid-cols-1 sm:grid-cols-2";
      case 3:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
      case 4:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-4";
      case 5:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5";
      default:
        return "grid-cols-1";
    }
  };

  return (
    <div className="px-4 py-6">
      {/* Layout Buttons */}
      {screenWidth >= 640 && (
        <div className="flex flex-wrap gap-2 mb-6 items-center">
          {[1, 2, 3, 4, 5]
            .filter((num) => num <= maxColumnsAllowed()) // Now including 5 as a valid option
            .map((num) => (
              <button
                key={num}
                onClick={() => handleColumnChange(num)}
                className={`px-4 py-2 border rounded transition ${
                  columns === num && !isRowView
                    ? "bg-teal-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {num} Col{num > 1 ? "s" : ""}
              </button>
            ))}
          <button
            onClick={() => setIsRowView(true)}
            className={`px-4 py-2 border rounded transition ${
              isRowView
                ? "bg-teal-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Row View
          </button>
        </div>
      )}

      {/* Product Grid */}
      <div className={`grid gap-4 ${gridColsClass()}`}>
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isRowView={isRowView}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
}
