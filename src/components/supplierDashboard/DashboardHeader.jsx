import { IoIosNotificationsOutline } from "react-icons/io";
import { useSelector } from "react-redux";
export default function DashboardHeader() {
  const { user } = useSelector((state) => state.auth);
  // console.log(user);
  return (
    <div className="w-full bg-red-30 flex items-center justify-end gap-5 py-10">
      <div>
        <button>
          <IoIosNotificationsOutline />
        </button>
      </div>
      <div>{user ? <h2>{user.fullName}</h2> : <h2>اسم المستخدم</h2>}</div>
    </div>
  );
}
