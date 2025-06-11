import { Outlet } from "react-router-dom";
import AdminSideMenu from "../components/adminDashboard/AdminSideMenu";
import DashboardHeader from "../components/adminDashboard/DashboardHeader";

const AdminLayout = () => {
  return (
    <div className="min-h-[100svh] flex gap-10 lg:ps-60 flex-col md:flex-row">
      <AdminSideMenu />
      <div className="w-full px-1 md:px-10 xl:px-15 py-10 flex flex-col gap-10">
        <DashboardHeader />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
