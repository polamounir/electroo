import { useSelector, useDispatch } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
// Import your auth actions
import { getUserData, setUserInitData } from "../app/slices/authSlice";

export default function ProtectedRoutes({ children }) {
  const { user, loading, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check for token in cookies
    const token = Cookies.get("accessToken"); // Using the correct token key from your auth slice

    if (token && !user) {
     
      setCheckingAuth(false);
    } else {
      setCheckingAuth(false);
    }
  }, [dispatch, user]);

  if (loading || checkingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const token = Cookies.get("accessToken");
  if (!isAuthenticated && !token) {
    console.log("No user in Redux and no valid token in cookies");
    toast.error("يرجى تسجيل الدخول اولاً");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Route checks
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isSupplierRoute = location.pathname.startsWith("/supplier");


  if (user) {
   
    if (isAdminRoute && user.role !== "Admin") {
      toast.error("غير مصرح لك بالوصول إلى هذه الصفحة");
      return <Navigate to="/forbidden" state={{ from: location }} replace />;
    }

    if (isSupplierRoute && user.role !== "Supplier") {
      toast.error("غير مصرح لك بالوصول إلى هذه الصفحة");
      return <Navigate to="/forbidden" state={{ from: location }} replace />;
    }
  } else if (token) {

    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return children;
}
