import CircularProgress from "../../ui/CircularProgress";

export default function MainInsightsCard() {
  const percentage = Math.floor(Math.random() * 100);


  return (
    <div className="border border-gray-200 p-5 py-10 shadow-xl rounded-xl">
      <div className="flex justify-between">
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-semibold"> 20000 ج.م </h2>
          <p className="text-xl">مجموع المبيعات</p>
        </div>
        <div>
          <div className="w-20 h-20 bg-gray-100 rounded-full">
            <CircularProgress value={percentage} />
          </div>
        </div>
      </div>
    </div>
  );
}
