import HomeSection from "../components/home/HomeSection";
import Landing from "../components/home/Landing";

export default function Home() {
  return (
    <div className="">
      <Landing />
      <div className="pb-20">
        <HomeSection title="عروض اليوم" products={""} />
        <HomeSection title="الاكثر مبيعاً" products={""} />
        <HomeSection title="أحدث المنتجات" products={""} />
      </div>
    </div>
  );
}
