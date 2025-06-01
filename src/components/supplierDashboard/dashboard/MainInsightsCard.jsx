import CircularProgress from "../../ui/CircularProgress";

export default function MainInsightsCard({ title, value, icon: Icon  , iconBgColor }) {
  const percentage = Math.floor(Math.random() * 100);

  // console.log("Percentage:", icon);

  return (
    <div className="border border-gray-200 p-5 py-10 shadow-xl rounded-xl">
      <div className="flex justify-between">
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-semibold"> {value} ج.م </h2>
          <p className="text-xl">{title}</p>
        </div>
        <div>
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-md ${iconBgColor}`}
          >
            {/* <CircularProgress value={percentage} /> */}

            <h2 className="text-3xl text-black">
              <Icon />
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
