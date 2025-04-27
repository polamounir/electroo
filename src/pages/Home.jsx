import { useQuery } from "@tanstack/react-query";
import HomeSection from "../components/home/HomeSection";
import Landing from "../components/home/Landing";
import MainSlider from "../components/home/MainSlider";
import CategorySlider from "../components/home/CategorySlider";
import BrandSlider from "../components/home/BrandSlider";
export default function Home() {
  const { data } = useQuery({
    queryKey: ["home"],
    queryFn: async () => {
      const res = await fetch(
        "https://ecommerce.markomedhat.com/api/products?MinimumPrice=0&MaximumPrice=10000&Page=1&Limit=20"
      );
      // console.log(res);

      const data = res.json();
      // console.log(data);
      return data;
    },
  });
  // console.log(data);

  return (
    <div className="">
      {/* <Landing /> */}
      <MainSlider />
      <BrandSlider />
      <div className="pb-20">
        <CategorySlider />
        <HomeSection title="عروض اليوم" products={data} />
        <HomeSection title="الاكثر مبيعاً" products={data} />
        <HomeSection title="أحدث المنتجات" products={data} />
      </div>
    </div>
  );
}
