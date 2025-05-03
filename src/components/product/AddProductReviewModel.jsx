import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addProductReview,
  closeProductReviewModal,
} from "../../app/slices/prouctReviewSlice";
import { FaTimes, FaStar, FaUpload, FaSpinner } from "react-icons/fa";

export default function AddProductReviewModal() {
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state) => state.productReview);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    stars: 5,
    reviewText: "",
    image: null,
  });

  const [errors, setErrors] = useState({
    stars: "",
    reviewText: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      stars: "",
      reviewText: "",
    };

    if (!formData.stars || formData.stars < 1 || formData.stars > 5) {
      newErrors.stars = "يرجى اختيار تقييم من 1 إلى 5 نجوم";
      isValid = false;
    }

    if (!formData.reviewText.trim()) {
      newErrors.reviewText = "مطلوب كتابة المراجعة";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStarClick = (rating) => {
    setFormData({ ...formData, stars: rating });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const reviewData = new FormData();
    reviewData.append("stars", formData.stars);
    reviewData.append("reviewText", formData.reviewText);
    if (formData.image) {
      reviewData.append("image", formData.image);
    }

    try {
      const result = await dispatch(addProductReview(reviewData));
      console.log(result);
      resetForm();
      dispatch(closeProductReviewModal());
    } catch (error) {
      console.error("حدث خطأ أثناء إضافة المراجعة:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      stars: 5,
      reviewText: "",
      image: null,
    });
    setErrors({
      stars: "",
      reviewText: "",
    });
    setPreviewUrl(null);
  };

  if (!isOpen) return null;

  return (
    <div
 
      className="fixed inset-0 bg-black/20 bg-opacity-50 flex justify-center items-center z-50 p-4"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b border-gray-300 p-4">
          <h2 className="text-xl font-semibold text-gray-800">
            إضافة مراجعة للمنتج
          </h2>
          <button
            onClick={() => dispatch(closeProductReviewModal())}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              التقييم
            </label>
            <div className="flex flex-row-reverse space-x-reverse space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  className="focus:outline-none"
                >
                  <FaStar
                    className={`w-6 h-6 ${
                      star <= formData.stars
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {errors.stars && (
              <p className="text-red-500 text-sm mt-1">{errors.stars}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="reviewText"
              className="block text-gray-700 font-medium mb-2"
            >
              مراجعتك
            </label>
            <textarea
              id="reviewText"
              name="reviewText"
              value={formData.reviewText}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="شاركنا تجربتك مع هذا المنتج..."
            />
            {errors.reviewText && (
              <p className="text-red-500 text-sm mt-1">{errors.reviewText}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              أضف صورة (اختياري)
            </label>
            <div className="mt-1 flex items-center">
              <label className="flex flex-col items-center px-4 py-6 bg-white text-teal-500 rounded-lg border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 w-full">
                <FaUpload className="w-8 h-8" />
                <span className="mt-2 text-sm font-medium">
                  اختر صورة للتحميل
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {previewUrl && (
              <div className="mt-3">
                <div className="relative w-full h-40">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-full mx-auto object-contain rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl(null);
                      setFormData({ ...formData, image: null });
                    }}
                    className="absolute top-0 left-0 bg-red-500 text-white p-1 rounded-full"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={() => dispatch(closeProductReviewModal())}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md ml-2 hover:bg-gray-300"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin ml-2 w-4 h-4" />
                  جارٍ الإرسال...
                </>
              ) : (
                "إرسال المراجعة"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
