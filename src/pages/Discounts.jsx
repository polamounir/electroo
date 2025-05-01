import { useQuery } from "@tanstack/react-query";
import React from "react";
import { api } from "../api/axiosInstance";
import { BsCartPlus } from "react-icons/bs";

export default function Discounts() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["discounts", "products"],
    queryFn: async () => {
      const res = await api.get("/products", {
        params: {
          Limit: 20,
          HasDiscount: true,
        },
      });
      return res.data;
    },
  });
  console.log(data, "discounts data");
  return (
    <div>
      <div className="py-20">
        <h1 className="text-3xl font-bold text-center title">الخصومات</h1>

        {isLoading && <div className="text-center py-8">جاري التحميل...</div>}

        {isError && (
          <div className="text-center py-8 text-red-500">
            حدث خطأ أثناء تحميل المنتجات
          </div>
        )}

        <div className="flex justify-center flex-wrap items-start gap-4 p-2  lg:px-20 mt-10">
          {data?.data?.items &&
            data.data.items.length > 0 &&
            data.data.items.map((product) => {
              return (
                <div
                  key={product.id}
                  className="w-[140px] sm:w-[200px] md:w-[250px] border border-teal-500 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow duration-200 relative"
                >
                  {/* Discount badge */}
                  {product.discountPercentage > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                      خصم {product.discountPercentage}٪
                    </div>
                  )}

                  {/* Image Container with fixed height */}
                  <div className="h-40 w-full flex items-center justify-center rounded overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Title */}
                  <h2 className="mt-2 text-sm sm:text-base font-semibold text-gray-800 truncate">
                    {product.title}
                  </h2>

                  {/* Price */}
                  <div className="mt-1 text-black font-bold text-sm sm:text-base">
                    {product.discountedPrice.toFixed(2)} جنيه
                  </div>

                  {/* Add to cart button */}
                   <div className="flex justify-end">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault(); 
                                // addToCart(id);
                              }}
                              className="text-teal-500 text-sm md:text-2xl border-2 border-teal-500 rounded-full p-2"
                            >
                              <BsCartPlus />
                            </button>
                          </div>
                </div>
              );
            })}

          {data?.data?.items && data.data.items.length === 0 && (
            <div className="text-center py-8 w-full">
              لا توجد منتجات بخصومات حالياً
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
