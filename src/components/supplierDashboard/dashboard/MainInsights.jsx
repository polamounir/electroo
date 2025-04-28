import MainInsightsCard from "./MainInsightsCard";

export default function MainInsights() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      <MainInsightsCard />
      <MainInsightsCard />
      <MainInsightsCard />
      <MainInsightsCard />
    </div>
  );
}
