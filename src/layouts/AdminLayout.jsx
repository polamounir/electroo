import { Outlet } from "react-router-dom";
import SideMenu from "../components/adminDashboard/SideMenu";
import DashboardHeader from "../components/adminDashboard/DashboardHeader";

const AdminLayout = () => {
  return (
    <div className="min-h-[100vh] flex gap-10 md:ps-60 flex-col md:flex-row">
      <SideMenu />
      <div className="w-full px-10 xl:px-15 py-10 flex flex-col gap-10">
        <DashboardHeader />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
