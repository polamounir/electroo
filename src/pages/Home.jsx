import { useQuery } from "@tanstack/react-query";
import HomeSection from "../components/home/HomeSection";
import Landing from "../components/home/Landing";
import MainSlider from "../components/home/MainSlider";
import CategorySlider from "../components/home/CategorySlider";
import BrandSlider from "../components/home/BrandSlider";
import { api } from "../api/axiosInstance";
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
          Limit: 20,
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
        <HomeSection
          title="عروض اليوم"
          products={discounts}
          loading={discountLoading}
          error={discountError}
        />
        <HomeSection
          title="الاكثر مبيعاً"
          products={sales}
          loading={salesLoading}
          error={salesError}
        />
        <HomeSection
          title="أحدث المنتجات"
          products={newProducts}
          loading={newProductsLoading}
          error={newProductError}
        />
      </div>
    </div>
  );
}
