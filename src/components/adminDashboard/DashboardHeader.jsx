import { IoIosMenu, IoIosNotificationsOutline } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { setSupplierSideMenu } from "../../app/slices/dashboardSlice";
export default function DashboardHeader() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { supplierSideMenu } = useSelector((state) => state.dashboard);
  const toggleSideMenu = () => {
    dispatch(setSupplierSideMenu(!supplierSideMenu));
  };
  return (
    <div className="w-full bg-red-30 flex items-center justify-between gap-5 pt-10">
      <div className="">
        <div className="lg:hidden">
          <button onClick={toggleSideMenu}>
            <IoIosMenu className="text-3xl" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-5">
        <div>
          <button>
            <IoIosNotificationsOutline />
          </button>
        </div>
        <div>{user ? <h2>{user.fullName}</h2> : <h2>اسم المستخدم</h2>}</div>
      </div>
    </div>
  );
}
