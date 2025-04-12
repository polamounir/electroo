import { Outlet } from "react-router-dom";


export default function ProductsLayout() {
  return (
    <div className="border border-gray-300 p-10 rounded-xl shadow-xl">
      <Outlet />
    </div>
  );
}
