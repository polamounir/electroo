import { IoIosNotificationsOutline } from "react-icons/io";
export default function DashboardHeader() {
  return (
    <div className="w-full bg-red-30 flex items-center justify-end gap-5">
      <div>
        <button>
          <IoIosNotificationsOutline />
        </button>
      </div>
      <div>
        <h2>اسم المستخدم</h2>
      </div>
    </div>
  );
}
