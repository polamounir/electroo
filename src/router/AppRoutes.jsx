import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Loader from "../components/ui/Loader";

import AppInit from "../components/ui/AppInit";

// Layouts
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

// Pages & Components
import SupplierRegisteration from "../pages/SupplierRegisteration";
import Suppliers from "../pages/Suppliers";
import BasicData from "../components/supplier-register/SupplierBasicData";
import BusinessData from "../components/supplier-register/SupplierBusinessData";
import SupplierNationalIdBack from "../components/supplier-register/SupplierNationalIdBack";
import SupplierTexCard from "../components/supplier-register/SupplierTexCard";
import SupplierNationalIdFront from "../components/supplier-register/SupplierNationalIdFront";
import SupplierDataSummary from "../components/supplier-register/SupplierDataSummary";
import Upload from "../pages/Upload";
import AdminDashboard from "../pages/AdminDashboard";
import { Toaster } from "sonner";
import MainOverview from "../components/adminDashboard/dashboard/MainOverview";
import ProductsOverview from "../components/adminDashboard/products/ProductsOverview";
import Cart from "../pages/Cart";
import ProductsLayout from "../components/adminDashboard/products/ProductsLayout";
import AddNewProduct from "../components/adminDashboard/products/AddNewProduct";
import ProtectedRoutes from "./ProtectedRoutes";
import Checkout from "../pages/Checkout";
import Profile from "../pages/Profile";
import PageNotFound from "../pages/PageNotFound";
import Contactus from "../pages/Contactus";
import LiveChat from "../pages/LiveChat";
import Product from "../pages/Product";

// Lazy-loaded
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const AccountConfirmation = lazy(() => import("../pages/AccountConfirmation"));

const AppRoutes = () => {
  return (
    <Router>
      <AppInit />
      <Toaster
        position="top-left"
        richColors={true}
        closeButton={true}
        visibleToasts={2}
      />
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Main App Layout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/supplier" element={<Suppliers />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/confirm-account" element={<AccountConfirmation />} />
            <Route path="/contact" element={<Contactus />} />
            <Route path="/live-chat" element={<LiveChat />} />
            <Route path="/product/:id" element={<Product />} />

            <Route
              path="/supplier-register"
              element={<SupplierRegisteration />}
            >
              <Route index element={<BasicData />} />
              <Route path="base" element={<BasicData />} />
              <Route path="business" element={<BusinessData />} />
              <Route path="nidf" element={<SupplierNationalIdFront />} />
              <Route path="nidb" element={<SupplierNationalIdBack />} />
              <Route path="texcard" element={<SupplierTexCard />} />
              <Route
                path="supplier-summary"
                element={<SupplierDataSummary />}
              />
            </Route>
            <Route path="/*" element={<PageNotFound />} />
          </Route>
          {/* Admin Layout  */}
          {/* 
           <Route
            path="/dashboard"
            element={
              <ProtectedRoutes>
                <AdminLayout />
              </ProtectedRoutes>
            }
          > */}
          <Route path="/dashboard" element={<AdminLayout />}>
            <Route index element={<MainOverview />} />
            <Route path="products" element={<ProductsLayout />}>
              <Route path="" element={<ProductsOverview />} />
              <Route path="add" element={<AddNewProduct />} />
            </Route>
            <Route path="orders" element={<div>Orders</div>} />
            <Route path="users" element={<div>Users</div>} />
            <Route path="sales" element={<div>Sales</div>} />
            <Route path="settings" element={<div>Settings</div>} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
