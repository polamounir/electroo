import { useQuery } from "@tanstack/react-query";
import HomeSection from "../components/home/HomeSection";
import Landing from "../components/home/Landing";

export default function Home() {
  const { data } = useQuery({
    queryKey: ["home"],
    queryFn: async () => {
      const res = await fetch(
        "https://ecommerce.zerobytetools.com/api/products?MinimumPrice=0&MaximumPrice=10000&Page=1&Limit=20"
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
      <Landing />
      <div className="pb-20">
        <HomeSection title="عروض اليوم" products={data} />
        <HomeSection title="الاكثر مبيعاً" products={data} />
        <HomeSection title="أحدث المنتجات" products={data} />
      </div>
    </div>
  );
}
