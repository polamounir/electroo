import { Outlet } from "react-router-dom";

import DashboardHeader from "../components/supplierDashboard/DashboardHeader";
import SupplierSideMenu from "../components/supplierDashboard/SupplierSideMenu";
import { api } from "../api/axiosInstance";
import { use, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLogedInSupplier } from "../app/slices/supplierSLice";
import AccountStatusCard from "../components/supplierDashboard/AccountStatusCard";

const AdminLayout = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supplierStatus, setSupplierStatus] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        const response = await api.get("/suppliers/me");
        setUserData(response.data.data);
        console.log("Supplier Data:", response.data.data);
        setSupplierStatus(response.data.data.verificationStatus);
        dispatch(setLogedInSupplier(response.data.data));
      } catch (err) {
        setError("Failed to fetch supplier data");
        console.error("Error fetching supplier data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierData();
  }, []);

  console.log("Supplier Data:", userData);

  return (
    <div className="min-h-[100svh] flex gap-10 lg:ps-60 flex-col md:flex-row">
      <SupplierSideMenu status={supplierStatus} />
      <div className="w-full px-1 md:px-10 xl:px-15 py-10 flex flex-col gap-10">
        <DashboardHeader />
        {loading && <div className="text-center">Loading...</div>}
        {error && <div className="text-red-500 text-center">{error}</div>}
        {!loading && !error && supplierStatus === "Verified" && (
          <div className="text-center pt-20">
            <Outlet />
          </div>
        )}

        {!loading && !error && supplierStatus === "Rejected" && (
          <div>
            <AccountStatusCard
              status="Rejected"
              message="البيانات التي قدمتها غير صحيحة أو غير مكتملة. يرجى مراجعة المعلومات وإعادة التقديم."
            />
          </div>
        )}
        {!loading && !error && supplierStatus === "Pending" && (
          <div>
            <AccountStatusCard
              status="Pending"
              message="يتم مراجعة طلبك من قبل فريقنا. يرجى الانتظار حتى يتم التحقق من حسابك."
            />
  
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLayout;
