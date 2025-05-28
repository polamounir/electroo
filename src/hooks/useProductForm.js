import { useState, useEffect } from "react";

const initialProductState = {
  title: "",
  price: 0,
  discountPercentage: 0,
  stock: 0,
  sku: "",
  tags: "",
  brand: "",
  description: "",
  categoryId: "",
  category: "",
};

export const useProductForm = (initialData, categoriess) => {
  const [product, setProduct] = useState(initialProductState);
  const [categoryId, setCategoryId] = useState("");

  const categories = categoriess || [];

  useEffect(() => {
    if (initialData && categories) {
      const updatedProduct = {
        title: initialData.title || "",
        price: initialData.price || 0,
        discountPercentage: initialData.discountPercentage || 0,
        stock: initialData.stock || 0,
        sku: initialData.sku || "",
        tags: initialData.tags || "",
        brand: initialData.brand || "",
        description: initialData.description || "",
        categoryId: "",
        category: initialData.category || "",
      };

      setProduct(updatedProduct);

      // Set category ID based on category name
      if (initialData.category && Array.isArray(categories)) {
        const matchedCategory = categories.find(
          (cat) => cat.name === initialData.category
        );
        if (matchedCategory) {
          setCategoryId(matchedCategory.id);
          setProduct((prev) => ({ ...prev, categoryId: matchedCategory.id }));
        }
      }
    }
  }, [initialData, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "categoryId") {
      setCategoryId(value);
      const selectedCategory = categories?.find((cat) => cat.id === value);
      setProduct((prev) => ({
        ...prev,
        categoryId: value,
        category: selectedCategory?.name || "",
      }));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setProduct(initialProductState);
    setCategoryId("");
  };

  return {
    product,
    categoryId,
    handleChange,
    resetForm,
    setProduct,
  };
};
