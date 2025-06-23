import CircularProgress from "../../ui/CircularProgress";

export default function MainInsightsCard({ data, icon, title }) {
  const percentage = Math.floor(Math.random() * 100);

  return (
    <div className="border group border-gray-200 p-5 py-10 shadow-xl rounded-xl hover:scale-105 duration-300 border-e-4 border-e-teal-500">
      <div className="flex justify-between">
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-semibold"> {data}</h2>
          <p className="text-xl">{title}</p>
        </div>
        <div>
          <div className="w-20 h-20 bg-gray-100 rounded-full flex justify-center items-center">
            {/* <CircularProgress value={percentage} /> */}
            <span className="text-5xl text-teal-600 group-hover:text-teal-500 duration-300">{icon}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
