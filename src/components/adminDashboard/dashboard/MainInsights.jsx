import { FaUsers, FaTruck, FaShoppingCart, FaBoxOpen } from "react-icons/fa";
import MainInsightsCard from "./MainInsightsCard";

export default function MainInsights({ data }) {
  const { totalUsersCount, totalSuppliersCount, ordersCount, productsCount } =
    data || {
      ordersCount: 0,
      productsCount: 0,
      totalSuppliersCount: 0,
      totalUsersCount: 0,
   
    };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      <MainInsightsCard
        data={totalUsersCount}
        icon={<FaUsers />}
        title="إجمالي المستخدمين"
      />
      <MainInsightsCard
        data={totalSuppliersCount}
        icon={<FaTruck />}
        title="إجمالي الموردين"
      />
      <MainInsightsCard
        data={ordersCount}
        icon={<FaShoppingCart />}
        title="إجمالي الطلبات"
      />
      <MainInsightsCard
        data={productsCount}
        icon={<FaBoxOpen />}
        title="إجمالي المنتجات"
      />
    </div>
  );
}
