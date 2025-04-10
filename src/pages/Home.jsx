import { useQuery } from "@tanstack/react-query";
import HomeSection from "../components/home/HomeSection";
import Landing from "../components/home/Landing";

export default function Home() {
  const { data } = useQuery({
    queryKey: ["home"],
    queryFn: async () => {
      const res = await fetch(
        "https://ecommerce.zerobytetools.com/api/products?Page=1&Limit=10"
      );

      const data = res.json();
      return data;
    },
  });
  console.log(data);

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
