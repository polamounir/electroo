import React from 'react';

const ProductForm = ({
  product,
  categoryId,
  categories,
  onChange,
  onSubmit,
  isLoading,
  errors = {},
}) => {
  const inputClassName = (fieldName) =>
    `mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
      errors[fieldName] 
        ? 'border-red-500 focus:ring-red-500' 
        : 'border-gray-300'
    }`;

  const ErrorMessage = ({ message }) =>
    message ? <p className="text-red-500 text-sm mt-1">{message}</p> : null;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Title and Price Row */}
      <div className="flex gap-5 flex-col md:flex-row">
        <div className="flex-1 flex flex-col">
          <label htmlFor="title" className="text-lg text-gray-700">
            الاسم *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={product.title}
            onChange={onChange}
            className={inputClassName('title')}
            required
          />
          <ErrorMessage message={errors.title} />
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="price" className="text-lg text-gray-700">
            السعر *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={product.price}
            onChange={onChange}
            min="0"
            step="1"
            className={inputClassName('price')}
            required
          />
          <ErrorMessage message={errors.price} />
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <label htmlFor="description" className="text-lg text-gray-700">
          الوصف *
        </label>
        <textarea
          id="description"
          name="description"
          value={product.description}
          onChange={onChange}
          className={inputClassName('description')}
          rows="4"
          required
        />
        <ErrorMessage message={errors.description} />
      </div>

      {/* Stock and Discount Row */}
      <div className="flex gap-5 flex-col md:flex-row">
        <div className="flex-1 flex flex-col">
          <label htmlFor="stock" className="text-lg text-gray-700">
            المخزن
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={product.stock}
            onChange={onChange}
            min="0"
            className={inputClassName('stock')}
          />
          <ErrorMessage message={errors.stock} />
        </div>

        <div className="flex-1 flex flex-col">
          <label htmlFor="discountPercentage" className="text-lg text-gray-700">
            نسبة الخصم (%)
          </label>
          <input
            type="number"
            id="discountPercentage"
            name="discountPercentage"
            value={product.discountPercentage}
            onChange={onChange}
            min="0"
            max="100"
            step="0.01"
            className={inputClassName('discountPercentage')}
          />
          <ErrorMessage message={errors.discountPercentage} />
        </div>
      </div>

      {/* SKU and Brand Row */}
      <div className="flex gap-5 flex-col md:flex-row">
        <div className="flex-1 flex flex-col">
          <label htmlFor="sku" className="text-lg text-gray-700">
            SKU
          </label>
          <input
            type="text"
            id="sku"
            name="sku"
            value={product.sku}
            onChange={onChange}
            className={inputClassName('sku')}
          />
        </div>
        
        <div className="flex-1 flex flex-col">
          <label htmlFor="brand" className="text-lg text-gray-700">
            العلامة التجارية
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={product.brand}
            onChange={onChange}
            className={inputClassName('brand')}
          />
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-col">
        <label htmlFor="tags" className="text-lg text-gray-700">
          العلامات
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={product.tags}
          onChange={onChange}
          className={inputClassName('tags')}
          placeholder="افصل العلامات بفواصل"
        />
      </div>

      {/* Category */}
      <div className="flex flex-col">
        <label htmlFor="categoryId" className="text-lg text-gray-700">
          فئة المنتج *
        </label>
        <select
          name="categoryId"
          id="categoryId"
          onChange={onChange}
          value={categoryId}
          className={inputClassName('categoryId')}
          required
        >
          <option value="">اختار فئة المنتج</option>
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))
          ) : (
            <option disabled>لا توجد فئات متاحة</option>
          )}
        </select>
        <ErrorMessage message={errors.categoryId} />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 justify-center bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'جاري التحديث...' : 'تعديل المنتج'}
      </button>
    </form>
  );
};

export default ProductForm;