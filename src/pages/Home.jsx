import { useQuery } from "@tanstack/react-query";
import HomeSection from "../components/home/HomeSection";
import Landing from "../components/home/Landing";
import MainSlider from "../components/home/MainSlider";
import CategorySlider from "../components/home/CategorySlider";
import BrandSlider from "../components/home/BrandSlider";
import { api } from "../api/axiosInstance";
import ProductCardSkeleton from "../components/ui/ProductCardSkeleton";
import { Link } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { BsCartPlus } from "react-icons/bs";
export default function Home() {
  const {
    data: discounts,
    isLoading: discountLoading,
    isError: discountError,
  } = useQuery({
    queryKey: ["home", "dicouontProducts"],
    queryFn: async () => {
      const res = await api.get("/products", {
        params: {
          Page: 1,
          Limit: 20,
          HasDiscount: true,
          SearchQuery: "2",
        },
      });
      return res.data;
    },
  });
  const {
    data: sales,
    isLoading: salesLoading,
    isError: salesError,
  } = useQuery({
    queryKey: ["home", "sales"],
    queryFn: async () => {
      const res = await api.get("/products", {
        params: {
          Page: 1,
          Limit: 20,
          HasDiscount: false,
          SearchQuery: "2",
        },
      });
      return res.data;
    },
  });
  const {
    data: newProducts,
    isLoading: newProductsLoading,
    isError: newProductError,
  } = useQuery({
    queryKey: ["home", "newProducts"],
    queryFn: async () => {
      const res = await api.get("/products", {
        params: {
          Page: 1,
          Limit: 10,
          HasDiscount: false,
          SearchQuery: "ال",
        },
      });
      return res.data;
    },
  });

  return (
    <div className="">
      {/* <Landing /> */}
      <MainSlider />
      <BrandSlider />
      <div className="pb-20">
        <CategorySlider />
        {/*  */}
        <div>
          <div className="py-15 text-center text-3xl md:text-5xl ">
            <h2 className="title text-2xl lg:text-4xl">تيست</h2>
          </div>

          <div className="w-full bg-[#fafafa] py-15">
            <div className="w-full lg:w-[85%] m-auto shadow-none">
              <div className="slider-container">
                {newProducts === 0 && (
                  <div className="text-center text-2xl py-10">
                    لا توجد منتجات
                  </div>
                )}
                {!newProductsLoading && (
                  <div
                    aria-label={"products placeholder slider"}
                    className="flex justify-center flex-wrap items-start gap-4 p-2  lg:px-20 mt-10  "
                  >
                    {newProducts?.data?.items &&
                      newProducts.data.items.length > 0 &&
                      newProducts.data.items.map((product, index) => (
                        <div
                          key={product.id}
                          className="w-[140px] sm:w-[200px] md:w-[250px] bg-white rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow duration-200 relative"
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
                      ))}
                  </div>
                )}

                {newProductError && (
                  <div className="text-center text-2xl py-10">
                    حدث خطأ ما, حاول مرة اخرى
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center mt-5 show-more-box">
              <Link
                // to={`${more}`}
                className="bg-white px-20 py-2 rounded-full border border-gray-400 "
              >
                المزيد
                <span>
                  <IoArrowBack />
                </span>
              </Link>
            </div>
          </div>
        </div>
        {/*  */}
        <HomeSection
          title="عروض اليوم"
          products={discounts}
          loading={discountLoading}
          error={discountError}
          more="/discounts"
        />
        <HomeSection
          title="الاكثر مبيعاً"
          products={sales}
          loading={salesLoading}
          error={salesError}
          more="/sales"
        />
        <HomeSection
          title="كل المنتجات "
          products={newProducts}
          loading={newProductsLoading}
          error={newProductError}
          more="/all-products"
        />
      </div>
    </div>
  );
}
