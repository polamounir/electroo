import { Outlet } from "react-router-dom";


export default function AdminSuppliersLayout() {
  return (
    <div className="border border-gray-300 p-2 md:p-10  rounded-xl shadow-xl">
      <Outlet />
    </div>
  );
}
