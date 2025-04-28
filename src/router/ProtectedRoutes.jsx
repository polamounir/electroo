import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import Cookies from "js-cookie";

export default function ProtectedRoutes({ children }) {
  const { user, loading } = useSelector((state) => state.auth);
  const location = useLocation();
  if (loading) {
    return null;
  }

  // -----------------------------------------
  if (!user) {
    console.log("No user found in Redux store");
    toast.error("يرجى تسجيل الدخول اولاً");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  // -----------------------------------------
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isSupplierRoute = location.pathname.startsWith("/supplier");
  // -----------------------------------------
  if (isAdminRoute && user.role !== "Admin") {
    // toast.error("لا يوجد صلاحية للوصول إلى هذه الصفحة");
    return <Navigate to="/forbidden" state={{ from: location }} replace />;
  }
  if (isSupplierRoute && user.role !== "Supplier") {
    // toast.error("لا يوجد صلاحية للوصول إلى هذه الصفحة");
    return <Navigate to="/forbidden" state={{ from: location }} replace />;
  }
  // -----------------------------------------

  return children;
}
