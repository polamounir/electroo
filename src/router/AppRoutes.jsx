import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navbar from "../components/ui/Navbar";
import Loader from "../components/ui/Loader";
import { Toaster } from "sonner";
import AppInit from "../components/ui/AppInit";
import Footer from "../components/ui/Footer";
import SupplierRegisteration from "../pages/SupplierRegisteration";
import Suppliers from "../pages/Suppliers";
import BasicData from "../components/supplier-register/SupplierBasicData";
import BusinessData from "../components/supplier-register/SupplierBusinessData";
import SupplierNationalId from "../components/supplier-register/SupplierNationalId";
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
      <AppInit />
      <Navbar />
      <Toaster position="top-left" richColors={true} />

      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/supplier" element={<Suppliers />} />
          <Route path="/supplier-register" element={<SupplierRegisteration />}>
            <Route index element={<BasicData />} />
            <Route path="base" element={<BasicData />} />
            <Route path="business" element={<BusinessData />} />
            <Route path="national-data" element={<SupplierNationalId />} />
          </Route>
          <Route path="/confirm-account" element={<AccountConfirmation />} />
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
};

export default AppRoutes;
