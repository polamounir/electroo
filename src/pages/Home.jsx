import HomeSection from "../components/home/HomeSection";
import Landing from "../components/home/Landing";

export default function Home() {
  return (
    <div className="">
      <Landing />
      <HomeSection title="عروض اليوم" products={""}/>
      <HomeSection title="الاكثر مبيعاً" products={""}/>
      <HomeSection title="أحدث المنتجات" products={""}/>
    </div>
  );
}
