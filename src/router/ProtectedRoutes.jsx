import { useSelector, useDispatch } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
// Import your auth actions - adjust the path as needed
// import { setUser } from "../redux/slices/authSlice";

export default function ProtectedRoutes({ children }) {
  const { user, loading } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check for token in cookies
    const token = Cookies.get("authToken"); // Adjust cookie name as needed

    if (token && !user) {
      console.log("Found token in cookies, but no user in Redux");


      const validateToken = async () => {
        try {
      
          const response = await fetch("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
     
            console.log("User data fetched and set in Redux", userData);
          } else {
         
            Cookies.remove("authToken");
            console.log("Invalid token in cookies");
          }
        } catch (error) {
          console.error("Error validating token:", error);
          Cookies.remove("authToken");
        } finally {
          setCheckingAuth(false);
        }
      };

      validateToken();
    } else {
      setCheckingAuth(false);
    }
  }, [dispatch, user]);

  // Show nothing while checking authentication
  if (loading || checkingAuth) {
    return null; // Or a loading spinner
  }

  // Token validation complete, but still no user - not authenticated
  const token = Cookies.get("authToken");
  if (!user && !token) {
    console.log("No user in Redux and no valid token in cookies");
    toast.error("يرجى تسجيل الدخول اولاً");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Route checks
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isSupplierRoute = location.pathname.startsWith("/supplier");

  // Check if we have user data to validate roles
  if (user) {
    // Role-based access control
    if (isAdminRoute && user.role !== "Admin") {
      return <Navigate to="/forbidden" state={{ from: location }} replace />;
    }

    if (isSupplierRoute && user.role !== "Supplier") {
      return <Navigate to="/forbidden" state={{ from: location }} replace />;
    }
  } else if (token) {
    // We have a token but no user data yet
    return null; // Show loading while waiting for user data
  }

  // If all checks pass, render the children
  return children;
}
