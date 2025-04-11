import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

export default function SupplierRegisteration() {
  const { progress } = useSelector((state) => state.supplier);

  return (
    <div className="min-h-[70vh]  p-10">
      <div className="w-full md:w-[85%] m-auto">
        <strong>رجاء التاكد من البيانات !!</strong>
        {/* <h2>{progress}</h2> */}
        <div className="pe-3">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
            <div
              className="bg-teal-500 h-2.5 rounded-full  relative transition-all duration-500"
              style={{ width: `${progress}%` }}
            >
              <span className="text-lg absolute -end-2 top-0 bottom-0 flex justify-center items-center">
                🤝
              </span>
            </div>
          </div>
        </div>
        <div className="lg:mt-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
