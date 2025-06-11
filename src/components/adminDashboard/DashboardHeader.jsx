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
    <div className="w-full bg-slate-50  fixed z-10 top-0 end-0 flex justify-center items-center py-5 px-5 md:px-10 lg:px-15">
      <div className="flex items-center justify-between gap-5 w-full ">
        <div className="">
          <div className="lg:hidden">
            <button onClick={toggleSideMenu}>
              <IoIosMenu className="text-3xl" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="relative group">

            <div>
              <button
                className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="Notifications"
              >
                <IoIosNotificationsOutline className="w-5 h-5" />
              </button>
            </div>
            
            <div className="absolute z-[200] top-7 end-0 mt-1 w-64 md:w-xs bg-white shadow-lg rounded-md overflow-hidden hidden group-hover:block scrolling">
              <div className="p-2 border-b border-gray-200 bg-teal-700">
                <h3 className="font-semibold text-white">الاشعارات</h3>
              </div>
              <ul className="max-h-60 overflow-y-auto divide-y divide-gray-100">
           
                <li className="p-3 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-start gap-2 ">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                        <svg
                          className="h-5 w-5 text-amber-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          رسالة جديدة
                        </p>
                        <span className="text-xs text-gray-400">
                          منذ دقيقتين
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        تم إرسال رسالة من أحمد محمد
                      </p>
                      <div className="mt-2 flex space-x-2 space-x-reverse">
                        <button className="text-xs bg-amber-50 text-amber-600 px-2 py-1 rounded hover:bg-amber-100">
                          عرض التفاصيل
                        </button>
                        <button className="text-xs bg-gray-50 text-gray-500 px-2 py-1 rounded hover:bg-gray-100">
                          تجاهل
                        </button>
                      </div>
                    </div>
                  </div>
                </li>

           
                <li className="p-3 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg
                          className="h-5 w-5 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          طلب تواصل
                        </p>
                        <span className="text-xs text-gray-400">منذ ساعة</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        لديك ٣ طلبات تواصل جديدة
                      </p>
                    </div>
                  </div>
                </li>
              </ul>

              <div className="p-2 bg-gray-50 text-center">
                <button className="text-sm text-teal-600 hover:text-teal-800">
                  عرض كل الاشعارات
                </button>
              </div>
            </div>
          </div>
          <div>{user ? <h2>{user.fullName}</h2> : <h2>اسم المستخدم</h2>}</div>
        </div>
      </div>
    </div>
  );
}
