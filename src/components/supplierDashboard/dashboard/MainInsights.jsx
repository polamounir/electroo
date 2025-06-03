import { useSelector } from "react-redux";
import MainInsightsCard from "./MainInsightsCard";
import { MdAccountBalanceWallet } from "react-icons/md";
import { BsCashCoin } from "react-icons/bs";
import { MdAttachMoney } from "react-icons/md";

import { CiBoxes } from "react-icons/ci";
import { BsBox2 } from "react-icons/bs";

export default function MainInsights() {
  const { itemsSoldCount, balance, ordersCount } = useSelector(
    (state) => state.supplier.loggedInSupplier
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      <MainInsightsCard
        title="  الرصيد الحساب"
        value={`${balance} ج م`}
        icon={MdAttachMoney}
        iconBgColor="bg-slate-100"
      />
      <MainInsightsCard
        title="عدد المبيعات"
        value={`${itemsSoldCount} منتج`}
        icon={CiBoxes}
        iconBgColor="bg-teal-100"
      />
      <MainInsightsCard
        title="عدد الطلبات"
        value={`${ordersCount} طلب`}
        icon={BsBox2}
        iconBgColor="bg-sky-100"
      />
    </div>
  );
}
