import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navbar from "../components/ui/Navbar";
import Loader from "../components/ui/Loader";
import { Toaster } from "sonner";
const AccountConfirmation = lazy(() => import("../pages/AccountConfirmation"));
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const AppRoutes = () => {
  // const dispatch = useDispatch();
  // const handleCloseMenu = () => {
  //     dispatch(closeAllMenus());
  // }
  return (
    <Router>
      <Navbar />
      <Toaster position="top-left" richColors={true} />
      <div className="w-full md:w-[85%] mx-auto">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/confirm-account" element={<AccountConfirmation />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
};

export default AppRoutes;
