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
import NewHomeSection from "../components/home/NewHomeSection";
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
          // SearchQuery: "2",
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
      const res = await api.get("/products/most-sold", {
        params: {
          Page: 1,
          Limit: 20,
          HasDiscount: false,
          // SearchQuery: "2",
        },
      });
      // console.log(res.data.data)
      return res.data.data;
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
      return res.data.data.items;
    },
  });

  return (
    <div className="overflow-hidden">
      {/* <Landing /> */}
      <MainSlider />
      <BrandSlider />
      <div className="">
        <div className="h-5 w-full"></div>

        <CategorySlider />

        <div className="h-10 w-full"></div>

        <HomeSection
          title="الاكثر مبيعاً"
          products={sales}
          loading={salesLoading}
          error={salesError}
          more="/search?"
        />
        <div className="h-10 w-full"></div>
        <NewHomeSection
          title="عروض اليوم"
          products={discounts}
          loading={discountLoading}
          error={discountError}
          more="/search?HasDiscount=true"
        />
        {/* <HomeSection
          title="عروض اليوم"
          products={discounts}
          loading={discountLoading}
          error={discountError}
          more="/search?HasDiscount=true"
        /> */}

        <div className="h-10 w-full"></div>
        <HomeSection
          title="كل المنتجات "
          products={newProducts}
          loading={newProductsLoading}
          error={newProductError}
          more="/search"
        />
      </div>
    </div>
  );
}
