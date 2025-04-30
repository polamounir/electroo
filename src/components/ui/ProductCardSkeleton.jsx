export default function ProductCardSkeleton() {
  return (
    <div className="relative bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center animate-pulse">
      {/* Discount badge */}
      <div className="absolute top-4 end-4 bg-gray-300 rounded w-12 h-6"></div>

      {/* Image placeholder */}
      <div className="flex justify-center items-center min-h-60">
        <div className="w-full min-h-32 overflow-hidden rounded-lg flex justify-center bg-gray-200">
          {/* <div className="w-32 h-32 bg-gray-300 rounded"></div> */}
        </div>
      </div>

      {/* Title placeholder */}
      <div className="bg-gray-300 h-4 rounded mt-2 mb-2 w-full mx-auto"></div>

      {/* Star rating placeholder */}
      <div className="flex justify-start gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-gray-300 rounded-full"></div>
        ))}
      </div>

      {/* Price placeholders */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-left">
          <div className="bg-gray-300 h-4 w-20 rounded mb-2"></div>
          <div className="bg-gray-300 h-4 w-20 rounded"></div>
        </div>
        <div className="bg-gray-300 p-4 rounded-full"></div>
      </div>
    </div>
  );
}
