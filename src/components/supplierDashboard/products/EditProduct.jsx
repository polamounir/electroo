import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useProduct } from '../../../hooks/useProduct';
import { useCategories } from '../../../hooks/useCategories';
import { useProductForm } from '../../../hooks/useProductForm';
import ProductForm from './ProductForm';
import ProductImageManager from './ProductImageManger';
import { useProductImages } from '../../../hooks/useProductImages';
import ErrorDisplay from '../../ui/ErrorDisplay';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { productService } from '../../../services/productService';



const EditProduct = () => {
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch product data
  const { 
    data: productData, 
    isLoading: isProductLoading, 
    isError: isProductError, 
    error: productError,
    refetch: refetchProduct 
  } = useProduct(id);

  // Fetch categories
  const { 
    data: categories, 
    isLoading: isCategoriesLoading, 
    isError: isCategoriesError 
  } = useCategories();

  // Form management
  const { product, categoryId, handleChange } = useProductForm(productData, categories);

  // Image management
  const {
    previewImages,
    isUploading,
    handleDeleteImage,
    handleAddImages,
  } = useProductImages(id, productData?.images);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate product data
    const { isValid, errors } = productService.validateProduct(product);
    
    if (!isValid) {
      setValidationErrors(errors);
      toast.error('يرجى تصحيح الأخطاء في النموذج');
      return;
    }

    setValidationErrors({});
    setIsSubmitting(true);

    try {
      await productService.updateProduct(id, product);
      toast.success('تم تحديث المنتج بنجاح');
 
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error.message || 'خطأ في تحديث المنتج');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isProductLoading || isCategoriesLoading) {
    return <LoadingSpinner message="جاري تحميل بيانات المنتج..." />;
  }

  // Error state
  if (isProductError) {
    return (
      <ErrorDisplay 
        message={productError || 'خطأ في تحميل بيانات المنتج'} 
        onRetry={refetchProduct}
      />
    );
  }

  if (isCategoriesError) {
    return <ErrorDisplay message="خطأ في تحميل الفئات" />;
  }

  if (!productData) {
    return <ErrorDisplay message="لم يتم العثور على المنتج" />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-teal-500 mb-2">
          تعديل بيانات المنتج
        </h2>
        <p className="text-gray-600">
          قم بتحديث معلومات المنتج والصور حسب الحاجة
        </p>
      </div>

      <div className="space-y-8">
        {/* Product Form */}
        <ProductForm
          product={product}
          categoryId={categoryId}
          categories={categories}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          errors={validationErrors}
        />

        {/* Image Manager */}
        <ProductImageManager
          previewImages={previewImages}
          onDeleteImage={handleDeleteImage}
          onAddImages={handleAddImages}
          isUploading={isUploading}
        />
      </div>
    </div>
  );
};

export default EditProduct;