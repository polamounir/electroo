import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function  ProtectedRoutes  ({ children }) {
  const user = useSelector((state) => state.user);
  const location = useLocation();

  const isAdmin = user && user.role === "admin"; 

  if (!isAdmin) {
    // redirect
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
