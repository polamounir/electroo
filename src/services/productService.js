import { api } from '../api/axiosInstance';

export const productService = {
  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update product');
    }
  },

  validateProduct: (product) => {
    const errors = {};

    if (!product.title?.trim()) {
      errors.title = 'اسم المنتج مطلوب';
    }

    if (!product.price || product.price <= 0) {
      errors.price = 'السعر يجب أن يكون أكبر من صفر';
    }

    if (!product.categoryId) {
      errors.categoryId = 'فئة المنتج مطلوبة';
    }

    if (!product.description?.trim()) {
      errors.description = 'وصف المنتج مطلوب';
    }

    if (product.stock < 0) {
      errors.stock = 'المخزون لا يمكن أن يكون سالب';
    }

    if (product.discountPercentage < 0 || product.discountPercentage > 100) {
      errors.discountPercentage = 'نسبة الخصم يجب أن تكون بين 0 و 100';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};