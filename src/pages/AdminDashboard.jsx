import React from "react";
import { Outlet } from "react-router";

import DashboardHeader from "../components/adminDashboard/DashboardHeader";
import AdminSideMenu from "../components/adminDashboard/AdminSideMenu";

// users/id/activate
// users/id/deactivate


export default function AdminDashboard() {
  return (
    <div className="min-h-[100vh] flex gap-10 md:ps-60 flex-col md:flex-row">
      <AdminSideMenu />
      <div className="w-full px-10 xl:px-15 py-10 flex flex-col gap-10">
        <DashboardHeader />
        <Outlet />
      </div>
    </div>
  );
}
