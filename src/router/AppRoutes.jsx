import { Toaster } from "sonner";
import { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Loader from "../components/ui/Loader";

import AppInit from "../components/ui/AppInit";

// Layouts
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import SupplierLayout from "../layouts/SupplierLayout";

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
// ------------------------------------
import AdminOverview from "../components/adminDashboard/dashboard/MainOverview";
import AdminProductsOverview from "../components/adminDashboard/products/ProductsOverview";
import AdminProductsLayout from "../components/adminDashboard/products/ProductsLayout";
import AdminAddNewProduct from "../components/adminDashboard/products/AddNewProduct";
import AdminEditProduct from "../components/adminDashboard/products/EditProduct";
import AdminEditProductImages from "../components/adminDashboard/products/EditProductImages";
import AdminUsersOverview from "../components/adminDashboard/users/UsersOverview";
import AdminUsersLayout from "../components/adminDashboard/users/UsersLayout";
// import AdminAddNewUser from "../components/adminDashboard/users/AddNewUser";
import AdminChatLayout from "../components/adminDashboard/chats/SupplierChatLayout";
import AdminAllChats from "../components/adminDashboard/chats/SupplierAllChats";
import AdminChat from "../components/adminDashboard/chats/SupplierChat";
// ------------------------------------
import SupplierOverview from "../components/supplierDashboard/dashboard/MainOverview";
import SupplierProductsOverview from "../components/supplierDashboard/products/ProductsOverview";
import SupplierProductsLayout from "../components/supplierDashboard/products/ProductsLayout";
import SupplierAddNewProduct from "../components/supplierDashboard/products/AddNewProduct";
import SupplierEditProduct from "../components/supplierDashboard/products/EditProduct";
import SupplierEditProductImages from "../components/supplierDashboard/products/EditProductImages";
import SupplierChatLayout from "../components/supplierDashboard/chats/SupplierChatLayout";
import SupplierAllChats from "../components/supplierDashboard/chats/SupplierAllChats";
import SupplierChat from "../components/supplierDashboard/chats/SupplierChat";
// ------------------------------------
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Profile from "../pages/Profile";
import PageNotFound from "../pages/PageNotFound";
import Contactus from "../pages/Contactus";
import LiveChat from "../pages/LiveChat";
import Product from "../pages/Product";
import Search from "../pages/Search";
import PreRegister from "../pages/PreRegister";
import FAQ from "../pages/FAQ";
import SupplierLogin from "../pages/SupplierLogin";
import ProductConversation from "../pages/ProductConversation";
import LiveChats from "../pages/LiveChats";
import Category from "../pages/Category";
// import AdminDashboard from "../pages/AdminDashboard";
import ProtectedRoutes from "./ProtectedRoutes";
import Forbidden from "../pages/Forbidden";
import ChatPopup from "../components/ui/ChatPopup";
import { useSelector } from "react-redux";
import Test from "../pages/Test";
import AllProducts from "../pages/AllProducts";
import Discounts from "../pages/Discounts";
// import Sales from "../pages/Sales";
import AdminAddNewUser from "../components/adminDashboard/users/AdminAddNewUser";
import ResetUserPassword from "../pages/ResetUserPassword";
import AdminOrdersOverview from "../components/adminDashboard/orders/AdminOrdersOverview";
import AdminOrderDetails from "../components/adminDashboard/orders/AdminOrderDetails";
import AdminOrdersLayout from "../components/adminDashboard/orders/AdminOrdersLayout";
import CheckoutSuccess from "../pages/CheckoutSuccess";
import AdminSuppliersOverview from "../components/adminDashboard/suppliers/AdminSuppliersOverview";
import AdminSuppliersLayout from "../components/adminDashboard/suppliers/AdminSuppliersLayout";
import AdminSupplierReview from "../components/adminDashboard/suppliers/AdminSupplierReview";
import Logout from "../components/ui/Logout";
import SetPassword from "../pages/SetPassword";
import SupplierOrdersLayout from "../components/supplierDashboard/orders/SupplierOrdersLayout";
import SupplierOrdersOverview from "../components/supplierDashboard/orders/SupplierOrdersOverview";
import SupplierOrderDetails from "../components/supplierDashboard/orders/SupplierOrderDetails";
import PromoLayout from "../components/adminDashboard/promo/PromoLayout";
import PromoOverview from "../components/adminDashboard/promo/PromoOverview";
import AdminAddNewPromo from "../components/adminDashboard/promo/AdminAddNewPromo";
import AdminEditPromo from "../components/adminDashboard/promo/AdminEditPromo";
import ChatBodyTest from "../components/supplierDashboard/chats/ChatBodyTest";
import CategoriesLayout from "../components/adminDashboard/categories/CategoriesLayout";
import CategoriesTable from "../components/adminDashboard/categories/CategoriesTable";
import CategoriesOverview from "../components/adminDashboard/categories/CategoriesOverview";
import AddNewCategories from "../components/adminDashboard/categories/AddNewCategories";
import EditCategory from "../components/adminDashboard/categories/EditCategory";
import Categories from "../pages/Categories";
import About from "../pages/About";
import Redirecting from "../pages/Redirecting";
import SpinningWheel from "../pages/SpinningWheel";
import SpinningWheelModel from "../components/home/SpinningWheelModel";
import WishlistPage from "../pages/WishlistPage";
import SupplierProducts from "../pages/SupplierProducts";
import SpinWheelLayout from "../components/adminDashboard/spinWheel/SpinWheelLayout";
import SpinWheel from "../components/adminDashboard/spinWheel/SpinWheel";
import SearchPage from "../pages/SearchPage";
// Lazy-loaded
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const AccountConfirmation = lazy(() => import("../pages/AccountConfirmation"));

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
};

const AppRoutes = () => {
  const { isChatPopupOpen } = useSelector((state) => state.userChatsMenu);
  const { isSpinModelOpen } = useSelector((state) => state.chat);

  return (
    <Router>
      <AppInit />
      {isChatPopupOpen && <ChatPopup />}
      <SpinningWheelModel isOpended={isSpinModelOpen} />

      <Toaster
        position="top-left"
        richColors={true}
        closeButton={true}
        visibleToasts={2}
      />
      {/* <ChatPopup /> */}
      <Suspense fallback={<Loader />}>
        <ScrollToTop />
        <Routes>
          {/* Main App Layout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login-supplier" element={<SupplierLogin />} />
            <Route path="/redirect-user" element={<Redirecting />} />

            <Route path="/profile" element={<Profile />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pre-register" element={<PreRegister />} />
            <Route path="/info-supplier" element={<Suppliers />} />
            <Route path="/confirm-account" element={<AccountConfirmation />} />
            <Route path="/reset-password" element={<ResetUserPassword />} />
            <Route path="/set-password" element={<SetPassword />} />

            <Route path="/logout" element={<Logout />} />

            <Route path="/contact" element={<Contactus />} />
            <Route path="/live-chat" element={<LiveChats />} />
            <Route path="/live-chat/:id" element={<LiveChat />} />
            <Route path="/chat" element={<ProductConversation />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/about" element={<About />} />

            {/* products */}
            <Route path="/all-products" element={<AllProducts />} />
            <Route path="/discounts" element={<Discounts />} />
            {/* <Route path="/sales" element={<Sales />} /> */}
            <Route path="/product/:id" element={<Product />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:id" element={<Category />} />
            <Route
              path="/supplier-products/:id"
              element={<SupplierProducts />}
            />
            <Route path="/search" element={<Search />} />
            <Route path="/wishlist" element={<WishlistPage />} />

            {/* Order */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout-success" element={<CheckoutSuccess />} />

            {/* TEsting */}
            <Route path="/test" element={<Test />} />
            <Route path="/searching" element={<SearchPage />} />
            {/* <Route path="/upload" element={<Upload />} /> */}
            <Route path="/spinning-wheel" element={<SpinningWheel />} />

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
            <Route path="/forbidden" element={<Forbidden />} />
            <Route path="/*" element={<PageNotFound />} />
          </Route>

          {/* Admin Layout  */}
          <Route
            path="/admin"
            element={
              <ProtectedRoutes>
                <AdminLayout />
              </ProtectedRoutes>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="products" element={<AdminProductsLayout />}>
              <Route index element={<AdminProductsOverview />} />
              <Route path="add" element={<AdminAddNewProduct />} />
              <Route path="edit/:id" element={<AdminEditProduct />} />
              <Route
                path="edit-images/:id"
                element={<AdminEditProductImages />}
              />
            </Route>
            <Route path="orders" element={<AdminOrdersLayout />}>
              <Route index element={<AdminOrdersOverview />} />
              <Route path=":id" element={<AdminOrderDetails />} />
            </Route>
            <Route path="users" element={<AdminUsersLayout />}>
              <Route index element={<AdminUsersOverview />} />
              <Route path="add" element={<AdminAddNewUser />} />
            </Route>
            <Route path="suppliers" element={<AdminSuppliersLayout />}>
              <Route index element={<AdminSuppliersOverview />} />
              <Route path=":id" element={<AdminSupplierReview />} />
            </Route>
            <Route path="chats" element={<AdminChatLayout />}>
              <Route index element={<AdminAllChats />} />
              <Route path=":id" element={<AdminChat />} />
            </Route>
            <Route path="promos" element={<PromoLayout />}>
              <Route index element={<PromoOverview />} />
              <Route path="add" element={<AdminAddNewPromo />} />
              <Route path="edit/:id" element={<AdminEditPromo />} />
            </Route>
            <Route path="categories" element={<CategoriesLayout />}>
              <Route index element={<CategoriesOverview />} />
              <Route path="add" element={<AddNewCategories />} />
              <Route path="edit/:id" element={<EditCategory />} />
            </Route>
            <Route path="spin-wheel" element={<SpinWheelLayout />}>
              <Route index element={<SpinWheel />} />
            </Route>
            <Route path="sales" element={<div>Sales</div>} />
            <Route path="settings" element={<div>Settings</div>} />
          </Route>
          {/* supplier Layout  */}
          <Route
            path="/supplier"
            element={
              <ProtectedRoutes>
                <SupplierLayout />
              </ProtectedRoutes>
            }
          >
            <Route index element={<SupplierOverview />} />
            <Route path="products" element={<SupplierProductsLayout />}>
              <Route index element={<SupplierProductsOverview />} />
              <Route path="add" element={<SupplierAddNewProduct />} />
              <Route path="edit/:id" element={<SupplierEditProduct />} />
              <Route
                path="edit-images/:id"
                element={<SupplierEditProductImages />}
              />
            </Route>
            <Route path="orders" element={<SupplierOrdersLayout />}>
              <Route index element={<SupplierOrdersOverview />} />
              <Route path=":id" element={<SupplierOrderDetails />} />
            </Route>

            <Route path="chats" element={<SupplierChatLayout />}>
              <Route index element={<SupplierAllChats />} />
              <Route path=":id" element={<SupplierChat />} />
            </Route>
            <Route path="sales" element={<div>Sales</div>} />
            <Route path="settings" element={<div>Settings</div>} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
