import { Outlet } from "react-router-dom";

import DashboardHeader from "../components/supplierDashboard/DashboardHeader";
import SupplierSideMenu from "../components/supplierDashboard/SupplierSideMenu";

const AdminLayout = () => {
  return (
    <div className="min-h-[100vh] flex gap-10 md:ps-60 flex-col md:flex-row">
      <SupplierSideMenu />
      <div className="w-full px-1 md:px-10 xl:px-15 py-10 flex flex-col gap-10">
        <DashboardHeader />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
