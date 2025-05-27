import React from 'react';
import { FaTrash, FaSpinner } from 'react-icons/fa';

const ProductImageManager = ({
  previewImages,
  onDeleteImage,
  onAddImages,
  isUploading,
}) => {
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files) {
      onAddImages(files);
    }
  };

  return (
    <div className="flex flex-col">
      <label htmlFor="images" className="text-lg text-gray-700 mb-2">
        الصور
      </label>
      
      {/* Image Grid */}
      <div className="flex gap-3 flex-wrap mb-4">
        {previewImages.map((image, index) => (
          <div className="relative group" key={index}>
            <img
              src={image.url || image}
              alt={`منتج ${index + 1}`}
              className="w-20 h-20 object-cover rounded-lg border border-gray-300"
            />
            <button
              type="button"
              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
              onClick={() => onDeleteImage(image)}
              aria-label="حذف الصورة"
            >
              <FaTrash size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* File Input */}
      <div className="flex justify-center">
        <label className="cursor-pointer py-2 px-5 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-opacity-50 transition-colors flex items-center gap-2">
          {isUploading && <FaSpinner className="animate-spin" />}
          {isUploading ? 'جاري الرفع...' : 'اضافة صور'}
          <input
            type="file"
            multiple
            accept="image/png, image/jpeg, image/jpg"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      </div>
      
      <p className="text-sm text-gray-500 text-center mt-2">
        يمكنك اضافة حتى 5 صور (PNG, JPEG, JPG)
      </p>
    </div>
  );
};

export default ProductImageManager;