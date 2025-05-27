import { useState, useEffect } from 'react';
import { api } from '../api/axiosInstance';
import { toast } from 'sonner';

export const useProductImages = (productId, initialImages = []) => {
  const [productImages, setProductImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialImages?.length > 0) {
      const formattedImages = initialImages.map(img => {
        if (typeof img === 'string') {
          return { url: img };
        } else if (img.imageUrl && img.imageId) {
          return { id: img.imageId, url: img.imageUrl };
        } else {
          return img;
        }
      });

      setProductImages(formattedImages);
      setPreviewImages(formattedImages);
    }
  }, [initialImages]);

  const handleDeleteImage = async (image) => {
    if (!image.id) {
      toast.error('لا يمكن حذف هذه الصورة');
      return;
    }

    try {
      await api.delete(`/products/images/${image.id}`);

      setProductImages(prev => prev.filter(img => img.id !== image.id));
      setPreviewImages(prev => prev.filter(img => img.id !== image.id));

      toast.success('تم حذف الصورة بنجاح');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('خطأ في حذف الصورة');
    }
  };

  const handleAddImages = async (files) => {
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    const tempPreviews = filesArray.map(file => ({
      url: URL.createObjectURL(file)
    }));

    setPreviewImages(prev => [...prev, ...tempPreviews]);
    setIsUploading(true);

    const formData = new FormData();
    filesArray.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });

    try {
      const response = await api.put(`/products/${productId}/images`, formData);

      if (response.data?.status === 'Successful' && response.data?.data) {
        const uploadedImages = response.data.data.map(img => ({
          id: img.imageId,
          url: img.imageUrl
        }));

        setProductImages(prev => [...prev, ...uploadedImages]);
        setPreviewImages(prev => {
          const withoutTempUrls = prev.slice(0, -(filesArray.length));
          return [...withoutTempUrls, ...uploadedImages];
        });

        toast.success(response.data.message || 'تم رفع الصور بنجاح');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('خطأ في رفع الصور');
    } finally {
      setIsUploading(false);
    }
  };

  return {
    productImages,
    previewImages,
    isUploading,
    handleDeleteImage,
    handleAddImages,
  };
};
